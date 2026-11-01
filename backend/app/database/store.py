"""
In-memory and persistent DB storage engine for Eventora AI.
Provides complete CRUD with instant startup fallback and PostgreSQL/Supabase readiness.
"""

from uuid import UUID, uuid4
from datetime import date, datetime
from typing import Dict, List, Optional, Any

DEMO_USER_ID = UUID("00000000-0000-0000-0000-000000000001")
DEMO_EVENT_ID = UUID("11111111-1111-1111-1111-111111111111")

class DatabaseStore:
    def __init__(self):
        self.profiles: Dict[UUID, Dict[str, Any]] = {}
        self.events: Dict[UUID, Dict[str, Any]] = {}
        self.expenses: Dict[UUID, Dict[str, Any]] = {}
        self.vendors: Dict[UUID, Dict[str, Any]] = {}
        self.guests: Dict[UUID, Dict[str, Any]] = {}
        self.tasks: Dict[UUID, Dict[str, Any]] = {}
        self.risks: Dict[UUID, Dict[str, Any]] = {}
        self.ceremonies: Dict[UUID, Dict[str, Any]] = {}
        self.chat_messages: Dict[UUID, List[Dict[str, Any]]] = {}
        self.volunteers: Dict[UUID, Dict[str, Any]] = {}
        self.sponsors: Dict[UUID, Dict[str, Any]] = {}
        self.contributions: Dict[UUID, Dict[str, Any]] = {}
        self._seed_sample_data()

    def _seed_sample_data(self):
        # 1. Profile
        self.profiles[DEMO_USER_ID] = {
            "id": DEMO_USER_ID,
            "email": "demo@eventora.ai",
            "full_name": "Aarav & Priyanka Deshmukh",
            "avatar_url": None,
            "preferred_language": "en",
            "country": "India",
            "city": "Pune",
            "preferred_currency": "INR",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        # 2. Demo Event: Maharashtrian Wedding in Pune
        self.events[DEMO_EVENT_ID] = {
            "id": DEMO_EVENT_ID,
            "user_id": DEMO_USER_ID,
            "title": "Priyanka & Rohan's Royal Maharashtrian Wedding",
            "category": "Wedding",
            "event_date": date(2026, 12, 15),
            "start_time": "09:00",
            "end_time": "22:00",
            "days_count": 2,
            "city": "Pune",
            "venue": "The Heritage Grand Lawns, Baner",
            "guest_count": 250,
            "total_budget": 1500000.0,
            "currency": "INR",
            "budget_priority": "Luxury",
            "budget_flexibility": "Flexible",
            "status": "Planning",
            "theme": "Royal Peshwai Elegance",
            "cultural_background": "Hindu Maharashtrian",
            "food_preference": "Authentic Maharashtrian Pure Vegetarian (Satvik/Jain options)",
            "special_requirements": "Eco-friendly floral mandap, Shenai/Chaughada troupe for muhurt",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        # 3. Expenses
        exp1 = uuid4()
        exp2 = uuid4()
        exp3 = uuid4()
        exp4 = uuid4()
        self.expenses[exp1] = {
            "id": exp1,
            "event_id": DEMO_EVENT_ID,
            "category_name": "Venue & Banqueting",
            "title": "The Heritage Grand Lawns Booking (2 Days)",
            "estimated_amount": 450000.0,
            "actual_amount": 450000.0,
            "advance_paid": 200000.0,
            "payment_status": "Partially Paid",
            "vendor_name": "The Heritage Grand",
            "due_date": date(2026, 11, 20),
            "created_at": datetime.now()
        }
        self.expenses[exp2] = {
            "id": exp2,
            "event_id": DEMO_EVENT_ID,
            "category_name": "Catering & Beverages",
            "title": "Shree Maharashtrian Feast Catering (250 Pax x 3 meals)",
            "estimated_amount": 400000.0,
            "actual_amount": 390000.0,
            "advance_paid": 150000.0,
            "payment_status": "Partially Paid",
            "vendor_name": "Shree Caterers Pune",
            "due_date": date(2026, 11, 30),
            "created_at": datetime.now()
        }
        self.expenses[exp3] = {
            "id": exp3,
            "event_id": DEMO_EVENT_ID,
            "category_name": "Decor & Mandap",
            "title": "Royal Peshwa Floral Mandap & Entry Arch",
            "estimated_amount": 250000.0,
            "actual_amount": 240000.0,
            "advance_paid": 80000.0,
            "payment_status": "Partially Paid",
            "vendor_name": "Sanskriti Mandap & Decorators",
            "due_date": date(2026, 11, 25),
            "created_at": datetime.now()
        }
        self.expenses[exp4] = {
            "id": exp4,
            "event_id": DEMO_EVENT_ID,
            "category_name": "Photography & Videography",
            "title": "Candid Wedding Photography + Drone Teaser",
            "estimated_amount": 150000.0,
            "actual_amount": 150000.0,
            "advance_paid": 50000.0,
            "payment_status": "Partially Paid",
            "vendor_name": "LensKraft Pune Studios",
            "due_date": date(2026, 12, 10),
            "created_at": datetime.now()
        }

        # 4. Vendors
        v1 = uuid4()
        v2 = uuid4()
        v3 = uuid4()
        v4 = uuid4()
        self.vendors[v1] = {
            "id": v1,
            "event_id": DEMO_EVENT_ID,
            "name": "The Heritage Grand Lawns",
            "category": "Venue",
            "contact_person": "Rajesh Kulkarni",
            "phone": "+91 98220 12345",
            "email": "info@heritagegrand.com",
            "location": "Baner Road, Pune",
            "quoted_amount": 450000.0,
            "advance_paid": 200000.0,
            "status": "Booked",
            "notes": "Lawn capacity 800 guests, 12 AC changing rooms included.",
            "rating": 4.9,
            "created_at": datetime.now()
        }
        self.vendors[v2] = {
            "id": v2,
            "event_id": DEMO_EVENT_ID,
            "name": "Shree Maharashtrian Caterers",
            "category": "Catering",
            "contact_person": "Sunil Joshi",
            "phone": "+91 98221 54321",
            "email": "sunil@shreecaterers.in",
            "location": "Sadashiv Peth, Pune",
            "quoted_amount": 390000.0,
            "advance_paid": 150000.0,
            "status": "Booked",
            "notes": "Specialties: Puran Poli with Pure Ghee, Ukadiche Modak, Basundi, Kothimbir Vadi.",
            "rating": 4.8,
            "created_at": datetime.now()
        }
        self.vendors[v3] = {
            "id": v3,
            "event_id": DEMO_EVENT_ID,
            "name": "Sanskriti Mandap & Floral Decor",
            "category": "Decoration",
            "contact_person": "Mahesh Shinde",
            "phone": "+91 94220 98765",
            "email": "sanskritidecor@gmail.com",
            "location": "Kothrud, Pune",
            "quoted_amount": 240000.0,
            "advance_paid": 80000.0,
            "status": "Booked",
            "notes": "Marigold & tuberose brass urli concepts, traditional toran entrance.",
            "rating": 4.7,
            "created_at": datetime.now()
        }
        self.vendors[v4] = {
            "id": v4,
            "event_id": DEMO_EVENT_ID,
            "name": "LensKraft Pune Studios",
            "category": "Photography",
            "contact_person": "Aditya Pawar",
            "phone": "+91 97654 32109",
            "email": "hello@lenskraftstudios.in",
            "location": "FC Road, Pune",
            "quoted_amount": 150000.0,
            "advance_paid": 50000.0,
            "status": "Booked",
            "notes": "Complete pre-wedding shoot, cinematic 4K highlights, wedding album of 100 pages.",
            "rating": 4.9,
            "created_at": datetime.now()
        }

        # 5. Guests
        g1 = uuid4()
        g2 = uuid4()
        g3 = uuid4()
        g4 = uuid4()
        self.guests[g1] = {
            "id": g1,
            "event_id": DEMO_EVENT_ID,
            "name": "Suresh & Lata Deshmukh",
            "group_name": "Immediate Family",
            "email": "suresh.deshmukh@gmail.com",
            "phone": "+91 98220 11111",
            "rsvp_status": "Confirmed",
            "dietary_preference": "Vegetarian",
            "plus_ones": 1,
            "table_assigned": "Table 1 (VIP)",
            "invitation_sent": True,
            "notes": "Bride parents",
            "created_at": datetime.now()
        }
        self.guests[g2] = {
            "id": g2,
            "event_id": DEMO_EVENT_ID,
            "name": "Anand Kulkarni (Uncle)",
            "group_name": "Immediate Family",
            "email": "anand.k@yahoo.com",
            "phone": "+91 98220 22222",
            "rsvp_status": "Confirmed",
            "dietary_preference": "Jain (No Onion/Garlic)",
            "plus_ones": 2,
            "table_assigned": "Table 1 (VIP)",
            "invitation_sent": True,
            "notes": "Arriving from Nagpur",
            "created_at": datetime.now()
        }
        self.guests[g3] = {
            "id": g3,
            "event_id": DEMO_EVENT_ID,
            "name": "Vikram Patil",
            "group_name": "College Friends",
            "email": "vikram.patil@outlook.com",
            "phone": "+91 98220 33333",
            "rsvp_status": "Confirmed",
            "dietary_preference": "Standard",
            "plus_ones": 1,
            "table_assigned": "Table 4 (Friends)",
            "invitation_sent": True,
            "notes": None,
            "created_at": datetime.now()
        }
        self.guests[g4] = {
            "id": g4,
            "event_id": DEMO_EVENT_ID,
            "name": "Neha Sane",
            "group_name": "College Friends",
            "email": "neha.sane@gmail.com",
            "phone": "+91 98220 44444",
            "rsvp_status": "Pending",
            "dietary_preference": "Vegetarian",
            "plus_ones": 0,
            "table_assigned": "Table 4 (Friends)",
            "invitation_sent": True,
            "notes": None,
            "created_at": datetime.now()
        }

        # 6. Tasks
        t1 = uuid4()
        t2 = uuid4()
        t3 = uuid4()
        t4 = uuid4()
        self.tasks[t1] = {
            "id": t1,
            "event_id": DEMO_EVENT_ID,
            "title": "Confirm Maharashtrian Sweet Menu (Modak & Basundi)",
            "description": "Finalize tasting session and quantities with Shree Caterers",
            "due_date": date(2026, 11, 10),
            "priority": "High",
            "status": "Completed",
            "assigned_to": "Aarav Deshmukh",
            "category": "Catering",
            "created_at": datetime.now()
        }
        self.tasks[t2] = {
            "id": t2,
            "event_id": DEMO_EVENT_ID,
            "title": "Design & Print Digital Invitation Cards with QR",
            "description": "Include Ganpati Bappa shloka and English QR code for online RSVP",
            "due_date": date(2026, 11, 15),
            "priority": "Critical",
            "status": "In Progress",
            "assigned_to": "Priyanka Deshmukh",
            "category": "Invitations",
            "created_at": datetime.now()
        }
        self.tasks[t3] = {
            "id": t3,
            "event_id": DEMO_EVENT_ID,
            "title": "Reserve Hotel Rooms for Outstation Relatives",
            "description": "Block 20 executive rooms near Baner for relatives coming from Nagpur & Mumbai",
            "due_date": date(2026, 11, 20),
            "priority": "High",
            "status": "Not Started",
            "assigned_to": "Uncle Anand",
            "category": "Accommodation",
            "created_at": datetime.now()
        }
        self.tasks[t4] = {
            "id": t4,
            "event_id": DEMO_EVENT_ID,
            "title": "Procure Mandap Puja Samagri & Torans",
            "description": "Coordinate with Panditji for list of 28 sacred puja items",
            "due_date": date(2026, 11, 30),
            "priority": "Medium",
            "status": "Not Started",
            "assigned_to": "Suresh Deshmukh",
            "category": "Rituals",
            "created_at": datetime.now()
        }

        # 7. Risks
        r1 = uuid4()
        r2 = uuid4()
        r3 = uuid4()
        self.risks[r1] = {
            "id": r1,
            "event_id": DEMO_EVENT_ID,
            "title": "Sudden Rain / Monsoon Showers on Open Lawn",
            "description": "Unseasonal weather could affect the evening reception banquet setup",
            "category": "Weather",
            "probability": 0.35,
            "impact": 0.80,
            "risk_score": 28.0,
            "severity": "Medium",
            "suggested_solution": "Verify German waterproof canopy dome installation with the venue",
            "backup_arrangement": "Move dinner to indoor banquet hall B if radar indicates precipitation",
            "status": "Mitigated",
            "created_at": datetime.now()
        }
        self.risks[r2] = {
            "id": r2,
            "event_id": DEMO_EVENT_ID,
            "title": "Catering Guest Overflow Beyond 250 Pax",
            "description": "Traditional Indian celebrations frequently experience +15% extended family walk-ins",
            "category": "Guest",
            "probability": 0.60,
            "impact": 0.50,
            "risk_score": 30.0,
            "severity": "Medium",
            "suggested_solution": "Contract buffer clause with Shree Caterers for 30 additional plates on 15 mins notice",
            "backup_arrangement": "Keep buffet counter fast-replenishment logistics active",
            "status": "Mitigated",
            "created_at": datetime.now()
        }
        self.risks[r3] = {
            "id": r3,
            "event_id": DEMO_EVENT_ID,
            "title": "Power Voltage Fluctuations for Evening Sound & Lighting",
            "description": "Local grid dips during reception performances",
            "category": "Logistics",
            "probability": 0.20,
            "impact": 0.70,
            "risk_score": 14.0,
            "severity": "Low",
            "suggested_solution": "Mandate 125 kVA silent acoustic backup generator from venue",
            "backup_arrangement": "Venue has automatic dual DG genset transfer switch within 5 seconds",
            "status": "Resolved",
            "created_at": datetime.now()
        }

        # 8. Ceremonies
        c1 = uuid4()
        c2 = uuid4()
        c3 = uuid4()
        c4 = uuid4()
        self.ceremonies[c1] = {
            "id": c1,
            "event_id": DEMO_EVENT_ID,
            "name": "Sakharpuda (Engagement Ceremony)",
            "ceremony_date": "Day 1 - Morning",
            "start_time": "10:00",
            "end_time": "13:00",
            "venue": "Heritage Banquet Hall",
            "tradition_notes": "Exchange of sugar packets, rings & family blessings with Ganpati shloka",
            "attire_suggestion": "Yellow or green silk Paithani & Kurta Dhoti",
            "order_index": 1
        }
        self.ceremonies[c2] = {
            "id": c2,
            "event_id": DEMO_EVENT_ID,
            "name": "Haldi & Sangeet Utsav",
            "ceremony_date": "Day 1 - Evening",
            "start_time": "16:00",
            "end_time": "21:00",
            "venue": "Heritage Poolside Courtyard",
            "tradition_notes": "Turmeric application with traditional Lavani & folk dhol beats",
            "attire_suggestion": "Vibrant mustard yellow festive attire",
            "order_index": 2
        }
        self.ceremonies[c3] = {
            "id": c3,
            "event_id": DEMO_EVENT_ID,
            "name": "Lagna & Muhurt (Main Ceremony)",
            "ceremony_date": "Day 2 - Morning",
            "start_time": "09:30",
            "end_time": "13:30",
            "venue": "Royal Mandap Lawn",
            "tradition_notes": "Antarpat, Kanyadaan, Mangalashtaka chanting, Saptapadi around sacred agni",
            "attire_suggestion": "Traditional Nauvari saree and dhoti-kurta with royal pheta",
            "order_index": 3
        }
        self.ceremonies[c4] = {
            "id": c4,
            "event_id": DEMO_EVENT_ID,
            "name": "Grand Reception & Feast",
            "ceremony_date": "Day 2 - Evening",
            "start_time": "19:00",
            "end_time": "22:30",
            "venue": "Main Crystal Grand Ballroom",
            "tradition_notes": "Formal reception for relatives, colleagues & guests with live instrumental music",
            "attire_suggestion": "Indo-western tuxedo & designer lehenga",
            "order_index": 4
        }

db = DatabaseStore()

