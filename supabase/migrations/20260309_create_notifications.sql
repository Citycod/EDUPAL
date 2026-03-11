-- Migration to create the notifications table for in-app alerts

-- 1. Create notifications table in academic schema
CREATE TABLE IF NOT EXISTS academic.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('course', 'class', 'community', 'system', 'subscription')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE academic.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
DROP POLICY IF EXISTS "Users can manage their own notifications" ON academic.notifications;
CREATE POLICY "Users can manage their own notifications" 
    ON academic.notifications FOR ALL 
    USING (auth.uid() = user_id);

-- 4. Create public view for frontend access
-- Drop the existing TABLE first (IF EXISTS won't help if the type is wrong)
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP VIEW IF EXISTS public.notifications CASCADE;

CREATE OR REPLACE VIEW public.notifications AS 
SELECT * FROM academic.notifications;

-- 5. Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON academic.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON academic.notifications(created_at DESC);
