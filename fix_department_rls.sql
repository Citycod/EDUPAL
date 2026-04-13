-- Migration: Enable Public Department Lookup
-- This allows unauthenticated users (like those on the signup page) to see the list of departments for any university.

BEGIN;

-- 1. Add public select policy to academic.departments
DROP POLICY IF EXISTS "academic_departments_select_public" ON academic.departments;
CREATE POLICY "academic_departments_select_public" ON academic.departments 
FOR SELECT USING (true);

-- 2. Ensure hub_departments view is accessible to anon users
-- First check if it needs to be recreated or just granted
GRANT SELECT ON public.hub_departments TO authenticated, anon;

COMMIT;
