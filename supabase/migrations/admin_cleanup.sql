-- Create a Security Definer function to bypass RLS
-- This function runs with the privileges of the creator (postgres/admin), allowing it to see and update ALL rows.

CREATE OR REPLACE FUNCTION public.admin_force_cleanup_institution(target_uni_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count int;
BEGIN
    RAISE NOTICE 'Admin Cleanup started for: %', target_uni_id;
    
    -- Check how many actually exist (visible to admin)
    SELECT COUNT(*) INTO v_count FROM public.profiles WHERE institution_id = target_uni_id;
    RAISE NOTICE 'Found % profiles linked (Admin View).', v_count;

    -- Unlink Profiles
    UPDATE public.profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = target_uni_id;
    
    -- Unlink Student Profiles
    UPDATE academic.student_profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = target_uni_id;
    
    RAISE NOTICE 'Unlinked profiles.';
END;
$$;

-- Run the cleanup using the function
DO $$
DECLARE
    v_typo_id uuid := '66bd6b4a-0565-4c83-afb0-0032db829613';
BEGIN
    -- 1. Call the admin function
    PERFORM public.admin_force_cleanup_institution(v_typo_id);
    
    -- 2. Delete the institution (Now that rows are largely gone)
    DELETE FROM academic.institutions WHERE id = v_typo_id;
    
    RAISE NOTICE 'Institution deleted successfully.';
END $$;

-- Drop detection function
DROP FUNCTION IF EXISTS public.admin_force_cleanup_institution(uuid);
