-- Migration to support study progress tracking and push notifications

-- Table for tracking progress on roadmap tasks
CREATE TABLE IF NOT EXISTS academic.study_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES academic.resources(id) ON DELETE CASCADE,
    roadmap_date DATE NOT NULL,
    completed_tasks TEXT[] DEFAULT '{}',
    is_fully_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    -- Unique progress entry per day per resource
    UNIQUE(user_id, resource_id, roadmap_date)
);

-- Table for storing Web Push subscriptions
CREATE TABLE IF NOT EXISTS academic.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    subscription_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE academic.study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for study_progress
CREATE POLICY "Users can view their own progress" 
    ON academic.study_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
    ON academic.study_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
    ON academic.study_progress FOR UPDATE 
    USING (auth.uid() = user_id);

-- Policies for push_subscriptions
CREATE POLICY "Users can manage their own subscriptions" 
    ON academic.push_subscriptions FOR ALL 
    USING (auth.uid() = user_id);

-- Views for public schema access
CREATE OR REPLACE VIEW public.hub_study_progress AS SELECT * FROM academic.study_progress;
CREATE OR REPLACE VIEW public.hub_push_subscriptions AS SELECT * FROM academic.push_subscriptions;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_study_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_push_subscriptions TO authenticated;
