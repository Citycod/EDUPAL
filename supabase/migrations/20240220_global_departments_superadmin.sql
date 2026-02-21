-- Enable Global Department Access for Super Admins
-- 1. Create helper function to identify super_admins
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'super_admin'
    FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Update RLS on academic.departments
-- Relax standard institutional scoping if the user is a super_admin
ALTER TABLE academic.departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "view_departments_inst" ON academic.departments;
CREATE POLICY "view_departments_inst" ON academic.departments FOR SELECT USING (
  -- Super Admin bypass: can see everything
  public.is_super_admin()
  OR
  -- Standard Institutional scoping for students and regular admins
  institution_id IN (
    SELECT institution_id FROM academic.student_profiles WHERE id = auth.uid()
    UNION
    SELECT institution_id FROM public.profiles WHERE institution_id IS NOT NULL AND id = auth.uid()
    UNION
    SELECT institution_id_permanent FROM public.profiles WHERE institution_id_permanent IS NOT NULL AND id = auth.uid()
  )
);

-- Re-apply to academic_departments_select_inst if it's the primary policy
DROP POLICY IF EXISTS "academic_departments_select_inst" ON academic.departments;
CREATE POLICY "academic_departments_select_inst" ON academic.departments FOR SELECT USING (
  public.is_super_admin()
  OR
  EXISTS (
    SELECT 1 FROM academic.student_profiles sp 
    WHERE sp.institution_id = academic.departments.institution_id AND sp.id = auth.uid()
  )
);
