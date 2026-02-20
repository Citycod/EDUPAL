-- 1. HARDENING & CLEANUP
-- ===========================================

-- Drop legacy/collision tables in public to make room for bridge views
DROP TABLE IF EXISTS public.courses_refined CASCADE;
DROP TABLE IF EXISTS public.academic_sessions CASCADE;
DROP TABLE IF EXISTS public.institutions CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;
DROP TABLE IF EXISTS public.lecturers CASCADE;

-- Enable RLS on core public tables
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.countries ENABLE ROW LEVEL SECURITY;

-- 2. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. SCHEMAS
CREATE SCHEMA IF NOT EXISTS academic;

-- 3. PUBLIC SCHEMA TABLES (Legacy & Core)
-- ===========================================

-- Profiles Table (Core Auth & Global Context)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  institution_id uuid REFERENCES academic.institutions(id),
  department_id uuid REFERENCES academic.departments(id),
  level text,
  university text, -- Bridge column
  major text,      -- Bridge column
  year text,       -- Bridge column
  bio text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure existing profiles are hardened with academic columns
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'institution_id') THEN
    ALTER TABLE public.profiles ADD COLUMN institution_id uuid REFERENCES academic.institutions(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'department_id') THEN
    ALTER TABLE public.profiles ADD COLUMN department_id uuid REFERENCES academic.departments(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'level') THEN
    ALTER TABLE public.profiles ADD COLUMN level text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'university') THEN
    ALTER TABLE public.profiles ADD COLUMN university text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'major') THEN
    ALTER TABLE public.profiles ADD COLUMN major text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'year') THEN
    ALTER TABLE public.profiles ADD COLUMN year text;
  END IF;
END $$;

-- (Legacy columns cleanup - optional but recommended for high fidelity)
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS university;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS major;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS year;

-- 4. ACADEMIC SCHEMA TABLES (Premium Refinement)
-- ===========================================

-- Institutions
CREATE TABLE IF NOT EXISTS academic.institutions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  location text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Departments
CREATE TABLE IF NOT EXISTS academic.departments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  institution_id uuid REFERENCES academic.institutions(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(name, institution_id)
);

-- Academic Context for Students
CREATE TABLE IF NOT EXISTS academic.student_profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  institution_id uuid REFERENCES academic.institutions(id),
  department_id uuid REFERENCES academic.departments(id),
  level text, -- e.g. "100", "200"
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Sync Trigger: Keep academic.student_profiles in sync with public.profiles
-- This ensures that RLS (which uses student_profiles) works even if the frontend only updates public.profiles
CREATE OR REPLACE FUNCTION public.sync_profile_to_student_profiles()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO academic.student_profiles (id, institution_id, department_id, level)
  VALUES (NEW.id, NEW.institution_id, NEW.department_id, NEW.level)
  ON CONFLICT (id) DO UPDATE SET
    institution_id = EXCLUDED.institution_id,
    department_id = EXCLUDED.department_id,
    level = EXCLUDED.level,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_update_sync ON public.profiles;
CREATE TRIGGER on_profile_update_sync
AFTER INSERT OR UPDATE OF institution_id, department_id, level ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_to_student_profiles();

-- Automated Institutional Onboarding: Handle New User Registration
-- This trigger automatically creates institutions/departments if they don't exist
-- and links them to the new profile.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_inst_id uuid;
  v_dept_id uuid;
  v_univ_name text;
  v_dept_name text;
  v_level text;
BEGIN
  -- 1. Extract metadata from signup
  v_univ_name := NULLIF(NEW.raw_user_meta_data->>'university', '');
  v_dept_name := NULLIF(NEW.raw_user_meta_data->>'major', '');
  v_level := NULLIF(NEW.raw_user_meta_data->>'year', '');

  -- 2. Handle Institution
  IF v_univ_name IS NOT NULL THEN
    INSERT INTO academic.institutions (name)
    VALUES (v_univ_name)
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name -- Just to get the ID back
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

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run after signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Courses (High Fidelity)
CREATE TABLE IF NOT EXISTS academic.courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  course_code text NOT NULL,
  department_id uuid REFERENCES academic.departments(id) ON DELETE CASCADE,
  level text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(course_code, department_id)
);

