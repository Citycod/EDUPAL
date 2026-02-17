-- Linked Discussions: Connect Community Threads to Academic Resources
-- This allows students to start discussions directly from a specific material

-- 1. Add resource_id to academic.posts
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'academic' 
    AND table_name = 'posts' 
    AND column_name = 'resource_id'
  ) THEN
    ALTER TABLE academic.posts 
      ADD COLUMN resource_id UUID REFERENCES academic.resources(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 2. Update hub_posts view to include resource info
DROP VIEW IF EXISTS public.hub_posts CASCADE;
CREATE OR REPLACE VIEW public.hub_posts AS
SELECT 
  p.*,
  r.title as resource_title,
  r.type as resource_type
FROM academic.posts p
LEFT JOIN academic.resources r ON p.resource_id = r.id;

GRANT SELECT ON public.hub_posts TO authenticated;

-- 3. Update hub_posts instead of insert trigger to handle resource_id
CREATE OR REPLACE FUNCTION public.handle_hub_post_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO academic.posts (author_id, course_id, resource_id, content)
  VALUES (NEW.author_id, NEW.course_id, NEW.resource_id, NEW.content)
  RETURNING id, created_at INTO NEW.id, NEW.created_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_hub_posts_insert ON public.hub_posts;
CREATE TRIGGER trg_hub_posts_insert
INSTEAD OF INSERT ON public.hub_posts
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_post_insert();
