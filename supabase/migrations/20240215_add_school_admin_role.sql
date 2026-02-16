-- Add school_admin to role check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['student'::text, 'admin'::text, 'school_admin'::text, 'super_admin'::text]));
