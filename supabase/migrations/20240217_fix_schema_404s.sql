-- Fix Schema 404s: Establish Public Bridge Views for Votion, Reporting, and Rankings
-- This ensures the PostgREST API can access these features from the default 'public' schema.

-- 0. Ensure base columns exist (in case previous migrations were skipped)
ALTER TABLE academic.resources ADD COLUMN IF NOT EXISTS upvotes_count integer DEFAULT 0;
ALTER TABLE academic.comments ADD COLUMN IF NOT EXISTS upvotes_count integer DEFAULT 0;

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

-- 4. Re-grant academic permissions just in case
GRANT USAGE ON SCHEMA academic TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA academic TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA academic TO authenticated;
