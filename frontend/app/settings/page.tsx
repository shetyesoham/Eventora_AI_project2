"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useEvent } from "@/context/EventContext";
import { Settings, User, Bell, Shield, Key, Sparkles, Check, Globe } from "lucide-react";

export default function SettingsPage() {
  const { currentEvent } = useEvent();
  const [activeTab, setActiveTab] = useState<"general" | "ai" | "notifications">("general");
  const [saved, setSaved] = useState(false);

  // Form states
  const [currency, setCurrency] = useState("INR (₹)");
  const [language, setLanguage] = useState("English + Hindi / Marathi (Sarvam AI)");
  const [aiAutopilot, setAiAutopilot] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappSync, setWhatsappSync] = useState(true);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#54265F]">
            Settings & Event Preferences
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Configure system defaults, AI agent autopilot, and notification channels
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#EEE7F3] shadow-xs overflow-hidden">
          {/* Settings Tabs */}
          <div className="flex border-b border-[#EEE7F3] bg-[#F8F4FA] p-2 gap-2">
            {[
              { id: "general", label: "General & Regional", icon: Globe },
              { id: "ai", label: "AI Copilot & Agents", icon: Sparkles },
              { id: "notifications", label: "Alerts & Channels", icon: Bell },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? "bg-[#54265F] text-white shadow-xs"
                    : "text-gray-600 hover:text-[#54265F]"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
            {activeTab === "general" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">Active Event Profile</label>
                  <p className="text-xs text-gray-500 mt-0.5">{currentEvent?.title || "Priyanka & Rohan's Wedding"}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Default Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none"
                    >
                      <option value="INR (₹)">INR (₹ - Indian Rupee)</option>
                      <option value="USD ($)">USD ($ - US Dollar)</option>
                      <option value="AED (د.إ)">AED (د.إ - UAE Dirham)</option>
                      <option value="GBP (£)">GBP (£ - British Pound)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Primary Cultural Translation Engine</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none"
                    >
                      <option value="English + Hindi / Marathi (Sarvam AI)">Sarvam AI (Indic Language TTS & NLP)</option>
                      <option value="Google Gemini Bilingual">Google Gemini 2.5 Flash Bilingual</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#25212A]">AI Multi-Agent Autopilot</p>
                    <p className="text-[11px] text-gray-500">Allow CulturalAgent & RiskAgent to auto-seed ceremonies and contingencies</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiAutopilot}
                    onChange={(e) => setAiAutopilot(e.target.checked)}
                    className="w-4 h-4 text-[#54265F] rounded"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] space-y-1">
                  <p className="text-xs font-bold text-[#25212A]">Connected Intelligence Models</p>
                  <p className="text-[11px] text-gray-500">Google Gemini 2.5 Flash • Sarvam AI Speech-to-Text • ReportLab 4.4.1</p>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#25212A]">WhatsApp Guest RSVP Dispatch</p>
                    <p className="text-[11px] text-gray-500">Enable one-click WhatsApp digital wedding invitation cards</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappSync}
                    onChange={(e) => setWhatsappSync(e.target.checked)}
                    className="w-4 h-4 text-[#54265F] rounded"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#25212A]">Critical Risk SMS Alerts</p>
                    <p className="text-[11px] text-gray-500">Instant notifications when unseasonal weather or vendor risks are logged</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#54265F] rounded"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#EEE7F3] flex items-center justify-between">
              {saved ? (
                <span className="text-xs font-bold text-[#31966A] flex items-center gap-1">
                  <Check className="w-4 h-4" /> Preferences Saved Successfully!
                </span>
              ) : (
                <span className="text-xs text-gray-400">Settings auto-sync with active workspace</span>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md hover:opacity-95 transition"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

