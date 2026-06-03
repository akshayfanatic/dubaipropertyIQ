-- Lead capture table
-- Stores generic lead submissions from public capture points.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  email text not null,
  phone text,
  nationality text,

  source_page text not null,
  source_type text not null check (
    source_type in (
      'newsletter',
      'property',
      'developer',
      'area',
      'calculator',
      'golden_visa',
      'callback',
      'whatsapp',
      'blog',
      'pdf_download'
    )
  ),

  area_of_interest text,
  message text,

  utm_source text,
  utm_medium text,
  utm_campaign text,

  status text not null default 'new' check (
    status in ('new', 'contacted', 'qualified', 'converted', 'dead')
  ),
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_created_at
  on public.leads(created_at desc);

create index if not exists idx_leads_source_type
  on public.leads(source_type);

create index if not exists idx_leads_status
  on public.leads(status);

create index if not exists idx_leads_email
  on public.leads(email);

alter table public.leads enable row level security;

drop policy if exists "Public can submit leads" on public.leads;
create policy "Public can submit leads"
  on public.leads
  for insert
  with check (true);

drop policy if exists "Admins can manage leads" on public.leads;
create policy "Admins can manage leads"
  on public.leads
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

comment on table public.leads is 'Generic lead capture submissions from public pages and tools.';
comment on column public.leads.source_page is 'URL of the page where the lead was captured.';
comment on column public.leads.source_type is 'Capture source category such as newsletter, property, area, calculator, or callback.';
comment on column public.leads.area_of_interest is 'Free text area, property, developer, calculator, or topic interest supplied by the capture point.';
