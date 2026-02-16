DO $$
DECLARE
    v_typo_id uuid := '66bd6b4a-0565-4c83-afb0-0032db829613';
    v_count int;
    v_null_check record;
BEGIN
    RAISE NOTICE '--- INSPECTING STUBBORN ROWS ---';

    -- 1. Count actual references
    SELECT COUNT(*) INTO v_count FROM public.profiles WHERE institution_id = v_typo_id;
    RAISE NOTICE 'Rows still pointing to duplicate: %', v_count;

    -- 2. Check if the column allows NULLS
    SELECT is_nullable INTO v_null_check 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'institution_id';
    
    RAISE NOTICE 'Is institution_id nullable? %', v_null_check.is_nullable;

    -- 3. Show a sample ID (if any)
    IF v_count > 0 THEN
        FOR v_null_check IN SELECT id, email FROM public.profiles WHERE institution_id = v_typo_id LIMIT 3 LOOP
            RAISE NOTICE 'Sample Stubborn User: % (%)', v_null_check.id, v_null_check.email;
        END LOOP;
    END IF;

    -- 4. Try a test update on ONE row to see the exact error message if it fails
    -- We use a separate block to catch the error
    IF v_count > 0 THEN
        BEGIN
            RAISE NOTICE 'Attempting test unlink on one row...';
            UPDATE public.profiles 
            SET institution_id = NULL 
            WHERE institution_id = v_typo_id 
            LIMIT 1; -- Note: LIMIT not standard in UPDATE in Postgres, using CTID approach usually, but let's try standard WHERE matches
            
            -- Postgres UPDATE doesn't support LIMIT directly, so we target one specific ID found above
             UPDATE public.profiles 
            SET institution_id = NULL 
            WHERE id = (SELECT id FROM public.profiles WHERE institution_id = v_typo_id LIMIT 1);
            
            RAISE NOTICE 'Test unlink successful (Transaction will rollback check).';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'TEST UPDATE FAILED: %', SQLERRM;
        END;
    END IF;

END $$;
