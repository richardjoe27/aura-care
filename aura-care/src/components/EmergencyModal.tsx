"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  PhoneCall,
  X,
  Ambulance,
  CheckCircle,
  ShieldAlert,
  Heart,
} from "lucide-react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSOS: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onTriggerSOS,
}) => {
  const [sosSent, setSosSent] = useState(false);

  if (!isOpen) return null;

  const handleSos = () => {
    setSosSent(true);
    onTriggerSOS();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="aura-glass w-full max-w-lg rounded-3xl border border-rose-500/40 p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-1 text-[#9AAEAA] hover:text-[#FAF8F2]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-lg shadow-rose-500/20">
            <AlertTriangle className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-[#FAF8F2] flex items-center gap-2">
              Emergency Medical ID Card
            </h3>
            <p className="text-xs text-rose-400 font-medium">
              Immediate clinical profile for first responders and ER triage
            </p>
          </div>
        </div>

        {/* Patient Critical Info Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl bg-[#071514] p-3.5 border border-rose-500/20">
            <span className="text-[10px] text-[#9AAEAA] uppercase tracking-wider font-bold">
              Patient Full Name
            </span>
            <p className="mt-1 font-bold text-sm text-[#FAF8F2]">Richard Joel</p>
            <p className="text-[11px] text-[#A8C8B8]">DOB: 14/05/1997 (29 yrs)</p>
          </div>

          <div className="rounded-2xl bg-[#071514] p-3.5 border border-rose-500/20">
            <span className="text-[10px] text-[#9AAEAA] uppercase tracking-wider font-bold">
              Blood Type & Organ Donor
            </span>
            <p className="mt-1 font-bold text-sm text-rose-400 font-mono">O+ (Rh Positive)</p>
            <p className="text-[11px] text-[#8AF5D0]">Verified Donor: Yes</p>
          </div>

          <div className="rounded-2xl bg-[#071514] p-3.5 border border-rose-500/20">
            <span className="text-[10px] text-[#9AAEAA] uppercase tracking-wider font-bold">
              Known Critical Allergies
            </span>
            <p className="mt-1 font-bold text-amber-300">Penicillin (Severe Rash)</p>
            <p className="text-[11px] text-[#A8C8B8]">Latex: No Known Allergy</p>
          </div>

          <div className="rounded-2xl bg-[#071514] p-3.5 border border-rose-500/20">
            <span className="text-[10px] text-[#9AAEAA] uppercase tracking-wider font-bold">
              Chronic Clinical Diagnoses
            </span>
            <p className="mt-1 font-bold text-[#FAF8F2]">Primary Hyperlipidemia</p>
            <p className="text-[11px] text-[#8AF5D0]">Rx: Atorvastatin 20mg</p>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mt-4 rounded-2xl bg-[#071514] p-4 border border-[#2DD4BF]/20 space-y-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-[#9AAEAA]">
            Emergency Dispatch Contacts
          </span>
          <div className="flex items-center justify-between text-[#FAF8F2]">
            <span>Eleanor Joel (Spouse)</span>
            <span className="font-mono text-[#8AF5D0] font-bold">+1 (555) 392-1084</span>
          </div>
          <div className="flex items-center justify-between text-[#FAF8F2]">
            <span>Dr. Sarah Jenkins (Cardiologist)</span>
            <span className="font-mono text-indigo-300 font-bold">+1 (555) 782-9901</span>
          </div>
        </div>

        {/* SOS Action Button */}
        <div className="mt-5 space-y-2">
          {sosSent ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 p-4 text-xs font-bold text-emerald-300">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span>SOS Beacon Dispatched. First Responders & Family Alerted.</span>
            </div>
          ) : (
            <button
              onClick={handleSos}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 py-3.5 text-sm font-black text-white shadow-xl shadow-rose-600/30 hover:scale-[1.02] transition font-heading"
            >
              <Ambulance className="h-5 w-5" />
              <span>Trigger Immediate Emergency SOS Beacon</span>
            </button>
          )}

          <p className="text-center text-[10px] text-[#9AAEAA]">
            Transmits real-time GPS coordinates and biometric telemetry to emergency dispatch.
          </p>
        </div>
      </div>
    </div>
  );
};
