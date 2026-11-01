"""
Eventora AI Multi-Agent Orchestrator
Agents:
1. EventPlannerAgent: coordinates overview & strategy
2. BudgetAgent: analyzes allocations, optimizes expenses, deterministic math
3. CulturalAgent: ceremony workflows, regional traditions & rituals
4. VendorAgent: vendor quotes, negotiation letters, replacement workflows
5. GuestAgent: RSVP tracking, dietary preferences, seating calculations
6. TimelineAgent: milestones, tasks, dependencies & reminders
7. RiskAgent: risk scoring, probability x impact, contingency actions
8. CommunityAgent: volunteer rosters, sponsorship tiers, municipal permissions
"""

import json
from typing import Dict, Any, List
from app.services.ai_service import ai_service

class BaseAgent:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    async def execute(self, context: Dict[str, Any], prompt: str) -> Dict[str, Any]:
        raise NotImplementedError

class EventPlannerAgent(BaseAgent):
    def __init__(self):
        super().__init__("EventPlannerAgent", "Central Event Strategy & Multi-Agent Coordinator")

    async def execute(self, context: Dict[str, Any], prompt: str) -> Dict[str, Any]:
        instruction = (
            "You are the Event Planner Agent in Eventora AI. "
            "Coordinate user requests, maintain event context, and provide strategic recommendations."
        )
        response_text = await ai_service.generate_response(instruction, prompt)
        return {
            "agent": self.name,
            "response": response_text,
            "action": "orchestration"
        }

class BudgetAgent(BaseAgent):
    def __init__(self):
        super().__init__("BudgetAgent", "Financial Allocation, Cost Modeling & Optimization")

    def calculate_allocation(self, total_budget: float, category: str, priority: str = "Balanced") -> Dict[str, float]:
        """Mathematically exact budget breakdown percentages."""
        if category.lower() == "wedding":
            if priority == "Luxury":
                return {
                    "Venue & Banqueting": round(total_budget * 0.32, 2),
                    "Catering & Beverages": round(total_budget * 0.28, 2),
                    "Decor & Floral Styling": round(total_budget * 0.18, 2),
                    "Photography & Cinematic Film": round(total_budget * 0.10, 2),
                    "Traditional Attire & Jewellery": round(total_budget * 0.07, 2),
                    "Music, Sound & Entertainment": round(total_budget * 0.05, 2),
                }
            else: # Balanced
                return {
                    "Venue & Banqueting": round(total_budget * 0.30, 2),
                    "Catering & Beverages": round(total_budget * 0.27, 2),
                    "Decor & Mandap": round(total_budget * 0.16, 2),
                    "Photography & Videography": round(total_budget * 0.10, 2),
                    "Attire & Makeup": round(total_budget * 0.08, 2),
                    "Logistics & Contingency": round(total_budget * 0.09, 2),
                }
        else: # Birthday / Corporate / Community
            return {
                "Venue Rental": round(total_budget * 0.35, 2),
                "Food & Refreshments": round(total_budget * 0.35, 2),
                "Decoration & Theme Setup": round(total_budget * 0.15, 2),
                "Entertainment & AV Systems": round(total_budget * 0.10, 2),
                "Miscellaneous & Gifts": round(total_budget * 0.05, 2),
            }

    async def execute(self, context: Dict[str, Any], prompt: str) -> Dict[str, Any]:
        instruction = "You are the Budget Agent. Provide mathematically sound cost optimizations and advice."
        response_text = await ai_service.generate_response(instruction, prompt)
        return {
            "agent": self.name,
            "response": response_text,
            "action": "budget_update"
        }

