-- Buildings and building intelligence data

create table if not exists public.buildings (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.areas(id) on delete cascade,
  city_id uuid not null references public.cities(id) on delete cascade,
  developer_id uuid references public.developers(id) on delete set null,

  name text not null,
  slug text not null,
  description text,
  address text,
  location jsonb,
  photos jsonb default '[]'::jsonb,

  building_type text,
  ownership_type text,
  completion_year integer,
  total_floors integer,
  total_units integer,
  property_types jsonb default '[]'::jsonb,

  avg_price_per_sqft numeric(12, 2),
  area_avg_price_per_sqft numeric(12, 2),
  rental_yield numeric(5, 2),
  service_charge_aed_per_sqft numeric(10, 2),
  short_term_rental_potential text,
  demand_level text,

  liquidity_score integer check (liquidity_score is null or (liquidity_score >= 0 and liquidity_score <= 100)),
  capital_growth_score integer check (capital_growth_score is null or (capital_growth_score >= 0 and capital_growth_score <= 100)),
  lifestyle_score integer check (lifestyle_score is null or (lifestyle_score >= 0 and lifestyle_score <= 100)),
  overall_score integer check (overall_score is null or (overall_score >= 0 and overall_score <= 100)),

  amenities jsonb default '[]'::jsonb,
  nearby_places jsonb default '[]'::jsonb,
  unit_price_ranges jsonb default '[]'::jsonb,
  rental_ranges jsonb default '[]'::jsonb,
  transaction_summary jsonb default '{}'::jsonb,
  pros jsonb default '[]'::jsonb,
  cons jsonb default '[]'::jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint buildings_area_slug_key unique (area_id, slug),
  constraint buildings_area_name_key unique (area_id, name)
);

create index if not exists idx_buildings_area_id on public.buildings(area_id);
create index if not exists idx_buildings_city_id on public.buildings(city_id);
create index if not exists idx_buildings_developer_id on public.buildings(developer_id);
create index if not exists idx_buildings_slug on public.buildings(slug);
create index if not exists idx_buildings_overall_score on public.buildings(overall_score desc);
create index if not exists idx_buildings_rental_yield on public.buildings(rental_yield desc);

drop trigger if exists update_buildings_updated_at on public.buildings;
create trigger update_buildings_updated_at
  before update on public.buildings
  for each row
  execute function public.update_updated_at_column();

alter table public.buildings enable row level security;

drop policy if exists "Buildings are publicly readable" on public.buildings;
create policy "Buildings are publicly readable"
  on public.buildings
  for select
  using (true);

drop policy if exists "Admins can manage buildings" on public.buildings;
create policy "Admins can manage buildings"
  on public.buildings
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

comment on table public.buildings is 'Buildings linked to areas for building intelligence reports.';
comment on column public.buildings.area_id is 'Area/community this building belongs to.';
comment on column public.buildings.city_id is 'City this building belongs to. Kept for faster filters and admin workflows.';
comment on column public.buildings.photos is 'Building photos stored as ImageObject JSON array.';
comment on column public.buildings.location is 'Map location JSON, usually {lat,lng}.';
comment on column public.buildings.unit_price_ranges is 'Unit-level sale price intelligence, for example studio, 1BR, 2BR, 3BR.';
comment on column public.buildings.rental_ranges is 'Unit-level rental range and yield intelligence.';
comment on column public.buildings.transaction_summary is 'Flexible transaction metrics for building intelligence reports.';
