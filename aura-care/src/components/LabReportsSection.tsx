"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Upload,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Search,
  Sparkles,
  Lock,
} from "lucide-react";
import { LabReport } from "../types/health";
import { Vault3DVisual } from "./3d/Vault3DVisual";

interface LabReportsSectionProps {
  labReports: LabReport[];
  onDownloadReport: (report: LabReport) => void;
  onUploadMockReport: (newReport: LabReport) => void;
}

export const LabReportsSection: React.FC<LabReportsSectionProps> = ({
  labReports,
  onDownloadReport,
  onUploadMockReport,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(labReports[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");

  const activeReport = labReports.find((r) => r.id === selectedReportId) || labReports[0];

  const filteredReports = labReports.filter(
    (r) =>
      r.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with 3D Encrypted Vault */}
      <div className="aura-glass rounded-3xl p-6 sm:p-8 border border-[#2DD4BF]/20 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-[#8AF5D0] bg-[#2DD4BF]/15 border border-[#2DD4BF]/30">
              <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
              <span>3D CRYPTOGRAPHIC LABORATORY VAULT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-heading text-[#FAF8F2]">
              Diagnostic Biomarkers & Lab Vault
            </h2>
            <p className="text-xs text-[#9AAEAA] max-w-xl leading-relaxed">
              Certified laboratory records, reference interval tracking, and clinician interpretations
              encrypted at rest with 256-bit AES cryptographic protocols.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const mockUpload: LabReport = {
                    id: `lab-${Date.now()}`,
                    testName: "Complete Blood Count (CBC) with Differential",
                    category: "Hematology",
                    date: "Sep 25, 2026",
                    doctor: "Dr. Elena Rostova",
                    status: "Optimal",
                    metrics: [
                      {
                        name: "White Blood Cells (WBC)",
                        result: "6.4",
                        reference: "4.5 - 11.0",
                        unit: "x10^3/uL",
                        status: "normal",
                      },
                      {
                        name: "Red Blood Cells (RBC)",
                        result: "4.85",
                        reference: "4.30 - 5.90",
                        unit: "x10^6/uL",
                        status: "normal",
                      },
                      {
                        name: "Hemoglobin",
                        result: "15.4",
                        reference: "13.5 - 17.5",
                        unit: "g/dL",
                        status: "normal",
                      },
                      {
                        name: "Platelets",
                        result: "245",
                        reference: "150 - 450",
                        unit: "x10^3/uL",
                        status: "normal",
                      },
                    ],
                    summary:
                      "All hematologic cell lines are normocytic, normochromic and within normal reference limits.",
                  };
                  onUploadMockReport(mockUpload);
                }}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-[#2DD4BF] px-5 py-3 text-xs font-black text-[#071514] shadow-md shadow-emerald-400/20 transition hover:scale-105"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Lab Document</span>
              </button>
            </div>
          </div>

          {/* 3D Vault Holographic Visual */}
          <div className="lg:col-span-4 flex justify-center">
            <Vault3DVisual />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Reports List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-[#9AAEAA]" />
            <input
              type="text"
              placeholder="Search biomarkers or tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#2DD4BF]/20 bg-[#071514] pl-10 pr-3 py-2.5 text-xs text-[#FAF8F2] placeholder-[#9AAEAA]/50 focus:border-[#2DD4BF] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {filteredReports.map((report) => {
              const isSelected = selectedReportId === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all border ${
                    isSelected
                      ? "bg-[#0B2523] border-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/15"
                      : "aura-glass border-[#2DD4BF]/15 hover:border-[#2DD4BF]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-[#FAF8F2] text-xs font-heading">
                      {report.testName}
                    </h4>
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                      {report.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#8AF5D0] font-semibold">{report.category}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#9AAEAA]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {report.date}
                    </span>
                    <span>{report.doctor}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Report Viewer */}
        <div className="lg:col-span-8">
          {activeReport ? (
            <div className="aura-glass rounded-3xl p-6 sm:p-8 border border-[#2DD4BF]/25 shadow-2xl space-y-6">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2DD4BF]/15">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#8AF5D0]">
                      {activeReport.category}
                    </span>
                    <span className="text-xs text-[#9AAEAA]">Verified HL7 Record</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#FAF8F2] font-heading mt-2">
                    {activeReport.testName}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#A8C8B8]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Date: {activeReport.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Signed: {activeReport.doctor}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDownloadReport(activeReport)}
                  className="flex items-center gap-2 rounded-2xl bg-[#071514] border border-[#2DD4BF]/30 px-4 py-2.5 text-xs font-bold text-[#8AF5D0] hover:bg-[#2DD4BF] hover:text-[#071514] transition"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Report (TXT)</span>
                </button>
              </div>

              {/* Biomarkers Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8C8B8] mb-3">
                  Biomarker Assay Results
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-[#2DD4BF]/20 bg-[#071514]">
                  <table className="w-full text-left text-xs text-[#FAF8F2]">
                    <thead className="bg-[#0B2523]/60 text-[#9AAEAA] uppercase text-[10px] tracking-wider border-b border-[#2DD4BF]/15">
                      <tr>
                        <th className="py-3 px-4">Biomarker</th>
                        <th className="py-3 px-4">Result</th>
                        <th className="py-3 px-4">Reference Range</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2DD4BF]/10">
                      {activeReport.metrics.map((m, idx) => (
                        <tr key={idx} className="hover:bg-[#0B2523]/30 transition">
                          <td className="py-3.5 px-4 font-semibold">{m.name}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#8AF5D0]">
                            {m.result} {m.unit}
                          </td>
                          <td className="py-3.5 px-4 text-[#9AAEAA] font-mono">
                            {m.reference} {m.unit}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                m.status === "normal"
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              }`}
                            >
                              {m.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Clinical Interpretation */}
              <div className="rounded-2xl bg-[#071514] p-4 sm:p-5 border border-[#2DD4BF]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8AF5D0]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Clinician Interpretation & Narrative</span>
                </div>
                <p className="text-xs text-[#FAF8F2]/90 leading-relaxed">
                  {activeReport.summary}
                </p>
              </div>
            </div>
          ) : (
            <div className="aura-glass rounded-3xl p-12 text-center text-[#9AAEAA]">
              Select a report to view results
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
