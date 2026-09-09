-- Clear existing data if necessary (order matters due to foreign keys)
DELETE FROM worker_verifications;
DELETE FROM worker_skills;
DELETE FROM worker_services;
DELETE FROM service_types;
DELETE FROM workers;
DELETE FROM services;
DELETE FROM cooperatives;
-- We won't delete profiles and auth.users to prevent breaking existing test users, 
-- but in a fresh seed we normally insert them. For this demo, we'll insert standalone mock workers 
-- which implies we need mock profiles/auth users. Let's create dummy auth users and profiles.

-- For safety in seeding without breaking real instances, 
-- we will use a specific namespace of UUIDs or let Supabase generate them if we aren't joining on known IDs.
-- Let's create 10 services
INSERT INTO services (id, name, slug, description, category, icon) VALUES 
('11111111-1111-1111-1111-111111111111', 'Plumbing', 'plumbing', 'Find verified cooperative plumbers for your home and community needs.', 'repair', 'Wrench'),
('22222222-2222-2222-2222-222222222222', 'Electrical', 'electrical', 'Find verified electricians for safe and reliable electrical work.', 'repair', 'Zap'),
('33333333-3333-3333-3333-333333333333', 'Carpentry', 'carpentry', 'Skilled carpenters for custom furniture and repair works.', 'repair', 'Hammer'),
('44444444-4444-4444-4444-444444444444', 'Painting', 'painting', 'Professional painters for your home and office.', 'home', 'Paintbrush'),
('55555555-5555-5555-5555-555555555555', 'Cleaning', 'cleaning', 'Thorough cleaning services for homes and communities.', 'home', 'Sparkles'),
('66666666-6666-6666-6666-666666666666', 'Caregiving', 'caregiving', 'Compassionate caregivers for your loved ones.', 'care', 'Heart'),
('77777777-7777-7777-7777-777777777777', 'Gardening', 'gardening', 'Expert gardening and landscaping services.', 'outdoor', 'TreePine'),
('88888888-8888-8888-8888-888888888888', 'Driving', 'driving', 'Professional drivers for local and outstation trips.', 'transport', 'Car'),
('99999999-9999-9999-9999-999999999999', 'Technical Services', 'technical', 'Reliable repair for appliances and equipment.', 'technical', 'MonitorSmartphone'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Domestic Help', 'domestic', 'Trusted daily household assistance.', 'home', 'Users');

-- Create Service Types
INSERT INTO service_types (service_id, name) VALUES 
('11111111-1111-1111-1111-111111111111', 'Tap Repair'),
('11111111-1111-1111-1111-111111111111', 'Pipe Repair'),
('11111111-1111-1111-1111-111111111111', 'Leakage Repair'),
('11111111-1111-1111-1111-111111111111', 'Drain Cleaning'),
('22222222-2222-2222-2222-222222222222', 'Fan Repair'),
('22222222-2222-2222-2222-222222222222', 'Wiring'),
('33333333-3333-3333-3333-333333333333', 'Furniture Repair'),
('33333333-3333-3333-3333-333333333333', 'Custom Furniture'),
('44444444-4444-4444-4444-444444444444', 'Wall Painting'),
('55555555-5555-5555-5555-555555555555', 'Home Cleaning'),
('55555555-5555-5555-5555-555555555555', 'Deep Cleaning'),
('66666666-6666-6666-6666-666666666666', 'Elder Care'),
('66666666-6666-6666-6666-666666666666', 'Patient Support'),
('77777777-7777-7777-7777-777777777777', 'Garden Maintenance'),
('88888888-8888-8888-8888-888888888888', 'Personal Driver'),
('99999999-9999-9999-9999-999999999999', 'Appliance Repair'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Kitchen Assistance');

-- 5 Cooperatives
INSERT INTO cooperatives (id, name, city, district, state, verification_status, worker_count, rating) VALUES 
('c1111111-1111-1111-1111-111111111111', 'Chittoor Skilled Workers Cooperative', 'Chittoor', 'Chittoor', 'Andhra Pradesh', 'verified', 126, 4.8),
('c2222222-2222-2222-2222-222222222222', 'Tirupati Community Services Cooperative', 'Tirupati', 'Tirupati', 'Andhra Pradesh', 'verified', 94, 4.7),
('c3333333-3333-3333-3333-333333333333', 'Bengaluru Technical Workers Cooperative', 'Bengaluru', 'Bengaluru Urban', 'Karnataka', 'verified', 210, 4.9),
('c4444444-4444-4444-4444-444444444444', 'Hyderabad Domestic Help Union', 'Hyderabad', 'Hyderabad', 'Telangana', 'verified', 150, 4.6),
('c5555555-5555-5555-5555-555555555555', 'Chennai Caregivers Cooperative', 'Chennai', 'Chennai', 'Tamil Nadu', 'verified', 80, 4.9);

-- Add dummy auth users (passwords won't work without hashing, but IDs satisfy foreign keys)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at) VALUES 
('w1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'surya@coopserve.local', 'dummy', now()),
('w2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'lakshmi@coopserve.local', 'dummy', now()),
('w3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'venkat@coopserve.local', 'dummy', now()),
('w4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'meena@coopserve.local', 'dummy', now()),
('w5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'ramesh@coopserve.local', 'dummy', now());

-- Add profiles
INSERT INTO profiles (id, full_name, email, role, avatar_url) VALUES 
('w1111111-1111-1111-1111-111111111111', 'Surya Prakash', 'surya@coopserve.local', 'worker', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80'),
('w2222222-2222-2222-2222-222222222222', 'Lakshmi Devi', 'lakshmi@coopserve.local', 'worker', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80'),
('w3333333-3333-3333-3333-333333333333', 'Venkat Reddy', 'venkat@coopserve.local', 'worker', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80'),
('w4444444-4444-4444-4444-444444444444', 'Meena Kumari', 'meena@coopserve.local', 'worker', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80'),
('w5555555-5555-5555-5555-555555555555', 'Ramesh Babu', 'ramesh@coopserve.local', 'worker', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80');

-- Add workers
INSERT INTO workers (id, profile_id, cooperative_id, professional_title, experience_years, rating, completed_jobs, verification_status, availability_status) VALUES 
('ww111111-1111-1111-1111-111111111111', 'w1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Master Plumber', 8, 4.9, 342, 'verified', 'available'),
('ww222222-2222-2222-2222-222222222222', 'w2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Senior Caregiver', 5, 4.8, 156, 'verified', 'available'),
('ww333333-3333-3333-3333-333333333333', 'w3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Expert Electrician', 12, 4.7, 890, 'verified', 'busy'),
('ww444444-4444-4444-4444-444444444444', 'w4444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', 'Professional Housekeeper', 4, 4.9, 234, 'verified', 'available'),
('ww555555-5555-5555-5555-555555555555', 'w5555555-5555-5555-5555-555555555555', 'c3333333-3333-3333-3333-333333333333', 'Appliance Technician', 6, 4.6, 412, 'verified', 'available');

-- Add worker_services
INSERT INTO worker_services (worker_id, service_id) VALUES 
('ww111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
('ww222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666'),
('ww333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
('ww444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555'),
('ww555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999');

INSERT INTO worker_skills (worker_id, service_id, skill_name, skill_level, verified) VALUES 
('ww111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Tap Repair', 'expert', true),
('ww111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Pipe Installation', 'advanced', true),
('ww222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'Elder Care', 'expert', true),
('ww333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'House Wiring', 'expert', true),
('ww444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'Deep Cleaning', 'advanced', true);

-- ===================================================================
-- Seed Bookings
-- ===================================================================
INSERT INTO bookings (id, customer_id, worker_id, service_id, service_type, status, scheduled_date, scheduled_start_time, service_address, city, district, state, estimated_amount, total_amount, payment_method, payment_status, customer_notes, is_emergency) VALUES
(
  'bk000001-0000-0000-0000-000000000001',
  'c1111111-1111-1111-1111-customer11111',
  'ww111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Pipe Repair',
  'completed',
  '2026-08-28', '10:00 AM',
  '12, Gandhi Nagar, Chittoor', 'Chittoor', 'Chittoor', 'Andhra Pradesh',
  350, 350, 'UPI', 'paid',
  'Bathroom tap leaking continuously', false
),
(
  'bk000002-0000-0000-0000-000000000002',
  'c1111111-1111-1111-1111-customer11111',
  'ww222222-2222-2222-2222-222222222222',
  '66666666-6666-6666-6666-666666666666',
  'Elder Care',
  'on_the_way',
  '2026-09-04', '03:30 PM',
  '24, Balaji Colony, Tirupati', 'Tirupati', 'Tirupati', 'Andhra Pradesh',
  500, 500, 'Card', 'pending',
  'Elderly assistance for evening routine', false
),
(
  'bk000003-0000-0000-0000-000000000003',
  'c1111111-1111-1111-1111-customer11111',
  'ww333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'Fan Repair',
  'requested',
  '2026-09-06', '09:00 AM',
  '8, MG Road, Chittoor', 'Chittoor', 'Chittoor', 'Andhra Pradesh',
  400, 400, 'Net Banking', 'pending',
  'Ceiling fan making strange noise', false
),
(
  'bk000004-0000-0000-0000-000000000004',
  'c1111111-1111-1111-1111-customer11111',
  'ww444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  'Deep Cleaning',
  'accepted',
  '2026-09-05', '11:00 AM',
  '15, RTC Colony, Chittoor', 'Chittoor', 'Chittoor', 'Andhra Pradesh',
  300, 300, 'Cash', 'pending',
  'Kitchen and hall deep cleaning', false
),
(
  'bk000005-0000-0000-0000-000000000005',
  'c1111111-1111-1111-1111-customer11111',
  'ww111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Tap Repair',
  'started',
  '2026-09-04', '01:00 PM',
  '102, Shanti Nagar, Chittoor', 'Chittoor', 'Chittoor', 'Andhra Pradesh',
  380, 380, 'UPI', 'paid',
  'Door lock and hinge replacement', false
),
(
  'bk000006-0000-0000-0000-000000000006',
  'c1111111-1111-1111-1111-customer11111',
  'ww555555-5555-5555-5555-555555555555',
  '99999999-9999-9999-9999-999999999999',
  'AC Service',
  'requested',
  '2026-09-07', '02:00 PM',
  '42, SV University Road, Tirupati', 'Tirupati', 'Tirupati', 'Andhra Pradesh',
  550, 550, 'UPI', 'pending',
  'Split AC not cooling properly in master bedroom', false
),
(
  'bk000007-0000-0000-0000-000000000007',
  'c1111111-1111-1111-1111-customer11111',
  'ww111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Pipe Repair',
  'requested',
  '2026-09-07', '10:00 AM',
  '10, High School Road, Chittoor', 'Chittoor', 'Chittoor', 'Andhra Pradesh',
  600, 600, 'UPI', 'pending',
  'Urgent main line pipe burst flooding kitchen area!', true
);

-- ===================================================================
-- Seed Booking Status History
-- ===================================================================
INSERT INTO booking_status_history (booking_id, status, note, created_at) VALUES
('bk000001-0000-0000-0000-000000000001', 'requested', 'Customer created booking', NOW() - INTERVAL '10 days'),
('bk000001-0000-0000-0000-000000000001', 'accepted',  'Worker accepted',           NOW() - INTERVAL '10 days' + INTERVAL '5 minutes'),
('bk000001-0000-0000-0000-000000000001', 'on_the_way','Worker travelling',         NOW() - INTERVAL '10 days' + INTERVAL '30 minutes'),
('bk000001-0000-0000-0000-000000000001', 'started',   'Service started',           NOW() - INTERVAL '10 days' + INTERVAL '1 hour'),
('bk000001-0000-0000-0000-000000000001', 'completed', 'Service completed',         NOW() - INTERVAL '10 days' + INTERVAL '2 hours'),
('bk000002-0000-0000-0000-000000000002', 'requested', 'Customer created booking',  NOW() - INTERVAL '3 days'),
('bk000002-0000-0000-0000-000000000002', 'accepted',  'Worker accepted',           NOW() - INTERVAL '3 days' + INTERVAL '10 minutes'),
('bk000002-0000-0000-0000-000000000002', 'on_the_way','Worker travelling',         NOW() - INTERVAL '1 hour'),
('bk000004-0000-0000-0000-000000000004', 'requested', 'Customer created booking',  NOW() - INTERVAL '2 days'),
('bk000004-0000-0000-0000-000000000004', 'accepted',  'Worker accepted',           NOW() - INTERVAL '2 days' + INTERVAL '15 minutes');

-- ===================================================================
-- Seed Payments
-- ===================================================================
INSERT INTO payments (booking_id, customer_id, worker_id, amount, platform_fee, cooperative_fee, worker_amount, payment_method, status, transaction_id) VALUES
(
  'bk000001-0000-0000-0000-000000000001',
  'c1111111-1111-1111-1111-customer11111',
  'ww111111-1111-1111-1111-111111111111',
  350, 35, 14, 301, 'UPI', 'completed', 'TXN_DEMO_001'
),
(
  'bk000005-0000-0000-0000-000000000005',
  'c1111111-1111-1111-1111-customer11111',
  'ww111111-1111-1111-1111-111111111111',
  380, 38, 15, 327, 'UPI', 'completed', 'TXN_DEMO_002'
);

-- ===================================================================
-- Seed Welfare Contributions
-- ===================================================================
INSERT INTO welfare_contributions (worker_id, cooperative_id, contribution_month, amount, status) VALUES
('ww111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '2026-08', 250, 'contributed'),
('ww111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '2026-07', 250, 'contributed'),
('ww111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '2026-06', 250, 'contributed'),
('ww222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', '2026-08', 250, 'contributed'),
('ww222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', '2026-07', 250, 'contributed'),
('ww333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', '2026-08', 250, 'contributed'),
('ww444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', '2026-08', 250, 'pending'),
('ww555555-5555-5555-5555-555555555555', 'c3333333-3333-3333-3333-333333333333', '2026-08', 250, 'contributed');

-- ===================================================================
-- Seed Worker Insurance
-- ===================================================================
INSERT INTO worker_insurance (worker_id, benefit_type, provider, policy_number, coverage_amount, status, expires_at) VALUES
('ww111111-1111-1111-1111-111111111111', 'health',    'National Insurance Co.', 'NIC-2026-001', 200000, 'active', NOW() + INTERVAL '1 year'),
('ww111111-1111-1111-1111-111111111111', 'accident',  'LIC of India',           'LIC-ACC-001',  500000, 'active', NOW() + INTERVAL '1 year'),
('ww222222-2222-2222-2222-222222222222', 'health',    'National Insurance Co.', 'NIC-2026-002', 200000, 'active', NOW() + INTERVAL '1 year'),
('ww222222-2222-2222-2222-222222222222', 'maternity', 'National Insurance Co.', 'NIC-MAT-002',  100000, 'active', NOW() + INTERVAL '1 year'),
('ww333333-3333-3333-3333-333333333333', 'health',    'New India Assurance',    'NIA-2026-003', 200000, 'active', NOW() + INTERVAL '8 months'),
('ww333333-3333-3333-3333-333333333333', 'accident',  'LIC of India',           'LIC-ACC-003',  500000, 'active', NOW() + INTERVAL '8 months'),
('ww444444-4444-4444-4444-444444444444', 'health',    'National Insurance Co.', 'NIC-2026-004', 200000, 'active', NOW() + INTERVAL '1 year'),
('ww555555-5555-5555-5555-555555555555', 'health',    'Oriental Insurance',     'ORI-2026-005', 200000, 'active', NOW() + INTERVAL '6 months');

-- ===================================================================
-- Seed Notifications (for the customer profile)
-- ===================================================================
INSERT INTO notifications (user_id, type, title, message, is_read, related_booking_id) VALUES
(
  'c1111111-1111-1111-1111-customer11111',
  'booking_confirmed', 'Booking Confirmed',
  'Your plumbing service booking on Sep 6, 9:00 AM has been confirmed.',
  false, 'bk000003-0000-0000-0000-000000000003'
),
(
  'c1111111-1111-1111-1111-customer11111',
  'worker_assigned', 'Worker Assigned',
  'Venkat Reddy (Expert Electrician) has been assigned to your booking.',
  false, 'bk000003-0000-0000-0000-000000000003'
),
(
  'c1111111-1111-1111-1111-customer11111',
  'booking_completed', 'Service Completed',
  'Your plumbing service on Aug 28 has been marked as completed. Please rate your experience.',
  true, 'bk000001-0000-0000-0000-000000000001'
),
(
  'c1111111-1111-1111-1111-customer11111',
  'payment_received', 'Payment Received',
  'Payment of ₹350 received for booking #bk000001.',
  true, 'bk000001-0000-0000-0000-000000000001'
),
-- Worker notification
(
  'w1111111-1111-1111-1111-111111111111',
  'new_job', 'New Job Request',
  'You have a new cleaning service request from Anitha Rao.',
  false, 'bk000004-0000-0000-0000-000000000004'
);
