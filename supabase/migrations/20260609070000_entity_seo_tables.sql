-- Normalize SEO metadata into dedicated per-entity tables.
-- Mirrors the existing public.properties_seo pattern so public entities do not
-- carry search/snippet metadata directly on their primary domain rows.

create table if not exists public.blogs_seo (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blogs(id) on delete cascade,
  meta_title text,
  meta_description text,
  keywords text,
  og_image_url text,
  canonical_url text,
  constraint blogs_seo_blog_id_key unique (blog_id)
);

create table if not exists public.pages_seo (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  meta_title text,
  meta_description text,
  keywords text,
  og_image_url text,
  canonical_url text,
  constraint pages_seo_page_id_key unique (page_id)
);

create table if not exists public.developers_seo (
  id uuid primary key default gen_random_uuid(),
  developer_id uuid not null references public.developers(id) on delete cascade,
  meta_title text,
  meta_description text,
  keywords text,
  og_image_url text,
  canonical_url text,
  constraint developers_seo_developer_id_key unique (developer_id)
);

create table if not exists public.cities_seo (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  meta_title text,
  meta_description text,
  keywords text,
  og_image_url text,
  canonical_url text,
  constraint cities_seo_city_id_key unique (city_id)
);

create table if not exists public.areas_seo (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.areas(id) on delete cascade,
  meta_title text,
  meta_description text,
  keywords text,
  og_image_url text,
  canonical_url text,
  constraint areas_seo_area_id_key unique (area_id)
);

create table if not exists public.buildings_seo (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  meta_title text,
  meta_description text,
  keywords text,
  og_image_url text,
  canonical_url text,
  constraint buildings_seo_building_id_key unique (building_id)
);

create index if not exists idx_blogs_seo_blog_id
  on public.blogs_seo(blog_id);

create index if not exists idx_pages_seo_page_id
  on public.pages_seo(page_id);

create index if not exists idx_developers_seo_developer_id
  on public.developers_seo(developer_id);

create index if not exists idx_cities_seo_city_id
  on public.cities_seo(city_id);

create index if not exists idx_areas_seo_area_id
  on public.areas_seo(area_id);

create index if not exists idx_buildings_seo_building_id
  on public.buildings_seo(building_id);

-- Backfill existing coupled SEO values before removing the columns.
insert into public.blogs_seo (blog_id, meta_title, meta_description)
select id, meta_title, meta_description
from public.blogs
where meta_title is not null
   or meta_description is not null
on conflict (blog_id) do update
set meta_title = excluded.meta_title,
    meta_description = excluded.meta_description;

insert into public.pages_seo (page_id, meta_title, meta_description)
select id, meta_title, meta_description
from public.pages
where meta_title is not null
   or meta_description is not null
on conflict (page_id) do update
set meta_title = excluded.meta_title,
    meta_description = excluded.meta_description;

alter table public.blogs
  drop column if exists meta_title,
  drop column if exists meta_description;

alter table public.pages
  drop column if exists meta_title,
  drop column if exists meta_description;

alter table public.blogs_seo enable row level security;
alter table public.pages_seo enable row level security;
alter table public.developers_seo enable row level security;
alter table public.cities_seo enable row level security;
alter table public.areas_seo enable row level security;
alter table public.buildings_seo enable row level security;

drop policy if exists "Blog SEO is publicly readable" on public.blogs_seo;
create policy "Blog SEO is publicly readable"
  on public.blogs_seo
  for select
  using (true);

drop policy if exists "Admins can manage blog SEO" on public.blogs_seo;
create policy "Admins can manage blog SEO"
  on public.blogs_seo
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "Page SEO is publicly readable" on public.pages_seo;
create policy "Page SEO is publicly readable"
  on public.pages_seo
  for select
  using (true);

drop policy if exists "Admins can manage page SEO" on public.pages_seo;
create policy "Admins can manage page SEO"
  on public.pages_seo
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "Developer SEO is publicly readable" on public.developers_seo;
create policy "Developer SEO is publicly readable"
  on public.developers_seo
  for select
  using (true);

drop policy if exists "Admins can manage developer SEO" on public.developers_seo;
create policy "Admins can manage developer SEO"
  on public.developers_seo
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "City SEO is publicly readable" on public.cities_seo;
create policy "City SEO is publicly readable"
  on public.cities_seo
  for select
  using (true);

drop policy if exists "Admins can manage city SEO" on public.cities_seo;
create policy "Admins can manage city SEO"
  on public.cities_seo
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "Area SEO is publicly readable" on public.areas_seo;
create policy "Area SEO is publicly readable"
  on public.areas_seo
  for select
  using (true);

drop policy if exists "Admins can manage area SEO" on public.areas_seo;
create policy "Admins can manage area SEO"
  on public.areas_seo
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "Building SEO is publicly readable" on public.buildings_seo;
create policy "Building SEO is publicly readable"
  on public.buildings_seo
  for select
  using (true);

drop policy if exists "Admins can manage building SEO" on public.buildings_seo;
create policy "Admins can manage building SEO"
  on public.buildings_seo
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

comment on table public.blogs_seo is 'SEO metadata for blog article pages.';
comment on column public.blogs_seo.blog_id is 'Referenced blog article.';

comment on table public.pages_seo is 'SEO metadata for CMS content pages.';
comment on column public.pages_seo.page_id is 'Referenced CMS page.';

comment on table public.developers_seo is 'SEO metadata for developer profile pages.';
comment on column public.developers_seo.developer_id is 'Referenced developer.';

comment on table public.cities_seo is 'SEO metadata for city landing pages.';
comment on column public.cities_seo.city_id is 'Referenced city.';

comment on table public.areas_seo is 'SEO metadata for area/community landing pages.';
comment on column public.areas_seo.area_id is 'Referenced area/community.';

comment on table public.buildings_seo is 'SEO metadata for building intelligence pages.';
comment on column public.buildings_seo.building_id is 'Referenced building.';
