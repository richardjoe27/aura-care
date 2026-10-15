"use client";

import React, { useState, useEffect } from "react";
import { Heart, Activity, ShieldCheck, Sparkles, Video, Clock } from "lucide-react";

interface AuraOrbVisualProps {
  interactive?: boolean;
  className?: string;
  showCards?: boolean;
}

export const AuraOrbVisual: React.FC<AuraOrbVisualProps> = ({
  interactive = true,
  className = "",
  showCards = true,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // -10 to +10 deg
      const y = (e.clientY / innerHeight - 0.5) * -20; // -10 to +10 deg
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        perspective: "1000px",
      }}
    >
      {/* Volumetric Ambient Glow Backdrops */}
      <div className="absolute -inset-10 bg-radial from-[#2DD4BF]/20 via-[#0B2523]/40 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-[#8AF5D0]/15 blur-2xl pointer-events-none animate-pulse" />

      {/* Main 3D Tilted Container */}
      <div
        className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] transition-transform duration-500 ease-out"
        style={{
          transform: `rotateX(${mousePos.y * 0.7}deg) rotateY(${mousePos.x * 0.7}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Orbiting Ring 1 (Horizontal Inclined) */}
        <div className="absolute inset-[-15%] pointer-events-none animate-aura-spin">
          <svg className="w-full h-full opacity-60" viewBox="0 0 400 400">
            <ellipse
              cx="200"
              cy="200"
              rx="180"
              ry="75"
              fill="none"
              stroke="url(#ringGrad1)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              transform="rotate(-25 200 200)"
            />
            <circle cx="340" cy="140" r="3.5" fill="#8AF5D0" className="animate-ping" />
            <circle cx="340" cy="140" r="3" fill="#8AF5D0" />
            <defs>
              <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8AF5D0" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0B2523" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Orbiting Ring 2 (Vertical Inclined) */}
        <div className="absolute inset-[-10%] pointer-events-none animate-aura-spin-reverse">
          <svg className="w-full h-full opacity-50" viewBox="0 0 400 400">
            <ellipse
              cx="200"
              cy="200"
              rx="75"
              ry="175"
              fill="none"
              stroke="url(#ringGrad2)"
              strokeWidth="1.2"
              transform="rotate(35 200 200)"
            />
            <circle cx="200" cy="30" r="4" fill="#2DD4BF" />
            <defs>
              <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8AF5D0" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#2DD4BF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#071514" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Glass Orb Shell — Outer Refractive Layer */}
        <div className="absolute inset-6 rounded-full border border-[#8AF5D0]/30 shadow-[inset_0_0_50px_rgba(45,212,191,0.35),0_0_60px_rgba(45,212,191,0.25)] backdrop-blur-md bg-gradient-to-tr from-[#071514]/90 via-[#0B2523]/60 to-[#2DD4BF]/20 animate-aura-pulse">
          {/* Internal Specular Highlight */}
          <div className="absolute top-4 left-8 w-24 h-14 rounded-full bg-gradient-to-b from-white/40 to-transparent blur-sm rotate-[-30deg]" />

          {/* Deep Plasma Core */}
          <div className="absolute inset-10 rounded-full bg-gradient-to-br from-[#2DD4BF]/40 via-[#0B2523] to-[#071514] shadow-[inset_0_0_40px_rgba(138,245,208,0.5)] flex items-center justify-center overflow-hidden">
            {/* Luminous Core Pulse */}
            <div className="w-28 h-28 rounded-full bg-radial from-[#8AF5D0]/80 via-[#2DD4BF]/40 to-transparent blur-md animate-pulse" />

            {/* Central Bio-Aura Core Symbol */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-black/40 border border-[#2DD4BF]/40 backdrop-blur-md shadow-lg shadow-[#2DD4BF]/20">
                <Activity className="h-7 w-7 text-[#8AF5D0] animate-pulse-heart" />
              </div>
              <span className="mt-2 text-[10px] font-extrabold uppercase tracking-widest text-[#8AF5D0] font-heading drop-shadow">
                Aura Infinity
              </span>
            </div>

            {/* Subtle Internal Waveform Ring */}
            <svg
              className="absolute inset-0 w-full h-full opacity-30 animate-spin"
              style={{ animationDuration: "40s" }}
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="70"
                stroke="#8AF5D0"
                strokeWidth="1"
                strokeDasharray="6 12"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Floating UI Card 1: Top Right - Next Appointment */}
        {showCards && (
          <div
            className="absolute -top-4 -right-6 sm:-right-10 aura-glass rounded-2xl p-3.5 border border-[#2DD4BF]/25 shadow-xl backdrop-blur-xl animate-aura-float"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30">
                <Video className="h-4 w-4 text-[#8AF5D0]" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8AF5D0] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2DD4BF]"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#FAF8F2]">Dr. Sarah Jenkins</span>
                  <span className="rounded-full bg-[#2DD4BF]/15 px-1.5 py-0.2 text-[9px] font-semibold text-[#8AF5D0]">
                    Cardio
                  </span>
                </div>
                <p className="text-[10px] text-[#9AAEAA] flex items-center gap-1 mt-0.5">
                  <Clock className="h-2.5 w-2.5 text-[#2DD4BF]" /> Today • 03:30 PM (Telehealth)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Floating UI Card 2: Bottom Left - Biometrics */}
        {showCards && (
          <div
            className="absolute -bottom-6 -left-6 sm:-left-12 aura-glass rounded-2xl p-3.5 border border-[#8AF5D0]/25 shadow-xl backdrop-blur-xl animate-aura-float-delayed"
            style={{ transform: "translateZ(50px)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30">
                <Heart className="h-5 w-5 text-rose-400 animate-pulse-heart" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-[#FAF8F2] font-mono">72</span>
                  <span className="text-[10px] font-bold text-[#9AAEAA]">BPM</span>
                  <span className="ml-1 rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                    Optimal
                  </span>
                </div>
                <p className="text-[10px] text-[#A8C8B8]">Continuous PPG Telemetry</p>
              </div>
            </div>
          </div>
        )}

        {/* Floating UI Card 3: Bottom Right - Clinical Encryption */}
        {showCards && (
          <div
            className="hidden sm:flex absolute bottom-8 -right-8 aura-glass rounded-xl px-3 py-2 border border-[#2DD4BF]/20 shadow-lg backdrop-blur-xl items-center gap-2"
            style={{ transform: "translateZ(30px)" }}
          >
            <ShieldCheck className="h-4 w-4 text-[#8AF5D0]" />
            <span className="text-[10px] font-semibold text-[#FAF8F2] tracking-wide">
              256-Bit Encrypted OS
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
