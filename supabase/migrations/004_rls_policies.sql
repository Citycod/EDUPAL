-- 004_rls_policies.sql
-- Catalog read-only + tenant isolation policies

-- CATALOG SCHEMA: read-only for all authenticated users, no writes via client
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

-- No INSERT/UPDATE/DELETE policies on catalog tables
-- Catalog is ONLY writable via service_role key (ingestion scripts)

-- ACADEMIC SCHEMA: students only see their own institution's data
ALTER TABLE academic.department_program_map ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dept_program_map: institution isolation" ON academic.department_program_map;
CREATE POLICY "dept_program_map: institution isolation"
  ON academic.department_program_map FOR SELECT TO authenticated
  USING (institution_id = (auth.jwt() ->> 'institution_id')::uuid);

-- Existing RLS on academic.courses ("academic_courses_select_inst")
-- already enforces institution isolation via the department_id JOIN in schema.sql.
-- No new policy is needed for academic.courses here.
