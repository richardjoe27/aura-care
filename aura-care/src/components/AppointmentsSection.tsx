"use client";

import React from "react";
import {
  Calendar,
  Video,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  UserCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Appointment, Doctor } from "../types/health";
import { Meet3DVisual } from "./3d/Meet3DVisual";

interface AppointmentsSectionProps {
  appointments: Appointment[];
  doctors: Doctor[];
  onOpenBookModal: (preselectedDoc?: Doctor) => void;
  onJoinTelehealth: (appointment: Appointment) => void;
}

export const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({
  appointments,
  doctors,
  onOpenBookModal,
  onJoinTelehealth,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner with 3D Meet Visual */}
      <div className="aura-glass rounded-3xl p-6 sm:p-8 border border-[#2DD4BF]/20 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-[#8AF5D0] bg-[#2DD4BF]/15 border border-[#2DD4BF]/30">
              <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
              <span>DIRECT GOOGLE MEET & WEBRTC INTEGRATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-heading text-[#FAF8F2]">
              Clinical Telehealth & Doctor Encounters
            </h2>
            <p className="text-xs text-[#9AAEAA] max-w-xl leading-relaxed">
              Every appointment includes a synchronized Google Meet link where both the attending
              physician and the patient converse directly with high-definition video and clinical notes.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onOpenBookModal()}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-5 py-3 text-xs font-black text-[#071514] shadow-md shadow-[#2DD4BF]/25 transition hover:scale-105"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Specialist Visit</span>
              </button>

              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 px-5 py-3 text-xs font-bold text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
              >
                <Video className="h-4 w-4" />
                <span>Open Instant Google Meet</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <Meet3DVisual meetLink="https://meet.google.com/aur-care-live" />
          </div>
        </div>
      </div>

      {/* Scheduled Appointments Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#FAF8F2] font-heading flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#2DD4BF]" /> Scheduled Appointments
        </h3>

        {appointments.length === 0 ? (
          <div className="aura-glass rounded-3xl p-8 text-center border border-[#2DD4BF]/20">
            <p className="text-sm text-[#9AAEAA]">No appointments scheduled right now.</p>
            <button
              onClick={() => onOpenBookModal()}
              className="mt-3 text-xs text-[#8AF5D0] font-bold hover:underline"
            >
              Schedule your next routine follow-up
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="aura-glass-interactive rounded-3xl p-5 border border-[#2DD4BF]/20 space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={apt.doctorAvatar}
                        alt={apt.doctorName}
                        className="h-12 w-12 rounded-2xl object-cover border-2 border-[#2DD4BF]/40 shadow-md"
                      />
                      <div>
                        <h4 className="font-bold text-[#FAF8F2] text-sm font-heading">
                          {apt.doctorName}
                        </h4>
                        <p className="text-xs text-[#8AF5D0]">{apt.doctorSpecialty}</p>
                      </div>
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

                  <div className="bg-[#071514] rounded-2xl p-3.5 text-xs space-y-2 border border-[#2DD4BF]/15">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1.5 text-[#8AF5D0]">
                        <Calendar className="h-3.5 w-3.5 text-[#2DD4BF]" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-indigo-300">
                        <Clock className="h-3.5 w-3.5 text-indigo-400" />
                        {apt.time}
                      </span>
                    </div>
                    <p className="text-[#A8C8B8] text-[11px] pt-1 leading-relaxed">
                      <strong className="text-[#FAF8F2]">Clinical Context:</strong> {apt.reason}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2DD4BF]/15 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <CheckCircle2 className="h-4 w-4" /> Confirmed
                  </span>

                  {apt.type === "Telehealth Video" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onJoinTelehealth(apt)}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-[#2DD4BF] px-3.5 py-1.5 text-xs font-black text-[#071514] shadow-md shadow-indigo-500/20 transition hover:scale-105"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Google Meet & Call</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-[#9AAEAA]">
                      <MapPin className="h-3.5 w-3.5 text-rose-400" />
                      <span>{apt.location || "Hospital Suite"}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medical Specialists Directory */}
      <div className="pt-4 space-y-4">
        <h3 className="text-sm font-bold text-[#FAF8F2] font-heading flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-[#2DD4BF]" /> Available Medical Specialists
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="aura-glass-interactive rounded-3xl p-5 border border-[#2DD4BF]/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-[#2DD4BF]/30 shadow-md"
                  />
                  <div className="flex items-center gap-1 rounded-full bg-[#071514] px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <h4 className="font-bold text-[#FAF8F2] text-sm font-heading">{doc.name}</h4>
                <p className="text-xs text-[#8AF5D0] font-semibold mt-0.5">{doc.specialty}</p>
                <p className="text-xs text-[#9AAEAA] mt-1">{doc.hospital}</p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#A8C8B8]">
                  <Clock className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  <span>Available: {doc.availableDays.join(", ")}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#2DD4BF]/15 flex items-center justify-between">
                <span className="text-[11px] text-[#9AAEAA]">{doc.experience}</span>
                <button
                  onClick={() => onOpenBookModal(doc)}
                  className="flex items-center gap-1 rounded-xl bg-[#2DD4BF] px-3.5 py-1.5 text-xs font-black text-[#071514] hover:bg-[#8AF5D0] transition"
                >
                  <span>Book</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
