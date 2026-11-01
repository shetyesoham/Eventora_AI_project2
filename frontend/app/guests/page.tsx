"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService } from "@/services/api";
import { Guest } from "@/types";
import { useEvent } from "@/context/EventContext";
import { Plus, Share2, Check, Clock, X, UserPlus } from "lucide-react";

export default function GuestsPage() {
  const { currentEventId, currentEvent } = useEvent();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [inviteModal, setInviteModal] = useState<Guest | null>(null);

  // Add Guest Modal State
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("Immediate Family");
  const [phone, setPhone] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<any>("Confirmed");
  const [dietary, setDietary] = useState("Vegetarian");
  const [tableAssigned, setTableAssigned] = useState("Table 1 (VIP)");

  async function loadGuests() {
    if (!currentEventId) return;
    try {
      const g = await apiService.getGuests(currentEventId);
      setGuests(g);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadGuests();
  }, [currentEventId]);

  async function handleCreateGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!currentEventId || !name.trim() || submitting) return;

    setSubmitting(true);
    try {
      await apiService.addGuest(currentEventId, {
        name,
        group_name: groupName,
        phone,
        email,
        rsvp_status: rsvpStatus,
        dietary_preference: dietary,
        plus_ones: Number(plusOnes),
        table_assigned: tableAssigned,
        invitation_sent: true,
      });

      await loadGuests();
      setIsAddGuestOpen(false);
      setName("");
      setPhone("");
    } catch (err) {
      console.error("Error creating guest:", err);
    } finally {
      setSubmitting(false);
    }
  }

  const confirmedCount = guests.filter(g => g.rsvp_status === "Confirmed").length;
  const pendingCount = guests.filter(g => g.rsvp_status === "Pending").length;

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#54265F]">
              Guest Management & Digital Invitations
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Active for: <strong>{currentEvent?.title}</strong> ({guests.length} guests recorded)
            </p>
          </div>
          <button 
            onClick={() => setIsAddGuestOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#54265F] text-white text-xs font-semibold hover:bg-[#3F1A48] transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single / CSV Guest</span>
          </button>
        </div>

        {/* 3 Overview Stat Cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Target Capacity</span>
            <p className="text-2xl font-bold text-[#25212A]">{currentEvent?.guest_count || 250} Guests</p>
            <span className="text-[11px] text-[#75458B] font-semibold">Venue Banquet Grounds</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Confirmed RSVPs</span>
            <p className="text-2xl font-bold text-[#31966A]">{confirmedCount} Recorded</p>
            <span className="text-[11px] text-gray-500">Includes +1s and relatives</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Awaiting Response</span>
            <p className="text-2xl font-bold text-[#E7A23B]">{pendingCount} Pending</p>
            <span className="text-[11px] text-gray-500">WhatsApp invitations active</span>
          </div>
        </div>

        {/* Guest Directory Table */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#54265F]">Guest List & Seating Arrangements</h3>
            <span className="text-xs font-semibold text-gray-400">{guests.length} entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F4FA] text-gray-500 font-semibold border-y border-[#EEE7F3]">
                <tr>
                  <th className="p-3">Guest Name</th>
                  <th className="p-3">Family / Group</th>
                  <th className="p-3">RSVP Status</th>
                  <th className="p-3">Dietary Preference</th>
                  <th className="p-3">Table Seating</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE7F3]">
                {guests.map((g) => (
                  <tr key={g.id} className="hover:bg-[#FFFDF9] transition">
                    <td className="p-3">
                      <p className="font-bold text-[#25212A]">{g.name}</p>
                      <p className="text-[11px] text-gray-400">{g.phone || g.email || "No contact"}</p>
                    </td>
                    <td className="p-3 font-medium text-gray-600">{g.group_name}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        g.rsvp_status === 'Confirmed' ? 'bg-[#31966A]/10 text-[#31966A]' :
                        g.rsvp_status === 'Pending' ? 'bg-[#E7A23B]/10 text-[#E7A23B]' : 'bg-[#D95C5C]/10 text-[#D95C5C]'
                      }`}>
                        {g.rsvp_status === 'Confirmed' && <Check className="w-3 h-3" />}
                        {g.rsvp_status === 'Pending' && <Clock className="w-3 h-3" />}
                        {g.rsvp_status === 'Declined' && <X className="w-3 h-3" />}
                        {g.rsvp_status}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[#75458B]">{g.dietary_preference}</td>
                    <td className="p-3 text-gray-700 font-medium">{g.table_assigned || "Unassigned"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setInviteModal(g)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#F8F4FA] text-[#54265F] font-semibold hover:bg-[#EEE7F3] transition"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Invite Card</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Guest */}
        {isAddGuestOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-[#EEE7F3]">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEE7F3]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F4FA] text-[#54265F] flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-[#75458B]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#25212A]">
                      Add New Guest
                    </h3>
                    <p className="text-xs text-gray-400">RSVP & seating registration for {currentEvent?.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddGuestOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGuest} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Guest / Family Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh & Sunita Patil"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Family / Group</label>
                    <select
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Immediate Family">Immediate Family</option>
                      <option value="Relatives & Cousins">Relatives & Cousins</option>
                      <option value="College Friends">College Friends</option>
                      <option value="Colleagues">Colleagues</option>
                      <option value="VIP Guests">VIP Guests</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Phone (for WhatsApp Invite)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98220 11223"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Dietary Requirement</label>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Vegetarian">Pure Vegetarian</option>
                      <option value="Jain (No Onion/Garlic)">Jain (No Onion/Garlic)</option>
                      <option value="Standard">Standard</option>
                      <option value="Vegan">Vegan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">RSVP Status</label>
                    <select
                      value={rsvpStatus}
                      onChange={(e) => setRsvpStatus(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Table Seating</label>
                    <input
                      type="text"
                      value={tableAssigned}
                      onChange={(e) => setTableAssigned(e.target.value)}
                      placeholder="e.g. Table 2 (Family)"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EEE7F3] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddGuestOpen(false)}
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
                    <span>{submitting ? "Adding..." : "Add Guest"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Digital Invitation Modal */}
        {inviteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border-2 border-[#F3E5C8] shadow-2xl text-center">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C58B76]">Royal Plum Invitation</span>
                <button onClick={() => setInviteModal(null)} className="font-bold">✕</button>
              </div>

              <div className="p-6 bg-gradient-to-b from-[#54265F] to-[#3F1A48] text-white rounded-2xl space-y-4 shadow-xl">
                <p className="text-[11px] text-[#F3E5C8] tracking-widest font-serif italic">॥ श्री गणेशाय नमः ॥</p>
                <h3 className="font-serif text-xl font-bold">{currentEvent?.title}</h3>
                <p className="text-xs text-[#EEE7F3]/90 leading-relaxed">
                  Cordially invite <strong>{inviteModal.name}</strong> to grace the celebration of our ceremonies.
                </p>
                <div className="pt-2 border-t border-white/20 text-[11px] text-[#F3E5C8]">
                  <p>📅 {currentEvent?.event_date}</p>
                  <p>📍 {currentEvent?.venue}, {currentEvent?.city}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const rawPhone = (inviteModal.phone || "").replace(/[^0-9]/g, "");
                  const phoneParam = rawPhone ? rawPhone : "";
                  
                  const messageText = `✨ *॥ श्री गणेशाय नमः ॥* ✨\n\n*Namaste ${inviteModal.name} ji,*\n\nWe cordially invite you and your family to grace and celebrate the auspicious occasion of:\n\n🎉 *${currentEvent?.title || "Our Royal Celebration"}*\n\n📅 *Date:* ${currentEvent?.event_date || "Auspicious Day"}\n📍 *Venue:* ${currentEvent?.venue || "Celebration Lawn"}, ${currentEvent?.city || "Pune"}\n🍽️ *Dietary Preference:* ${inviteModal.dietary_preference || "Pure Vegetarian"}\n🪑 *Reserved Seating:* ${inviteModal.table_assigned || "VIP Guest Lounge"}\n\nWe eagerly look forward to welcoming you and celebrating together!\n\n_With warm regards,_\n*The Host Family*`;

                  const encodedMsg = encodeURIComponent(messageText);
                  const url = phoneParam 
                    ? `https://wa.me/${phoneParam}?text=${encodedMsg}` 
                    : `https://wa.me/?text=${encodedMsg}`;
                  
                  window.open(url, "_blank");
                  setInviteModal(null);
                }}
                className="w-full py-3 bg-[#31966A] text-white font-bold text-xs rounded-xl hover:bg-[#287d58] transition flex items-center justify-center gap-2 shadow-md"
              >
                <Share2 className="w-4 h-4 text-[#F3E5C8]" />
                <span>Send WhatsApp Invitation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
