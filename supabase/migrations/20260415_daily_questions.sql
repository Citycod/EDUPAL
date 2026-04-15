-- =============================================
-- EduPal Daily Question & Streaks Tracker
-- =============================================

CREATE TABLE IF NOT EXISTS academic.daily_question_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answered_date DATE NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL,
    user_answer CHAR(1) NOT NULL,
    earned_points INT NOT NULL DEFAULT 0,
    current_streak INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    -- Ensure user can only answer once per day (according to the DB date context)
    UNIQUE(user_id, answered_date)
);

-- Enable RLS
ALTER TABLE academic.daily_question_logs ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own question logs" ON academic.daily_question_logs;
CREATE POLICY "Users can view their own question logs" 
    ON academic.daily_question_logs FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own question logs" ON academic.daily_question_logs;
CREATE POLICY "Users can insert their own question logs" 
    ON academic.daily_question_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Expose via view to simplify frontend/api direct calls if needed securely
CREATE OR REPLACE VIEW public.hub_daily_question_logs
WITH (security_invoker = true) AS
SELECT * FROM academic.daily_question_logs;

ALTER VIEW public.hub_daily_question_logs OWNER TO postgres;
GRANT SELECT, INSERT ON public.hub_daily_question_logs TO authenticated;
GRANT SELECT, INSERT ON public.hub_daily_question_logs TO service_role;
