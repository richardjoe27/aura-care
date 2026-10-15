"use client";

import React, { useState } from "react";
import {
  Building,
  Users,
  Stethoscope,
  Activity,
  ShieldCheck,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  LogOut,
  AlertTriangle,
  Server,
  FileText,
  BarChart3,
  TrendingUp,
  Lock,
} from "lucide-react";
import { doctorProfiles } from "../data/mockDoctorData";

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "departments" | "audit">("overview");
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const practitioners = [
    {
      id: "doc-1",
      name: "Dr. Sarah Jenkins, MD",
      specialty: "Cardiology",
      hospital: "Metropolitan Heart & Vascular",
      npi: "1982736450",
      status: "On Duty",
      activePatients: 28,
      consultationsToday: 6,
    },
    {
      id: "doc-2",
      name: "Dr. Marcus Vance, MD",
      specialty: "Neurology",
      hospital: "Precision Neuroscience",
      npi: "1482910482",
      status: "On Duty",
      activePatients: 22,
      consultationsToday: 5,
    },
    {
      id: "doc-3",
      name: "Dr. Elena Rostova, MD",
      specialty: "Endocrinology",
      hospital: "Aura Longevity Center",
      npi: "1729482019",
      status: "In Clinic",
      activePatients: 31,
      consultationsToday: 8,
    },
    {
      id: "doc-4",
      name: "Dr. Robert Hayes, MD",
      specialty: "Primary Care",
      hospital: "St. Jude Comprehensive",
      npi: "1192847563",
      status: "On Call",
      activePatients: 45,
      consultationsToday: 9,
    },
  ];

  const auditEvents = [
    {
      id: "aud-1",
      time: "2 mins ago",
      event: "HL7 Telemetry Feed Ingestion",
      user: "Apple Watch Ultra 2 (Richard Joel)",
      status: "Success",
      category: "Biometrics",
    },
    {
      id: "aud-2",
      time: "14 mins ago",
      event: "e-Prescription Signed & Transmitted",
      user: "Dr. Sarah Jenkins (Cardiology)",
      status: "Authorized",
      category: "Pharmacy",
    },
    {
      id: "aud-3",
      time: "38 mins ago",
      event: "Diagnostic CMP Lab Archive Encrypted",
      user: "System Automated Lab Vault",
      status: "Encrypted",
      category: "Lab Diagnostics",
    },
    {
      id: "aud-4",
      time: "1 hour ago",
      event: "WebRTC Clinical Telehealth Room Terminated",
      user: "Exam Room 3 (Dr. Marcus Vance)",
      status: "Archived",
      category: "Telehealth",
    },
  ];

  const filteredPractitioners = practitioners.filter((doc) => {
    const matchesQuery =
      doc.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      doc.npi.includes(searchUserQuery);
    const matchesDept =
      departmentFilter === "all" || doc.specialty.toLowerCase() === departmentFilter.toLowerCase();
    return matchesQuery && matchesDept;
  });

  return (
    <div className="min-h-screen bg-[#071514] text-[#FAF8F2] flex flex-col">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-[#2DD4BF]/20 bg-[#071514]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-[#071514] font-black shadow-md shadow-amber-500/20">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#FAF8F2] font-heading">
                  Aura<span className="text-amber-400">Admin</span>
                </span>
                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                  CLINICAL OS COMMAND
                </span>
              </div>
              <p className="text-[11px] text-[#9AAEAA] hidden sm:block">
                Hospital Network Operations & Telehealth Infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-400 aura-glass px-3 py-1 rounded-full border border-emerald-500/25">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Network Status: 99.98% Normal</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-xl aura-glass px-3.5 py-1.5 text-xs font-bold text-rose-400 border border-rose-500/25 hover:bg-rose-500/10 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto border-t border-[#2DD4BF]/10 py-2 text-xs font-bold">
          {[
            { id: "overview", label: "Operations Overview", icon: BarChart3 },
            { id: "users", label: "Practitioners & Staff", icon: Users },
            { id: "departments", label: "Department Centers", icon: Stethoscope },
            { id: "audit", label: "Audit & Security Trail", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-[#071514] shadow-md shadow-amber-500/20"
                    : "text-[#9AAEAA] hover:text-[#FAF8F2] hover:bg-[#0B2523]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="aura-glass rounded-2xl p-5 border border-[#2DD4BF]/20 space-y-2">
            <span className="text-[11px] font-bold text-[#9AAEAA] uppercase tracking-wider">
              Total Managed Patients
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-[#FAF8F2]">1,428</span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full">
                +12% MoM
              </span>
            </div>
            <p className="text-[11px] text-[#A8C8B8]">Active biometric wearable streams: 842</p>
          </div>

          <div className="aura-glass rounded-2xl p-5 border border-indigo-500/25 space-y-2">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              On-Duty Clinicians
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-[#FAF8F2]">18</span>
              <span className="text-xs text-indigo-300 font-bold bg-indigo-500/15 px-2 py-0.5 rounded-full">
                4 Specialties
              </span>
            </div>
            <p className="text-[11px] text-[#A8C8B8]">100% License Verification Confirmed</p>
          </div>

          <div className="aura-glass rounded-2xl p-5 border border-emerald-500/25 space-y-2">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Encounters Today
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-[#FAF8F2]">64</span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full">
                28 Telehealth
              </span>
            </div>
            <p className="text-[11px] text-[#A8C8B8]">Average encounter duration: 18.4 mins</p>
          </div>

          <div className="aura-glass rounded-2xl p-5 border border-amber-500/25 space-y-2">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              System Telemetry Latency
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-amber-400">24 ms</span>
              <span className="text-xs text-amber-300 font-bold bg-amber-500/15 px-2 py-0.5 rounded-full">
                Sub-50ms SLA
              </span>
            </div>
            <p className="text-[11px] text-[#A8C8B8]">Zero dropped WebRTC audio frames</p>
          </div>
        </div>

        {/* TAB 1: OPERATIONS OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 aura-glass rounded-3xl p-6 border border-[#2DD4BF]/20 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#2DD4BF]/15">
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#FAF8F2]">
                    Clinical Department Capacity & Encounters
                  </h3>
                  <p className="text-xs text-[#9AAEAA]">
                    Live telemetry load balancing and physician appointment allocation
                  </p>
                </div>
                <span className="text-xs font-mono text-[#8AF5D0]">All Systems Optimal</span>
              </div>

              {/* Department Capacity Bars */}
              <div className="space-y-4 pt-2">
                {[
                  { name: "Cardiovascular Medicine", doctors: 6, patients: 480, load: 78, color: "bg-[#2DD4BF]" },
                  { name: "Division of Neuroscience", doctors: 4, patients: 320, load: 64, color: "bg-indigo-500" },
                  { name: "Endocrinology & Longevity", doctors: 5, patients: 390, load: 82, color: "bg-emerald-400" },
                  { name: "Comprehensive Primary Care", doctors: 3, patients: 238, load: 55, color: "bg-amber-400" },
                ].map((dept, i) => (
                  <div key={i} className="rounded-2xl bg-[#071514] p-4 border border-[#2DD4BF]/15 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#FAF8F2] text-sm">{dept.name}</span>
                      <span className="text-[#9AAEAA]">
                        {dept.doctors} Clinicians • {dept.patients} Patients
                      </span>
                    </div>
                    <div className="w-full bg-[#0B2523] h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`${dept.color} h-full rounded-full transition-all duration-700`}
                        style={{ width: `${dept.load}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#A8C8B8]">
                      <span>Clinical Capacity: {dept.load}%</span>
                      <span>Queue SLA: &lt; 5 mins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Compliance */}
            <div className="lg:col-span-4 space-y-6">
              <div className="aura-glass rounded-3xl p-6 border border-[#2DD4BF]/20 space-y-4">
                <h3 className="text-sm font-bold font-heading text-[#FAF8F2] flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#2DD4BF]" />
                  <span>Security & Compliance Status</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#071514] border border-[#2DD4BF]/15">
                    <span>HIPAA Security Rule</span>
                    <span className="text-emerald-400 font-bold">100% Pass</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#071514] border border-[#2DD4BF]/15">
                    <span>SOC2 Type II Audit</span>
                    <span className="text-emerald-400 font-bold">Certified</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#071514] border border-[#2DD4BF]/15">
                    <span>FHIR R4 Gateway</span>
                    <span className="text-emerald-400 font-bold">Online</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#071514] border border-[#2DD4BF]/15">
                    <span>256-Bit Vault Backup</span>
                    <span className="text-[#8AF5D0] font-bold">Every 15m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRACTITIONERS DIRECTORY */}
        {activeTab === "users" && (
          <div className="aura-glass rounded-3xl p-6 border border-[#2DD4BF]/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2DD4BF]/15">
              <div>
                <h3 className="text-lg font-bold font-heading text-[#FAF8F2]">
                  Registered Medical Staff Roster
                </h3>
                <p className="text-xs text-[#9AAEAA]">
                  Manage licensed physicians, NPI credentials, and active caseloads
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#9AAEAA]" />
                  <input
                    type="text"
                    placeholder="Search doctor or NPI..."
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    className="rounded-xl bg-[#071514] border border-[#2DD4BF]/20 pl-9 pr-3 py-2 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
                  />
                </div>

                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="rounded-xl bg-[#071514] border border-[#2DD4BF]/20 px-3 py-2 text-xs text-[#FAF8F2] focus:outline-none"
                >
                  <option value="all">All Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Primary Care">Primary Care</option>
                </select>
              </div>
            </div>

            {/* Practitioner Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#FAF8F2]">
                <thead className="bg-[#071514] text-[#9AAEAA] uppercase text-[10px] tracking-wider border-b border-[#2DD4BF]/15">
                  <tr>
                    <th className="py-3 px-4">Physician Name</th>
                    <th className="py-3 px-4">Specialty</th>
                    <th className="py-3 px-4">NPI License</th>
                    <th className="py-3 px-4">Hospital Facility</th>
                    <th className="py-3 px-4">Active Roster</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2DD4BF]/10">
                  {filteredPractitioners.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#0B2523]/40 transition">
                      <td className="py-3.5 px-4 font-bold text-[#8AF5D0]">{doc.name}</td>
                      <td className="py-3.5 px-4">{doc.specialty}</td>
                      <td className="py-3.5 px-4 font-mono text-[#A8C8B8]">{doc.npi}</td>
                      <td className="py-3.5 px-4 text-[#9AAEAA]">{doc.hospital}</td>
                      <td className="py-3.5 px-4 font-mono">{doc.activePatients} Patients</td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DEPARTMENT CENTERS */}
        {activeTab === "departments" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctorProfiles.map((doc) => (
              <div
                key={doc.id}
                className="aura-glass rounded-3xl p-6 border border-[#2DD4BF]/20 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-[#2DD4BF]/30"
                  />
                  <div>
                    <h4 className="text-base font-bold text-[#FAF8F2] font-heading">{doc.name}</h4>
                    <p className="text-xs text-[#8AF5D0] font-semibold">{doc.department}</p>
                    <p className="text-xs text-[#9AAEAA]">{doc.hospital}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="rounded-xl bg-[#071514] p-3 border border-[#2DD4BF]/15">
                    <span className="text-[#9AAEAA] text-[10px]">Head of Department</span>
                    <p className="font-bold text-[#FAF8F2] mt-0.5">{doc.name}</p>
                  </div>
                  <div className="rounded-xl bg-[#071514] p-3 border border-[#2DD4BF]/15">
                    <span className="text-[#9AAEAA] text-[10px]">Registry Credential</span>
                    <p className="font-bold font-mono text-[#8AF5D0] mt-0.5">NPI-{doc.npi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === "audit" && (
          <div className="aura-glass rounded-3xl p-6 border border-[#2DD4BF]/20 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#2DD4BF]/15">
              <div>
                <h3 className="text-lg font-bold font-heading text-[#FAF8F2]">
                  Real-Time Clinical Audit Log
                </h3>
                <p className="text-xs text-[#9AAEAA]">
                  Cryptographically verified event stream for HIPAA compliance monitoring
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                Tamper-Evident Active
              </span>
            </div>

            <div className="space-y-3">
              {auditEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl bg-[#071514] p-4 border border-[#2DD4BF]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#8AF5D0]" />
                    <div>
                      <p className="font-bold text-[#FAF8F2]">{ev.event}</p>
                      <p className="text-[#9AAEAA] text-[11px]">Actor: {ev.user}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <span className="text-[10px] text-[#A8C8B8] font-mono">{ev.time}</span>
                    <span className="rounded-full bg-[#2DD4BF]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#8AF5D0] border border-[#2DD4BF]/30">
                      {ev.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
