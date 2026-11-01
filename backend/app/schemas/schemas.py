from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, time, datetime
from uuid import UUID

# Profile Schemas
class ProfileBase(BaseModel):
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    preferred_language: str = "en"
    country: str = "India"
    city: str = "Mumbai"
    preferred_currency: str = "INR"
    preferences: Optional[Dict[str, Any]] = {}

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Event Schemas
class EventBase(BaseModel):
    title: str
    category: str
    event_date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    days_count: int = 1
    city: str
    venue: Optional[str] = None
    guest_count: int = 50
    total_budget: float = 0.0
    currency: str = "INR"
    budget_priority: str = "Balanced"
    budget_flexibility: str = "Flexible"
    status: str = "Planning"

class EventCreate(EventBase):
    theme: Optional[str] = None
    cultural_background: Optional[str] = None
    food_preference: Optional[str] = None
    special_requirements: Optional[str] = None

class EventUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    event_date: Optional[date] = None
    guest_count: Optional[int] = None
    total_budget: Optional[float] = None
    venue: Optional[str] = None
    status: Optional[str] = None

class EventResponse(EventBase):
    id: UUID
    user_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Expense Schemas
class ExpenseBase(BaseModel):
    category_name: str
    title: str
    estimated_amount: float = 0.0
    actual_amount: float = 0.0
    advance_paid: float = 0.0
    payment_status: str = "Unpaid"
    vendor_name: Optional[str] = None
    due_date: Optional[date] = None
    paid_date: Optional[date] = None
    notes: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    category_id: Optional[UUID] = None

class ExpenseResponse(ExpenseBase):
    id: UUID
    event_id: UUID
    category_id: Optional[UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Budget Simulation
class BudgetSimulateRequest(BaseModel):
    guest_count: int
    catering_cost_per_person: float
    venue_cost: float
    decor_cost: float
    other_expenses: float = 0.0

class BudgetSimulateResponse(BaseModel):
    previous_budget: float
    new_estimated_budget: float
    difference: float
    catering_total: float
    cost_per_guest: float
    status: str
    optimization_suggestions: List[str]

# Vendor Schemas
class VendorBase(BaseModel):
    name: str
    category: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    quoted_amount: float = 0.0
    advance_paid: float = 0.0
    status: str = "Contacted"
    notes: Optional[str] = None
    rating: Optional[float] = 4.5

class VendorCreate(VendorBase):
    pass

class VendorResponse(VendorBase):
    id: UUID
    event_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Guest Schemas
class GuestBase(BaseModel):
    name: str
    group_name: str = "General"
    email: Optional[str] = None
    phone: Optional[str] = None
    rsvp_status: str = "Pending"
    dietary_preference: str = "Standard"
    plus_ones: int = 0
    table_assigned: Optional[str] = None
    invitation_sent: bool = False
    notes: Optional[str] = None

class GuestCreate(GuestBase):
    pass

class GuestResponse(GuestBase):
    id: UUID
    event_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: str = "Medium"
    status: str = "Not Started"
    assigned_to: Optional[str] = None
    category: str = "General"

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: UUID
    event_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Risk Schemas
class RiskBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "General"
    probability: float = Field(default=0.3, ge=0.0, le=1.0)
    impact: float = Field(default=0.5, ge=0.0, le=1.0)
    severity: str = "Medium"
    suggested_solution: Optional[str] = None
    backup_arrangement: Optional[str] = None
    status: str = "Identified"

class RiskCreate(RiskBase):
    pass

class RiskResponse(RiskBase):
    id: UUID
    event_id: UUID
    risk_score: float
    created_at: datetime

    class Config:
        from_attributes = True

# AI Copilot Schemas
class ChatMessageRequest(BaseModel):
    event_id: UUID
    message: str
    session_id: Optional[UUID] = None

class ChatMessageResponse(BaseModel):
    reply: str
    agent_name: str
    updated_event_data: Optional[Dict[str, Any]] = None
    action_taken: Optional[str] = None

class GeneratePlanRequest(BaseModel):
    prompt: str
    category: str = "Wedding"
    city: str = "Mumbai"
    budget: float = 1000000.0
    guest_count: int = 200
    cultural_preference: Optional[str] = None
    food_preference: Optional[str] = None

