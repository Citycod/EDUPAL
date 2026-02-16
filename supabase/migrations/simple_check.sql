-- 1. Check how many profiles are still linked
SELECT count(*) as stuck_profiles_count 
FROM public.profiles 
WHERE institution_id = '66bd6b4a-0565-4c83-afb0-0032db829613';

-- 2. See one of them (if any)
SELECT id, email, institution_id 
FROM public.profiles 
WHERE institution_id = '66bd6b4a-0565-4c83-afb0-0032db829613' 
LIMIT 1;
