-- 002_dept_program_map.sql
-- Creates academic.department_program_map

CREATE TABLE IF NOT EXISTS academic.department_program_map (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id     uuid NOT NULL REFERENCES academic.institutions(id),
  department_id      uuid NOT NULL REFERENCES academic.departments(id),
  catalog_program_id uuid NOT NULL REFERENCES catalog.national_programs(id),
  effective_from     date NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(institution_id, department_id)
);
