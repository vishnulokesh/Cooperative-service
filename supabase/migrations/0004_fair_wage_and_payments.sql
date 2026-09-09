-- Fair-Wage, Payments and Pricing Schema

-- 1. Pricing Rules Table
CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  service_type_id UUID REFERENCES service_types(id) ON DELETE CASCADE,
  base_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  worker_percentage NUMERIC(5, 2) NOT NULL CHECK (worker_percentage >= 0 AND worker_percentage <= 100),
  cooperative_percentage NUMERIC(5, 2) NOT NULL CHECK (cooperative_percentage >= 0 AND cooperative_percentage <= 100),
  platform_percentage NUMERIC(5, 2) NOT NULL CHECK (platform_percentage >= 0 AND platform_percentage <= 100),
  payment_fee_fixed NUMERIC(10, 2) NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_percentages CHECK (worker_percentage + cooperative_percentage + platform_percentage <= 100)
);

-- 2. Extend Bookings Table
ALTER TABLE bookings 
  ADD COLUMN base_amount NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN worker_amount NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN cooperative_amount NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN platform_amount NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN payment_fee NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN total_amount NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN currency TEXT DEFAULT 'INR';

-- 3. Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled')),
  transaction_reference TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Anyone can view active pricing rules (needed for fair-wage visualization)
CREATE POLICY "Public can view active pricing rules" 
ON pricing_rules FOR SELECT 
USING (active = true);

-- Customers can view their own payments
CREATE POLICY "Customers can view own payments" 
ON payments FOR SELECT 
USING (auth.uid() = customer_id);

-- Workers can view payments for their assigned bookings
CREATE POLICY "Workers can view payments for assigned bookings" 
ON payments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bookings 
    JOIN workers ON bookings.worker_id = workers.id 
    WHERE bookings.id = payments.booking_id AND workers.profile_id = auth.uid()
  )
);

-- Customers can insert their own payments (for demo purposes, restrict in prod)
CREATE POLICY "Customers can create payments" 
ON payments FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own payments (e.g., status updates for demo)
CREATE POLICY "Customers can update own payments" 
ON payments FOR UPDATE 
USING (auth.uid() = customer_id);

-- 6. Trigger for Pricing Auto-Calculation on Booking Insert

CREATE OR REPLACE FUNCTION calculate_booking_financials()
RETURNS TRIGGER AS $$
DECLARE
  pricing RECORD;
BEGIN
  -- Find the active pricing rule for this service (and specific type if applicable)
  -- Priority: Specific service_type_id over NULL service_type_id
  SELECT * INTO pricing 
  FROM pricing_rules 
  WHERE service_id = NEW.service_id 
    AND (service_type_id = NEW.service_type_id OR service_type_id IS NULL)
    AND active = true
  ORDER BY service_type_id NULLS LAST
  LIMIT 1;

  IF FOUND THEN
    NEW.base_amount := pricing.base_amount;
    NEW.worker_amount := ROUND((pricing.base_amount * pricing.worker_percentage / 100.0), 2);
    NEW.cooperative_amount := ROUND((pricing.base_amount * pricing.cooperative_percentage / 100.0), 2);
    NEW.platform_amount := ROUND((pricing.base_amount * pricing.platform_percentage / 100.0), 2);
    NEW.payment_fee := pricing.payment_fee_fixed;
    
    NEW.total_amount := NEW.worker_amount + NEW.cooperative_amount + NEW.platform_amount + NEW.payment_fee;
    NEW.estimated_amount := NEW.total_amount; -- Sync with legacy field
  ELSE
    -- Default fallback if no pricing rule exists
    NEW.base_amount := COALESCE(NEW.estimated_amount, 500);
    NEW.worker_amount := ROUND((NEW.base_amount * 0.80), 2);
    NEW.cooperative_amount := ROUND((NEW.base_amount * 0.10), 2);
    NEW.platform_amount := ROUND((NEW.base_amount * 0.05), 2);
    NEW.payment_fee := ROUND((NEW.base_amount * 0.05), 2);
    NEW.total_amount := NEW.worker_amount + NEW.cooperative_amount + NEW.platform_amount + NEW.payment_fee;
    NEW.estimated_amount := NEW.total_amount;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_booking_financials
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE PROCEDURE calculate_booking_financials();

-- 7. RPC to preview pricing for the frontend (Fair-Wage calculator)
CREATE OR REPLACE FUNCTION preview_fair_wage(p_service_id UUID, p_service_type_id UUID DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  pricing RECORD;
  result JSON;
  calc_worker NUMERIC;
  calc_coop NUMERIC;
  calc_platform NUMERIC;
  calc_total NUMERIC;
BEGIN
  SELECT * INTO pricing 
  FROM pricing_rules 
  WHERE service_id = p_service_id 
    AND (service_type_id = p_service_type_id OR service_type_id IS NULL)
    AND active = true
  ORDER BY service_type_id NULLS LAST
  LIMIT 1;

  IF FOUND THEN
    calc_worker := ROUND((pricing.base_amount * pricing.worker_percentage / 100.0), 2);
    calc_coop := ROUND((pricing.base_amount * pricing.cooperative_percentage / 100.0), 2);
    calc_platform := ROUND((pricing.base_amount * pricing.platform_percentage / 100.0), 2);
    calc_total := calc_worker + calc_coop + calc_platform + pricing.payment_fee_fixed;
    
    result := json_build_object(
      'base_amount', pricing.base_amount,
      'worker_amount', calc_worker,
      'cooperative_amount', calc_coop,
      'platform_amount', calc_platform,
      'payment_fee', pricing.payment_fee_fixed,
      'total_amount', calc_total
    );
  ELSE
    -- Fallback preview
    result := json_build_object(
      'base_amount', 500,
      'worker_amount', 400,
      'cooperative_amount', 50,
      'platform_amount', 25,
      'payment_fee', 25,
      'total_amount', 500
    );
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 8. Seed Pricing Rules for all existing services
DO $$ 
DECLARE 
  s RECORD;
BEGIN
  FOR s IN SELECT id FROM services LOOP
    INSERT INTO pricing_rules (
      service_id, 
      base_amount, 
      worker_percentage, 
      cooperative_percentage, 
      platform_percentage, 
      payment_fee_fixed
    )
    VALUES (
      s.id, 
      600.00, 
      80.00, 
      10.00, 
      5.00, 
      30.00
    ) ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
