-- =============================================
-- EduPal Gamification System (Points & Credits)
-- =============================================

-- 1. User Stats Table (Stores aggregated points and current credits)
CREATE TABLE IF NOT EXISTS academic.user_stats (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  total_points integer NOT NULL DEFAULT 0,
  download_credits integer NOT NULL DEFAULT 0,
  current_streak integer NOT NULL DEFAULT 0,
  highest_streak integer NOT NULL DEFAULT 0,
  last_action_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE academic.user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_stats_select" ON academic.user_stats;
CREATE POLICY "user_stats_select" ON academic.user_stats
  FOR SELECT USING (true); -- Publicly viewable for leaderboards

DROP POLICY IF EXISTS "user_stats_update" ON academic.user_stats;
CREATE POLICY "user_stats_update" ON academic.user_stats
  FOR UPDATE USING (user_id = auth.uid()); -- Mostly updated via triggers or service role

-- Backfill existing users
INSERT INTO academic.user_stats (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- 2. Trigger to automatically create user_stats for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO academic.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists on public.profiles before creating
DROP TRIGGER IF EXISTS on_profile_created_stats ON public.profiles;
CREATE TRIGGER on_profile_created_stats
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_stats();

-- 3. Point Transactions Ledger (Tracks how points/credits were earned or spent)
CREATE TABLE IF NOT EXISTS academic.point_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points_amount integer NOT NULL DEFAULT 0,  -- Can be negative
  credits_amount integer NOT NULL DEFAULT 0, -- Can be negative
  transaction_type text NOT NULL,            -- 'upload', 'download_spend', 'signup_bonus', etc.
  description text,
  reference_id uuid,                         -- e.g., resource_id
  created_at timestamptz DEFAULT now()
);

ALTER TABLE academic.point_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pt_select_own" ON academic.point_transactions;
CREATE POLICY "pt_select_own" ON academic.point_transactions
  FOR SELECT USING (user_id = auth.uid());

-- 4. Function to safely award points and log transaction
CREATE OR REPLACE FUNCTION academic.award_points(
  p_user_id uuid,
  p_points integer,
  p_credits integer,
  p_type text,
  p_desc text,
  p_ref_id uuid DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Insert into ledger
  INSERT INTO academic.point_transactions (
    user_id, points_amount, credits_amount, transaction_type, description, reference_id
  ) VALUES (
    p_user_id, p_points, p_credits, p_type, p_desc, p_ref_id
  );

  -- Update aggregated stats
  UPDATE academic.user_stats
  SET 
    total_points = total_points + p_points,
    download_credits = download_credits + p_credits,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- If user_stats didn't exist for some reason, insert it
  IF NOT FOUND THEN
    INSERT INTO academic.user_stats (user_id, total_points, download_credits)
    VALUES (p_user_id, p_points, p_credits);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. Trigger: Award points when a user uploads a resource
CREATE OR REPLACE FUNCTION academic.trigger_award_upload_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Only award points if the uploader is known
  IF NEW.uploader_id IS NOT NULL THEN
    PERFORM academic.award_points(
      NEW.uploader_id,
      50,     -- 50 Points
      1,      -- 1 Download Credit
      'upload',
      'Earned points for uploading a document',
      NEW.id  -- Reference the resource ID
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to resources table
DROP TRIGGER IF EXISTS on_resource_uploaded ON academic.resources;
CREATE TRIGGER on_resource_uploaded
  AFTER INSERT ON academic.resources
  FOR EACH ROW
  EXECUTE FUNCTION academic.trigger_award_upload_points();


-- 6. RPC: Consume a download credit (used by API before returning signed URL)
-- Returns boolean: true if successful, false if not enough credits
CREATE OR REPLACE FUNCTION public.consume_download_credit(p_user_id uuid, p_resource_id uuid)
RETURNS boolean AS $$
DECLARE
  v_current_credits integer;
BEGIN
  -- Check current balance
  SELECT download_credits INTO v_current_credits
  FROM academic.user_stats
  WHERE user_id = p_user_id;

  IF v_current_credits IS NULL OR v_current_credits <= 0 THEN
    RETURN false; -- Not enough credits
  END IF;

  -- Deduct credit using our unified function
  PERFORM academic.award_points(
    p_user_id,
    0,      -- 0 Points changes
    -1,     -- -1 Download Credit
    'download_spend',
    'Spent 1 credit to download a document',
    p_resource_id
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 7. View: Hub Leaderboard (combines profiles and stats)
DROP VIEW IF EXISTS public.hub_leaderboard CASCADE;
CREATE OR REPLACE VIEW public.hub_leaderboard AS
SELECT
  p.id as user_id,
  p.full_name,
  p.avatar_url,
  p.institution_id,
  p.department_id,
  p.department_name,
  p.level,
  COALESCE(s.total_points, 0) as total_points,
  COALESCE(s.current_streak, 0) as current_streak,
  RANK() OVER (PARTITION BY p.institution_id ORDER BY COALESCE(s.total_points, 0) DESC, p.created_at ASC) as institution_rank
FROM public.hub_profiles p
LEFT JOIN academic.user_stats s ON p.id = s.user_id
WHERE COALESCE(s.total_points, 0) > 0; -- Only rank people with points

GRANT SELECT ON public.hub_leaderboard TO authenticated;
GRANT SELECT ON public.hub_leaderboard TO anon;

-- 8. View: Hub User Stats (so frontend can read their own credits securely)
DROP VIEW IF EXISTS public.hub_user_stats CASCADE;
CREATE OR REPLACE VIEW public.hub_user_stats AS
SELECT * FROM academic.user_stats
WHERE user_id = auth.uid();

GRANT SELECT ON public.hub_user_stats TO authenticated;
