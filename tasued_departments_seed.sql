-- Seed file for Tai Solarin University of Education (TASUED) Departments
-- Total: 41 departments
BEGIN;

WITH inst AS (
    SELECT id FROM academic.institutions WHERE name = 'Tai Solarin University of Education' LIMIT 1
)
INSERT INTO academic.departments (name, institution_id)
SELECT d.name, inst.id
FROM inst, (VALUES
    -- Specialised / Standalone Programmes
    ('Physics and Electronics'),
    ('Cyber Security'),
    ('Software Engineering'),
    ('Data Science'),
    ('Accounting'),
    ('Social Work'),
    ('Sociology'),
    ('Entrepreneurship'),
    ('Animal Science'),
    ('Tourism and Hospitality'),
    ('Tourism and Hospitality Management'),
    ('Agriculture Extension'),
    ('Fisheries and Aquaculture Education'),
    ('Agricultural Extension'),
    -- Core Academic Departments
    ('Adult Education'),
    ('Agricultural Science'),
    ('Biological Sciences'),
    ('Business Education'),
    ('Chemical Sciences'),
    ('Childhood Education'),
    ('Computer and Information Sciences'),
    ('Counselling Psychology and Educational Foundation'),
    ('Creative Arts'),
    ('Economics'),
    ('Educational Management'),
    ('Educational Technology'),
    ('English Language'),
    ('French'),
    ('Geography and Environmental Management'),
    ('Health and Safety Promotion'),
    ('History and Diplomatic Studies'),
    ('Home Economics and Hotel Management'),
    ('Human Kinetic and Sport Science'),
    ('Library and Information Science'),
    ('Mathematics'),
    ('Physics'),
    ('Political Science'),
    ('Religious Studies'),
    ('Sociological Studies'),
    ('Technical Education'),
    ('Yoruba')
) AS d(name)
ON CONFLICT (name, institution_id) DO NOTHING;

COMMIT;
