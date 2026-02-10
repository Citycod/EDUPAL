-- Update handle_new_user to use UI Avatars for default avatar
create or replace function public.handle_new_user()
returns trigger as $$
declare
  fullname text;
  default_avatar_url text;
begin
  fullname := new.raw_user_meta_data->>'full_name';
  
  -- Use UI Avatars service to generate an avatar with initials
  -- color=fff&background=13ec6a matches the site primary color (green)
  if fullname is not null then
    default_avatar_url := 'https://ui-avatars.com/api/?name=' || replace(fullname, ' ', '+') || '&background=13ec6a&color=fff&bold=true';
  else
    default_avatar_url := 'https://ui-avatars.com/api/?name=Student&background=random';
  end if;

  insert into public.profiles (id, email, full_name, avatar_url, university, major, year)
  values (
    new.id, 
    new.email, 
    fullname, 
    coalesce(new.raw_user_meta_data->>'avatar_url', default_avatar_url),
    new.raw_user_meta_data->>'university',
    new.raw_user_meta_data->>'major',
    new.raw_user_meta_data->>'year'
  );
  return new;
end;
$$ language plpgsql security definer;
