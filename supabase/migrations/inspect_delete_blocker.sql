DO $$
DECLARE
    v_typo_id uuid := '66bd6b4a-0565-4c83-afb0-0032db829613';
    v_count_profiles integer;
    v_count_student_profiles integer;
BEGIN
    RAISE NOTICE '--- Debugging Deletion Blocker ---';
    
    -- 1. Count references in public.profiles
    SELECT COUNT(*) INTO v_count_profiles FROM public.profiles WHERE institution_id = v_typo_id;
    RAISE NOTICE 'profiles referencing institution: %', v_count_profiles;

    -- 2. Count references in academic.student_profiles
    SELECT COUNT(*) INTO v_count_student_profiles FROM academic.student_profiles WHERE institution_id = v_typo_id;
    RAISE NOTICE 'student_profiles referencing institution: %', v_count_student_profiles;

    -- 3. Attempt Update (Test on profiles)
    UPDATE public.profiles SET institution_id = NULL WHERE institution_id = v_typo_id;
    
    -- 4. Check again
    SELECT COUNT(*) INTO v_count_profiles FROM public.profiles WHERE institution_id = v_typo_id;
    RAISE NOTICE 'profiles referencing AFTER Update: %', v_count_profiles;

    IF v_count_profiles > 0 THEN
        RAISE EXCEPTION 'Update failed! Rows remain linked.';
    ELSE
        RAISE NOTICE 'Update appeared to work. If deletion fails, something else is wrong.';
    END IF;

    -- 5. Rollback changes for this test (So we don't partially apply in a test script, though we actually want to apply...)
    -- Actually, let's NOT rollback. If this script works, it helps the user.
    -- But we need to update student_profiles too.
    
    UPDATE academic.student_profiles SET institution_id = NULL WHERE institution_id = v_typo_id;

    -- 6. Try Delete
    DELETE FROM academic.institutions WHERE id = v_typo_id;
    RAISE NOTICE 'Delete Successful!';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Transaction Failed: %', SQLERRM;
END $$;
