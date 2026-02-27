-- Backfill NULL level values on courses by deriving from course_code
-- e.g., CS201 -> 200, MTH101 -> 100, PHY301 -> 300
-- This ensures the library level filter can match resources correctly.

-- 1. Backfill courses where level is NULL but course_code has a number
UPDATE academic.courses
SET level = (
    FLOOR(
        CAST(
            (regexp_match(course_code, '\d+'))[1] AS INTEGER
        ) / 100
    ) * 100
)::text
WHERE level IS NULL
  AND course_code ~ '\d+';

-- 2. Set a fallback level of '100' for any remaining courses without level
UPDATE academic.courses
SET level = '100'
WHERE level IS NULL;

-- 3. Ensure level column has a default for future inserts
ALTER TABLE academic.courses
ALTER COLUMN level SET DEFAULT '100';
