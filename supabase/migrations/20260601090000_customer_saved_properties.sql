-- Customer saved properties wishlist

create table if not exists public.customer_saved_properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint customer_saved_properties_user_property_key unique (user_id, property_id)
);

create index if not exists idx_customer_saved_properties_user_id
  on public.customer_saved_properties(user_id);

create index if not exists idx_customer_saved_properties_property_id
  on public.customer_saved_properties(property_id);

alter table public.customer_saved_properties enable row level security;

drop policy if exists "Customers can read their saved properties" on public.customer_saved_properties;
create policy "Customers can read their saved properties"
  on public.customer_saved_properties
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Customers can save properties" on public.customer_saved_properties;
create policy "Customers can save properties"
  on public.customer_saved_properties
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Customers can remove their saved properties" on public.customer_saved_properties;
create policy "Customers can remove their saved properties"
  on public.customer_saved_properties
  for delete
  to authenticated
  using (auth.uid() = user_id);

comment on table public.customer_saved_properties is 'Customer wishlist rows linking users to saved property listings.';
