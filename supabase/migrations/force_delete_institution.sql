DO $$
DECLARE
    -- The ID of the INCORRECT institution to delete
    v_typo_id uuid := '66bd6b4a-0565-4c83-afb0-0032db829613';
    
    -- The name of the CORRECT institution to merge into
    v_correct_name text := 'Federal University of Technology, Akure, Ondo state';
    v_correct_id uuid;
BEGIN
    RAISE NOTICE 'Starting cleanup for Institution ID: %', v_typo_id;

    -- 1. Find correct institution to merge into (Optional)
    SELECT id INTO v_correct_id FROM academic.institutions WHERE name ILIKE v_correct_name LIMIT 1;
    
    -- Fallback search
    IF v_correct_id IS NULL THEN
        SELECT id INTO v_correct_id FROM academic.institutions WHERE name ILIKE 'Federal University of Technology, Akure%' AND id != v_typo_id LIMIT 1;
    END IF;

    IF v_correct_id IS NOT NULL THEN
        RAISE NOTICE 'Merging into Correct Institution ID: %', v_correct_id;
        
        -- A. Move Profiles (Ignore conflicts/constraints if any, just force update)
        -- We update one by one or in bulk.
        UPDATE public.profiles 
        SET institution_id = v_correct_id 
        WHERE institution_id = v_typo_id;
        
        UPDATE academic.student_profiles 
        SET institution_id = v_correct_id 
        WHERE institution_id = v_typo_id;
        
        -- B. Move Departments (Handle conflicts aggressively)
        -- If a department exists in both, we can't merge cleanly without complex logic. 
        -- So we DELETE the duplicate departments attached to the typo institution,
        -- assuming the correct institution already has them or will create them.
        BEGIN
            UPDATE academic.departments 
            SET institution_id = v_correct_id 
            WHERE institution_id = v_typo_id;
        EXCEPTION WHEN unique_violation THEN
            RAISE NOTICE 'Duplicate departments detected. Deleting departments attached to typo institution...';
            DELETE FROM academic.departments WHERE institution_id = v_typo_id;
        END;
        
    ELSE
        RAISE NOTICE 'No correct institution found. Unlinking all users...';
        -- Just set to NULL
        UPDATE public.profiles SET institution_id = NULL WHERE institution_id = v_typo_id;
        UPDATE academic.student_profiles SET institution_id = NULL WHERE institution_id = v_typo_id;
    END IF;

    -- 2. FORCE CLEANUP of any remaining references in profiles
    -- This handles cases where the merge might have missed something or failed silently
    UPDATE public.profiles SET institution_id = NULL WHERE institution_id = v_typo_id;
    UPDATE academic.student_profiles SET institution_id = NULL WHERE institution_id = v_typo_id;

    -- 3. Delete the bad institution
    DELETE FROM academic.institutions WHERE id = v_typo_id;
    
    RAISE NOTICE 'Successfully deleted institution: %', v_typo_id;
END $$;
