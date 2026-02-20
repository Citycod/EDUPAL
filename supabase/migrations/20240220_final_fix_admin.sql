-- FINAL FIX: Admin Reports and Resources
-- 2024-02-20

-- 1. FORCE FIX: hub_resources UPDATE Trigger
-- We use SECURITY DEFINER to ensure the trigger has permissions to update the underlying table
-- regardless of the RLS on the view (though RLS on the table still applies).
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

-- Grant explicitly to ensure no permission issues
GRANT UPDATE ON public.hub_resources TO authenticated;


-- 2. FORCE FIX: Admin Reports View (FLATTENED)
-- Instead of relying on client-join which is failing, we create a pre-joined view.
DROP VIEW IF EXISTS public.hub_reports_view CASCADE;

CREATE OR REPLACE VIEW public.hub_reports_view AS
SELECT 
    rep.id as report_id,
    rep.reason,
    rep.details,
    rep.status,
    rep.created_at,
    -- Resource Details
    res.id as resource_id,
    res.title as resource_title,
    res.type as resource_type,
    res.is_verified as resource_verified,
    res.file_url as resource_url,
    -- Reporter Details
    p.id as reporter_id,
    p.full_name as reporter_name,
    p.avatar_url as reporter_avatar,
    p.email as reporter_email
FROM academic.resource_reports rep
LEFT JOIN academic.resources res ON rep.resource_id = res.id
LEFT JOIN public.profiles p ON rep.reporter_id = p.id;

-- Grant access
GRANT SELECT, UPDATE ON public.hub_reports_view TO authenticated;

-- Allow updating status directly on this view if needed (optional, but good for "Resolve")
CREATE OR REPLACE FUNCTION public.handle_hub_report_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE academic.resource_reports
    SET status = NEW.status
    WHERE id = OLD.report_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_hub_report_update
INSTEAD OF UPDATE ON public.hub_reports_view
FOR EACH ROW EXECUTE FUNCTION public.handle_hub_report_update();
