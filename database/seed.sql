-- Sample Seed Data for Eventora AI
-- Demo Event: Maharashtrian Wedding in Pune, Maharashtra
-- Budget: ₹15,00,000, 250 Guests, 2 Days

DO $$
DECLARE
    demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
    demo_event_id UUID := '11111111-1111-1111-1111-111111111111';
    cat_venue UUID := uuid_generate_v4();
    cat_catering UUID := uuid_generate_v4();
    cat_decoration UUID := uuid_generate_v4();
    cat_photo UUID := uuid_generate_v4();
    cat_attire UUID := uuid_generate_v4();
    cat_music UUID := uuid_generate_v4();
    v_venue UUID := uuid_generate_v4();
    v_catering UUID := uuid_generate_v4();
    v_decor UUID := uuid_generate_v4();
    v_photo UUID := uuid_generate_v4();
    grp_family UUID := uuid_generate_v4();
    grp_friends UUID := uuid_generate_v4();
    tbl_1 UUID := uuid_generate_v4();
    tbl_2 UUID := uuid_generate_v4();
    chat_sess UUID := uuid_generate_v4();
BEGIN
    -- 1. Demo User Profile
    INSERT INTO profiles (id, email, full_name, preferred_language, country, city, preferred_currency)
    VALUES (demo_user_id, 'demo@eventora.ai', 'Aarav & Priyanka Deshmukh', 'en', 'India', 'Pune', 'INR')
    ON CONFLICT (id) DO NOTHING;

    -- 2. Demo Event
    INSERT INTO events (id, user_id, title, category, event_date, start_time, end_time, days_count, city, venue, guest_count, total_budget, currency, budget_priority, status)
    VALUES (demo_event_id, demo_user_id, 'Priyanka & Rohan''s Royal Maharashtrian Wedding', 'Wedding', CURRENT_DATE + INTERVAL '45 days', '09:00', '22:00', 2, 'Pune', 'The Heritage Grand Lawns, Baner', 250, 1500000.00, 'INR', 'Luxury', 'Planning')
    ON CONFLICT (id) DO NOTHING;

    -- 3. Event Preferences
    INSERT INTO event_preferences (event_id, theme, color_palette, food_preference, cultural_background, regional_traditions, language, special_requirements)
    VALUES (demo_event_id, 'Royal Peshwai Elegance', '["#54265F", "#F3E5C8", "#C58B76", "#FFFDF9"]'::jsonb, 'Authentic Maharashtrian Pure Vegetarian (Satvik/Jain options available)', 'Hindu Maharashtrian', 'Traditional Sakharpuda, Haldi, Punyavachana, Saptapadi, and Satyanarayan Pooja', 'mr', 'Eco-friendly floral mandap, Shenai/Chaughada troupe for muhurt')
    ON CONFLICT (event_id) DO NOTHING;

    -- 4. Event Budget Summary
    INSERT INTO event_budgets (event_id, total_budget, estimated_total, actual_spent, currency)
    VALUES (demo_event_id, 1500000.00, 1420000.00, 480000.00, 'INR')
    ON CONFLICT (event_id) DO NOTHING;

    -- 5. Expense Categories
    INSERT INTO expense_categories (id, event_id, name, allocated_amount, percentage) VALUES
    (cat_venue, demo_event_id, 'Venue & Banqueting', 450000.00, 30.00),
    (cat_catering, demo_event_id, 'Catering & Beverages', 400000.00, 26.67),
    (cat_decoration, demo_event_id, 'Decor & Mandap Architecture', 250000.00, 16.67),
    (cat_photo, demo_event_id, 'Photography & Cinematic Video', 150000.00, 10.00),
    (cat_attire, demo_event_id, 'Traditional Attire & Paithani Sarees', 100000.00, 6.67),
    (cat_music, demo_event_id, 'Music, Sanai & Entertainment', 70000.00, 4.67);

    -- 6. Expenses
    INSERT INTO expenses (event_id, category_id, category_name, title, estimated_amount, actual_amount, advance_paid, payment_status, vendor_name, due_date) VALUES
    (demo_event_id, cat_venue, 'Venue & Banqueting', 'The Heritage Grand Lawns Booking (2 Days)', 450000.00, 450000.00, 200000.00, 'Partially Paid', 'The Heritage Grand', CURRENT_DATE + INTERVAL '20 days'),
    (demo_event_id, cat_catering, 'Catering & Beverages', 'Shree Maharashtrian Feast Catering (250 Pax x 3 meals)', 400000.00, 390000.00, 150000.00, 'Partially Paid', 'Shree Caterers Pune', CURRENT_DATE + INTERVAL '30 days'),
    (demo_event_id, cat_decoration, 'Decor & Mandap Architecture', 'Royal Peshwa Floral Mandap & Entry Arch', 250000.00, 240000.00, 80000.00, 'Partially Paid', 'Sanskriti Mandap & Decorators', CURRENT_DATE + INTERVAL '25 days'),
    (demo_event_id, cat_photo, 'Photography & Cinematic Video', 'Candid Wedding Photography + Drone Teaser', 150000.00, 150000.00, 50000.00, 'Partially Paid', 'LensKraft Pune Studios', CURRENT_DATE + INTERVAL '40 days');

    -- 7. Vendors
    INSERT INTO vendors (id, event_id, name, category, contact_person, phone, email, location, quoted_amount, advance_paid, status, notes, rating) VALUES
    (v_venue, demo_event_id, 'The Heritage Grand Lawns', 'Venue', 'Rajesh Kulkarni', '+91 98220 12345', 'info@heritagegrand.com', 'Baner Road, Pune', 450000.00, 200000.00, 'Booked', 'Lawn capacity 800 guests, 12 AC changing rooms included.', 4.9),
    (v_catering, demo_event_id, 'Shree Maharashtrian Caterers', 'Catering', 'Sunil Joshi', '+91 98221 54321', 'sunil@shreecaterers.in', 'Sadashiv Peth, Pune', 390000.00, 150000.00, 'Booked', 'Specialties: Puran Poli with Pure Ghee, Ukadiche Modak, Basundi, Kothimbir Vadi.', 4.8),
    (v_decor, demo_event_id, 'Sanskriti Mandap & Floral Decor', 'Decoration', 'Mahesh Shinde', '+91 94220 98765', 'sanskritidecor@gmail.com', 'Kothrud, Pune', 240000.00, 80000.00, 'Booked', 'Marigold & tuberose brass urli concepts, traditional toran entrance.', 4.7),
    (v_photo, demo_event_id, 'LensKraft Pune Studios', 'Photography', 'Aditya Pawar', '+91 97654 32109', 'hello@lenskraftstudios.in', 'FC Road, Pune', 150000.00, 50000.00, 'Booked', 'Complete pre-wedding shoot, cinematic 4K highlights, wedding album of 100 pages.', 4.9);

    -- 8. Guest Groups & Guests
    INSERT INTO guest_groups (id, event_id, name) VALUES
    (grp_family, demo_event_id, 'Immediate Family & Relatives'),
    (grp_friends, demo_event_id, 'School & College Friends');

    INSERT INTO guests (event_id, group_id, group_name, name, email, phone, rsvp_status, dietary_preference, plus_ones, invitation_sent) VALUES
    (demo_event_id, grp_family, 'Immediate Family & Relatives', 'Suresh & Lata Deshmukh', 'suresh.deshmukh@gmail.com', '+91 98220 11111', 'Confirmed', 'Vegetarian', 1, TRUE),
    (demo_event_id, grp_family, 'Immediate Family & Relatives', 'Anand Kulkarni (Uncle)', 'anand.k@yahoo.com', '+91 98220 22222', 'Confirmed', 'Jain (No Onion/Garlic)', 2, TRUE),
    (demo_event_id, grp_friends, 'School & College Friends', 'Vikram Patil', 'vikram.patil@outlook.com', '+91 98220 33333', 'Confirmed', 'Standard', 1, TRUE),
    (demo_event_id, grp_friends, 'School & College Friends', 'Neha Sane', 'neha.sane@gmail.com', '+91 98220 44444', 'Pending', 'Vegetarian', 0, TRUE),
    (demo_event_id, grp_friends, 'School & College Friends', 'Amitabh Ghosh', 'amitabh.g@corp.com', '+91 98220 55555', 'Declined', 'Standard', 0, TRUE);

    -- 9. Ceremonies
    INSERT INTO ceremonies (event_id, name, ceremony_date, start_time, end_time, venue, tradition_notes, attire_suggestion, order_index) VALUES
    (demo_event_id, 'Sakharpuda (Engagement Ceremony)', CURRENT_DATE + INTERVAL '44 days', '10:00', '13:00', 'Heritage Banquet Hall', 'Exchange of sugar packet & rings, traditional shagun pooja', 'Yellow or green silk Paithani & Kurta', 1),
    (demo_event_id, 'Haldi & Sangeet Utsav', CURRENT_DATE + INTERVAL '44 days', '16:00', '21:00', 'Heritage Poolside Courtyard', 'Turmeric application ritual with traditional lavani & folk dhol beats', 'Vibrant mustard yellow festive attire', 2),
    (demo_event_id, 'Lagna & Muhurt (Main Wedding Ceremony)', CURRENT_DATE + INTERVAL '45 days', '09:30', '13:30', 'Royal Mandap Lawn', 'Antarpat ceremony, Kanyadaan, Mangalashtaka chanting, Saptapadi', 'Traditional Nauvari saree and dhoti-kurta with pheta (turban)', 3),
    (demo_event_id, 'Grand Reception & Dinner Feast', CURRENT_DATE + INTERVAL '45 days', '19:00', '22:30', 'Main Crystal Hall', 'Formal reception for relatives, colleagues & guests with live classical instrumental', 'Indo-western tuxedo & designer lehenga', 4);

    -- 10. Tasks
    INSERT INTO tasks (event_id, title, description, due_date, priority, status, assigned_to, category) VALUES
    (demo_event_id, 'Confirm Maharashtrian Sweet Menu (Modak & Basundi)', 'Finalize recipe and tasting session with Shree Caterers', CURRENT_DATE + INTERVAL '10 days', 'High', 'Completed', 'Aarav Deshmukh', 'Catering'),
    (demo_event_id, 'Design & Print Traditional Invitation Cards', 'Include Ganpati Bappa shloka and English QR code for RSVP', CURRENT_DATE + INTERVAL '15 days', 'Critical', 'In Progress', 'Priyanka Deshmukh', 'Invitations'),
    (demo_event_id, 'Reserve Hotel Rooms for Outstation Relatives', 'Block 20 executive rooms near Baner for relatives coming from Nagpur & Mumbai', CURRENT_DATE + INTERVAL '20 days', 'High', 'Not Started', 'Uncle Anand', 'Accommodation'),
    (demo_event_id, 'Procure Mandap Puja Samagri & Torans', 'Coordinate with Panditji for list of 28 sacred puja items', CURRENT_DATE + INTERVAL '30 days', 'Medium', 'Not Started', 'Suresh Deshmukh', 'Rituals');

    -- 11. Risks
    INSERT INTO risks (event_id, title, description, category, probability, impact, severity, suggested_solution, backup_arrangement, status) VALUES
    (demo_event_id, 'Sudden Monsoon Showers on Open Lawn', 'Unseasonal rain could affect the evening reception banquet setup', 'Weather', 0.35, 0.80, 'High', 'Verify German waterproof canopy dome installation with the venue', 'Move dinner to banquet hall B if radar indicates >50% precipitation', 'Mitigated'),
    (demo_event_id, 'Catering Guest Overflow Beyond 250', 'Traditional Indian weddings frequently have +15-20% extended family walk-ins', 'Guest', 0.60, 0.50, 'Medium', 'Contract buffer clause with Shree Caterers for 30 additional plates at 15 mins notice', 'Keep buffet counter replenishments active', 'Mitigated'),
    (demo_event_id, 'Power Fluctuations for Night Lighting & Sound', 'Local power cuts or voltage dips during the reception', 'Logistics', 0.20, 0.70, 'Medium', 'Mandate 125 kVA silent acoustic backup generator from venue', 'Venue has automatic dual DG genset transfer switch', 'Resolved');

    -- 12. Digital Invitation
    INSERT INTO invitations (event_id, title, host_names, message, language, template_style) VALUES
    (demo_event_id, 'Wedding of Priyanka & Rohan', 'Suresh & Lata Deshmukh', 'With the divine blessings of Lord Ganesha, we cordially invite you and your family to celebrate the auspicious wedding ceremony of our daughter Priyanka with Rohan.', 'en', 'royal_plum');

    -- 13. AI Copilot Chat Session
    INSERT INTO chat_sessions (id, event_id, user_id, title)
    VALUES (chat_sess, demo_event_id, demo_user_id, 'Wedding Planning Copilot');

    INSERT INTO chat_messages (session_id, sender, content, agent_name) VALUES
    (chat_sess, 'assistant', 'Namaste Aarav! I am your Eventora AI Copilot. I have synchronized your wedding plan for Priyanka & Rohan in Pune. Your budget is optimized at ₹15,00,000 for 250 guests. How can I assist your celebration preparations today?', 'EventPlanner'),
    (chat_sess, 'user', 'Can you review our catering per plate cost and suggest Maharashtrian desserts?', NULL),
    (chat_sess, 'assistant', 'Certainly! For 250 guests with a ₹4,00,000 catering budget, your allocation is approximately ₹530 per plate across 3 events. For traditional Maharashtrian celebration desserts, I recommend:\n1. Freshly steamed Ukadiche Modak with saffron coconut filling & warm pure ghee\n2. Kesar Charoli Basundi\n3. Warm Shrikhand with Poori\n4. Gulab Jamun or Mango Amrakhand (seasonal).\n\nShree Caterers specializes in all of these. Would you like me to add these directly to your catering checklist?', 'CulturalIntelligence');

END $$;

