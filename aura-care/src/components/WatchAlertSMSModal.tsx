"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  AlertTriangle,
  Watch,
  X,
  Send,
  Heart,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Watch3DVisual } from "./3d/Watch3DVisual";

interface WatchAlertSMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSmsToWatch: (sms: {
    title: string;
    message: string;
    timestamp: string;
    isCritical?: boolean;
  }) => void;
  connectedWatchName: string;
  isWatchConnected: boolean;
}

export const WatchAlertSMSModal: React.FC<WatchAlertSMSModalProps> = ({
  isOpen,
  onClose,
  onSendSmsToWatch,
  connectedWatchName,
  isWatchConnected,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>("low-bp");
  const [customTitle, setCustomTitle] = useState("CRITICAL: Low Blood Pressure");
  const [customMessage, setCustomMessage] = useState(
    "Low BP Alert (88/54 mmHg detected). Risk of dizziness. Please hydrate with electrolytes & sit down immediately."
  );
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const presets = [
    {
      id: "low-bp",
      title: "CRITICAL: Low Blood Pressure",
      message:
        "Low BP Alert (88/54 mmHg detected). Risk of dizziness. Please hydrate with electrolytes & sit down immediately.",
      isCritical: true,
      category: "Hypotension",
    },
    {
      id: "high-bp",
      title: "URGENT: High Blood Pressure",
      message:
        "Elevated BP (158/102 mmHg detected). Cease physical exertion, breathe slowly, and take prescribed dose.",
      isCritical: true,
      category: "Hypertension",
    },
    {
      id: "tachycardia",
      title: "ALERT: Tachycardia Warning",
      message:
        "Resting Heart Rate spike (>130 BPM detected). Optical PPG flagged sinus arrhythmia. Sit down and rest.",
      isCritical: true,
      category: "Arrhythmia",
    },
    {
      id: "glucose",
      title: "WARNING: Hypoglycemia Low Sugar",
      message:
        "Continuous sensor detected glucose drop (<65 mg/dL). Ingest 15-20g fast-acting carbohydrates immediately.",
      isCritical: true,
      category: "Glycemic",
    },
    {
      id: "med-reminder",
      title: "REMINDER: Scheduled Prescription",
      message:
        "Time for your Atorvastatin Calcium 20mg dose with meal. Mark as taken on your AuraCare portal.",
      isCritical: false,
      category: "Medication",
    },
  ];

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = presets.find((x) => x.id === presetId);
    if (p) {
      setCustomTitle(p.title);
      setCustomMessage(p.message);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    onSendSmsToWatch({
      title: customTitle,
      message: customMessage,
      timestamp,
      isCritical: customTitle.toLowerCase().includes("critical") || customTitle.toLowerCase().includes("urgent"),
    });
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="aura-glass rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-rose-500/40 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9AAEAA] hover:text-[#FAF8F2]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-lg shadow-rose-500/20">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-heading text-[#FAF8F2]">
                Transmit SMS Alert to Smartwatch
              </h3>
              <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[9px] font-bold text-rose-400 uppercase">
                EMERGENCY RELAY
              </span>
            </div>
            <p className="text-xs text-[#9AAEAA]">
              Send critical situation reminders (Low BP, Tachycardia, Meds) directly to{" "}
              <strong className="text-[#8AF5D0]">{connectedWatchName}</strong>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Form Column */}
          <form onSubmit={handleSend} className="md:col-span-7 space-y-4 text-xs">
            {/* Quick Presets Selection */}
            <div>
              <label className="font-semibold text-[#A8C8B8]">Select Alert Situation Preset</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.id)}
                    className={`p-2.5 rounded-xl text-left border transition ${
                      selectedPreset === p.id
                        ? "bg-rose-500/20 border-rose-500 text-rose-300 font-bold"
                        : "bg-[#071514] border-[#2DD4BF]/15 text-[#A8C8B8] hover:border-[#2DD4BF]/40"
                    }`}
                  >
                    <span className="text-[10px] block font-mono text-[#8AF5D0] uppercase">
                      {p.category}
                    </span>
                    <span className="text-[11px] block truncate">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Title Input */}
            <div>
              <label className="font-semibold text-[#A8C8B8]">SMS Header / Alert Subject</label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-rose-400 font-bold"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="font-semibold text-[#A8C8B8]">SMS Message Body</label>
              <textarea
                rows={3}
                required
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-[#8AF5D0] font-mono">
                Relay: BLE Optical Stream + Cellular SMS
              </span>

              <button
                type="submit"
                disabled={isSent}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-rose-500/30 hover:scale-105 transition disabled:opacity-50"
              >
                {isSent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Transmitted to Watch!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Transmit SMS to Watch</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Live 3D Smartwatch Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#071514] border border-[#2DD4BF]/20">
            <span className="text-[10px] font-bold text-[#8AF5D0] uppercase mb-2">
              Live Watch Face Preview
            </span>
            <Watch3DVisual
              size="sm"
              deviceName={connectedWatchName}
              isConnected={isWatchConnected}
              incomingSms={{
                title: customTitle,
                message: customMessage,
                timestamp: "Just Now",
                isCritical: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
