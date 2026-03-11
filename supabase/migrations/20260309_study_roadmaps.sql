-- Migration to create study_roadmaps table
CREATE TABLE IF NOT EXISTS academic.study_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES academic.resources(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    roadmap JSONB NOT NULL, -- Array of daily tasks
    last_notified_date DATE, -- The last study date they were notified about
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    -- Unique roadmap per user per resource
    UNIQUE(user_id, resource_id)
);

-- Enable RLS
ALTER TABLE academic.study_roadmaps ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own roadmaps" 
    ON academic.study_roadmaps FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roadmaps" 
    ON academic.study_roadmaps FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps" 
    ON academic.study_roadmaps FOR UPDATE 
    USING (auth.uid() = user_id);

-- Expose via view
CREATE OR REPLACE VIEW public.hub_study_roadmaps AS
SELECT * FROM academic.study_roadmaps;

ALTER VIEW public.hub_study_roadmaps OWNER TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_study_roadmaps TO authenticated;
