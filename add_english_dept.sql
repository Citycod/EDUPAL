-- Add English Language and Literature department to Delta State University
INSERT INTO academic.departments (name, institution_id)
VALUES ('English Language and Literature', '7ada4732-5703-4b82-b23b-06bb382f6c64')
ON CONFLICT (name, institution_id) DO NOTHING;
