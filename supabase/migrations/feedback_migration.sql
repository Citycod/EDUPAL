-- =============================================
-- FEEDBACK COLLECTION SYSTEM
-- =============================================

-- 1. Create feedback table in public schema
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  institution_id uuid REFERENCES academic.institutions(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'bug', 'feature', 'content', 'ai_response')),
  mood integer CHECK (mood BETWEEN 1 AND 4), -- 1=angry, 2=meh, 3=happy, 4=love
  message text,
  context jsonb DEFAULT '{}', -- { page, resource_id, message_preview, etc. }
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived')),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 3. Policies

-- Users can insert their own feedback
DROP POLICY IF EXISTS "feedback_insert_own" ON public.feedback;
CREATE POLICY "feedback_insert_own" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own feedback
DROP POLICY IF EXISTS "feedback_select_own" ON public.feedback;
CREATE POLICY "feedback_select_own" ON public.feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all feedback for their institution
DROP POLICY IF EXISTS "feedback_select_admin" ON public.feedback;
CREATE POLICY "feedback_select_admin" ON public.feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
  );

-- Admins can update feedback status
DROP POLICY IF EXISTS "feedback_update_admin" ON public.feedback;
CREATE POLICY "feedback_update_admin" ON public.feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'school_admin', 'super_admin')
    )
  );

-- 4. Hub view for consistent access pattern
DROP VIEW IF EXISTS public.hub_feedback CASCADE;
CREATE OR REPLACE VIEW public.hub_feedback AS
SELECT
  f.*,
  p.full_name as user_name,
  p.avatar_url as user_avatar,
  p.email as user_email
FROM public.feedback f
LEFT JOIN public.profiles p ON f.user_id = p.id;

GRANT SELECT ON public.hub_feedback TO authenticated;

-- 5. Allow status updates through the view
CREATE OR REPLACE FUNCTION public.handle_hub_feedback_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.feedback
    SET status = NEW.status
    WHERE id = OLD.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_hub_feedback_update ON public.hub_feedback;
CREATE TRIGGER on_hub_feedback_update
INSTEAD OF UPDATE ON public.hub_feedback
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_feedback_update();

GRANT UPDATE ON public.hub_feedback TO authenticated;
