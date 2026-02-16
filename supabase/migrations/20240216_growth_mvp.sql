-- ============================================
-- EduPal Growth MVP: Comment Votes, Contributor Scores, Hub Views
-- ============================================

-- 1. Add upvotes_count to comments
ALTER TABLE academic.comments
ADD COLUMN IF NOT EXISTS upvotes_count integer DEFAULT 0;

-- 2. Comment Votes Table (mirrors resource_votes pattern)
CREATE TABLE IF NOT EXISTS academic.comment_votes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    comment_id uuid REFERENCES academic.comments(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, comment_id)
);

ALTER TABLE academic.comment_votes ENABLE ROW LEVEL SECURITY;

-- 3. RLS for comment_votes (institution-scoped)

-- SELECT: Users can see votes for comments in their institution
DROP POLICY IF EXISTS "comment_votes_select_inst" ON academic.comment_votes;
CREATE POLICY "comment_votes_select_inst" ON academic.comment_votes FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM academic.student_profiles sp
        JOIN academic.comments cm ON cm.id = academic.comment_votes.comment_id
        JOIN academic.posts po ON po.id = cm.post_id
        JOIN academic.courses co ON co.id = po.course_id
        JOIN academic.departments d ON d.id = co.department_id
        WHERE d.institution_id = sp.institution_id AND sp.id = auth.uid()
    )
);

-- INSERT: Users can vote on comments in their institution
DROP POLICY IF EXISTS "comment_votes_insert_inst" ON academic.comment_votes;
CREATE POLICY "comment_votes_insert_inst" ON academic.comment_votes FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM academic.student_profiles sp
        JOIN academic.comments cm ON cm.id = academic.comment_votes.comment_id
        JOIN academic.posts po ON po.id = cm.post_id
        JOIN academic.courses co ON co.id = po.course_id
        JOIN academic.departments d ON d.id = co.department_id
        WHERE d.institution_id = sp.institution_id AND sp.id = auth.uid()
    )
);

-- DELETE: Users can remove their own votes
DROP POLICY IF EXISTS "comment_votes_delete_own" ON academic.comment_votes;
CREATE POLICY "comment_votes_delete_own" ON academic.comment_votes FOR DELETE USING (auth.uid() = user_id);

-- 4. Trigger to sync comment upvotes_count (same pattern as resources)
CREATE OR REPLACE FUNCTION academic.sync_comment_upvotes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE academic.comments
        SET upvotes_count = upvotes_count + 1
        WHERE id = NEW.comment_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE academic.comments
        SET upvotes_count = GREATEST(0, upvotes_count - 1)
        WHERE id = OLD.comment_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_vote_sync ON academic.comment_votes;
CREATE TRIGGER on_comment_vote_sync
AFTER INSERT OR DELETE ON academic.comment_votes
FOR EACH ROW EXECUTE FUNCTION academic.sync_comment_upvotes();

-- 5. Contributor Scores View (real-time leaderboard)
DROP VIEW IF EXISTS public.contributor_scores CASCADE;
CREATE OR REPLACE VIEW public.contributor_scores AS
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

GRANT SELECT ON public.contributor_scores TO authenticated;

-- 6. Update hub_comments view (add upvotes, author info)
DROP VIEW IF EXISTS public.hub_comments CASCADE;
CREATE OR REPLACE VIEW public.hub_comments AS
SELECT
    c.id,
    c.post_id,
    c.author_id,
    c.content,
    c.upvotes_count,
    c.created_at,
    p.full_name AS author_name,
    p.avatar_url AS author_avatar
FROM academic.comments c
LEFT JOIN public.profiles p ON c.author_id = p.id;

GRANT SELECT ON public.hub_comments TO authenticated;

-- 7. INSTEAD OF INSERT trigger for hub_comments (so frontend can insert via view)
CREATE OR REPLACE FUNCTION public.handle_hub_comment_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO academic.comments (post_id, author_id, content)
    VALUES (NEW.post_id, NEW.author_id, NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS hub_comments_insert ON public.hub_comments;
CREATE TRIGGER hub_comments_insert
INSTEAD OF INSERT ON public.hub_comments
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_comment_insert();

-- 8. Grant permissions on new table
GRANT ALL ON academic.comment_votes TO authenticated;
GRANT ALL ON academic.comments TO authenticated;
