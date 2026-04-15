-- =============================================
-- EduPal PWA Push Subscriptions (Multi-device)
-- =============================================

CREATE TABLE IF NOT EXISTS academic.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription JSONB NOT NULL,
    -- Extract endpoint for multi-device uniqueness
    endpoint TEXT GENERATED ALWAYS AS (subscription->>'endpoint') STORED,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Allow one record per device per user
    UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE academic.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON academic.push_subscriptions;
CREATE POLICY "Users can manage their own subscriptions" 
    ON academic.push_subscriptions FOR ALL
    USING (auth.uid() = user_id);

-- View with security invoker for safe API/Frontend access
CREATE OR REPLACE VIEW public.hub_push_subscriptions
WITH (security_invoker = true) AS
SELECT * FROM academic.push_subscriptions;

ALTER VIEW public.hub_push_subscriptions OWNER TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_push_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_push_subscriptions TO service_role;
