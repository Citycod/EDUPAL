-- EduPal MVP Extensions: Votes, Reports, and Verification

-- 1. Modify Resources Table
ALTER TABLE academic.resources 
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS upvotes_count integer DEFAULT 0;

-- 2. Resource Votes Table
CREATE TABLE IF NOT EXISTS academic.resource_votes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    resource_id uuid REFERENCES academic.resources(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, resource_id)
);

-- 3. Resource Reports Table
CREATE TABLE IF NOT EXISTS academic.resource_reports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    resource_id uuid REFERENCES academic.resources(id) ON DELETE CASCADE NOT NULL,
    reason text NOT NULL,
    details text,
    status text DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'rejected'
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE academic.resource_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.resource_reports ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES

-- 5.1 RESOURCE VOTES
-- Users can see votes for resources in their institution
CREATE POLICY "votes_select_inst" ON academic.resource_votes FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM academic.student_profiles sp
        JOIN academic.resources r ON r.id = academic.resource_votes.resource_id
        JOIN academic.courses c ON c.id = r.course_id
        JOIN academic.departments d ON d.id = c.department_id
        WHERE d.institution_id = sp.institution_id AND sp.id = auth.uid()
    )
);

-- Users can insert their own votes if the resource belongs to their institution
CREATE POLICY "votes_insert_own_inst" ON academic.resource_votes FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM academic.student_profiles sp
        JOIN academic.resources r ON r.id = academic.resource_votes.resource_id
        JOIN academic.courses c ON c.id = r.course_id
        JOIN academic.departments d ON d.id = c.department_id
        WHERE d.institution_id = sp.institution_id AND sp.id = auth.uid()
    )
);

-- Users can delete their own votes
CREATE POLICY "votes_delete_own" ON academic.resource_votes FOR DELETE USING (auth.uid() = user_id);

-- 5.2 RESOURCE REPORTS
-- Users can see their own reports
CREATE POLICY "reports_select_own" ON academic.resource_reports FOR SELECT USING (auth.uid() = reporter_id);

-- Users can insert reports for resources in their institution
CREATE POLICY "reports_insert_own_inst" ON academic.resource_reports FOR INSERT WITH CHECK (
    auth.uid() = reporter_id AND
    EXISTS (
        SELECT 1 FROM academic.student_profiles sp
        JOIN academic.resources r ON r.id = academic.resource_reports.resource_id
        JOIN academic.courses c ON c.id = r.course_id
        JOIN academic.departments d ON d.id = c.department_id
        WHERE d.institution_id = sp.institution_id AND sp.id = auth.uid()
    )
);

-- School Admins can see all reports for their institution
CREATE POLICY "reports_select_admin" ON academic.resource_reports FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN academic.resources r ON r.id = academic.resource_reports.resource_id
        JOIN academic.courses c ON c.id = r.course_id
        JOIN academic.departments d ON d.id = c.department_id
        WHERE d.institution_id = p.institution_id 
        AND p.id = auth.uid() 
        AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
);

-- 5.3 RESOURCE MODERATION (is_verified)
-- Only admins can update is_verified
CREATE POLICY "resources_update_admin" ON academic.resources FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN academic.courses c ON c.id = academic.resources.course_id
        JOIN academic.departments d ON d.id = c.department_id
        WHERE d.institution_id = p.institution_id 
        AND p.id = auth.uid() 
        AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN academic.courses c ON c.id = academic.resources.course_id
        JOIN academic.departments d ON d.id = c.department_id
        WHERE d.institution_id = p.institution_id 
        AND p.id = auth.uid() 
        AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
);

-- 6. Trigger to sync upvotes_count (Optional but helpful for MVP "Trending")
CREATE OR REPLACE FUNCTION academic.sync_resource_upvotes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE academic.resources 
        SET upvotes_count = upvotes_count + 1 
        WHERE id = NEW.resource_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE academic.resources 
        SET upvotes_count = GREATEST(0, upvotes_count - 1) 
        WHERE id = OLD.resource_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_resource_vote_sync
AFTER INSERT OR DELETE ON academic.resource_votes
FOR EACH ROW EXECUTE FUNCTION academic.sync_resource_upvotes();

-- 7. Update Public Views to include new columns
DROP VIEW IF EXISTS public.hub_resources CASCADE;
CREATE OR REPLACE VIEW public.hub_resources AS
SELECT 
  r.*,
  p.full_name as uploader_name,
  p.avatar_url as uploader_avatar,
  c.course_code,
  c.title as course_title,
  s.name as session_name
FROM academic.resources r
LEFT JOIN public.profiles p ON r.uploader_id = p.id
LEFT JOIN academic.courses c ON r.course_id = c.id
LEFT JOIN academic.departments d ON c.department_id = d.id
LEFT JOIN academic.academic_sessions s ON r.session_id = s.id;

GRANT SELECT ON public.hub_resources TO authenticated;
