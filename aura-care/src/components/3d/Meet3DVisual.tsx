"use client";

import React, { useState, useEffect } from "react";
import { Video, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";

interface Meet3DVisualProps {
  interactive?: boolean;
  className?: string;
  meetLink?: string;
}

export const Meet3DVisual: React.FC<Meet3DVisualProps> = ({
  interactive = true,
  className = "",
  meetLink = "https://meet.google.com/new",
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
      <div className="absolute w-52 h-52 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

      {/* 3D Tilted Meet Terminal */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `rotateX(${mousePos.y * 0.7}deg) rotateY(${mousePos.x * 0.7}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Core Broadcast Glass Terminal */}
        <div
          className="relative w-48 h-48 rounded-3xl aura-glass border-2 border-indigo-500/40 shadow-[0_0_40px_rgba(99,102,241,0.3)] flex flex-col items-center justify-center overflow-hidden p-4 text-center"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Google Meet & Video Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-[#2DD4BF] text-[#071514] font-black shadow-lg shadow-indigo-500/25">
            <Video className="h-7 w-7 text-[#071514]" />
          </div>

          <h4 className="mt-2 text-xs font-bold text-[#FAF8F2] font-heading">
            Google Meet Portal
          </h4>
          <p className="text-[10px] text-indigo-300 font-mono mt-0.5">
            Direct Doctor ↔ Patient Link
          </p>

          <a
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-500 to-[#2DD4BF] px-3 py-1.5 text-[11px] font-black text-[#071514] hover:scale-105 transition shadow-sm"
          >
            <span>Open Google Meet</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Orbiting Satellite Rings */}
        <div
          className="absolute inset-0 rounded-full border border-indigo-500/30 animate-aura-spin pointer-events-none"
          style={{ transform: "rotateX(70deg)" }}
        />

        {/* Floating Mini 3D Badge */}
        <div
          className="absolute -top-3 right-0 aura-glass rounded-xl px-2.5 py-1 border border-indigo-500/30 text-[10px] text-indigo-300 font-bold shadow-md"
          style={{ transform: "translateZ(35px)" }}
        >
          HD Video & Spatial Audio
        </div>
      </div>
    </div>
  );
};
