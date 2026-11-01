from fastapi import APIRouter, HTTPException, Depends
from uuid import UUID, uuid4
from datetime import datetime, date
from typing import List, Dict, Any
from app.database.store import db, DEMO_EVENT_ID, DEMO_USER_ID
from app.schemas.schemas import (
    EventBase, EventCreate, EventUpdate, EventResponse,
    ExpenseCreate, ExpenseResponse, BudgetSimulateRequest, BudgetSimulateResponse,
    VendorCreate, VendorResponse, GuestCreate, GuestResponse,
    TaskCreate, TaskResponse, RiskCreate, RiskResponse,
    ChatMessageRequest, ChatMessageResponse
)
from app.agents.orchestrator import orchestrator, BudgetAgent, CulturalAgent

api_router = APIRouter()

# ---------------- EVENTS ----------------
@api_router.get("/events", response_model=List[Dict[str, Any]])
def list_events():
    return list(db.events.values())

@api_router.post("/events", response_model=Dict[str, Any])
def create_event(data: EventCreate):
    new_id = uuid4()
    event_dict = data.model_dump()
    event_dict["id"] = new_id
    event_dict["user_id"] = DEMO_USER_ID
    event_dict["created_at"] = datetime.now()
    event_dict["updated_at"] = datetime.now()
    db.events[new_id] = event_dict
    
    # 1. Auto-generate essential budget via BudgetAgent
    budget_agent = BudgetAgent()
    allocations = budget_agent.calculate_allocation(data.total_budget, data.category, data.budget_priority)
    for cat_name, amt in allocations.items():
        exp_id = uuid4()
        db.expenses[exp_id] = {
            "id": exp_id,
            "event_id": new_id,
            "category_name": cat_name,
            "title": f"Initial Allocation: {cat_name}",
            "estimated_amount": amt,
            "actual_amount": 0.0,
            "advance_paid": 0.0,
            "payment_status": "Unpaid",
            "vendor_name": None,
            "due_date": data.event_date,
            "created_at": datetime.now()
        }

    # 2. Auto-generate Cultural Ceremonies via CulturalAgent
    cultural_agent = CulturalAgent()
    tradition = data.cultural_background or "Hindu Maharashtrian"
    ceremonies = cultural_agent.get_tradition_defaults(tradition)
    for c in ceremonies:
        c_id = uuid4()
        db.ceremonies[c_id] = {
            "id": c_id,
            "event_id": new_id,
            "name": c["name"],
            "ceremony_date": c["ceremony_date"],
            "start_time": c["start_time"],
            "end_time": c["end_time"],
            "venue": data.venue or f"{data.city} Celebration Mandap",
            "tradition_notes": c["tradition_notes"],
            "attire_suggestion": c["attire_suggestion"],
            "order_index": c["order_index"]
        }

    # 3. Auto-seed canonical predictive risks for the new celebration
    default_risks = [
        {
            "title": f"Unseasonal Weather / Rain at {data.venue or data.city}",
            "description": f"Weather fluctuations could disrupt the outdoor celebrations scheduled for {data.event_date}",
            "category": "Weather",
            "probability": 0.35,
            "impact": 0.80,
            "risk_score": 28.0,
            "severity": "Medium",
            "suggested_solution": "Contract waterproof canopy and German hangar dome with venue decorator",
            "backup_arrangement": "Identify and hold indoor banquet hall backup option on site",
            "status": "Mitigated"
        },
        {
            "title": f"Catering Guest Overflow Beyond {data.guest_count} Pax",
            "description": "Traditional celebrations frequently observe +15% unannounced family walk-ins",
            "category": "Guest",
            "probability": 0.60,
            "impact": 0.50,
            "risk_score": 30.0,
            "severity": "Medium",
            "suggested_solution": f"Contract 15% buffer clause with caterer ({int(data.guest_count * 0.15)} extra plates)",
            "backup_arrangement": "Keep fast-replenishment logistics active in kitchen",
            "status": "Mitigated"
        },
        {
            "title": "Power Voltage Dips during Evening Stage & Sound",
            "description": "Local grid dips during peak music, lighting, and stage rituals",
            "category": "Logistics",
            "probability": 0.20,
            "impact": 0.70,
            "risk_score": 14.0,
            "severity": "Low",
            "suggested_solution": "Mandate dedicated 125 kVA silent acoustic generator from the venue",
            "backup_arrangement": "Automatic transfer switch backup active within 5 seconds",
            "status": "Resolved"
        }
    ]
    for r in default_risks:
        r_id = uuid4()
        r["id"] = r_id
        r["event_id"] = new_id
        r["created_at"] = datetime.now()
        db.risks[r_id] = r

    return event_dict

