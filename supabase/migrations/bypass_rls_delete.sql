DO $$
DECLARE
    v_typo_id uuid := '66bd6b4a-0565-4c83-afb0-0032db829613';
BEGIN
    RAISE NOTICE 'Starting Cleanup with RLS Bypass for ID: %', v_typo_id;

    -- 1. Temporarily Disable RLS
    -- This ensures we can see and update ALL rows, not just the ones visible to the current user.
    ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
    ALTER TABLE academic.student_profiles DISABLE ROW LEVEL SECURITY;

    -- 2. Unlink Public Profiles (Institution AND Department)
    -- We must clear department links too because deleting the Uni will delete departments,
    -- and if profiles invoke departments, that delete is blocked.
    UPDATE public.profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = v_typo_id;
    
    -- Catch profiles linked only by department to this Uni
    UPDATE public.profiles
    SET department_id = NULL
    WHERE department_id IN (SELECT id FROM academic.departments WHERE institution_id = v_typo_id);

    -- 3. Unlink Student Profiles
    UPDATE academic.student_profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = v_typo_id;

    -- 4. Delete the Institution
    DELETE FROM academic.institutions WHERE id = v_typo_id;

    -- 5. Re-enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE academic.student_profiles ENABLE ROW LEVEL SECURITY;

    RAISE NOTICE 'Successfully deleted institution (RLS Bypassed).';
EXCEPTION WHEN OTHERS THEN
    -- Safety: Re-enable RLS if error
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE academic.student_profiles ENABLE ROW LEVEL SECURITY;
    RAISE;
END $$;
