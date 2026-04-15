-- =============================================
-- EduPal Daily Question Cache
-- =============================================

CREATE TABLE IF NOT EXISTS academic.daily_question_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_date DATE NOT NULL,
    question_data JSONB NOT NULL,
    _secure_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(user_id, question_date)
);

-- Enable RLS
ALTER TABLE academic.daily_question_cache ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own question cache" 
    ON academic.daily_question_cache FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own question cache" 
    ON academic.daily_question_cache FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- View for security invoker consistency
CREATE OR REPLACE VIEW public.hub_daily_question_cache
WITH (security_invoker = true) AS
SELECT * FROM academic.daily_question_cache;

ALTER VIEW public.hub_daily_question_cache OWNER TO postgres;
GRANT SELECT, INSERT ON public.hub_daily_question_cache TO authenticated;
GRANT SELECT, INSERT ON public.hub_daily_question_cache TO service_role;
