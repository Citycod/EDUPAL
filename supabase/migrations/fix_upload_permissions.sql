-- Fix missing RLS policies and broadening constraints

-- 1. Broaden 'type' check in resources
-- We need to drop the old constraint and add a more inclusive one
alter table public.resources drop constraint if exists resources_type_check;
alter table public.resources add constraint resources_type_check 
  check (type in ('PDF', 'DOC', 'DOCX', 'PNG', 'JPG', 'JPEG', 'ZIP', 'RAR', 'Video', 'Link'));

-- 2. Add Insert policy for courses
-- Previously, only SELECT was allowed. Uploads need to create courses if they don't exist.
create policy "Authenticated users can create courses"
  on public.courses for insert
  with check (auth.role() = 'authenticated');

-- 3. Ensure resources policies are complete
-- Adding update/delete policies for uploaders
create policy "Users can update own resources"
  on public.resources for update
  using (auth.uid() = uploader_id)
  with check (auth.uid() = uploader_id);

create policy "Users can delete own resources"
  on public.resources for delete
  using (auth.uid() = uploader_id);

-- 4. Storage RLS
-- (Removed problematic alter table storage.objects command as it requires elevated permissions)
-- Supabase Storage RLS is typically enabled by default via the dashboard.
