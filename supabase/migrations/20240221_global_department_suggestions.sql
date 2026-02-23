-- Add function to fetch unique department names globally for admin suggestions
CREATE OR REPLACE FUNCTION public.get_global_department_names()
RETURNS TABLE (name text) AS $$
BEGIN
  RETURN QUERY 
  SELECT DISTINCT d.name 
  FROM academic.departments d 
  ORDER BY d.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_global_department_names() TO authenticated;
