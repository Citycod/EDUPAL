-- INSPECT SCHEMA
-- This lists all Triggers and Constraints on public.profiles to see if something is blocking updates.

RAISE NOTICE '--- TRIGGERS on public.profiles ---';
SELECT 
    trigger_name, 
    event_manipulation, 
    action_timing, 
    action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'profiles'
AND event_object_schema = 'public';

RAISE NOTICE '--- CONSTRAINTS on public.profiles ---';
SELECT 
    conname as constraint_name, 
    contype as constraint_type, 
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.profiles'::regclass;
