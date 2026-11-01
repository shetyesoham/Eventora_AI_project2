"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Mail, Phone, Sparkles, BookOpen, ChevronDown } from "lucide-react";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the AI Copilot customize regional wedding ceremonies?",
      a: "Eventora AI uses specialized cultural knowledge agents (CulturalAgent) for Gujarati, Maharashtrian, Punjabi, South Indian, Bengali, and Muslim traditions. Selecting your background automatically populates canonical rituals, auspicious muhurats, and traditional multi-course feast menus."
    },
    {
      q: "How do WhatsApp digital invitations work?",
      a: "From the Guest Management page, clicking 'Invite Card' generates a personalized digital invite containing the Sanskrit shloka, venue address, and assigned table number. Tapping 'Send WhatsApp Invitation' opens WhatsApp directly with the guest's chat pre-filled."
    },
    {
      q: "Can I generate a printable executive PDF report?",
      a: "Yes! Navigate to 'Reports & Analytics' and click 'Download PDF Report'. The backend uses Python ReportLab to generate a clean, multi-page executive audit complete with financial breakdowns, vendor hotlines, and risk contingency plans."
    },
    {
      q: "How is the risk score calculated in the Predictive Risk Engine?",
      a: "Severity is determined mathematically using the formula: Score = Probability × Impact × 100. Scores above 50 are tagged Critical, prompting immediate contractual buffer clauses and Plan B activation."
    }
  ];

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#54265F]">
            Help & Concierge Support
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Platform guides, FAQ knowledge base, and priority event concierge support
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-2">
            <div className="p-2.5 rounded-xl bg-[#54265F]/10 text-[#54265F] w-fit">
              <Sparkles className="w-5 h-5 text-[#54265F]" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#25212A]">AI Event Concierge</h3>
            <p className="text-xs text-gray-500">Ask the Copilot any planning or cultural questions 24/7</p>
            <a href="/copilot" className="text-xs font-bold text-[#75458B] hover:underline block pt-1">Open Copilot →</a>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#31966A] w-fit">
              <Phone className="w-5 h-5 text-[#31966A]" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#25212A]">Phone Hotline</h3>
            <p className="text-xs text-gray-500">On-ground wedding day emergency support line</p>
            <p className="text-xs font-bold text-[#31966A] pt-1">+91 1800 200 4455</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-2">
            <div className="p-2.5 rounded-xl bg-amber-50 text-[#E7A23B] w-fit">
              <Mail className="w-5 h-5 text-[#E7A23B]" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#25212A]">Concierge Desk</h3>
            <p className="text-xs text-gray-500">Vendor disputes, contracts, and municipal permits</p>
            <p className="text-xs font-bold text-gray-700 pt-1">support@eventora.ai</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#54265F]" />
            <h3 className="font-serif text-lg font-bold text-[#54265F]">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-[#EEE7F3] rounded-2xl overflow-hidden bg-[#FFFDF9]">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs text-[#25212A] hover:bg-[#F8F4FA] transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-[#EEE7F3]/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

