"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService } from "@/services/api";
import { Vendor } from "@/types";
import { useEvent } from "@/context/EventContext";
import { 
  Phone, MapPin, 
  AlertOctagon, Clock, ShieldCheck, X, Check, Send
} from "lucide-react";

export default function EventDayPage() {
  const { currentEventId, currentEvent } = useEvent();
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Modals
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCallVenueOpen, setIsCallVenueOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Report Issue Form State
  const [issueTitle, setIssueTitle] = useState("");
  const [issueSeverity, setIssueSeverity] = useState<"Critical" | "Moderate" | "Minor">("Moderate");
  const [issueNotes, setIssueNotes] = useState("");
  const [issueReported, setIssueReported] = useState(false);

  // Ceremony items state with checkmarks
  const [ceremonySteps, setCeremonySteps] = useState([
    { id: "1", time: "09:00 AM", name: "Mandap & Floral Setup Final Inspection", status: "Completed" },
    { id: "2", time: "10:00 AM", name: "Morning Sacred Muhurt Rituals", status: "Ongoing" },
    { id: "3", time: "01:00 PM", name: "Grand Celebration Feast & Banqueting", status: "Upcoming" },
    { id: "4", time: "04:00 PM", name: "Evening Folk Music, Shenai & Sangeet", status: "Upcoming" },
  ]);

  function toggleCeremonyStatus(stepId: string) {
    setCeremonySteps(prev => prev.map(s => {
      if (s.id === stepId) {
        const next = s.status === "Completed" ? "Ongoing" : s.status === "Ongoing" ? "Upcoming" : "Completed";
        return { ...s, status: next };
      }
      return s;
    }));
  }

  async function handleSendIssueReport(e: React.FormEvent) {
    e.preventDefault();
    if (!issueTitle.trim()) return;
    setIssueReported(true);

    // 1. Auto-create an urgent task on Timeline & Tasks (/tasks)
    try {
      if (currentEventId) {
        await apiService.addTask(currentEventId, {
          title: `[ON-DAY INCIDENT] ${issueTitle}`,
          description: `${issueNotes || "Immediate resolution required on event floor."} (Reported via Event Day Runner)`,
          priority: issueSeverity === "Critical" ? "Critical" : "High",
          status: "Not Started",
          assigned_to: "Aarav Deshmukh (Lead Coordinator)",
          category: "Logistics",
          due_date: currentEvent?.event_date || new Date().toISOString().split("T")[0],
        });
      }
    } catch (err) {
      console.error("Failed to sync reported incident to tasks:", err);
    }

    // 2. Close modal after animation
    setTimeout(() => {
      setIsReportModalOpen(false);
      setIssueReported(false);
      setIssueTitle("");
      setIssueNotes("");
    }, 1500);
  }

  useEffect(() => {
    async function loadData() {
      if (!currentEventId) return;
      try {
        const v = await apiService.getVendors(currentEventId);
        const t = await apiService.getTasks(currentEventId);
        setVendors(v);
        setTasks(t);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentEventId]);

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Mobile-First Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#54265F] to-[#75458B] text-white shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-[#F3E5C8]">
              LIVE EVENT RUNNER • DAY 1
            </span>
            <span className="text-xs font-semibold text-[#F3E5C8]">{currentEvent?.event_date || "Today"}</span>
          </div>
          <h1 className="font-serif text-2xl font-bold">{currentEvent?.title}</h1>
          <p className="text-xs text-[#EEE7F3]/90">📍 Venue: {currentEvent?.venue}, {currentEvent?.city}</p>
        </div>

        {/* Emergency Quick Action Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button 
            onClick={() => setIsCallVenueOpen(true)}
            className="p-3 bg-white rounded-2xl border border-[#EEE7F3] shadow-xs flex flex-col items-center gap-1.5 text-[#54265F] hover:bg-[#F8F4FA] transition cursor-pointer"
          >
            <Phone className="w-5 h-5 text-[#31966A]" />
            <span className="text-xs font-bold">Call Venue</span>
          </button>
          <button 
            onClick={() => setIsMapModalOpen(true)}
            className="p-3 bg-white rounded-2xl border border-[#EEE7F3] shadow-xs flex flex-col items-center gap-1.5 text-[#54265F] hover:bg-[#F8F4FA] transition cursor-pointer"
          >
            <MapPin className="w-5 h-5 text-[#C58B76]" />
            <span className="text-xs font-bold">Venue Map</span>
          </button>
          <button 
            onClick={() => setIsBackupModalOpen(true)}
            className="p-3 bg-white rounded-2xl border border-[#EEE7F3] shadow-xs flex flex-col items-center gap-1.5 text-[#54265F] hover:bg-[#F8F4FA] transition cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-[#75458B]" />
            <span className="text-xs font-bold">Backup Plan</span>
          </button>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="p-3 bg-white rounded-2xl border border-[#EEE7F3] shadow-xs flex flex-col items-center gap-1.5 text-[#D95C5C] hover:bg-[#F8F4FA] transition cursor-pointer"
          >
            <AlertOctagon className="w-5 h-5" />
            <span className="text-xs font-bold">Report Issue</span>
          </button>
        </div>

        {/* Real-time Ceremony Timeline */}
        <div className="bg-white p-6 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#54265F]">Today&apos;s Ceremony Schedule</h3>
            <span className="text-[10px] text-gray-400">Tap status to update</span>
          </div>
          <div className="space-y-3">
            {ceremonySteps.map((s) => (
              <div 
                key={s.id} 
                onClick={() => toggleCeremonyStatus(s.id)}
                className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] flex items-center justify-between hover:border-[#75458B]/30 transition cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#75458B] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {s.time}
                  </span>
                  <p className="text-xs font-bold text-[#25212A] mt-0.5">{s.name}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                  s.status === 'Completed' ? 'bg-[#31966A]/10 text-[#31966A]' :
                  s.status === 'Ongoing' ? 'bg-[#E7A23B]/10 text-[#E7A23B]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rapid Vendor Call Directory */}
        <div className="bg-white p-6 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#54265F]">Vendor Direct Hotlines</h3>
          <div className="divide-y divide-[#EEE7F3]">
            {vendors.map((v) => (
              <div key={v.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#25212A]">{v.name}</p>
                  <p className="text-[11px] text-gray-400">{v.category} • {v.contact_person}</p>
                </div>
                <a
                  href={`tel:${v.phone}`}
                  className="px-3 py-1.5 bg-[#31966A] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#287d58] transition shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
              </div>
            ))}
          </div>
        </div>
        {/* Backup Plan Contingency Modal */}
        {isBackupModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 border border-[#EEE7F3] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#EEE7F3] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#54265F]/10 text-[#54265F]">
                    <ShieldCheck className="w-5 h-5 text-[#54265F]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#25212A]">On-Day Backup Protocols</h3>
                    <p className="text-[11px] text-gray-400">Emergency contingencies for {currentEvent?.title}</p>
                  </div>
                </div>
                <button onClick={() => setIsBackupModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#54265F] uppercase">Weather Contingency</span>
                    <span className="text-[10px] font-bold text-[#31966A] bg-[#31966A]/10 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <p className="text-xs font-bold text-[#25212A]">Sudden Rain or Storm Protocol</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Shift guests immediately into <strong>Indoor Banquet Hall B</strong>. German waterproof dome canopy certified over the mandap altar.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#54265F] uppercase">Power & Lighting Contingency</span>
                    <span className="text-[10px] font-bold text-[#31966A] bg-[#31966A]/10 px-2 py-0.5 rounded-full">Standby</span>
                  </div>
                  <p className="text-xs font-bold text-[#25212A]">Electrical Grid Dip or Trip</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Dual 125 kVA silent acoustic diesel generators on warm standby with automatic 5-second transfer switch for stage sound and spotlights.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#54265F] uppercase">Catering Contingency</span>
                    <span className="text-[10px] font-bold text-[#31966A] bg-[#31966A]/10 px-2 py-0.5 rounded-full">Contracted</span>
                  </div>
                  <p className="text-xs font-bold text-[#25212A]">Guest Overflow (+15% Walk-ins)</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Kitchen holds 30 reserve hot plates with fast-replenishment logistics ready on 15 minutes notice.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBackupModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#54265F] text-white text-xs font-bold shadow-md hover:bg-[#3F1A48] transition"
              >
                Close Protocols
              </button>
            </div>
          </div>
        )}

        {/* Report Incident Modal */}
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 border border-[#EEE7F3] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#EEE7F3] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-100 text-red-600">
                    <AlertOctagon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#25212A]">Report On-Site Incident</h3>
                    <p className="text-[11px] text-gray-400">Instantly alerts on-site event coordinator</p>
                  </div>
                </div>
                <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {issueReported ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#25212A]">Incident Logged & Dispatched</h4>
                  <p className="text-xs text-gray-500">
                    High priority alert sent to lead coordinator Aarav Deshmukh.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendIssueReport} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Incident Subject *</label>
                    <input
                      type="text"
                      required
                      value={issueTitle}
                      onChange={(e) => setIssueTitle(e.target.value)}
                      placeholder="e.g. Groom entry car delayed in traffic"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Severity Level</label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {(["Minor", "Moderate", "Critical"] as const).map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setIssueSeverity(sev)}
                          className={`py-2 rounded-xl text-xs font-bold border transition ${
                            issueSeverity === sev
                              ? sev === "Critical" 
                                ? "bg-red-600 text-white border-red-600"
                                : "bg-[#54265F] text-white border-[#54265F]"
                              : "bg-[#FFFDF9] border-[#EEE7F3] text-gray-600"
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Details / Action Requested</label>
                    <textarea
                      rows={3}
                      value={issueNotes}
                      onChange={(e) => setIssueNotes(e.target.value)}
                      placeholder="e.g. Need volunteers at Gate 2 to guide guests through bypass gate."
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsReportModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition shadow-md shadow-red-600/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Incident</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Call Venue Modal */}
        {isCallVenueOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 border border-[#EEE7F3] shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#31966A] flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#25212A]">Call Venue Manager</h3>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>{currentEvent?.venue || "Celebration Grounds"}</strong>
                </p>
                <p className="text-xs text-gray-400">Coordinator: Rajesh Kulkarni</p>
              </div>

              <div className="pt-2 space-y-2">
                <a
                  href="tel:+919822012345"
                  className="w-full py-3 rounded-xl bg-[#31966A] text-white text-xs font-bold hover:bg-[#287d58] transition flex items-center justify-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call +91 98220 12345</span>
                </a>
                <button
                  onClick={() => setIsCallVenueOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Interactive Google Map Modal */}
        {isMapModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full space-y-4 border border-[#EEE7F3] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#EEE7F3] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#C58B76]/15 text-[#C58B76]">
                    <MapPin className="w-5 h-5 text-[#C58B76]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#25212A]">Live Venue Navigation</h3>
                    <p className="text-[11px] text-gray-400">Powered by Google Maps Platform</p>
                  </div>
                </div>
                <button onClick={() => setIsMapModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Embedded Google Map */}
              <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#EEE7F3] relative bg-gray-100 shadow-inner">
                <iframe
                  title="Venue Google Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${currentEvent?.venue || "The Heritage Grand Lawns"}, ${currentEvent?.city || "Pune"}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="text-left w-full sm:w-auto">
                  <p className="text-xs font-bold text-[#25212A]">{currentEvent?.venue}</p>
                  <p className="text-[11px] text-gray-500">{currentEvent?.city}, Maharashtra</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      const q = encodeURIComponent(`${currentEvent?.venue || ""} ${currentEvent?.city || "Pune"}`);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#54265F] text-white text-xs font-bold hover:bg-[#3F1A48] transition flex items-center gap-1.5 shadow-md"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#F3E5C8]" />
                    <span>Open in Google Maps App</span>
                  </button>
                  <button
                    onClick={() => setIsMapModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