@api_router.get("/events/{event_id}", response_model=Dict[str, Any])
def get_event(event_id: UUID):
    if event_id not in db.events:
        raise HTTPException(status_code=404, detail="Event not found")
    return db.events[event_id]

@api_router.put("/events/{event_id}", response_model=Dict[str, Any])
def update_event(event_id: UUID, data: EventUpdate):
    if event_id not in db.events:
        raise HTTPException(status_code=404, detail="Event not found")
    event = db.events[event_id]
    updates = data.model_dump(exclude_unset=True)
    for k, v in updates.items():
        event[k] = v
    event["updated_at"] = datetime.now()
    return event

@api_router.delete("/events/{event_id}")
def delete_event(event_id: UUID):
    if event_id not in db.events:
        raise HTTPException(status_code=404, detail="Event not found")
    del db.events[event_id]
    return {"message": "Event deleted successfully"}

# ---------------- BUDGET & EXPENSES ----------------
@api_router.get("/events/{event_id}/budget")
def get_event_budget(event_id: UUID):
    if event_id not in db.events:
        raise HTTPException(status_code=404, detail="Event not found")
    event = db.events[event_id]
    expenses = [e for e in db.expenses.values() if e.get("event_id") == event_id]
    total_estimated = sum(e.get("estimated_amount", 0.0) for e in expenses)
    total_spent = sum(e.get("actual_amount", 0.0) for e in expenses)
    total_advance = sum(e.get("advance_paid", 0.0) for e in expenses)
    total_budget = float(event.get("total_budget", 0.0))
    balance = total_budget - total_spent
    utilization_rate = round((total_spent / total_budget * 100), 1) if total_budget > 0 else 0.0

    return {
        "total_budget": total_budget,
        "total_estimated": total_estimated,
        "total_spent": total_spent,
        "total_advance": total_advance,
        "remaining_balance": balance,
        "utilization_rate": utilization_rate,
        "currency": event.get("currency", "INR"),
        "expenses": expenses
    }

@api_router.post("/events/{event_id}/expenses", response_model=Dict[str, Any])
def add_expense(event_id: UUID, data: ExpenseCreate):
    if event_id not in db.events:
        raise HTTPException(status_code=404, detail="Event not found")
    exp_id = uuid4()
    exp_dict = data.model_dump()
    exp_dict["id"] = exp_id
    exp_dict["event_id"] = event_id
    exp_dict["created_at"] = datetime.now()
    db.expenses[exp_id] = exp_dict
    return exp_dict

@api_router.put("/expenses/{expense_id}", response_model=Dict[str, Any])
def update_expense(expense_id: UUID, data: ExpenseCreate):
    if expense_id not in db.expenses:
        raise HTTPException(status_code=404, detail="Expense not found")
    exp = db.expenses[expense_id]
    for k, v in data.model_dump().items():
        exp[k] = v
    return exp

@api_router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: UUID):
    if expense_id not in db.expenses:
        raise HTTPException(status_code=404, detail="Expense not found")
    del db.expenses[expense_id]
    return {"message": "Expense deleted successfully"}

