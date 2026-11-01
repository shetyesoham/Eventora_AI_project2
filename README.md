# Eventora AI — Intelligent Celebration & Event Planning Copilot

> **"Plan Smarter. Celebrate Better."**

Eventora AI is a production-quality, full-stack Generative AI celebration and event management platform. Built with Next.js (App Router), TypeScript, Tailwind CSS, FastAPI, Pydantic, and an interconnected Multi-Agent AI architecture powered by Google Gemini, it empowers families, planners, and communities to organize weddings, birthdays, corporate summits, and cultural festivals from a unified cockpit.

---

## 🏛️ System Architecture

```
User & Web UI (Next.js 16 + React 19 + TypeScript + Tailwind)
                         │
                         ▼
        REST API Gateway (FastAPI / Pydantic)
                         │
      ┌──────────────────┴──────────────────┐
      ▼                                     ▼
Multi-Agent Orchestrator         Database Engine & Store
• EventPlannerAgent              • Normalized PostgreSQL / Supabase Schema
• BudgetAgent (Deterministic)    • In-Memory Fast Persistent Fallback
• CulturalIntelligenceAgent      • Row Level Security (RLS) Ready
• VendorAgent & Negotiation      • Full CRUD for Events, Vendors, Guests,
• RiskAgent (Severity Engine)      Tasks, Risks, and Ceremonies
• Guest & Seating Agent
```

---

## 🌟 Key Features Implemented

1. **Brand & UI/UX Design System**:
   - Palette: Deep Royal Plum (`#54265F`), Soft Lavender (`#EEE7F3`), Warm Champagne (`#F3E5C8`), Rose Gold (`#C58B76`), and Soft Ivory (`#FFFDF9`).
   - Collapsible Navigation Shell with real-time Event Context Selector.
   - Glassmorphism UI cards, responsive layouts for desktop, tablet, and mobile.

2. **Unified Event Overview Dashboard (`/dashboard`)**:
   - 4 Live Metric Trackers: Budget Utilization, Confirmed Guests, Task Progress, and Contracted Vendors.
   - Active Milestones List and Predictive Risk Matrix with contingency links.

3. **Multi-Agent AI Copilot (`/copilot`)**:
   - Interactive conversation connected to active event data.
   - Dispatches user requests to specialized agents (EventPlanner, BudgetAgent, CulturalIntelligence, VendorAgent).
   - Recalculates guest counts, budget impacts, vendor contingency protocols, and menu suggestions.

4. **Smart Budget Planner & Simulator (`/budget`)**:
   - Tracked category expenses with advance payments and remaining balance calculations.
   - **Interactive Budget Simulator**: Adjust guest count, catering costs, and venue costs to simulate real-time financial variance and receive AI optimization insights.

5. **Cultural & Creative Planner (`/cultural-planner`)**:
   - Regional Ceremony Timeline (Sakharpuda, Haldi, Sangeet, Muhurt, Reception).
   - Auspicious Feast Menu Planner with Satvik & Jain dietary options.
   - 28-item Puja Samagri & Attire checklist.
   - Royal Peshwai Aesthetic Mood Board & color swatches.

6. **Vendor Management Hub (`/vendors`)**:
   - Category rosters for Venues, Catering, Decoration, and Photography.
   - Advance tracking, quoted amounts, contact hotlines, and ratings.
   - **AI Negotiation Assistant**: Generates customized negotiation letters ready to copy and share.

7. **Guest Management & Digital Invitations (`/guests`)**:
   - RSVP tracking (Confirmed, Pending, Declined), dietary requirements, and table assignments.
   - **Digital Invitation Generator**: Generates traditional invitation cards with one-click WhatsApp sharing links.

8. **Timeline & Task Management (`/tasks`)**:
   - Dual-view interface: Structured Checklist & interactive Kanban Board.
   - Priority indicators (Critical, High, Medium) with real-time status toggling.

9. **Predictive Risk & Backup Engine (`/risks`)**:
   - Deterministic risk score calculation (`Probability × Impact × 100`).
   - Severity tags with automated contingency solutions and backup venue plans.

10. **Event Day Live Runner (`/event-day`)**:
    - Mobile-first interface for the day of the event.
    - Quick actions: One-click vendor hotlines, Google Maps links, and incident reporting.

11. **Reports & Analytics Dossier (`/reports`)**:
    - Executive audit dossier covering budget performance, guest confirmation ratios, and ReportLab PDF export readiness.

---

## 🚀 Running the Project

### 1. Backend (FastAPI)
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Frontend (Next.js)
```bash
cd frontend
npm run dev
```
Open your browser at: `http://localhost:3000`

### 3. Database Setup (PostgreSQL / Supabase)
Execute the provided SQL files in your Supabase SQL Editor:
1. `database/schema.sql` (Creates all 23 normalized tables, foreign keys, and indexes)
2. `database/seed.sql` (Populates the demo Maharashtrian Wedding in Pune dataset)

