"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Users,
  Calendar,
  FileCheck,
  AlertTriangle,
  Video,
  Clock,
  Search,
  CheckCircle2,
  Plus,
  ArrowRight,
  LogOut,
  Heart,
  Pill,
  ShieldCheck,
  X,
  FileText,
  User,
  MapPin,
  Bell,
  Sparkles,
  Lock,
  ChevronRight,
} from "lucide-react";
import { DoctorPatient, DoctorAppointment, PendingLabReview, DoctorProfile } from "../types/doctor";
import {
  doctorPatientsBySpecialty,
  doctorAppointmentsBySpecialty,
  mockPendingLabs,
} from "../data/mockDoctorData";
import { Heart3DVisual } from "./3d/Heart3DVisual";
import { Meet3DVisual } from "./3d/Meet3DVisual";

interface DoctorDashboardProps {
  doctorProfile: DoctorProfile;
  onLogout: () => void;
  onLaunchTelehealth: (patientName: string) => void;
  onPrescriptionIssued: (patientName: string, medName: string, dosage: string) => void;
  onSendPatientWatchSms?: (patientName: string, title: string, message: string) => void;
  onOpenSendWatchSms?: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctorProfile,
  onLogout,
  onLaunchTelehealth,
  onPrescriptionIssued,
  onSendPatientWatchSms,
  onOpenSendWatchSms,
}) => {
  const [activeTab, setActiveTab] = useState<"schedule" | "patients" | "labs" | "prescribe" | "availability">("schedule");
  const [appointmentFilter, setAppointmentFilter] = useState<"all" | "offline" | "telehealth">("all");
  const [patients, setPatients] = useState<DoctorPatient[]>(
    doctorPatientsBySpecialty[doctorProfile.specialty] ?? []
  );
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(
    doctorAppointmentsBySpecialty[doctorProfile.specialty] ?? []
  );
  const [pendingLabs, setPendingLabs] = useState<PendingLabReview[]>(mockPendingLabs);

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [doctorNotifications, setDoctorNotifications] = useState([
    {
      id: "dn1",
      title: "Offline Patient Checked In",
      desc: "Marcus Holloway arrived at clinic reception for Exam Room 3.",
      time: "10m ago",
      unread: true,
    },
    {
      id: "dn2",
      title: "Critical Telemetry Alert",
      desc: "Beatrice Gomez Holter detected AFib run. Reviewing in Exam Room 1.",
      time: "20m ago",
      unread: true,
    },
    {
      id: "dn3",
      title: "Telehealth Patient Ready",
      desc: "Richard Joel is waiting in the encrypted virtual room (03:30 PM).",
      time: "35m ago",
      unread: true,
    },
  ]);

  // Selected patient for modal detail view
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatient | null>(null);

  // Prescription form state
  const [prescribePatientId, setPrescribePatientId] = useState<string>(patients[0]?.id ?? "");
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");

  const unreadCount = doctorNotifications.filter((n) => n.unread).length;

  const handleClearNotifications = () => {
    setDoctorNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleApproveLab = (labId: string) => {
    setPendingLabs((prev) =>
      prev.map((lab) => (lab.id === labId ? { ...lab, status: "Signed" } : lab))
    );
  };

  const handleUpdateAppointmentStatus = (aptId: string, newStatus: DoctorAppointment["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === aptId ? { ...apt, status: newStatus } : apt))
    );
  };

  const handlePrescribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName || !dosage) return;
    const targetPatient = patients.find((p) => p.id === prescribePatientId);
    onPrescriptionIssued(targetPatient?.name || "Patient", medName, dosage);
    setMedName("");
    setDosage("");
    setInstructions("");
    setActiveTab("schedule");
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (appointmentFilter === "offline") return apt.type === "In-Person Clinic";
    if (appointmentFilter === "telehealth") return apt.type === "Telehealth Video";
    return true;
  });

  const offlineCount = appointments.filter((a) => a.type === "In-Person Clinic").length;
  const telehealthCount = appointments.filter((a) => a.type === "Telehealth Video").length;

  return (
    <div className="min-h-screen bg-[#071514] text-[#FAF8F2] flex flex-col">
      {/* Clinician Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#2DD4BF]/20 bg-[#071514]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-[#2DD4BF] text-white shadow-md shadow-indigo-600/20 overflow-hidden border border-[#2DD4BF]/30">
              <img
                src={doctorProfile.avatar}
                alt={doctorProfile.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#FAF8F2] font-heading">
                  {doctorProfile.name}
                </span>
                <span className="rounded-full bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                  {doctorProfile.specialty.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-[#9AAEAA] hidden sm:block">
                {doctorProfile.department} • {doctorProfile.hospital} (NPI-{doctorProfile.npi})
              </p>
            </div>
          </div>

          {/* Clinician Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl border border-[#2DD4BF]/20 bg-[#0B2523] p-2 text-[#A8C8B8] transition hover:text-[#FAF8F2]"
                aria-label="Doctor notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#2DD4BF]/30 bg-[#071514]/95 p-4 shadow-2xl backdrop-blur-2xl z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2DD4BF]/15">
                    <span className="text-xs font-bold text-[#FAF8F2]">Clinician Dispatch</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleClearNotifications}
                        className="text-[11px] text-[#8AF5D0] hover:underline"
                      >
                        Clear unread
                      </button>
                    )}
                  </div>
                  <div className="mt-3 max-h-64 overflow-y-auto space-y-2 text-xs">
                    {doctorNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`rounded-xl p-3 border ${
                          n.unread
                            ? "bg-[#0B2523] border-[#2DD4BF]/30"
                            : "bg-[#071514] border-transparent"
                        }`}
                      >
                        <div className="flex justify-between font-bold text-[#FAF8F2]">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-[#9AAEAA]">{n.time}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-[#A8C8B8]">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-[#2DD4BF]/10 bg-[#0B2523]/30">
          <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8 text-xs font-semibold">
            {[
              { id: "schedule", label: "Care Schedule & Encounters", icon: Calendar },
              { id: "patients", label: `Patients (${patients.length})`, icon: Users },
              { id: "labs", label: `Diagnostic Reviews (${pendingLabs.filter((l) => l.status === "Pending Review").length})`, icon: FileCheck },
              { id: "prescribe", label: "e-Prescription Studio", icon: Pill },
              { id: "availability", label: "Doctor Availability", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 transition ${
                    isActive
                      ? "bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/25"
                      : "text-[#A8C8B8] hover:bg-[#0B2523] hover:text-[#FAF8F2]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="aura-glass rounded-2xl p-4 border border-[#2DD4BF]/20">
            <span className="text-[10px] uppercase font-bold text-[#9AAEAA]">Patients in Care</span>
            <p className="text-2xl font-black font-mono text-[#8AF5D0] mt-1">{patients.length}</p>
          </div>
          <div className="aura-glass rounded-2xl p-4 border border-indigo-500/25">
            <span className="text-[10px] uppercase font-bold text-indigo-300">Today Encounters</span>
            <p className="text-2xl font-black font-mono text-indigo-200 mt-1">{appointments.length}</p>
          </div>
          <div className="aura-glass rounded-2xl p-4 border border-emerald-500/25">
            <span className="text-[10px] uppercase font-bold text-emerald-300">In-Person Clinic</span>
            <p className="text-2xl font-black font-mono text-emerald-200 mt-1">{offlineCount}</p>
          </div>
          <div className="aura-glass rounded-2xl p-4 border border-sky-500/25">
            <span className="text-[10px] uppercase font-bold text-sky-300">Telehealth Video</span>
            <p className="text-2xl font-black font-mono text-sky-200 mt-1">{telehealthCount}</p>
          </div>
        </div>

        {/* TAB 1: SCHEDULE & ENCOUNTERS */}
        {activeTab === "schedule" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-[#FAF8F2] font-heading">
                Today&apos;s Clinical Queue
              </h3>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#071514] border border-[#2DD4BF]/20 text-xs">
                <button
                  onClick={() => setAppointmentFilter("all")}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    appointmentFilter === "all" ? "bg-indigo-500 text-white" : "text-[#9AAEAA]"
                  }`}
                >
                  All ({appointments.length})
                </button>
                <button
                  onClick={() => setAppointmentFilter("offline")}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    appointmentFilter === "offline" ? "bg-indigo-500 text-white" : "text-[#9AAEAA]"
                  }`}
                >
                  In-Person ({offlineCount})
                </button>
                <button
                  onClick={() => setAppointmentFilter("telehealth")}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    appointmentFilter === "telehealth" ? "bg-indigo-500 text-white" : "text-[#9AAEAA]"
                  }`}
                >
                  Telehealth ({telehealthCount})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="aura-glass-interactive rounded-3xl p-5 border border-[#2DD4BF]/20 space-y-4 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#FAF8F2] font-heading">
                          {apt.patientName}
                        </h4>
                        <p className="text-xs text-[#9AAEAA]">
                          {apt.patientAge} yrs • {apt.patientGender}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          apt.type === "Telehealth Video"
                            ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                            : "bg-[#2DD4BF]/15 text-[#8AF5D0] border-[#2DD4BF]/30"
                        }`}
                      >
                        {apt.type}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-[#071514] p-3 text-xs space-y-1.5 border border-[#2DD4BF]/15">
                      <div className="flex items-center justify-between font-mono text-[#8AF5D0]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {apt.time}
                        </span>
                        <span>{apt.roomNumber || "WebRTC Room"}</span>
                      </div>
                      <p className="text-[11px] text-[#A8C8B8]">
                        <strong className="text-[#FAF8F2]">Chief Complaint:</strong> {apt.reason}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2DD4BF]/15 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#A8C8B8]">Status:</span>
                      <select
                        value={apt.status}
                        onChange={(e) =>
                          handleUpdateAppointmentStatus(apt.id, e.target.value as any)
                        }
                        className="rounded-lg bg-[#071514] border border-[#2DD4BF]/20 px-2 py-1 text-[11px] text-[#8AF5D0] focus:outline-none"
                      >
                        <option value="In Lobby">In Lobby</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Checked In">Checked In</option>
                        <option value="In Examination">In Examination</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {apt.type === "Telehealth Video" && (
                      <button
                        onClick={() => onLaunchTelehealth(apt.patientName)}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-[#2DD4BF] px-3 py-1.5 text-xs font-bold text-[#071514] hover:scale-105 transition shadow-sm"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Launch</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PATIENTS LIST */}
        {activeTab === "patients" && (
          <div className="aura-glass rounded-3xl p-6 border border-[#2DD4BF]/20 space-y-4">
            <h3 className="text-base font-bold text-[#FAF8F2] font-heading">
              Assigned Patient Cohort ({doctorProfile.specialty})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#FAF8F2]">
                <thead className="bg-[#071514] text-[#9AAEAA] uppercase text-[10px] tracking-wider border-b border-[#2DD4BF]/15">
                  <tr>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Age / Sex / Blood</th>
                    <th className="py-3 px-4">Primary Condition</th>
                    <th className="py-3 px-4">Latest Vitals</th>
                    <th className="py-3 px-4">Clinical Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2DD4BF]/10">
                  {patients.map((pat) => (
                    <tr key={pat.id} className="hover:bg-[#0B2523]/40 transition">
                      <td className="py-3.5 px-4 font-bold text-[#8AF5D0]">{pat.name}</td>
                      <td className="py-3.5 px-4 text-[#A8C8B8]">
                        {pat.age} yrs • {pat.gender} • {pat.bloodGroup}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate">{pat.condition}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#2DD4BF]">
                        BP: {pat.vitals.bp} | HR: {pat.vitals.hr} | SpO2: {pat.vitals.spo2}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                            pat.status === "Optimal"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : pat.status === "Attention"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                          }`}
                        >
                          {pat.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedPatient(pat)}
                          className="rounded-lg bg-[#071514] border border-[#2DD4BF]/30 px-2.5 py-1 text-[11px] font-bold text-[#8AF5D0] hover:bg-[#2DD4BF] hover:text-[#071514] transition"
                        >
                          Review Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DIAGNOSTIC REVIEWS & LABS */}
        {activeTab === "labs" && (
          <div className="aura-glass rounded-3xl p-6 border border-[#2DD4BF]/20 space-y-4">
            <h3 className="text-base font-bold text-[#FAF8F2] font-heading">
              Biomarker Sign-Off & Diagnostic Queue
            </h3>

            <div className="space-y-3">
              {pendingLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="rounded-2xl bg-[#071514] p-4 border border-[#2DD4BF]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#FAF8F2] text-sm">{lab.testName}</span>
                      <span className="text-[#8AF5D0] font-semibold">• {lab.patientName}</span>
                      {lab.criticalFlag && (
                        <span className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.2 text-[9px] font-bold">
                          CRITICAL FLAG
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#A8C8B8]">{lab.summary}</p>
                    <span className="text-[10px] text-[#9AAEAA] font-mono">Date: {lab.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        lab.status === "Signed"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {lab.status}
                    </span>

                    {lab.status === "Pending Review" && (
                      <button
                        onClick={() => handleApproveLab(lab.id)}
                        className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-[#071514] hover:bg-emerald-400 transition"
                      >
                        Sign & Certify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: e-PRESCRIPTION STUDIO */}
        {activeTab === "prescribe" && (
          <div className="aura-glass rounded-3xl p-6 sm:p-8 border border-[#2DD4BF]/20 max-w-2xl mx-auto shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-[#FAF8F2] mb-1">
              e-Prescription Builder Studio
            </h3>
            <p className="text-xs text-[#9AAEAA] mb-6">
              Transmit digitally signed pharmaceutical orders directly to linked patient portals and
              partner dispensaries.
            </p>

            <form onSubmit={handlePrescribeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#A8C8B8]">Select Patient</label>
                <select
                  value={prescribePatientId}
                  onChange={(e) => setPrescribePatientId(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#071514]">
                      {p.name} ({p.age} yrs, {p.bloodGroup}) — {p.condition}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#A8C8B8]">Medication Chemical / Trade Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rosuvastatin, Lisinopril, Metformin"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A8C8B8]">Standard Dosage Strength</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 mg PO QD"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#A8C8B8]">Clinical Administration Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Take once daily at bedtime with a full glass of water. Monitor fasting lipid panel in 8 weeks."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-[#2DD4BF] py-3 text-sm font-black text-[#071514] shadow-md hover:scale-[1.01] transition font-heading"
              >
                <Pill className="h-4 w-4" />
                <span>Authorize & Transmit e-Prescription</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: DOCTOR AVAILABILITY */}
        {activeTab === "availability" && (
          <div className="aura-glass rounded-3xl p-6 sm:p-8 border border-[#2DD4BF]/20 space-y-4">
            <h3 className="text-base font-bold text-[#FAF8F2] font-heading">
              Weekly Consultation Availability & Room Assignments
            </h3>
            <p className="text-xs text-[#9AAEAA]">
              Set your in-clinic consultation hours and open WebRTC telehealth slots.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[
                { day: "Monday", hours: "09:00 AM - 04:30 PM", clinic: "Suite 401A", telehealth: "6 slots" },
                { day: "Tuesday", hours: "09:00 AM - 01:00 PM", clinic: "In-Clinic Surgical", telehealth: "2 slots" },
                { day: "Wednesday", hours: "10:00 AM - 05:00 PM", clinic: "Suite 401A", telehealth: "8 slots" },
                { day: "Thursday", hours: "09:00 AM - 04:30 PM", clinic: "Telehealth Remote", telehealth: "10 slots" },
                { day: "Friday", hours: "08:30 AM - 02:00 PM", clinic: "Suite 401A", telehealth: "4 slots" },
              ].map((slot, i) => (
                <div key={i} className="rounded-2xl bg-[#071514] p-4 border border-[#2DD4BF]/15 space-y-2 text-xs">
                  <div className="flex justify-between items-center font-bold text-[#FAF8F2]">
                    <span>{slot.day}</span>
                    <span className="text-emerald-400 font-mono text-[11px]">Active</span>
                  </div>
                  <p className="text-[#8AF5D0] font-mono">{slot.hours}</p>
                  <div className="flex justify-between text-[11px] text-[#9AAEAA] pt-1 border-t border-[#2DD4BF]/10">
                    <span>{slot.clinic}</span>
                    <span className="text-indigo-300">{slot.telehealth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="aura-glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#2DD4BF]/30 shadow-2xl relative">
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-5 right-5 text-[#9AAEAA] hover:text-[#FAF8F2]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#8AF5D0]">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-[#FAF8F2]">
                  {selectedPatient.name}
                </h3>
                <p className="text-xs text-[#9AAEAA]">
                  {selectedPatient.age} yrs • {selectedPatient.gender} • Blood: {selectedPatient.bloodGroup}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-[#071514] p-3 border border-[#2DD4BF]/15">
                <span className="text-[#9AAEAA] text-[10px]">Diagnosed Condition</span>
                <p className="font-semibold text-[#FAF8F2] mt-0.5">{selectedPatient.condition}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="rounded-xl bg-[#071514] p-2.5 border border-[#2DD4BF]/15">
                  <span className="text-[10px] text-[#9AAEAA]">Blood Pressure</span>
                  <p className="font-bold text-[#8AF5D0]">{selectedPatient.vitals.bp}</p>
                </div>
                <div className="rounded-xl bg-[#071514] p-2.5 border border-[#2DD4BF]/15">
                  <span className="text-[10px] text-[#9AAEAA]">Heart Rate</span>
                  <p className="font-bold text-[#8AF5D0]">{selectedPatient.vitals.hr}</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#071514] p-3 border border-[#2DD4BF]/15">
                <span className="text-[#9AAEAA] text-[10px]">Attending Physician Notes</span>
                <p className="text-[#A8C8B8] mt-1 leading-relaxed">{selectedPatient.recentNotes}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {onOpenSendWatchSms && (
                <button
                  onClick={() => onOpenSendWatchSms()}
                  className="rounded-xl border border-rose-500/40 bg-rose-500/15 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500 hover:text-[#071514] transition flex items-center gap-1.5"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Transmit Watch Alert</span>
                </button>
              )}
              <button
                onClick={() => {
                  onLaunchTelehealth(selectedPatient.name);
                  setSelectedPatient(null);
                }}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-[#2DD4BF] px-4 py-2 text-xs font-bold text-[#071514] flex items-center gap-1.5"
              >
                <Video className="h-3.5 w-3.5" />
                <span>Start Telehealth Consultation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