@api_router.post("/events/{event_id}/budget/simulate", response_model=BudgetSimulateResponse)
def simulate_budget(event_id: UUID, req: BudgetSimulateRequest):
    if event_id not in db.events:
        raise HTTPException(status_code=404, detail="Event not found")
    event = db.events[event_id]
    prev_budget = float(event.get("total_budget", 0.0))
    catering_total = round(req.guest_count * req.catering_cost_per_person, 2)
    new_total = round(catering_total + req.venue_cost + req.decor_cost + req.other_expenses, 2)
    diff = round(new_total - prev_budget, 2)
    cost_per_guest = round(new_total / max(req.guest_count, 1), 2)

    suggestions = []
    if diff > 0:
        suggestions.append(f"Projected overspend of ₹{diff:,.2f}. Consider package bundling for venue and catering.")
        suggestions.append("Switch to seasonal floral alternatives to reduce decor costs by 12-15%.")
    else:
        suggestions.append(f"Surplus budget of ₹{abs(diff):,.2f} can be diverted into live entertainment or emergency contingency.")

    return BudgetSimulateResponse(
        previous_budget=prev_budget,
        new_estimated_budget=new_total,
        difference=diff,
        catering_total=catering_total,
        cost_per_guest=cost_per_guest,
        status="Optimized" if diff <= 0 else "Budget Alert",
        optimization_suggestions=suggestions
    )

# ---------------- VENDORS ----------------
@api_router.get("/events/{event_id}/vendors", response_model=List[Dict[str, Any]])
def list_vendors(event_id: UUID):
    return [v for v in db.vendors.values() if v.get("event_id") == event_id]

@api_router.post("/events/{event_id}/vendors", response_model=Dict[str, Any])
def add_vendor(event_id: UUID, data: VendorCreate):
    v_id = uuid4()
    v_dict = data.model_dump()
    v_dict["id"] = v_id
    v_dict["event_id"] = event_id
    v_dict["created_at"] = datetime.now()
    db.vendors[v_id] = v_dict
    return v_dict

@api_router.put("/vendors/{vendor_id}", response_model=Dict[str, Any])
def update_vendor(vendor_id: UUID, data: VendorCreate):
    if vendor_id not in db.vendors:
        raise HTTPException(status_code=404, detail="Vendor not found")
    v = db.vendors[vendor_id]
    for k, val in data.model_dump().items():
        v[k] = val
    return v

@api_router.delete("/vendors/{vendor_id}")
def delete_vendor(vendor_id: UUID):
    if vendor_id not in db.vendors:
        raise HTTPException(status_code=404, detail="Vendor not found")
    del db.vendors[vendor_id]
    return {"message": "Vendor deleted successfully"}

# ---------------- GUESTS ----------------
@api_router.get("/events/{event_id}/guests", response_model=List[Dict[str, Any]])
def list_guests(event_id: UUID):
    return [g for g in db.guests.values() if g.get("event_id") == event_id]

@api_router.post("/events/{event_id}/guests", response_model=Dict[str, Any])
def add_guest(event_id: UUID, data: GuestCreate):
    g_id = uuid4()
    g_dict = data.model_dump()
    g_dict["id"] = g_id
    g_dict["event_id"] = event_id
    g_dict["created_at"] = datetime.now()
    db.guests[g_id] = g_dict
    return g_dict

@api_router.put("/guests/{guest_id}", response_model=Dict[str, Any])
def update_guest(guest_id: UUID, data: GuestCreate):
    if guest_id not in db.guests:
        raise HTTPException(status_code=404, detail="Guest not found")
    g = db.guests[guest_id]
    for k, val in data.model_dump().items():
        g[k] = val
    return g

@api_router.delete("/guests/{guest_id}")
def delete_guest(guest_id: UUID):
    if guest_id not in db.guests:
        raise HTTPException(status_code=404, detail="Guest not found")
    del db.guests[guest_id]
    return {"message": "Guest deleted successfully"}

# ---------------- TASKS ----------------
@api_router.get("/events/{event_id}/tasks", response_model=List[Dict[str, Any]])
def list_tasks(event_id: UUID):
    return [t for t in db.tasks.values() if t.get("event_id") == event_id]

@api_router.post("/events/{event_id}/tasks", response_model=Dict[str, Any])
def add_task(event_id: UUID, data: TaskCreate):
    t_id = uuid4()
    t_dict = data.model_dump()
    t_dict["id"] = t_id
    t_dict["event_id"] = event_id
    t_dict["created_at"] = datetime.now()
    db.tasks[t_id] = t_dict
    return t_dict

@api_router.put("/tasks/{task_id}", response_model=Dict[str, Any])
def update_task(task_id: UUID, data: TaskCreate):
    if task_id not in db.tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    t = db.tasks[task_id]
    for k, val in data.model_dump().items():
        t[k] = val
    return t

