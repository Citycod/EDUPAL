-- Fix Hub Views for Institution Isolation
-- Recreates bridge views and ensures proper permissions/RLS to avoid circular dependencies

-- 1. Fix hub_courses
DROP VIEW IF EXISTS public.hub_courses CASCADE;
CREATE OR REPLACE VIEW public.hub_courses AS
SELECT 
    id,
    title,
    course_code,
    department_id,
    level,
    created_at,
    institution_id
FROM academic.courses;

GRANT SELECT ON public.hub_courses TO authenticated;

-- 2. Fix hub_posts (Consolidate author and course info server-side)
DROP VIEW IF EXISTS public.hub_posts CASCADE;
CREATE OR REPLACE VIEW public.hub_posts AS
SELECT 
  p.*,
  pr.full_name as author_name,
  pr.avatar_url as author_avatar,
  c.course_code,
  r.title as resource_title,
  r.type as resource_type,
  r.file_url as resource_url
FROM academic.posts p
LEFT JOIN public.profiles pr ON p.author_id = pr.id
LEFT JOIN academic.courses c ON p.course_id = c.id
LEFT JOIN academic.resources r ON p.resource_id = r.id;

-- RESTORE TRIGGER: hub_posts
CREATE OR REPLACE FUNCTION public.handle_hub_post_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO academic.posts (author_id, course_id, resource_id, content, institution_id)
  VALUES (
    NEW.author_id, 
    NEW.course_id, 
    NEW.resource_id, 
    NEW.content, 
    COALESCE(NEW.institution_id, (SELECT institution_id_permanent FROM public.profiles WHERE id = NEW.author_id))
  )
  RETURNING id, created_at INTO NEW.id, NEW.created_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_hub_posts_insert ON public.hub_posts;
CREATE TRIGGER trg_hub_posts_insert
INSTEAD OF INSERT ON public.hub_posts
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_post_insert();

-- IMPORTANT: Grant INSERT/DELETE so students can post
GRANT SELECT, INSERT, DELETE ON public.hub_posts TO authenticated;

-- 3. Fix hub_comments (Include profile info and institution)
DROP VIEW IF EXISTS public.hub_comments CASCADE;
CREATE OR REPLACE VIEW public.hub_comments AS
SELECT
    c.*,
    p.full_name AS author_name,
    p.avatar_url AS author_avatar
FROM academic.comments c
LEFT JOIN public.profiles p ON c.author_id = p.id;

-- RESTORE TRIGGER: hub_comments
CREATE OR REPLACE FUNCTION public.handle_hub_comment_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO academic.comments (post_id, author_id, content, institution_id)
    VALUES (
      NEW.post_id, 
      NEW.author_id, 
      NEW.content,
      COALESCE(NEW.institution_id, (SELECT institution_id_permanent FROM public.profiles WHERE id = NEW.author_id))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS hub_comments_insert ON public.hub_comments;
CREATE TRIGGER hub_comments_insert
INSTEAD OF INSERT ON public.hub_comments
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_comment_insert();

-- IMPORTANT: Grant INSERT/DELETE so students can reply/vote
GRANT SELECT, INSERT, DELETE ON public.hub_comments TO authenticated;

-- 4. HARDEN RLS: Avoid Circular Isolation on public.profiles
-- Users MUST be able to see their own profile to derive their institution_id
DROP POLICY IF EXISTS "profiles_select_self" ON public.profiles;
CREATE POLICY "profiles_select_self" ON public.profiles 
  FOR SELECT USING (id = auth.uid());

-- Ensure the isolation policy still exists for other profiles
DROP POLICY IF EXISTS "profiles_select_own_institution" ON public.profiles;
CREATE POLICY "profiles_select_own_institution" ON public.profiles 
  FOR SELECT USING (
    institution_id_permanent = public.get_user_institution_id()
    OR public.is_admin()
  );

