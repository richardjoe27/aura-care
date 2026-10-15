/**
 * AuraCare Web Bluetooth API Service
 * Enables direct browser connection to real Smartwatches & BLE Heart Rate Monitors
 * Supports standard Bluetooth SIG GATT Heart Rate Service (0x180D) & Battery Service (0x180F)
 * Compatible with Apple Watch (via BLE HR broadcast), Polar, Garmin, Whoop, Suunto, Wahoo, Amazfit, etc.
 */

export interface RealWatchTelemetry {
  heartRate: number;
  contactDetected?: boolean;
  energyExpended?: number;
  rrIntervals?: number[];
  batteryLevel?: number;
  deviceName: string;
  deviceId: string;
  timestamp: string;
}

export interface BluetoothConnectionOptions {
  onHeartRateUpdate?: (telemetry: RealWatchTelemetry) => void;
  onBatteryUpdate?: (level: number) => void;
  onDisconnected?: (deviceName: string) => void;
  onError?: (error: Error) => void;
}

// Global active device reference to manage disconnection cleanly
let activeBluetoothDevice: any = null;
let activeHeartRateCharacteristic: any = null;
let activeBatteryCharacteristic: any = null;

/**
 * Checks if the Web Bluetooth API is supported by the current browser environment.
 */
export function isWebBluetoothSupported(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return "bluetooth" in navigator;
}

/**
 * Parses the standard Bluetooth SIG Heart Rate Measurement Characteristic (UUID 0x2A37).
 * Spec: https://www.bluetooth.com/specifications/specs/heart-rate-service-1-0/
 */
export function parseHeartRateDataView(dataView: DataView): {
  heartRate: number;
  contactDetected?: boolean;
  energyExpended?: number;
  rrIntervals?: number[];
} {
  const flags = dataView.getUint8(0);
  // Bit 0: 0 = 8-bit BPM, 1 = 16-bit BPM
  const rate16Bits = (flags & 0x01) !== 0;
  // Bit 1 & 2: Sensor Contact Status
  const contactSupported = (flags & 0x04) !== 0;
  const contactDetected = contactSupported ? (flags & 0x02) !== 0 : undefined;
  // Bit 3: Energy Expended Present
  const energyPresent = (flags & 0x08) !== 0;
  // Bit 4: RR-Intervals Present
  const rrPresent = (flags & 0x10) !== 0;

  let offset = 1;
  let heartRate = 0;

  if (rate16Bits) {
    heartRate = dataView.getUint16(offset, /*littleEndian=*/ true);
    offset += 2;
  } else {
    heartRate = dataView.getUint8(offset);
    offset += 1;
  }

  let energyExpended: number | undefined;
  if (energyPresent) {
    energyExpended = dataView.getUint16(offset, /*littleEndian=*/ true);
    offset += 2;
  }

  const rrIntervals: number[] = [];
  if (rrPresent) {
    while (offset + 1 < dataView.byteLength) {
      const rr = dataView.getUint16(offset, /*littleEndian=*/ true);
      // RR intervals are in 1/1024 seconds units
      rrIntervals.push(Math.round((rr / 1024) * 1000));
      offset += 2;
    }
  }

  return {
    heartRate,
    contactDetected,
    energyExpended,
    rrIntervals,
  };
}

/**
 * Initiates the browser Bluetooth Device picker and pairs with a real Smartwatch / BLE pulse sensor.
 * Uses standard Heart Rate Service (0x180D) and Battery Service (0x180F).
 */