@api_router.delete("/tasks/{task_id}")
def delete_task(task_id: UUID):
    if task_id not in db.tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    del db.tasks[task_id]
    return {"message": "Task deleted successfully"}

# ---------------- RISKS ----------------
@api_router.get("/events/{event_id}/risks", response_model=List[Dict[str, Any]])
def list_risks(event_id: UUID):
    return [r for r in db.risks.values() if r.get("event_id") == event_id]

@api_router.post("/events/{event_id}/risks", response_model=Dict[str, Any])
def add_risk(event_id: UUID, data: RiskCreate):
    r_id = uuid4()
    r_dict = data.model_dump()
    r_dict["id"] = r_id
    r_dict["event_id"] = event_id
    r_dict["risk_score"] = round(data.probability * data.impact * 100, 2)
    r_dict["created_at"] = datetime.now()
    db.risks[r_id] = r_dict
    return r_dict

@api_router.delete("/risks/{risk_id}")
def delete_risk(risk_id: UUID):
    if risk_id not in db.risks:
        raise HTTPException(status_code=404, detail="Risk not found")
    del db.risks[risk_id]
    return {"message": "Risk deleted successfully"}

# ---------------- CEREMONIES ----------------
@api_router.get("/events/{event_id}/ceremonies")
def list_ceremonies(event_id: UUID):
    items = [c for c in db.ceremonies.values() if c.get("event_id") == event_id]
    
    # If no custom ceremonies created yet for this event, auto-generate them on-the-fly based on its cultural background!
    if not items and event_id in db.events:
        event = db.events[event_id]
        tradition = event.get("cultural_background") or "Hindu Maharashtrian"
        cultural_agent = CulturalAgent()
        defaults = cultural_agent.get_tradition_defaults(tradition)
        for c in defaults:
            c_id = uuid4()
            record = {
                "id": c_id,
                "event_id": event_id,
                "name": c["name"],
                "ceremony_date": c["ceremony_date"],
                "start_time": c["start_time"],
                "end_time": c["end_time"],
                "venue": event.get("venue") or f"{event.get('city')} Celebration Mandap",
                "tradition_notes": c["tradition_notes"],
                "attire_suggestion": c["attire_suggestion"],
                "order_index": c["order_index"]
            }
            db.ceremonies[c_id] = record
            items.append(record)
            
    items.sort(key=lambda x: x.get("order_index", 0))
    return items

from fastapi.responses import StreamingResponse
import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

