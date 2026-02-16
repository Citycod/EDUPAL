DO $$
DECLARE
    v_typo_id uuid := '66bd6b4a-0565-4c83-afb0-0032db829613';
BEGIN
    RAISE NOTICE 'Starting Surgical Cleanup for ID: %', v_typo_id;

    -- 1. Disable USER Triggers only
    -- This bypasses the custom "sync" trigger that is likely failing due to permissions,
    -- but leaves System triggers (like Foreign Keys) active/safe.
    ALTER TABLE public.profiles DISABLE TRIGGER USER;
    ALTER TABLE academic.student_profiles DISABLE TRIGGER USER;

    -- 2. Unlink Public Profiles
    -- We set to NULL so Foreign Key constraints are satisfied.
    UPDATE public.profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = v_typo_id;
    
    -- Safety catch for department-only links
    UPDATE public.profiles
    SET department_id = NULL
    WHERE department_id IN (SELECT id FROM academic.departments WHERE institution_id = v_typo_id);

    -- 3. Unlink Student Profiles
    UPDATE academic.student_profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = v_typo_id;

    -- 4. Delete the Institution
    -- Unlinked rows won't block this now.
    DELETE FROM academic.institutions WHERE id = v_typo_id;

    -- 5. Re-enable USER Triggers
    ALTER TABLE public.profiles ENABLE TRIGGER USER;
    ALTER TABLE academic.student_profiles ENABLE TRIGGER USER;

    RAISE NOTICE 'Successfully deleted institution via Surgical Option.';
EXCEPTION WHEN OTHERS THEN
    -- Ensure triggers come back online if error
    ALTER TABLE public.profiles ENABLE TRIGGER USER;
    ALTER TABLE academic.student_profiles ENABLE TRIGGER USER;
    RAISE;
END $$;
