# Eventora AI — Intelligent Celebration & Event Planning Copilot

[![Eventora CI](https://github.com/shetyesoham/Eventora_AI_project2/actions/workflows/ci.yml/badge.svg)](https://github.com/shetyesoham/Eventora_AI_project2/actions/workflows/ci.yml)
[![Vercel Deployment](https://img.shields.io/badge/Deployment-Live%20on%20Vercel-success)](https://eventora-ai-project.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Tests-9%20Passing-brightgreen)](https://github.com/shetyesoham/Eventora_AI_project2/tree/main/backend/tests)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-A%2B%20(0%20Errors)-brightgreen)](https://github.com/shetyesoham/Eventora_AI_project2)

> **"Plan Smarter. Celebrate Better."**  
> *Built for the Google Virtual Promptwar / GenAI Hackathon under the "Celebration & Event Planner" challenge.*

🌐 **Live Application URL:** [https://eventora-ai-project.vercel.app](https://eventora-ai-project.vercel.app)  
💻 **GitHub Repository:** [https://github.com/shetyesoham/Eventora_AI_project2](https://github.com/shetyesoham/Eventora_AI_project2)

---

## 🏛️ System Architecture

```
User & Web UI (Next.js 16 + React 19 + TypeScript + Tailwind CSS v4)
                         │
                         ▼
        REST API Gateway (FastAPI / Pydantic / Uvicorn)
                         │
      ┌──────────────────┴──────────────────┐
      ▼                                     ▼
Multi-Agent Orchestrator         Database Engine & Store
• EventPlannerAgent (Master)     • Supabase Cloud PostgreSQL
• BudgetAgent (Deterministic)    • In-Memory Fast Fallback
• CulturalIntelligenceAgent      • Row Level Security (RLS)
• VendorAgent & Negotiation      • Full CRUD across all schemas
• RiskAgent (Severity Engine)    • Google Maps Platform Embed
• Guest & Seating Agent          • ReportLab Executive PDF
• Sarvam AI (Indic TTS & NLP)
```

---

## 🌟 Key Features & Problem Alignment

1. **Unified Event Overview Dashboard (`/dashboard`)**:
   - 4 Live Metric Trackers: Budget Utilization, Confirmed Guests, Task Progress, and Contracted Vendors.
   - Active Milestones List and Predictive Risk Matrix with contingency links.

2. **Multi-Agent AI Copilot (`/copilot`)**:
   - Interactive conversation connected to active event data using Google Gemini 2.5 Flash.
   - Dispatches user requests to specialized agents (EventPlanner, BudgetAgent, CulturalIntelligence, VendorAgent).
   - Recalculates guest counts, budget impacts, vendor contingency protocols, and menu suggestions.

3. **Smart Budget Planner & Simulator (`/budget`)**:
   - Zero-based financial tracking with advance payments and remaining balance calculations.
   - **Interactive Budget Simulator**: Adjust guest count, catering costs, and venue costs to simulate real-time financial variance and receive AI optimization insights.

4. **Cultural & Creative Planner (`/cultural-planner`)**:
   - Regional Ceremony Timeline (Sakharpuda, Haldi, Sangeet, Muhurt, Reception).
   - Auspicious Feast Menu Planner with Satvik & Jain dietary options.
   - Itemized Puja Samagri & Attire checklist.

5. **Vendor Management & Negotiation Hub (`/vendors`)**:
   - Category rosters for Venues, Catering, Decoration, and Photography.
   - Advance tracking, quoted amounts, contact hotlines, and ratings.
   - **AI Negotiation Assistant**: Generates customized negotiation proposals matching category allocations.

6. **Guest Management & WhatsApp Digital Invites (`/guests`)**:
   - Real-time RSVP counters with dietary segmentation (Jain, Pure Veg, Halal).
   - 1-click personalized digital WhatsApp invitations with online RSVP confirmation links.

7. **Predictive Risk & Backup Engine (`/risks`)**:
   - Evaluates risks using a deterministic mathematical formula: $\text{Severity} = \text{Probability} \times \text{Impact}$.
   - **1-Click AI Auto-Fill Plan**: Formulates preventative actions and Plan B emergency protocols.

8. **Community & Festival Workspace (`/community`)**:
   - Volunteer shift rosters, tiered sponsorship ledger (Platinum, Gold, Silver), and municipal clearance tracking (PMC, Police, MSEDCL).

9. **Mobile Event-Day Runner (`/event-day`)**:
   - Minute-by-minute run of show, emergency SOS speed-dials, and integrated Google Maps venue navigation.

10. **Executive PDF Reports (`/reports`)**:
    - Automated ReportLab multi-page print-ready executive plan download from FastAPI backend.

---

## 🧪 Automated Testing & Code Quality

- **Unit & Integration Tests:** 9 automated test suites in `backend/tests/test_core.py` covering all core modules.
- **Continuous Integration:** GitHub Actions CI workflow in `.github/workflows/ci.yml`.
- **Linting & Type Safety:** 0 ESLint errors across the Next.js application.

### Running Backend Tests Locally:
```bash
cd backend
python -m pytest tests/ -v
```

### Running Frontend Linter:
```bash
cd frontend
npm run lint
```

---

## 🚀 Deployment Instructions

### Frontend (Vercel)
- **Framework Preset:** Next.js
- **Root Directory:** `frontend`
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Backend (Render)
- **Runtime:** Python 3.12
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `GEMINI_API_KEY`
  - `SARVAM_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
