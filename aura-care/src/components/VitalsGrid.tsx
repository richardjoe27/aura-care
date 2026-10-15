"use client";

import React, { useState } from "react";
import {
  Heart,
  Activity,
  Droplets,
  TrendingUp,
  Plus,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Watch,
  MessageSquare,
  Radio,
  AlertTriangle,
} from "lucide-react";
import { VitalMetric } from "../types/health";
import { Heart3DVisual } from "./3d/Heart3DVisual";
import { Watch3DVisual } from "./3d/Watch3DVisual";

interface VitalsGridProps {
  vitals: VitalMetric[];
  onOpenLogModal: () => void;
  onWaterAdded: (amount: number) => void;
  waterIntake: number;
  waterGoal: number;
  isWatchConnected?: boolean;
  connectedWatchName?: string;
  isRealWatch?: boolean;
  currentHeartRate?: number;
  onOpenSmartwatch?: () => void;
  onOpenSendWatchSms?: () => void;
  onRunScanSms?: () => void;
}

export const VitalsGrid: React.FC<VitalsGridProps> = ({
  vitals,
  onOpenLogModal,
  onWaterAdded,
  waterIntake,
  waterGoal,
  isWatchConnected = false,
  connectedWatchName = "Apple Watch Ultra 2",
  isRealWatch = false,
  currentHeartRate = 72,
  onOpenSmartwatch,
  onOpenSendWatchSms,
  onRunScanSms,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>("heart-rate");

  const waterPercent = Math.min(100, Math.round((waterIntake / waterGoal) * 100));

  return (
    <div className="space-y-6">
      {/* 1. IF SMARTWATCH NOT CONNECTED: PROMINENT PAIRING & SENSOR PROMPT */}
      {!isWatchConnected ? (
        <div className="aura-glass rounded-3xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30">
                <Radio className="h-3.5 w-3.5 animate-pulse text-amber-400" />
                <span>BIOMETRIC SENSORS OFFLINE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-heading text-[#FAF8F2]">
                Connect Your Smartwatch to Stream Live Biometrics
              </h2>

              <p className="text-xs sm:text-sm text-[#9AAEAA] leading-relaxed">
                AuraCare captures true physiological telemetry directly from your wearable sensors.
                Pair your Apple Watch, Galaxy Watch, Garmin, or Whoop to unlock continuous optical PPG
                pulse, blood pressure estimates, SpO2, and live sinus ECG waveforms.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={onOpenSmartwatch}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-6 py-3 text-xs font-black text-[#071514] shadow-lg shadow-[#2DD4BF]/25 transition hover:scale-105"
                >
                  <Watch className="h-4 w-4" />
                  <span>Connect Watch & Stream Live Data</span>
                </button>

                <button
                  onClick={onOpenLogModal}
                  className="flex items-center gap-2 rounded-2xl aura-glass px-4 py-3 text-xs font-bold text-[#A8C8B8] border border-[#2DD4BF]/20 hover:border-[#2DD4BF] transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Or Enter Manual Vitals</span>
                </button>
              </div>
            </div>

            {/* 3D Smartwatch Awaiting Pair Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <Watch3DVisual
                isConnected={false}
                deviceName={connectedWatchName}
                size="md"
              />
            </div>
          </div>
        </div>
      ) : (
        /* CONNECTED TELEMETRY BANNER WITH 3D CARDIAC HOLOGRAPH */
        <div className="aura-glass rounded-3xl p-6 border border-[#2DD4BF]/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30">
              <Watch className="h-7 w-7 text-[#8AF5D0]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8AF5D0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2DD4BF]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#FAF8F2] font-heading">
                  Streaming Live Telemetry: {connectedWatchName}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                    isRealWatch
                      ? "bg-emerald-500/25 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/40"
                      : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  }`}
                >
                  {isRealWatch ? "Real Web Bluetooth (0x180D) Link Active" : "BLE 5.3 Active"}
                </span>
              </div>
              <p className="text-xs text-[#9AAEAA] mt-0.5">
                {isRealWatch
                  ? "Real physical smartwatch optical sensor streaming live continuous BPM and biometrics directly to clinical dashboard."
                  : "Optical PPG sensor transmitting resting pulse, SpO2, and HRV every 3 seconds."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Run Sensor Scan & Automatically Transmit Watch SMS */}
            {onRunScanSms && (
              <button
                onClick={onRunScanSms}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-4 py-2 text-xs font-black text-[#071514] hover:scale-105 transition shadow-md shadow-[#2DD4BF]/25 cursor-pointer"
                title="Executes a live optical sensor scan and automatically transmits the results as an SMS alert to your watch"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#071514]" />
                <span>Run Scan & Send Watch SMS</span>
              </button>
            )}

            {/* Critical Watch SMS Alert Trigger */}
            <button
              onClick={onOpenSendWatchSms}
              className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500 hover:text-[#071514] transition shadow-md shadow-rose-500/20"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Send Critical SMS Alert</span>
            </button>

            <button
              onClick={onOpenSmartwatch}
              className="flex items-center gap-1.5 rounded-xl bg-[#0B2523] border border-[#2DD4BF]/30 px-3.5 py-2 text-xs font-semibold text-[#8AF5D0] hover:bg-[#2DD4BF]/20 transition"
            >
              <Watch className="h-3.5 w-3.5" />
              <span>Manage Wearable</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Banner: Clinical Summary, 3D Cardiac Model & Hydration */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 3D Heart Visual & Biometric Health Score */}
        <div className="aura-glass rounded-3xl p-6 border border-[#2DD4BF]/20 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8AF5D0]">
              3D Cardiac & Biomarker Hologram
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="h-3.5 w-3.5" /> Optimal 94%
            </span>
          </div>

          <div className="my-2 flex justify-center">
            <Heart3DVisual
              bpm={isWatchConnected ? currentHeartRate : 0}
              isOptimal={isWatchConnected}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-[#A8C8B8] pt-2 border-t border-[#2DD4BF]/10">
            <span>Cardio Endurance: Top 15%</span>
            <span className="font-mono text-[#8AF5D0] font-bold">
              {isWatchConnected ? `${currentHeartRate} BPM Live` : "Awaiting Watch"}
            </span>
          </div>
        </div>

        {/* Live EKG Pulse Line Banner */}
        <div className="aura-glass rounded-3xl p-6 border border-rose-500/25 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-400 animate-pulse-heart" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
                Continuous ECG Monitor
              </span>
            </div>
            <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
              {isWatchConnected ? "Live Sinus Rhythm" : "Standby"}
            </span>
          </div>

          <div className="my-4 relative h-20 w-full flex items-center overflow-hidden rounded-2xl bg-[#071514] border border-rose-500/20 px-2">
            {isWatchConnected ? (
              <svg
                className="w-full h-14 stroke-rose-400"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 300 50"
                preserveAspectRatio="none"
              >
                <path
                  className="animate-ecg"
                  d="M0,25 L30,25 L35,10 L40,38 L45,15 L50,25 L80,25 L85,25 L90,10 L95,42 L100,12 L105,25 L150,25 L155,10 L160,38 L165,15 L170,25 L210,25 L215,8 L220,44 L225,12 L230,25 L300,25"
                />
              </svg>
            ) : (
              <div className="w-full text-center text-xs text-[#9AAEAA]">
                Connect smartwatch to stream ECG waveform
              </div>
            )}
            <div className="absolute right-3 top-2 flex items-center gap-1 text-[10px] font-mono text-rose-300 font-bold">
              <span>PR: 142ms</span>
              <span>•</span>
              <span>QRS: 88ms</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#A8C8B8]">
            <span>ST-Segment: Baseline</span>
            <span className="font-mono text-[#FAF8F2] font-bold">HRV: 68 ms</span>
          </div>
        </div>

        {/* Hydration & Cellular Perfusion Tracker */}
        <div className="aura-glass rounded-3xl p-6 border border-sky-500/25 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-sky-400" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400">
                Cellular Hydration
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-sky-300">
              {(waterIntake / 1000).toFixed(2)} L / {(waterGoal / 1000).toFixed(1)} L
            </span>
          </div>

          <div className="my-3">
            <div className="flex justify-between text-xs mb-1.5 font-semibold text-[#A8C8B8]">
              <span>Hydration Goal ({waterPercent}%)</span>
              <span>
                {waterGoal - waterIntake > 0
                  ? `${waterGoal - waterIntake} ml remaining`
                  : "Goal Achieved ✓"}
              </span>
            </div>
            <div className="w-full bg-[#071514] h-3 rounded-full overflow-hidden border border-sky-500/20">
              <div
                className="bg-gradient-to-r from-sky-500 to-[#2DD4BF] h-full rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onWaterAdded(250)}
              className="flex-1 rounded-xl bg-[#071514] border border-sky-500/30 py-2 text-xs font-bold text-sky-300 hover:bg-sky-500/15 transition"
            >
              +250 ml Glass
            </button>
            <button
              onClick={() => onWaterAdded(500)}
              className="flex-1 rounded-xl bg-sky-500/20 border border-sky-500/40 py-2 text-xs font-bold text-sky-200 hover:bg-sky-500/30 transition"
            >
              +500 ml Bottle
            </button>
          </div>
        </div>
      </div>

      {/* Grid of All Clinical Vital Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vitals.map((metric) => {
          const isSelected = selectedMetric === metric.id;
          const displayValue = isWatchConnected
            ? metric.id === "heart-rate"
              ? currentHeartRate.toString()
              : metric.value
            : "--";
          const displayStatus = isWatchConnected
            ? metric.statusText
            : "Awaiting Wearable";

          return (
            <div
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`cursor-pointer aura-glass-interactive rounded-3xl p-5 border transition-all ${
                isSelected
                  ? "border-[#2DD4BF] bg-[#0B2523]/90 shadow-xl shadow-[#2DD4BF]/15"
                  : "border-[#2DD4BF]/15 hover:border-[#2DD4BF]/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#A8C8B8]">{metric.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                    isWatchConnected
                      ? "bg-[#2DD4BF]/15 text-[#8AF5D0] border-[#2DD4BF]/30"
                      : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {displayStatus}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-[#FAF8F2] tracking-tight">
                  {displayValue}
                </span>
                <span className="text-xs font-bold text-[#9AAEAA]">{metric.unit}</span>
              </div>

              {/* Sparkline Graph */}
              <div className="mt-4 h-12 w-full flex items-end">
                {isWatchConnected ? (
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                    <polyline
                      fill="none"
                      stroke={metric.color || "#2DD4BF"}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={metric.history
                        .map((val, idx) => {
                          const min = Math.min(...metric.history);
                          const max = Math.max(...metric.history);
                          const range = max - min || 1;
                          const y = 25 - ((val - min) / range) * 20;
                          const x = (idx / (metric.history.length - 1)) * 100;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />
                  </svg>
                ) : (
                  <div className="w-full h-full border-b border-dashed border-[#2DD4BF]/20 flex items-center justify-center text-[10px] text-[#9AAEAA]">
                    Connect smartwatch to populate telemetry
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-[#2DD4BF]/10 flex items-center justify-between text-[11px] text-[#9AAEAA]">
                <span className="flex items-center gap-1 text-[#8AF5D0]">
                  <TrendingUp className="h-3 w-3" />{" "}
                  {isWatchConnected ? metric.trend : "Stream paused"}
                </span>
                <span className="hover:text-[#FAF8F2] font-semibold">Inspect</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="aura-glass rounded-2xl p-4 border border-[#2DD4BF]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#A8C8B8]">
          <Activity className="h-4 w-4 text-[#2DD4BF]" />
          <span>Need to record manual blood pressure, glucose or temperature?</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSendWatchSms}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500 hover:text-white transition"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Send Watch SMS Alert</span>
          </button>
          <button
            onClick={onOpenLogModal}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-4 py-2 text-xs font-black text-[#071514] shadow-md shadow-[#2DD4BF]/20 transition hover:scale-105"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Clinical Vitals</span>
          </button>
        </div>
      </div>
    </div>
  );
};
