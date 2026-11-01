"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Users, DollarSign, Award, CheckSquare, Heart, Shield, Plus, Sparkles, X, Check, Phone, Clock, FileCheck, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Volunteer {
  id: string;
  name: string;
  duty: string;
  shift: string;
  phone: string;
  status: "Active" | "Completed";
}

interface Sponsor {
  id: string;
  name: string;
  tier: "Platinum" | "Gold" | "Silver";
  amount: number;
  status: "Received" | "Pledged";
}

interface Permission {
  id: string;
  authority: string;
  item: string;
  status: "Approved" | "Pending Verification" | "Under Review";
}

export default function CommunityPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    { id: "1", name: "Rahul Deshpande", duty: "Prasad & Annadan Logistics", shift: "Morning (08:00 - 14:00)", phone: "+91 98220 11223", status: "Active" },
    { id: "2", name: "Tanvi Kulkarni", duty: "Cultural Stage & Sound Anchor", shift: "Evening (17:00 - 22:00)", phone: "+91 98220 44556", status: "Active" },
    { id: "3", name: "Siddharth Joshi", duty: "Crowd Queues & Emergency First Aid", shift: "Full Day Standby", phone: "+91 98220 77889", status: "Active" }
  ]);

  const [sponsors, setSponsors] = useState<Sponsor[]>([
    { id: "1", name: "Sahyadri Builders & Developers", tier: "Platinum", amount: 150000, status: "Received" },
    { id: "2", name: "Pristine Organic Feeds", tier: "Gold", amount: 75000, status: "Received" },
    { id: "3", name: "Chitnis Jewelers Baner", tier: "Silver", amount: 35000, status: "Pledged" }
  ]);

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: "1", authority: "Pune Municipal Corporation (PMC)", item: "Pandal & Temporary Stage Ground Clearance", status: "Approved" },
    { id: "2", authority: "Chatushrungi Traffic Police", item: "No-Objection Certificate for Procession Route", status: "Approved" },
    { id: "3", authority: "Maharashtra State Electricity (MSEDCL)", item: "Temporary 3-Phase Commercial Power Hookup", status: "Approved" },
    { id: "4", authority: "Local Police Station & Sound Dept", item: "Loudspeaker Timings Permit (up to 10:00 PM)", status: "Pending Verification" }
  ]);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"volunteer" | "sponsor" | "permission">("volunteer");

  // Volunteer Form Fields
  const [volName, setVolName] = useState("");
  const [volDuty, setVolDuty] = useState("Crowd & Gate Management");
  const [volShift, setVolShift] = useState("Morning (08:00 - 14:00)");
  const [volPhone, setVolPhone] = useState("");

  // Sponsor Form Fields
  const [spName, setSpName] = useState("");
  const [spTier, setSpTier] = useState<"Platinum" | "Gold" | "Silver">("Gold");
  const [spAmount, setSpAmount] = useState(50000);
  const [spStatus, setSpStatus] = useState<"Received" | "Pledged">("Received");

  // Permission Form Fields
  const [permAuthority, setPermAuthority] = useState("");
  const [permItem, setPermItem] = useState("");
  const [permStatus, setPermStatus] = useState<"Approved" | "Pending Verification">("Pending Verification");

  const totalSponsorship = sponsors.reduce((acc, s) => acc + s.amount, 0);
  const clearedCount = permissions.filter(p => p.status === "Approved").length;

  function handleAddVolunteer(e: React.FormEvent) {
    e.preventDefault();
    if (!volName.trim()) return;

    const newVol: Volunteer = {
      id: Date.now().toString(),
      name: volName.trim(),
      duty: volDuty,
      shift: volShift,
      phone: volPhone || "+91 98000 00000",
      status: "Active"
    };

    setVolunteers(prev => [newVol, ...prev]);
    setIsAddOpen(false);
    setVolName("");
    setVolPhone("");
  }

  function handleAddSponsor(e: React.FormEvent) {
    e.preventDefault();
    if (!spName.trim()) return;

    const newSp: Sponsor = {
      id: Date.now().toString(),
      name: spName.trim(),
      tier: spTier,
      amount: Number(spAmount) || 25000,
      status: spStatus
    };

    setSponsors(prev => [newSp, ...prev]);
    setIsAddOpen(false);
    setSpName("");
    setSpAmount(50000);
  }

  function handleAddPermission(e: React.FormEvent) {
    e.preventDefault();
    if (!permItem.trim()) return;

    const newPerm: Permission = {
      id: Date.now().toString(),
      authority: permAuthority.trim() || "Municipal Corporation / Local Ward Office",
      item: permItem.trim(),
      status: permStatus
    };

    setPermissions(prev => [...prev, newPerm]);
    setIsAddOpen(false);
    setPermAuthority("");
    setPermItem("");
  }

  function handleDeletePermission(e: React.MouseEvent, permId: string) {
    e.stopPropagation();
    setPermissions(prev => prev.filter(p => p.id !== permId));
  }

  function togglePermissionStatus(permId: string) {
    setPermissions(prev => prev.map(p => {
      if (p.id === permId) {
        const next = p.status === "Approved" ? "Pending Verification" : "Approved";
        return { ...p, status: next };
      }
      return p;
    }));
  }

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#54265F]">
              Community & Festival Workspace
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Ganesh Utsav, Navratri, society celebrations, volunteer rosters, sponsorships & municipal permission checklists
            </p>
          </div>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4 text-[#F3E5C8]" />
            <span>Add Volunteer / Sponsor</span>
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Registered Volunteers</span>
            <p className="text-2xl font-bold text-[#54265F]">{volunteers.length} Active</p>
            <span className="text-[11px] text-[#31966A] font-semibold">Duty rosters fully covered</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Sponsorship Funds</span>
            <p className="text-2xl font-bold text-[#25212A]">{formatCurrency(totalSponsorship)}</p>
            <span className="text-[11px] text-[#75458B] font-semibold">{sponsors.length} Corporate & local sponsors</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Municipal Permissions</span>
            <p className="text-2xl font-bold text-[#31966A]">{clearedCount}/{permissions.length} Cleared</p>
            <span className="text-[11px] text-gray-500">Click permissions below to update status</span>
          </div>
        </div>

        {/* 2-Column: Volunteers & Sponsorships */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Volunteer Roster */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#54265F]">Volunteer Duty Roster</h3>
              <Users className="w-5 h-5 text-[#75458B]" />
            </div>
            <div className="space-y-3">
              {volunteers.map((vol) => (
                <div key={vol.id} className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] space-y-1.5 hover:border-[#75458B]/30 transition">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#25212A]">{vol.name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#31966A]/10 text-[#31966A]">
                      {vol.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#75458B] font-medium">Duty: {vol.duty}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <span>🕒 {vol.shift}</span>
                    <span>📞 {vol.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsors Tracker */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#54265F]">Sponsorship & Contributions</h3>
              <Award className="w-5 h-5 text-[#C58B76]" />
            </div>
            <div className="space-y-3">
              {sponsors.map((sp) => (
                <div key={sp.id} className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] flex items-center justify-between hover:border-[#75458B]/30 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        sp.tier === 'Platinum' ? 'bg-[#54265F] text-white' :
                        sp.tier === 'Gold' ? 'bg-[#E7A23B] text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {sp.tier}
                      </span>
                      <p className="text-xs font-bold text-[#25212A]">{sp.name}</p>
                    </div>
                    <p className="text-xs font-bold text-[#31966A] mt-1">{formatCurrency(sp.amount)}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    sp.status === 'Received' ? 'bg-[#31966A]/10 text-[#31966A]' : 'bg-[#E7A23B]/10 text-[#E7A23B]'
                  }`}>
                    {sp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Administrative Permissions Checklist */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#54265F]">Municipal & Administrative Permissions</h3>
              <p className="text-xs text-gray-400">Click any card to toggle status, or click the trash icon to remove</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setModalTab("permission");
                  setIsAddOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#54265F]/10 text-[#54265F] text-xs font-bold hover:bg-[#54265F]/20 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Permission</span>
              </button>
              <Shield className="w-5 h-5 text-[#54265F]" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {permissions.map((p) => (
              <div 
                key={p.id} 
                onClick={() => togglePermissionStatus(p.id)}
                className="p-4 rounded-2xl bg-[#F8F4FA] border border-[#EEE7F3] flex items-start justify-between gap-3 hover:border-[#54265F]/40 cursor-pointer transition shadow-2xs group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{p.authority}</span>
                  <p className="text-xs font-bold text-[#25212A]">{p.item}</p>
                  <p className="text-[10px] text-gray-400">Click to change status</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition ${
                    p.status === 'Approved' ? 'bg-[#31966A]/10 text-[#31966A]' : 'bg-[#E7A23B]/10 text-[#E7A23B]'
                  }`}>
                    {p.status}
                  </span>
                  <button
                    onClick={(e) => handleDeletePermission(e, p.id)}
                    title="Remove Permission"
                    className="text-gray-300 hover:text-red-500 p-1 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Volunteer / Sponsor Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 border border-[#EEE7F3] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#EEE7F3] pb-4">
                <div className="flex items-center gap-2 bg-[#F8F4FA] p-1 rounded-xl border border-[#EEE7F3]">
                  <button
                    type="button"
                    onClick={() => setModalTab("volunteer")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      modalTab === "volunteer" ? "bg-[#54265F] text-white shadow-xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    + Volunteer
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab("sponsor")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      modalTab === "sponsor" ? "bg-[#54265F] text-white shadow-xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    + Sponsor
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab("permission")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      modalTab === "permission" ? "bg-[#54265F] text-white shadow-xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    + Permission
                  </button>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Volunteer Form */}
              {modalTab === "volunteer" ? (
                <form onSubmit={handleAddVolunteer} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Volunteer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                      placeholder="e.g. Omkar Shinde"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Assigned Duty</label>
                    <input
                      type="text"
                      value={volDuty}
                      onChange={(e) => setVolDuty(e.target.value)}
                      placeholder="e.g. Prasad Distribution & Pandal Traffic"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700">Shift Timing</label>
                      <select
                        value={volShift}
                        onChange={(e) => setVolShift(e.target.value)}
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                      >
                        <option value="Morning (08:00 - 14:00)">Morning (08:00 - 14:00)</option>
                        <option value="Evening (17:00 - 22:00)">Evening (17:00 - 22:00)</option>
                        <option value="Full Day Standby">Full Day Standby</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700">Phone Number</label>
                      <input
                        type="text"
                        value={volPhone}
                        onChange={(e) => setVolPhone(e.target.value)}
                        placeholder="+91 98220 55667"
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EEE7F3] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md"
                    >
                      <Check className="w-4 h-4 text-[#F3E5C8]" />
                      <span>Register Volunteer</span>
                    </button>
                  </div>
                </form>
              ) : modalTab === "sponsor" ? (
                /* Sponsor Form */
                <form onSubmit={handleAddSponsor} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Sponsor / Business Name *</label>
                    <input
                      type="text"
                      required
                      value={spName}
                      onChange={(e) => setSpName(e.target.value)}
                      placeholder="e.g. Pune Urban Cooperative Bank"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700">Sponsorship Tier</label>
                      <select
                        value={spTier}
                        onChange={(e) => setSpTier(e.target.value as any)}
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                      >
                        <option value="Platinum">Platinum</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700">Contribution (₹)</label>
                      <input
                        type="number"
                        min={1000}
                        step={1000}
                        value={spAmount}
                        onChange={(e) => setSpAmount(Number(e.target.value))}
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Payment Status</label>
                    <select
                      value={spStatus}
                      onChange={(e) => setSpStatus(e.target.value as any)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Received">Received (Banked)</option>
                      <option value="Pledged">Pledged (Committed)</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-[#EEE7F3] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md"
                    >
                      <Check className="w-4 h-4 text-[#F3E5C8]" />
                      <span>Record Sponsor</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Permission Form */
                <form onSubmit={handleAddPermission} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Permission / Clearance Requirement *</label>
                    <input
                      type="text"
                      required
                      value={permItem}
                      onChange={(e) => setPermItem(e.target.value)}
                      placeholder="e.g. Fire Safety & Extinguisher Inspection NOC"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Issuing Department / Authority</label>
                    <input
                      type="text"
                      value={permAuthority}
                      onChange={(e) => setPermAuthority(e.target.value)}
                      placeholder="e.g. Pune Central Fire Brigade Station"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Initial Approval Status</label>
                    <select
                      value={permStatus}
                      onChange={(e) => setPermStatus(e.target.value as any)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Pending Verification">Pending Verification (Under Process)</option>
                      <option value="Approved">Approved (Clearance Received)</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-[#EEE7F3] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md"
                    >
                      <Check className="w-4 h-4 text-[#F3E5C8]" />
                      <span>Add Clearance Record</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

