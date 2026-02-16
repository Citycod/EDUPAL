-- Robust fix for Profiles Role Check Constraint
-- This script drops ALL existing check constraints on the role column and adds the correct one.

DO $$
DECLARE
    r RECORD;
BEGIN
    -- Loop through all check constraints on the profiles table
    FOR r IN (
        SELECT conname
        FROM pg_constraint c
        JOIN pg_class cl ON cl.oid = c.conrelid
        JOIN pg_namespace n ON n.oid = c.connamespace
        WHERE n.nspname = 'public'
          AND cl.relname = 'profiles'
          AND c.contype = 'c'
          AND pg_get_constraintdef(c.oid) ILIKE '%role%'
    ) LOOP
        -- Drop each role-related check constraint
        EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT ' || quote_ident(r.conname);
    END LOOP;
END $$;

-- Add the new, comprehensive constraint
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['student'::text, 'admin'::text, 'school_admin'::text, 'super_admin'::text]));
