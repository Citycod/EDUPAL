-- 005_resolution_view.sql
-- Creates academic.curriculum_resolution_view

CREATE OR REPLACE VIEW academic.curriculum_resolution_view AS

-- 70%: National core courses resolved via department → program mapping
SELECT
  nc.id                     AS course_id,
  nc.course_code_standard   AS course_code,
  nc.title_standard         AS title,
  nc.description,
  nc.credit_units,
  nc.semester,
  nc.level::text            AS level,
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

-- 30%: School-specific electives
SELECT
  ac.id                     AS course_id,
  ac.course_code,
  ac.title,
  NULL::text                AS description,
  NULL::int                 AS credit_units,
  NULL::text                AS semester,
  ac.level::text            AS level,
  NULL::text                AS program_name,
  NULL::text                AS program_nuc_code,
  ad.institution_id         AS institution_id,
  ac.department_id,
  true                      AS is_custom,
  ac.catalog_course_id
FROM academic.courses ac
JOIN academic.departments ad ON ad.id = ac.department_id
WHERE ac.is_custom = true;
