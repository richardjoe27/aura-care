"use client";

import React from "react";
import { CheckCircle2, AlertCircle, X, Info, Sparkles } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning";
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl transition-all animate-in slide-in-from-bottom-5 duration-300 border ${
            toast.type === "success"
              ? "bg-[#071514]/95 border-emerald-500/40 text-[#FAF8F2] shadow-emerald-500/10"
              : toast.type === "info"
              ? "bg-[#071514]/95 border-[#2DD4BF]/40 text-[#FAF8F2] shadow-[#2DD4BF]/10"
              : "bg-[#071514]/95 border-amber-500/40 text-[#FAF8F2] shadow-amber-500/10"
          }`}
        >
          {toast.type === "success" && (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {toast.type === "info" && (
            <Info className="h-5 w-5 text-[#8AF5D0] shrink-0 mt-0.5" />
          )}
          {toast.type === "warning" && (
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs">
            <h4 className="font-bold font-heading text-[#FAF8F2]">{toast.title}</h4>
            {toast.description && (
              <p className="mt-1 text-[#A8C8B8] leading-snug">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#9AAEAA] hover:text-[#FAF8F2] p-1 rounded-lg"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
