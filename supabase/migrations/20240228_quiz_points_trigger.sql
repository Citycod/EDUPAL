-- =============================================
-- Auto-award points when a quiz result is saved
-- =============================================

-- Trigger function: Awards 20 points when a user completes a quiz or flashcard session
CREATE OR REPLACE FUNCTION academic.trigger_award_quiz_points()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM academic.award_points(
    NEW.user_id,
    20,     -- 20 Points per study session
    0,      -- No download credits for studying
    'quiz_complete',
    'Earned points for completing an AI study session',
    NEW.quiz_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to user_quiz_results table
DROP TRIGGER IF EXISTS on_quiz_completed ON academic.user_quiz_results;
CREATE TRIGGER on_quiz_completed
  AFTER INSERT ON academic.user_quiz_results
  FOR EACH ROW
  EXECUTE FUNCTION academic.trigger_award_quiz_points();
