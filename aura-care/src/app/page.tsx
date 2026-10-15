"use client";

import React, { useState } from "react";
import { LandingPage } from "../components/LandingPage";
import { LoginPage } from "../components/LoginPage";
import { DoctorDashboard } from "../components/DoctorDashboard";
import { AdminDashboard } from "../components/AdminDashboard";
import { Header } from "../components/Header";
import { VitalsGrid } from "../components/VitalsGrid";
import { MedicationTracker } from "../components/MedicationTracker";
import { AppointmentsSection } from "../components/AppointmentsSection";
import { LabReportsSection } from "../components/LabReportsSection";
import { MyHealthStory } from "../components/MyHealthStory";
import { AuraAIChat } from "../components/AuraAIChat";
import { EmergencyModal } from "../components/EmergencyModal";
import { LogVitalsModal } from "../components/LogVitalsModal";
import { BookAppointmentModal } from "../components/BookAppointmentModal";
import { TelehealthRoomModal } from "../components/TelehealthRoomModal";
import { SmartwatchModal } from "../components/SmartwatchModal";
import { WatchAlertSMSModal } from "../components/WatchAlertSMSModal";
import { Body3DVisual } from "../components/3d/Body3DVisual";
import { ToastContainer, ToastMessage } from "../components/Toast";
import {
  initialVitals,
  initialMedications,
  doctorsList,
  initialAppointments,
  initialLabReports,
} from "../data/mockHealthData";
import { doctorProfiles } from "../data/mockDoctorData";
import {
  VitalMetric,
  Medication,
  Appointment,
  LabReport,
  Doctor,
} from "../types/health";
import { DoctorProfile } from "../types/doctor";
import {
  Activity,
  Heart,
  Calendar,
  Pill,
  FileText,
  Bot,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock,
  Video,
  Watch,
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  // Role State: "landing" (Public Web Experience) | "login" (Auth Gateway) | "patient" | "doctor" | "admin"
  const [currentUserRole, setCurrentUserRole] = useState<
    "landing" | "login" | "patient" | "doctor" | "admin"
  >("landing");

  const [authTargetRole, setAuthTargetRole] = useState<"patient" | "doctor" | "admin">("patient");
  const [currentDoctorProfile, setCurrentDoctorProfile] = useState<DoctorProfile>(doctorProfiles[0]);

  // Smartwatch State: Defaults to false so user connects wearable before seeing live telemetry
  const [isSmartwatchOpen, setIsSmartwatchOpen] = useState(false);
  const [isWatchConnected, setIsWatchConnected] = useState(false);
  const [isRealWatch, setIsRealWatch] = useState(false);
  const [connectedWatchName, setConnectedWatchName] = useState("Apple Watch Ultra 2");
  const [currentHeartRate, setCurrentHeartRate] = useState(72);
  const [isWatchSmsModalOpen, setIsWatchSmsModalOpen] = useState(false);
  const [incomingWatchSms, setIncomingWatchSms] = useState<{
    title: string;
    message: string;
    timestamp: string;
    isCritical?: boolean;
  } | null>(null);

  // Patient Dashboard State
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [vitals, setVitals] = useState<VitalMetric[]>(initialVitals);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [labReports, setLabReports] = useState<LabReport[]>(initialLabReports);
  const [waterIntake, setWaterIntake] = useState<number>(2100);
  const waterGoal = 3000;

  // Modals state
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isLogVitalsOpen, setIsLogVitalsOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | undefined>(
    undefined
  );
  const [isTelehealthOpen, setIsTelehealthOpen] = useState(false);
  const [telehealthAppointment, setTelehealthAppointment] = useState<Appointment | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "info" | "warning", title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Smartwatch Handlers
  const handleConnectWatch = (deviceName: string, isReal: boolean = false) => {
    setIsWatchConnected(true);
    setIsRealWatch(isReal);
    setConnectedWatchName(deviceName);
    addToast(
      "success",
      isReal ? "Real Smartwatch Linked (Web Bluetooth)" : "Smartwatch Paired",
      isReal
        ? `${deviceName} is streaming continuous optical PPG heart rate via Web Bluetooth BLE 5.3 GATT service.`
        : `${deviceName} is now streaming continuous PPG heart rate and biometrics.`
    );
  };

  const handleDisconnectWatch = () => {
    setIsWatchConnected(false);
    setIsRealWatch(false);
    addToast("info", "Smartwatch Disconnected", "Continuous telemetry stream paused.");
  };

  const handleSyncWatchVitals = (data: { heartRate: number; spo2: number; steps: number }) => {
    setCurrentHeartRate(data.heartRate);
    setVitals((prev) =>
      prev.map((v) => {
        if (v.id === "heart-rate") {
          return {
            ...v,
            value: data.heartRate.toString(),
            history: [...v.history.slice(1), data.heartRate],
          };
        }
        if (v.id === "spo2") {
          return {
            ...v,
            value: data.spo2.toString(),
          };
        }
        return v;
      })
    );
  };

  const handleSendSmsToWatch = (sms: {
    title: string;
    message: string;
    timestamp: string;
    isCritical?: boolean;
  }) => {
    setIncomingWatchSms(sms);
    addToast(
      sms.isCritical ? "warning" : "info",
      `Haptic SMS Sent to ${connectedWatchName}`,
      sms.title
    );
  };

  // Automatic SMS transmission upon completing any health/sensor scan
  const handleScanCompleteAndAutoSendSms = (scanResult: { systemName: string; metric: string; sub: string }) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const sms = {
      title: `SCAN: ${scanResult.systemName} Verified`,
      message: `Multisystem 3D scan complete. ${scanResult.systemName} verified at ${scanResult.metric} (${scanResult.sub}). Live pulse: ${currentHeartRate} BPM. Calibrated & synced to AuraCare EHR.`,
      timestamp,
      isCritical: false,
    };
    setIncomingWatchSms(sms);
    addToast(
      "success",
      `📡 Scan Complete · SMS Auto-Sent to ${connectedWatchName}`,
      `${scanResult.systemName} (${scanResult.metric}) telemetry transmitted to watch with haptic alert.`
    );
  };

  const handleRunVitalsScanAndSendSms = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const sms = {
      title: "VITALS SCAN: Full Biometrics Calibrated",
      message: `Optical PPG scan complete. Pulse: ${currentHeartRate} BPM, BP: 118/76 mmHg, SpO2: 99%, Recovery: 94%. Telemetry locked & verified.`,
      timestamp,
      isCritical: false,
    };
    setIncomingWatchSms(sms);
    addToast(
      "success",
      `📡 Optical Sensor Scan Complete · SMS Auto-Sent to ${connectedWatchName}`,
      `Pulse ${currentHeartRate} BPM, BP 118/76 mmHg and SpO2 99% transmitted to watch.`
    );
  };

  const handleDismissWatchSms = () => {
    setIncomingWatchSms(null);
  };

  // Handlers for Patient Portal
  const handleWaterAdded = (amount: number) => {
    setWaterIntake((prev) => {
      const next = prev + amount;
      addToast(
        "info",
        `Logged +${amount} ml Water`,
        `Current total: ${(next / 1000).toFixed(2)} L of ${(waterGoal / 1000).toFixed(1)} L goal.`
      );
      return next;
    });
  };

  const handleToggleMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const newState = !med.taken;
          addToast(
            newState ? "success" : "info",
            newState ? `Marked ${med.name} as Taken` : `Medication status reset`,
            newState ? "Good job keeping on schedule!" : undefined
          );
          return { ...med, taken: newState };
        }
        return med;
      })
    );
  };

  const handleAddMedication = (newMed: Omit<Medication, "id" | "taken">) => {
    const created: Medication = {
      ...newMed,
      id: `med-${Date.now()}`,
      taken: false,
    };
    setMedications((prev) => [...prev, created]);
    addToast("success", "Prescription Added", `${created.name} scheduled for ${created.time}.`);
  };

  const handleSaveVitals = (data: {
    heartRate?: number;
    systolic?: number;
    diastolic?: number;
    glucose?: number;
    spo2?: number;
    temp?: number;
  }) => {
    setVitals((prev) =>
      prev.map((v) => {
        if (v.id === "heart-rate" && data.heartRate) {
          setCurrentHeartRate(data.heartRate);
          return {
            ...v,
            value: data.heartRate.toString(),
            history: [...v.history.slice(1), data.heartRate],
          };
        }
        if (v.id === "blood-pressure" && data.systolic && data.diastolic) {
          return {
            ...v,
            value: `${data.systolic}/${data.diastolic}`,
            history: [...v.history.slice(1), data.systolic],
          };
        }
        if (v.id === "blood-glucose" && data.glucose) {
          return {
            ...v,
            value: data.glucose.toString(),
            history: [...v.history.slice(1), data.glucose],
          };
        }
        if (v.id === "spo2" && data.spo2) {
          return {
            ...v,
            value: data.spo2.toString(),
            history: [...v.history.slice(1), data.spo2],
          };
        }
        if (v.id === "body-temp" && data.temp) {
          return {
            ...v,
            value: data.temp.toString(),
            history: [...v.history.slice(1), data.temp],
          };
        }
        return v;
      })
    );
    addToast("success", "Clinical Vitals Updated", "Telemetry synced with patient health records.");
  };

  const handleConfirmBooking = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
    addToast(
      "success",
      "Consultation Booked",
      `Scheduled with ${newApt.doctorName} for ${newApt.date} at ${newApt.time}.`
    );
  };

  const handleOpenBookModal = (preselectedDoc?: Doctor) => {
    setSelectedDoctorForBooking(preselectedDoc);
    setIsBookOpen(true);
  };

  const handleJoinTelehealth = (apt: Appointment) => {
    setTelehealthAppointment(apt);
    setIsTelehealthOpen(true);
  };

  const handleDownloadReport = (report: LabReport) => {
    const reportText = `======================================================
AURACARE CLINICAL HEALTH RECORD SUMMARY
======================================================
Patient: Richard Joel | Blood: O+ | DOB: 14/05/1997
Test: ${report.testName}
Category: ${report.category}
Date: ${report.date}
Clinician: ${report.doctor}
Overall Status: ${report.status}
------------------------------------------------------
BIOMARKER RESULTS:
${report.metrics
  .map(
    (m) =>
      `• ${m.name.padEnd(30, " ")}: ${m.result} ${m.unit} (Ref: ${m.reference} ${m.unit}) [${m.status.toUpperCase()}]`
  )
  .join("\n")}
------------------------------------------------------
CLINICAL INTERPRETATION:
${report.summary}
======================================================
Certified encrypted document issued via AuraCare Clinical OS.`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.testName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_report.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast("success", "Report Exported", "Diagnostic summary downloaded successfully.");
  };

  const handleUploadMockReport = (newReport: LabReport) => {
    setLabReports((prev) => [newReport, ...prev]);
    addToast("success", "Report Archived", `${newReport.testName} added to your health vault.`);
  };

  const handleTriggerSOS = () => {
    addToast("warning", "SOS Beacon Dispatched", "Emergency contacts & hospital alerted.");
  };

  // Handlers for Doctor Portal
  const handleDoctorLaunchTelehealth = (patientName: string) => {
    const docApt: Appointment = {
      id: `doc-tele-${Date.now()}`,
      doctorId: currentDoctorProfile.id,
      doctorName: currentDoctorProfile.name,
      doctorSpecialty: currentDoctorProfile.specialty,
      doctorAvatar: currentDoctorProfile.avatar,
      date: "Today",
      time: "Now",
      type: "Telehealth Video",
      status: "Confirmed",
      reason: `Live clinician evaluation with ${patientName}`,
    };
    setTelehealthAppointment(docApt);
    setIsTelehealthOpen(true);
    addToast("info", "Connecting to Patient", `Initiating WebRTC room for ${patientName}...`);
  };

  const handleDoctorPrescribe = (patientName: string, medName: string, dosage: string) => {
    addToast(
      "success",
      "e-Prescription Transmitted",
      `Authorized ${medName} (${dosage}) for ${patientName} by ${currentDoctorProfile.name}. Sent to pharmacy.`
    );
    if (patientName.includes("Richard")) {
      setMedications((prev) => [
        ...prev,
        {
          id: `med-${Date.now()}`,
          name: medName,
          dosage: dosage,
          time: "09:00 AM",
          period: "Morning",
          withFood: true,
          taken: false,
          instructions: `Take as authorized by ${currentDoctorProfile.name}.`,
        },
      ]);
    }
  };

  // 1. PUBLIC CINEMATIC LANDING PAGE
  if (currentUserRole === "landing") {
    return (
      <>
        <LandingPage
          onStartJourney={() => {
            setAuthTargetRole("patient");
            setCurrentUserRole("login");
          }}
          onSignIn={(role) => {
            setAuthTargetRole(role || "patient");
            setCurrentUserRole("login");
          }}
          onBookDoctor={(doc) => {
            handleOpenBookModal(doc);
          }}
          onOpenSOS={() => setIsSOSOpen(true)}
          isWatchConnected={isWatchConnected}
          connectedWatchName={connectedWatchName}
          isRealWatch={isRealWatch}
          currentHeartRate={currentHeartRate}
          onConnectWatch={handleConnectWatch}
          onDisconnectWatch={handleDisconnectWatch}
          onSyncVitals={handleSyncWatchVitals}
        />
        <BookAppointmentModal
          isOpen={isBookOpen}
          onClose={() => setIsBookOpen(false)}
          doctors={doctorsList}
          selectedDoctor={selectedDoctorForBooking}
          onConfirmBooking={handleConfirmBooking}
        />
        <EmergencyModal
          isOpen={isSOSOpen}
          onClose={() => setIsSOSOpen(false)}
          onTriggerSOS={handleTriggerSOS}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // 2. AUTHENTICATION GATEWAY
  if (currentUserRole === "login") {
    return (
      <>
        <LoginPage
          initialRole={authTargetRole}
          onBackToHome={() => setCurrentUserRole("landing")}
          onLoginPatient={(patientDetails) => {
            setCurrentUserRole("patient");
            addToast("success", "Welcome Back", `Signed in as ${patientDetails.name}.`);
          }}
          onLoginDoctor={(doctorProfile) => {
            setCurrentDoctorProfile(doctorProfile);
            setCurrentUserRole("doctor");
            addToast(
              "success",
              "Clinician Authenticated",
              `Welcome, ${doctorProfile.name} (${doctorProfile.specialty}).`
            );
          }}
          onLoginAdmin={() => {
            setCurrentUserRole("admin");
            addToast("success", "Admin Console Authenticated", "Logged in as Chief Medical Officer.");
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // 3. ADMINISTRATOR WORKSPACE
  if (currentUserRole === "admin") {
    return (
      <>
        <AdminDashboard onLogout={() => setCurrentUserRole("landing")} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // 4. DOCTOR WORKSPACE
  if (currentUserRole === "doctor") {
    return (
      <>
        <DoctorDashboard
          doctorProfile={currentDoctorProfile}
          onLogout={() => setCurrentUserRole("landing")}
          onLaunchTelehealth={handleDoctorLaunchTelehealth}
          onPrescriptionIssued={handleDoctorPrescribe}
          onOpenSendWatchSms={() => setIsWatchSmsModalOpen(true)}
        />
        <TelehealthRoomModal
          isOpen={isTelehealthOpen}
          onClose={() => {
            setIsTelehealthOpen(false);
            setTelehealthAppointment(null);
          }}
          appointment={telehealthAppointment}
        />
        <WatchAlertSMSModal
          isOpen={isWatchSmsModalOpen}
          onClose={() => setIsWatchSmsModalOpen(false)}
          onSendSmsToWatch={handleSendSmsToWatch}
          connectedWatchName={connectedWatchName}
          isWatchConnected={isWatchConnected}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // 5. PATIENT PORTAL
  return (
    <div className="min-h-screen bg-[#071514] text-[#FAF8F2] flex flex-col font-sans">
      {/* Universal Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenLogVitals={() => setIsLogVitalsOpen(true)}
        onOpenBookAppointment={() => handleOpenBookModal()}
        onOpenSmartwatch={() => setIsSmartwatchOpen(true)}
        onOpenSendWatchSms={() => setIsWatchSmsModalOpen(true)}
        onLogout={() => setCurrentUserRole("landing")}
        isWatchConnected={isWatchConnected}
        connectedWatchName={connectedWatchName}
        isRealDevice={isRealWatch}
        currentHeartRate={currentHeartRate}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: OVERVIEW (DASHBOARD) */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Hero Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl aura-glass p-6 sm:p-8 border border-[#2DD4BF]/25 shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/15 px-3 py-1 text-xs font-bold text-[#8AF5D0]">
                  <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  <span>
                    {isWatchConnected ? `${connectedWatchName} Synchronized` : "Smartwatch Sensors Offline"}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#FAF8F2] tracking-tight font-heading">
                  Good morning, Richard Joel
                </h1>
                <p className="text-xs sm:text-sm text-[#9AAEAA] leading-relaxed">
                  {isWatchConnected ? (
                    <>
                      Your optical PPG resting heart rate is currently{" "}
                      <strong className="text-rose-400 font-mono font-bold">{currentHeartRate} BPM</strong>.
                      Overall biometric health index stands at{" "}
                      <strong className="text-emerald-400 font-bold">94/100 (Optimal)</strong>. You have 1
                      scheduled follow-up consultation today with Dr. Sarah Jenkins at 03:30 PM.
                    </>
                  ) : (
                    <>
                      Biometric telemetry sensors are currently <strong className="text-amber-300 font-bold">offline</strong>.
                      Please pair your smartwatch below to stream continuous optical PPG pulse, blood pressure telemetry,
                      and SpO2 waveforms. Clinical demo values remain hidden until wearable link is verified.
                    </>
                  )}
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsSmartwatchOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-4 py-2.5 text-xs font-black text-[#071514] shadow-md shadow-[#2DD4BF]/25 transition hover:scale-105"
                  >
                    <Watch className="h-4 w-4" />
                    <span>{isWatchConnected ? `Configure Smartwatch (${connectedWatchName})` : "Pair Smartwatch to Stream Biometrics"}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("ai")}
                    className="flex items-center gap-2 rounded-xl border border-[#2DD4BF]/25 bg-[#0B2523] px-4 py-2.5 text-xs font-bold text-[#8AF5D0] transition hover:bg-[#2DD4BF]/20"
                  >
                    <Bot className="h-4 w-4 text-[#2DD4BF]" />
                    <span>Consult Aura AI Assistant</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("story")}
                    className="flex items-center gap-2 rounded-xl border border-[#2DD4BF]/25 bg-[#071514] px-4 py-2.5 text-xs font-bold text-[#FAF8F2] transition hover:border-[#8AF5D0]"
                  >
                    <BookOpen className="h-4 w-4 text-[#8AF5D0]" />
                    <span>My Health Story</span>
                  </button>
                </div>
              </div>

              {/* Ambient Glowing Vector Graphic */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" stroke="#2DD4BF" strokeWidth="2" fill="none" opacity="0.4" />
                  <circle cx="100" cy="100" r="50" stroke="#8AF5D0" strokeWidth="1.5" fill="none" opacity="0.6" />
                  <circle cx="100" cy="100" r="20" stroke="#FAF8F2" strokeWidth="1" fill="none" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* Vitals Grid Component */}
            <VitalsGrid
              vitals={vitals}
              onOpenLogModal={() => setIsLogVitalsOpen(true)}
              onWaterAdded={handleWaterAdded}
              waterIntake={waterIntake}
              waterGoal={waterGoal}
              isWatchConnected={isWatchConnected}
              connectedWatchName={connectedWatchName}
              isRealWatch={isRealWatch}
              currentHeartRate={currentHeartRate}
              onOpenSmartwatch={() => setIsSmartwatchOpen(true)}
              onOpenSendWatchSms={() => setIsWatchSmsModalOpen(true)}
            />

            {/* Split Column: Daily Medications & Upcoming Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Medication Preview */}
              <div className="aura-glass rounded-3xl p-6 border border-[#2DD4BF]/20 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-[#8AF5D0]" />
                    <h3 className="font-bold text-[#FAF8F2] text-sm font-heading">
                      Today&apos;s Prescription Schedule
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("medications")}
                    className="flex items-center gap-1 text-xs font-bold text-[#2DD4BF] hover:underline"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {medications.slice(0, 3).map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between rounded-2xl bg-[#071514] p-3.5 border border-[#2DD4BF]/15 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            med.taken ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                        />
                        <div>
                          <p className="font-bold text-[#FAF8F2]">{med.name}</p>
                          <p className="text-[11px] text-[#9AAEAA]">
                            {med.dosage} • {med.time} ({med.period})
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleMedication(med.id)}
                        className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition ${
                          med.taken
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-[#0B2523] text-[#8AF5D0] border border-[#2DD4BF]/30 hover:bg-[#2DD4BF] hover:text-[#071514]"
                        }`}
                      >
                        {med.taken ? "Taken ✓" : "Take"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Care Encounters Preview */}
              <div className="aura-glass rounded-3xl p-6 border border-indigo-500/25 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-bold text-[#FAF8F2] text-sm font-heading">
                      Upcoming Care Encounters
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("appointments")}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-300 hover:underline"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {appointments.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      className="rounded-2xl bg-[#071514] p-3.5 border border-indigo-500/20 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={apt.doctorAvatar}
                            alt={apt.doctorName}
                            className="h-9 w-9 rounded-xl object-cover border border-[#2DD4BF]/30"
                          />
                          <div>
                            <h4 className="font-bold text-[#FAF8F2]">{apt.doctorName}</h4>
                            <p className="text-[11px] text-[#9AAEAA]">{apt.doctorSpecialty}</p>
                          </div>
                        </div>

                        <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                          {apt.type}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#2DD4BF]/10 text-[11px]">
                        <span className="text-[#8AF5D0] font-semibold flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {apt.date} at {apt.time}
                        </span>
                        {apt.type === "Telehealth Video" && (
                          <button
                            onClick={() => handleJoinTelehealth(apt)}
                            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 font-bold text-white hover:bg-indigo-500 transition shadow-sm"
                          >
                            <Video className="h-3 w-3" />
                            <span>Join Room</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Signature Feature Preview: My Health Story */}
            <MyHealthStory
              appointments={appointments}
              medications={medications}
              labReports={labReports}
              vitals={vitals}
              isDarkTheme={true}
            />
          </div>
        )}

        {/* TAB 2: BIOMETRICS & VITALS */}
        {activeTab === "vitals" && (
          <div className="space-y-6">
            <VitalsGrid
              vitals={vitals}
              onOpenLogModal={() => setIsLogVitalsOpen(true)}
              onWaterAdded={handleWaterAdded}
              waterIntake={waterIntake}
              waterGoal={waterGoal}
              isWatchConnected={isWatchConnected}
              connectedWatchName={connectedWatchName}
              isRealWatch={isRealWatch}
              currentHeartRate={currentHeartRate}
              onOpenSmartwatch={() => setIsSmartwatchOpen(true)}
              onOpenSendWatchSms={() => setIsWatchSmsModalOpen(true)}
              onRunScanSms={handleRunVitalsScanAndSendSms}
            />

            {/* 3D Interactive Multisystem Bio-Scanner */}
            <div className="aura-glass rounded-3xl p-6 sm:p-8 border border-[#2DD4BF]/25 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2DD4BF]/15">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-[#8AF5D0] bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    <span>3D PATIENT CLINICAL MODEL</span>
                  </div>
                  <h3 className="text-xl font-bold font-heading text-[#FAF8F2]">
                    Multisystem Bio-Scanner & Organ Telemetry
                  </h3>
                  <p className="text-xs text-[#9AAEAA]">
                    Interactive 3D anatomical model connecting organ systems with real-time patient biometrics.
                  </p>
                </div>
              </div>
              <div className="flex justify-center py-4">
                <Body3DVisual
                  currentBpm={currentHeartRate}
                  onScanComplete={handleScanCompleteAndAutoSendSms}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEDICATION TRACKER */}
        {activeTab === "medications" && (
          <MedicationTracker
            medications={medications}
            onToggleMedication={handleToggleMedication}
            onAddMedication={handleAddMedication}
          />
        )}

        {/* TAB 4: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <AppointmentsSection
            appointments={appointments}
            doctors={doctorsList}
            onOpenBookModal={handleOpenBookModal}
            onJoinTelehealth={handleJoinTelehealth}
          />
        )}

        {/* TAB 5: LAB ANALYTICS */}
        {activeTab === "labs" && (
          <LabReportsSection
            labReports={labReports}
            onDownloadReport={handleDownloadReport}
            onUploadMockReport={handleUploadMockReport}
          />
        )}

        {/* TAB 6: MY HEALTH STORY */}
        {activeTab === "story" && (
          <MyHealthStory
            appointments={appointments}
            medications={medications}
            labReports={labReports}
            vitals={vitals}
            isDarkTheme={true}
          />
        )}

        {/* TAB 7: AURA AI ASSISTANT */}
        {activeTab === "ai" && (
          <AuraAIChat
            currentHeartRate={currentHeartRate}
            connectedWatchName={connectedWatchName}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#2DD4BF]/15 bg-[#071514] py-6 text-center text-xs text-[#9AAEAA]">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AuraCare Clinical OS. HIPAA & SOC2 Type II Certified Health Infrastructure.</p>
          <div className="flex items-center gap-4 text-[11px] font-medium text-[#A8C8B8]">
            <span className="text-[#8AF5D0]">256-Bit SSL Encrypted</span>
            <span>•</span>
            <span
              className="cursor-pointer hover:text-[#FAF8F2]"
              onClick={() => setIsSOSOpen(true)}
            >
              Emergency Protocols
            </span>
            <span>•</span>
            <span
              className="cursor-pointer hover:text-[#FAF8F2]"
              onClick={() => setActiveTab("ai")}
            >
              Clinical AI Policy
            </span>
          </div>
        </div>
      </footer>

      {/* Modals & Portals */}
      <SmartwatchModal
        isOpen={isSmartwatchOpen}
        onClose={() => setIsSmartwatchOpen(false)}
        isConnected={isWatchConnected}
        connectedDevice={connectedWatchName}
        isRealDevice={isRealWatch}
        onConnectDevice={handleConnectWatch}
        onDisconnectDevice={handleDisconnectWatch}
        onSyncVitals={handleSyncWatchVitals}
        currentHeartRate={currentHeartRate}
        incomingSms={incomingWatchSms}
        onDismissSms={handleDismissWatchSms}
        onOpenSendWatchSms={() => setIsWatchSmsModalOpen(true)}
        onTriggerScanSms={handleRunVitalsScanAndSendSms}
      />

      <WatchAlertSMSModal
        isOpen={isWatchSmsModalOpen}
        onClose={() => setIsWatchSmsModalOpen(false)}
        onSendSmsToWatch={handleSendSmsToWatch}
        connectedWatchName={connectedWatchName}
        isWatchConnected={isWatchConnected}
      />

      <EmergencyModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onTriggerSOS={handleTriggerSOS}
      />

      <LogVitalsModal
        isOpen={isLogVitalsOpen}
        onClose={() => setIsLogVitalsOpen(false)}
        onSaveVitals={handleSaveVitals}
      />

      <BookAppointmentModal
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        doctors={doctorsList}
        selectedDoctor={selectedDoctorForBooking}
        onConfirmBooking={handleConfirmBooking}
      />

      <TelehealthRoomModal
        isOpen={isTelehealthOpen}
        onClose={() => {
          setIsTelehealthOpen(false);
          setTelehealthAppointment(null);
        }}
        appointment={telehealthAppointment}
      />

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
