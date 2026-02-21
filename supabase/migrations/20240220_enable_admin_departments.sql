-- Enable Admin Upload: Allow admins to see all departments
-- 1. Ensure hub_departments view exists
CREATE OR REPLACE VIEW public.hub_departments AS
SELECT * FROM academic.departments;

GRANT SELECT ON public.hub_departments TO authenticated;

-- 2. Ensure RLS allows viewing departments based on Institution
ALTER TABLE academic.departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "view_departments_inst" ON academic.departments;
CREATE POLICY "view_departments_inst" ON academic.departments FOR SELECT USING (
  -- Allow if department belongs to user's institution (Student or Admin)
  institution_id IN (
    SELECT institution_id FROM academic.student_profiles WHERE id = auth.uid()
    UNION
    SELECT institution_id FROM public.profiles WHERE institution_id IS NOT NULL AND id = auth.uid()
    UNION
    SELECT institution_id_permanent FROM public.profiles WHERE institution_id_permanent IS NOT NULL AND id = auth.uid()
  )
);
