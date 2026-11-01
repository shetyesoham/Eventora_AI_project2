-- Eventora AI Database Schema
-- Compatible with PostgreSQL / Supabase
-- Includes RLS, Constraints, and Indexes

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (linked to auth.users in Supabase or standalone)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'en',
    country TEXT DEFAULT 'India',
    city TEXT DEFAULT 'Mumbai',
    preferred_currency TEXT DEFAULT 'INR',
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    days_count INTEGER DEFAULT 1,
    city TEXT NOT NULL,
    venue TEXT,
    guest_count INTEGER NOT NULL DEFAULT 50,
    total_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency TEXT DEFAULT 'INR',
    budget_priority TEXT DEFAULT 'Balanced', -- Luxury, Balanced, Budget-Friendly
    budget_flexibility TEXT DEFAULT 'Flexible',
    status TEXT DEFAULT 'Planning', -- Planning, Confirmed, In Progress, Completed, Cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Event Preferences
CREATE TABLE IF NOT EXISTS event_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE UNIQUE,
    theme TEXT,
    color_palette JSONB DEFAULT '[]'::jsonb,
    food_preference TEXT,
    cultural_background TEXT,
    regional_traditions TEXT,
    language TEXT DEFAULT 'en',
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Event Budgets summary & parameters
CREATE TABLE IF NOT EXISTS event_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE UNIQUE,
    total_budget NUMERIC(12, 2) NOT NULL,
    estimated_total NUMERIC(12, 2) DEFAULT 0.00,
    actual_spent NUMERIC(12, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'INR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Expense Categories
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    allocated_amount NUMERIC(12, 2) DEFAULT 0.00,
    percentage NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    category_id UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    title TEXT NOT NULL,
    estimated_amount NUMERIC(12, 2) DEFAULT 0.00,
    actual_amount NUMERIC(12, 2) DEFAULT 0.00,
    advance_paid NUMERIC(12, 2) DEFAULT 0.00,
    payment_status TEXT DEFAULT 'Unpaid', -- Unpaid, Partially Paid, Paid
    vendor_name TEXT,
    due_date DATE,
    paid_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Vendors
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    location TEXT,
    quoted_amount NUMERIC(12, 2) DEFAULT 0.00,
    advance_paid NUMERIC(12, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'Contacted', -- Not Contacted, Contacted, Quote Received, Negotiating, Booked, Partially Paid, Fully Paid, Cancelled
    notes TEXT,
    rating NUMERIC(3, 1),
    proposal_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Vendor Quotes
CREATE TABLE IF NOT EXISTS vendor_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    services_included TEXT,
    price NUMERIC(12, 2) NOT NULL,
    status TEXT DEFAULT 'Pending',
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Guest Groups
CREATE TABLE IF NOT EXISTS guest_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- VIP, Bride's Family, Groom's Family, College Friends, Colleagues
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Guests
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    group_id UUID REFERENCES guest_groups(id) ON DELETE SET NULL,
    group_name TEXT DEFAULT 'General',
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    rsvp_status TEXT DEFAULT 'Pending', -- Invited, Confirmed, Declined, Pending
    dietary_preference TEXT DEFAULT 'Standard', -- Standard, Vegetarian, Vegan, Jain, Halal
    plus_ones INTEGER DEFAULT 0,
    table_assigned TEXT,
    invitation_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Digital Invitations
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    host_names TEXT NOT NULL,
    message TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    template_style TEXT DEFAULT 'royal_plum',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Seating Tables
CREATE TABLE IF NOT EXISTS seating_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 8,
    shape TEXT DEFAULT 'Round', -- Round, Rectangular
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Seating Assignments
CREATE TABLE IF NOT EXISTS seating_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    table_id UUID REFERENCES seating_tables(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE UNIQUE,
    seat_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    priority TEXT DEFAULT 'Medium', -- Low, Medium, High, Critical
    status TEXT DEFAULT 'Not Started', -- Not Started, In Progress, Completed, Blocked
    assigned_to TEXT,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Ceremonies & Cultural Events
CREATE TABLE IF NOT EXISTS ceremonies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    ceremony_date DATE,
    start_time TIME,
    end_time TIME,
    venue TEXT,
    tradition_notes TEXT,
    attire_suggestion TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Shopping Items & Materials
CREATE TABLE IF NOT EXISTS shopping_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- Decorations, Ritual Materials, Clothing, Gifts, Accessories
    item_name TEXT NOT NULL,
    quantity TEXT,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    is_purchased BOOLEAN DEFAULT FALSE,
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Risks & Contingency Management
CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- Weather, Vendor, Budget, Logistics, Guest
    probability NUMERIC(3, 2) DEFAULT 0.3, -- 0.00 to 1.00
    impact NUMERIC(3, 2) DEFAULT 0.5, -- 0.00 to 1.00
    risk_score NUMERIC(5, 2) GENERATED ALWAYS AS (probability * impact * 100) STORED,
    severity TEXT DEFAULT 'Medium', -- Low, Medium, High, Critical
    suggested_solution TEXT,
    backup_arrangement TEXT,
    status TEXT DEFAULT 'Identified', -- Identified, Mitigated, Accepted, Resolved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Community Volunteers
CREATE TABLE IF NOT EXISTS community_volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    assigned_duty TEXT,
    availability_shift TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. Community Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tier TEXT DEFAULT 'Silver', -- Platinum, Gold, Silver, Bronze, Supporter
    contribution_amount NUMERIC(12, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'Pledged', -- Pledged, Received, Pending
    contact_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20. Community Contributions
CREATE TABLE IF NOT EXISTS contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    contributor_name TEXT NOT NULL,
    flat_or_org TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    status TEXT DEFAULT 'Received', -- Received, Pending
    receipt_no TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, warning, urgent, success
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. Chat Sessions & Messages (AI Copilot)
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Planning Chat',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- user, assistant, agent
    content TEXT NOT NULL,
    agent_name TEXT, -- EventPlanner, BudgetAgent, RiskAgent, etc.
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 23. Event Reports
CREATE TABLE IF NOT EXISTS event_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE UNIQUE,
    executive_summary TEXT,
    budget_analysis JSONB DEFAULT '{}'::jsonb,
    vendor_performance JSONB DEFAULT '{}'::jsonb,
    risk_summary JSONB DEFAULT '{}'::jsonb,
    post_event_notes TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR HIGH-PERFORMANCE QUERIES
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_event_id ON expenses(event_id);
CREATE INDEX IF NOT EXISTS idx_vendors_event_id ON vendors(event_id);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_event_id ON tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_risks_event_id ON risks(event_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);

