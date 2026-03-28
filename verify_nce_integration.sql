-- Verification Checks for NCE Integration

-- 1. Confirm columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
  AND column_name = 'program_type';

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'academic' AND table_name = 'institutions'
  AND column_name = 'institution_type';

-- 2. Confirm hub_profiles exposes program_type
SELECT program_type, institution_type
FROM public.hub_profiles
LIMIT 5;

-- 3. After a test NCE signup — confirm trigger set values correctly
SELECT p.email, p.level, p.program_type, i.institution_type
FROM public.profiles p
JOIN academic.institutions i ON p.institution_id = i.id
WHERE p.email = 'test_nce_student@example.com';
-- Expected: level=100, program_type='nce', institution_type='college_of_education'

-- 4. Confirm Degree signup still works correctly
SELECT p.email, p.level, p.program_type, i.institution_type
FROM public.profiles p
JOIN academic.institutions i ON p.institution_id = i.id
WHERE p.email = 'test_degree_student@example.com';
-- Expected: level=200, program_type='degree', institution_type='university'

-- 5. Confirm existing rows defaulted correctly (no nulls)
SELECT COUNT(*) FROM public.profiles WHERE program_type IS NULL;
-- Expected: 0

SELECT COUNT(*) FROM academic.institutions WHERE institution_type IS NULL;
-- Expected: 0
