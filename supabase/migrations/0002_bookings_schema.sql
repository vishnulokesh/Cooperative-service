-- Booking Schema for CoopServe

-- 1. Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  service_type_id UUID REFERENCES service_types(id) ON DELETE SET NULL,
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  
  service_address TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  
  scheduled_date DATE NOT NULL,
  scheduled_start_time TIME NOT NULL,
  scheduled_end_time TIME,
  
  customer_notes TEXT,
  estimated_amount NUMERIC(10, 2),
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  cancellation_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Booking Status History
CREATE TABLE booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;

-- Booking Policies

-- Customers can view their own bookings
CREATE POLICY "Customers can view own bookings" 
ON bookings FOR SELECT 
USING (auth.uid() = customer_id);

-- Customers can insert their own bookings
CREATE POLICY "Customers can create bookings" 
ON bookings FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own bookings (e.g., cancel)
CREATE POLICY "Customers can update own bookings" 
ON bookings FOR UPDATE 
USING (auth.uid() = customer_id);


-- Workers can view bookings assigned to them
CREATE POLICY "Workers can view assigned bookings" 
ON bookings FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM workers WHERE workers.id = bookings.worker_id AND workers.profile_id = auth.uid())
);

-- Workers can update bookings assigned to them (accept, reject, start, complete)
CREATE POLICY "Workers can update assigned bookings" 
ON bookings FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM workers WHERE workers.id = bookings.worker_id AND workers.profile_id = auth.uid())
);


-- Booking Status History Policies

-- Customers can view history for their own bookings
CREATE POLICY "Customers can view own booking history" 
ON booking_status_history FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_status_history.booking_id AND bookings.customer_id = auth.uid())
);

-- Customers can insert history (when cancelling)
CREATE POLICY "Customers can insert booking history" 
ON booking_status_history FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_status_history.booking_id AND bookings.customer_id = auth.uid())
);

-- Workers can view history for their assigned bookings
CREATE POLICY "Workers can view assigned booking history" 
ON booking_status_history FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bookings 
    JOIN workers ON bookings.worker_id = workers.id 
    WHERE bookings.id = booking_status_history.booking_id AND workers.profile_id = auth.uid()
  )
);

-- Workers can insert history for their assigned bookings
CREATE POLICY "Workers can insert assigned booking history" 
ON booking_status_history FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bookings 
    JOIN workers ON bookings.worker_id = workers.id 
    WHERE bookings.id = booking_status_history.booking_id AND workers.profile_id = auth.uid()
  )
);

-- Trigger for updated_at on bookings
CREATE TRIGGER set_timestamp_bookings BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Create a helper function to easily insert status history on booking insert
CREATE OR REPLACE FUNCTION log_initial_booking_status()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO booking_status_history (booking_id, status, changed_by, note)
  VALUES (NEW.id, NEW.status, NEW.customer_id, 'Booking created');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_created 
  AFTER INSERT ON bookings 
  FOR EACH ROW 
  EXECUTE PROCEDURE log_initial_booking_status();
