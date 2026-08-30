-- Stanford Fruit Map — migration 002
-- Run this once in the Supabase SQL editor against the EXISTING live project
-- (schema.sql + seed.sql already applied). Safe to re-run: every statement
-- is idempotent.
--
-- What this does:
--   1. Introduces an `admins` table so admin access is no longer a single
--      hardcoded email, and rewrites existing RLS policies to check it.
--   2. Adds `edible_plants` / `edible_plant_photos` for the new
--      "Edible Plants Not on the Map" gallery tab.

-- ────────────────────────────────────────────────────────────
-- admins: membership table replacing the hardcoded admin email.
-- ────────────────────────────────────────────────────────────
create table if not exists admins (
  email      text primary key,
  added_by   text,
  created_at timestamptz not null default now()
);
alter table admins enable row level security;

-- security definer so RLS policies that call this don't recursively
-- re-trigger RLS on the admins table itself.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from admins where email = auth.email());
$$;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins readable by admins" on admins;
create policy "admins readable by admins"
  on admins for select
  using (is_admin());

drop policy if exists "admins can insert" on admins;
create policy "admins can insert"
  on admins for insert
  with check (is_admin());

drop policy if exists "admins can delete" on admins;
create policy "admins can delete"
  on admins for delete
  using (is_admin());

-- Safety net: never allow the last admin to be removed, so nobody can
-- accidentally lock everyone out of the dashboard.
create or replace function public.prevent_last_admin_delete()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from admins) <= 1 then
    raise exception 'Cannot remove the last remaining admin.';
  end if;
  return old;
end;
$$;

drop trigger if exists admins_prevent_last_delete on admins;
create trigger admins_prevent_last_delete
  before delete on admins
  for each row execute function public.prevent_last_admin_delete();

-- Bootstrap: the current sole admin becomes the first row.
insert into admins (email) values ('echamb@stanford.edu')
on conflict (email) do nothing;

-- ────────────────────────────────────────────────────────────
-- Rewrite existing hardcoded-email policies to use is_admin().
-- ────────────────────────────────────────────────────────────
drop policy if exists "plant_info editable by admin" on plant_info;
create policy "plant_info editable by admin"
  on plant_info for all
  using (is_admin())
  with check (is_admin());

drop policy if exists "all plants readable by admin" on plants;
create policy "all plants readable by admin"
  on plants for select
  using (is_admin());

drop policy if exists "admin can update plants" on plants;
create policy "admin can update plants"
  on plants for update
  using (is_admin())
  with check (is_admin());

drop policy if exists "admin can delete plants" on plants;
create policy "admin can delete plants"
  on plants for delete
  using (is_admin());

drop policy if exists "admin can delete plant photos" on storage.objects;
create policy "admin can delete plant photos"
  on storage.objects for delete
  using (bucket_id = 'plant-photos' and is_admin());

-- ────────────────────────────────────────────────────────────
-- edible_plants / edible_plant_photos: plants worth knowing about
-- that aren't tied to a specific mapped tree location.
-- ────────────────────────────────────────────────────────────
create table if not exists edible_plants (
  id              uuid primary key default gen_random_uuid(),
  common_name     text not null,
  scientific_name text,
  location_notes  text,
  usage           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists edible_plant_photos (
  id              uuid primary key default gen_random_uuid(),
  edible_plant_id uuid not null references edible_plants(id) on delete cascade,
  photo_path      text not null,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);
create index if not exists edible_plant_photos_plant_idx
  on edible_plant_photos (edible_plant_id, sort_order);

alter table edible_plants enable row level security;
alter table edible_plant_photos enable row level security;

drop policy if exists "edible_plants readable by everyone" on edible_plants;
create policy "edible_plants readable by everyone"
  on edible_plants for select
  using (true);

drop policy if exists "edible_plants editable by admin" on edible_plants;
create policy "edible_plants editable by admin"
  on edible_plants for all
  using (is_admin())
  with check (is_admin());

drop policy if exists "edible_plant_photos readable by everyone" on edible_plant_photos;
create policy "edible_plant_photos readable by everyone"
  on edible_plant_photos for select
  using (true);

drop policy if exists "edible_plant_photos editable by admin" on edible_plant_photos;
create policy "edible_plant_photos editable by admin"
  on edible_plant_photos for all
  using (is_admin())
  with check (is_admin());

-- No new storage bucket/policy needed: edible-plant photos reuse the
-- existing public 'plant-photos' bucket under an 'edible-plants/<id>/...'
-- path prefix, and the existing bucket-wide storage.objects policies
-- (anyone can upload/view, admin can delete) already cover it.
