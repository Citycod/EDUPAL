-- Fix Schema 404s: Establish Public Bridge Views for Votion, Reporting, and Rankings
-- This ensures the PostgREST API can access these features from the default 'public' schema.

-- 0. Ensure base columns and tables exist (in case previous migrations were skipped)
ALTER TABLE academic.resources ADD COLUMN IF NOT EXISTS upvotes_count integer DEFAULT 0;
ALTER TABLE academic.comments ADD COLUMN IF NOT EXISTS upvotes_count integer DEFAULT 0;
ALTER TABLE academic.resources ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Base Table: Resource Votes
CREATE TABLE IF NOT EXISTS academic.resource_votes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    resource_id uuid REFERENCES academic.resources(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, resource_id)
);

-- Base Table: Comment Votes
CREATE TABLE IF NOT EXISTS academic.comment_votes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    comment_id uuid REFERENCES academic.comments(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, comment_id)
);

-- Base Table: Resource Reports
CREATE TABLE IF NOT EXISTS academic.resource_reports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    resource_id uuid REFERENCES academic.resources(id) ON DELETE CASCADE NOT NULL,
    reason text NOT NULL,
    details text,
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now()
);

-- Vote Sync Triggers (for 'Trending' rankings)
CREATE OR REPLACE FUNCTION academic.sync_resource_upvotes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE academic.resources SET upvotes_count = upvotes_count + 1 WHERE id = NEW.resource_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE academic.resources SET upvotes_count = GREATEST(0, upvotes_count - 1) WHERE id = OLD.resource_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_resource_vote_sync ON academic.resource_votes;
CREATE TRIGGER on_resource_vote_sync AFTER INSERT OR DELETE ON academic.resource_votes FOR EACH ROW EXECUTE FUNCTION academic.sync_resource_upvotes();

CREATE OR REPLACE FUNCTION academic.sync_comment_upvotes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE academic.comments SET upvotes_count = upvotes_count + 1 WHERE id = NEW.comment_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE academic.comments SET upvotes_count = GREATEST(0, upvotes_count - 1) WHERE id = OLD.comment_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_vote_sync ON academic.comment_votes;
CREATE TRIGGER on_comment_vote_sync AFTER INSERT OR DELETE ON academic.comment_votes FOR EACH ROW EXECUTE FUNCTION academic.sync_comment_upvotes();


-- 1. Bridge for Resource Views & Sync
DROP VIEW IF EXISTS public.hub_resources;
CREATE OR REPLACE VIEW public.hub_resources AS
SELECT 
  r.*,
  p.full_name as uploader_name,
  p.avatar_url as uploader_avatar,
  c.course_code,
  c.title as course_title,
  c.department_id,
  s.name as session_name,
  COALESCE(r.is_verified, false) as is_verified_status
FROM academic.resources r
LEFT JOIN public.profiles p ON r.uploader_id = p.id
LEFT JOIN academic.courses c ON r.course_id = c.id
LEFT JOIN academic.departments d ON c.department_id = d.id
LEFT JOIN academic.academic_sessions s ON r.session_id = s.id;

GRANT SELECT ON public.hub_resources TO authenticated;

-- Re-attach insertion trigger for hub_resources (since dropping the view removes it)
DROP TRIGGER IF EXISTS on_hub_resources_insert ON public.hub_resources;
CREATE TRIGGER on_hub_resources_insert
INSTEAD OF INSERT ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.insert_hub_resources();


-- 1. Bridge for Resource Votes
DROP VIEW IF EXISTS public.hub_resource_votes CASCADE;
CREATE OR REPLACE VIEW public.hub_resource_votes AS
SELECT * FROM academic.resource_votes;

GRANT SELECT, INSERT, DELETE ON public.hub_resource_votes TO authenticated;

