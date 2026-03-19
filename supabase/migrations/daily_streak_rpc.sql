-- =============================================
-- Migration: Add Daily Streak RPC
-- Description: Creates a function to calculate and update a user's daily login streak
-- =============================================

CREATE OR REPLACE FUNCTION public.update_daily_streak()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_last_date date;
  v_current_streak int;
  v_highest_streak int;
  v_today date := current_date;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;

  -- Get current stats
  SELECT last_action_date, current_streak, highest_streak
  INTO v_last_date, v_current_streak, v_highest_streak
  FROM academic.user_stats
  WHERE user_id = v_user_id;

  -- If record doesn't exist, initialize it safely
  IF NOT FOUND THEN
    INSERT INTO academic.user_stats (user_id, current_streak, highest_streak, last_action_date)
    VALUES (v_user_id, 1, 1, v_today);
    RETURN json_build_object('status', 'initialized', 'streak', 1);
  END IF;

  -- Check logic for streak updates
  IF v_last_date IS NULL THEN
    -- First time action
    v_current_streak := 1;
    v_highest_streak := GREATEST(1, v_highest_streak);
  ELSIF v_last_date = v_today THEN
    -- Already logged action today, no streak change
    RETURN json_build_object('status', 'no_change', 'streak', v_current_streak);
  ELSIF v_last_date = v_today - interval '1 day' THEN
    -- Logged action yesterday, increment streak
    v_current_streak := v_current_streak + 1;
    v_highest_streak := GREATEST(v_current_streak, v_highest_streak);
  ELSE
    -- Missed a day or more, reset streak
    v_current_streak := 1;
  END IF;

  -- Update the user's stats
  UPDATE academic.user_stats
  SET 
    current_streak = v_current_streak,
    highest_streak = v_highest_streak,
    last_action_date = v_today,
    updated_at = now()
  WHERE user_id = v_user_id;

  RETURN json_build_object('status', 'updated', 'streak', v_current_streak, 'highest_streak', v_highest_streak);
END;
$$;

-- Allow authenticated users to call this function to update their own streak on login/action
GRANT EXECUTE ON FUNCTION public.update_daily_streak() TO authenticated;
