BEGIN;

WITH new_departments (name) AS (
    VALUES
        ('Adult and Continuing Education'),
        ('Agricultural Education'),
        ('Arabic'),
        ('Biology'),
        ('Business Education'),
        ('Chemistry'),
        ('Christian Religious Studies'),
        ('Computer Science'),
        ('Creative Arts Education'),
        ('Early Childhood Education'),
        ('Economics'),
        ('Educational Management'),
        ('Efik-Ibibio Education'),
        ('English Language/Literature-in-English'),
        ('Entrepreneurship Education'),
        ('Environmental Education'),
        ('French'),
        ('Geography'),
        ('Guidance and Counselling'),
        ('Hausa'),
        ('Health Education'),
        ('History'),
        ('Home Economics'),
        ('Human Kinetics/Physical Education'),
        ('Igbo'),
        ('Integrated Science'),
        ('Islamic Studies'),
        ('Language Arts and Communication'),
        ('Library and Information Science'),
        ('Mathematics'),
        ('Music'),
        ('Physics'),
        ('Political Science'),
        ('Primary Education'),
        ('Social Studies and Civic Education'),
        ('Special Needs Education'),
        ('Sustainable Development Studies'),
        ('Technology Education'),
        ('Yorùbá'),
        ('Educational Technology')
)
-- Insert into the database without tying to any university (institution_id = NULL).
-- Only add if the department name doesn't already exist anywhere in the database.
INSERT INTO academic.departments (name, institution_id)
SELECT nd.name, NULL
FROM new_departments nd
WHERE NOT EXISTS (
    SELECT 1 FROM academic.departments d 
    WHERE d.name ILIKE nd.name
);

COMMIT;
