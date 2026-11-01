import { EventItem, Expense, Vendor, Guest, TaskItem, RiskItem, CeremonyItem } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
export const DEMO_EVENT_ID = "11111111-1111-1111-1111-111111111111";

// Ceremony Presets generator by tradition for immediate instant render
export function getFallbackCeremonies(tradition: string, venue: string = "Heritage Celebration Lawn"): CeremonyItem[] {
  const t = (tradition || "").toLowerCase();
  if (t.includes("gujarati")) {
    return [
      {
        id: "guj-1",
        event_id: DEMO_EVENT_ID,
        name: "Gol Dhana & Chandlo Matli (Engagement)",
        ceremony_date: "Day 1 - Morning",
        start_time: "10:00",
        end_time: "13:00",
        venue: venue || "Heritage Banquet Hall",
        tradition_notes: "Exchange of coriander seeds, jaggery sweets & family tilak blessing",
        attire_suggestion: "Embroidered Kurta Pajama & Bandhani Saree with Garchola",
        order_index: 1
      },
      {
        id: "guj-2",
        event_id: DEMO_EVENT_ID,
        name: "Sanji & Garba-Raas Sangeet Night",
        ceremony_date: "Day 1 - Evening",
        start_time: "18:00",
        end_time: "23:00",
        venue: venue || "Grand Open Lawn",
        tradition_notes: "Energetic traditional Dandiya Raas and Garba with folk dholak & Gujarati folk songs",
        attire_suggestion: "Mirror-work Chaniya Choli & colorful Kedia Dhoti",
        order_index: 2
      },
      {
        id: "guj-3",
        event_id: DEMO_EVENT_ID,
        name: "Mameru (Mosalu) & Pithi Ritual",
        ceremony_date: "Day 2 - Morning",
        start_time: "09:00",
        end_time: "11:30",
        venue: venue || "Courtyard Hall",
        tradition_notes: "Maternal uncle presents auspicious gifts, followed by turmeric paste (Pithi) application",
        attire_suggestion: "Bright yellow silk Kurti & traditional Patola dupatta",
        order_index: 3
      },
      {
        id: "guj-4",
        event_id: DEMO_EVENT_ID,
        name: "Mandap Muhurat, Lagna & Reception Feast",
        ceremony_date: "Day 2 - Evening",
        start_time: "16:30",
        end_time: "22:00",
        venue: venue || "Royal Mandap Lawn",
        tradition_notes: "Jaimala, Kanya Daan, Hastamelap, Mangal Pheras around sacred fire and grand Gujarati Thali banquet",
        attire_suggestion: "Traditional Panetar saree with gold border & Embroidered Silk Sherwani with Safo",
        order_index: 4
      }
    ];
  } else if (t.includes("punjabi") || t.includes("north indian")) {
    return [
      {
        id: "pun-1",
        event_id: DEMO_EVENT_ID,
        name: "Roka & Chunni Ceremony",
        ceremony_date: "Day 1 - Morning",
        start_time: "10:30",
        end_time: "13:30",
        venue: venue || "Grand Banquet",
        tradition_notes: "Formal family consent, dry fruits exchange and red Chunni blessing",
        attire_suggestion: "Pastel Kurta Pajama & Pink Anarkali Suit",
        order_index: 1
      },
      {
        id: "pun-2",
        event_id: DEMO_EVENT_ID,
        name: "Dhol Night & Sangeet Utsav",
        ceremony_date: "Day 1 - Evening",
        start_time: "19:00",
        end_time: "23:59",
        venue: venue || "Grand Ballroom",
        tradition_notes: "High energy live Dhol performances, Bhangra beats and Sangeet dances",
        attire_suggestion: "Designer Kurta Bundi & Heavy Sequined Lehenga",
        order_index: 2
      },
      {
        id: "pun-3",
        event_id: DEMO_EVENT_ID,
        name: "Haldi & Chooda / Kalire Ceremony",
        ceremony_date: "Day 2 - Morning",
        start_time: "09:30",
        end_time: "12:30",
        venue: venue || "Poolside Courtyard",
        tradition_notes: "Maternal uncles adorn red Chooda and golden hanging Kalire",
        attire_suggestion: "Yellow Silk Kurti & Dhoti Kurta",
        order_index: 3
      },
      {
        id: "pun-4",
        event_id: DEMO_EVENT_ID,
        name: "Anand Karaj / Baraat & Varmala",
        ceremony_date: "Day 2 - Evening",
        start_time: "17:00",
        end_time: "23:00",
        venue: venue || "Royal Palace Grounds",
        tradition_notes: "Grand Baraat with brass band, Varmala exchange and royal Punjabi banquet",
        attire_suggestion: "Royal Red Bridal Lehenga & Velvet Sherwani with Turban",
        order_index: 4
      }
    ];
  } else if (t.includes("south indian") || t.includes("tamil") || t.includes("telugu")) {
    return [
      {
        id: "so-1",
        event_id: DEMO_EVENT_ID,
        name: "Nichayathartham (Engagement) & Vratham",
        ceremony_date: "Day 1 - Morning",
        start_time: "08:00",
        end_time: "11:30",
        venue: venue || "Temple Mandapam",
        tradition_notes: "Formal engagement, Vedic chanting, exchanging coconuts and silk clothes",
        attire_suggestion: "Pure Kanchipuram Silk Saree & Traditional Pattu Veshti",
        order_index: 1
      },
      {
        id: "so-2",
        event_id: DEMO_EVENT_ID,
        name: "Oonjal (Swing Ceremony) & Carnatic Sangeeth",
        ceremony_date: "Day 1 - Evening",
        start_time: "17:30",
        end_time: "21:30",
        venue: venue || "Floral Courtyard",
        tradition_notes: "Couple sits on decorated swing fed with sweetened milk and banana, surrounded by ladies singing Oonjal songs",
        attire_suggestion: "Half-saree (Dhavani) or Rich Banarasi / Kanjeevaram",
        order_index: 2
      },
      {
        id: "so-3",
        event_id: DEMO_EVENT_ID,
        name: "Kanyadaanam & Muhurtham (Mangalya Dharanam)",
        ceremony_date: "Day 2 - Morning",
        start_time: "06:30",
        end_time: "10:30",
        venue: venue || "Kalyana Mandapam",
        tradition_notes: "Tying of sacred Thaali / Mangalsutra at Brahma Muhurtham followed by traditional banana leaf Sadya",
        attire_suggestion: "Traditional Madisar / 9-yards Kanchi saree & Panchakacham Veshti",
        order_index: 3
      }
    ];
  }
  // Default: Maharashtrian
  return [
    {
      id: "mah-1",
      event_id: DEMO_EVENT_ID,
      name: "Sakharpuda (Ring & Sugar Ceremony)",
      ceremony_date: "Day 1 - Morning",
      start_time: "10:00",
      end_time: "13:00",
      venue: venue || "Heritage Banquet Hall",
      tradition_notes: "Exchange of sugar packets, rings & family blessings with Ganpati shloka",
      attire_suggestion: "Yellow or green silk Paithani & Kurta Dhoti",
      order_index: 1
    },
    {
      id: "mah-2",
      event_id: DEMO_EVENT_ID,
      name: "Haldi & Sangeet Utsav",
      ceremony_date: "Day 1 - Evening",
      start_time: "16:00",
      end_time: "21:00",
      venue: venue || "Heritage Poolside Courtyard",
      tradition_notes: "Turmeric application with traditional Lavani & folk dhol beats",
      attire_suggestion: "Vibrant mustard yellow festive attire",
      order_index: 2
    },
    {
      id: "mah-3",
      event_id: DEMO_EVENT_ID,
      name: "Lagna & Muhurt (Main Ceremony)",
      ceremony_date: "Day 2 - Morning",
      start_time: "09:30",
      end_time: "13:30",
      venue: venue || "Royal Mandap Lawn",
      tradition_notes: "Antarpat, Kanyadaan, Mangalashtaka chanting, Saptapadi around sacred agni",
      attire_suggestion: "Traditional Nauvari saree and dhoti-kurta with royal pheta",
      order_index: 3
    },
    {
      id: "mah-4",
      event_id: DEMO_EVENT_ID,
      name: "Grand Reception & Feast",
      ceremony_date: "Day 2 - Evening",
      start_time: "19:00",
      end_time: "22:30",
      venue: venue || "Main Crystal Grand Ballroom",
      tradition_notes: "Formal reception for relatives, colleagues & guests with live instrumental music",
      attire_suggestion: "Indo-western tuxedo & designer lehenga",
      order_index: 4
    }
  ];
}
const fallbackEvent: EventItem = {
  id: DEMO_EVENT_ID,
  title: "Priyanka & Rohan's Royal Maharashtrian Wedding",
  category: "Wedding",
  event_date: "2026-12-15",
  start_time: "09:00",
  end_time: "22:00",
  days_count: 2,
  city: "Pune",
  venue: "The Heritage Grand Lawns, Baner",
  guest_count: 250,
  total_budget: 1500000,
  currency: "INR",
  budget_priority: "Luxury",
  budget_flexibility: "Flexible",
  status: "Planning",
  theme: "Royal Peshwai Elegance",
  cultural_background: "Hindu Maharashtrian",
  food_preference: "Authentic Maharashtrian Pure Vegetarian (Satvik/Jain options)",
  special_requirements: "Eco-friendly floral mandap, Shenai/Chaughada troupe for muhurt",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const apiService = {
  // Events
  async getEvents(): Promise<EventItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      return await res.json();
    } catch {
      return [fallbackEvent];
    }
  },

  async getEvent(id: string): Promise<EventItem> {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`);
      if (!res.ok) throw new Error("Failed to fetch event");
      return await res.json();
    } catch {
      return fallbackEvent;
    }
  },

  async createEvent(eventData: Partial<EventItem>): Promise<EventItem> {
    try {
      const res = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return await res.json();
    } catch {
      return {
        ...fallbackEvent,
        ...eventData,
        id: "created-" + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as EventItem;
    }
  },

  async updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem> {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update event");
      return await res.json();
    } catch {
      return { ...fallbackEvent, ...updates };
    }
  },

  // Budget
  async getBudget(eventId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventId}/budget`);
      if (!res.ok) throw new Error("Failed to fetch budget");
      return await res.json();
    } catch {
      return {
        total_budget: 1500000,
        total_estimated: 1420000,
        total_spent: 480000,
        total_advance: 480000,
        remaining_balance: 1020000,
        utilization_rate: 32.0,
        currency: "INR",
        expenses: []
      };
    }
  },

  async addExpense(eventId: string, expense: Partial<Expense>): Promise<Expense> {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    return await res.json();
  },

  async simulateBudget(eventId: string, params: {
    guest_count: number;
    catering_cost_per_person: number;
    venue_cost: number;
    decor_cost: number;
    other_expenses: number;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventId}/budget/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("Simulation failed");
      return await res.json();
    } catch {
      const catering = params.guest_count * params.catering_cost_per_person;
      const total = catering + params.venue_cost + params.decor_cost + params.other_expenses;
      return {
        previous_budget: 1500000,
        new_estimated_budget: total,
        difference: total - 1500000,
        catering_total: catering,
        cost_per_guest: Math.round(total / params.guest_count),
        status: total <= 1500000 ? "Optimized" : "Budget Alert",
        optimization_suggestions: [
          "Pre-booking vendors 90 days earlier locks in wholesale banquet pricing.",
          "Digital video invitations reduce printing and postage costs by ₹30,000."
        ]
      };
    }
  },

  // Vendors
  async getVendors(eventId: string): Promise<Vendor[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventId}/vendors`);
      if (!res.ok) throw new Error("Failed to fetch vendors");
      return await res.json();
    } catch {
      return [];
    }
  },

  async addVendor(eventId: string, vendor: Partial<Vendor>): Promise<Vendor> {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/vendors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vendor),
    });
    return await res.json();
  },

  // Guests
  async getGuests(eventId: string): Promise<Guest[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventId}/guests`);
      if (!res.ok) throw new Error("Failed to fetch guests");
      return await res.json();
    } catch {
      return [];
    }
  },

  async addGuest(eventId: string, guest: Partial<Guest>): Promise<Guest> {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guest),
    });
    return await res.json();
  },

  // Tasks
  async getTasks(eventId: string): Promise<TaskItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventId}/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return await res.json();
    } catch {
      return [];
    }
  },

  async addTask(eventId: string, task: Partial<TaskItem>): Promise<TaskItem> {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return await res.json();
  },

  async updateTask(taskId: string, task: Partial<TaskItem>): Promise<TaskItem> {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return await res.json();
  },

  // Risks
  async getRisks(eventId: string): Promise<RiskItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventId}/risks`);
      if (!res.ok) throw new Error("Failed to fetch risks");
      return await res.json();
    } catch {
      return [];
    }
  },

  async addRisk(eventId: string, risk: Partial<RiskItem>): Promise<RiskItem> {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/risks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(risk),
    });
    return await res.json();
  },

  async deleteRisk(riskId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/risks/${riskId}`, {
      method: "DELETE",
    });
  },

  // Ceremonies
  async getCeremonies(eventId: string): Promise<CeremonyItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventId}/ceremonies`);
      if (!res.ok) throw new Error("Failed to fetch ceremonies");
      return await res.json();
    } catch {
      return [];
    }
  },

  // AI Copilot
  async chatWithCopilot(eventId: string, message: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, message }),
      });
      if (!res.ok) throw new Error("Copilot response error");
      return await res.json();
    } catch {
      return {
        reply: "I have coordinated your event requirements. Let me know if you would like me to adjust your guest count, simulate budget scenarios, or draft vendor contracts.",
        agent_name: "EventPlannerAgent"
      };
    }
  }
};

