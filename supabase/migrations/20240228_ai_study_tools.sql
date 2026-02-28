-- AI Study Tools Schema

-- Table to store AI-generated content (Quizzes and Flashcards) for a specific resource
CREATE TABLE IF NOT EXISTS academic.ai_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES academic.resources(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('flashcards', 'quiz')),
    content JSONB NOT NULL, -- The actual array of questions/answers
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    -- Ensure we only have one cached copy of a specific type per resource
    UNIQUE(resource_id, type)
);

-- Give public schema access via a view
CREATE OR REPLACE VIEW public.hub_ai_quizzes AS
SELECT 
    id,
    resource_id,
    type,
    content,
    generated_at
FROM academic.ai_quizzes;

-- RLS Policies for the view
ALTER VIEW public.hub_ai_quizzes OWNER TO postgres;

-- Table to track user scores on these quizzes
CREATE TABLE IF NOT EXISTS academic.user_quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES academic.ai_quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Give public schema access via a view
CREATE OR REPLACE VIEW public.hub_user_quiz_results AS
SELECT 
    id,
    user_id,
    quiz_id,
    score,
    total_questions,
    completed_at
FROM academic.user_quiz_results;

ALTER VIEW public.hub_user_quiz_results OWNER TO postgres;

-- Enable RLS on tracking table
ALTER TABLE academic.user_quiz_results ENABLE ROW LEVEL SECURITY;

-- Users can only see their own results
CREATE POLICY "Users can view their own quiz results" 
    ON academic.user_quiz_results 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results" 
    ON academic.user_quiz_results 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Expose via RPC if needed (Optional, view might be enough)
