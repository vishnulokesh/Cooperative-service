-- Matching and Emergency Schema Additions for CoopServe

-- Add is_emergency to bookings
ALTER TABLE bookings 
ADD COLUMN is_emergency BOOLEAN DEFAULT FALSE;

-- Workers table already has service_area (from 0001_initial_schema.sql)
-- Let's ensure workers have city, district, state for easier matching
ALTER TABLE workers 
ADD COLUMN city TEXT,
ADD COLUMN district TEXT,
ADD COLUMN state TEXT;

-- Let's update existing demo workers with location data (inheriting from their profiles/cooperatives for demo purposes if null)
-- In a real app, they would set this in their dashboard.

-- Create an index to quickly find available workers
CREATE INDEX idx_workers_availability ON workers (availability_status);
CREATE INDEX idx_workers_verification ON workers (verification_status);
CREATE INDEX idx_bookings_worker_status ON bookings (worker_id, status, scheduled_date);

-- We need a function to calculate distance/location score if we had postGIS, 
-- but since we are sticking to simple text matching for now, we'll do this in the app logic.
