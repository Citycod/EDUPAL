-- FINAL FIX: Clear 'institution_id_permanent'
-- The constraint check revealed a hidden column 'institution_id_permanent' that was locking the row.
-- We must clear this column as well.

CREATE OR REPLACE FUNCTION public.admin_nuke_institution_final(target_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_profile_count int;
BEGIN
    -- Unlink Public Profiles
    -- We must match against BOTH institution_id AND institution_id_permanent to catch all links
    UPDATE public.profiles 
    SET 
        institution_id = NULL, 
        department_id = NULL,
        institution_id_permanent = NULL  -- <--- The culprit!
    WHERE institution_id = target_id 
       OR institution_id_permanent = target_id;
    
    GET DIAGNOSTICS v_profile_count = ROW_COUNT;

    -- Unlink Student Profiles (Just in case)
    UPDATE academic.student_profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = target_id;

    -- Delete Departments first (to avoid cascade issues if any)
    DELETE FROM academic.departments WHERE institution_id = target_id;

    -- Delete Institution
    DELETE FROM academic.institutions WHERE id = target_id;
    
    RETURN 'Success! Unlinked ' || v_profile_count || ' profiles (including permanent refs). Institution Deleted.';
END;
$$;

-- Run the Fix
SELECT public.admin_nuke_institution_final('66bd6b4a-0565-4c83-afb0-0032db829613');

-- Cleanup
DROP FUNCTION IF EXISTS public.admin_nuke_institution_final(uuid);
