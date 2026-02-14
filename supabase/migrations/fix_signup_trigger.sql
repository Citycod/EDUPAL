-- Ensure Schema Exists
CREATE SCHEMA IF NOT EXISTS academic;

-- Ensure Institutions Table Exists
CREATE TABLE IF NOT EXISTS academic.institutions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  location text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Ensure Departments Table Exists
CREATE TABLE IF NOT EXISTS academic.departments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  institution_id uuid REFERENCES academic.institutions(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(name, institution_id)
);

-- Ensure Profiles Exists (Public)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  institution_id uuid REFERENCES academic.institutions(id),
  department_id uuid REFERENCES academic.departments(id),
  level text,
  university text,
  major text,
  year text,
  bio text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROBUST Handle New User Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_inst_id uuid;
  v_dept_id uuid;
  v_univ_name text;
  v_dept_name text;
  v_level text;
BEGIN
  -- Wrap in block to catch errors and prevent signup failure
  BEGIN
      -- 1. Extract metadata from signup
      v_univ_name := NULLIF(NEW.raw_user_meta_data->>'university', '');
      v_dept_name := NULLIF(NEW.raw_user_meta_data->>'major', '');
      v_level := NULLIF(NEW.raw_user_meta_data->>'year', '');
    
      -- 2. Handle Institution
      IF v_univ_name IS NOT NULL THEN
        INSERT INTO academic.institutions (name)
        VALUES (v_univ_name)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id INTO v_inst_id;
      END IF;
    
      -- 3. Handle Department
      IF v_dept_name IS NOT NULL AND v_inst_id IS NOT NULL THEN
        INSERT INTO academic.departments (name, institution_id)
        VALUES (v_dept_name, v_inst_id)
        ON CONFLICT (name, institution_id) DO UPDATE SET name = EXCLUDED.name
        RETURNING id INTO v_dept_id;
      END IF;
    
      -- 4. Create Profile
      INSERT INTO public.profiles (id, email, full_name, institution_id, department_id, level, university, major, year)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
        v_inst_id,
        v_dept_id,
        COALESCE(v_level, NEW.raw_user_meta_data->>'year'),
        v_univ_name,
        v_dept_name,
        v_level
      );
  EXCEPTION WHEN OTHERS THEN
      -- Log error (visible in Supabase logs) but DO NOT fail the transaction
      RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
      -- Attempt basic profile creation as fallback
      BEGIN
        INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Fatal error creating fallback profile: %', SQLERRM;
      END;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
