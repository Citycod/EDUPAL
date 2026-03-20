-- 001_catalog_schema.sql
-- Creates catalog.national_programs, national_courses, national_topics

CREATE SCHEMA IF NOT EXISTS catalog;

-- National academic programs (e.g. Computer Science, Software Engineering)
CREATE TABLE catalog.national_programs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,               -- e.g. "Computer Science"
  nuc_code    text UNIQUE NOT NULL,        -- e.g. "CSC" from CCMAS doc
  created_at  timestamptz DEFAULT now()
);

-- National courses: the 70% core
CREATE TABLE catalog.national_courses (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id           uuid NOT NULL REFERENCES catalog.national_programs(id) ON DELETE CASCADE,
  course_code_standard text NOT NULL,      -- e.g. "CSC 316"
  title_standard       text NOT NULL,      -- e.g. "Operating Systems"
  description          text,
  credit_units         int,
  semester             text CHECK (semester IN ('first', 'second', 'both')),
  level                int CHECK (level IN (100, 200, 300, 400, 500)),
  created_at           timestamptz DEFAULT now(),
  UNIQUE(program_id, course_code_standard)
);

-- Topics per national course (granular, for AI hydration)
CREATE TABLE catalog.national_topics (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id           uuid NOT NULL REFERENCES catalog.national_courses(id) ON DELETE CASCADE,
  topic_name          text NOT NULL,
  week_number         int,
  learning_objectives text[],              -- exact NUC CCMAS text — do NOT paraphrase
  created_at          timestamptz DEFAULT now()
);
