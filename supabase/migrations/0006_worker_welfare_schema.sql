-- Step 8: Worker Welfare & Protection Schema

-- 1. Worker Welfare Table
CREATE TABLE worker_welfare (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  welfare_status TEXT NOT NULL DEFAULT 'not_enrolled' CHECK (welfare_status IN ('not_enrolled', 'pending', 'active', 'suspended', 'expired')),
  enrolled_at TIMESTAMPTZ,
  contribution_amount NUMERIC(10, 2) DEFAULT 0.00,
  contribution_frequency TEXT DEFAULT 'monthly' CHECK (contribution_frequency IN ('weekly', 'monthly', 'yearly', 'per_job')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_id)
);

-- 2. Worker Insurance Table
CREATE TABLE worker_insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  provider_name TEXT,
  policy_reference TEXT,
  coverage_type TEXT NOT NULL,
  coverage_amount NUMERIC(10, 2) DEFAULT 0.00,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'not_enrolled' CHECK (status IN ('not_enrolled', 'pending', 'active', 'expired', 'cancelled')),
  is_demo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_id)
);

-- 3. Welfare Contributions Table
CREATE TABLE welfare_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  contribution_type TEXT NOT NULL CHECK (contribution_type IN ('cooperative', 'worker', 'platform', 'manual')),
  status TEXT NOT NULL DEFAULT 'recorded' CHECK (status IN ('pending', 'recorded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Welfare Benefits Table
CREATE TABLE welfare_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  benefit_type TEXT NOT NULL CHECK (benefit_type IN ('emergency', 'training', 'safety', 'support', 'financial')),
  eligibility TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Training Recommendations Table
CREATE TABLE training_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  demand_level TEXT NOT NULL CHECK (demand_level IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'recommended' CHECK (status IN ('recommended', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample benefits
INSERT INTO welfare_benefits (name, description, benefit_type, eligibility) VALUES
('Emergency Assistance', 'Support information and direct connection during emergency situations.', 'emergency', 'active_members'),
('Safety Equipment Subsidy', 'Cooperative subsidy for purchasing required safety gear.', 'safety', 'active_members'),
('Skill Development Track', 'Improve your certified skills based on cooperative demand.', 'training', 'all_members');

-- Trigger to update timestamp
CREATE TRIGGER update_worker_welfare_modtime
  BEFORE UPDATE ON worker_welfare
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_worker_insurance_modtime
  BEFORE UPDATE ON worker_insurance
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- RLS POLICIES

ALTER TABLE worker_welfare ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_recommendations ENABLE ROW LEVEL SECURITY;

-- Worker Policies (Can view their own data)
CREATE POLICY "Workers view own welfare" ON worker_welfare FOR SELECT
  USING (worker_id IN (SELECT id FROM workers WHERE profile_id = auth.uid()));

CREATE POLICY "Workers view own insurance" ON worker_insurance FOR SELECT
  USING (worker_id IN (SELECT id FROM workers WHERE profile_id = auth.uid()));

CREATE POLICY "Workers view own contributions" ON welfare_contributions FOR SELECT
  USING (worker_id IN (SELECT id FROM workers WHERE profile_id = auth.uid()));

CREATE POLICY "Workers view own training" ON training_recommendations FOR SELECT
  USING (worker_id IN (SELECT id FROM workers WHERE profile_id = auth.uid()));

CREATE POLICY "Anyone views active benefits" ON welfare_benefits FOR SELECT
  USING (active = true);

-- Cooperative Admin Policies (Can view and manage data for their cooperative)
CREATE POLICY "Admins manage cooperative welfare" ON worker_welfare FOR ALL
  USING (cooperative_id IN (SELECT cooperative_id FROM profiles WHERE id = auth.uid() AND role = 'cooperative_admin'));

CREATE POLICY "Admins manage cooperative insurance" ON worker_insurance FOR ALL
  USING (cooperative_id IN (SELECT cooperative_id FROM profiles WHERE id = auth.uid() AND role = 'cooperative_admin'));

CREATE POLICY "Admins manage cooperative contributions" ON welfare_contributions FOR ALL
  USING (cooperative_id IN (SELECT cooperative_id FROM profiles WHERE id = auth.uid() AND role = 'cooperative_admin'));

CREATE POLICY "Admins manage cooperative training" ON training_recommendations FOR ALL
  USING (cooperative_id IN (SELECT cooperative_id FROM profiles WHERE id = auth.uid() AND role = 'cooperative_admin'));
