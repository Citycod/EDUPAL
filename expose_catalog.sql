-- Migration: Expose Catalog through Public Views
-- This fixes the 'Invalid schema: catalog' (PGRST106) error by allowing access via the 'public' schema.

-- 1. Create views in the public schema
CREATE OR REPLACE VIEW public.national_programs_view AS SELECT * FROM catalog.national_programs;
CREATE OR REPLACE VIEW public.national_courses_view AS SELECT * FROM catalog.national_courses;
CREATE OR REPLACE VIEW public.national_topics_view AS SELECT * FROM catalog.national_topics;

-- 2. Grant access to authenticated users (and anon if you want it public)
GRANT SELECT ON public.national_programs_view TO authenticated, anon;
GRANT SELECT ON public.national_courses_view TO authenticated, anon;
GRANT SELECT ON public.national_topics_view TO authenticated, anon;

-- Note: In the API code, we will now query 'national_courses_view' from the default schema.