export async function connectRealBluetoothWatch(
  options: BluetoothConnectionOptions = {}
): Promise<{
  deviceName: string;
  deviceId: string;
  disconnect: () => void;
}> {
  if (!isWebBluetoothSupported()) {
    throw new Error(
      "Web Bluetooth is not supported in this browser. Please use Google Chrome, Microsoft Edge, Opera, or Samsung Internet on Windows, Mac, Android, or ChromeOS."
    );
  }

  // If a device is already connected, disconnect it first
  if (activeBluetoothDevice && activeBluetoothDevice.gatt?.connected) {
    try {
      activeBluetoothDevice.gatt.disconnect();
    } catch {
      // ignore
    }
  }

  let device: any = null;

  try {
    // Attempt 1: Filter specifically for BLE Heart Rate standard service
    device = await (navigator as any).bluetooth.requestDevice({
      filters: [{ services: ["heart_rate"] }],
      optionalServices: ["battery_service", "device_information"],
    });
  } catch (err: any) {
    // If the device filter didn't match (some fitness bands do not advertise the service in primary packet)
    // or user cancelled, let's offer acceptAllDevices if not explicitly cancelled
    if (err.name === "NotFoundError" && err.message?.includes("User cancelled")) {
      throw new Error("Bluetooth pairing cancelled by user.");
    }

    try {
      device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "heart_rate",
          "battery_service",
          "device_information",
          0x180d,
          0x180f,
          0x180a,
        ],
      });
    } catch (fallbackErr: any) {
      if (fallbackErr.name === "NotFoundError") {
        throw new Error("Bluetooth pairing cancelled or no compatible device selected.");
      }
      throw fallbackErr;
    }
  }

  if (!device) {
    throw new Error("No Bluetooth device selected.");
  }

  activeBluetoothDevice = device;
  const deviceName = device.name || "Real Smartwatch (BLE)";
  const deviceId = device.id;

  // Handle device disconnection event
  device.addEventListener("gattserverdisconnected", () => {
    if (options.onDisconnected) {
      options.onDisconnected(deviceName);
    }
    activeBluetoothDevice = null;
    activeHeartRateCharacteristic = null;
    activeBatteryCharacteristic = null;
  });

  // Connect to GATT Server
  const server = await device.gatt.connect();

  let batteryLevel: number | undefined = undefined;

  // Attempt to read Battery Service
  try {
    const batteryService = await server.getPrimaryService("battery_service");
    const batteryChar = await batteryService.getCharacteristic("battery_level");
    activeBatteryCharacteristic = batteryChar;
    const batteryData = await batteryChar.readValue();
    batteryLevel = batteryData.getUint8(0);
    if (options.onBatteryUpdate && batteryLevel !== undefined) {
      options.onBatteryUpdate(batteryLevel);
    }

    // Subscribe to battery changes if supported
    try {
      await batteryChar.startNotifications();
      batteryChar.addEventListener("characteristicvaluechanged", (e: any) => {
        const val = e.target.value.getUint8(0);
        if (options.onBatteryUpdate) {
          options.onBatteryUpdate(val);
        }
      });
    } catch {
      // Notification for battery not supported, that's fine
    }
  } catch {
    // Battery service optional
  }

  // Connect to Heart Rate Service
  try {
    const hrService = await server.getPrimaryService("heart_rate");
    const hrChar = await hrService.getCharacteristic("heart_rate_measurement");
    activeHeartRateCharacteristic = hrChar;

    await hrChar.startNotifications();

    hrChar.addEventListener("characteristicvaluechanged", (event: any) => {
      const dataView: DataView = event.target.value;
      const parsed = parseHeartRateDataView(dataView);

      if (options.onHeartRateUpdate) {
        options.onHeartRateUpdate({
          heartRate: parsed.heartRate,
          contactDetected: parsed.contactDetected,
          energyExpended: parsed.energyExpended,
          rrIntervals: parsed.rrIntervals,
          batteryLevel,
          deviceName,
          deviceId,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    });
  } catch (hrError: any) {
    // If device doesn't have heart rate service, notify user
    throw new Error(
      `Connected to ${deviceName}, but could not find the standard Heart Rate Service (0x180D). Ensure your watch is broadcasting heart rate.`
    );
  }

  return {
    deviceName,
    deviceId,
    disconnect: () => {
      disconnectRealBluetoothWatch();
    },
  };
}

/**
 * Disconnects the currently active Bluetooth watch if connected.
 */
export function disconnectRealBluetoothWatch(): void {
  if (activeBluetoothDevice && activeBluetoothDevice.gatt?.connected) {
    try {
      activeBluetoothDevice.gatt.disconnect();
    } catch {
      // ignore
    }
  }
  activeBluetoothDevice = null;
  activeHeartRateCharacteristic = null;
  activeBatteryCharacteristic = null;
}

/**
 * Checks if a real Bluetooth device is currently connected.
 */
export function isRealWatchConnected(): boolean {
  return Boolean(activeBluetoothDevice && activeBluetoothDevice.gatt?.connected);
}