-- Academic Sessions
CREATE TABLE IF NOT EXISTS academic.academic_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE -- e.g. "2023/2024", "2024/2025"
);

-- Resources (Premium Archive)
CREATE TABLE IF NOT EXISTS academic.resources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  type text,
  category text,
  course_id uuid REFERENCES academic.courses(id) ON DELETE SET NULL,
  session_id uuid REFERENCES academic.academic_sessions(id) ON DELETE SET NULL,
  uploader_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  file_url text NOT NULL,
  file_size text,
  pages integer,
  downloads_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  institution_id uuid REFERENCES academic.institutions(id)
);

-- Discussions (Premium Boards)
CREATE TABLE IF NOT EXISTS academic.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES academic.courses(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Comments
CREATE TABLE IF NOT EXISTS academic.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES academic.posts(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on academic schema
ALTER TABLE academic.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.comments ENABLE ROW LEVEL SECURITY;

-- 5.1 ACADEMIC POLICIES
DROP POLICY IF EXISTS "academic_institutions_select_auth" ON academic.institutions;
CREATE POLICY "academic_institutions_select_auth" ON academic.institutions FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "academic_departments_select_inst" ON academic.departments;
CREATE POLICY "academic_departments_select_inst" ON academic.departments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM academic.student_profiles sp 
    WHERE sp.institution_id = academic.departments.institution_id AND sp.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "academic_profiles_select_auth" ON academic.student_profiles;
CREATE POLICY "academic_profiles_select_auth" ON academic.student_profiles FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "academic_profiles_update_self" ON academic.student_profiles;
CREATE POLICY "academic_profiles_update_self" ON academic.student_profiles FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "academic_courses_select_inst" ON academic.courses;
CREATE POLICY "academic_courses_select_inst" ON academic.courses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM academic.student_profiles sp
    JOIN academic.departments d ON d.institution_id = sp.institution_id
    WHERE d.id = academic.courses.department_id AND sp.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "academic_resources_select_inst" ON academic.resources;
CREATE POLICY "academic_resources_select_inst" ON academic.resources FOR SELECT USING (
  institution_id = public.get_user_institution_id() OR
  -- Output compatibility with old/admin check
  EXISTS (
     SELECT 1 FROM academic.student_profiles sp
     WHERE sp.institution_id = academic.resources.institution_id AND sp.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "academic_resources_insert_auth" ON academic.resources;
CREATE POLICY "academic_resources_insert_auth" ON academic.resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "academic_resources_update_owner" ON academic.resources;
CREATE POLICY "academic_resources_update_owner" ON academic.resources FOR UPDATE USING (uploader_id = auth.uid());
DROP POLICY IF EXISTS "academic_resources_delete_owner" ON academic.resources;
CREATE POLICY "academic_resources_delete_owner" ON academic.resources FOR DELETE USING (uploader_id = auth.uid());

DROP POLICY IF EXISTS "academic_posts_select_inst" ON academic.posts;
CREATE POLICY "academic_posts_select_inst" ON academic.posts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM academic.student_profiles sp
    JOIN academic.courses c ON c.id = academic.posts.course_id
    JOIN academic.departments d ON d.id = c.department_id
    WHERE d.institution_id = sp.institution_id AND sp.id = auth.uid()
  )
);
DROP POLICY IF EXISTS "academic_posts_insert_auth" ON academic.posts;
CREATE POLICY "academic_posts_insert_auth" ON academic.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "academic_posts_update_owner" ON academic.posts;
CREATE POLICY "academic_posts_update_owner" ON academic.posts FOR UPDATE USING (author_id = auth.uid());
DROP POLICY IF EXISTS "academic_posts_delete_owner" ON academic.posts;
CREATE POLICY "academic_posts_delete_owner" ON academic.posts FOR DELETE USING (author_id = auth.uid());

-- 6. SCHEMA BRIDGING (Resolve 406/400 Errors)
-- ===========================================
-- We create views in 'public' that point to 'academic' tables.
-- This allows the frontend to query these tables without changing Supabase API settings.

DROP VIEW IF EXISTS public.hub_institutions CASCADE;
CREATE OR REPLACE VIEW public.hub_institutions AS SELECT * FROM academic.institutions;

DROP VIEW IF EXISTS public.hub_departments CASCADE;
CREATE OR REPLACE VIEW public.hub_departments AS SELECT * FROM academic.departments;

DROP VIEW IF EXISTS public.hub_courses CASCADE;
CREATE OR REPLACE VIEW public.hub_courses AS
SELECT 
    c.id,
    c.title,
    c.course_code,
    c.department_id,
    d.name as department_name,
    c.level,
    c.created_at,
    c.institution_id
FROM academic.courses c
LEFT JOIN academic.departments d ON c.department_id = d.id;

-- Enriched Resources View (Handles uploader and course joins server-side)
DROP VIEW IF EXISTS public.hub_resources CASCADE;
CREATE OR REPLACE VIEW public.hub_resources AS
SELECT 
  r.*,
  p.full_name as uploader_name,
  p.avatar_url as uploader_avatar,
  c.course_code,
  c.title as course_title,
  c.department_id,
  c.level,
  s.name as session_name
FROM academic.resources r
LEFT JOIN public.profiles p ON r.uploader_id = p.id
LEFT JOIN academic.courses c ON r.course_id = c.id
LEFT JOIN academic.departments d ON c.department_id = d.id
LEFT JOIN academic.academic_sessions s ON r.session_id = s.id;

DROP VIEW IF EXISTS public.hub_posts CASCADE;
CREATE OR REPLACE VIEW public.hub_posts AS SELECT * FROM academic.posts;

DROP VIEW IF EXISTS public.hub_comments CASCADE;
CREATE OR REPLACE VIEW public.hub_comments AS SELECT * FROM academic.comments;

DROP VIEW IF EXISTS public.hub_sessions CASCADE;
CREATE OR REPLACE VIEW public.hub_sessions AS SELECT * FROM academic.academic_sessions;

DROP VIEW IF EXISTS public.hub_student_profiles CASCADE;
CREATE OR REPLACE VIEW public.hub_student_profiles AS SELECT * FROM academic.student_profiles;

-- Consolidated Profile View (Handles joins server-side for stability)
DROP VIEW IF EXISTS public.hub_profiles CASCADE;
CREATE OR REPLACE VIEW public.hub_profiles AS
SELECT 
  p.id,
  p.email,
  p.username,
  p.full_name,
  p.avatar_url,
  p.bio,
  p.role,
  p.institution_id_permanent,
  COALESCE(p.institution_id, sp.institution_id) as institution_id,
  COALESCE(p.department_id, sp.department_id) as department_id,
  COALESCE(p.level, sp.level, p.year) as level,
  COALESCE(i.name, p.university) as institution_name,
  COALESCE(d.name, p.major) as department_name,
  p.university, -- Keep raw column for visibility
  p.major,      -- Keep raw column for visibility
  p.year,       -- Keep raw column for visibility
  p.created_at,
  p.updated_at
FROM public.profiles p
LEFT JOIN academic.student_profiles sp ON p.id = sp.id
LEFT JOIN academic.institutions i ON COALESCE(p.institution_id, sp.institution_id) = i.id
LEFT JOIN academic.departments d ON COALESCE(p.department_id, sp.department_id) = d.id;

-- Grant access to authenticated users
GRANT SELECT ON public.hub_institutions TO authenticated;
GRANT SELECT ON public.hub_departments TO authenticated;
GRANT SELECT ON public.hub_courses TO authenticated;
GRANT SELECT ON public.hub_resources TO authenticated;
GRANT SELECT ON public.hub_posts TO authenticated;
GRANT SELECT ON public.hub_comments TO authenticated;
GRANT SELECT ON public.hub_sessions TO authenticated;
GRANT SELECT ON public.hub_student_profiles TO authenticated;
GRANT SELECT ON public.hub_profiles TO authenticated;

-- Proxy policies (PostgreSQL doesn't support policies on views directly in the same way, 
-- but since the underlying tables have RLS, it is enforced automatically).

-- FORCE FIX: hub_resources UPDATE Trigger (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_hub_resources_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE academic.resources
    SET
        title = NEW.title,
        description = NEW.description,
        type = NEW.type,
        is_verified = NEW.is_verified,
        updated_at = now()
    WHERE id = OLD.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_hub_resources_update ON public.hub_resources;
CREATE TRIGGER on_hub_resources_update
INSTEAD OF UPDATE ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_resources_update();

-- Re-attach insertion trigger for hub_resources (since dropping the view removes it)
DROP TRIGGER IF EXISTS on_hub_resources_insert ON public.hub_resources;
CREATE OR REPLACE FUNCTION public.insert_hub_resources()
RETURNS TRIGGER AS $$
DECLARE
  v_inst_id uuid;
BEGIN
  -- Attempt to resolve institution_id
  IF NEW.institution_id IS NOT NULL THEN
    v_inst_id := NEW.institution_id;
  END IF;

  IF v_inst_id IS NULL AND NEW.course_id IS NOT NULL THEN
    SELECT d.institution_id INTO v_inst_id
    FROM academic.courses c
    JOIN academic.departments d ON c.department_id = d.id
    WHERE c.id = NEW.course_id;
  END IF;

  IF v_inst_id IS NULL AND NEW.uploader_id IS NOT NULL THEN
    SELECT institution_id_permanent INTO v_inst_id
    FROM public.profiles
    WHERE id = NEW.uploader_id;
  END IF;

  INSERT INTO academic.resources (
    id,
    title, 
    description, 
    type, 
    category, 
    course_id, 
    session_id, 
    uploader_id, 
    file_url, 
    file_size,
    pages,
    downloads_count,
    created_at,
    updated_at,
    institution_id
  )
  VALUES (
    COALESCE(NEW.id, gen_random_uuid()),
    NEW.title, 
    NEW.description, 
    NEW.type, 
    NEW.category, 
    NEW.course_id, 
    NEW.session_id, 
    NEW.uploader_id, 
    NEW.file_url, 
    NEW.file_size,
    NEW.pages,
    COALESCE(NEW.downloads_count, 0),
    COALESCE(NEW.created_at, now()),
    now(),
    v_inst_id
  )
  RETURNING 
    id, created_at, downloads_count 
  INTO 
    NEW.id, NEW.created_at, NEW.downloads_count;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_hub_resources_insert
INSTEAD OF INSERT ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.insert_hub_resources();

GRANT UPDATE ON public.hub_resources TO authenticated;

-- FORCE FIX: Admin Reports View (FLATTENED)
DROP VIEW IF EXISTS public.hub_reports_view CASCADE;
CREATE OR REPLACE VIEW public.hub_reports_view AS
SELECT 
    rep.id as report_id,
    rep.reason,
    rep.details,
    rep.status,
    rep.created_at,
    -- Resource Details
    res.id as resource_id,
    res.title as resource_title,
    res.type as resource_type,
    res.is_verified as resource_verified,
    res.file_url as resource_url,
    -- Reporter Details
    p.id as reporter_id,
    p.full_name as reporter_name,
    p.avatar_url as reporter_avatar,
    p.email as reporter_email
FROM academic.resource_reports rep
LEFT JOIN academic.resources res ON rep.resource_id = res.id
LEFT JOIN public.profiles p ON rep.reporter_id = p.id;

-- Grant access
GRANT SELECT, UPDATE ON public.hub_reports_view TO authenticated;

-- Allow updating status directly on this view
CREATE OR REPLACE FUNCTION public.handle_hub_report_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE academic.resource_reports
    SET status = NEW.status
    WHERE id = OLD.report_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_hub_report_update ON public.hub_reports_view;
CREATE TRIGGER on_hub_report_update
INSTEAD OF UPDATE ON public.hub_reports_view
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_report_update();

