-- VIEW HIDDEN ROWS
-- This script creates a secure function to show you the rows that RLS is hiding.

CREATE OR REPLACE FUNCTION public.see_hidden_profiles(target_id uuid)
RETURNS TABLE (profile_id uuid, email text, institution_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY 
    SELECT p.id, p.email, p.institution_id
    FROM public.profiles p 
    WHERE p.institution_id = target_id;
END;
$$;

-- EXECUTE IT
SELECT * FROM public.see_hidden_profiles('66bd6b4a-0565-4c83-afb0-0032db829613');

-- Cleanup (Optional, but good practice)
-- DROP FUNCTION public.see_hidden_profiles(uuid);
