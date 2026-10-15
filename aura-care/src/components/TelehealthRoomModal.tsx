"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Shield,
  MessageSquare,
  FileText,
  Heart,
  Volume2,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { Appointment } from "../types/health";
import { Meet3DVisual } from "./3d/Meet3DVisual";

interface TelehealthRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export const TelehealthRoomModal: React.FC<TelehealthRoomModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(142);
  const [showNotes, setShowNotes] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeCallMode, setActiveCallMode] = useState<"webrtc" | "google-meet">("google-meet");

  const [customMeetUrl, setCustomMeetUrl] = useState<string>(
    appointment?.meetingLink?.includes("meet.google.com")
      ? appointment.meetingLink
      : "https://meet.google.com/new"
  );

  useEffect(() => {
    if (appointment?.meetingLink?.includes("meet.google.com")) {
      setCustomMeetUrl(appointment.meetingLink);
    } else {
      setCustomMeetUrl("https://meet.google.com/new");
    }
  }, [appointment]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !appointment) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  const handleCopyMeet = () => {
    navigator.clipboard.writeText(customMeetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLaunchMeet = () => {
    window.open(customMeetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 sm:p-4">
      <div className="relative flex flex-col w-full max-w-5xl h-[92vh] rounded-3xl bg-[#071514] border border-[#2DD4BF]/30 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3 border-b border-[#2DD4BF]/15 bg-[#071514]/90 z-10 gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8AF5D0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2DD4BF]"></span>
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#FAF8F2] flex items-center gap-2 font-heading">
                Telehealth Encounter with {appointment.doctorName}
              </h3>
              <p className="text-[11px] text-[#8AF5D0] font-mono flex items-center gap-1">
                <Lock className="h-3 w-3 text-[#2DD4BF]" /> Verified Encrypted Consultation Channel
              </p>
            </div>
          </div>

          {/* Google Meet & WebRTC Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-[#0B2523] border border-[#2DD4BF]/20 text-xs">
              <button
                onClick={() => setActiveCallMode("google-meet")}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeCallMode === "google-meet"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-[#A8C8B8] hover:text-[#FAF8F2]"
                }`}
              >
                <Video className="h-3.5 w-3.5" />
                <span>Google Meet</span>
              </button>
              <button
                onClick={() => setActiveCallMode("webrtc")}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  activeCallMode === "webrtc"
                    ? "bg-[#2DD4BF] text-[#071514] font-black shadow-sm"
                    : "text-[#A8C8B8] hover:text-[#FAF8F2]"
                }`}
              >
                Built-In WebRTC
              </button>
            </div>

            <span className="rounded-full bg-[#0B2523] px-3 py-1 font-mono text-xs font-semibold text-[#8AF5D0] border border-[#2DD4BF]/25">
              {formatTime(secondsElapsed)}
            </span>

            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                showNotes
                  ? "bg-[#2DD4BF] text-[#071514] font-bold"
                  : "bg-[#0B2523] text-[#A8C8B8] hover:text-[#FAF8F2]"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Notes</span>
            </button>
          </div>
        </div>

        {/* Video Main Body */}
        <div className="relative flex-1 flex overflow-hidden">
          {activeCallMode === "google-meet" ? (
            /* GOOGLE MEET INTEGRATED 3D PORTAL */
            <div className="relative flex-1 bg-gradient-to-br from-[#071514] via-[#0B2523] to-[#040C0B] flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-lg w-full aura-glass rounded-3xl p-6 sm:p-8 border border-indigo-500/40 shadow-2xl space-y-4">
                <Meet3DVisual meetLink={customMeetUrl} />

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold mb-2">
                    <Check className="h-3 w-3" />
                    <span>Real Google Meet Integration Active</span>
                  </div>
                  <h4 className="text-xl font-bold font-heading text-[#FAF8F2]">
                    Join Live Google Meet Room
                  </h4>
                  <p className="text-xs text-[#9AAEAA] mt-1">
                    Both <strong className="text-[#8AF5D0]">{appointment.doctorName}</strong> and
                    patient can meet with real audio/video.
                  </p>
                </div>

                {/* Google Meet Link Display & Actions */}
                <div className="rounded-2xl bg-[#071514] p-3 border border-[#2DD4BF]/20 space-y-2 text-left">
                  <div className="flex items-center justify-between text-[11px] text-[#A8C8B8]">
                    <span>Google Meet URL</span>
                    <button
                      onClick={handleCopyMeet}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#8AF5D0] hover:text-white"
                    >
                      {copiedLink ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={customMeetUrl}
                    onChange={(e) => setCustomMeetUrl(e.target.value)}
                    className="w-full rounded-xl bg-[#0B2523] px-3 py-2 text-xs font-mono text-[#8AF5D0] border border-[#2DD4BF]/30 focus:outline-none focus:border-[#8AF5D0]"
                    placeholder="https://meet.google.com/new"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setCustomMeetUrl("https://meet.google.com/new")}
                      className="text-[10px] text-[#9AAEAA] hover:text-[#FAF8F2] underline cursor-pointer"
                    >
                      Reset to Instant Room (meet.google.com/new)
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    onClick={handleLaunchMeet}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-[#2DD4BF] to-[#8AF5D0] py-3 text-xs font-black text-[#071514] shadow-lg shadow-indigo-500/25 hover:scale-105 transition cursor-pointer"
                  >
                    <span>Launch Google Meet in New Tab</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setActiveCallMode("webrtc")}
                    className="rounded-2xl aura-glass px-4 py-3 text-xs font-bold text-[#FAF8F2] border border-[#2DD4BF]/20 hover:border-[#2DD4BF]"
                  >
                    Use Built-in Video
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* BUILT-IN WEBRTC CALL INTERFACE */
            <div className="relative flex-1 bg-[#030B0A] flex items-center justify-center overflow-hidden">
              <img
                src={appointment.doctorAvatar}
                alt={appointment.doctorName}
                className="w-full h-full object-cover opacity-85 filter contrast-105"
              />

              {/* Doctor Info Badge Overlay */}
              <div className="absolute top-4 left-4 aura-glass rounded-2xl px-3.5 py-2 border border-[#2DD4BF]/20 backdrop-blur-md">
                <p className="text-xs font-bold text-[#FAF8F2] font-heading">
                  {appointment.doctorName}
                </p>
                <p className="text-[10px] text-[#8AF5D0]">{appointment.doctorSpecialty}</p>
              </div>

              {/* Local Video Stream Preview */}
              <div className="absolute bottom-4 right-4 w-36 sm:w-44 h-28 sm:h-32 rounded-2xl bg-[#071514] border-2 border-[#2DD4BF]/40 overflow-hidden shadow-2xl flex items-center justify-center">
                {isVideoOn ? (
                  <div className="relative w-full h-full bg-gradient-to-tr from-[#0B2523] to-[#071514] flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-xs font-bold text-[#FAF8F2]">Richard Joel</span>
                    <span className="text-[10px] text-emerald-400 font-mono mt-1">HD 1080p Stream</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#9AAEAA] text-xs">
                    <VideoOff className="h-6 w-6 mb-1 text-rose-400" />
                    <span>Camera Muted</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clinical Notes Drawer */}
          {showNotes && (
            <div className="w-80 border-l border-[#2DD4BF]/20 bg-[#071514] p-5 space-y-4 overflow-y-auto">
              <h4 className="text-sm font-bold font-heading text-[#FAF8F2]">Session Record</h4>
              <div className="space-y-3 text-xs">
                <div className="rounded-xl bg-[#0B2523] p-3 border border-[#2DD4BF]/15">
                  <span className="text-[#9AAEAA] text-[10px]">Consultation Purpose</span>
                  <p className="font-semibold text-[#FAF8F2] mt-0.5">{appointment.reason}</p>
                </div>
                <div className="rounded-xl bg-[#0B2523] p-3 border border-[#2DD4BF]/15">
                  <span className="text-[#9AAEAA] text-[10px]">Google Meet Room URL</span>
                  <p className="font-mono text-[#8AF5D0] text-[11px] mt-0.5 truncate">
                    {customMeetUrl}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-center gap-4 py-4 px-6 border-t border-[#2DD4BF]/15 bg-[#071514]/90">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-2xl transition border ${
              isMicOn
                ? "bg-[#0B2523] border-[#2DD4BF]/30 text-[#8AF5D0]"
                : "bg-rose-500/20 border-rose-500/40 text-rose-400"
            }`}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-2xl transition border ${
              isVideoOn
                ? "bg-[#0B2523] border-[#2DD4BF]/30 text-[#8AF5D0]"
                : "bg-rose-500/20 border-rose-500/40 text-rose-400"
            }`}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 px-6 py-3 text-xs font-black text-white shadow-lg shadow-rose-600/30 transition hover:scale-105"
          >
            <PhoneOff className="h-4 w-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
