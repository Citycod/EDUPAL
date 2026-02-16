-- STEP 1: UNLINK ONLY
-- We separate this so we can verify if the UPDATE actually "sticks" without being rolled back by a DELETE failure.

-- 1. Create the cleaner function
CREATE OR REPLACE FUNCTION public.force_unlink_institution(target_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER -- Override RLS
AS $$
DECLARE
    v_profiles_count int;
    v_student_count int;
BEGIN
    -- Count before
    SELECT COUNT(*) INTO v_profiles_count FROM public.profiles WHERE institution_id = target_id;
    
    -- Update Public Profiles
    UPDATE public.profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = target_id;
    
    -- Cleanup Department-only links
    UPDATE public.profiles
    SET department_id = NULL
    WHERE department_id IN (SELECT id FROM academic.departments WHERE institution_id = target_id);

    -- Update Student Profiles
    UPDATE academic.student_profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = target_id;
    
    RETURN 'Unlinked ' || v_profiles_count || ' profiles.';
END;
$$;

-- 2. Run it
DO $$
DECLARE
    v_typo_id uuid := '66bd6b4a-0565-4c83-afb0-0032db829613';
    v_result text;
BEGIN
    SELECT public.force_unlink_institution(v_typo_id) INTO v_result;
    RAISE NOTICE 'Result: %', v_result;
END $$;
