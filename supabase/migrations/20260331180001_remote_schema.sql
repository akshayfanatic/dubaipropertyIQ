drop extension if exists "pg_net";

do $$
begin
  if not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'developers'
    and c.relrowsecurity = true
  ) then
    alter table "public"."developers" enable row level security;
  end if;
end $$;

