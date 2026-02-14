-- Enable adding resources through the public view
CREATE OR REPLACE FUNCTION public.insert_hub_resources()
RETURNS TRIGGER AS $$
BEGIN
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
    created_at
  )
  VALUES (
    COALESCE(NEW.id, gen_random_uuid()), -- Handle ID generation if not provided
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
    COALESCE(NEW.created_at, now())
  )
  RETURNING 
    id, created_at, downloads_count 
  INTO 
    NEW.id, NEW.created_at, NEW.downloads_count;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_hub_resources_insert ON public.hub_resources;
CREATE TRIGGER on_hub_resources_insert
INSTEAD OF INSERT ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.insert_hub_resources();
