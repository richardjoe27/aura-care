"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Activity,
  Radio,
  Battery,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Zap,
  RotateCw,
  Bluetooth,
  Eye,
  CheckCircle2,
} from "lucide-react";

interface Watch3DVisualProps {
  heartRate?: number;
  isConnected?: boolean;
  deviceName?: string;
  isRealDevice?: boolean;
  batteryLevel?: number;
  incomingSms?: { title: string; message: string; timestamp: string; isCritical?: boolean } | null;
  onDismissSms?: () => void;
  interactive?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Watch3DVisual: React.FC<Watch3DVisualProps> = ({
  heartRate = 72,
  isConnected = false,
  deviceName = "Apple Watch Ultra 2",
  isRealDevice = false,
  batteryLevel = 92,
  incomingSms = null,
  onDismissSms,
  interactive = true,
  className = "",
  size = "md",
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeScreen, setActiveScreen] = useState<"ecg" | "rings" | "vitals">("ecg");
  const [crownRotation, setCrownRotation] = useState(0);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 26;
      const y = (e.clientY / innerHeight - 0.5) * -26;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  const sizeClasses = {
    sm: "w-[240px] h-[300px]",
    md: "w-[290px] h-[360px]",
    lg: "w-[350px] h-[430px]",
  }[size];

  const handleCrownClick = () => {
    setCrownRotation((prev) => prev + 45);
    setActiveScreen((prev) => {
      if (prev === "ecg") return "rings";
      if (prev === "rings") return "vitals";
      return "ecg";
    });
  };

  // Pulse animation speed based on heart rate
  const beatDuration = Math.max(0.4, Math.min(1.5, 60 / (heartRate || 72)));

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ perspective: "1400px" }}
    >
      {/* Volumetric Ambient Glow & Radial Lighting */}
      <div
        className="absolute -inset-8 rounded-full bg-radial from-[#2DD4BF]/25 via-[#0B2523]/35 to-transparent blur-3xl pointer-events-none transition-all duration-700"
        style={{
          transform: isConnected ? "scale(1.15)" : "scale(0.9)",
          opacity: isConnected ? 0.9 : 0.4,
        }}
      />

      {/* 3D Tilted Watch Container */}
      <div
        className={`relative ${sizeClasses} transition-transform duration-500 ease-out flex items-center justify-center`}
        style={{
          transform: `rotateX(${mousePos.y * 0.75 + (isFlipped ? 180 : 0)}deg) rotateY(${
            mousePos.x * 0.75 + (isFlipped ? 180 : 0)
          }deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Watch Strap (Top & Bottom Metallic Braided Silicone) */}
        <div
          className="absolute -top-14 w-32 h-24 rounded-t-3xl bg-gradient-to-b from-[#061413] via-[#0b2422] to-[#123835] border-t-2 border-x-2 border-[#2DD4BF]/35 shadow-2xl flex flex-col justify-end items-center pb-2"
          style={{ transform: "translateZ(-22px) rotateX(16deg)" }}
        >
          {/* Strap Ridges */}
          <div className="w-16 h-1 rounded-full bg-[#2DD4BF]/25 mb-1.5" />
          <div className="w-16 h-1 rounded-full bg-[#2DD4BF]/15" />
        </div>

        <div
          className="absolute -bottom-14 w-32 h-24 rounded-b-3xl bg-gradient-to-t from-[#061413] via-[#0b2422] to-[#123835] border-b-2 border-x-2 border-[#2DD4BF]/35 shadow-2xl flex flex-col justify-start items-center pt-2"
          style={{ transform: "translateZ(-22px) rotateX(-16deg)" }}
        >
          <div className="w-16 h-1 rounded-full bg-[#2DD4BF]/15 mb-1.5" />
          <div className="w-16 h-1 rounded-full bg-[#2DD4BF]/25" />
        </div>

        {/* Watch Chassis (Titanium Casing) */}
        <div
          className="relative w-full h-full rounded-[48px] bg-gradient-to-br from-[#1b3d39] via-[#0d2624] to-[#040f0e] border-[3px] border-[#2DD4BF]/45 shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_2px_12px_rgba(45,212,191,0.35)] p-4 flex flex-col justify-between overflow-hidden"
          style={{
            transform: "translateZ(12px)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Side Digital Crown (Interactive) */}
          <button
            onClick={handleCrownClick}
            title="Click Crown to switch Watch screen"
            className="absolute -right-4 top-16 w-4 h-16 rounded-r-xl bg-gradient-to-r from-[#2DD4BF]/70 via-[#8AF5D0] to-[#2DD4BF] border-y-2 border-r-2 border-[#8AF5D0] shadow-lg shadow-[#2DD4BF]/40 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            style={{
              transform: `translateZ(18px) rotate(${crownRotation}deg)`,
              transformOrigin: "left center",
            }}
          >
            {/* Knurled Grip Texture on Crown */}
            <div className="w-full h-full flex flex-col justify-around py-1.5 px-0.5 opacity-60">
              <div className="h-[2px] bg-[#071514]" />
              <div className="h-[2px] bg-[#071514]" />
              <div className="h-[2px] bg-[#071514]" />
              <div className="h-[2px] bg-[#071514]" />
              <div className="h-[2px] bg-[#071514]" />
            </div>
          </button>

          {/* Side Action Button */}
          <div
            className="absolute -right-2.5 top-36 w-2.5 h-12 rounded-r-md bg-[#0B2523] border border-[#2DD4BF]/50 shadow-inner"
            style={{ transform: "translateZ(16px)" }}
          />

          {/* Left Microphone / Barometer Port */}
          <div
            className="absolute -left-2 top-24 w-1.5 h-8 rounded-l-md bg-[#040f0e] border border-[#2DD4BF]/30 flex flex-col justify-around py-1 px-0.5"
            style={{ transform: "translateZ(16px)" }}
          >
            <div className="w-1 h-1 rounded-full bg-[#2DD4BF]/40" />
            <div className="w-1 h-1 rounded-full bg-[#2DD4BF]/40" />
          </div>

          {/* ========================================================
              FRONT FACE: AMOLED DISPLAY
             ======================================================== */}
          {!isFlipped ? (
            <div className="relative w-full h-full rounded-[36px] bg-gradient-to-br from-[#010706] via-[#041211] to-[#010504] border border-[#2DD4BF]/30 shadow-[inset_0_0_30px_rgba(0,0,0,0.95)] p-4 flex flex-col justify-between overflow-hidden">
              {/* Glass Glare Reflection */}
              <div className="absolute -top-12 -left-12 w-44 h-32 bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-[8px] rounded-full rotate-[-35deg] pointer-events-none" />

              {/* Status Bar */}
              <div className="flex items-center justify-between text-[11px] text-[#A8C8B8] z-10 font-mono">
                <span className="font-bold text-[#8AF5D0] flex items-center gap-1">
                  09:41
                  {isRealDevice && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 text-[10px] ${
                      isConnected ? "text-[#8AF5D0]" : "text-amber-400"
                    }`}
                  >
                    <Bluetooth className="h-3 w-3" />
                    {isConnected ? (isRealDevice ? "REAL BLE" : "BLE 5.3") : "DISC"}
                  </span>
                  <span className="flex items-center gap-0.5 text-emerald-400 text-[10px]">
                    <Battery className="h-3 w-3" />
                    {batteryLevel}%
                  </span>
                </div>
              </div>

              {/* Central Display: Switches via Crown Click */}
              <div className="relative flex-1 flex flex-col items-center justify-center z-10 my-1">
                {/* Incoming SMS Notification Overlay */}
                {incomingSms ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDismissSms) onDismissSms();
                    }}
                    title="Tap to dismiss alert on watch"
                    className="w-full rounded-2xl bg-rose-500/25 border border-rose-500/50 p-2.5 text-center animate-pulse cursor-pointer hover:bg-rose-500/35 transition group shadow-lg shadow-rose-500/20"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-rose-300 text-xs font-bold mb-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                      <span className="truncate">{incomingSms.title}</span>
                    </div>
                    <p className="text-[10px] text-[#FAF8F2] leading-tight font-medium line-clamp-3">
                      {incomingSms.message}
                    </p>
                    <div className="mt-1 flex items-center justify-center gap-2">
                      <span className="text-[9px] text-rose-300 font-mono">
                        Haptic · {incomingSms.timestamp}
                      </span>
                      <span className="text-[9px] text-[#8AF5D0] opacity-80 group-hover:opacity-100 font-semibold underline">
                        Tap to Clear
                      </span>
                    </div>
                  </div>
                ) : activeScreen === "ecg" ? (
                  /* SCREEN 1: REAL-TIME ECG & LIVE BPM */
                  <div className="w-full flex flex-col items-center justify-center text-center">
                    {/* Pulsing Heart Center */}
                    <div className="relative flex items-center justify-center my-1">
                      <div
                        className="absolute h-14 w-14 rounded-full bg-rose-500/20 blur-md pointer-events-none"
                        style={{
                          animation: `aura-heartbeat ${beatDuration}s infinite ease-in-out`,
                        }}
                      />
                      <Heart
                        className="h-8 w-8 text-rose-500 fill-rose-500 relative z-10 filter drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                        style={{
                          animation: `aura-heartbeat ${beatDuration}s infinite ease-in-out`,
                        }}
                      />
                    </div>

                    <div className="flex items-baseline justify-center gap-1 font-mono">
                      <span className="text-3xl font-black text-[#FAF8F2] tracking-tight">
                        {heartRate}
                      </span>
                      <span className="text-[11px] font-bold text-rose-400">BPM</span>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border mt-1 ${
                        isRealDevice
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                          : "bg-[#2DD4BF]/20 border-[#2DD4BF]/40 text-[#8AF5D0]"
                      }`}
                    >
                      {isRealDevice
                        ? "Real Optical Sensor Active"
                        : isConnected
                        ? "Continuous Sinus Rhythm"
                        : "Sensor Standby"}
                    </span>

                    {/* ECG Dynamic Waveform SVG */}
                    <div className="w-full h-8 mt-2 overflow-hidden flex items-center">
                      <svg
                        className="w-full h-full stroke-emerald-400"
                        fill="none"
                        viewBox="0 0 160 30"
                      >
                        <path
                          className="animate-ecg"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M0,15 L25,15 L32,15 L36,4 L42,26 L48,10 L54,18 L58,15 L85,15 L92,15 L96,4 L102,26 L108,10 L114,18 L118,15 L160,15"
                        />
                      </svg>
                    </div>
                  </div>
                ) : activeScreen === "rings" ? (
                  /* SCREEN 2: BIOMETRIC ACTIVITY RINGS */
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      {/* Outer Ring: Cardio Move */}
                      <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#182C2A"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#F43F5E"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="264"
                          strokeDashoffset="60"
                          strokeLinecap="round"
                        />
                        {/* Middle Ring: Exercise */}
                        <circle
                          cx="50"
                          cy="50"
                          r="31"
                          stroke="#182C2A"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="31"
                          stroke="#2DD4BF"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="195"
                          strokeDashoffset="40"
                          strokeLinecap="round"
                        />
                        {/* Inner Ring: Stand */}
                        <circle
                          cx="50"
                          cy="50"
                          r="20"
                          stroke="#182C2A"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="20"
                          stroke="#8AF5D0"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="125"
                          strokeDashoffset="15"
                          strokeLinecap="round"
                        />
                      </svg>
                      <Zap className="h-5 w-5 text-amber-300 absolute" />
                    </div>
                    <p className="text-[10px] text-[#A8C8B8] font-bold mt-1">Daily Biosync Goals</p>
                    <span className="text-[9px] text-[#8AF5D0] font-mono">9,240 / 10,000 Steps</span>
                  </div>
                ) : (
                  /* SCREEN 3: CLINICAL VITALS HUD */
                  <div className="w-full space-y-1.5 text-left px-2">
                    <div className="flex justify-between items-center bg-[#071514] p-1.5 rounded-lg border border-[#2DD4BF]/20">
                      <span className="text-[9px] text-[#9AAEAA]">Resting BPM</span>
                      <span className="text-xs font-mono font-bold text-rose-400">
                        {heartRate} bpm
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-[#071514] p-1.5 rounded-lg border border-[#2DD4BF]/20">
                      <span className="text-[9px] text-[#9AAEAA]">Blood Oxygen</span>
                      <span className="text-xs font-mono font-bold text-sky-400">99% SpO2</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#071514] p-1.5 rounded-lg border border-[#2DD4BF]/20">
                      <span className="text-[9px] text-[#9AAEAA]">HRV (SDNN)</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">62 ms</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Nav / Device Name */}
              <div className="flex items-center justify-between text-[9px] text-[#9AAEAA] z-10 pt-1 border-t border-[#2DD4BF]/15">
                <span className="truncate max-w-[140px] font-semibold text-[#FAF8F2]">
                  {deviceName}
                </span>
                <span className="font-mono text-[#8AF5D0] text-[8px]">
                  {isRealDevice ? "REAL DEVICE" : "SIMULATED"}
                </span>
              </div>
            </div>
          ) : (
            /* ========================================================
               BACK FACE: TITANIUM CASEBACK & QUAD-LED PPG OPTICAL SENSOR
               ======================================================== */
            <div
              className="relative w-full h-full rounded-[36px] bg-gradient-to-br from-[#0c2422] via-[#051413] to-[#020a09] border border-[#2DD4BF]/40 p-4 flex flex-col justify-between items-center text-center overflow-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
              {/* Laser Engraving Header */}
              <div className="w-full text-center space-y-0.5">
                <p className="text-[9px] font-bold tracking-widest text-[#8AF5D0] uppercase">
                  AuraCare Biosense 5.3
                </p>
                <p className="text-[8px] text-[#9AAEAA] font-mono">
                  TITANIUM & CERAMIC CASE • SAPPHIRE CRYSTAL
                </p>
              </div>

              {/* Central Quad-LED PPG Sensor Matrix */}
              <div className="relative flex items-center justify-center my-auto">
                {/* Ceramic Sensor Ring */}
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#020a09] to-[#071d1b] border-2 border-[#2DD4BF]/50 shadow-[0_0_30px_rgba(45,212,191,0.25)] flex items-center justify-center p-3">
                  {/* Concentric Charging Ring */}
                  <div className="absolute inset-2 rounded-full border border-[#8AF5D0]/30" />

                  {/* Pulsating Emerald Green Photoplethysmography (PPG) LEDs */}
                  <div className="relative grid grid-cols-2 gap-3 z-10">
                    {[0, 1, 2, 3].map((led) => (
                      <div
                        key={led}
                        className="relative flex items-center justify-center h-5 w-5 rounded-full bg-[#00ff88]/30 border border-[#00ff88]"
                      >
                        <div
                          className="h-3 w-3 rounded-full bg-[#00ff88] shadow-[0_0_15px_#00ff88]"
                          style={{
                            animation: isConnected
                              ? `aura-heartbeat ${beatDuration}s infinite ease-in-out`
                              : "none",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Central Photodiode Light Receiver */}
                  <div className="absolute h-4 w-4 rounded-full bg-black border border-white/20" />
                </div>
              </div>

              {/* Sensor Spec Footer */}
              <div className="w-full text-center space-y-0.5">
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[8px] font-bold text-emerald-300 border border-emerald-500/30">
                  {isConnected ? "530nm Green Optical Telemetry Active" : "Sensor Inactive"}
                </span>
                <p className="text-[8px] text-[#9AAEAA] font-mono mt-1">
                  Continuous PPG • Electrical ECG • SpO2 Photodiode
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Controls Bar Below Watch */}
      <div className="mt-4 flex items-center gap-2 z-20">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1.5 rounded-xl bg-[#0B2523] border border-[#2DD4BF]/30 px-3 py-1.5 text-[11px] font-bold text-[#8AF5D0] hover:bg-[#2DD4BF]/20 transition shadow-md"
        >
          <RotateCw className="h-3 w-3" />
          <span>{isFlipped ? "View Front Face" : "Flip to 3D PPG Sensor"}</span>
        </button>

        {!isFlipped && (
          <button
            onClick={handleCrownClick}
            className="flex items-center gap-1.5 rounded-xl bg-[#071514] border border-[#2DD4BF]/20 px-3 py-1.5 text-[11px] font-semibold text-[#A8C8B8] hover:text-[#FAF8F2] transition"
          >
            <Eye className="h-3 w-3 text-[#2DD4BF]" />
            <span>Cycle Screen: {activeScreen.toUpperCase()}</span>
          </button>
        )}
      </div>
    </div>
  );
};
