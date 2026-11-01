export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  preferred_language: string;
  country: string;
  city: string;
  preferred_currency: string;
  created_at: string;
}

export interface EventItem {
  id: string;
  user_id?: string;
  title: string;
  category: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  days_count: number;
  city: string;
  venue?: string;
  guest_count: number;
  total_budget: number;
  currency: string;
  budget_priority: "Luxury" | "Balanced" | "Budget-Friendly";
  budget_flexibility: string;
  status: "Planning" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  theme?: string;
  cultural_background?: string;
  food_preference?: string;
  special_requirements?: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  event_id: string;
  category_name: string;
  title: string;
  estimated_amount: number;
  actual_amount: number;
  advance_paid: number;
  payment_status: "Unpaid" | "Partially Paid" | "Paid";
  vendor_name?: string;
  due_date?: string;
  paid_date?: string;
  notes?: string;
}

export interface Vendor {
  id: string;
  event_id: string;
  name: string;
  category: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  location?: string;
  quoted_amount: number;
  advance_paid: number;
  status: "Not Contacted" | "Contacted" | "Quote Received" | "Negotiating" | "Booked" | "Partially Paid" | "Fully Paid" | "Cancelled";
  notes?: string;
  rating?: number;
}

export interface Guest {
  id: string;
  event_id: string;
  name: string;
  group_name: string;
  email?: string;
  phone?: string;
  rsvp_status: "Invited" | "Confirmed" | "Declined" | "Pending";
  dietary_preference: string;
  plus_ones: number;
  table_assigned?: string;
  invitation_sent: boolean;
  notes?: string;
}

export interface TaskItem {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Not Started" | "In Progress" | "Completed" | "Blocked";
  assigned_to?: string;
  category: string;
}

export interface RiskItem {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  category: string;
  probability: number;
  impact: number;
  risk_score: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  suggested_solution?: string;
  backup_arrangement?: string;
  status: "Identified" | "Mitigated" | "Accepted" | "Resolved";
}

export interface CeremonyItem {
  id: string;
  event_id: string;
  name: string;
  ceremony_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  tradition_notes: string;
  attire_suggestion: string;
  order_index: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  agent_name?: string;
  created_at: string;
}

