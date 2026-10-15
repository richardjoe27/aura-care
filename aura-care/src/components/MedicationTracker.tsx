"use client";

import React, { useState } from "react";
import { Pill, CheckCircle2, Clock, Plus, Utensils, X, Sparkles, AlertCircle } from "lucide-react";
import { Medication } from "../types/health";
import { Helix3DVisual } from "./3d/Helix3DVisual";

interface MedicationTrackerProps {
  medications: Medication[];
  onToggleMedication: (id: string) => void;
  onAddMedication: (newMed: Omit<Medication, "id" | "taken">) => void;
}

export const MedicationTracker: React.FC<MedicationTrackerProps> = ({
  medications,
  onToggleMedication,
  onAddMedication,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    time: "08:00 AM",
    period: "Morning" as Medication["period"],
    withFood: true,
    instructions: "",
  });

  const takenCount = medications.filter((m) => m.taken).length;
  const totalCount = medications.length;
  const completionRate = totalCount === 0 ? 0 : Math.round((takenCount / totalCount) * 100);

  const filteredMeds =
    filterPeriod === "All"
      ? medications
      : medications.filter((m) => m.period === filterPeriod);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) return;
    onAddMedication({
      name: formData.name,
      dosage: formData.dosage,
      time: formData.time,
      period: formData.period,
      withFood: formData.withFood,
      instructions: formData.instructions || "Take as prescribed by doctor.",
    });
    setFormData({
      name: "",
      dosage: "",
      time: "08:00 AM",
      period: "Morning",
      withFood: true,
      instructions: "",
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Adherence Overview with 3D Pharmacological Helix */}
      <div className="aura-glass rounded-3xl p-6 sm:p-8 border border-[#2DD4BF]/20 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-[#8AF5D0] bg-[#2DD4BF]/15 border border-[#2DD4BF]/30">
              <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
              <span>3D PHARMACODYNAMICS & DOSE SCHEDULING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-heading text-[#FAF8F2]">
              Medication & Supplement Adherence
            </h2>
            <p className="text-xs text-[#9AAEAA] max-w-xl leading-relaxed">
              Prescriptions are calibrated according to biological half-lives and meal timing.
              Synchronized directly with physician e-prescriptions and smartwatch reminders.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#0B2523]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#8AF5D0] transition-all duration-700 ease-out"
                      strokeDasharray={`${completionRate}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-black font-mono text-[#FAF8F2]">
                    {completionRate}%
                  </span>
                </div>
                <div>
                  <p className="text-[11px] text-[#9AAEAA]">Completed Today</p>
                  <p className="text-sm font-bold text-[#8AF5D0]">
                    {takenCount} of {totalCount} Doses Taken
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-4 py-2.5 text-xs font-black text-[#071514] shadow-md shadow-[#2DD4BF]/20 transition hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medication</span>
              </button>
            </div>
          </div>

          {/* 3D Pharmacological Helix */}
          <div className="lg:col-span-4 flex justify-center">
            <Helix3DVisual />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {["All", "Morning", "Afternoon", "Evening", "Night"].map((period) => (
          <button
            key={period}
            onClick={() => setFilterPeriod(period)}
            className={`px-4 py-2 rounded-xl transition ${
              filterPeriod === period
                ? "bg-[#2DD4BF] text-[#071514] shadow-md shadow-[#2DD4BF]/30 font-black"
                : "aura-glass text-[#A8C8B8] hover:text-[#FAF8F2] border border-[#2DD4BF]/15"
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Medication Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeds.map((med) => (
          <div
            key={med.id}
            className={`aura-glass-interactive rounded-3xl p-5 border transition-all ${
              med.taken
                ? "border-emerald-500/30 bg-[#0B2523]/60"
                : "border-[#2DD4BF]/20 hover:border-[#2DD4BF]/40"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                    med.taken
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-[#2DD4BF]/15 border-[#2DD4BF]/30 text-[#8AF5D0]"
                  }`}
                >
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#FAF8F2] font-heading">{med.name}</h4>
                  <p className="text-xs text-[#8AF5D0] font-mono mt-0.5">{med.dosage}</p>
                </div>
              </div>

              <button
                onClick={() => onToggleMedication(med.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  med.taken
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                    : "bg-[#071514] text-[#8AF5D0] border border-[#2DD4BF]/30 hover:bg-[#2DD4BF] hover:text-[#071514]"
                }`}
              >
                {med.taken ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Taken</span>
                  </>
                ) : (
                  <span>Mark Taken</span>
                )}
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2DD4BF]/10 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#9AAEAA]">
                <Clock className="h-3.5 w-3.5 text-[#2DD4BF]" />
                <span>
                  {med.time} ({med.period})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#9AAEAA]">
                <Utensils className="h-3.5 w-3.5 text-amber-400" />
                <span>{med.withFood ? "Take with meal" : "Empty stomach"}</span>
              </div>
            </div>

            {med.instructions && (
              <p className="mt-2 text-[11px] text-[#A8C8B8] bg-[#071514]/60 p-2.5 rounded-xl border border-[#2DD4BF]/10">
                {med.instructions}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="aura-glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#2DD4BF]/30 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-[#9AAEAA] hover:text-[#FAF8F2]"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-[#FAF8F2] mb-1">
              Add New Prescription
            </h3>
            <p className="text-xs text-[#9AAEAA] mb-5">
              Enter pharmaceutical details and reminder timing.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#A8C8B8]">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atorvastatin, Metformin, Magnesium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#A8C8B8]">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20 mg, 500 mg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A8C8B8]">Scheduled Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#A8C8B8]">Day Period</label>
                  <select
                    value={formData.period}
                    onChange={(e) =>
                      setFormData({ ...formData, period: e.target.value as Medication["period"] })
                    }
                    className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#A8C8B8]">Meal Timing</label>
                  <select
                    value={formData.withFood ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({ ...formData, withFood: e.target.value === "true" })
                    }
                    className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none"
                  >
                    <option value="true">With Food</option>
                    <option value="false">Without Food</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#A8C8B8]">Clinical Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Take with full glass of water after breakfast"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#071514] text-[#9AAEAA] hover:text-[#FAF8F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] text-[#071514] font-bold"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
