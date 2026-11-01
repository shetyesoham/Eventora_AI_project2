import pytest
from app.database.store import db, DEMO_EVENT_ID
from app.api.routes import (
    list_events, get_event, get_event_budget, simulate_budget,
    list_vendors, add_vendor, list_guests, add_guest, list_tasks, add_task,
    list_risks, add_risk, list_ceremonies
)
from app.schemas.schemas import (
    BudgetSimulateRequest, VendorCreate, GuestCreate, TaskCreate, RiskCreate
)

def test_events_listing():
    events = list_events()
    assert len(events) >= 1
    assert any(e["id"] == DEMO_EVENT_ID for e in events)

def test_event_detail():
    ev = get_event(DEMO_EVENT_ID)
    assert ev is not None
    assert "Priyanka" in ev["title"]
    assert ev["city"] == "Pune"
    assert ev["total_budget"] == 1500000.0

def test_event_budget_calculations():
    budget = get_event_budget(DEMO_EVENT_ID)
    assert budget["total_budget"] == 1500000.0
    assert budget["total_spent"] > 0
    assert budget["remaining_balance"] == budget["total_budget"] - budget["total_spent"]
    assert len(budget["expenses"]) >= 4

def test_budget_simulator():
    req = BudgetSimulateRequest(
        guest_count=300,
        catering_cost_per_person=1200,
        venue_cost=400000,
        decor_cost=200000,
        other_expenses=100000
    )
    res = simulate_budget(DEMO_EVENT_ID, req)
    expected_total = (300 * 1200) + 400000 + 200000 + 100000
    assert res.new_estimated_budget == expected_total
    assert res.cost_per_guest == round(expected_total / 300, 2)
    assert len(res.optimization_suggestions) >= 1

def test_vendors_crud():
    initial_vendors = list_vendors(DEMO_EVENT_ID)
    assert len(initial_vendors) >= 4
    
    new_v = VendorCreate(
        name="Test Sound & Lights",
        category="Entertainment",
        contact_person="Ramesh DJ",
        phone="+91 99999 88888",
        email="dj@eventora.test",
        location="FC Road, Pune",
        quoted_amount=50000.0,
        advance_paid=10000.0,
        status="Booked",
        notes="Silent generator included"
    )
    created = add_vendor(DEMO_EVENT_ID, new_v)
    assert created["name"] == "Test Sound & Lights"
    
    updated_vendors = list_vendors(DEMO_EVENT_ID)
    assert len(updated_vendors) == len(initial_vendors) + 1

def test_guests_management():
    guests = list_guests(DEMO_EVENT_ID)
    assert len(guests) >= 4
    
    new_g = GuestCreate(
        name="Sneha Patil",
        family_group="College Friends",
        phone="+91 98220 99999",
        dietary_preference="Vegetarian",
        rsvp_status="Confirmed",
        table_seating="Table 5 (Friends)"
    )
    created = add_guest(DEMO_EVENT_ID, new_g)
    assert created["name"] == "Sneha Patil"
    assert created["dietary_preference"] == "Vegetarian"

def test_tasks_management():
    tasks = list_tasks(DEMO_EVENT_ID)
    assert len(tasks) >= 4
    
    new_t = TaskCreate(
        title="Verify Generator Fuel",
        description="Check standby diesel levels for lawn lighting",
        due_date="2026-12-14",
        priority="High",
        assignee="Aarav Deshmukh",
        category="Logistics"
    )
    created = add_task(DEMO_EVENT_ID, new_t)
    assert created["title"] == "Verify Generator Fuel"
    assert created["status"] == "Not Started"

def test_risk_severity_formula():
    risks = list_risks(DEMO_EVENT_ID)
    assert len(risks) >= 3
    for r in risks:
        score = (r["probability"] * r["impact"]) * 100
        assert r["risk_score"] == pytest.approx(score, 0.1)
    
    new_r = RiskCreate(
        title="Unseasonal Heatwave",
        category="Weather",
        probability=0.40,
        impact=0.60,
        suggested_solution="Install mist fans across lawn perimeter",
        backup_arrangement="Shift afternoon tea to AC banquet"
    )
    created = add_risk(DEMO_EVENT_ID, new_r)
    assert created["risk_score"] == 24.0

def test_cultural_rituals():
    rituals = list_ceremonies(DEMO_EVENT_ID)
    assert len(rituals) >= 4
    ritual_names = [r["name"] for r in rituals]
    assert any("Sakharpuda" in name for name in ritual_names)
    assert any("Lagna" in name or "Muhurt" in name for name in ritual_names)
