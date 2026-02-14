-- EDUPAL SCALABLE ACADEMIC STRUCTURE
-- This migration establishes the formal hierarchy and monetization hooks.

-- 1. Countries
CREATE TABLE IF NOT EXISTS public.countries (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text UNIQUE NOT NULL,
    iso_code text UNIQUE NOT NULL, -- e.g., 'NG'
    created_at timestamptz DEFAULT now()
);

-- 2. Institutions
CREATE TABLE IF NOT EXISTS public.institutions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    country_id uuid REFERENCES public.countries(id) ON DELETE CASCADE,
    name text NOT NULL,
    short_name text, -- e.g., 'OOU'
    logo_url text,
    created_at timestamptz DEFAULT now(),
    UNIQUE(country_id, name)
);

-- 3. Departments
CREATE TABLE IF NOT EXISTS public.departments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    institution_id uuid REFERENCES public.institutions(id) ON DELETE CASCADE,
    name text NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(institution_id, name)
);

-- 4. Courses
CREATE TABLE IF NOT EXISTS public.courses_refined (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    department_id uuid REFERENCES public.departments(id) ON DELETE CASCADE,
    course_code text NOT NULL, -- e.g., 'CSC421'
    title text NOT NULL,
    level text, -- e.g., '400L'
    created_at timestamptz DEFAULT now(),
    UNIQUE(department_id, course_code)
);

-- 5. Academic Sessions
CREATE TABLE IF NOT EXISTS public.academic_sessions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text UNIQUE NOT NULL, -- e.g., '2023/2024'
    created_at timestamptz DEFAULT now()
);

-- 6. Lecturers (Future Expansion Hook)
CREATE TABLE IF NOT EXISTS public.lecturers (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    institution_id uuid REFERENCES public.institutions(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

-- 7. Update Profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS institution_id uuid REFERENCES public.institutions(id) ON DELETE SET NULL;

-- 8. Update Resources (Monetization & Integrity)
ALTER TABLE public.resources
ADD COLUMN IF NOT EXISTS course_refined_id uuid REFERENCES public.courses_refined(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS session_id uuid REFERENCES public.academic_sessions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;

-- 9. Search Performance & Indexing
-- Index for direct course code lookups
CREATE INDEX IF NOT EXISTS idx_courses_refined_code ON public.courses_refined(course_code);
-- Index for resource lookups by course and session
CREATE INDEX IF NOT EXISTS idx_resources_course_session ON public.resources(course_refined_id, session_id);

-- Full-Text Search (tsvector)
-- Add search vector to courses for code + title search
ALTER TABLE public.courses_refined ADD COLUMN IF NOT EXISTS fts tsvector;
CREATE INDEX IF NOT EXISTS idx_courses_refined_fts ON public.courses_refined USING gin(fts);

-- Trigger to keep fts updated
CREATE OR REPLACE FUNCTION courses_refined_fts_trigger() RETURNS trigger AS $$
BEGIN
  new.fts := setweight(to_tsvector('english', coalesce(new.course_code, '')), 'A') ||
             setweight(to_tsvector('english', coalesce(new.title, '')), 'B');
  RETURN new;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_courses_refined_fts ON public.courses_refined;
CREATE TRIGGER trg_courses_refined_fts BEFORE INSERT OR UPDATE ON public.courses_refined
FOR EACH ROW EXECUTE PROCEDURE courses_refined_fts_trigger();

-- 10. Subscriptions (Monetization Stub)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier text DEFAULT 'free', -- 'free', 'pro', 'institution_plan'
    status text DEFAULT 'active',
    expires_at timestamptz,
    created_at timestamptz DEFAULT now()
);
