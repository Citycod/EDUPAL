-- Add department and level columns to resources table
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS level text;

-- (Optional) Add indexes for better filtering performance
CREATE INDEX IF NOT EXISTS idx_resources_department ON public.resources(department);
CREATE INDEX IF NOT EXISTS idx_resources_level ON public.resources(level);
