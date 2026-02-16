-- Diagnostic Query: List all check constraints on public.profiles
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class cl ON cl.oid = c.conrelid
WHERE n.nspname = 'public' 
  AND cl.relname = 'profiles'
  AND c.contype = 'c';
