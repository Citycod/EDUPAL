-- Create Discussions Table
create table if not exists public.discussions (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_deleted boolean default false
);

-- Create Replies Table
create table if not exists public.replies (
  id uuid default uuid_generate_v4() primary key,
  discussion_id uuid references public.discussions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_deleted boolean default false
);

-- Enable RLS
alter table public.discussions enable row level security;
alter table public.replies enable row level security;

-- Policies for Discussions
create policy "Discussions are viewable by everyone" 
  on public.discussions for select using (true);

create policy "Authenticated users can create discussions" 
  on public.discussions for insert with check (auth.role() = 'authenticated');

create policy "Users can update own discussions" 
  on public.discussions for update using (auth.uid() = user_id);

create policy "Users can delete own discussions" 
  on public.discussions for delete using (auth.uid() = user_id);

-- Policies for Replies
create policy "Replies are viewable by everyone" 
  on public.replies for select using (true);

create policy "Authenticated users can create replies" 
  on public.replies for insert with check (auth.role() = 'authenticated');

create policy "Users can update own replies" 
  on public.replies for update using (auth.uid() = user_id);

create policy "Users can delete own replies" 
  on public.replies for delete using (auth.uid() = user_id);

-- Indexes for performance
create index idx_discussions_course_id on public.discussions(course_id);
create index idx_replies_discussion_id on public.replies(discussion_id);
create index idx_discussions_created_at on public.discussions(created_at);
