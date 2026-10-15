"use client";

import React, { useState } from "react";
import { X, Heart, Activity, Droplets, Thermometer, Sparkles } from "lucide-react";

interface LogVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVitals: (newEntries: {
    heartRate?: number;
    systolic?: number;
    diastolic?: number;
    glucose?: number;
    spo2?: number;
    temp?: number;
  }) => void;
}

export const LogVitalsModal: React.FC<LogVitalsModalProps> = ({
  isOpen,
  onClose,
  onSaveVitals,
}) => {
  const [systolic, setSystolic] = useState("118");
  const [diastolic, setDiastolic] = useState("76");
  const [heartRate, setHeartRate] = useState("72");
  const [glucose, setGlucose] = useState("94");
  const [spo2, setSpo2] = useState("99");
  const [temp, setTemp] = useState("98.4");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveVitals({
      heartRate: heartRate ? Number(heartRate) : undefined,
      systolic: systolic ? Number(systolic) : undefined,
      diastolic: diastolic ? Number(diastolic) : undefined,
      glucose: glucose ? Number(glucose) : undefined,
      spo2: spo2 ? Number(spo2) : undefined,
      temp: temp ? Number(temp) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="aura-glass w-full max-w-md rounded-3xl border border-[#2DD4BF]/30 p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9AAEAA] hover:text-[#FAF8F2]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#8AF5D0]">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-[#FAF8F2]">
              Log Clinical Telemetry
            </h3>
            <p className="text-xs text-[#9AAEAA]">
              Manual vital sign entry for medical record synchronization
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Blood Pressure */}
          <div>
            <label className="font-semibold text-[#A8C8B8]">Blood Pressure (mmHg)</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div>
                <input
                  type="number"
                  placeholder="Systolic (120)"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className="w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] font-mono focus:border-[#2DD4BF] focus:outline-none"
                />
                <span className="text-[10px] text-[#9AAEAA] pl-1">Systolic</span>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Diastolic (80)"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  className="w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] font-mono focus:border-[#2DD4BF] focus:outline-none"
                />
                <span className="text-[10px] text-[#9AAEAA] pl-1">Diastolic</span>
              </div>
            </div>
          </div>

          {/* Heart Rate & Glucose */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#A8C8B8]">Resting Pulse (BPM)</label>
              <input
                type="number"
                placeholder="72"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] font-mono focus:border-[#2DD4BF] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-[#A8C8B8]">Fasting Glucose (mg/dL)</label>
              <input
                type="number"
                placeholder="94"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
                className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] font-mono focus:border-[#2DD4BF] focus:outline-none"
              />
            </div>
          </div>

          {/* SpO2 & Temp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#A8C8B8]">Oxygen SpO2 (%)</label>
              <input
                type="number"
                placeholder="99"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] font-mono focus:border-[#2DD4BF] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-[#A8C8B8]">Body Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                placeholder="98.6"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] font-mono focus:border-[#2DD4BF] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#071514] text-[#9AAEAA] hover:text-[#FAF8F2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] text-[#071514] font-black"
            >
              Save Vitals
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
