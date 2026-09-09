-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'worker', 'cooperative_admin', 'platform_admin')),
  city TEXT,
  district TEXT,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cooperatives Table
CREATE TABLE cooperatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  logo_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  worker_count INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL CHECK (category IN ('home', 'repair', 'care', 'outdoor', 'transport', 'technical')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Service Types Table
CREATE TABLE service_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Workers Table
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  professional_title TEXT NOT NULL,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 0.00,
  completed_jobs INTEGER DEFAULT 0,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'verified', 'rejected')),
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
  service_area TEXT,
  languages TEXT[],
  hourly_or_base_rate NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Worker Skills Table
CREATE TABLE worker_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  verified BOOLEAN DEFAULT FALSE,
  certification_name TEXT,
  certification_issuer TEXT,
  certification_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Worker Services Relationship Table (Junction)
CREATE TABLE worker_services (
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (worker_id, service_id)
);

-- 8. Worker Verifications Table
CREATE TABLE worker_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('identity', 'skill', 'certification', 'cooperative_membership')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage Buckets setup
INSERT INTO storage.buckets (id, name, public) VALUES 
('worker-avatars', 'worker-avatars', true),
('cooperative-assets', 'cooperative-assets', true),
('worker-documents', 'worker-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_verifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Cooperatives Policies
CREATE POLICY "Verified cooperatives are viewable by everyone" ON cooperatives FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Platform admins can manage all cooperatives" ON cooperatives FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'platform_admin'));

-- Services Policies
CREATE POLICY "Active services are viewable by everyone" ON services FOR SELECT USING (active = true);
CREATE POLICY "Active service types viewable by everyone" ON service_types FOR SELECT USING (active = true);

-- Workers Policies
CREATE POLICY "Verified workers are viewable by everyone" ON workers FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Workers can update own permitted fields" ON workers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.id = workers.profile_id)
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.id = workers.profile_id)
); -- Note: App logic or triggers should further restrict fields like verification_status from being updated by the worker.

-- Worker Skills Policies
CREATE POLICY "Verified skills are viewable by everyone" ON worker_skills FOR SELECT USING (verified = true);
CREATE POLICY "Workers can manage their own skills" ON worker_skills FOR ALL USING (
  EXISTS (SELECT 1 FROM workers w WHERE w.id = worker_skills.worker_id AND w.profile_id = auth.uid())
);

-- Worker Services Policies
CREATE POLICY "Public can view worker services" ON worker_services FOR SELECT USING (true);
CREATE POLICY "Workers can manage own services" ON worker_services FOR ALL USING (
  EXISTS (SELECT 1 FROM workers w WHERE w.id = worker_services.worker_id AND w.profile_id = auth.uid())
);

-- Worker Verifications Policies
CREATE POLICY "Platform admins can manage verifications" ON worker_verifications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'platform_admin')
);

-- Helper trigger to keep updated_at in sync
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_cooperatives BEFORE UPDATE ON cooperatives FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_services BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_workers BEFORE UPDATE ON workers FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- ===================================================================
-- 9. Bookings Table
-- ===================================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  service_type TEXT,                          -- Sub-service (e.g. "Tap Repair")
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'accepted', 'on_the_way', 'started', 'completed', 'cancelled', 'rejected')),
  scheduled_date DATE NOT NULL,
  scheduled_start_time TEXT NOT NULL,
  service_address TEXT NOT NULL,
  city TEXT,
  district TEXT,
  state TEXT,
  estimated_amount NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) DEFAULT 0,
  payment_method TEXT DEFAULT 'Cash'
    CHECK (payment_method IN ('Cash', 'UPI', 'Card', 'Net Banking', 'Wallet')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded', 'cancelled', 'failed')),
  customer_notes TEXT,
  worker_notes TEXT,
  is_emergency BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2, 1),
  review TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Booking Status History Table
