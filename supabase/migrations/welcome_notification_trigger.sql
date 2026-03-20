-- =============================================
-- Migration: Welcome Notification Trigger
-- Description: Automatically inserts a welcome notification when a new profile is created.
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, action_url)
  VALUES (
    NEW.id,
    'system',
    'Welcome to EduPal! 🎉',
    'We are thrilled to have you! Start exploring past questions, chat with the AI Coach, and build your daily study streak.',
    '/home'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists and drop it to ensure idempotency
DROP TRIGGER IF EXISTS on_profile_created_notification ON public.profiles;

-- Create the trigger on the profiles table
CREATE TRIGGER on_profile_created_notification
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_welcome_notification();