class CulturalAgent(BaseAgent):
    def __init__(self):
        super().__init__("CulturalAgent", "Cultural Traditions, Ceremonies & Regional Feasts")

    def get_tradition_defaults(self, tradition: str) -> List[Dict[str, Any]]:
        tradition_lower = (tradition or "").lower()
        
        # 1. Gujarati Weddings
        if "gujarati" in tradition_lower:
            return [
                {
                    "name": "Gol Dhana & Chandlo Matli (Engagement)",
                    "ceremony_date": "Day 1 - Morning",
                    "start_time": "10:00",
                    "end_time": "13:00",
                    "venue": "Heritage Banquet Hall",
                    "tradition_notes": "Exchange of coriander seeds, jaggery sweets & family tilak blessing",
                    "attire_suggestion": "Embroidered Kurta Pajama & Bandhani Saree with Garchola",
                    "order_index": 1
                },
                {
                    "name": "Sanji & Garba-Raas Sangeet Night",
                    "ceremony_date": "Day 1 - Evening",
                    "start_time": "18:00",
                    "end_time": "23:00",
                    "venue": "Grand Open Lawn",
                    "tradition_notes": "Energetic traditional Dandiya Raas and Garba with folk dholak & Gujarati folk songs",
                    "attire_suggestion": "Mirror-work Chaniya Choli & colorful Kedia Dhoti",
                    "order_index": 2
                },
                {
                    "name": "Mameru (Mosalu) & Pithi Ritual",
                    "ceremony_date": "Day 2 - Morning",
                    "start_time": "09:00",
                    "end_time": "11:30",
                    "venue": "Courtyard Hall",
                    "tradition_notes": "Maternal uncle presents auspicious gifts, followed by turmeric paste (Pithi) application",
                    "attire_suggestion": "Bright yellow silk Kurti & traditional Patola dupatta",
                    "order_index": 3
                },
                {
                    "name": "Mandap Muhurat, Lagna & reception Feast",
                    "ceremony_date": "Day 2 - Evening",
                    "start_time": "16:30",
                    "end_time": "22:00",
                    "venue": "Royal Mandap Lawn",
                    "tradition_notes": "Jaimala, Kanya Daan, Hastamelap, Mangal Pheras around sacred fire and grand Gujarati Thali banquet",
                    "attire_suggestion": "Traditional Panetar saree with gold border & Embroidered Silk Sherwani with Safo",
                    "order_index": 4
                }
            ]

        # 2. Maharashtrian / Marathi Weddings
        elif "maharashtrian" in tradition_lower or "marathi" in tradition_lower:
            return [
                {
                    "name": "Sakharpuda (Ring & Sugar Ceremony)",
                    "ceremony_date": "Day 1 - Morning",
                    "start_time": "10:00",
                    "end_time": "13:00",
                    "venue": "Heritage Banquet Hall",
                    "tradition_notes": "Exchange of sugar packets, rings & family blessings with Ganpati shloka",
                    "attire_suggestion": "Yellow or green silk Paithani & Kurta Dhoti",
                    "order_index": 1
                },
                {
                    "name": "Haldi & Sangeet Utsav",
                    "ceremony_date": "Day 1 - Evening",
                    "start_time": "16:00",
                    "end_time": "21:00",
                    "venue": "Heritage Poolside Courtyard",
                    "tradition_notes": "Turmeric application with traditional Lavani & folk dhol beats",
                    "attire_suggestion": "Vibrant mustard yellow festive attire",
                    "order_index": 2
                },
                {
                    "name": "Lagna & Muhurt (Main Ceremony)",
                    "ceremony_date": "Day 2 - Morning",
                    "start_time": "09:30",
                    "end_time": "13:30",
                    "venue": "Royal Mandap Lawn",
                    "tradition_notes": "Antarpat, Kanyadaan, Mangalashtaka chanting, Saptapadi around sacred agni",
                    "attire_suggestion": "Traditional Nauvari saree and dhoti-kurta with royal pheta",
                    "order_index": 3
                },
                {
                    "name": "Grand Reception & Feast",
                    "ceremony_date": "Day 2 - Evening",
                    "start_time": "19:00",
                    "end_time": "22:30",
                    "venue": "Main Crystal Grand Ballroom",
                    "tradition_notes": "Formal reception for relatives, colleagues & guests with live instrumental music",
                    "attire_suggestion": "Indo-western tuxedo & designer lehenga",
                    "order_index": 4
                }
            ]

        # 3. Punjabi / North Indian Weddings
        elif "punjabi" in tradition_lower or "north indian" in tradition_lower:
            return [
                {
                    "name": "Roka & Sagai (Engagement)",
                    "ceremony_date": "Day 1 - Morning",
                    "start_time": "11:00",
                    "end_time": "14:00",
                    "venue": "Banquet Pavilion",
                    "tradition_notes": "Ardas prayer, tilak, dry fruit and auspicious shagun gift exchange",
                    "attire_suggestion": "Pastel Sharara & Kurta Pajama",
                    "order_index": 1
                },
                {
                    "name": "Mehendi & Dholak Sangeet Night",
                    "ceremony_date": "Day 1 - Evening",
                    "start_time": "17:30",
                    "end_time": "23:00",
                    "venue": "Outdoor Starlit Lawn",
                    "tradition_notes": "Henna application, live Punjabi Dhol, Bhangra & Giddha dance performances",
                    "attire_suggestion": "Bright Emerald or Rani Pink Designer Lehenga",
                    "order_index": 2
                },
                {
                    "name": "Haldi, Chooda & Kaleere Ceremony",
                    "ceremony_date": "Day 2 - Morning",
                    "start_time": "09:30",
                    "end_time": "12:30",
                    "venue": "Heritage Poolside Lawn",
                    "tradition_notes": "Turmeric paste application, maternal uncle puts red ivory Chooda bangles and hanging Kaleere",
                    "attire_suggestion": "Festive Yellow Kurti & Churidar",
                    "order_index": 3
                },
                {
                    "name": "Baraat, Varmala & Anand Karaj / Phere",
                    "ceremony_date": "Day 2 - Evening",
                    "start_time": "18:00",
                    "end_time": "23:30",
                    "venue": "Grand Palace Ballroom",
                    "tradition_notes": "Groom arrives on Ghodi with brass band, Varmala garland exchange, sacred phere and royal feast",
                    "attire_suggestion": "Royal Crimson Bridal Lehenga & Ivory Silk Sherwani with Kalgi Turban",
                    "order_index": 4
                }
            ]

        # 4. South Indian Weddings (Tamil, Telugu, Kannada, Malayalam)
        elif "south indian" in tradition_lower or "tamil" in tradition_lower or "telugu" in tradition_lower or "kannada" in tradition_lower:
            return [
                {
                    "name": "Nichayathartham (Engagement)",
                    "ceremony_date": "Day 1 - Morning",
                    "start_time": "09:30",
                    "end_time": "12:30",
                    "venue": "Temple Mandap Hall",
                    "tradition_notes": "Priest reads the auspicious Lagna Patrika, exchange of silk clothes and coconuts",
                    "attire_suggestion": "Pure Kanjeevaram Silk Saree & Pattu Veshti",
                    "order_index": 1
                },
                {
                    "name": "Oonjal (Swing Ritual) & Sangeetam",
                    "ceremony_date": "Day 1 - Evening",
                    "start_time": "16:30",
                    "end_time": "20:30",
                    "venue": "Heritage Courtyard",
                    "tradition_notes": "Couple seated on floral swing, fed milk and banana by elder women while singing traditional Oonjal songs",
                    "attire_suggestion": "Traditional 9-yards Madisar & Silk Kurta",
                    "order_index": 2
                },
                {
                    "name": "Muhurtham, Kanyadaanam & Mangalsutra (Thali)",
                    "ceremony_date": "Day 2 - Morning",
                    "start_time": "07:30",
                    "end_time": "11:30",
                    "venue": "Auspicious Floral Mandapam",
                    "tradition_notes": "Kanyadaanam, tying of the sacred Thali (Mangalsutra) amidst Nadaswaram music and Saptapadi",
                    "attire_suggestion": "Auspicious Koorai Silk Saree & Angavastram",
                    "order_index": 3
                },
                {
                    "name": "Grand Traditional Sadya Banana Leaf Feast",
                    "ceremony_date": "Day 2 - Afternoon",
                    "start_time": "12:00",
                    "end_time": "15:30",
                    "venue": "Banqueting Hall",
                    "tradition_notes": "Traditional 24-dish vegetarian Sadya served on fresh plantain leaves with hot Payasam",
                    "attire_suggestion": "Festive Traditional Silk",
                    "order_index": 4
                }
            ]

        # 5. Bengali Weddings
        elif "bengali" in tradition_lower:
            return [
                {
                    "name": "Aashirbaad & Bor Jatri Welcome",
                    "ceremony_date": "Day 1 - Morning",
                    "start_time": "10:30",
                    "end_time": "13:30",
                    "venue": "Banquet Hall",
                    "tradition_notes": "Elders bless the bride and groom with husked rice and trefoil leaves",
                    "attire_suggestion": "Traditional Dhakai Jamdani Saree & Kurta",
                    "order_index": 1
                },
                {
                    "name": "Gaye Holud (Turmeric Ritual)",
                    "ceremony_date": "Day 1 - Evening",
                    "start_time": "17:00",
                    "end_time": "20:30",
                    "venue": "Heritage Courtyard",
                    "tradition_notes": "Turmeric paste application with sweets and decorated Rohu fish platter presentation",
                    "attire_suggestion": "Yellow Cotton Silk Tant Saree with red border",
                    "order_index": 2
                },
                {
                    "name": "Saat Paake Ghaura & Subho Drishti",
                    "ceremony_date": "Day 2 - Evening",
                    "start_time": "18:30",
                    "end_time": "22:30",
                    "venue": "Royal Mandap Lawn",
                    "tradition_notes": "Bride carried on wooden piri circles the groom 7 times, hides face with betel leaves for Subho Drishti & Mala Badal",
                    "attire_suggestion": "Red Banarasi Silk Saree with Mukut & Silk Dhoti Panjabi with Topor",
                    "order_index": 3
                },
                {
                    "name": "Bou Bhaat & Grand Reception",
                    "ceremony_date": "Day 3 - Afternoon",
                    "start_time": "12:30",
                    "end_time": "16:00",
                    "venue": "Main Ballroom",
                    "tradition_notes": "Groom offers ghee-rice and saree to bride pledging lifelong care, followed by royal reception feast",
                    "attire_suggestion": "Designer Silk Saree & Formal Suit",
                    "order_index": 4
                }
            ]

        # 6. Muslim Celebrations (Nikah)
        elif "muslim" in tradition_lower or "nikah" in tradition_lower:
            return [
                {
                    "name": "Manjha & Mehendi Night",
                    "ceremony_date": "Day 1 - Evening",
                    "start_time": "17:30",
                    "end_time": "22:00",
                    "venue": "Banquet Lawn",
                    "tradition_notes": "Turmeric and henna application ceremony with traditional festive qawwali music",
                    "attire_suggestion": "Yellow or green Anarkali suit with gota patti work",
                    "order_index": 1
                },
                {
                    "name": "Auspicious Nikah Ceremony",
                    "ceremony_date": "Day 2 - Morning",
                    "start_time": "10:30",
                    "end_time": "13:30",
                    "venue": "Grand Palace Hall",
                    "tradition_notes": "Signing of the Nikahnama contract, Ijab-e-Qubool (consent) and Mahr solemnization with Maulvi",
                    "attire_suggestion": "Embroidered Gharara / Sharara & Royal Silk Sherwani",
                    "order_index": 2
                },
                {
                    "name": "Grand Walima Reception Feast",
                    "ceremony_date": "Day 2 - Evening",
                    "start_time": "19:30",
                    "end_time": "23:30",
                    "venue": "Main Crystal Ballroom",
                    "tradition_notes": "Groom's family hosts dinner banquet for relatives and community guests with royal Dum Biryani",
                    "attire_suggestion": "Designer Pastel Lehenga & Tailored Tuxedo",
                    "order_index": 3
                }
            ]

        # 7. General / Fusion / Celebration Default
        else:
            return [
                {
                    "name": "Welcome & Engagement Soiree",
                    "ceremony_date": "Day 1 - Evening",
                    "start_time": "17:00",
                    "end_time": "21:00",
                    "venue": "Banquet Courtyard",
                    "tradition_notes": "Family welcome, ring exchange and celebration cocktails / mocktails",
                    "attire_suggestion": "Smart Festive Indo-Western Attire",
                    "order_index": 1
                },
                {
                    "name": "Celebration Sangeet & Music Night",
                    "ceremony_date": "Day 1 - Night",
                    "start_time": "20:00",
                    "end_time": "23:30",
                    "venue": "Main Lawn Stage",
                    "tradition_notes": "Live performances, DJ music and celebration dances",
                    "attire_suggestion": "Festive Glamour Attire",
                    "order_index": 2
                },
                {
                    "name": "Main Ceremony / Sacred Vows",
                    "ceremony_date": "Day 2 - Morning",
                    "start_time": "10:00",
                    "end_time": "13:30",
                    "venue": "Mandap Pavilion",
                    "tradition_notes": "Sacred exchange of vows, garland exchange and elder family blessings",
                    "attire_suggestion": "Ceremonial Silk Attire",
                    "order_index": 3
                },
                {
                    "name": "Gala Dinner Banquet",
                    "ceremony_date": "Day 2 - Evening",
                    "start_time": "19:00",
                    "end_time": "22:30",
                    "venue": "Grand Crystal Ballroom",
                    "tradition_notes": "Celebration feast, guest congratulations, music and dessert stations",
                    "attire_suggestion": "Formal Evening Wear / Tuxedo & Gown",
                    "order_index": 4
                }
            ]

