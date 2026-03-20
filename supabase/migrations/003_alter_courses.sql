-- 003_alter_courses.sql
-- Adds catalog_course_id and is_custom to academic.courses

ALTER TABLE academic.courses
  ADD COLUMN IF NOT EXISTS catalog_course_id uuid REFERENCES catalog.national_courses(id),
  ADD COLUMN IF NOT EXISTS is_custom boolean NOT NULL DEFAULT false;

-- is_custom = false → course is resolved from national catalog
-- is_custom = true  → school-specific elective, no catalog mapping
