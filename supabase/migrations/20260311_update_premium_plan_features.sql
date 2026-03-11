-- Migration to update the Premium subscription plan with new features
-- Date: 2026-03-11

UPDATE academic.subscription_plans
SET features = features || '["ai_study_roadmaps", "push_notifications", "advanced_research_tools", "study_progress_tracking"]'::jsonb
WHERE name = 'Premium';

-- Also ensure the Free plan remains basic but has notifications
UPDATE academic.subscription_plans
SET features = '["browse_library", "upload_materials", "community", "profile", "notifications"]'::jsonb
WHERE name = 'Free';