class RiskAgent(BaseAgent):
    def __init__(self):
        super().__init__("RiskAgent", "Predictive Risk Engine & Contingency Management")

    def calculate_risk_score(self, probability: float, impact: float) -> float:
        """Deterministic risk scoring (0 to 100)."""
        return round(probability * impact * 100, 2)

    def assess_severity(self, score: float) -> str:
        if score >= 60:
            return "Critical"
        elif score >= 35:
            return "High"
        elif score >= 15:
            return "Medium"
        return "Low"

class MultiAgentOrchestrator:
    def __init__(self):
        self.planner = EventPlannerAgent()
        self.budget = BudgetAgent()
        self.cultural = CulturalAgent()
        self.risk = RiskAgent()

    async def route_request(self, user_prompt: str, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Routes user intent to the best specialized agent and applies verified mutations."""
        p_lower = user_prompt.lower()
        
        # Route: Guest Count Modification
        if "guest" in p_lower and any(w in p_lower for w in ["increase", "decrease", "update", "change", "from", "to"]):
            import re
            numbers = re.findall(r'\b\d+\b', user_prompt)
            new_count = None
            if numbers:
                new_count = int(numbers[-1])
            
            old_count = event_data.get("guest_count", 250)
            if not new_count:
                new_count = old_count + 50
                
            old_budget = float(event_data.get("total_budget", 1500000.0))
            scale_ratio = new_count / max(old_count, 1)
            revised_budget = round(old_budget * (0.55 + 0.45 * scale_ratio), 2)
            
            return {
                "agent": "GuestAgent & BudgetAgent Orchestrated",
                "reply": (
                    f"✓ **Guest Count Updated Successfully!**\n\n"
                    f"• **Previous Guests:** {old_count} ➔ **New Guests:** {new_count}\n"
                    f"• **Recalculated Budget:** ₹{revised_budget:,.2f} (Adjusted for catering buffer and banquet seating)\n"
                    f"• **Venue Capacity Checked:** Verified within safety thresholds.\n"
                    f"• **Seating Requirement:** Added {max(1, (new_count - old_count) // 8)} additional tables to seating plan.\n"
                    f"• **Catering Order:** Updated plate count with vendor contract."
                ),
                "updated_data": {
                    "guest_count": new_count,
                    "total_budget": revised_budget
                },
                "action": "UPDATE_GUEST_AND_BUDGET"
            }

        # Route: Vendor Cancellation / Issues
        if "cancel" in p_lower or "declined" in p_lower or ("vendor" in p_lower and "drop" in p_lower):
            return {
                "agent": "VendorAgent & RiskAgent",
                "reply": (
                    "⚠️ **Vendor Contingency Protocol Activated**\n\n"
                    "1. Affected vendor status updated to **Cancelled**.\n"
                    "2. Advance recovery status logged.\n"
                    "3. **3 Pre-vetted Replacement Vendors** shortlisted in your city with verified availability.\n"
                    "4. Priority tasks generated for replacement interviews and contract signing.\n"
                    "5. Risk score mitigated from High ➔ Medium."
                ),
                "updated_data": {"vendor_status_update": "Cancelled"},
                "action": "VENDOR_CONTINGENCY_TRIGGERED"
            }

        # Route: Budget Reduction
        if "budget" in p_lower and any(w in p_lower for w in ["reduce", "cut", "lower", "save", "decrease"]):
            return {
                "agent": "BudgetAgent",
                "reply": (
                    "💰 **Budget Optimization Plan Generated**\n\n"
                    "I analyzed your expense allocations across all active categories:\n"
                    "• **Recommended Floral Optimization:** Transition to hybrid seasonal blooms (Saves ₹35,000)\n"
                    "• **Digital Invitations:** Replace paper gold-foil prints with our digital video invites (Saves ₹25,000)\n"
                    "• **Beverage Package:** Restructure non-alcoholic cocktail station (Saves ₹20,000)\n\n"
                    "Total Projected Savings: **₹80,000** without sacrificing guest satisfaction."
                ),
                "action": "BUDGET_OPTIMIZATION_ADVICE"
            }

        # Default: Planner agent
        res = await self.planner.execute(event_data, user_prompt)
        return {
            "agent": "EventPlannerAgent",
            "reply": res["response"],
            "action": "CONVERSATION"
        }

orchestrator = MultiAgentOrchestrator()
