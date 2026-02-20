-- Fix Admin Permissions and Triggers
-- 1. Ensure hub_resources trigger is applied (FORCE RECREATE)
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

DROP TRIGGER IF EXISTS on_hub_resources_update ON public.hub_resources;
CREATE TRIGGER on_hub_resources_update
INSTEAD OF UPDATE ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_resources_update();

-- 2. Ensure hub_resource_reports is accessible
DROP VIEW IF EXISTS public.hub_resource_reports CASCADE;
CREATE OR REPLACE VIEW public.hub_resource_reports AS
SELECT * FROM academic.resource_reports;

-- 3. Explicit Grants for Admin/Authenticated Users
GRANT SELECT, UPDATE ON public.hub_resources TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.hub_resource_reports TO authenticated;
GRANT ALL ON academic.resources TO authenticated; -- Simplify for now, rely on RLS
GRANT ALL ON academic.resource_reports TO authenticated;
