"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService } from "@/services/api";
import { EventItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { 
  Calendar, Plus, MapPin, Users, Wallet, ArrowRight, 
  Sparkles, X, CheckCircle2, ChevronRight, ChevronLeft, Globe, Utensils
} from "lucide-react";

export default function MyEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Multi-step Wizard Step (1: Category & Details, 2: Budget, 3: Cultural & Regional Preferences)
  const [step, setStep] = useState(1);

  // Step 1: Basic Event Details
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Wedding");
  const [eventDate, setEventDate] = useState("2026-12-15");
  const [city, setCity] = useState("Pune");
  const [venue, setVenue] = useState("");
  const [guestCount, setGuestCount] = useState(250);
  const [daysCount, setDaysCount] = useState(2);

  // Step 2: Financial & Budget
  const [totalBudget, setTotalBudget] = useState(1500000);
  const [budgetPriority, setBudgetPriority] = useState<"Luxury" | "Balanced" | "Budget-Friendly">("Balanced");

  // Step 3: Cultural, Regional & Food Preferences
  const [culturalBackground, setCulturalBackground] = useState("Hindu Maharashtrian");
  const [foodPreference, setFoodPreference] = useState("Authentic Pure Vegetarian (Satvik & Jain options)");
  const [theme, setTheme] = useState("Royal Peshwai Elegance");
  const [specialRequirements, setSpecialRequirements] = useState("Shenai troupe, floral mandap, traditional brass urlis");

  async function loadEvents() {
    try {
      const evs = await apiService.getEvents();
      setEvents(evs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await apiService.createEvent({
        title,
        category,
        event_date: eventDate,
        city,
        venue: venue || `${city} Celebration Grounds`,
        guest_count: Number(guestCount),
        total_budget: Number(totalBudget),
        days_count: Number(daysCount),
        currency: "INR",
        budget_priority: budgetPriority,
        budget_flexibility: "Flexible",
        status: "Planning",
        cultural_background: culturalBackground,
        food_preference: foodPreference,
        theme: theme,
        special_requirements: specialRequirements
      });

      await loadEvents();
      setModalOpen(false);
      setStep(1);
      setTitle("");
      setVenue("");
    } catch (err) {
      console.error("Failed to create event:", err);
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
              My Events Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Manage your active celebrations, community utsavs, and past gatherings
            </p>
          </div>
          <button 
            onClick={() => {
              setStep(1);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#54265F] text-white text-xs font-semibold hover:bg-[#3F1A48] transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div key={ev.id} className="p-6 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs hover:border-[#75458B]/40 hover:shadow-lg transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#75458B] px-2.5 py-0.5 bg-[#F8F4FA] rounded-md">
                    {ev.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#31966A]/10 text-[#31966A]">
                    {ev.status}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#25212A] line-clamp-1">{ev.title}</h3>
                
                <div className="space-y-1.5 text-xs text-gray-500">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#75458B]" /> {ev.event_date} ({ev.days_count} Days)
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C58B76]" /> {ev.venue}, {ev.city}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#54265F]" /> {ev.guest_count} Guests Allocated
                  </p>
                  {ev.cultural_background && (
                    <p className="flex items-center gap-1.5 text-[#75458B] font-semibold text-[11px] pt-1">
                      <Globe className="w-3.5 h-3.5 text-[#C58B76]" /> {ev.cultural_background}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EEE7F3] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Total Budget</span>
                  <p className="text-base font-bold text-[#54265F]">{formatCurrency(ev.total_budget)}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="px-3.5 py-1.5 rounded-xl bg-[#F8F4FA] hover:bg-[#EEE7F3] text-[#54265F] font-bold text-xs flex items-center gap-1 transition"
                >
                  <span>Open Cockpit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: 3-Step AI Event Creation Wizard */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-[#EEE7F3]">
              
              {/* Header & Steps Indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EEE7F3]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F4FA] text-[#54265F] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#75458B]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#25212A]">
                      AI Event Creation Wizard
                    </h3>
                    <p className="text-xs text-gray-400">Step {step} of 3 • {step === 1 ? "Event Details" : step === 2 ? "Budget & Scale" : "Cultural & Regional Preferences"}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step Progress Bar */}
              <div className="grid grid-cols-3 gap-2">
                <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? "bg-[#54265F]" : "bg-gray-200"}`}></div>
                <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? "bg-[#54265F]" : "bg-gray-200"}`}></div>
                <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? "bg-[#54265F]" : "bg-gray-200"}`}></div>
              </div>

              <form onSubmit={step === 3 ? handleCreateEvent : (e) => { e.preventDefault(); setStep(step + 1); }} className="space-y-4">
                
                {/* STEP 1: EVENT DETAILS */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700">Celebration / Event Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Priyanka & Rohan's Royal Wedding or Aarav's 1st Birthday Gala"
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs sm:text-sm focus:border-[#75458B] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                        >
                          <option value="Wedding">Wedding</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Anniversary">Anniversary</option>
                          <option value="Engagement">Engagement Ceremony</option>
                          <option value="Baby Shower">Baby Shower / Dohale Jevan</option>
                          <option value="Festival">Festival & Puja</option>
                          <option value="Corporate">Corporate Event</option>
                          <option value="Community">Community Celebration</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Duration (Days)</label>
                        <input
                          type="number"
                          min={1}
                          max={7}
                          value={daysCount}
                          onChange={(e) => setDaysCount(Number(e.target.value))}
                          className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Event Date</label>
                        <input
                          type="date"
                          required
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">City *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Pune, Mumbai, Bangalore"
                          className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700">Venue Name / Area</label>
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="e.g. The Heritage Grand Lawns, Baner"
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: BUDGET & SCALE */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Expected Guests</label>
                        <input
                          type="number"
                          min={10}
                          step={10}
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Total Planned Budget (₹) *</label>
                        <input
                          type="number"
                          step={10000}
                          value={totalBudget}
                          onChange={(e) => setTotalBudget(Number(e.target.value))}
                          className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700">Budget Priority</label>
                      <select
                        value={budgetPriority}
                        onChange={(e) => setBudgetPriority(e.target.value as any)}
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                      >
                        <option value="Luxury">Luxury (Grand floral decor, premium multi-course banqueting)</option>
                        <option value="Balanced">Balanced (Optimal value and elegant guest comfort)</option>
                        <option value="Budget-Friendly">Budget-Friendly (Optimized vendor packaging & digital invites)</option>
                      </select>
                    </div>

                    <div className="p-4 bg-[#F8F4FA] rounded-2xl border border-[#EEE7F3] space-y-2">
                      <p className="text-xs font-bold text-[#54265F]">AI Budget Calculation Preview</p>
                      <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-600">
                        <div>Venue: ~{formatCurrency(totalBudget * 0.30)}</div>
                        <div>Catering: ~{formatCurrency(totalBudget * 0.27)}</div>
                        <div>Decor: ~{formatCurrency(totalBudget * 0.16)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: CULTURAL & REGIONAL PREFERENCES */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#75458B]" />
                        Cultural Background & Regional Tradition
                      </label>
                      <select
                        value={culturalBackground}
                        onChange={(e) => setCulturalBackground(e.target.value)}
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                      >
                        <option value="Hindu Maharashtrian">Hindu Maharashtrian (Sakharpuda, Haldi, Muhurt, Saptapadi)</option>
                        <option value="North Indian / Punjabi">North Indian / Punjabi (Roka, Sangeet, Mehendi, Chooda, Baraat)</option>
                        <option value="South Indian (Tamil / Telugu / Kannada)">South Indian (Nichayathartham, Oonjal, Muhurtham, Sadya Feast)</option>
                        <option value="Gujarati">Gujarati (Gol Dhana, Sanji, Mameru, Mandap Muhurat)</option>
                        <option value="Bengali">Bengali (Aashirbaad, Gaye Holud, Saat Paake Ghaura, Subho Drishti)</option>
                        <option value="Muslim Wedding (Nikah)">Muslim Wedding (Nikah & Walima)</option>
                        <option value="Christian Wedding">Christian Wedding (Church Vows & Reception)</option>
                        <option value="Modern Contemporary / Fusion">Modern Contemporary / Fusion</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-[#75458B]" />
                        Food & Catering Dietary Preference
                      </label>
                      <select
                        value={foodPreference}
                        onChange={(e) => setFoodPreference(e.target.value)}
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                      >
                        <option value="Authentic Pure Vegetarian (Satvik & Jain options)">Authentic Pure Vegetarian (Satvik & Jain options)</option>
                        <option value="Vegetarian & Non-Vegetarian Combined">Vegetarian & Non-Vegetarian Combined Feast</option>
                        <option value="Strict Jain (No Onion, Garlic or Root Vegetables)">Strict Jain (No Onion, Garlic or Root Vegetables)</option>
                        <option value="Vegan & Eco-friendly Organic Catering">Vegan & Eco-friendly Organic Catering</option>
                        <option value="Multi-Cuisine Continental & Indian Buffet">Multi-Cuisine Continental & Indian Buffet</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700">Aesthetic Theme & Mood</label>
                      <input
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="e.g. Royal Peshwai Elegance, Minimalist Bohemian, or Pastel Floral"
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700">Special Requirements / Ritual Details</label>
                      <textarea
                        rows={2}
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                        placeholder="e.g. Eco-friendly floral mandap, Shenai/Chaughada troupe, wheelchair accessibility..."
                        className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="pt-4 border-t border-[#EEE7F3] flex items-center justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>

                    {step < 3 ? (
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#54265F] text-white text-xs font-bold hover:bg-[#3F1A48] transition shadow-md"
                      >
                        <span>Next Step</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4 text-[#F3E5C8]" />
                        <span>{submitting ? "Orchestrating Plan..." : "Generate & Save Event"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
