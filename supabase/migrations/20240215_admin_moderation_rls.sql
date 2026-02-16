-- Admin Moderation RLS Policies

-- 1. Allow admins to delete resources in their institution
DROP POLICY IF EXISTS "resources_delete_admin" ON academic.resources;
CREATE POLICY "resources_delete_admin" ON academic.resources FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN academic.courses c ON c.id = academic.resources.course_id
        JOIN academic.departments d ON d.id = c.department_id
        WHERE d.institution_id = p.institution_id 
        AND p.id = auth.uid() 
        AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
);

-- 2. Allow admins to update reports (resolve/reject) in their institution
DROP POLICY IF EXISTS "reports_update_admin" ON academic.resource_reports;
CREATE POLICY "reports_update_admin" ON academic.resource_reports FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN academic.resources r ON r.id = academic.resource_reports.resource_id
        JOIN academic.courses c ON c.id = r.course_id
        JOIN academic.departments d ON d.id = c.department_id
        WHERE d.institution_id = p.institution_id 
        AND p.id = auth.uid() 
        AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN academic.resources r ON r.id = academic.resource_reports.resource_id
        JOIN academic.courses c ON c.id = r.course_id
        JOIN academic.departments d ON d.id = c.department_id
        WHERE d.institution_id = p.institution_id 
        AND p.id = auth.uid() 
        AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
);

-- 3. Allow admins to delete reports in their institution
DROP POLICY IF EXISTS "reports_delete_admin" ON academic.resource_reports;
CREATE POLICY "reports_delete_admin" ON academic.resource_reports FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN academic.resources r ON r.id = academic.resource_reports.resource_id
        JOIN academic.courses c ON c.id = r.course_id
        JOIN academic.departments d ON d.id = c.department_id
        WHERE d.institution_id = p.institution_id 
        AND p.id = auth.uid() 
        AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
);
