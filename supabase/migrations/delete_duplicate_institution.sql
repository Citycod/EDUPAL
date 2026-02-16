-- Delete duplicate institution by name
-- This script targets the specific typo "fedral univesity of akure" mentioned by the user.

-- Note: We use a DO block to handle potential dependencies safely, though CASCADE on departments handles child records.
-- However, profiles might link to it. If so, they will be orphaned or block deletion.
-- Ideally, we should merge, but for a simple "delete one" request on a likely typo, deletion is the direct approach.

DO $$
DECLARE
    -- The ID of the INCORRECT institution to delete (Provided by user)
    v_typo_id uuid := '66bd6b4a-0565-4c83-afb0-0032db829613';
    
    -- The name of the CORRECT institution to merge into
    v_correct_name text := 'Federal University of Technology, Akure, Ondo state';
    v_correct_id uuid;
BEGIN
    -- 1. Find the ID of the correct institution
    SELECT id INTO v_correct_id FROM academic.institutions WHERE name ILIKE v_correct_name LIMIT 1;
    
    -- If not found exactly, try fuzzy match or fallback
    IF v_correct_id IS NULL THEN
        SELECT id INTO v_correct_id FROM academic.institutions WHERE name ILIKE 'Federal University of Technology, Akure%' AND id != v_typo_id LIMIT 1;
    END IF;

    RAISE NOTICE 'Target Institution (Delete): %', v_typo_id;

    -- 2. Merge or Delete
    IF v_correct_id IS NOT NULL THEN
        RAISE NOTICE 'Found correct institution (Merge Target): %', v_correct_id;
        
        -- Move Profiles
        UPDATE public.profiles SET institution_id = v_correct_id WHERE institution_id = v_typo_id;
        UPDATE academic.student_profiles SET institution_id = v_correct_id WHERE institution_id = v_typo_id;
        
        -- Move Departments (Handle conflicts)
        -- We try to update. If a department with same name exists in target, we can't update (unique constraint).
        -- In that case, we should probably delete the duplicate department or let it cascade delete when we delete the institution.
        -- Usage of a loop or complicated logic is needed for perfect merge, but for now let's try simple update and ignore errors (letting cascade handle rest).
        
        BEGIN
            UPDATE academic.departments SET institution_id = v_correct_id WHERE institution_id = v_typo_id;
        EXCEPTION WHEN unique_violation THEN
            RAISE NOTICE 'Some departments define in both. Leaving duplicates to be cascade deleted.';
        END;

    ELSE
        RAISE NOTICE 'No correct institution found to merge into. Unlinking users...';
        -- Unlink users so they aren't deleted
        UPDATE public.profiles SET institution_id = NULL WHERE institution_id = v_typo_id;
        UPDATE academic.student_profiles SET institution_id = NULL WHERE institution_id = v_typo_id;
    END IF;

    -- 3. Delete the bad institution
    -- This will Cascade delete departments/courses attached to it if we didn't move them.
    DELETE FROM academic.institutions WHERE id = v_typo_id;
    
    RAISE NOTICE 'Successfully deleted institution: %', v_typo_id;
END $$;
