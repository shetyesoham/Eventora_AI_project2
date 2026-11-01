"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService } from "@/services/api";
import { TaskItem, Vendor, RiskItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useEvent } from "@/context/EventContext";
import Link from "next/link";
import { 
  Sparkles, Users, Wallet, CheckCircle2, 
  Store, AlertTriangle, ArrowUpRight, TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  const { currentEventId, currentEvent, loading: contextLoading } = useEvent();
  const [budgetData, setBudgetData] = useState<any>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!currentEventId) return;
      setLoading(true);
      try {
        const [b, t, v, r] = await Promise.all([
          apiService.getBudget(currentEventId),
          apiService.getTasks(currentEventId),
          apiService.getVendors(currentEventId),
          apiService.getRisks(currentEventId),
        ]);
        
        setBudgetData(b);
        setTasks(t);
        setVendors(v);
        setRisks(r);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [currentEventId]);

  if (contextLoading || loading || !currentEvent) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#54265F]"></div>
        </div>
      </AppShell>
    );
  }

  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const bookedVendors = vendors.filter(v => v.status === "Booked").length;

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#54265F] to-[#75458B] p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-[#54265F]/15">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#F3E5C8] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Eventora Unified Copilot Active ({currentEvent.category})
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              {currentEvent.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#EEE7F3]/90 flex items-center gap-3">
              <span>📍 {currentEvent.venue}, {currentEvent.city}</span>
              <span>•</span>
              <span>📅 {currentEvent.event_date} ({currentEvent.days_count} Days)</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/copilot"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F3E5C8] text-[#54265F] font-bold text-xs hover:bg-white transition shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#54265F]" />
              <span>Ask AI Copilot</span>
            </Link>
            <Link
              href="/event-day"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition"
            >
              Event Day View
            </Link>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Budget Metric */}
          <div className="p-6 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Budget</span>
              <div className="w-9 h-9 rounded-xl bg-[#F8F4FA] flex items-center justify-center text-[#54265F]">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#25212A]">{formatCurrency(currentEvent.total_budget)}</p>
              <p className="text-xs text-[#31966A] font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {budgetData?.utilization_rate || 0}% Spent
              </p>
            </div>
            <div className="w-full bg-[#EEE7F3] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#54265F] h-full rounded-full" style={{ width: `${Math.min(100, budgetData?.utilization_rate || 0)}%` }}></div>
            </div>
          </div>

          {/* Guest Metric */}
          <div className="p-6 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Guests</span>
              <div className="w-9 h-9 rounded-xl bg-[#F8F4FA] flex items-center justify-center text-[#75458B]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#25212A]">{currentEvent.guest_count} Pax</p>
              <p className="text-xs text-gray-500 mt-1">
                Seating for {Math.ceil(currentEvent.guest_count / 8)} Tables Calculated
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#75458B]">
              <Link href="/guests" className="hover:underline flex items-center gap-1">
                Manage RSVPs & Seating <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Tasks Progress Metric */}
          <div className="p-6 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Milestone Tasks</span>
              <div className="w-9 h-9 rounded-xl bg-[#F8F4FA] flex items-center justify-center text-[#31966A]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#25212A]">{completedTasks} of {tasks.length || 0}</p>
              <p className="text-xs text-[#31966A] font-semibold mt-1">
                {taskProgress}% Milestones Cleared
              </p>
            </div>
            <div className="w-full bg-[#EEE7F3] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#31966A] h-full rounded-full" style={{ width: `${taskProgress}%` }}></div>
            </div>
          </div>

          {/* Vendors Booked Metric */}
          <div className="p-6 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contracted Vendors</span>
              <div className="w-9 h-9 rounded-xl bg-[#F8F4FA] flex items-center justify-center text-[#C58B76]">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#25212A]">{bookedVendors} Active</p>
              <p className="text-xs text-gray-500 mt-1">
                Category contracts tracked
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#54265F]">
              <Link href="/vendors" className="hover:underline flex items-center gap-1">
                Review Vendor Quotes <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Milestones */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#54265F]">Preparation Milestones</h3>
                <p className="text-xs text-gray-500">Upcoming tasks assigned across family & vendors</p>
              </div>
              <Link href="/tasks" className="text-xs font-semibold text-[#75458B] hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.map((t) => (
                  <div 
                    key={t.id}
                    className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] flex items-start justify-between gap-4 hover:border-[#75458B]/30 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          t.priority === 'Critical' ? 'bg-[#D95C5C]/10 text-[#D95C5C]' :
                          t.priority === 'High' ? 'bg-[#E7A23B]/10 text-[#E7A23B]' : 'bg-[#31966A]/10 text-[#31966A]'
                        }`}>
                          {t.priority}
                        </span>
                        <span className="text-xs font-bold text-[#25212A]">{t.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{t.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                        <span>👤 {t.assigned_to || "Family Organizer"}</span>
                        <span>•</span>
                        <span>📅 Due: {t.due_date}</span>
                      </div>
                    </div>

                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                      t.status === 'Completed' ? 'bg-[#31966A]/10 text-[#31966A]' :
                      t.status === 'In Progress' ? 'bg-[#75458B]/10 text-[#75458B]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-gray-400 bg-[#F8F4FA] rounded-2xl">
                  Initial baseline tasks generated for {currentEvent.title}. Add custom tasks anytime in Timeline & Tasks.
                </div>
              )}
            </div>
          </div>

          {/* Right: Risk Matrix */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#54265F]">Predictive Risk Engine</h3>
                  <p className="text-xs text-gray-500">Deterministic probability x impact evaluation</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#E7A23B]/10 flex items-center justify-center text-[#E7A23B]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-3">
                {risks.length > 0 ? (
                  risks.map((r) => (
                    <div key={r.id} className="p-3.5 rounded-2xl bg-[#F8F4FA] border border-[#EEE7F3] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#25212A]">{r.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          r.severity === 'Critical' ? 'bg-[#D95C5C] text-white' :
                          r.severity === 'High' ? 'bg-[#E7A23B] text-white' : 'bg-[#75458B] text-white'
                        }`}>
                          Score: {r.risk_score}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        <strong>Contingency:</strong> {r.backup_arrangement}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-gray-400 bg-[#F8F4FA] rounded-2xl">
                    Standard safety protocols active for {currentEvent.city}.
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/risks"
              className="mt-4 block text-center py-2.5 rounded-xl border border-[#75458B] text-[#54265F] font-semibold text-xs hover:bg-[#EEE7F3]/40 transition"
            >
              Configure Contingency & Backup Protocols →
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
