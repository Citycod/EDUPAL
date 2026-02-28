-- =============================================
-- EduPal Subscription System
-- =============================================

-- 1. Subscription Plans Table
CREATE TABLE IF NOT EXISTS academic.subscription_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,              -- 'Free', 'Premium'
  description text,
  price_ngn integer NOT NULL DEFAULT 0,   -- Price in Naira (1000 = ₦1,000)
  duration_days integer NOT NULL DEFAULT 0, -- 0 = unlimited (free), ~120 = semester
  features jsonb DEFAULT '[]'::jsonb,     -- Array of feature keys
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE academic.subscription_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plans_select_all" ON academic.subscription_plans;
CREATE POLICY "plans_select_all" ON academic.subscription_plans
  FOR SELECT USING (true); -- Anyone can view plans

-- 2. User Subscriptions Table
CREATE TABLE IF NOT EXISTS academic.user_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES academic.subscription_plans(id) NOT NULL,
  institution_id uuid REFERENCES academic.institutions(id),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
  payment_reference text,                -- Paystack transaction reference
  payment_channel text,                  -- card, bank, ussd, etc.
  amount_paid integer DEFAULT 0,         -- Amount in Naira
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE academic.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
DROP POLICY IF EXISTS "subs_select_own" ON academic.user_subscriptions;
CREATE POLICY "subs_select_own" ON academic.user_subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own subscriptions (for pending state)
DROP POLICY IF EXISTS "subs_insert_own" ON academic.user_subscriptions;
CREATE POLICY "subs_insert_own" ON academic.user_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Only service role / triggers can update (webhook activates)
DROP POLICY IF EXISTS "subs_update_service" ON academic.user_subscriptions;
CREATE POLICY "subs_update_service" ON academic.user_subscriptions
  FOR UPDATE USING (user_id = auth.uid());

-- Admins can view all subscriptions for their institution
DROP POLICY IF EXISTS "subs_select_admin" ON academic.user_subscriptions;
CREATE POLICY "subs_select_admin" ON academic.user_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
  );

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_subs_user_id ON academic.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subs_status ON academic.user_subscriptions(user_id, status);

-- 3. Bridge View
DROP VIEW IF EXISTS public.hub_subscriptions CASCADE;
CREATE OR REPLACE VIEW public.hub_subscriptions AS
SELECT
  us.*,
  sp.name as plan_name,
  sp.price_ngn as plan_price,
  sp.features as plan_features,
  p.full_name as user_name,
  p.email as user_email
FROM academic.user_subscriptions us
LEFT JOIN academic.subscription_plans sp ON us.plan_id = sp.id
LEFT JOIN public.profiles p ON us.user_id = p.id;

GRANT SELECT ON public.hub_subscriptions TO authenticated;

-- Bridge view for plans
DROP VIEW IF EXISTS public.hub_subscription_plans CASCADE;
CREATE OR REPLACE VIEW public.hub_subscription_plans AS
SELECT * FROM academic.subscription_plans WHERE is_active = true;

GRANT SELECT ON public.hub_subscription_plans TO authenticated;

-- 4. Seed Plans
INSERT INTO academic.subscription_plans (name, description, price_ngn, duration_days, features)
VALUES
  ('Free', 'Basic access to EduPal', 0, 0, '["browse_library", "upload_materials", "community", "profile", "notifications"]'::jsonb),
  ('Premium', 'Full access - ₦1,000/semester', 1000, 120, '["browse_library", "upload_materials", "community", "profile", "notifications", "download_files", "ai_study_tools", "leaderboard", "advanced_search", "priority_notifications", "study_analytics"]'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price_ngn = EXCLUDED.price_ngn,
  duration_days = EXCLUDED.duration_days,
  features = EXCLUDED.features;

-- 5. Helper function: Check if user has active subscription
CREATE OR REPLACE FUNCTION public.is_user_subscribed(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM academic.user_subscriptions
    WHERE user_id = p_user_id
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
