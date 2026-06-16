-- Blog categories and tags
-- Adds taxonomy tables for blog posts without reusing property categories.

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_categories_name_key unique (name),
  constraint blog_categories_slug_key unique (slug)
);

create table if not exists public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_tags_name_key unique (name),
  constraint blog_tags_slug_key unique (slug)
);

alter table public.blogs
  add column if not exists category_id uuid references public.blog_categories(id) on delete set null;

create table if not exists public.blog_post_tags (
  blog_id uuid not null references public.blogs(id) on delete cascade,
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blog_id, tag_id)
);

create index if not exists idx_blog_categories_slug
  on public.blog_categories(slug);

create index if not exists idx_blog_tags_slug
  on public.blog_tags(slug);

create index if not exists idx_blogs_category_id
  on public.blogs(category_id);

create index if not exists idx_blog_post_tags_blog_id
  on public.blog_post_tags(blog_id);

create index if not exists idx_blog_post_tags_tag_id
  on public.blog_post_tags(tag_id);

drop trigger if exists update_blog_categories_updated_at on public.blog_categories;
create trigger update_blog_categories_updated_at
  before update on public.blog_categories
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_blog_tags_updated_at on public.blog_tags;
create trigger update_blog_tags_updated_at
  before update on public.blog_tags
  for each row
  execute function update_updated_at_column();

alter table public.blog_categories enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_post_tags enable row level security;

drop policy if exists "Blog categories are publicly readable" on public.blog_categories;
create policy "Blog categories are publicly readable"
  on public.blog_categories
  for select
  using (true);

drop policy if exists "Admins can manage blog categories" on public.blog_categories;
create policy "Admins can manage blog categories"
  on public.blog_categories
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "Blog tags are publicly readable" on public.blog_tags;
create policy "Blog tags are publicly readable"
  on public.blog_tags
  for select
  using (true);

drop policy if exists "Admins can manage blog tags" on public.blog_tags;
create policy "Admins can manage blog tags"
  on public.blog_tags
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "Blog tag links are publicly readable" on public.blog_post_tags;
create policy "Blog tag links are publicly readable"
  on public.blog_post_tags
  for select
  using (true);

drop policy if exists "Admins can manage blog tag links" on public.blog_post_tags;
create policy "Admins can manage blog tag links"
  on public.blog_post_tags
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

comment on table public.blog_categories is 'Categories used only by blog posts.';
comment on column public.blogs.category_id is 'Primary blog category.';
comment on table public.blog_tags is 'Tags used only by blog posts.';
comment on table public.blog_post_tags is 'Many-to-many relationship between blog posts and blog tags.';
