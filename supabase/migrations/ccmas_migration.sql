-- ==========================================
-- CCMAS INTEGRATION MIGRATION (PHASE 1)
-- ==========================================

-- 1A. Create the global catalog schema
-- ------------------------------------------
CREATE SCHEMA IF NOT EXISTS catalog;

-- National academic programs (e.g. Computer Science)
CREATE TABLE IF NOT EXISTS catalog.national_programs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  nuc_code    text UNIQUE NOT NULL, -- e.g. "CSC"
  created_at  timestamptz DEFAULT now()
);

-- National courses: the 70% core
CREATE TABLE IF NOT EXISTS catalog.national_courses (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id           uuid NOT NULL REFERENCES catalog.national_programs(id) ON DELETE CASCADE,
  course_code_standard text NOT NULL, -- e.g. "CSC 316"
  title_standard       text NOT NULL,
  description          text,
  credit_units         int,
  semester             text CHECK (semester IN ('first', 'second', 'both')),
  level                int CHECK (level IN (100, 200, 300, 400, 500)),
  created_at           timestamptz DEFAULT now(),
  UNIQUE(program_id, course_code_standard)
);

-- Topics per national course
CREATE TABLE IF NOT EXISTS catalog.national_topics (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id           uuid NOT NULL REFERENCES catalog.national_courses(id) ON DELETE CASCADE,
  topic_name          text NOT NULL,
  week_number         int,
  learning_objectives text[], -- exact NUC CCMAS text
  created_at          timestamptz DEFAULT now()
);

-- 1B. Add the tenant bridge table
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS academic.department_program_map (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id     uuid NOT NULL REFERENCES academic.institutions(id),
  department_id      uuid NOT NULL REFERENCES academic.departments(id),
  catalog_program_id uuid NOT NULL REFERENCES catalog.national_programs(id),
  effective_from     date NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(institution_id, department_id)
);

-- 1C. Modify the existing courses table
-- ------------------------------------------
ALTER TABLE academic.courses
  ADD COLUMN IF NOT EXISTS catalog_course_id uuid REFERENCES catalog.national_courses(id),
  ADD COLUMN IF NOT EXISTS is_custom boolean NOT NULL DEFAULT false;

-- 1D. Create the curriculum resolution view
-- ------------------------------------------
CREATE OR REPLACE VIEW academic.curriculum_resolution_view AS
-- 70%: National core
SELECT
  nc.id                     AS course_id,
  nc.course_code_standard   AS course_code,
  nc.title_standard         AS title,
  nc.description,
  nc.credit_units,
  nc.semester,
  nc.level,
  np.name                   AS program_name,
  np.nuc_code               AS program_nuc_code,
  dpm.institution_id,
  dpm.department_id,
  false                     AS is_custom,
  nc.id                     AS catalog_course_id
FROM catalog.national_courses nc
JOIN catalog.national_programs np ON np.id = nc.program_id
JOIN academic.department_program_map dpm ON dpm.catalog_program_id = np.id

UNION ALL

-- 30%: School-specific
SELECT
  ac.id                     AS course_id,
  ac.course_code,
  ac.title,
  ac.description,
  ac.credit_units,
  ac.semester,
  ac.level,
  NULL                      AS program_name,
  NULL                      AS program_nuc_code,
  ac.institution_id,
  ac.department_id,
  true                      AS is_custom,
  ac.catalog_course_id
FROM academic.courses ac
WHERE ac.is_custom = true;

-- STEP 2: ROW LEVEL SECURITY POLICIES
-- ------------------------------------------

-- CATALOG: Read-only for authenticated students
ALTER TABLE catalog.national_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog.national_courses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog.national_topics   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "catalog: read for all authenticated users" ON catalog.national_programs;
CREATE POLICY "catalog: read for all authenticated users"
  ON catalog.national_programs FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "catalog: read for all authenticated users" ON catalog.national_courses;
CREATE POLICY "catalog: read for all authenticated users"
  ON catalog.national_courses FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "catalog: read for all authenticated users" ON catalog.national_topics;
CREATE POLICY "catalog: read for all authenticated users"
  ON catalog.national_topics FOR SELECT TO authenticated USING (true);

-- ACADEMIC: Institution isolation
ALTER TABLE academic.department_program_map ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dept_program_map: institution isolation" ON academic.department_program_map;
CREATE POLICY "dept_program_map: institution isolation"
  ON academic.department_program_map FOR SELECT TO authenticated
  USING (institution_id = (auth.jwt() ->> 'institution_id')::uuid);

-- Ensure isolation on courses table
DROP POLICY IF EXISTS "courses: institution isolation" ON academic.courses;
CREATE POLICY "courses: institution isolation"
  ON academic.courses FOR SELECT TO authenticated
  USING (institution_id = (auth.jwt() ->> 'institution_id')::uuid);
