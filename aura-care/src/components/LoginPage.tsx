"use client";

import React, { useState } from "react";
import {
  Activity,
  User,
  Stethoscope,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Heart,
  Key,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Building,
  Shield,
} from "lucide-react";
import { DoctorProfile } from "../types/doctor";
import { doctorProfiles } from "../data/mockDoctorData";
import { AuraOrbVisual } from "./AuraOrbVisual";

interface LoginPageProps {
  onLoginPatient: (patientDetails: { email: string; name: string }) => void;
  onLoginDoctor: (doctorProfile: DoctorProfile) => void;
  onLoginAdmin?: () => void;
  onBackToHome?: () => void;
  initialRole?: "patient" | "doctor" | "admin";
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginPatient,
  onLoginDoctor,
  onLoginAdmin,
  onBackToHome,
  initialRole = "patient",
}) => {
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | "admin">(initialRole);

  // Patient Login Form State
  const [patientEmail, setPatientEmail] = useState("richard.joel@example.com");
  const [patientPassword, setPatientPassword] = useState("password123");
  const [showPatientPassword, setShowPatientPassword] = useState(false);

  // Doctor Login Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("doc-cardio");
  const [doctorLicense, setDoctorLicense] = useState("NPI-1982736450");
  const [doctorPassword, setDoctorPassword] = useState("doctorpass123");
  const [showDoctorPassword, setShowDoctorPassword] = useState(false);

  // Admin Login Form State
  const [adminUsername, setAdminUsername] = useState("admin@auracare.clinical");
  const [adminPassword, setAdminPassword] = useState("adminsecure2026");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Loading & Validation feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentDoctorProfile =
    doctorProfiles.find((d) => d.id === selectedDoctorId) || doctorProfiles[0];

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientEmail || !patientPassword) {
      setErrorMessage("Please enter both patient email and password.");
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginPatient({
        email: patientEmail,
        name: "Richard Joel",
      });
    }, 500);
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorLicense || !doctorPassword) {
      setErrorMessage("Please enter your NPI license number and password.");
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginDoctor(currentDoctorProfile);
    }, 500);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername || !adminPassword) {
      setErrorMessage("Please enter admin credentials.");
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginAdmin) {
        onLoginAdmin();
      }
    }, 500);
  };

  const handleDoctorSpecialtyChange = (docId: string) => {
    setSelectedDoctorId(docId);
    const chosen = doctorProfiles.find((d) => d.id === docId);
    if (chosen) {
      setDoctorLicense(`NPI-${chosen.npi}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#071514] text-[#FAF8F2] flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-4 sm:p-6 mx-auto max-w-7xl w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-xs font-bold text-[#A8C8B8] hover:text-[#8AF5D0] px-3 py-2 rounded-xl aura-glass border border-[#2DD4BF]/20 transition mr-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Overview</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0B2523] to-[#2DD4BF] p-0.5 shadow-md shadow-[#2DD4BF]/20">
              <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-[#071514]">
                <Activity className="h-4 w-4 text-[#8AF5D0] animate-pulse-heart" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#FAF8F2] font-heading">
                Aura<span className="text-[#2DD4BF]">Care</span>
              </span>
              <span className="ml-2 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 px-2 py-0.5 text-[9px] font-bold text-[#8AF5D0]">
                AUTH GATEWAY
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#A8C8B8] aura-glass px-3.5 py-1.5 rounded-full border border-[#2DD4BF]/20 shadow-sm">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>HIPAA & SOC2 Type II Encrypted</span>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          {/* Left Branded Cinematic Column */}
          <div className="lg:col-span-6 hidden lg:flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-[#8AF5D0] bg-[#0B2523] border border-[#2DD4BF]/30 w-max">
              <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
              <span>AURA INFINITY CLINICAL CLOUD</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black tracking-tight font-heading leading-tight">
              A more beautiful kind of{" "}
              <span className="aura-text-gradient">clinical connection.</span>
            </h1>

            <p className="text-sm text-[#9AAEAA] max-w-lg leading-relaxed">
              Sign in to experience seamless synchronization across continuous optical biometrics,
              board-certified physician consultations, and clinical diagnostic vaults.
            </p>

            {/* Aura Visual Showcase */}
            <div className="py-2 flex justify-center">
              <AuraOrbVisual interactive={false} showCards={false} className="scale-85" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2DD4BF]/15 text-xs">
              <div className="flex items-center gap-2 text-[#A8C8B8]">
                <Lock className="h-4 w-4 text-[#2DD4BF]" />
                <span>Zero-Trust Architecture</span>
              </div>
              <div className="flex items-center gap-2 text-[#A8C8B8]">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>FHIR-Compliant Records</span>
              </div>
            </div>
          </div>

          {/* Right Clean Form Column */}
          <div className="lg:col-span-6 max-w-xl mx-auto w-full">
            <div className="aura-glass rounded-3xl p-6 sm:p-9 border border-[#2DD4BF]/25 shadow-2xl relative">
              {/* Role Selector Tabs */}
              <div className="flex p-1 rounded-2xl bg-[#071514] border border-[#2DD4BF]/20 mb-6 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("patient");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                    selectedRole === "patient"
                      ? "bg-[#2DD4BF] text-[#071514] shadow-md shadow-[#2DD4BF]/30"
                      : "text-[#9AAEAA] hover:text-[#FAF8F2]"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("doctor");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                    selectedRole === "doctor"
                      ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                      : "text-[#9AAEAA] hover:text-[#FAF8F2]"
                  }`}
                >
                  <Stethoscope className="h-4 w-4" />
                  <span>Doctor</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("admin");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                    selectedRole === "admin"
                      ? "bg-amber-500 text-[#071514] shadow-md shadow-amber-500/30"
                      : "text-[#9AAEAA] hover:text-[#FAF8F2]"
                  }`}
                >
                  <Building className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-300">
                  {errorMessage}
                </div>
              )}

              {/* 1. PATIENT FORM */}
              {selectedRole === "patient" && (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#2DD4BF]/15">
                    <div>
                      <h2 className="text-xl font-bold font-heading text-[#FAF8F2]">
                        Patient Portal
                      </h2>
                      <p className="text-xs text-[#9AAEAA]">
                        Access your biometrics, medications & telehealth
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPatientEmail("richard.joel@example.com");
                        setPatientPassword("password123");
                      }}
                      className="rounded-lg bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 px-2.5 py-1 text-[11px] font-bold text-[#8AF5D0] hover:bg-[#2DD4BF]/25 transition"
                    >
                      Demo Fill
                    </button>
                  </div>

                  <form onSubmit={handlePatientSubmit} className="mt-5 space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-[#A8C8B8]">
                        Patient Email or Health ID
                      </label>
                      <div className="mt-1 relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#9AAEAA]" />
                        <input
                          type="email"
                          required
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          placeholder="richard.joel@example.com"
                          className="w-full rounded-xl border border-[#2DD4BF]/20 bg-[#071514] pl-10 pr-3 py-2.5 text-[#FAF8F2] placeholder-[#9AAEAA]/50 focus:border-[#2DD4BF] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-[#A8C8B8]">Password</label>
                      <div className="mt-1 relative">
                        <Key className="absolute left-3.5 top-3 h-4 w-4 text-[#9AAEAA]" />
                        <input
                          type={showPatientPassword ? "text" : "password"}
                          required
                          value={patientPassword}
                          onChange={(e) => setPatientPassword(e.target.value)}
                          placeholder="Enter patient password"
                          className="w-full rounded-xl border border-[#2DD4BF]/20 bg-[#071514] pl-10 pr-10 py-2.5 text-[#FAF8F2] placeholder-[#9AAEAA]/50 focus:border-[#2DD4BF] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPatientPassword(!showPatientPassword)}
                          className="absolute right-3.5 top-3 text-[#9AAEAA] hover:text-[#FAF8F2]"
                        >
                          {showPatientPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#071514] p-3 border border-[#2DD4BF]/20 flex items-center justify-between text-[11px] text-[#A8C8B8]">
                      <span>
                        Profile: <strong className="text-[#8AF5D0]">Richard Joel (O+, 29 yrs)</strong>
                      </span>
                      <span className="text-[#2DD4BF] font-semibold">Wearable Sync Ready</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] py-3 text-sm font-black text-[#071514] shadow-md shadow-[#2DD4BF]/30 hover:scale-[1.02] transition font-heading disabled:opacity-50"
                    >
                      <span>{isLoading ? "Authenticating..." : "Enter Patient Portal"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* 2. DOCTOR FORM */}
              {selectedRole === "doctor" && (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#2DD4BF]/15">
                    <div>
                      <h2 className="text-xl font-bold font-heading text-[#FAF8F2]">
                        Clinician Workspace
                      </h2>
                      <p className="text-xs text-[#9AAEAA]">
                        Practitioner credentials & medical specialty
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleDoctorSpecialtyChange("doc-cardio");
                        setDoctorPassword("doctorpass123");
                      }}
                      className="rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-[11px] font-bold text-indigo-300 hover:bg-indigo-500/25 transition"
                    >
                      Demo Fill
                    </button>
                  </div>

                  <form onSubmit={handleDoctorSubmit} className="mt-5 space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-[#A8C8B8]">
                        Select Physician Specialty & Profile
                      </label>
                      <select
                        value={selectedDoctorId}
                        onChange={(e) => handleDoctorSpecialtyChange(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#2DD4BF]/20 bg-[#071514] px-3 py-2.5 text-[#FAF8F2] font-medium focus:border-indigo-400 focus:outline-none"
                      >
                        {doctorProfiles.map((doc) => (
                          <option key={doc.id} value={doc.id} className="bg-[#071514]">
                            {doc.specialty} — {doc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-[#A8C8B8]">Medical License / NPI</label>
                        <input
                          type="text"
                          required
                          value={doctorLicense}
                          onChange={(e) => setDoctorLicense(e.target.value)}
                          placeholder="NPI-1982736450"
                          className="mt-1 w-full rounded-xl border border-[#2DD4BF]/20 bg-[#071514] px-3 py-2.5 text-[#FAF8F2] focus:border-indigo-400 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-[#A8C8B8]">Password</label>
                        <div className="mt-1 relative">
                          <input
                            type={showDoctorPassword ? "text" : "password"}
                            required
                            value={doctorPassword}
                            onChange={(e) => setDoctorPassword(e.target.value)}
                            placeholder="Physician password"
                            className="w-full rounded-xl border border-[#2DD4BF]/20 bg-[#071514] px-3 pr-9 py-2.5 text-[#FAF8F2] focus:border-indigo-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowDoctorPassword(!showDoctorPassword)}
                            className="absolute right-2.5 top-2.5 text-[#9AAEAA]"
                          >
                            {showDoctorPassword ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Selected Doctor Summary Card */}
                    <div className="rounded-xl bg-[#071514] p-3 border border-indigo-500/25 flex items-center gap-3">
                      <img
                        src={currentDoctorProfile.avatar}
                        alt={currentDoctorProfile.name}
                        className="h-10 w-10 rounded-full object-cover border border-indigo-400/40"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-[#FAF8F2] text-xs">
                          {currentDoctorProfile.name}
                        </p>
                        <p className="text-[11px] text-indigo-300 font-semibold">
                          {currentDoctorProfile.specialty} • {currentDoctorProfile.hospital}
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 hover:scale-[1.02] transition font-heading disabled:opacity-50"
                    >
                      <span>
                        {isLoading
                          ? "Authenticating..."
                          : `Launch Doctor Dashboard (${currentDoctorProfile.specialty})`}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* 3. ADMIN FORM */}
              {selectedRole === "admin" && (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#2DD4BF]/15">
                    <div>
                      <h2 className="text-xl font-bold font-heading text-[#FAF8F2]">
                        Hospital Admin Suite
                      </h2>
                      <p className="text-xs text-[#9AAEAA]">
                        Operational oversight, analytics & audit
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminUsername("admin@auracare.clinical");
                        setAdminPassword("adminsecure2026");
                      }}
                      className="rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/25 transition"
                    >
                      Demo Fill
                    </button>
                  </div>

                  <form onSubmit={handleAdminSubmit} className="mt-5 space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-[#A8C8B8]">Admin Console Email</label>
                      <div className="mt-1 relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#9AAEAA]" />
                        <input
                          type="email"
                          required
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          placeholder="admin@auracare.clinical"
                          className="w-full rounded-xl border border-[#2DD4BF]/20 bg-[#071514] pl-10 pr-3 py-2.5 text-[#FAF8F2] focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-[#A8C8B8]">Master Security Key</label>
                      <div className="mt-1 relative">
                        <Key className="absolute left-3.5 top-3 h-4 w-4 text-[#9AAEAA]" />
                        <input
                          type={showAdminPassword ? "text" : "password"}
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Enter admin password"
                          className="w-full rounded-xl border border-[#2DD4BF]/20 bg-[#071514] pl-10 pr-10 py-2.5 text-[#FAF8F2] focus:border-amber-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          className="absolute right-3.5 top-3 text-[#9AAEAA]"
                        >
                          {showAdminPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#071514] p-3 border border-amber-500/25 text-[11px] text-[#A8C8B8]">
                      Master Operator: <strong className="text-amber-300">Chief Medical Officer (CMO)</strong>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-black text-[#071514] shadow-md shadow-amber-500/25 hover:scale-[1.02] transition font-heading disabled:opacity-50"
                    >
                      <span>{isLoading ? "Authenticating..." : "Enter Admin Workspace"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 sm:p-6 mx-auto max-w-7xl w-full text-center text-xs text-[#9AAEAA]">
        <p>© 2026 AuraCare Clinical Systems Inc. 256-Bit SSL Encrypted Healthcare Infrastructure.</p>
      </footer>
    </div>
  );
};
