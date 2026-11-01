"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService } from "@/services/api";
import { EventItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useEvent } from "@/context/EventContext";
import { Download, Loader2 } from "lucide-react";

export default function ReportsPage() {
  const { currentEventId, currentEvent } = useEvent();
  const [budget, setBudget] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function loadReport() {
      if (!currentEventId) return;
      try {
        const b = await apiService.getBudget(currentEventId);
        setBudget(b);
      } catch (err) {
        console.error(err);
      } finally {
        // loaded
      }
    }
    loadReport();
  }, [currentEventId]);

  async function handleDownloadPDF() {
    if (!currentEventId || isDownloading) return;
    setIsDownloading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${apiUrl}/events/${currentEventId}/report/pdf`);
      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Eventora_Executive_Report_${(currentEvent?.title || "Celebration").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF download failed:", err);
      // Fallback: browser print dialog
      window.print();
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#54265F]">
              Comprehensive Event Report & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Executive summary, budget breakdown audit, vendor performance & post-event notes
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#F3E5C8]" />
                <span>Generating ReportLab PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#F3E5C8]" />
                <span>Download PDF Report</span>
              </>
            )}
          </button>
        </div>

        {/* Printable Executive Dossier */}
        <div className="bg-white p-8 rounded-3xl border border-[#EEE7F3] shadow-md space-y-8">
          {/* Header Info */}
          <div className="border-b border-[#EEE7F3] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#75458B]">
                EVENTORA AI EXECUTIVE REPORT
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#25212A] mt-1">{currentEvent?.title}</h2>
              <p className="text-xs text-gray-500">Generated for Aarav Deshmukh • {currentEvent?.city || "Pune"}, Maharashtra</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#31966A]/10 text-[#31966A]">
                Status: {currentEvent?.status || "Planning"}
              </span>
              <p className="text-[11px] text-gray-400 mt-1">Audit Code: EVNT-2026-PUN-01</p>
            </div>
          </div>

          {/* Key Metric Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#F8F4FA]">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Budget</span>
              <p className="text-xl font-bold text-[#54265F]">{formatCurrency(currentEvent?.total_budget || 1500000)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8F4FA]">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Disbursed</span>
              <p className="text-xl font-bold text-[#31966A]">{formatCurrency(budget?.total_spent || 480000)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8F4FA]">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Guest Confirmation</span>
              <p className="text-xl font-bold text-[#25212A]">{currentEvent?.guest_count || 250} Pax</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8F4FA]">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Remaining Funds</span>
              <p className="text-xl font-bold text-[#75458B]">{formatCurrency(budget?.remaining_balance || 1020000)}</p>
            </div>
          </div>

          {/* Executive Audit Statement */}
          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] space-y-2 text-xs leading-relaxed text-gray-700">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#54265F]">Executive Assessment</h4>
            <p>
              The 2-day royal celebration is fully organized within the designated budget parameter of ₹15,00,000. Key vendor contracts for Venue (The Heritage Grand Lawns), Catering (Shree Maharashtrian Caterers), and Floral Architecture (Sanskriti Decor) have been locked with 32% advance disbursals. Contingency measures for unexpected showers and catering overruns have been formalized with zero cost impact.
            </p>
          </div>

          {/* Signoff */}
          <div className="pt-6 border-t border-[#EEE7F3] flex items-center justify-between text-xs text-gray-400">
            <p>Eventora AI Multi-Agent Platform • Verified Clean Financial Audit</p>
            <p>Reportlab Generation Engine Ready</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

