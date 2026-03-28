-- Migration: NCE Integration (Program Types and Institution Types)

BEGIN;

-- 1A. Add program_type to public.profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS program_type text
  NOT NULL DEFAULT 'degree'
  CHECK (program_type IN ('degree', 'nce'));

COMMENT ON COLUMN public.profiles.program_type IS
  'Indicates whether the user is on a Degree (university) or NCE (college of education) programme.';

-- 1B. Add institution_type to academic.institutions
ALTER TABLE academic.institutions
ADD COLUMN IF NOT EXISTS institution_type text
  NOT NULL DEFAULT 'university'
  CHECK (institution_type IN ('university', 'college_of_education', 'polytechnic'));

COMMENT ON COLUMN academic.institutions.institution_type IS
  'Classifies the institution. Drives NCE vs Degree display logic and future catalog filtering.';

-- 1C. Refresh public.hub_profiles view to expose program_type
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
  p.university, 
  p.major,      
  p.year,       
  p.created_at,
  p.updated_at,
  p.program_type,           -- newly exposed (appended to end to satisfy CREATE OR REPLACE requirements)
  i.institution_type        -- newly exposed
FROM public.profiles p
LEFT JOIN academic.student_profiles sp ON p.id = sp.id
LEFT JOIN academic.institutions i ON COALESCE(p.institution_id, sp.institution_id) = i.id
LEFT JOIN academic.departments d ON COALESCE(p.department_id, sp.department_id) = d.id;

GRANT SELECT ON public.hub_profiles TO authenticated;

-- 1D. Update handle_new_user() trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_institution_name  text;
  v_department_name   text;
  v_level             integer;
  v_program_type      text;
  v_institution_type  text;
  v_institution_id    uuid;
  v_department_id     uuid;
BEGIN
  -- Extract metadata
  v_institution_name := NULLIF(NEW.raw_user_meta_data->>'university', '');
  v_department_name  := NULLIF(NEW.raw_user_meta_data->>'major', '');
  v_level            := (NULLIF(NEW.raw_user_meta_data->>'year', ''))::integer;
  v_program_type     := COALESCE(NEW.raw_user_meta_data->>'program_type', 'degree');

  -- Derive institution type from program type
  v_institution_type := CASE v_program_type
    WHEN 'nce' THEN 'college_of_education'
    ELSE 'university'
  END;

  -- Auto-create institution if needed (now with institution_type)
  IF v_institution_name IS NOT NULL THEN
    INSERT INTO academic.institutions (name, institution_type)
    VALUES (v_institution_name, v_institution_type)
    ON CONFLICT (name) DO NOTHING;  -- DO NOTHING, not DO UPDATE

    SELECT id INTO v_institution_id
    FROM academic.institutions
    WHERE name = v_institution_name
    LIMIT 1;
  END IF;

  -- Auto-create department if needed
  IF v_department_name IS NOT NULL AND v_institution_id IS NOT NULL THEN
    INSERT INTO academic.departments (name, institution_id)
    VALUES (v_department_name, v_institution_id)
    ON CONFLICT (name, institution_id) DO NOTHING;  -- DO NOTHING here too

    SELECT id INTO v_department_id
    FROM academic.departments
    WHERE name = v_department_name
      AND institution_id = v_institution_id
    LIMIT 1;
  END IF;

  -- Create profile (now with program_type)
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    institution_id,
    department_id,
    level,
    university,
    major,
    year,
    program_type
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    v_institution_id,
    v_department_id,
    v_level::text,
    v_institution_name,
    v_department_name,
    v_level::text,
    v_program_type
  );

  RETURN NEW;
END;
$$;

COMMIT;
