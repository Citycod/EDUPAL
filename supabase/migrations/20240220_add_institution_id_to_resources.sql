-- Fix Library Display: Add institution_id to resources
-- This decouples resource visibility from course linkage.

-- 1. Add Column
ALTER TABLE academic.resources 
ADD COLUMN IF NOT EXISTS institution_id uuid REFERENCES academic.institutions(id);

-- 2. Backfill Existing Data
-- Try to infer from Course -> Department
UPDATE academic.resources r
SET institution_id = d.institution_id
FROM academic.courses c
JOIN academic.departments d ON c.department_id = d.id
WHERE r.course_id = c.id
AND r.institution_id IS NULL;

-- Fallback: Infer from Uploader
UPDATE academic.resources r
SET institution_id = p.institution_id_permanent
FROM public.profiles p
WHERE r.uploader_id = p.id
AND r.institution_id IS NULL;

-- 3. Update Trigger Function to set institution_id on Insert
CREATE OR REPLACE FUNCTION public.insert_hub_resources()
RETURNS TRIGGER AS $$
DECLARE
  v_inst_id uuid;
BEGIN
  -- Attempt to resolve institution_id
  IF NEW.institution_id IS NOT NULL THEN
    v_inst_id := NEW.institution_id;
  END IF;

  IF v_inst_id IS NULL AND NEW.course_id IS NOT NULL THEN
    SELECT d.institution_id INTO v_inst_id
    FROM academic.courses c
    JOIN academic.departments d ON c.department_id = d.id
    WHERE c.id = NEW.course_id;
  END IF;

  IF v_inst_id IS NULL AND NEW.uploader_id IS NOT NULL THEN
    SELECT institution_id_permanent INTO v_inst_id
    FROM public.profiles
    WHERE id = NEW.uploader_id;
  END IF;

  INSERT INTO academic.resources (
    id,
    title, 
    description, 
    type, 
    category, 
    course_id, 
    session_id, 
    uploader_id, 
    file_url, 
    file_size,
    pages,
    downloads_count,
    created_at,
    updated_at,
    institution_id
  )
  VALUES (
    COALESCE(NEW.id, gen_random_uuid()),
    NEW.title, 
    NEW.description, 
    NEW.type, 
    NEW.category, 
    NEW.course_id, 
    NEW.session_id, 
    NEW.uploader_id, 
    NEW.file_url, 
    NEW.file_size,
    NEW.pages,
    COALESCE(NEW.downloads_count, 0),
    COALESCE(NEW.created_at, now()),
    now(),
    v_inst_id
  )
  RETURNING 
    id, created_at, downloads_count 
  INTO 
    NEW.id, NEW.created_at, NEW.downloads_count;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update View to assume institution_id from table directly
DROP VIEW IF EXISTS public.hub_resources CASCADE;
CREATE OR REPLACE VIEW public.hub_resources AS
SELECT 
  r.*,
  p.full_name as uploader_name,
  p.avatar_url as uploader_avatar,
  c.course_code,
  c.title as course_title,
  c.department_id,
  c.level, -- ADDED: Needed for filtering
  s.name as session_name,
  COALESCE(r.is_verified, false) as is_verified_status -- Helper alias
FROM academic.resources r
LEFT JOIN public.profiles p ON r.uploader_id = p.id
LEFT JOIN academic.courses c ON r.course_id = c.id
LEFT JOIN academic.departments d ON c.department_id = d.id
LEFT JOIN academic.academic_sessions s ON r.session_id = s.id;

GRANT SELECT, UPDATE ON public.hub_resources TO authenticated;

-- Re-attach Triggers
DROP TRIGGER IF EXISTS on_hub_resources_insert ON public.hub_resources;
CREATE TRIGGER on_hub_resources_insert
INSTEAD OF INSERT ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.insert_hub_resources();

DROP TRIGGER IF EXISTS on_hub_resources_update ON public.hub_resources;
CREATE TRIGGER on_hub_resources_update
INSTEAD OF UPDATE ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_resources_update();

-- 5. RELAX RLS: Allow viewing if institution matches
DROP POLICY IF EXISTS "academic_resources_select_inst" ON academic.resources;
CREATE POLICY "academic_resources_select_inst" ON academic.resources FOR SELECT USING (
  institution_id = public.get_user_institution_id() OR
  -- Output compatibility with old/admin check
  EXISTS (
     SELECT 1 FROM academic.student_profiles sp
     WHERE sp.institution_id = academic.resources.institution_id AND sp.id = auth.uid()
  )
);
