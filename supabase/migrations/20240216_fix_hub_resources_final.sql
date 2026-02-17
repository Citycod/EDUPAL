-- FIX: Enable adding resources through the public view by correctly scoping to institution
-- This fixes the "cannot insert into view hub_resources" error caused by missing institution_id

CREATE OR REPLACE FUNCTION public.insert_hub_resources()
RETURNS TRIGGER AS $$
DECLARE
  v_inst_id uuid;
BEGIN
  -- Get user's institution ID
  v_inst_id := public.get_user_institution_id();
  
  -- If user is admin but has no institution (super_admin), allow them to pass it in NEW
  IF v_inst_id IS NULL THEN
    v_inst_id := NEW.institution_id;
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
    institution_id, -- CRITICAL: Added missing institution_id
    created_at
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
    COALESCE(NEW.pages, 0), -- Default to 0 if not provided
    COALESCE(NEW.downloads_count, 0),
    v_inst_id, -- Set the derived institution_id
    COALESCE(NEW.created_at, now())
  )
  RETURNING 
    id, created_at, downloads_count 
  INTO 
    NEW.id, NEW.created_at, NEW.downloads_count;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach the trigger
DROP TRIGGER IF EXISTS on_hub_resources_insert ON public.hub_resources;
CREATE TRIGGER on_hub_resources_insert
INSTEAD OF INSERT ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.insert_hub_resources();
