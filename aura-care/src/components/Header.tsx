"use client";

import React, { useState } from "react";
import {
  Activity,
  Heart,
  Calendar,
  Pill,
  FileText,
  Bot,
  AlertTriangle,
  Plus,
  Bell,
  LogOut,
  Watch,
  CheckCircle2,
  Trash2,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSOS: () => void;
  onOpenLogVitals: () => void;
  onOpenBookAppointment: () => void;
  onOpenSmartwatch: () => void;
  onOpenSendWatchSms?: () => void;
  onLogout: () => void;
  isWatchConnected: boolean;
  connectedWatchName: string;
  isRealDevice?: boolean;
  currentHeartRate: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSOS,
  onOpenLogVitals,
  onOpenBookAppointment,
  onOpenSmartwatch,
  onOpenSendWatchSms,
  onLogout,
  isWatchConnected,
  connectedWatchName,
  isRealDevice = false,
  currentHeartRate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Smartwatch Telemetry Active",
      desc: `Synchronized with ${connectedWatchName}. Resting pulse: ${currentHeartRate} BPM.`,
      time: "Just now",
      unread: true,
    },
    {
      id: "n2",
      title: "Medication Reminder",
      desc: "Omega-3 EPA/DHA is scheduled with lunch at 01:30 PM.",
      time: "25m ago",
      unread: true,
    },
    {
      id: "n3",
      title: "Telehealth Call Today",
      desc: "Consultation with Dr. Sarah Jenkins starts at 03:30 PM.",
      time: "1h ago",
      unread: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "vitals", label: "Biometrics & Vitals", icon: Heart },
    { id: "medications", label: "Medication Tracker", icon: Pill },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "labs", label: "Lab Analytics", icon: FileText },
    { id: "story", label: "My Health Story", icon: BookOpen, isNew: true },
    { id: "ai", label: "Aura AI Assistant", icon: Bot, isBadge: "2.5" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2DD4BF]/20 bg-[#071514]/90 backdrop-blur-xl">
      {/* Top Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0B2523] via-[#2DD4BF] to-[#8AF5D0] p-0.5 shadow-md shadow-[#2DD4BF]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#071514]">
              <Activity className="h-5 w-5 text-[#8AF5D0] animate-pulse-heart" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[#FAF8F2] font-heading">
                Aura<span className="text-[#2DD4BF]">Care</span>
              </span>
              <span className="rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/15 px-2 py-0.5 text-[9px] font-extrabold text-[#8AF5D0]">
                PATIENT PORTAL
              </span>
            </div>
            <p className="text-[11px] text-[#9AAEAA] hidden sm:block">
              Intelligent Clinical Health & Wellness OS
            </p>
          </div>
        </div>

        {/* Smartwatch Live Telemetry Status Button */}
        <button
          onClick={onOpenSmartwatch}
          className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition shadow-sm ${
            isWatchConnected
              ? isRealDevice
                ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/25 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              : "border-[#2DD4BF]/20 bg-[#071514] text-[#A8C8B8] hover:border-[#2DD4BF]"
          }`}
          title="Connect or configure smartwatch sensors"
        >
          <Watch
            className={`h-4 w-4 ${
              isWatchConnected
                ? isRealDevice
                  ? "text-emerald-300 animate-pulse"
                  : "text-emerald-400"
                : "text-[#9AAEAA]"
            }`}
          />
          <span className="hidden sm:inline">
            {isWatchConnected ? `${connectedWatchName}:` : "Pair Smartwatch"}
          </span>
          {isWatchConnected ? (
            <span className="flex items-center gap-1.5 font-bold font-mono">
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500 animate-pulse" />
              <span className="text-rose-400">{currentHeartRate} BPM</span>
              {isRealDevice && (
                <span className="rounded-full bg-emerald-500/30 px-1.5 py-0.2 text-[9px] font-black text-emerald-200">
                  REAL
                </span>
              )}
            </span>
          ) : (
            <span className="text-[#8AF5D0] font-bold">Connect +</span>
          )}
        </button>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            className="group relative flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-3 py-1.5 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500 hover:text-[#071514] hover:shadow-lg hover:shadow-rose-500/30"
            title="Emergency Medical Information and SOS Alert"
          >
            <AlertTriangle className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">SOS CARD</span>
          </button>

          {/* Send Critical SMS to Watch Button */}
          {onOpenSendWatchSms && (
            <button
              onClick={onOpenSendWatchSms}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500 hover:text-white transition"
              title="Transmit critical reminder or low BP SMS alert to smartwatch"
            >
              <Watch className="h-3.5 w-3.5 text-rose-400" />
              <span className="hidden lg:inline">Watch SMS</span>
            </button>
          )}

          {/* Log Vitals Button */}
          <button
            onClick={onOpenLogVitals}
            className="flex items-center gap-1.5 rounded-xl border border-[#2DD4BF]/25 bg-[#0B2523] px-3 py-1.5 text-xs font-semibold text-[#8AF5D0] transition hover:bg-[#2DD4BF]/20"
            title="Log new biometric vitals entry"
          >
            <Plus className="h-3.5 w-3.5 text-[#2DD4BF]" />
            <span className="hidden md:inline">Log Vitals</span>
          </button>

          {/* Book Appointment CTA */}
          <button
            onClick={onOpenBookAppointment}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-3 py-1.5 text-xs font-black text-[#071514] shadow-md shadow-[#2DD4BF]/20 transition hover:scale-105"
            title="Schedule consultation with a medical specialist"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Book Visit</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-xl border border-[#2DD4BF]/20 bg-[#071514] p-2 text-[#A8C8B8] transition hover:text-[#FAF8F2] hover:border-[#2DD4BF]"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-[#071514]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#2DD4BF]/30 bg-[#071514]/95 p-4 shadow-2xl backdrop-blur-2xl z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#2DD4BF]/15">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#FAF8F2]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-[#2DD4BF]/20 px-2 py-0.5 text-[10px] font-bold text-[#8AF5D0]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-[#8AF5D0] hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[#9AAEAA]">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`group relative rounded-xl p-3 text-xs transition border ${
                          n.unread
                            ? "bg-[#0B2523]/80 border-[#2DD4BF]/30"
                            : "bg-[#071514] border-transparent hover:border-[#2DD4BF]/15"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-[#FAF8F2] text-xs">{n.title}</h4>
                          <span className="text-[10px] text-[#9AAEAA]">{n.time}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-[#A8C8B8] leading-relaxed">{n.desc}</p>
                        <button
                          onClick={() => handleDeleteNotification(n.id)}
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 text-[#9AAEAA] hover:text-rose-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout / Switch Role */}
          <button
            onClick={onLogout}
            className="rounded-xl border border-[#2DD4BF]/20 bg-[#071514] p-2 text-[#9AAEAA] transition hover:text-rose-400 hover:border-rose-500/30"
            title="Log out or switch portal"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="border-t border-[#2DD4BF]/10 bg-[#0B2523]/30">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 transition ${
                  isActive
                    ? "bg-[#2DD4BF] text-[#071514] font-black shadow-md shadow-[#2DD4BF]/25"
                    : "text-[#A8C8B8] hover:bg-[#0B2523] hover:text-[#FAF8F2]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#071514]" : "text-[#2DD4BF]"}`} />
                <span>{item.label}</span>
                {item.isBadge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-extrabold ${
                      isActive
                        ? "bg-[#071514] text-[#8AF5D0]"
                        : "bg-[#2DD4BF]/20 text-[#8AF5D0]"
                    }`}
                  >
                    {item.isBadge}
                  </span>
                )}
                {item.isNew && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-extrabold ${
                      isActive
                        ? "bg-[#071514] text-[#8AF5D0]"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
