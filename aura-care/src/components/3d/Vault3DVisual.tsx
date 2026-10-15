"use client";

import React, { useState, useEffect } from "react";
import { FileText, ShieldCheck, Lock, Activity, Sparkles } from "lucide-react";

interface Vault3DVisualProps {
  interactive?: boolean;
  className?: string;
}

export const Vault3DVisual: React.FC<Vault3DVisualProps> = ({
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
      <div className="absolute w-52 h-52 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

      {/* 3D Tilted Cube Shell */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `rotateX(${mousePos.y * 0.7}deg) rotateY(${mousePos.x * 0.7}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Core Shield Cube */}
        <div
          className="relative w-44 h-44 rounded-3xl aura-glass border-2 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center overflow-hidden"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/25">
            <Lock className="h-8 w-8 text-emerald-400" />
          </div>

          <span className="mt-2 text-xs font-bold text-[#FAF8F2] font-heading">
            AES-256 Encrypted Vault
          </span>
          <span className="text-[10px] text-[#8AF5D0] font-mono">Certified HL7 FHIR</span>
        </div>

        {/* Floating Biomarker Chips */}
        <div
          className="absolute -top-3 right-2 aura-glass rounded-xl px-2.5 py-1 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono font-bold shadow-md"
          style={{ transform: "translateZ(35px)" }}
        >
          CMP • Normal
        </div>

        <div
          className="absolute -bottom-3 left-2 aura-glass rounded-xl px-2.5 py-1 border border-[#2DD4BF]/30 text-[10px] text-[#8AF5D0] font-mono font-bold shadow-md"
          style={{ transform: "translateZ(35px)" }}
        >
          Lipid Panel • 168 mg/dL
        </div>
      </div>
    </div>
  );
};
