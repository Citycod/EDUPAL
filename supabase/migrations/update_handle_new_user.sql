-- Update handle_new_user to include university
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, university, major, year)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'university',
    new.raw_user_meta_data->>'major',
    new.raw_user_meta_data->>'year'
  );
  return new;
end;
$$ language plpgsql security definer;
