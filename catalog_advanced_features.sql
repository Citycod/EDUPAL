-- 1. Drop existing view to avoid dependency issues
DROP VIEW IF EXISTS public.hub_study_roadmaps;

-- 2. Alter academic.study_roadmaps to support catalog courses and missing columns
ALTER TABLE academic.study_roadmaps ALTER COLUMN resource_id DROP NOT NULL;
ALTER TABLE academic.study_roadmaps ADD COLUMN IF NOT EXISTS catalog_course_code TEXT;
ALTER TABLE academic.study_roadmaps ADD COLUMN IF NOT EXISTS last_notified_date DATE;

-- 3. Re-create the public view with ALL columns
CREATE OR REPLACE VIEW public.hub_study_roadmaps AS
SELECT 
    id,
    user_id,
    resource_id,
    catalog_course_code,
    exam_date,
    roadmap,
    last_notified_date,
    created_at,
    updated_at
FROM academic.study_roadmaps;

-- 4. Re-apply permissions
ALTER VIEW public.hub_study_roadmaps OWNER TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_study_roadmaps TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_study_roadmaps TO service_role;

-- 5. Unique constraint for catalog-based roadmaps per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_catalog_roadmap ON academic.study_roadmaps (user_id, catalog_course_code) WHERE resource_id IS NULL;
