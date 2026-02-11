-- Create Storage Buckets
insert into storage.buckets (id, name, public)
values ('resources', 'resources', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up security policies for 'resources'
create policy "Public Access to Resources"
  on storage.objects for select
  using ( bucket_id = 'resources' );

create policy "Authenticated Users can Upload Resources"
  on storage.objects for insert
  with check ( bucket_id = 'resources' and auth.role() = 'authenticated' );

create policy "Users can update their own Resources"
  on storage.objects for update
  using ( bucket_id = 'resources' and auth.uid() = owner )
  with check ( bucket_id = 'resources' and auth.uid() = owner );

create policy "Users can delete their own Resources"
  on storage.objects for delete
  using ( bucket_id = 'resources' and auth.uid() = owner );

-- Set up security policies for 'avatars'
create policy "Public Access to Avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Authenticated Users can Upload Avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

create policy "Users can update their own Avatars"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.uid() = owner )
  with check ( bucket_id = 'avatars' and auth.uid() = owner );

create policy "Users can delete their own Avatars"
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.uid() = owner );
