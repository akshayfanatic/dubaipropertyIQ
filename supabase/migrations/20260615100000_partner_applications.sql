-- Partner registration applications and account scaffolding
-- PRD V1 prepares database models for agent/developer accounts while self-serve portal UI remains V2.

do $$
begin
  if exists (select 1 from pg_type where typname = 'app_role') then
    alter type public.app_role add value if not exists 'developer';
  end if;

  if not exists (select 1 from pg_type where typname = 'partner_application_status') then
    create type public.partner_application_status as enum ('pending', 'reviewing', 'approved', 'rejected');
  end if;

  if not exists (select 1 from pg_type where typname = 'partner_account_status') then
    create type public.partner_account_status as enum ('pending', 'active', 'suspended', 'rejected');
  end if;
end $$;

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  target_role public.app_role not null,
  full_name text not null,
  email text not null,
  phone text,
  whatsapp text,

  status public.partner_application_status not null default 'pending',
  admin_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partner_applications_target_role_check check (target_role in ('agent', 'developer'))
);

create table if not exists public.agent_application_details (
  application_id uuid primary key references public.partner_applications(id) on delete cascade,
  company_name text,
  agency_name text,
  rera_number text not null,
  broker_id text,
  experience_years integer,
  areas_of_focus text,
  logo_url jsonb,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.developer_application_details (
  application_id uuid primary key references public.partner_applications(id) on delete cascade,
  company_name text not null,
  trade_license_number text,
  authorized_contact_name text,
  contact_email text,
  contact_phone text,
  website_url text,
  logo_url jsonb,
  active_project_details text,
  bulk_upload_required boolean not null default false,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references public.partner_applications(id) on delete set null,
  company_name text,
  agency_name text,
  rera_number text not null,
  broker_id text,
  contact_name text,
  email text not null,
  phone text,
  whatsapp text,
  logo_url jsonb,
  status public.partner_account_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agent_profiles_user_id_key unique (user_id),
  constraint agent_profiles_application_id_key unique (application_id)
);

create table if not exists public.developer_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references public.partner_applications(id) on delete set null,
  developer_id uuid references public.developers(id) on delete set null,
  company_name text not null,
  trade_license_number text,
  authorized_contact_name text,
  email text not null,
  phone text,
  website_url text,
  logo_url jsonb,
  status public.partner_account_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint developer_accounts_user_id_key unique (user_id),
  constraint developer_accounts_application_id_key unique (application_id)
);

create index if not exists idx_partner_applications_user_id
  on public.partner_applications(user_id);

create index if not exists idx_partner_applications_target_role_status
  on public.partner_applications(target_role, status);

create index if not exists idx_partner_applications_created_at
  on public.partner_applications(created_at desc);

create unique index if not exists idx_partner_applications_open_user_target_role
  on public.partner_applications(user_id, target_role)
  where status in ('pending', 'reviewing');

create index if not exists idx_agent_profiles_status
  on public.agent_profiles(status);

create index if not exists idx_developer_accounts_status
  on public.developer_accounts(status);

create index if not exists idx_developer_accounts_developer_id
  on public.developer_accounts(developer_id);

drop trigger if exists update_partner_applications_updated_at on public.partner_applications;
create trigger update_partner_applications_updated_at
  before update on public.partner_applications
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_agent_application_details_updated_at on public.agent_application_details;
create trigger update_agent_application_details_updated_at
  before update on public.agent_application_details
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_developer_application_details_updated_at on public.developer_application_details;
create trigger update_developer_application_details_updated_at
  before update on public.developer_application_details
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_agent_profiles_updated_at on public.agent_profiles;
create trigger update_agent_profiles_updated_at
  before update on public.agent_profiles
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_developer_accounts_updated_at on public.developer_accounts;
create trigger update_developer_accounts_updated_at
  before update on public.developer_accounts
  for each row
  execute function update_updated_at_column();

alter table public.partner_applications enable row level security;
alter table public.agent_application_details enable row level security;
alter table public.developer_application_details enable row level security;
alter table public.agent_profiles enable row level security;
alter table public.developer_accounts enable row level security;

drop policy if exists "Customers can read their partner applications" on public.partner_applications;
create policy "Customers can read their partner applications"
  on public.partner_applications
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Customers can submit partner applications" on public.partner_applications;
create policy "Customers can submit partner applications"
  on public.partner_applications
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Admins can manage partner applications" on public.partner_applications;
create policy "Admins can manage partner applications"
  on public.partner_applications
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "Customers can read their agent application details" on public.agent_application_details;
create policy "Customers can read their agent application details"
  on public.agent_application_details
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.partner_applications
      where partner_applications.id = agent_application_details.application_id
        and partner_applications.user_id = auth.uid()
        and partner_applications.target_role = 'agent'
    )
  );

drop policy if exists "Customers can submit their agent application details" on public.agent_application_details;
create policy "Customers can submit their agent application details"
  on public.agent_application_details
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.partner_applications
      where partner_applications.id = agent_application_details.application_id
        and partner_applications.user_id = auth.uid()
        and partner_applications.target_role = 'agent'
    )
  );

drop policy if exists "Admins can manage agent application details" on public.agent_application_details;
create policy "Admins can manage agent application details"
  on public.agent_application_details
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "Customers can read their developer application details" on public.developer_application_details;
create policy "Customers can read their developer application details"
  on public.developer_application_details
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.partner_applications
      where partner_applications.id = developer_application_details.application_id
        and partner_applications.user_id = auth.uid()
        and partner_applications.target_role = 'developer'
    )
  );

drop policy if exists "Customers can submit their developer application details" on public.developer_application_details;
create policy "Customers can submit their developer application details"
  on public.developer_application_details
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.partner_applications
      where partner_applications.id = developer_application_details.application_id
        and partner_applications.user_id = auth.uid()
        and partner_applications.target_role = 'developer'
    )
  );

drop policy if exists "Admins can manage developer application details" on public.developer_application_details;
create policy "Admins can manage developer application details"
  on public.developer_application_details
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "Agents can read their profile" on public.agent_profiles;
create policy "Agents can read their profile"
  on public.agent_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins can manage agent profiles" on public.agent_profiles;
create policy "Admins can manage agent profiles"
  on public.agent_profiles
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

drop policy if exists "Developers can read their account" on public.developer_accounts;
create policy "Developers can read their account"
  on public.developer_accounts
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins can manage developer accounts" on public.developer_accounts;
create policy "Admins can manage developer accounts"
  on public.developer_accounts
  for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

comment on table public.partner_applications is 'Customer-submitted partner applications for agent or developer review.';
comment on column public.partner_applications.target_role is 'Requested app role. Only agent and developer are allowed application targets.';
comment on column public.partner_applications.status is 'Review status only. This does not grant user role permissions.';
comment on table public.agent_application_details is 'Agent-specific details attached to a partner application.';
comment on column public.agent_application_details.rera_number is 'Agent RERA/registration number supplied by applicant.';
comment on column public.agent_application_details.broker_id is 'Agent broker ID from PRD seller portal requirements.';
comment on table public.developer_application_details is 'Developer-specific details attached to a partner application.';
comment on column public.developer_application_details.trade_license_number is 'Developer company trade license number supplied by applicant.';
comment on table public.agent_profiles is 'Approved agent account/profile scaffold for V2 self-serve listing portal.';
comment on table public.developer_accounts is 'Approved developer account scaffold for V2 bulk project upload and analytics portal.';
