"use client";

import React, { useState, useEffect } from "react";
import { Heart, Activity, Zap, ShieldCheck } from "lucide-react";

interface Heart3DVisualProps {
  bpm?: number;
  interactive?: boolean;
  className?: string;
  isOptimal?: boolean;
}

export const Heart3DVisual: React.FC<Heart3DVisualProps> = ({
  bpm = 72,
  interactive = true,
  className = "",
  isOptimal = true,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * -30;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* Background Volumetric Glow */}
      <div className="absolute w-64 h-64 rounded-full bg-rose-500/15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-48 h-48 rounded-full bg-[#2DD4BF]/20 blur-2xl pointer-events-none" />

      {/* 3D Tilted Container */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `rotateX(${mousePos.y * 0.7}deg) rotateY(${mousePos.x * 0.7}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Orbiting Cardiac Axis Ring 1 */}
        <div
          className="absolute inset-0 rounded-full border border-rose-500/30 animate-aura-spin pointer-events-none"
          style={{ transform: "rotateX(60deg)" }}
        />
        {/* Orbiting Axis Ring 2 */}
        <div
          className="absolute inset-4 rounded-full border border-[#2DD4BF]/40 animate-aura-spin-reverse pointer-events-none"
          style={{ transform: "rotateY(60deg)" }}
        />

        {/* Outer Holographic Glass Sphere */}
        <div
          className="relative w-48 h-48 rounded-full aura-glass border-2 border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.35),inset_0_0_30px_rgba(45,212,191,0.25)] flex flex-col items-center justify-center overflow-hidden animate-pulse"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Specular Highlight */}
          <div className="absolute top-3 left-6 w-16 h-8 bg-white/20 rounded-full blur-xs rotate-[-25deg]" />

          {/* Core Anatomical Heart Icon with Layered Depth */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/15 border border-rose-500/40 backdrop-blur-md shadow-xl shadow-rose-500/30">
              <Heart className="h-12 w-12 text-rose-500 fill-rose-500 animate-pulse-heart filter drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            </div>

            <div className="mt-2 flex items-baseline gap-1 text-center font-mono">
              <span className="text-2xl font-black text-[#FAF8F2]">{bpm}</span>
              <span className="text-[10px] font-bold text-[#9AAEAA]">BPM</span>
            </div>

            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
              {isOptimal ? "Normal Sinus Rhythm" : "Monitoring Active"}
            </span>
          </div>

          {/* Internal Wireframe Wave Lines */}
          <svg
            className="absolute bottom-2 inset-x-0 w-full h-8 stroke-[#2DD4BF] opacity-50"
            fill="none"
            viewBox="0 0 100 20"
          >
            <path
              className="animate-ecg"
              strokeWidth="1.5"
              d="M0,10 L30,10 L35,2 L40,18 L45,5 L50,10 L70,10 L75,2 L80,18 L85,5 L90,10 L100,10"
            />
          </svg>
        </div>

        {/* Floating Mini 3D Badge 1: Blood Pressure */}
        <div
          className="absolute -top-2 -right-4 aura-glass rounded-xl px-2.5 py-1.5 border border-[#2DD4BF]/30 shadow-lg text-[10px] font-mono text-[#8AF5D0] font-bold"
          style={{ transform: "translateZ(40px)" }}
        >
          BP 118/76 mmHg
        </div>

        {/* Floating Mini 3D Badge 2: SpO2 */}
        <div
          className="absolute -bottom-2 -left-4 aura-glass rounded-xl px-2.5 py-1.5 border border-sky-500/30 shadow-lg text-[10px] font-mono text-sky-400 font-bold"
          style={{ transform: "translateZ(40px)" }}
        >
          SpO2 99% Optimal
        </div>
      </div>
    </div>
  );
};
