-- EDUPAL COMPREHENSIVE SCHEMA

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES

-- Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  username text unique,
  full_name text,
  avatar_url text,
  university text,
  major text,
  year text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Courses Table
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  course_code text unique not null,
  title text not null,
  description text,
  instructor_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enrollments Table
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- Resources Table (Materials/Past Questions)
create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  type text check (type in ('PDF', 'DOC', 'Video', 'Link')),
  category text check (category in ('past-questions', 'lecture-notes', 'summaries', 'assignments')),
  course_id uuid references public.courses(id) on delete set null,
  file_url text, -- For actual file path
  thumbnail_url text,
  uploader_id uuid references public.profiles(id) on delete set null,
  file_size text,
  pages integer,
  downloads_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Resource Reviews
create table public.resource_reviews (
  id uuid default uuid_generate_v4() primary key,
  resource_id uuid references public.resources(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(resource_id, user_id)
);

-- Community Posts
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Post Tags
create table public.post_tags (
  post_id uuid references public.posts(id) on delete cascade not null,
  tag text not null,
  primary key (post_id, tag)
);

-- Post Likes
create table public.post_likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (post_id, user_id)
);

-- Comments Table
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  parent_id uuid references public.comments(id) on delete cascade, -- For nested replies
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comment Likes
create table public.comment_likes (
  comment_id uuid references public.comments(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (comment_id, user_id)
);

-- Notifications Table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- e.g., 'like', 'comment', 'system', 'course_update'
  content text not null,
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. INDEXES for Performance
create index idx_resources_course_id on public.resources(course_id);
create index idx_resources_uploader_id on public.resources(uploader_id);
create index idx_comments_post_id on public.comments(post_id);
create index idx_comments_parent_id on public.comments(parent_id);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_enrollments_user_id on public.enrollments(user_id);

-- 4. ROW LEVEL SECURITY (RLS) policies

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.resources enable row level security;
alter table public.resource_reviews enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.post_likes enable row level security;
alter table public.comments enable row level security;
alter table public.comment_likes enable row level security;
alter table public.notifications enable row level security;

-- Profiles: Public read, self-edit
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Courses: Public read
create policy "Courses are viewable by everyone" on public.courses for select using (true);

-- Enrollments: User read own, User create own
create policy "Users can view own enrollments" on public.enrollments for select using (auth.uid() = user_id);
create policy "Users can enroll themselves" on public.enrollments for insert with check (auth.uid() = user_id);

-- Resources: Public read, Auth create
create policy "Resources are viewable by everyone" on public.resources for select using (true);
create policy "Authenticated users can upload resources" on public.resources for insert with check (auth.role() = 'authenticated');

-- Posts/Comments: Public read, Auth create, Author delete/edit
create policy "Posts are viewable by everyone" on public.posts for select using (true);
create policy "Users can create posts" on public.posts for insert with check (auth.uid() = author_id);
create policy "Users can edit own posts" on public.posts for update using (auth.uid() = author_id);

create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Users can create comments" on public.comments for insert with check (auth.uid() = author_id);

-- Likes: Auth can like, Read public
create policy "Likes are viewable by everyone" on public.post_likes for select using (true);
create policy "Users can like posts" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike posts" on public.post_likes for delete using (auth.uid() = user_id);

-- Notifications: User read/update own
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- 5. FUNCTIONS & TRIGGERS

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at timestamp trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
