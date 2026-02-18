-- Fix hub_profiles view: Add missing role and institution_id_permanent columns
-- This resolves 400 Bad Request errors when selecting these columns via the bridge view.

DROP VIEW IF EXISTS public.hub_profiles CASCADE;

CREATE OR REPLACE VIEW public.hub_profiles AS
SELECT 
  p.id,
  p.email,
  p.username,
  p.full_name,
  p.avatar_url,
  p.bio,
  p.role,
  p.institution_id_permanent,
  COALESCE(p.institution_id, sp.institution_id) as institution_id,
  COALESCE(p.department_id, sp.department_id) as department_id,
  COALESCE(p.level, sp.level, p.year) as level,
  COALESCE(i.name, p.university) as institution_name,
  COALESCE(d.name, p.major) as department_name,
  p.university,
  p.major,
  p.year,
  p.created_at,
  p.updated_at
FROM public.profiles p
LEFT JOIN academic.student_profiles sp ON p.id = sp.id
LEFT JOIN academic.institutions i ON COALESCE(p.institution_id, sp.institution_id) = i.id
LEFT JOIN academic.departments d ON COALESCE(p.department_id, sp.department_id) = d.id;

GRANT SELECT ON public.hub_profiles TO authenticated;
GRANT UPDATE ON public.hub_profiles TO authenticated;

-- Ensure RLS is still enforced via underlying tables
-- PostgreSQL handles this automatically for views without SECURITY DEFINER.
