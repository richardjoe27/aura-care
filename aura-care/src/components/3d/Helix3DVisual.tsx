"use client";

import React, { useState, useEffect } from "react";
import { Pill, Sparkles, ShieldCheck } from "lucide-react";

interface Helix3DVisualProps {
  interactive?: boolean;
  className?: string;
}

export const Helix3DVisual: React.FC<Helix3DVisualProps> = ({
  interactive = true,
  className = "",
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * -20;
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
      <div className="absolute w-48 h-48 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

      {/* 3D Tilted Helix Strand */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `rotateX(${mousePos.y * 0.6}deg) rotateY(${mousePos.x * 0.6}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Holographic Pill Core */}
        <div
          className="relative w-44 h-44 rounded-3xl aura-glass border-2 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center overflow-hidden animate-pulse"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/20">
            <Pill className="h-9 w-9 text-amber-400 rotate-[-45deg]" />
          </div>

          <span className="mt-2 text-xs font-bold text-[#FAF8F2] font-heading">
            Pharmacokinetics OS
          </span>
          <span className="text-[10px] text-[#8AF5D0] font-mono font-semibold">
            100% Target Precision
          </span>
        </div>

        {/* Orbiting Molecular Rings */}
        <div
          className="absolute inset-2 rounded-full border border-[#2DD4BF]/30 animate-aura-spin pointer-events-none"
          style={{ transform: "rotateX(75deg)" }}
        />
        <div
          className="absolute inset-6 rounded-full border border-amber-500/30 animate-aura-spin-reverse pointer-events-none"
          style={{ transform: "rotateY(75deg)" }}
        />

        {/* Floating Molecule Nodes */}
        <div
          className="absolute -top-3 left-4 aura-glass rounded-xl px-2.5 py-1 border border-amber-500/30 text-[10px] text-amber-300 font-bold shadow-md"
          style={{ transform: "translateZ(35px)" }}
        >
          Atorvastatin 20mg Active
        </div>

        <div
          className="absolute -bottom-3 right-4 aura-glass rounded-xl px-2.5 py-1 border border-[#2DD4BF]/30 text-[10px] text-[#8AF5D0] font-bold shadow-md"
          style={{ transform: "translateZ(35px)" }}
        >
          CoQ10 • Cellular Synergy
        </div>
      </div>
    </div>
  );
};
