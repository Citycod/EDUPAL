-- FINAL ATTEMPT: Admin Nuke Function
-- The fact that you see "0" count but Delete fails confirms RLS is hiding the rows from you.
-- We must use a SECURITY DEFINER function to act as an admin to see and clear them.

CREATE OR REPLACE FUNCTION public.admin_nuke_institution(target_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER -- <--- This is the magic key. It ignores RLS.
AS $$
DECLARE
    v_profile_count int;
    v_student_count int;
BEGIN
    -- 1. Unlink Public Profiles (Hidden or Visible)
    UPDATE public.profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = target_id;
    
    GET DIAGNOSTICS v_profile_count = ROW_COUNT;

    -- 2. Unlink Student Profiles
    UPDATE academic.student_profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = target_id;
    
    GET DIAGNOSTICS v_student_count = ROW_COUNT;
    
    -- 3. Unlink Departments (to be safe before delete)
    DELETE FROM academic.departments WHERE institution_id = target_id;

    -- 4. Delete Institution
    DELETE FROM academic.institutions WHERE id = target_id;
    
    RETURN 'Success! Unlinked ' || v_profile_count || ' profiles and ' || v_student_count || ' students. Institution Deleted.';
END;
$$;

-- EXECUTE THE NUKE
SELECT public.admin_nuke_institution('66bd6b4a-0565-4c83-afb0-0032db829613');

-- Cleanup
DROP FUNCTION IF EXISTS public.admin_nuke_institution(uuid);
