-- Property SEO metadata

create table if not exists public.properties_seo (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  meta_title text,
  meta_description text,
  keywords text,
  og_image_url text,
  canonical_url text,
  constraint properties_seo_property_id_key unique (property_id)
);

create index if not exists idx_properties_seo_property_id
  on public.properties_seo(property_id);

alter table public.properties_seo enable row level security;

drop policy if exists "Property SEO is publicly readable" on public.properties_seo;
create policy "Property SEO is publicly readable"
  on public.properties_seo
  for select
  using (true);

drop policy if exists "Admins can manage property SEO" on public.properties_seo;
create policy "Admins can manage property SEO"
  on public.properties_seo
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

comment on table public.properties_seo is 'SEO metadata for property listing pages.';
comment on column public.properties_seo.property_id is 'Referenced property listing.';
