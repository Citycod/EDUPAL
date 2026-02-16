-- STEP 2: DELETE ONLY
-- Run this AFTER Step 1 reports success.

DO $$
DECLARE
    v_typo_id uuid := '66bd6b4a-0565-4c83-afb0-0032db829613';
    v_remaining int;
BEGIN
    -- Verify count is 0
    SELECT COUNT(*) INTO v_remaining FROM public.profiles WHERE institution_id = v_typo_id;
    
    IF v_remaining > 0 THEN
        RAISE EXCEPTION 'Stop! There are still % profiles linked. The Unlink step failed.', v_remaining;
    END IF;

    -- Trigger DELETE
    DELETE FROM academic.institutions WHERE id = v_typo_id;
    
    RAISE NOTICE 'Institution Successfully Deleted!';
END $$;
