-- 1. Allow 'notes' as a valid content type in the check constraint
ALTER TABLE academic.ai_quizzes DROP CONSTRAINT IF EXISTS ai_quizzes_type_check;
ALTER TABLE academic.ai_quizzes ADD CONSTRAINT ai_quizzes_type_check CHECK (type IN ('flashcards', 'quiz', 'notes'));

-- 2. Ensure everything else is correctly set up from the previous step
DROP VIEW IF EXISTS public.hub_ai_quizzes;
ALTER TABLE academic.ai_quizzes ALTER COLUMN resource_id DROP NOT NULL;
ALTER TABLE academic.ai_quizzes ADD COLUMN IF NOT EXISTS catalog_course_code TEXT;

CREATE OR REPLACE VIEW public.hub_ai_quizzes AS
SELECT id, resource_id, catalog_course_code, type, content, generated_at
FROM academic.ai_quizzes;

ALTER VIEW public.hub_ai_quizzes OWNER TO postgres;
CREATE INDEX IF NOT EXISTS idx_hub_ai_quizzes_catalog_code ON academic.ai_quizzes(catalog_course_code);
