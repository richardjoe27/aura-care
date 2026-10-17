"use client";

import React, { useState, useEffect } from "react";
import {
  Watch,
  X,
  Bluetooth,
  CheckCircle2,
  RefreshCw,
  Heart,
  Activity,
  Zap,
  Battery,
  ShieldCheck,
  Radio,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  Info,
  Smartphone,
  Sliders,
  ChevronDown,
  Search,
} from "lucide-react";
import { Watch3DVisual } from "./3d/Watch3DVisual";
import {
  connectRealBluetoothWatch,
  disconnectRealBluetoothWatch,
  isWebBluetoothSupported,
  isRealWatchConnected,
  RealWatchTelemetry,
} from "../utils/realBluetoothWatch";

interface SmartwatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  connectedDevice: string;
  isRealDevice?: boolean;
  onConnectDevice: (deviceName: string, isReal?: boolean) => void;
  onDisconnectDevice: () => void;
  onSyncVitals: (vitals: { heartRate: number; spo2: number; steps: number }) => void;
  currentHeartRate: number;
  incomingSms?: { title: string; message: string; timestamp: string; isCritical?: boolean } | null;
  onDismissSms?: () => void;
  onOpenSendWatchSms?: () => void;
  onTriggerScanSms?: () => void;
}

export const SmartwatchModal: React.FC<SmartwatchModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  connectedDevice,
  isRealDevice = false,
  onConnectDevice,
  onDisconnectDevice,
  onSyncVitals,
  currentHeartRate,
  incomingSms = null,
  onDismissSms,
  onOpenSendWatchSms,
  onTriggerScanSms,
}) => {
  const [isScanningSensors, setIsScanningSensors] = useState<boolean>(false);
  const [selectedDemoDevice, setSelectedDemoDevice] = useState<string>("Apple Watch Ultra 2");
  const [liveBpm, setLiveBpm] = useState<number>(currentHeartRate || 72);
  const [liveSteps, setLiveSteps] = useState<number>(9140);
  const [liveSpo2, setLiveSpo2] = useState<number>(99);
  const [liveBattery, setLiveBattery] = useState<number>(91);
  const [liveRrInterval, setLiveRrInterval] = useState<number>(830);
  const [sensorContact, setSensorContact] = useState<boolean>(true);
  const [autoSync, setAutoSync] = useState<boolean>(true);

  // Real Web Bluetooth Pairing State
  const [bleScanMode, setBleScanMode] = useState<"standard" | "universal" | null>(null);
  const [bleError, setBleError] = useState<string | null>(null);
  const [isBleSupported, setIsBleSupported] = useState<boolean>(true);
  const [showPairingGuide, setShowPairingGuide] = useState<boolean>(false);

  useEffect(() => {
    setIsBleSupported(isWebBluetoothSupported());
  }, []);

  const demoDevices = [
    {
      id: "apple-watch",
      name: "Apple Watch Ultra 2",
      os: "watchOS 11 (Apple HealthKit BLE)",
      battery: 92,
      status: "Demo Ready",
      icon: "⌚",
    },
    {
      id: "galaxy-watch",
      name: "Samsung Galaxy Watch 7",
      os: "Wear OS 5 (Samsung Health)",
      battery: 86,
      status: "Demo Ready",
      icon: "⌚",
    },
    {
      id: "garmin",
      name: "Garmin Fenix 8 Solar",
      os: "Garmin Connect BLE",
      battery: 96,
      status: "Demo Ready",
      icon: "⌚",
    },
    {
      id: "whoop",
      name: "Whoop 4.0 Biometric Band",
      os: "Whoop BLE Sensor Matrix",
      battery: 79,
      status: "Demo Ready",
      icon: "📿",
    },
  ];

  // If connected via simulated watch, run periodic telemetry update
  useEffect(() => {
    if (!isConnected || isRealDevice) return;

    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 4;
      const nextBpm = Math.round(Math.max(65, Math.min(84, liveBpm + delta)));
      setLiveBpm(nextBpm);
      setLiveSteps((prev) => prev + Math.floor(Math.random() * 2));

      if (autoSync) {
        onSyncVitals({ heartRate: nextBpm, spo2: liveSpo2, steps: liveSteps });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected, isRealDevice, liveBpm, liveSpo2, liveSteps, autoSync, onSyncVitals]);

  // Real Web Bluetooth Connection Handler
  const handleConnectRealWatch = async (scanAll: boolean = false) => {
    setBleError(null);
    setBleScanMode(scanAll ? "universal" : "standard");

    try {
      const { deviceName, hasNativeHeartRate } = await connectRealBluetoothWatch({
        scanAllDevices: scanAll,
        onHeartRateUpdate: (telemetry: RealWatchTelemetry) => {
          setLiveBpm(telemetry.heartRate);
          if (telemetry.rrIntervals && telemetry.rrIntervals.length > 0) {
            setLiveRrInterval(telemetry.rrIntervals[0]);
          }
          if (telemetry.contactDetected !== undefined) {
            setSensorContact(telemetry.contactDetected);
          }
          if (telemetry.batteryLevel !== undefined) {
            setLiveBattery(telemetry.batteryLevel);
          }

          // Sync real telemetry with patient record
          onSyncVitals({
            heartRate: telemetry.heartRate,
            spo2: 99,
            steps: liveSteps,
          });
        },
        onBatteryUpdate: (level: number) => {
          setLiveBattery(level);
        },
        onDisconnected: (name: string) => {
          onDisconnectDevice();
          setBleError(`Device "${name}" was disconnected.`);
        },
        onError: (err: Error) => {
          setBleError(err.message);
        },
      });

      onConnectDevice(deviceName, true);
      setBleScanMode(null);
    } catch (err: any) {
      setBleScanMode(null);
      setBleError(err.message || "Could not pair Bluetooth device.");
    }
  };

  const handleDisconnect = () => {
    if (isRealDevice) {
      disconnectRealBluetoothWatch();
    }
    onDisconnectDevice();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="aura-glass rounded-3xl p-6 sm:p-8 max-w-5xl w-full border border-[#2DD4BF]/30 shadow-2xl relative space-y-6 my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9AAEAA] hover:text-[#FAF8F2] z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#8AF5D0]">
            <Watch className="h-6 w-6" />
            {isConnected && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8AF5D0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2DD4BF]"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-heading text-[#FAF8F2]">
                Smartwatch Telemetry & Web Bluetooth Hub
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${
                  isRealDevice
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-[#2DD4BF]/15 border-[#2DD4BF]/30 text-[#8AF5D0]"
                }`}
              >
                {isRealDevice ? "REAL BLUETOOTH BLE LINK" : "3D WEARABLE VISUAL"}
              </span>
            </div>
            <p className="text-xs text-[#9AAEAA]">
              Connect your physical smartwatch directly in-browser or explore with simulated profiles
            </p>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* LEFT: 3D Interactive Smartwatch */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-[#071514]/90 p-5 border border-[#2DD4BF]/25 relative">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8AF5D0] flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#2DD4BF]" />
                3D Wearable Engine
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isConnected
                    ? isRealDevice
                      ? "text-emerald-300 bg-emerald-500/20 border-emerald-500/40"
                      : "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
                    : "text-amber-300 bg-amber-500/15 border-amber-500/30"
                }`}
              >
                {isConnected
                  ? isRealDevice
                    ? "Live Real Watch Paired"
                    : "Simulated Watch Active"
                  : "Pairing Standby"}
              </span>
            </div>

            <Watch3DVisual
              isConnected={isConnected}
              deviceName={isConnected ? connectedDevice : selectedDemoDevice}
              heartRate={liveBpm}
              batteryLevel={liveBattery}
              isRealDevice={isRealDevice}
              incomingSms={incomingSms}
              onDismissSms={onDismissSms}
              size="md"
            />

            <p className="text-[10px] text-[#9AAEAA] text-center mt-3">
              Rotate in 3D with cursor. Click Digital Crown to cycle displays or click Flip to view
              the Quad-LED green PPG optical sensor.
            </p>
          </div>

          {/* RIGHT: Controls, Real BLE Pairing & Demo Watches */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Telemetry Display (When Connected) */}
            {isConnected ? (
              <div className="rounded-2xl bg-[#071514] p-4 border border-[#2DD4BF]/30 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8AF5D0] flex items-center gap-1.5">
                    <Radio className="h-4 w-4 animate-pulse text-[#2DD4BF]" />
                    Streaming Live from {connectedDevice}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                      isRealDevice
                        ? "bg-emerald-500/25 border-emerald-500/50 text-emerald-300"
                        : "bg-teal-500/15 border-teal-500/30 text-teal-300"
                    }`}
                  >
                    {isRealDevice ? "Web Bluetooth Active" : "BLE 5.3 Simulated"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-xl bg-[#0B2523] p-2.5 border border-[#2DD4BF]/20">
                    <span className="text-[9px] text-[#9AAEAA] uppercase font-bold">Pulse Rate</span>
                    <p className="text-xl font-black font-mono text-rose-400 mt-0.5 flex items-center justify-center gap-1">
                      <Heart className="h-3.5 w-3.5 fill-rose-500 animate-pulse" />
                      {liveBpm}
                    </p>
                    <span className="text-[8px] text-[#A8C8B8]">BPM Live</span>
                  </div>

                  <div className="rounded-xl bg-[#0B2523] p-2.5 border border-[#2DD4BF]/20">
                    <span className="text-[9px] text-[#9AAEAA] uppercase font-bold">
                      {isRealDevice ? "RR-Interval (HRV)" : "Oxygen SpO2"}
                    </span>
                    <p className="text-xl font-black font-mono text-sky-400 mt-0.5">
                      {isRealDevice ? `${liveRrInterval} ms` : `${liveSpo2}%`}
                    </p>
                    <span className="text-[8px] text-[#A8C8B8]">
                      {isRealDevice ? "Cardiac Interval" : "Optimal"}
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#0B2523] p-2.5 border border-[#2DD4BF]/20">
                    <span className="text-[9px] text-[#9AAEAA] uppercase font-bold">Battery</span>
                    <p className="text-xl font-black font-mono text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                      <Battery className="h-3.5 w-3.5" />
                      {liveBattery}%
                    </p>
                    <span className="text-[8px] text-[#A8C8B8]">
                      {isRealDevice ? "BLE Battery Service" : "Full Charge"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#9AAEAA]">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="rounded bg-[#071514] border-[#2DD4BF]/30 text-[#2DD4BF] focus:ring-0"
                    />
                    <span>Stream biometrics to patient dashboard</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Run Sensor Scan & Auto-Send SMS button */}
                    <button
                      onClick={() => {
                        if (isScanningSensors) return;
                        setIsScanningSensors(true);
                        setTimeout(() => {
                          setIsScanningSensors(false);
                          if (onTriggerScanSms) onTriggerScanSms();
                        }, 1200);
                      }}
                      disabled={isScanningSensors}
                      className="text-[11px] font-black text-[#071514] flex items-center gap-1.5 bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-3 py-1.5 rounded-xl shadow-md shadow-[#2DD4BF]/25 hover:scale-105 transition cursor-pointer disabled:opacity-50"
                      title="Takes a live sensor scan and automatically transmits the SMS alert to the watch"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#071514]" />
                      <span>{isScanningSensors ? "Scanning Sensor..." : "Run Scan & Auto-SMS"}</span>
                    </button>

                    {onOpenSendWatchSms && (
                      <button
                        onClick={onOpenSendWatchSms}
                        className="text-[11px] font-bold text-rose-300 hover:text-rose-200 flex items-center gap-1 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1.5 rounded-xl transition"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>Manual SMS Alert</span>
                      </button>
                    )}

                    <button
                      onClick={handleDisconnect}
                      className="text-[11px] text-rose-400 font-bold hover:underline ml-auto"
                    >
                      Disconnect Device
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* SECTION 1: CONNECT REAL PHYSICAL WATCH (BLUETOOTH BLE) */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0B2523] to-[#071816] p-4 sm:p-5 border-2 border-[#2DD4BF]/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2DD4BF] text-[#071514] font-black">
                    <Bluetooth className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#FAF8F2]">
                      Direct Real Watch Connection
                    </h4>
                    <p className="text-[10px] text-[#8AF5D0]">
                      Web Bluetooth Low Energy (BLE GATT 0x180D)
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    isBleSupported
                      ? "text-emerald-300 bg-emerald-500/20 border-emerald-500/40"
                      : "text-amber-400 bg-amber-500/20 border-amber-500/40"
                  }`}
                >
                  {isBleSupported ? "Browser BLE Ready ✓" : "BLE Requires Chrome/Edge"}
                </span>
              </div>

              <p className="text-xs text-[#9AAEAA] leading-relaxed">
                Connect your physical smartwatch or sensor directly in-browser. If your watch does not appear in standard scan, use <strong className="text-[#8AF5D0]">Universal Scan</strong> below to see all nearby Bluetooth devices.
              </p>

              {bleError && (
                <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-2.5 text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">Pairing Note:</p>
                    <p className="text-[11px] mt-0.5">{bleError}</p>
                  </div>
                </div>
              )}

              {/* Dual Scan Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {/* Mode 1: Standard 0x180D Heart Rate Scan */}
                <button
                  onClick={() => handleConnectRealWatch(false)}
                  disabled={Boolean(bleScanMode)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] via-[#8AF5D0] to-[#2DD4BF] px-3.5 py-2.5 text-xs font-black text-[#071514] hover:scale-105 transition shadow-lg shadow-[#2DD4BF]/25 disabled:opacity-50 cursor-pointer"
                  title="Scans specifically for Heart Rate GATT Service (Polar, Garmin Broadcast, Apple Watch HeartCast)"
                >
                  {bleScanMode === "standard" ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-[#071514]" />
                  ) : (
                    <Bluetooth className="h-4 w-4 text-[#071514]" />
                  )}
                  <span>
                    {bleScanMode === "standard"
                      ? "Scanning Heart Rate..."
                      : "Pair Heart Rate (0x180D)"}
                  </span>
                </button>

                {/* Mode 2: Universal BLE Scan (All Devices) */}
                <button
                  onClick={() => handleConnectRealWatch(true)}
                  disabled={Boolean(bleScanMode)}
                  className="flex items-center gap-2 rounded-xl bg-[#0B2523] hover:bg-[#123835] border border-[#2DD4BF]/40 px-3.5 py-2.5 text-xs font-bold text-[#8AF5D0] hover:scale-105 transition shadow-md disabled:opacity-50 cursor-pointer"
                  title="Shows all nearby Bluetooth LE devices without service filtering"
                >
                  {bleScanMode === "universal" ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-[#8AF5D0]" />
                  ) : (
                    <Search className="h-4 w-4 text-[#2DD4BF]" />
                  )}
                  <span>
                    {bleScanMode === "universal"
                      ? "Scanning All Nearby..."
                      : "Universal Scan (All BLE Devices)"}
                  </span>
                </button>

                <button
                  onClick={() => setShowPairingGuide(!showPairingGuide)}
                  className="text-xs text-[#A8C8B8] hover:text-[#8AF5D0] flex items-center gap-1 underline underline-offset-4 cursor-pointer ml-auto"
                >
                  <Info className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  <span>Why isn&apos;t my watch appearing?</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      showPairingGuide ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Collapsible Real Device Pairing Guide */}
              {showPairingGuide && (
                <div className="rounded-xl bg-[#071514] p-3.5 border border-[#2DD4BF]/25 text-[11px] text-[#9AAEAA] space-y-2 mt-2">
                  <p className="font-bold text-[#FAF8F2] flex items-center gap-1.5 text-xs">
                    <Info className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    How to make your watch appear in Chrome:
                  </p>
                  <ul className="space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>
                      <strong className="text-[#8AF5D0]">Option A (Easiest):</strong> Click the <span className="text-white font-semibold">&quot;Universal Scan&quot;</span> button above. It removes service filtering so any nearby Bluetooth watch, band, or device will show in the chooser list.
                    </li>
                    <li>
                      <strong className="text-[#8AF5D0]">Apple Watch:</strong> WatchOS does not broadcast open heart rate by default. Install free <span className="text-white font-semibold">&quot;HeartCast&quot;</span> or <span className="text-white font-semibold">&quot;Echo&quot;</span> on your watch and tap <em>Start Broadcast</em>.
                    </li>
                    <li>
                      <strong className="text-[#8AF5D0]">Garmin Watches:</strong> Go to <em>Settings ➔ Wrist Heart Rate ➔ Broadcast Heart Rate ➔ Start Broadcast</em>.
                    </li>
                    <li>
                      <strong className="text-[#8AF5D0]">Polar & Whoop:</strong> Ensure strap is worn against skin (or Whoop app ➔ Device Settings ➔ toggle <em>Heart Rate Broadcast</em>).
                    </li>
                    <li>
                      <strong className="text-[#8AF5D0]">PC Bluetooth:</strong> Make sure Bluetooth is enabled in Windows Settings (<em>Win + I ➔ Bluetooth & Devices</em>).
                    </li>
                    <li>
                      <strong className="text-[#8AF5D0]">Instant Test:</strong> If you don&apos;t have a watch right now, click <span className="text-emerald-400 font-bold">&quot;Simulate Sync&quot;</span> on any profile below!
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* SECTION 2: DEMO WATCHES PRESERVED */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#A8C8B8]">
                  Or Choose a Simulated Demo Watch Profile
                </span>
                <span className="text-[10px] text-[#9AAEAA]">4 Demo Models Available</span>
              </div>

              <div className="space-y-2">
                {demoDevices.map((dev) => (
                  <div
                    key={dev.id}
                    onClick={() => setSelectedDemoDevice(dev.name)}
                    className={`cursor-pointer rounded-2xl p-3 border transition-all flex items-center justify-between ${
                      selectedDemoDevice === dev.name && !isRealDevice
                        ? "bg-[#0B2523] border-[#2DD4BF] shadow-md shadow-[#2DD4BF]/15"
                        : "bg-[#071514] border-[#2DD4BF]/15 hover:border-[#2DD4BF]/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{dev.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#FAF8F2]">{dev.name}</h4>
                        <p className="text-[10px] text-[#9AAEAA]">{dev.os}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                        <Battery className="h-3 w-3" /> {dev.battery}%
                      </span>

                      {isConnected && connectedDevice === dev.name && !isRealDevice ? (
                        <span className="text-xs text-emerald-400 font-bold">Active ✓</span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDemoDevice(dev.name);
                            onConnectDevice(dev.name, false);
                            onSyncVitals({ heartRate: liveBpm, spo2: liveSpo2, steps: liveSteps });
                          }}
                          className="rounded-xl bg-[#0B2523] hover:bg-[#2DD4BF] hover:text-[#071514] border border-[#2DD4BF]/30 px-3 py-1.5 text-xs font-bold text-[#8AF5D0] transition shadow-sm"
                        >
                          Simulate Sync
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
