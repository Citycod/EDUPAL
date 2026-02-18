-- Add 'level' column from courses to hub_resources view
-- This allows server-side filtering by level in the library page

DROP VIEW IF EXISTS public.hub_resources CASCADE;
CREATE OR REPLACE VIEW public.hub_resources AS
SELECT 
  r.*,
  p.full_name as uploader_name,
  p.avatar_url as uploader_avatar,
  c.course_code,
  c.title as course_title,
  c.department_id,
  c.level,
  s.name as session_name,
  COALESCE(r.is_verified, false) as is_verified_status
FROM academic.resources r
LEFT JOIN public.profiles p ON r.uploader_id = p.id
LEFT JOIN academic.courses c ON r.course_id = c.id
LEFT JOIN academic.departments d ON c.department_id = d.id
LEFT JOIN academic.academic_sessions s ON r.session_id = s.id;

GRANT SELECT ON public.hub_resources TO authenticated;

-- Re-attach the insertion trigger (dropping a view removes its triggers)
DROP TRIGGER IF EXISTS on_hub_resources_insert ON public.hub_resources;
CREATE TRIGGER on_hub_resources_insert
INSTEAD OF INSERT ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.insert_hub_resources();
