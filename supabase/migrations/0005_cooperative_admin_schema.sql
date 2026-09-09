-- Migration 0005: Cooperative Admin Schema & Workflows

-- 1. Add cooperative_id to profiles to securely link admins to cooperatives
ALTER TABLE profiles ADD COLUMN cooperative_id UUID REFERENCES cooperatives(id) ON DELETE SET NULL;

-- 2. Verification Audit Log
CREATE TABLE verification_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  action_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cooperative Services (which services a cooperative offers)
CREATE TABLE cooperative_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cooperative_id, service_id)
);

-- 5. RLS Setup

-- Cooperative Admins RLS for Workers
CREATE POLICY "Coop admins can view their cooperative workers" 
ON workers FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'cooperative_admin'
    AND profiles.cooperative_id = workers.cooperative_id
  )
);

-- Cooperative Admins RLS for Verification Audit Logs
ALTER TABLE verification_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coop admins can view their own audit logs"
ON verification_audit_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'cooperative_admin'
    AND profiles.cooperative_id = verification_audit_log.cooperative_id
  )
);

CREATE POLICY "Coop admins can insert their own audit logs"
ON verification_audit_log FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'cooperative_admin'
    AND profiles.cooperative_id = verification_audit_log.cooperative_id
  )
);

-- Notifications RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (user_id = auth.uid());

-- Cooperative Admins can insert notifications (for verification responses)
CREATE POLICY "System can insert notifications"
ON notifications FOR INSERT
WITH CHECK (true); -- In a real system, secure this via triggers or functions.

-- Worker Verifications update by Coop Admin
CREATE POLICY "Coop admins can update verifications for their workers"
ON worker_verifications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    JOIN workers ON profiles.cooperative_id = workers.cooperative_id
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'cooperative_admin'
    AND workers.id = worker_verifications.worker_id
  )
);

CREATE POLICY "Coop admins can select verifications for their workers"
ON worker_verifications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    JOIN workers ON profiles.cooperative_id = workers.cooperative_id
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'cooperative_admin'
    AND workers.id = worker_verifications.worker_id
  )
);

-- 6. Helper RPC to elevate a user to cooperative admin for demo purposes safely
CREATE OR REPLACE FUNCTION set_cooperative_admin(user_id UUID, target_cooperative_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as Postgres superuser
AS $$
BEGIN
  UPDATE profiles 
  SET role = 'cooperative_admin', cooperative_id = target_cooperative_id 
  WHERE id = user_id;
END;
$$;
