"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Heart,
  Pill,
  FileText,
  Activity,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Download,
  Filter,
} from "lucide-react";
import { Appointment, Medication, LabReport, VitalMetric } from "../types/health";

interface HealthStoryEvent {
  id: string;
  type: "appointment" | "prescription" | "diagnostic" | "biometric";
  title: string;
  subtitle: string;
  date: string;
  time?: string;
  status: string;
  doctor?: string;
  department?: string;
  details: string;
  tags: string[];
  metrics?: { label: string; value: string; status?: string }[];
}

interface MyHealthStoryProps {
  appointments?: Appointment[];
  medications?: Medication[];
  labReports?: LabReport[];
  vitals?: VitalMetric[];
  isDarkTheme?: boolean;
}

export const MyHealthStory: React.FC<MyHealthStoryProps> = ({
  appointments = [],
  medications = [],
  labReports = [],
  vitals = [],
  isDarkTheme = true,
}) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [expandedEventId, setExpandedEventId] = useState<string | null>("story-apt-1");

  // Construct realistic timeline from available clinical data
  const storyEvents: HealthStoryEvent[] = [
    {
      id: "story-apt-1",
      type: "appointment",
      title: "Follow-up Cardiology Telehealth Consultation",
      subtitle: "Comprehensive Sinus Rhythm & Statin Efficacy Review",
      date: "Today, Sep 26, 2026",
      time: "03:30 PM",
      status: "Confirmed",
      doctor: "Dr. Sarah Jenkins, MD, FACC",
      department: "Cardiovascular Medicine",
      details:
        "Quarterly assessment of continuous optical PPG telemetry, lipid biomarkers, and exercise recovery tolerances. Real-time WebRTC room scheduled with high-definition audio/video.",
      tags: ["Telehealth", "Cardiology", "Verified Encounter"],
      metrics: [
        { label: "Resting Pulse", value: "72 BPM", status: "Optimal" },
        { label: "Sinus Rhythm", value: "Normal Axis", status: "Optimal" },
      ],
    },
    {
      id: "story-diag-1",
      type: "diagnostic",
      title: "Comprehensive Lipid & Apolipoprotein Panel",
      subtitle: "Certified Bio-Diagnostic Laboratory Vault",
      date: "Sep 18, 2026",
      status: "Optimal Stage",
      doctor: "Dr. Elena Rostova, MD",
      department: "Metabolic Diagnostics",
      details:
        "Serum cholesterol analysis indicates robust response to current Atorvastatin 20mg regimen. Total Cholesterol: 168 mg/dL (<200 optimal), LDL: 88 mg/dL (<100 optimal), HDL: 62 mg/dL (>50 optimal), ApoB: 64 mg/dL.",
      tags: ["Biomarkers", "Certified Vault", "Lipid Subfractions"],
      metrics: [
        { label: "Total Cholesterol", value: "168 mg/dL", status: "Optimal" },
        { label: "LDL Particle", value: "88 mg/dL", status: "Optimal" },
        { label: "ApoB", value: "64 mg/dL", status: "Optimal" },
      ],
    },
    {
      id: "story-med-1",
      type: "prescription",
      title: "Preventive Cardiovascular Regimen Updated",
      subtitle: "e-Prescription Transmitted to Partner Pharmacy",
      date: "Sep 12, 2026",
      status: "Active Schedule",
      doctor: "Dr. Sarah Jenkins, MD",
      department: "Preventive Care",
      details:
        "Prescription maintained for Atorvastatin Calcium 20 mg once daily at 08:00 AM, complemented with CoQ10 Ubiquinol 100 mg and high-potency Omega-3 EPA/DHA 1200 mg.",
      tags: ["Daily Medication", "Active", "Wearable Reminder"],
      metrics: [
        { label: "Compliance Rate", value: "98.4%", status: "Optimal" },
        { label: "Active Doses", value: "5 Medications/Day" },
      ],
    },
    {
      id: "story-bio-1",
      type: "biometric",
      title: "Smartwatch Biometric Telemetry Calibration",
      subtitle: "Continuous Optical PPG & Pulse Oximetry Stream",
      date: "Sep 05, 2026",
      status: "Calibrated",
      details:
        "Apple Watch Ultra 2 paired with AuraCare Clinical OS. Baseline resting heart rate established at 70-74 BPM. Average SpO2 stable at 99%. Overnight sleep restoration averaged 7h 45m with 23% deep restorative wave sleep.",
      tags: ["PPG Sensor", "Biometrics", "Continuous Stream"],
      metrics: [
        { label: "Baseline HR", value: "72 BPM" },
        { label: "SpO2 Baseline", value: "99%" },
        { label: "Sleep Recovery", value: "88/100" },
      ],
    },
    {
      id: "story-apt-2",
      type: "appointment",
      title: "Neurology & Restorative Sleep Evaluation",
      subtitle: "Circadian Rhythm Optimization & Neuro-Recovery",
      date: "Aug 22, 2026",
      status: "Completed",
      doctor: "Dr. Marcus Vance, MD",
      department: "Precision Neuroscience",
      details:
        "Evaluated sleep architecture from wearable accelerometer and heart rate variability (HRV) streams. Recommended addition of Magnesium L-Threonate 144mg 30 minutes before sleep.",
      tags: ["Sleep Medicine", "Neurology", "Completed"],
    },
  ];

  const filteredEvents =
    filterType === "all"
      ? storyEvents
      : storyEvents.filter((ev) => ev.type === filterType);

  const toggleExpand = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  const getEventBadge = (type: HealthStoryEvent["type"]) => {
    switch (type) {
      case "appointment":
        return {
          icon: Calendar,
          color: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30",
          glow: "from-indigo-500 to-purple-600",
        };
      case "diagnostic":
        return {
          icon: FileText,
          color: "text-[#8AF5D0] bg-[#2DD4BF]/15 border-[#2DD4BF]/30",
          glow: "from-[#2DD4BF] to-[#8AF5D0]",
        };
      case "prescription":
        return {
          icon: Pill,
          color: "text-amber-400 bg-amber-500/15 border-amber-500/30",
          glow: "from-amber-400 to-orange-500",
        };
      case "biometric":
        return {
          icon: Heart,
          color: "text-rose-400 bg-rose-500/15 border-rose-500/30",
          glow: "from-rose-500 to-pink-500",
        };
    }
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 transition-all ${
        isDarkTheme
          ? "aura-glass border border-[#2DD4BF]/20 text-[#FAF8F2]"
          : "aura-glass-light text-[#071514]"
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2DD4BF]/15">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-[#8AF5D0] bg-[#2DD4BF]/10 border border-[#2DD4BF]/25 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
            <span>SIGNATURE CLINICAL EXPERIENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
            My Health Story
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#9AAEAA] max-w-xl">
            A continuous, intelligent chronicle uniting consultations, clinical biomarkers, daily
            medications, and wearable biometrics into one synchronized care narrative.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#071514]/70 border border-[#2DD4BF]/20 text-xs">
          {[
            { id: "all", label: "All Events" },
            { id: "appointment", label: "Visits" },
            { id: "diagnostic", label: "Lab Vault" },
            { id: "prescription", label: "Rx Meds" },
            { id: "biometric", label: "Biometrics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterType === tab.id
                  ? "bg-[#2DD4BF] text-[#071514] shadow-sm shadow-[#2DD4BF]/30"
                  : "text-[#9AAEAA] hover:text-[#FAF8F2] hover:bg-[#0B2523]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Timeline Track */}
      <div className="relative mt-8 space-y-6">
        {/* Luminous Connecting Center/Left Line */}
        <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#8AF5D0] via-[#2DD4BF]/40 to-[#0B2523]" />

        {filteredEvents.map((event) => {
          const badge = getEventBadge(event.type);
          const Icon = badge.icon;
          const isExpanded = expandedEventId === event.id;

          return (
            <div key={event.id} className="relative pl-14 sm:pl-16 group">
              {/* Luminous Timeline Node */}
              <div
                className={`absolute left-3.5 -translate-x-1/2 top-4 flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition-all duration-300 group-hover:scale-110 ${
                  isExpanded
                    ? "bg-[#2DD4BF] border-[#8AF5D0] shadow-[#2DD4BF]/50"
                    : "bg-[#071514] border-[#2DD4BF]/40"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    isExpanded ? "bg-[#071514]" : "bg-[#8AF5D0] animate-pulse"
                  }`}
                />
              </div>

              {/* Event Card */}
              <div
                onClick={() => toggleExpand(event.id)}
                className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 border ${
                  isExpanded
                    ? "bg-[#0B2523]/80 border-[#2DD4BF]/40 shadow-xl shadow-[#2DD4BF]/10"
                    : "bg-[#071514]/60 border-[#2DD4BF]/15 hover:border-[#2DD4BF]/30 hover:bg-[#0B2523]/50"
                }`}
              >
                {/* Event Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl border ${badge.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#FAF8F2] tracking-tight">
                        {event.title}
                      </h4>
                      <p className="text-xs text-[#9AAEAA]">{event.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-semibold text-[#8AF5D0] flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {event.date}
                    </span>
                    <button
                      type="button"
                      aria-label="Toggle details"
                      className="text-[#9AAEAA] hover:text-[#FAF8F2] p-1"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Event Metadata Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-[#071514] border border-[#2DD4BF]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#A8C8B8]"
                    >
                      {tag}
                    </span>
                  ))}
                  {event.doctor && (
                    <span className="text-[11px] font-medium text-[#2DD4BF] flex items-center gap-1 ml-auto">
                      <Stethoscope className="h-3 w-3" /> {event.doctor}
                    </span>
                  )}
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#2DD4BF]/15 text-xs text-[#FAF8F2]/90 space-y-3 animate-in fade-in duration-200">
                    <p className="leading-relaxed text-[#FAF8F2]/80">{event.details}</p>

                    {event.metrics && event.metrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                        {event.metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="rounded-xl bg-[#071514] p-2.5 border border-[#2DD4BF]/20 flex flex-col justify-between"
                          >
                            <span className="text-[10px] text-[#9AAEAA] font-semibold">
                              {m.label}
                            </span>
                            <div className="flex items-baseline justify-between mt-1">
                              <span className="text-sm font-black text-[#8AF5D0] font-mono">
                                {m.value}
                              </span>
                              {m.status && (
                                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">
                                  {m.status}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