-- Trigger to allow inserting into bridge view
CREATE OR REPLACE FUNCTION public.handle_hub_vote_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO academic.resource_votes (user_id, resource_id)
  VALUES (NEW.user_id, NEW.resource_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_hub_votes_insert
INSTEAD OF INSERT ON public.hub_resource_votes
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_vote_insert();

-- Trigger to allow deleting from bridge view
CREATE OR REPLACE FUNCTION public.handle_hub_vote_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM academic.resource_votes WHERE user_id = OLD.user_id AND resource_id = OLD.resource_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_hub_votes_delete
INSTEAD OF DELETE ON public.hub_resource_votes
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_vote_delete();


-- 1.1 Bridge for Comment Votes
DROP VIEW IF EXISTS public.hub_comment_votes CASCADE;
CREATE OR REPLACE VIEW public.hub_comment_votes AS
SELECT * FROM academic.comment_votes;

GRANT SELECT, INSERT, DELETE ON public.hub_comment_votes TO authenticated;

-- Trigger to allow inserting into bridge view
CREATE OR REPLACE FUNCTION public.handle_hub_comment_vote_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO academic.comment_votes (user_id, comment_id)
  VALUES (NEW.user_id, NEW.comment_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_hub_comment_votes_insert
INSTEAD OF INSERT ON public.hub_comment_votes
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_comment_vote_insert();

-- Trigger to allow deleting from bridge view
CREATE OR REPLACE FUNCTION public.handle_hub_comment_vote_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM academic.comment_votes WHERE user_id = OLD.user_id AND comment_id = OLD.comment_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_hub_comment_votes_delete
INSTEAD OF DELETE ON public.hub_comment_votes
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_comment_vote_delete();


-- 2. Bridge for Resource Reports
DROP VIEW IF EXISTS public.hub_resource_reports CASCADE;
CREATE OR REPLACE VIEW public.hub_resource_reports AS
SELECT * FROM academic.resource_reports;

GRANT SELECT, INSERT ON public.hub_resource_reports TO authenticated;

-- Trigger to allow inserting into bridge view
CREATE OR REPLACE FUNCTION public.handle_hub_report_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO academic.resource_reports (reporter_id, resource_id, reason, details, status)
  VALUES (NEW.reporter_id, NEW.resource_id, NEW.reason, NEW.details, COALESCE(NEW.status, 'pending'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_hub_reports_insert
INSTEAD OF INSERT ON public.hub_resource_reports
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_report_insert();


-- 3. Ensure Contributor Scores View is accessible
-- Renaming to hub_contributor_scores for consistency
DROP VIEW IF EXISTS public.contributor_scores CASCADE;
DROP VIEW IF EXISTS public.hub_contributor_scores CASCADE;

CREATE OR REPLACE VIEW public.hub_contributor_scores AS
SELECT
    p.id AS user_id,
    p.full_name,
    p.avatar_url,
    p.institution_id,
    COALESCE(upload_stats.upload_count, 0) AS upload_count,
    COALESCE(upload_stats.resource_upvotes, 0) AS resource_upvotes,
    COALESCE(comment_stats.comment_upvotes, 0) AS comment_upvotes,
    (
        COALESCE(upload_stats.upload_count, 0) * 10 +
        COALESCE(upload_stats.resource_upvotes, 0) +
        COALESCE(comment_stats.comment_upvotes, 0) * 3
    ) AS score
FROM public.profiles p
LEFT JOIN (
    SELECT
        r.uploader_id,
        COUNT(r.id) AS upload_count,
        COALESCE(SUM(r.upvotes_count), 0) AS resource_upvotes
    FROM academic.resources r
    GROUP BY r.uploader_id
) upload_stats ON upload_stats.uploader_id = p.id
LEFT JOIN (
    SELECT
        c.author_id,
        COALESCE(SUM(c.upvotes_count), 0) AS comment_upvotes
    FROM academic.comments c
    GROUP BY c.author_id
) comment_stats ON comment_stats.author_id = p.id
WHERE p.role = 'student' OR p.role IS NULL;

GRANT SELECT ON public.hub_contributor_scores TO authenticated;

-- 3.1 Course Visibility for Admins
DROP POLICY IF EXISTS "courses_select_admin" ON academic.courses;
CREATE POLICY "courses_select_admin" ON academic.courses FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN academic.departments d ON d.institution_id = p.institution_id
        WHERE d.id = academic.courses.department_id 
        AND p.id = auth.uid() 
        AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
);

-- 4. Re-grant academic permissions just in case
GRANT USAGE ON SCHEMA academic TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA academic TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA academic TO authenticated;