# ---------------- EXECUTIVE PDF REPORT EXPORT ----------------
@api_router.get("/events/{event_id}/report/pdf")
def generate_event_pdf(event_id: UUID):
    if event_id not in db.events:
        raise HTTPException(status_code=404, detail="Event not found")
        
    event = db.events[event_id]
    expenses = [e for e in db.expenses.values() if e.get("event_id") == event_id]
    vendors = [v for v in db.vendors.values() if v.get("event_id") == event_id]
    guests = [g for g in db.guests.values() if g.get("event_id") == event_id]
    tasks = [t for t in db.tasks.values() if t.get("event_id") == event_id]
    risks = [r for r in db.risks.values() if r.get("event_id") == event_id]
    ceremonies = [c for c in db.ceremonies.values() if c.get("event_id") == event_id]

    total_budget = float(event.get("total_budget", 0.0))
    total_spent = sum(e.get("actual_amount", 0.0) for e in expenses)
    remaining_balance = total_budget - total_spent

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    elements = []
    styles = getSampleStyleSheet()

    # Custom Plum Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#54265F'),
        fontName='Helvetica-Bold'
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#75458B')
    )
    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#54265F'),
        spaceBefore=12,
        spaceAfter=6
    )
    normal_style = ParagraphStyle(
        'NormalCustom',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#25212A')
    )

    # 1. Header
    elements.append(Paragraph(f"EVENTORA AI — EXECUTIVE DOSSIER", subtitle_style))
    elements.append(Paragraph(f"{event.get('title')}", title_style))
    elements.append(Paragraph(f"Location: {event.get('venue')}, {event.get('city')} | Date: {event.get('event_date')} | Guests: {event.get('guest_count')}", subtitle_style))
    elements.append(Spacer(1, 15))

    # 2. Executive KPI Summary Table
    kpi_data = [
        ["Total Budget", "Total Disbursed", "Remaining Liquid", "Guest Count"],
        [f"INR {total_budget:,.2f}", f"INR {total_spent:,.2f}", f"INR {remaining_balance:,.2f}", f"{event.get('guest_count')} Pax"]
    ]
    kpi_table = Table(kpi_data, colWidths=[130, 130, 140, 140])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#54265F')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#F3E5C8')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#F8F4FA')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#EEE7F3'))
    ]))
    elements.append(kpi_table)
    elements.append(Spacer(1, 15))

    # 3. Categorized Financial Audit
    elements.append(Paragraph("1. Categorized Expense & Advance Audit", h2_style))
    if expenses:
        exp_rows = [["Category", "Description", "Estimated", "Actual Paid", "Status"]]
        for e in expenses[:8]:
            exp_rows.append([
                Paragraph(e.get("category_name", "General"), normal_style),
                Paragraph(e.get("title", ""), normal_style),
                f"INR {e.get('estimated_amount', 0):,.0f}",
                f"INR {e.get('advance_paid', 0):,.0f}",
                e.get("payment_status", "Unpaid")
            ])
        exp_table = Table(exp_rows, colWidths=[110, 190, 80, 80, 80])
        exp_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#75458B')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#EEE7F3'))
        ]))
        elements.append(exp_table)
    else:
        elements.append(Paragraph("No tracked expenses recorded.", normal_style))
    elements.append(Spacer(1, 12))

    # 4. Contracted Vendors Roster
    elements.append(Paragraph("2. Contracted Vendors & Direct Hotlines", h2_style))
    if vendors:
        v_rows = [["Vendor / Partner", "Category", "Contact Person", "Phone", "Status"]]
        for v in vendors:
            v_rows.append([
                Paragraph(v.get("name", ""), normal_style),
                v.get("category", ""),
                v.get("contact_person", "N/A"),
                v.get("phone", "N/A"),
                v.get("status", "Booked")
            ])
        v_table = Table(v_rows, colWidths=[150, 90, 110, 100, 90])
        v_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#54265F')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#EEE7F3'))
        ]))
        elements.append(v_table)
    else:
        elements.append(Paragraph("No vendors onboarded yet.", normal_style))
    elements.append(Spacer(1, 12))

    # 5. Predictive Risk Contingencies
    elements.append(Paragraph("3. Predictive Risk Matrix & Contingency Action Plans", h2_style))
    if risks:
        r_rows = [["Risk Scenario", "Category", "Severity", "Preventative Mitigation & Plan B"]]
        for r in risks:
            mit_plan = f"<b>Mitigation:</b> {r.get('suggested_solution')}<br/><b>Plan B:</b> {r.get('backup_arrangement')}"
            r_rows.append([
                Paragraph(r.get("title", ""), normal_style),
                r.get("category", ""),
                r.get("severity", "Medium"),
                Paragraph(mit_plan, normal_style)
            ])
        r_table = Table(r_rows, colWidths=[150, 70, 70, 250])
        r_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#75458B')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#EEE7F3'))
        ]))
        elements.append(r_table)
    else:
        elements.append(Paragraph("All risks mitigated and verified.", normal_style))

    doc.build(elements)
    buffer.seek(0)
    
    clean_filename = f"Eventora_Executive_Report_{event.get('title', 'Event').replace(' ', '_')}.pdf"
    return StreamingResponse(
        buffer, 
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={clean_filename}"}
    )
@api_router.post("/ai/chat", response_model=ChatMessageResponse)
async def ai_chat(req: ChatMessageRequest):
    event = db.events.get(req.event_id)
    if not event:
        event = db.events[DEMO_EVENT_ID]
        req.event_id = DEMO_EVENT_ID

    orchestration_res = await orchestrator.route_request(req.message, event)
    
    updated_data = orchestration_res.get("updated_data")
    if updated_data:
        for k, v in updated_data.items():
            if k in event:
                event[k] = v
        event["updated_at"] = datetime.now()

    return ChatMessageResponse(
        reply=orchestration_res["reply"],
        agent_name=orchestration_res["agent"],
        updated_event_data=updated_data,
        action_taken=orchestration_res.get("action")
    )