CREATE TABLE booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  platform_fee NUMERIC(10, 2) DEFAULT 0,
  cooperative_fee NUMERIC(10, 2) DEFAULT 0,
  worker_amount NUMERIC(10, 2) DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'Cash'
    CHECK (payment_method IN ('Cash', 'UPI', 'Card', 'Net Banking', 'Wallet')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  transaction_id TEXT,
  gateway_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Welfare Contributions Table
CREATE TABLE welfare_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  contribution_month TEXT NOT NULL,          -- e.g. "2026-08"
  amount NUMERIC(10, 2) NOT NULL DEFAULT 250,
  status TEXT NOT NULL DEFAULT 'contributed'
    CHECK (status IN ('contributed', 'pending', 'waived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Insurance / Welfare Benefits Table
CREATE TABLE worker_insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  benefit_type TEXT NOT NULL
    CHECK (benefit_type IN ('health', 'accident', 'life', 'maternity', 'pension')),
  provider TEXT,
  policy_number TEXT,
  coverage_amount NUMERIC(12, 2),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'expired', 'pending', 'cancelled')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('booking_confirmed', 'worker_assigned', 'booking_completed', 'payment_received', 'new_job', 'emergency', 'verification', 'welfare', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- RLS for new tables
-- ===================================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Bookings Policies
CREATE POLICY "Customers can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Workers can view assigned bookings" ON bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM workers w WHERE w.id = bookings.worker_id AND w.profile_id = auth.uid())
  );
CREATE POLICY "Cooperative admins can view all bookings in their coop" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workers w
      JOIN profiles p ON p.id = auth.uid()
      WHERE w.id = bookings.worker_id
        AND w.cooperative_id IN (
          SELECT cooperative_id FROM workers ww WHERE ww.profile_id = auth.uid()
        )
        AND p.role IN ('cooperative_admin', 'platform_admin')
    )
  );
CREATE POLICY "Platform admins can manage all bookings" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'platform_admin')
  );
CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can cancel own pending bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = customer_id
    AND status IN ('requested', 'accepted')
  );
CREATE POLICY "Workers can update booking status" ON bookings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM workers w WHERE w.id = bookings.worker_id AND w.profile_id = auth.uid())
  );

-- Booking Status History Policies
CREATE POLICY "Booking participants can view history" ON booking_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_status_history.booking_id
        AND (b.customer_id = auth.uid()
          OR EXISTS (SELECT 1 FROM workers w WHERE w.id = b.worker_id AND w.profile_id = auth.uid()))
    )
  );
CREATE POLICY "Platform admins can manage booking history" ON booking_status_history
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'platform_admin')
  );

-- Payments Policies
CREATE POLICY "Customers can view own payments" ON payments
  FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Workers can view payments for their bookings" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM workers w WHERE w.id = payments.worker_id AND w.profile_id = auth.uid())
  );
CREATE POLICY "Platform admins can manage all payments" ON payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'platform_admin')
  );

-- Welfare Contributions Policies
CREATE POLICY "Workers can view own welfare contributions" ON welfare_contributions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM workers w WHERE w.id = welfare_contributions.worker_id AND w.profile_id = auth.uid())
  );
CREATE POLICY "Cooperative admins can manage welfare contributions" ON welfare_contributions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('cooperative_admin', 'platform_admin'))
  );

-- Insurance Policies
CREATE POLICY "Workers can view own insurance" ON worker_insurance
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM workers w WHERE w.id = worker_insurance.worker_id AND w.profile_id = auth.uid())
  );
CREATE POLICY "Cooperative admins can manage insurance" ON worker_insurance
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('cooperative_admin', 'platform_admin'))
  );

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark own notifications as read" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications for any user" ON notifications
  FOR INSERT WITH CHECK (true); -- Controlled by DB functions / service role

-- ===================================================================
-- Triggers for updated_at on new tables
-- ===================================================================
CREATE TRIGGER set_timestamp_bookings
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_payments
  BEFORE UPDATE ON payments FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_worker_insurance
  BEFORE UPDATE ON worker_insurance FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- ===================================================================
-- Helper function: Auto-insert booking_status_history on status change
-- ===================================================================
CREATE OR REPLACE FUNCTION fn_log_booking_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO booking_status_history (booking_id, status, changed_by, note)
    VALUES (NEW.id, NEW.status, auth.uid(), 'Status updated');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_log_booking_status
  AFTER UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE fn_log_booking_status();
