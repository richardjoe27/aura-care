"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Video, MapPin, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { Appointment, Doctor } from "../types/health";

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  selectedDoctor?: Doctor;
  onConfirmBooking: (newAppointment: Appointment) => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  doctors,
  selectedDoctor,
  onConfirmBooking,
}) => {
  const [doctorId, setDoctorId] = useState<string>(selectedDoctor?.id || doctors[0]?.id || "");
  const [date, setDate] = useState("Tomorrow, Sep 27");
  const [time, setTime] = useState("10:00 AM");
  const [type, setType] = useState<"Telehealth Video" | "In-Person Clinic">("Telehealth Video");
  const [reason, setReason] = useState("Routine biometric & medication health check");

  useEffect(() => {
    if (selectedDoctor) {
      setDoctorId(selectedDoctor.id);
    }
  }, [selectedDoctor]);

  if (!isOpen) return null;

  const currentDoc = doctors.find((d) => d.id === doctorId) || doctors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDoc) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: currentDoc.id,
      doctorName: currentDoc.name,
      doctorSpecialty: currentDoc.specialty,
      doctorAvatar: currentDoc.avatar,
      date: date,
      time: time,
      type: type,
      status: "Confirmed",
      meetingLink:
        type === "Telehealth Video"
          ? `https://auracare.health/telehealth/room-${Math.floor(10000 + Math.random() * 90000)}`
          : undefined,
      location: type === "In-Person Clinic" ? currentDoc.hospital : undefined,
      reason: reason,
    };

    onConfirmBooking(newApt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="aura-glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#2DD4BF]/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9AAEAA] hover:text-[#FAF8F2]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#8AF5D0]">
            CLINICAL SCHEDULING
          </span>
        </div>
        <h3 className="text-xl font-bold font-heading text-[#FAF8F2]">
          Book Specialist Consultation
        </h3>
        <p className="text-xs text-[#9AAEAA] mb-5">
          Select preferred practitioner, format, and clinical appointment time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Select Doctor */}
          <div>
            <label className="font-semibold text-[#A8C8B8]">Medical Specialist</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id} className="bg-[#071514]">
                  {doc.name} — {doc.specialty} ({doc.hospital})
                </option>
              ))}
            </select>
          </div>

          {/* Type Toggle: Telehealth vs In-Person */}
          <div>
            <label className="font-semibold text-[#A8C8B8]">Consultation Format</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setType("Telehealth Video")}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-bold border transition ${
                  type === "Telehealth Video"
                    ? "bg-[#2DD4BF] text-[#071514] border-[#8AF5D0]"
                    : "bg-[#071514] text-[#9AAEAA] border-[#2DD4BF]/15"
                }`}
              >
                <Video className="h-4 w-4" />
                <span>Telehealth Video</span>
              </button>
              <button
                type="button"
                onClick={() => setType("In-Person Clinic")}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-bold border transition ${
                  type === "In-Person Clinic"
                    ? "bg-[#2DD4BF] text-[#071514] border-[#8AF5D0]"
                    : "bg-[#071514] text-[#9AAEAA] border-[#2DD4BF]/15"
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>In-Clinic Visit</span>
              </button>
            </div>
          </div>

          {/* Date & Time Picker */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#A8C8B8]">Appointment Date</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#A8C8B8]">Preferred Time</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="font-semibold text-[#A8C8B8]">Clinical Consultation Reason</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded-xl bg-[#071514] border border-[#2DD4BF]/20 p-2.5 text-[#FAF8F2] focus:outline-none focus:border-[#2DD4BF]"
            />
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
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
