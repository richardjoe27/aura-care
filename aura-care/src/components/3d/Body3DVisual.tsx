"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Activity,
  Zap,
  ShieldCheck,
  Brain,
  Droplet,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface Body3DVisualProps {
  currentBpm?: number;
  className?: string;
  interactive?: boolean;
  onScanComplete?: (scanResult: { systemName: string; metric: string; sub: string }) => void;
}

export const Body3DVisual: React.FC<Body3DVisualProps> = ({
  currentBpm = 72,
  className = "",
  interactive = true,
  onScanComplete,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSystem, setActiveSystem] = useState<
    "cardio" | "pulmo" | "neuro" | "meta" | "hydration"
  >("cardio");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 22;
      const y = (e.clientY / innerHeight - 0.5) * -22;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  const systems = [
    {
      id: "cardio",
      label: "Cardiovascular",
      icon: Heart,
      color: "text-rose-400",
      bg: "bg-rose-500/20",
      border: "border-rose-500/40",
      metric: `${currentBpm} BPM`,
      sub: "Sinus Rhythm Optimal",
      yPos: "top-[32%]",
      xPos: "left-[52%]",
    },
    {
      id: "pulmo",
      label: "Pulmonary / SpO2",
      icon: Activity,
      color: "text-sky-400",
      bg: "bg-sky-500/20",
      border: "border-sky-500/40",
      metric: "99% SpO2",
      sub: "14 breaths / min",
      yPos: "top-[36%]",
      xPos: "left-[36%]",
    },
    {
      id: "neuro",
      label: "Neurological & Sleep",
      icon: Brain,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
      border: "border-purple-500/40",
      metric: "7.8 hrs",
      sub: "94% Sleep Quality",
      yPos: "top-[12%]",
      xPos: "left-[46%]",
    },
    {
      id: "meta",
      label: "Metabolic & Glucose",
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-500/20",
      border: "border-amber-500/40",
      metric: "98 mg/dL",
      sub: "Fasting Baseline",
      yPos: "top-[50%]",
      xPos: "left-[46%]",
    },
    {
      id: "hydration",
      label: "Cellular Hydration",
      icon: Droplet,
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/40",
      metric: "2,100 ml",
      sub: "Optimal Electrolytes",
      yPos: "top-[64%]",
      xPos: "left-[46%]",
    },
  ];

  const activeData = systems.find((s) => s.id === activeSystem) || systems[0];

  const handleTriggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          if (onScanComplete) {
            onScanComplete({
              systemName: activeData.label,
              metric: activeData.metric,
              sub: activeData.sub,
            });
          }
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* Background Volumetric Glow */}
      <div className="absolute w-80 h-96 rounded-full bg-[#2DD4BF]/15 blur-3xl pointer-events-none" />

      {/* 3D Tilted Silhouette Stage */}
      <div
        className="relative w-80 h-[460px] sm:w-96 sm:h-[480px] transition-transform duration-500 ease-out flex items-center justify-center"
        style={{
          transform: `rotateX(${mousePos.y * 0.7}deg) rotateY(${mousePos.x * 0.7}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Holographic Concentric Rings (Floor Pedestal) */}
        <div
          className="absolute -bottom-6 w-64 h-24 rounded-full border border-[#2DD4BF]/30 shadow-[0_0_40px_rgba(45,212,191,0.3)] animate-aura-spin-slow pointer-events-none"
          style={{ transform: "rotateX(75deg)" }}
        />
        <div
          className="absolute -bottom-6 w-48 h-18 rounded-full border border-[#8AF5D0]/40 pointer-events-none"
          style={{ transform: "rotateX(75deg)" }}
        />

        {/* 3D Glass Human Silhouette Container */}
        <div
          className="relative w-64 h-[420px] rounded-3xl aura-glass border border-[#2DD4BF]/30 shadow-2xl p-4 flex items-center justify-center overflow-hidden"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Laser Scan Sweep Line */}
          {isScanning && (
            <div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#8AF5D0] to-transparent shadow-[0_0_15px_#2DD4BF] z-30 pointer-events-none transition-all duration-300 ease-linear"
              style={{ top: `${scanProgress}%` }}
            />
          )}

          {/* Wireframe Silhouette SVG */}
          <svg
            className="w-48 h-[380px] opacity-80 filter drop-shadow-[0_0_15px_rgba(45,212,191,0.4)]"
            viewBox="0 0 200 400"
            fill="none"
          >
            {/* Outer Head & Neck */}
            <circle cx="100" cy="50" r="26" stroke="#2DD4BF" strokeWidth="1.5" strokeDasharray="4 2" />
            <path d="M92 76 L92 90 M108 76 L108 90" stroke="#2DD4BF" strokeWidth="1.5" />

            {/* Torso & Shoulders */}
            <path
              d="M60 98 C65 92, 135 92, 140 98 L146 170 C146 200, 136 240, 126 250 L74 250 C64 240, 54 200, 54 170 Z"
              stroke="#8AF5D0"
              strokeWidth="1.5"
              fill="rgba(45, 212, 191, 0.05)"
            />

            {/* Arms */}
            <path
              d="M60 98 L40 180 L35 240 M140 98 L160 180 L165 240"
              stroke="#2DD4BF"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />

            {/* Legs */}
            <path
              d="M78 250 L70 330 L66 385 M122 250 L130 330 L134 385"
              stroke="#2DD4BF"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Internal Circuitry / Meridian Lines */}
            <line x1="100" y1="90" x2="100" y2="250" stroke="#8AF5D0" strokeWidth="1" strokeDasharray="2 4" />
            <circle cx="100" cy="140" r="16" stroke="#F43F5E" strokeWidth="1.5" fill="rgba(244, 63, 94, 0.15)" />
            <circle cx="85" cy="135" r="12" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="100" cy="50" r="10" stroke="#C084FC" strokeWidth="1" strokeDasharray="2 2" />
          </svg>

          {/* Interactive Organ Beacon Buttons */}
          {systems.map((s) => {
            const Icon = s.icon;
            const isSelected = activeSystem === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSystem(s.id as any)}
                className={`absolute ${s.yPos} ${s.xPos} -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-300`}
                style={{
                  transform: isSelected
                    ? "translateZ(35px) scale(1.2)"
                    : "translateZ(15px) scale(1)",
                }}
              >
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-xl border backdrop-blur-md transition-all shadow-lg ${
                    s.bg
                  } ${s.border} ${isSelected ? "ring-2 ring-[#8AF5D0]" : ""}`}
                >
                  <Icon
                    className={`h-4 w-4 ${s.color} ${
                      s.id === "cardio" ? "animate-pulse-heart" : ""
                    }`}
                  />
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8AF5D0] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2DD4BF]"></span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Floating Hologram Telemetry Card for Active System */}
        <div
          className="absolute -right-4 sm:-right-8 top-16 aura-glass rounded-2xl p-4 border border-[#2DD4BF]/40 shadow-2xl w-48 sm:w-56 z-30 transition-all duration-300"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-lg ${activeData.bg} ${activeData.border} border`}
            >
              <activeData.icon className={`h-3.5 w-3.5 ${activeData.color}`} />
            </span>
            <span className="text-xs font-bold text-[#FAF8F2] truncate">{activeData.label}</span>
          </div>
          <p className="text-xl font-black font-mono text-[#8AF5D0]">{activeData.metric}</p>
          <p className="text-[10px] text-[#9AAEAA] mt-0.5">{activeData.sub}</p>
          
          <button
            onClick={handleTriggerScan}
            disabled={isScanning}
            className="w-full mt-3 py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] text-[#071514] font-black text-[10px] flex items-center justify-center gap-1.5 hover:scale-105 transition shadow-md shadow-[#2DD4BF]/20 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3 text-[#071514]" />
            <span>{isScanning ? `Scanning ${scanProgress}%...` : "Run Scan & Auto-Send SMS"}</span>
          </button>

          <div className="mt-2.5 pt-2 border-t border-[#2DD4BF]/15 flex items-center justify-between text-[9px] text-[#A8C8B8]">
            <span>Auto Watch Relay</span>
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* System Tabs Selector Below 3D Canvas */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2 z-20">
        {systems.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSystem(s.id as any)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeSystem === s.id
                ? "bg-[#2DD4BF] text-[#071514] shadow-md shadow-[#2DD4BF]/20"
                : "bg-[#0B2523] text-[#9AAEAA] hover:text-[#FAF8F2] border border-[#2DD4BF]/20"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
