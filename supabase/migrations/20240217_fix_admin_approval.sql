-- Admin Approval Fix: Enable UPDATE and DELETE on the hub_resources view
-- This allows school admins to toggle verification and delete materials through the public view

-- 1. Update Function to handle status toggling & deletions via Public View
CREATE OR REPLACE FUNCTION public.modify_hub_resources()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        -- Only permit updating specific moderation fields
        UPDATE academic.resources 
        SET 
            is_verified = COALESCE(NEW.is_verified, OLD.is_verified),
            title = COALESCE(NEW.title, OLD.title),
            description = COALESCE(NEW.description, OLD.description)
        WHERE id = OLD.id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM academic.resources WHERE id = OLD.id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach Triggers
DROP TRIGGER IF EXISTS on_hub_resources_modify ON public.hub_resources;
CREATE TRIGGER on_hub_resources_modify
INSTEAD OF UPDATE OR DELETE ON public.hub_resources
FOR EACH ROW EXECUTE FUNCTION public.modify_hub_resources();

-- 3. Ensure RLS allows the update for admins
-- (This should already be in academic_resources_update_inst, but we re-verify or add if missing)
DROP POLICY IF EXISTS "resources_update_admin_v2" ON academic.resources;
CREATE POLICY "resources_update_admin_v2" ON academic.resources 
FOR UPDATE USING (
    public.is_admin() OR (institution_id = public.get_user_institution_id())
)
WITH CHECK (
    public.is_admin() OR (institution_id = public.get_user_institution_id())
);
