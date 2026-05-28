alter table "public"."properties" alter column "status" drop default;

alter type "public"."property_status_enum" rename to "property_status_enum__old_version_to_be_dropped";

create type "public"."property_status_enum" as enum ('available', 'sold', 'reserved', 'off_plan', 'draft');


  create table "public"."properties_faqs" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid not null,
    "question" text not null,
    "answer" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."properties_faqs" enable row level security;


  create table "public"."site_settings" (
    "id" uuid not null default gen_random_uuid(),
    "key" text not null,
    "value" jsonb not null,
    "group" text not null,
    "label" text not null,
    "type" text not null,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."site_settings" enable row level security;

alter table "public"."properties" alter column status type "public"."property_status_enum" using status::text::"public"."property_status_enum";

alter table "public"."properties" alter column "status" set default 'available'::public.property_status_enum;

drop type "public"."property_status_enum__old_version_to_be_dropped";

alter table "public"."areas" alter column "location" set default '[]'::jsonb;

alter table "public"."pages" enable row level security;

alter table "public"."properties" add column "location" jsonb;

alter table "public"."properties" add column "slug" text not null;

CREATE INDEX idx_properties_faqs_property_id ON public.properties_faqs USING btree (property_id);

CREATE INDEX idx_properties_slug ON public.properties USING btree (slug);

CREATE INDEX idx_site_settings_group ON public.site_settings USING btree ("group");

CREATE UNIQUE INDEX idx_site_settings_key ON public.site_settings USING btree (key);

CREATE UNIQUE INDEX properties_faqs_pkey ON public.properties_faqs USING btree (id);

CREATE UNIQUE INDEX properties_slug_key ON public.properties USING btree (slug);

CREATE UNIQUE INDEX site_settings_key_key ON public.site_settings USING btree (key);

CREATE UNIQUE INDEX site_settings_pkey ON public.site_settings USING btree (id);

alter table "public"."properties_faqs" add constraint "properties_faqs_pkey" PRIMARY KEY using index "properties_faqs_pkey";

alter table "public"."site_settings" add constraint "site_settings_pkey" PRIMARY KEY using index "site_settings_pkey";

alter table "public"."properties" add constraint "properties_slug_key" UNIQUE using index "properties_slug_key";

alter table "public"."properties_faqs" add constraint "properties_faqs_property_id_fkey" FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE not valid;

alter table "public"."properties_faqs" validate constraint "properties_faqs_property_id_fkey";

alter table "public"."site_settings" add constraint "site_settings_key_key" UNIQUE using index "site_settings_key_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_property_slug()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    new_slug := generate_slug(NEW.title);

    WHILE EXISTS (SELECT 1 FROM properties WHERE slug = new_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      counter := counter + 1;
      new_slug := generate_slug(NEW.title) || '-' || counter;
    END LOOP;

    NEW.slug := new_slug;
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_slug(text_param text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
  RETURN regexp_replace(
    regexp_replace(
      lower(trim(text_param)),
      E'[^a-z0-9\\s-]', '', 'g'
    ),
    E'\\s+', '-', 'g'
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_count()
 RETURNS bigint
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select count(*)::bigint from auth.users;
$function$
;

grant delete on table "public"."amenities" to "prisma";

grant insert on table "public"."amenities" to "prisma";

grant references on table "public"."amenities" to "prisma";

grant select on table "public"."amenities" to "prisma";

grant trigger on table "public"."amenities" to "prisma";

grant truncate on table "public"."amenities" to "prisma";

grant update on table "public"."amenities" to "prisma";

grant delete on table "public"."areas" to "prisma";

grant insert on table "public"."areas" to "prisma";

grant references on table "public"."areas" to "prisma";

grant select on table "public"."areas" to "prisma";

grant trigger on table "public"."areas" to "prisma";

grant truncate on table "public"."areas" to "prisma";

grant update on table "public"."areas" to "prisma";

grant delete on table "public"."areas_amenities" to "prisma";

grant insert on table "public"."areas_amenities" to "prisma";

grant references on table "public"."areas_amenities" to "prisma";

grant select on table "public"."areas_amenities" to "prisma";

grant trigger on table "public"."areas_amenities" to "prisma";

grant truncate on table "public"."areas_amenities" to "prisma";

grant update on table "public"."areas_amenities" to "prisma";

grant delete on table "public"."areas_amenities_faqs" to "prisma";

grant insert on table "public"."areas_amenities_faqs" to "prisma";

grant references on table "public"."areas_amenities_faqs" to "prisma";

grant select on table "public"."areas_amenities_faqs" to "prisma";

grant trigger on table "public"."areas_amenities_faqs" to "prisma";

grant truncate on table "public"."areas_amenities_faqs" to "prisma";

grant update on table "public"."areas_amenities_faqs" to "prisma";

grant delete on table "public"."areas_faqs" to "prisma";

grant insert on table "public"."areas_faqs" to "prisma";

grant references on table "public"."areas_faqs" to "prisma";

grant select on table "public"."areas_faqs" to "prisma";

grant trigger on table "public"."areas_faqs" to "prisma";

grant truncate on table "public"."areas_faqs" to "prisma";

grant update on table "public"."areas_faqs" to "prisma";

grant delete on table "public"."areas_properties" to "prisma";

grant insert on table "public"."areas_properties" to "prisma";

grant references on table "public"."areas_properties" to "prisma";

grant select on table "public"."areas_properties" to "prisma";

grant trigger on table "public"."areas_properties" to "prisma";

grant truncate on table "public"."areas_properties" to "prisma";

grant update on table "public"."areas_properties" to "prisma";

grant delete on table "public"."categories" to "prisma";

grant insert on table "public"."categories" to "prisma";

grant references on table "public"."categories" to "prisma";

grant select on table "public"."categories" to "prisma";

grant trigger on table "public"."categories" to "prisma";

grant truncate on table "public"."categories" to "prisma";

grant update on table "public"."categories" to "prisma";

grant delete on table "public"."cities" to "prisma";

grant insert on table "public"."cities" to "prisma";

grant references on table "public"."cities" to "prisma";

grant select on table "public"."cities" to "prisma";

grant trigger on table "public"."cities" to "prisma";

grant truncate on table "public"."cities" to "prisma";

grant update on table "public"."cities" to "prisma";

grant delete on table "public"."developers" to "prisma";

grant insert on table "public"."developers" to "prisma";

grant references on table "public"."developers" to "prisma";

grant select on table "public"."developers" to "prisma";

grant trigger on table "public"."developers" to "prisma";

grant truncate on table "public"."developers" to "prisma";

grant update on table "public"."developers" to "prisma";

grant delete on table "public"."pages" to "prisma";

grant insert on table "public"."pages" to "prisma";

grant references on table "public"."pages" to "prisma";

grant select on table "public"."pages" to "prisma";

grant trigger on table "public"."pages" to "prisma";

grant truncate on table "public"."pages" to "prisma";

grant update on table "public"."pages" to "prisma";

grant delete on table "public"."properties" to "prisma";

grant insert on table "public"."properties" to "prisma";

grant references on table "public"."properties" to "prisma";

grant select on table "public"."properties" to "prisma";

grant trigger on table "public"."properties" to "prisma";

grant truncate on table "public"."properties" to "prisma";

grant update on table "public"."properties" to "prisma";

grant delete on table "public"."properties_amenities" to "prisma";

grant insert on table "public"."properties_amenities" to "prisma";

grant references on table "public"."properties_amenities" to "prisma";

grant select on table "public"."properties_amenities" to "prisma";

grant trigger on table "public"."properties_amenities" to "prisma";

grant truncate on table "public"."properties_amenities" to "prisma";

grant update on table "public"."properties_amenities" to "prisma";

grant delete on table "public"."properties_faqs" to "anon";

grant insert on table "public"."properties_faqs" to "anon";

grant references on table "public"."properties_faqs" to "anon";

grant select on table "public"."properties_faqs" to "anon";

grant trigger on table "public"."properties_faqs" to "anon";

grant truncate on table "public"."properties_faqs" to "anon";

grant update on table "public"."properties_faqs" to "anon";

grant delete on table "public"."properties_faqs" to "authenticated";

grant insert on table "public"."properties_faqs" to "authenticated";

grant references on table "public"."properties_faqs" to "authenticated";

grant select on table "public"."properties_faqs" to "authenticated";

grant trigger on table "public"."properties_faqs" to "authenticated";

grant truncate on table "public"."properties_faqs" to "authenticated";

grant update on table "public"."properties_faqs" to "authenticated";

grant delete on table "public"."properties_faqs" to "prisma";

grant insert on table "public"."properties_faqs" to "prisma";

grant references on table "public"."properties_faqs" to "prisma";

grant select on table "public"."properties_faqs" to "prisma";

grant trigger on table "public"."properties_faqs" to "prisma";

grant truncate on table "public"."properties_faqs" to "prisma";

grant update on table "public"."properties_faqs" to "prisma";

grant delete on table "public"."properties_faqs" to "service_role";

grant insert on table "public"."properties_faqs" to "service_role";

grant references on table "public"."properties_faqs" to "service_role";

grant select on table "public"."properties_faqs" to "service_role";

grant trigger on table "public"."properties_faqs" to "service_role";

grant truncate on table "public"."properties_faqs" to "service_role";

grant update on table "public"."properties_faqs" to "service_role";

grant delete on table "public"."site_settings" to "anon";

grant insert on table "public"."site_settings" to "anon";

grant references on table "public"."site_settings" to "anon";

grant select on table "public"."site_settings" to "anon";

grant trigger on table "public"."site_settings" to "anon";

grant truncate on table "public"."site_settings" to "anon";

grant update on table "public"."site_settings" to "anon";

grant delete on table "public"."site_settings" to "authenticated";

grant insert on table "public"."site_settings" to "authenticated";

grant references on table "public"."site_settings" to "authenticated";

grant select on table "public"."site_settings" to "authenticated";

grant trigger on table "public"."site_settings" to "authenticated";

grant truncate on table "public"."site_settings" to "authenticated";

grant update on table "public"."site_settings" to "authenticated";

grant delete on table "public"."site_settings" to "prisma";

grant insert on table "public"."site_settings" to "prisma";

grant references on table "public"."site_settings" to "prisma";

grant select on table "public"."site_settings" to "prisma";

grant trigger on table "public"."site_settings" to "prisma";

grant truncate on table "public"."site_settings" to "prisma";

grant update on table "public"."site_settings" to "prisma";

grant delete on table "public"."site_settings" to "service_role";

grant insert on table "public"."site_settings" to "service_role";

grant references on table "public"."site_settings" to "service_role";

grant select on table "public"."site_settings" to "service_role";

grant trigger on table "public"."site_settings" to "service_role";

grant truncate on table "public"."site_settings" to "service_role";

grant update on table "public"."site_settings" to "service_role";

grant delete on table "public"."user_roles" to "prisma";

grant insert on table "public"."user_roles" to "prisma";

grant references on table "public"."user_roles" to "prisma";

grant select on table "public"."user_roles" to "prisma";

grant trigger on table "public"."user_roles" to "prisma";

grant truncate on table "public"."user_roles" to "prisma";

grant update on table "public"."user_roles" to "prisma";


  create policy "Enable read access for all users"
  on "public"."categories"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all users"
  on "public"."developers"
  as permissive
  for select
  to public
using (true);



  create policy "Admins can manage properties FAQs"
  on "public"."properties_faqs"
  as permissive
  for all
  to public
using (((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'service_role'::text])));



  create policy "Properties FAQs are publicly readable"
  on "public"."properties_faqs"
  as permissive
  for select
  to public
using (true);



  create policy "Admins can insert settings"
  on "public"."site_settings"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.app_role)))));



  create policy "Admins can read all settings"
  on "public"."site_settings"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.app_role)))));



  create policy "Admins can update settings"
  on "public"."site_settings"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.app_role)))));


CREATE TRIGGER properties_generate_slug BEFORE INSERT ON public.properties FOR EACH ROW EXECUTE FUNCTION public.generate_property_slug();

CREATE TRIGGER properties_update_slug_on_title_change BEFORE UPDATE OF title ON public.properties FOR EACH ROW WHEN (((old.title IS DISTINCT FROM new.title) AND (new.slug IS NULL))) EXECUTE FUNCTION public.generate_property_slug();


  create policy "Give anon users access to JPG images in folder 1ym9e3r_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'user-profile'::text) AND (storage.extension(name) = 'jpg'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text) AND (auth.role() = 'anon'::text)));



