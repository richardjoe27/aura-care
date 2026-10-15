"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Pill,
  FileText,
  Heart,
  Video,
  Sparkles,
  ChevronRight,
  Clock,
  Lock,
  Zap,
  CheckCircle2,
  Menu,
  X,
  Bluetooth,
  AlertTriangle,
  Cpu,
  Layers,
  Check,
  Shield,
  Smartphone,
  Hospital,
} from "lucide-react";
import { Doctor } from "../types/health";

interface LandingPageProps {
  onStartJourney: () => void;
  onSignIn: (role?: "patient" | "doctor" | "admin") => void;
  onBookDoctor?: (doc?: Doctor) => void;
  onOpenSOS: () => void;
  isWatchConnected?: boolean;
  connectedWatchName?: string;
  isRealWatch?: boolean;
  currentHeartRate?: number;
  onConnectWatch?: (deviceName: string, isReal?: boolean) => void;
  onDisconnectWatch?: () => void;
  onSyncVitals?: (data: { heartRate: number; spo2: number; steps: number }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartJourney,
  onSignIn,
  onOpenSOS,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Comprehensive Services Catalog
  const servicesList = [
    {
      id: "wearable-sync",
      icon: Bluetooth,
      title: "Real-Time Smartwatch & Wearable Biometric Sync",
      badge: "Web Bluetooth BLE 5.3",
      color: "from-teal-500/20 to-emerald-500/20 border-[#2DD4BF]/40 text-[#8AF5D0]",
      desc: "Connect your real physical Apple Watch, Garmin, Polar H10, or Whoop 4.0 strap directly in your browser via the W3C Web Bluetooth standard (GATT UUID 0x180D). Captures continuous optical PPG heart rate, ECG waveforms, SpO2 oxygenation, and nocturnal trends with zero companion app installations.",
      features: [
        "Direct Web Bluetooth GATT Service (0x180D)",
        "Continuous Optical PPG Pulse & ECG Waveforms",
        "Battery & RR-Interval (HRV) Live Telemetry",
        "High-Fidelity Simulated Demo Watch Profiles Included",
      ],
    },
    {
      id: "telehealth",
      icon: Video,
      title: "Encrypted HD Telehealth Video Consultations",
      badge: "Direct Google Meet",
      color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-300",
      desc: "Consult with distinguished board-certified specialists in cardiology, neurology, and endocrinology over direct, real Google Meet video rooms (https://meet.google.com/new). Attending doctors inspect your synchronized wearable vitals in real time during the consultation to make accurate clinical diagnoses.",
      features: [
        "Direct Google Meet 1-Click Launch",
        "Physician Live Smartwatch Vitals Overlay",
        "Doctor Authorized e-Prescription Dispatch",
        "Encrypted WebRTC Secondary Video Fallback",
      ],
    },
    {
      id: "medications",
      icon: Pill,
      title: "Intelligent Medication Tracker & Adherence OS",
      badge: "Pharmacokinetics OS",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300",
      desc: "Maintain strict prescription adherence with intelligent chronological dosing reminders across Morning, Afternoon, Evening, and Night. Features food interaction advisories, meal timing instructions, 1-click adherence logging, and automated physician refill requests.",
      features: [
        "Time-of-Day Adherence Scheduling",
        "Meal Interaction & Food Guidance Warnings",
        "Doctor Authorized e-Prescriptions Integration",
        "Refill Inventory & Missed Dose Notifications",
      ],
    },
    {
      id: "lab-vault",
      icon: FileText,
      title: "Certified Digital Health Vault & Diagnostic Lab Analytics",
      badge: "HIPAA AES-256 Vault",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300",
      desc: "Securely aggregate complete blood counts, comprehensive metabolic panels (CMP), lipid fractions, HbA1c, and endocrine panels in one military-grade encrypted vault. Compare results against AHA/ACC clinical reference intervals and generate certified, physician-signed diagnostic PDF summaries.",
      features: [
        "Clinical Reference Range Comparisons",
        "Certified Encrypted Diagnostic PDF Downloads",
        "HL7 / FHIR Standard Clinical Interoperability",
        "Longitudinal Biomarker History & Trend Graphs",
      ],
    },
    {
      id: "health-story",
      icon: Sparkles,
      title: "My Health Story (Signature Longitudinal Care Narrative)",
      badge: "Patented Innovation",
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300",
      desc: "Break free from disjointed records. My Health Story synthesizes doctor consult notes, medication changes, biometric telemetry dips, and diagnostic lab panels into an interactive chronological visual narrative that any attending clinician can review in 60 seconds.",
      features: [
        "Unified Visual Chronological Medical Journey",
        "Interactive Biomarker Milestone Links",
        "Cross-Condition Correlation Diagnostics",
        "Instant Clinician Comprehensive Handoff",
      ],
    },
    {
      id: "emergency-sos",
      icon: AlertTriangle,
      title: "24/7 Rapid Emergency Medical SOS & Haptic Watch Relays",
      badge: "Life-Saving Safety",
      color: "from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300",
      desc: "Immediate 1-click emergency medical beacon designed for EMT first responders and emergency room personnel. Presents critical blood group (O+), drug allergies, current statin regimens, and emergency contact dispatches with simultaneous high-priority vibration and SMS relays to the patient's paired smartwatch.",
      features: [
        "1-Click First Responder Medical Beacon",
        "Smartwatch Haptic SMS Transmission Relay",
        "Blood Group & Drug Allergy Rapid Broadcast",
        "Direct Emergency Hospital Contact Dispatch",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#071514] text-[#FAF8F2] overflow-x-hidden selection:bg-[#2DD4BF]/30 selection:text-[#FAF8F2]">
      {/* FLOATING TRANSLUCENT NAVIGATION BAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 ${
          isScrolled ? "py-2.5" : "py-5"
        }`}
      >
        <div
          className={`mx-auto max-w-7xl rounded-2xl transition-all duration-300 flex items-center justify-between px-5 py-3 ${
            isScrolled
              ? "bg-[#071514]/90 backdrop-blur-xl border border-[#2DD4BF]/30 shadow-2xl shadow-black/60"
              : "bg-[#0B2523]/50 backdrop-blur-md border border-[#2DD4BF]/15"
          }`}
        >
          {/* Logo / Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0B2523] via-[#2DD4BF] to-[#8AF5D0] p-0.5 shadow-lg shadow-[#2DD4BF]/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#071514]">
                <Activity className="h-5 w-5 text-[#8AF5D0] animate-pulse-heart" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#FAF8F2] font-heading">
                  Aura<span className="text-[#2DD4BF]">Care</span>
                </span>
                <span className="rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 px-2 py-0.5 text-[9px] font-extrabold text-[#8AF5D0] uppercase tracking-wider">
                  OS 3.2
                </span>
              </div>
              <p className="text-[10px] text-[#9AAEAA] hidden sm:block tracking-wide font-medium">
                INTELLIGENT CLINICAL HEALTH OS
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links: ONLY About and Services */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#A8C8B8]">
            <a href="#about" className="hover:text-[#8AF5D0] transition-colors">
              About
            </a>
            <a href="#services" className="hover:text-[#8AF5D0] transition-colors">
              Services
            </a>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onSignIn("patient")}
              className="text-xs font-bold text-[#FAF8F2] hover:text-[#8AF5D0] px-3.5 py-2 transition cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={onStartJourney}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-4 py-2 text-xs font-black text-[#071514] shadow-md shadow-[#2DD4BF]/25 transition hover:scale-105 hover:shadow-lg font-heading cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#FAF8F2] hover:text-[#8AF5D0]"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-[#071514]/95 backdrop-blur-2xl border border-[#2DD4BF]/25 p-5 space-y-4 shadow-2xl">
            <div className="flex flex-col gap-3 text-sm font-semibold text-[#A8C8B8]">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#8AF5D0]"
              >
                About AuraCare
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#8AF5D0]"
              >
                Our Clinical Services
              </a>
            </div>
            <div className="pt-3 border-t border-[#2DD4BF]/15 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn("patient");
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-[#FAF8F2] bg-[#0B2523] border border-[#2DD4BF]/20 cursor-pointer"
              >
                Sign In to Portal
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartJourney();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-black text-[#071514] bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] cursor-pointer"
              >
                Enter Health OS
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================
          HERO SECTION: CLEAN, ELEGANT INTRODUCTION
         ======================================================== */}
      <section
        id="hero"
        className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center"
      >
        {/* Ambient Backlighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#2DD4BF]/10 blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 aura-grid-pattern opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Eyebrow Trust Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#8AF5D0] bg-[#0B2523]/90 border border-[#2DD4BF]/30 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8AF5D0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2DD4BF]"></span>
            </span>
            <span>SMART HEALTH MANAGEMENT · AURA CARE OS</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] font-heading">
            Your health. <br />
            <span className="aura-text-gradient">A more beautiful kind of connected.</span>
          </h1>

          {/* Supporting Overview Text */}
          <p className="text-base sm:text-lg text-[#9AAEAA] max-w-2xl mx-auto leading-relaxed">
            The unified healthcare operating system bridging{" "}
            <strong className="text-[#FAF8F2]">real-time smartwatch biometrics</strong>, direct{" "}
            <strong className="text-[#FAF8F2]">doctor video consultations via Google Meet</strong>,
            smart <strong className="text-[#FAF8F2]">prescription schedules</strong>, and certified{" "}
            <strong className="text-[#FAF8F2]">clinical lab diagnostics</strong>.
          </p>

          {/* CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartJourney}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#2DD4BF] via-[#8AF5D0] to-[#2DD4BF] px-8 py-4 text-sm font-black text-[#071514] shadow-xl shadow-[#2DD4BF]/25 transition hover:scale-105 hover:shadow-2xl font-heading cursor-pointer"
            >
              <span>Enter Patient Portal</span>
              <ArrowRight className="h-4 w-4 text-[#071514]" />
            </button>

            <a
              href="#about"
              className="flex items-center gap-2 rounded-2xl aura-glass px-6 py-4 text-sm font-bold text-[#FAF8F2] border border-[#2DD4BF]/25 hover:border-[#8AF5D0] hover:text-[#8AF5D0] transition"
            >
              <span>About the Platform</span>
              <ChevronRight className="h-4 w-4" />
            </a>

            <a
              href="#services"
              className="flex items-center gap-2 rounded-2xl bg-[#071514] px-6 py-4 text-sm font-bold text-[#A8C8B8] border border-[#2DD4BF]/20 hover:text-white hover:border-[#2DD4BF]/40 transition"
            >
              <span>View All Services</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* Performance & Clinical Credentials */}
          <div className="pt-8 border-t border-[#2DD4BF]/15 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center max-w-3xl mx-auto">
            <div>
              <p className="text-2xl font-black text-[#8AF5D0] font-heading">99.98%</p>
              <p className="text-[11px] text-[#9AAEAA] mt-0.5">Telemetry Uptime</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#8AF5D0] font-heading">256-Bit</p>
              <p className="text-[11px] text-[#9AAEAA] mt-0.5">AES HIPAA Vault</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#8AF5D0] font-heading">50,000+</p>
              <p className="text-[11px] text-[#9AAEAA] mt-0.5">Active Patients</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#8AF5D0] font-heading">150+</p>
              <p className="text-[11px] text-[#9AAEAA] mt-0.5">Board Specialists</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 1: ABOUT AURACARE (WHAT IS THE WEBSITE ABOUT)
         ======================================================== */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold text-[#8AF5D0] bg-[#2DD4BF]/10 border border-[#2DD4BF]/25">
            <Layers className="h-3.5 w-3.5 text-[#2DD4BF]" />
            <span>WHAT IS THE WEBSITE ABOUT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading">
            About AuraCare
          </h2>
          <p className="text-sm sm:text-base text-[#9AAEAA] leading-relaxed">
            AuraCare was founded to solve the single largest crisis in modern personal medicine:
            fragmentation. Your wearable biometrics, medical consult notes, prescription bottles,
            and diagnostic lab panels live in separate, disconnected worlds.
          </p>
        </div>

        {/* Deep Explanatory Grid: The 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="aura-glass rounded-3xl p-8 border border-[#2DD4BF]/25 flex flex-col justify-between hover:border-[#8AF5D0]/50 transition-all space-y-6">
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#8AF5D0]">
                <Cpu className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#FAF8F2]">
                1. Continuous Wearable Biosensing
              </h3>
              <p className="text-xs sm:text-sm text-[#9AAEAA] leading-relaxed">
                Connect your real smartwatch or pulse monitor directly in the browser using the W3C Web
                Bluetooth standard (GATT 0x180D). AuraCare aggregates resting pulse, optical PPG,
                oxygenation, and ECG waveforms—building an active clinical baseline without requiring
                companion mobile apps.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2DD4BF]/15 text-xs text-[#8AF5D0] font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Apple Watch, Garmin, Polar & Whoop</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="aura-glass rounded-3xl p-8 border border-indigo-500/25 flex flex-col justify-between hover:border-indigo-400/50 transition-all space-y-6">
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                <Video className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#FAF8F2]">
                2. Real-Time Telehealth Encounters
              </h3>
              <p className="text-xs sm:text-sm text-[#9AAEAA] leading-relaxed">
                Schedule and launch 1-click encrypted video consultations via direct Google Meet links.
                Physicians review your real-time smartwatch telemetry overlay during the call, allowing
                for fast, accurate evaluations and instant authorized e-prescriptions.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2DD4BF]/15 text-xs text-indigo-300 font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Live Google Meet Integration</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="aura-glass rounded-3xl p-8 border border-emerald-500/25 flex flex-col justify-between hover:border-emerald-400/50 transition-all space-y-6">
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#FAF8F2]">
                3. Longitudinal Clinical Memory
              </h3>
              <p className="text-xs sm:text-sm text-[#9AAEAA] leading-relaxed">
                All patient health records, blood biomarker panels, and pharmacological histories are
                woven into our patented &quot;My Health Story&quot; chronological narrative. Secured with
                military-grade 256-bit AES encryption conforming to HIPAA and HL7/FHIR standards.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2DD4BF]/15 text-xs text-emerald-300 font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>HIPAA & HL7/FHIR Certified Vault</span>
            </div>
          </div>
        </div>

        {/* Mission Banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#0B2523] via-[#123835] to-[#0B2523] p-8 border border-[#2DD4BF]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8AF5D0]">
              <Sparkles className="h-4 w-4 text-[#2DD4BF]" />
              <span>OUR CLINICAL MISSION</span>
            </div>
            <h3 className="text-xl font-bold font-heading text-[#FAF8F2]">
              Bridging Everyday Lifestyle Biometrics with Clinical Medicine
            </h3>
            <p className="text-xs sm:text-sm text-[#9AAEAA]">
              We empower patients to take control of their biometric data while giving attending
              physicians the longitudinal context they need to prevent disease before symptoms emerge.
            </p>
          </div>
          <button
            onClick={onStartJourney}
            className="shrink-0 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-6 py-3 text-xs font-black text-[#071514] hover:scale-105 transition shadow-lg shadow-[#2DD4BF]/25 cursor-pointer"
          >
            Join AuraCare Free
          </button>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: COMPREHENSIVE CLINICAL SERVICES
         ======================================================== */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold text-[#8AF5D0] bg-[#2DD4BF]/10 border border-[#2DD4BF]/25">
            <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
            <span>FULL HEALTHCARE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading">
            Our Core Services
          </h2>
          <p className="text-sm sm:text-base text-[#9AAEAA] leading-relaxed">
            Everything required to monitor, diagnose, and maintain lifelong cardiovascular,
            metabolic, and general health in one unified, patient-centric ecosystem.
          </p>
        </div>

        {/* 6 Comprehensive Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="aura-glass-interactive rounded-3xl p-7 border border-[#2DD4BF]/25 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br border ${srv.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-[#071514] border border-[#2DD4BF]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#8AF5D0]">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-[#FAF8F2]">{srv.title}</h3>

                  <p className="text-xs sm:text-sm text-[#9AAEAA] leading-relaxed">{srv.desc}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#2DD4BF]/15">
                  {srv.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#A8C8B8]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#2DD4BF] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enter Portal Bottom Callout */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-sm text-[#9AAEAA]">
            Ready to explore your personal health records, 3D bio-scanners, and continuous vitals?
          </p>
          <button
            onClick={onStartJourney}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-8 py-3.5 text-xs font-black text-[#071514] hover:scale-105 transition shadow-xl shadow-[#2DD4BF]/25 cursor-pointer font-heading"
          >
            <span>Enter Patient Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ========================================================
          FOOTER: CLEAN & PROFESSIONAL
         ======================================================== */}
      <footer className="border-t border-[#2DD4BF]/15 bg-[#071514] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0B2523] to-[#2DD4BF] p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-[#071514]">
                  <Activity className="h-4 w-4 text-[#8AF5D0]" />
                </div>
              </div>
              <span className="text-lg font-black text-[#FAF8F2] font-heading">
                Aura<span className="text-[#2DD4BF]">Care</span>
              </span>
            </div>
            <p className="text-xs text-[#9AAEAA] leading-relaxed">
              Intelligent Clinical Health Management Ecosystem connecting continuous biometrics,
              telehealth video, and diagnostic vault memory.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-[#A8C8B8]">
            <a href="#about" className="hover:text-[#8AF5D0]">
              About Platform
            </a>
            <a href="#services" className="hover:text-[#8AF5D0]">
              Clinical Services
            </a>
            <button onClick={() => onSignIn("patient")} className="hover:text-[#8AF5D0] cursor-pointer">
              Patient Portal
            </button>
            <button onClick={() => onSignIn("doctor")} className="hover:text-[#8AF5D0] cursor-pointer">
              Doctor Workspace
            </button>
            <button onClick={onOpenSOS} className="hover:text-rose-400 font-bold text-rose-400 cursor-pointer">
              Emergency SOS
            </button>
          </div>

          <div className="text-xs text-[#9AAEAA] md:text-right space-y-1">
            <div className="flex items-center md:justify-end gap-1.5 text-[11px] text-[#8AF5D0]">
              <Lock className="h-3 w-3" />
              <span>AES-256 Bit Encryption · HIPAA Certified</span>
            </div>
            <p>© 2026 AuraCare Clinical Systems Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
