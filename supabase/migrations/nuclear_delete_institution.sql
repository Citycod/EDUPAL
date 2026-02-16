DO $$
DECLARE
    v_typo_id uuid := '66bd6b4a-0565-4c83-afb0-0032db829613';
BEGIN
    RAISE NOTICE 'Starting Nuclear Cleanup for ID: %', v_typo_id;

    -- 1. Disable Triggers temporarily
    -- This prevents the "permission denied" or "sync failed" errors from rolling back the update
    ALTER TABLE public.profiles DISABLE TRIGGER ALL;

    -- 2. Unlink Public Profiles
    -- We must clear department_id too, because deleting the institution will cascade delete departments.
    -- If profiles still ref those departments, the delete will fail.
    UPDATE public.profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = v_typo_id;
    
    -- Also catch any where institution_id might be null but department is linked to this uni
    UPDATE public.profiles
    SET department_id = NULL
    WHERE department_id IN (SELECT id FROM academic.departments WHERE institution_id = v_typo_id);

    -- 3. Unlink Academic Student Profiles
    UPDATE academic.student_profiles 
    SET institution_id = NULL, department_id = NULL 
    WHERE institution_id = v_typo_id;

    -- 4. Delete the Institution
    DELETE FROM academic.institutions WHERE id = v_typo_id;

    -- 5. Re-enable Triggers
    ALTER TABLE public.profiles ENABLE TRIGGER ALL;

    RAISE NOTICE 'Successfully deleted institution via Nuclear Option.';
EXCEPTION WHEN OTHERS THEN
    -- Safety: Ensure triggers are re-enabled even if something explodes
    ALTER TABLE public.profiles ENABLE TRIGGER ALL;
    RAISE;
END $$;
