-- Ensure existing blog_categories tables have the columns expected by admin CRUD and seeds.
-- This repairs databases where blog_categories existed before the full schema was added.

alter table public.blog_categories
  add column if not exists description text,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists update_blog_categories_updated_at on public.blog_categories;
create trigger update_blog_categories_updated_at
  before update on public.blog_categories
  for each row
  execute function update_updated_at_column();

comment on column public.blog_categories.is_active is 'Controls whether the blog category is available for assignment and public filters.';
