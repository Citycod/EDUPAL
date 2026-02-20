-- Fix hub_resources view: Add INSTEAD OF UPDATE trigger
-- This allows admins to update is_verified, type, title, etc. directly on the view.

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_hub_resources_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE academic.resources
    SET
        title = NEW.title,
        description = NEW.description,
        type = NEW.type,
        is_verified = NEW.is_verified,
        updated_at = now()
    WHERE id = OLD.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach the trigger to the view
DROP TRIGGER IF EXISTS on_hub_resources_update ON public.hub_resources;
CREATE TRIGGER on_hub_resources_update
INSTEAD OF UPDATE ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_resources_update();

-- 3. Ensure permissions
GRANT UPDATE ON public.hub_resources TO authenticated;
