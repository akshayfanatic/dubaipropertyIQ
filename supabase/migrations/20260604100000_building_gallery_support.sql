-- Building gallery support
-- Matches the JSONB ImageObject[] pattern used by properties.photos and areas.photos.

alter table public.buildings
  add column if not exists photos jsonb default '[]'::jsonb;

alter table public.buildings
  alter column photos set default '[]'::jsonb;

update public.buildings
set photos = '[]'::jsonb
where photos is null;

create index if not exists idx_buildings_photos
  on public.buildings using gin (photos);

comment on column public.buildings.photos is
  'SEO-friendly building gallery photos stored as JSON objects with url and alt_tag, matching properties.photos and areas.photos';

-- Public storage bucket for building gallery images.
insert into storage.buckets (id, name, public)
values ('building-photos', 'building-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public read access for building photos" on storage.objects;
drop policy if exists "Authenticated users can upload building photos" on storage.objects;
drop policy if exists "Authenticated users can update building photos" on storage.objects;
drop policy if exists "Authenticated users can delete building photos" on storage.objects;

create policy "Public read access for building photos"
  on storage.objects for select
  using (bucket_id = 'building-photos');

create policy "Authenticated users can upload building photos"
  on storage.objects for insert
  with check (bucket_id = 'building-photos' and auth.role() = 'authenticated');

create policy "Authenticated users can update building photos"
  on storage.objects for update
  using (bucket_id = 'building-photos' and auth.role() = 'authenticated');

create policy "Authenticated users can delete building photos"
  on storage.objects for delete
  using (bucket_id = 'building-photos' and auth.role() = 'authenticated');
