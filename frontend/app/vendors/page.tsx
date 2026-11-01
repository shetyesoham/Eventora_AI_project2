"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService } from "@/services/api";
import { Vendor } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useEvent } from "@/context/EventContext";
import { Store, Phone, Mail, MapPin, Star, Plus, Sparkles, X, Check } from "lucide-react";

export default function VendorsPage() {
  const { currentEventId, currentEvent } = useEvent();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [negotiationModal, setNegotiationModal] = useState<Vendor | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Add Vendor Modal State
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Catering");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [quotedAmount, setQuotedAmount] = useState(150000);
  const [advancePaid, setAdvancePaid] = useState(50000);
  const [status, setStatus] = useState<any>("Booked");
  const [notes, setNotes] = useState("");

  async function loadVendors() {
    if (!currentEventId) return;
    try {
      const v = await apiService.getVendors(currentEventId);
      setVendors(v);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadVendors();
  }, [currentEventId]);

  async function handleCreateVendor(e: React.FormEvent) {
    e.preventDefault();
    if (!currentEventId || !name.trim() || submitting) return;

    setSubmitting(true);
    try {
      await apiService.addVendor(currentEventId, {
        name,
        category,
        contact_person: contactPerson,
        phone,
        email,
        location: location || currentEvent?.city || "Pune",
        quoted_amount: Number(quotedAmount),
        advance_paid: Number(advancePaid),
        status,
        notes: notes || "Contract terms verified",
        rating: 4.8
      });

      await loadVendors();
      setIsAddVendorOpen(false);
      setName("");
      setPhone("");
      setEmail("");
    } catch (err) {
      console.error("Error creating vendor:", err);
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
              Vendor Management Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Active for: <strong>{currentEvent?.title}</strong> ({vendors.length} vendors contracted)
            </p>
          </div>
          <button 
            onClick={() => setIsAddVendorOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#54265F] text-white text-xs font-semibold hover:bg-[#3F1A48] transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Vendor</span>
          </button>
        </div>

        {/* Vendors Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {vendors.map((v) => (
            <div key={v.id} className="p-6 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-4 hover:border-[#75458B]/30 transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#75458B] px-2.5 py-0.5 bg-[#F8F4FA] rounded-md">
                    {v.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#25212A] mt-1.5">{v.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C58B76]" /> {v.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#E7A23B] bg-[#FFFDF9] border border-[#EEE7F3] px-2.5 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 fill-[#E7A23B]" />
                  <span>{v.rating || 4.8}</span>
                </div>
              </div>

              {/* Financials & Status */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EEE7F3]">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Quoted Amount</span>
                  <p className="text-sm font-bold text-[#25212A]">{formatCurrency(v.quoted_amount)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Advance Paid</span>
                  <p className="text-sm font-bold text-[#31966A]">{formatCurrency(v.advance_paid)}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 italic line-clamp-2">
                &ldquo;{v.notes}&rdquo;
              </p>

              {/* Contacts & Quick Actions */}
              <div className="pt-2 border-t border-[#EEE7F3] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <a href={`tel:${v.phone}`} className="flex items-center gap-1 hover:text-[#54265F] font-medium">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                  <a href={`mailto:${v.email}`} className="flex items-center gap-1 hover:text-[#54265F] font-medium">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                </div>

                <button
                  onClick={() => setNegotiationModal(v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F4FA] hover:bg-[#EEE7F3] text-[#54265F] text-xs font-semibold transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C58B76]" />
                  <span>AI Negotiation</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Add New Vendor */}
        {isAddVendorOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-[#EEE7F3]">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEE7F3]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F4FA] text-[#54265F] flex items-center justify-center">
                    <Store className="w-5 h-5 text-[#75458B]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#25212A]">
                      Onboard New Vendor
                    </h3>
                    <p className="text-xs text-gray-400">Add to vendor hub for {currentEvent?.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddVendorOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateVendor} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Vendor / Business Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Royal Decorators Pune"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Service Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Venue">Venue</option>
                      <option value="Catering">Catering</option>
                      <option value="Decoration">Decoration & Mandap</option>
                      <option value="Photography">Photography & Cinematography</option>
                      <option value="Music & DJ">Music & DJ</option>
                      <option value="Makeup & Styling">Makeup Artist</option>
                      <option value="Transportation">Transportation & Logistics</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Contact Person</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98220 12345"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vendor@domain.com"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">City / Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. FC Road, Pune"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Quoted Total (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={1000}
                      value={quotedAmount}
                      onChange={(e) => setQuotedAmount(Number(e.target.value))}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Advance Paid (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={advancePaid}
                      onChange={(e) => setAdvancePaid(Number(e.target.value))}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Booking Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                  >
                    <option value="Booked">Booked (Advance Paid)</option>
                    <option value="Quote Received">Quote Received (Reviewing)</option>
                    <option value="Negotiating">Negotiating Package</option>
                    <option value="Contacted">Contacted</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Deliverables & Contract Scope</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. JBL Line Array sound setup, 12-member Puneri Dhol troupe for Baraat entry & 4 hours live DJ console."
                    className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-[#EEE7F3] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddVendorOpen(false)}
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
                    <span>{submitting ? "Saving..." : "Save Vendor"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: AI Negotiation Draft */}
        {negotiationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-[#EEE7F3]">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEE7F3]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#75458B]" />
                  <h3 className="font-serif text-lg font-bold text-[#25212A]">
                    AI Negotiation Draft
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    setNegotiationModal(null);
                    setCopiedNotification(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-[#F8F4FA] rounded-2xl text-xs space-y-2 border border-[#EEE7F3] text-gray-700 leading-relaxed font-mono">
                <p>Dear {negotiationModal.contact_person || negotiationModal.name},</p>
                <p>
                  Thank you for sharing your quotation of {formatCurrency(negotiationModal.quoted_amount)} for our celebration in {negotiationModal.location || "Pune"}.
                </p>
                <p>
                  Our allocated target budget for this category is {formatCurrency(negotiationModal.quoted_amount * 0.88)}. We admire your portfolio and would love to partner with you. Would it be feasible to offer a bundled package or customize the services to align with our budget ceiling?
                </p>
                <p>Looking forward to your favorable response.</p>
                <p>Warm regards,<br />Aarav Deshmukh (Event Organizer)</p>
              </div>

              {copiedNotification && (
                <div className="p-2.5 bg-[#31966A]/10 text-[#31966A] rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Draft copied to clipboard! Ready to paste into WhatsApp or Email.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Dear ${negotiationModal.contact_person || negotiationModal.name},\nThank you for sharing your quotation of ${formatCurrency(negotiationModal.quoted_amount)}.\nOur allocated budget for this category is ${formatCurrency(negotiationModal.quoted_amount * 0.88)}. Would it be possible to customize the package to fit within our budget target?\n\nWarm regards,\nAarav Deshmukh`
                    );
                    setCopiedNotification(true);
                  }}
                  className="px-5 py-2.5 bg-[#54265F] text-white text-xs font-semibold rounded-xl hover:bg-[#3F1A48] transition shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F3E5C8]" />
                  <span>Copy Negotiation Text</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
