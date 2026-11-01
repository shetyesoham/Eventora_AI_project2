"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService, getFallbackCeremonies } from "@/services/api";
import { CeremonyItem } from "@/types";
import { useEvent } from "@/context/EventContext";
import { Sparkles, Utensils, ShoppingBag, Clock, Globe } from "lucide-react";

export default function CulturalPlannerPage() {
  const { currentEventId, currentEvent } = useEvent();
  const [ceremonies, setCeremonies] = useState<CeremonyItem[]>([]);
  const [activeTab, setActiveTab] = useState<"ceremonies" | "menu" | "shopping" | "moodboard">("ceremonies");

  useEffect(() => {
    async function loadCeremonies() {
      if (!currentEventId) return;
      try {
        const c = await apiService.getCeremonies(currentEventId);
        if (c && c.length > 0) {
          setCeremonies(c);
        } else {
          // If the ceremonies list is empty or pending generation, load regional tradition presets directly
          const regional = getFallbackCeremonies(currentEvent?.cultural_background || "Hindu Maharashtrian", currentEvent?.venue);
          setCeremonies(regional);
        }
      } catch (err) {
        console.error(err);
        const regional = getFallbackCeremonies(currentEvent?.cultural_background || "Hindu Maharashtrian", currentEvent?.venue);
        setCeremonies(regional);
      } finally {
        // loaded
      }
    }
    loadCeremonies();
  }, [currentEventId, currentEvent?.cultural_background, currentEvent?.venue]);

  const tradition = currentEvent?.cultural_background || "Hindu Maharashtrian";
  const traditionLower = tradition.toLowerCase();
  const isGujarati = traditionLower.includes("gujarati");
  const isNorthIndian = traditionLower.includes("punjabi") || traditionLower.includes("north indian");
  const isSouthIndian = traditionLower.includes("south indian") || traditionLower.includes("tamil");

  // Dynamic Menu by Selected Cultural Preference
  const currentMenu = isGujarati ? [
    { course: "Welcome Drinks & Chaas", items: ["Masala Gujarati Chaas with roasted cumin", "Fresh Kairi Sharbat"] },
    { course: "Farsan & Starters", items: ["Soft Nylon Khaman Dhokla with green chillies", "Spiced Handvo slices with sesame crust", "Khandvi rolls with mustard tadka"] },
    { course: "Royal Gujarati Thali Main Feast", items: ["Authentic Surti Undhiyu with hot puris", "Sweet & Tangy Gujarati Dal", "Ringan No Olo (Smoky roasted eggplant)", "Puri & Phulka Rotli with pure ghee", "Gujarati Kadhi with Khichdi & Papad"] },
    { course: "Auspicious Desserts", items: ["Kesar Pista Shrikhand", "Warm Moong Dal Sheera with roasted dry fruits", "Chilled Charoli Basundi"] },
  ] : isNorthIndian ? [
    { course: "Welcome Drinks", items: ["Kesari Thandai with crushed almonds", "Spiced Aam Panna"] },
    { course: "Starters & Chaat", items: ["Paneer Tikka with mint chutney", "Dahi Bhalla with pomegranate", "Amritsari Kulcha bites"] },
    { course: "Main Royal Banquet", items: ["Dal Makhani simmered in clay oven", "Paneer Lababdar", "Pindi Chhole with Bhature", "Jeera Basmati Rice", "Garlic Butter Naan"] },
    { course: "Auspicious Desserts", items: ["Hot Gulab Jamun with Rabri", "Moong Dal Halwa with roasted pistachios"] },
  ] : isSouthIndian ? [
    { course: "Welcome Drinks", items: ["Tender Coconut Water with Elachi", "Panakam with jaggery & dry ginger"] },
    { course: "Starters & Tiffin", items: ["Crisp Medu Vada with coconut chutney", "Mini Ghee Podi Idlis", "Banana Chips"] },
    { course: "Traditional Sadya Feast (Banana Leaf)", items: ["Avial (vegetables in coconut paste)", "Sambar & Rasam", "Kootu & Thoran", "Red Matta Rice with Pure Ghee", "Appalam & Mango Pickle"] },
    { course: "Auspicious Desserts", items: ["Palada Pradhaman (slow-cooked rice flake payasam)", "Parippu Payasam with coconut milk"] },
  ] : [
    { course: "Welcome Drinks", items: ["Kairi Panha with Mint", "Kokum Sharbat with roasted cumin"] },
    { course: "Starters & Farsan", items: ["Crisp Kothimbir Vadi", "Alu Vadi with grated fresh coconut", "Sabudana Vada with spicy peanut thecha"] },
    { course: "Main Feast", items: ["Authentic Puran Poli with warm pure ghee", "Katachi Amti", "Puri with Batatyachi Bhaji", "Indrayani Steamed Rice with Varan & Toop", "Khamang Kakdi salad"] },
    { course: "Auspicious Desserts", items: ["Handcrafted Ukadiche Modak with fresh saffron", "Kesar Charoli Basundi", "Seasonal Mango Amrakhand"] },
  ];

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#54265F]">
              Cultural & Creative Planner
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Active for: <strong>{currentEvent?.title}</strong> ({tradition})
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#F8F4FA] p-1.5 rounded-2xl border border-[#EEE7F3]">
            {(["ceremonies", "menu", "shopping", "moodboard"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  activeTab === tab
                    ? "bg-[#54265F] text-white shadow-xs"
                    : "text-gray-600 hover:text-[#54265F]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Ceremonies Timeline */}
        {activeTab === "ceremonies" && (
          <div className="space-y-4">
            <div className="p-4 bg-[#F8F4FA] rounded-2xl border border-[#EEE7F3] flex items-center justify-between text-xs text-[#54265F]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C58B76] flex-shrink-0" />
                <span>Cultural Intelligence Agent active: Multi-day rituals tailored for <strong>{tradition}</strong>.</span>
              </div>
              <span className="text-[10px] bg-[#31966A]/10 text-[#31966A] font-bold px-2.5 py-0.5 rounded-full">
                Regional Customization Active
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {ceremonies.length > 0 ? (
                ceremonies.map((c) => (
                  <div key={c.id} className="p-6 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs space-y-4 hover:border-[#75458B]/30 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#75458B]/10 text-[#75458B]">
                        {c.ceremony_date}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {c.start_time} - {c.end_time}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#25212A]">{c.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">📍 {c.venue}</p>
                    </div>

                    <div className="p-3 bg-[#FFFDF9] rounded-2xl border border-[#EEE7F3] text-xs space-y-1.5">
                      <p className="text-gray-700"><strong>Rituals:</strong> {c.tradition_notes}</p>
                      <p className="text-[#C58B76] font-medium"><strong>Attire:</strong> {c.attire_suggestion}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-8 text-center bg-white rounded-3xl border border-[#EEE7F3] space-y-2">
                  <Globe className="w-8 h-8 text-[#75458B] mx-auto" />
                  <h4 className="font-bold text-sm text-[#25212A]">Ceremonies Generated for {tradition}</h4>
                  <p className="text-xs text-gray-500">
                    Sacred rituals, auspicious muhurthams and reception timings synchronized with the AI Event Copilot.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Menu Planner */}
        {activeTab === "menu" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#54265F]">
                  Celebration Feast Menu: {tradition}
                </h3>
                <p className="text-xs text-gray-500">
                  Dietary Profile: <strong>{currentEvent?.food_preference || "Pure Vegetarian"}</strong> ({currentEvent?.guest_count} guests)
                </p>
              </div>
              <Utensils className="w-6 h-6 text-[#75458B]" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {currentMenu.map((course, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#75458B]">
                    {course.course}
                  </h4>
                  <ul className="text-xs text-gray-700 space-y-1.5 list-disc pl-4">
                    {course.items.map((item, i) => (
                      <li key={i} className="font-medium">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Shopping Checklist */}
        {activeTab === "shopping" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#54265F]">
                  Puja Samagri & Traditional Attire Checklist
                </h3>
                <p className="text-xs text-gray-500">Procurement list for {tradition} rituals</p>
              </div>
              <ShoppingBag className="w-6 h-6 text-[#54265F]" />
            </div>

            <div className="space-y-3">
              {[
                { cat: "Rituals & Puja", item: "Sacred Puja Samagri Kit (Turmeric, Supari, Kalash, Agni Wood)", qty: "1 Set", done: true },
                { cat: "Rituals & Puja", item: "Ceremonial sacred cloth / Antarpat / Toran", qty: "1 Piece", done: true },
                { cat: "Attire", item: "Traditional Silk Attire & Auspicious Turbans / Pheta", qty: "Full Set", done: false },
                { cat: "Decor", item: "Brass Urli bowls with marigold petals & floating scented diyas", qty: "12 Sets", done: true },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EEE7F3] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      defaultChecked={item.done}
                      className="w-4 h-4 rounded text-[#54265F] focus:ring-[#75458B]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#25212A]">{item.item}</p>
                      <span className="text-[10px] text-gray-400 font-semibold">{item.cat} • {item.qty}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.done ? "bg-[#31966A]/10 text-[#31966A]" : "bg-[#E7A23B]/10 text-[#E7A23B]"
                  }`}>
                    {item.done ? "Procured" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Mood Board */}
        {activeTab === "moodboard" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#54265F]">
                Aesthetic Color Palette: {currentEvent?.theme || "Royal Elegance"}
              </h3>
              <p className="text-xs text-gray-500">Color harmonies and decor styling guidelines for {tradition}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { name: "Deep Royal Plum", hex: "#54265F", role: "Primary Brand & Drapes" },
                { name: "Warm Champagne", hex: "#F3E5C8", role: "Banqueting Accents" },
                { name: "Rose Gold", hex: "#C58B76", role: "Floral Urli & Lighting" },
                { name: "Soft Ivory", hex: "#FFFDF9", role: "Mandap Backdrop Canvas" },
                { name: "Marigold Yellow", hex: "#E7A23B", role: "Sacred Torans & Haldi" },
              ].map((c) => (
                <div key={c.hex} className="p-4 rounded-2xl border border-[#EEE7F3] space-y-3 bg-[#FFFDF9]">
                  <div className="w-full h-16 rounded-xl shadow-inner" style={{ backgroundColor: c.hex }}></div>
                  <div>
                    <p className="text-xs font-bold text-[#25212A]">{c.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{c.hex}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
