-- Grant USAGE on schema 'academic' to authenticated users
-- This is required for triggers like sync_profile_to_student_profiles to access tables in this schema
GRANT USAGE ON SCHEMA academic TO authenticated;
GRANT USAGE ON SCHEMA academic TO anon; -- Depending on if public needs access, safe for read-only if RLS is on

-- Grant access to tables in 'academic' schema
-- RLS policies will still enforce security, but the role needs table-level privileges first.
GRANT ALL ON ALL TABLES IN SCHEMA academic TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA academic TO anon;

-- Ensure sequences are accessible (for IDs if needed)
GRANT ALL ON ALL SEQUENCES IN SCHEMA academic TO authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA academic TO anon;

-- Update the sync function to be SECURITY DEFINER to avoid permission issues
-- This ensures the function runs with the privileges of the creator (usually postgres/admin)
-- rather than the user invoking the trigger.
CREATE OR REPLACE FUNCTION public.sync_profile_to_student_profiles()
RETURNS TRIGGER AS $$
BEGIN
  -- We use "security definer" so this runs as admin, ensuring 
  -- we can always write to academic.student_profiles regardless of user permissions
  INSERT INTO academic.student_profiles (id, institution_id, department_id, level)
  VALUES (NEW.id, NEW.institution_id, NEW.department_id, NEW.level)
  ON CONFLICT (id) DO UPDATE SET
    institution_id = EXCLUDED.institution_id,
    department_id = EXCLUDED.department_id,
    level = EXCLUDED.level,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
