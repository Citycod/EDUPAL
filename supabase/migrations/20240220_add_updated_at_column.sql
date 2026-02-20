-- Add updated_at column to academic.resources
-- Fixes 400 Bad Request (SQL Error 42703) when trigger tries to set updated_at

ALTER TABLE academic.resources 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Backfill existing rows (optional, but good practice)
UPDATE academic.resources 
SET updated_at = created_at 
WHERE updated_at IS NULL;
