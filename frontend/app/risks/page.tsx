"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService } from "@/services/api";
import { RiskItem } from "@/types";
import { useEvent } from "@/context/EventContext";
import { ShieldAlert, Plus, CloudRain, AlertTriangle, CheckCircle, ShieldCheck, X, Check, Trash2 } from "lucide-react";

export default function RisksPage() {
  const { currentEventId, currentEvent } = useEvent();
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Identify Risk Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Weather");
  const [description, setDescription] = useState("");
  const [probability, setProbability] = useState(40);
  const [impact, setImpact] = useState(70);
  const [solution, setSolution] = useState("");
  const [backup, setBackup] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  async function handleAiSuggestPlan() {
    if (!title.trim() || isAiGenerating) return;
    setIsAiGenerating(true);
    try {
      const prompt = `Act as an elite wedding risk mitigation specialist. 
For an event risk titled: "${title}" in category "${category}" with context: "${description || "Wedding celebration in India"}":
1. Give a concise, professional Mitigation strategy (pre-event contractual/safeguard action).
2. Give a concrete, executable Backup Plan B (what to do on the event day if it happens).
Reply strictly in this format:
MITIGATION: <one sentence>
BACKUP: <one sentence>`;

      const res = await apiService.chatWithCopilot(currentEventId || "demo", prompt);
      const text = res.reply || "";
      
      const mitMatch = text.match(/MITIGATION:\s*([^\n\r]+)/i);
      const bakMatch = text.match(/BACKUP:\s*([^\n\r]+)/i);

      if (mitMatch && mitMatch[1]) {
        setSolution(mitMatch[1].trim());
      } else {
        setSolution(`Contract pre-booking contingency clause with ${category} vendor 30 days prior.`);
      }

      if (bakMatch && bakMatch[1]) {
        setBackup(bakMatch[1].trim());
      } else {
        setBackup(`Activate verified on-call replacement vendor and deploy backup team within 30 minutes.`);
      }
    } catch (err) {
      console.error("AI risk generation failed:", err);
      setSolution("Contract safety buffers with suppliers and secure advance refund guarantee.");
      setBackup("On-site emergency response coordinator activates secondary backup vendor.");
    } finally {
      setIsAiGenerating(false);
    }
  }

  async function loadRisks() {
    if (!currentEventId) return;
    try {
      const r = await apiService.getRisks(currentEventId);
      setRisks(r);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRisks();
  }, [currentEventId]);

  // Delete Confirmation Modal State
  const [riskToDelete, setRiskToDelete] = useState<RiskItem | null>(null);

  async function handleConfirmDelete() {
    if (!riskToDelete) return;
    const id = riskToDelete.id;
    setRisks(prev => prev.filter(r => r.id !== id));
    setRiskToDelete(null);
    try {
      await apiService.deleteRisk(id);
    } catch (err) {
      console.error("Failed to delete risk:", err);
    }
  }

  const calculatedScore = Math.round((probability / 100) * (impact / 100) * 100);
  const calculatedSeverity = calculatedScore >= 50 ? "Critical" : calculatedScore >= 25 ? "Medium" : "Low";

  async function handleCreateRisk(e: React.FormEvent) {
    e.preventDefault();
    if (!currentEventId || !title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await apiService.addRisk(currentEventId, {
        category,
        title,
        description,
        probability: Number(probability) / 100,
        impact: Number(impact) / 100,
        suggested_solution: solution || "Standard contingency buffer reserved",
        backup_arrangement: backup || "Standby vendor on call",
        severity: calculatedSeverity as any,
        status: "Mitigated"
      });

      await loadRisks();
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setSolution("");
      setBackup("");
    } catch (err) {
      console.error("Error creating risk:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#54265F]">
              Predictive Risk & Backup Engine
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Active for: <strong>{currentEvent?.title}</strong> • Deterministic severity formulas (Probability × Impact)
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4 text-[#F3E5C8]" />
            <span>Identify New Risk</span>
          </button>
        </div>

        {/* Risk Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {risks.map((r) => (
            <div key={r.id} className="p-6 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-4 hover:border-[#75458B]/30 transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#75458B] px-2.5 py-0.5 bg-[#F8F4FA] rounded-md">
                    {r.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      r.severity === 'Critical' ? 'bg-[#D95C5C] text-white' :
                      r.severity === 'High' ? 'bg-[#E7A23B] text-white' : 'bg-[#75458B] text-white'
                    }`}>
                      Score: {r.risk_score} ({r.severity})
                    </span>
                    <button
                      onClick={() => setRiskToDelete(r)}
                      title="Remove Risk"
                      className="text-gray-300 hover:text-red-500 transition p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif text-base font-bold text-[#25212A]">{r.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>

                <div className="p-3 bg-[#FFFDF9] rounded-2xl border border-[#EEE7F3] space-y-1.5 text-xs">
                  <p className="text-gray-700 font-medium"><strong>Mitigation:</strong> {r.suggested_solution}</p>
                  <p className="text-[#31966A] font-semibold"><strong>Backup Plan:</strong> {r.backup_arrangement}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EEE7F3] flex items-center justify-between text-xs">
                <span className="text-gray-400">Prob: {Math.round(r.probability * 100)}% • Impact: {Math.round(r.impact * 100)}%</span>
                <span className="font-bold text-[#31966A] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Identify New Risk Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 border border-[#EEE7F3] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-[#EEE7F3] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#54265F]/10 text-[#54265F]">
                    <ShieldAlert className="w-5 h-5 text-[#54265F]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#25212A]">Identify New Risk</h3>
                    <p className="text-xs text-gray-400">Deterministic severity scoring for {currentEvent?.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRisk} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-700">Risk Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Flight Delays for Outstation Family"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Weather">Weather</option>
                      <option value="Guest">Guest</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Vendor">Vendor</option>
                      <option value="Technical">Technical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Dense fog or airline delays during peak wedding travel season"
                    className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                  />
                </div>

                {/* Probability & Impact Sliders */}
                <div className="p-4 bg-[#F8F4FA] rounded-2xl border border-[#EEE7F3] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#54265F]">Formula Assessment</span>
                    <span className="font-bold px-2 py-0.5 rounded-md bg-[#54265F] text-white">
                      Score: {calculatedScore} ({calculatedSeverity})
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Probability: {probability}%</span>
                      <span>Impact: {impact}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="range"
                        min="5"
                        max="95"
                        step="5"
                        value={probability}
                        onChange={(e) => setProbability(Number(e.target.value))}
                        className="accent-[#54265F] cursor-pointer"
                      />
                      <input
                        type="range"
                        min="5"
                        max="95"
                        step="5"
                        value={impact}
                        onChange={(e) => setImpact(Number(e.target.value))}
                        className="accent-[#54265F] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Contingency & Plan B</span>
                  <button
                    type="button"
                    onClick={handleAiSuggestPlan}
                    disabled={!title.trim() || isAiGenerating}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-[#54265F] hover:text-[#75458B] disabled:opacity-40 transition cursor-pointer"
                  >
                    <span className="p-1 rounded-md bg-[#54265F]/10">✨</span>
                    <span>{isAiGenerating ? "AI Formulating..." : "Auto-Fill Plan with AI"}</span>
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Mitigation (Preventative Action)</label>
                  <input
                    type="text"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="e.g. Book morning buffer flights 24 hours prior to Haldi ceremony"
                    className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Backup Plan (Plan B if risk occurs)</label>
                  <input
                    type="text"
                    value={backup}
                    onChange={(e) => setBackup(e.target.value)}
                    placeholder="e.g. 2 Standby luxury Innovas at airport & virtual live stream stream link"
                    className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-[#EEE7F3] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-[#F3E5C8]" />
                    <span>{submitting ? "Analyzing & Saving..." : "Save Risk"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {riskToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-5 border border-[#EEE7F3] shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-lg font-bold text-[#25212A]">Remove Risk?</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Are you sure you want to remove <strong>&ldquo;{riskToDelete.title}&rdquo;</strong> from your contingency matrix?
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRiskToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition flex-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition flex-1 shadow-md shadow-red-600/20"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

