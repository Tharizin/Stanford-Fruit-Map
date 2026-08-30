-- Stanford Fruit Map — database schema
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query) for a fresh project.
--
-- If you already have a live project provisioned from an earlier version of
-- this file (single hardcoded admin email, no edible_plants table), do NOT
-- re-run this whole file — run supabase/migrations/002_multi_admin_and_edible_plants.sql
-- instead, which upgrades an existing database in place.
--
-- After schema.sql + seed.sql (fresh install) or migration 002 (existing
-- install), also run supabase/migrations/003_species_scientific_names.sql
-- to populate plant_info.scientific_name for the seeded species,
-- supabase/migrations/004_photo_submissions_and_plant_photos.sql for
-- multi-photo species support and the public photo-submission queue, and
-- supabase/migrations/005_fun_photo_gallery.sql for the public
-- "What Other Foragers Have Found" community photo gallery, and
-- supabase/migrations/006_rename_images_folder.sql if your project was
-- seeded before the fruit-species image folder was renamed from images/
-- to fruit-images/ (fresh installs using the current seed.sql don't need it),
-- supabase/migrations/007_apricot_cherry_images.sql to backfill cover
-- images for Apricot and Cherry on an already-seeded database, and
-- supabase/migrations/009_password_admin_login.sql to switch from
-- email-based admin login to a single shared password account (migration
-- 008 is superseded by 009 and can be skipped on a fresh install), and
-- supabase/migrations/010_apricot_prank_orange_icons.sql to backfill map
-- icons for Apricot and Prank Orange on an already-seeded database, and
-- supabase/migrations/011_real_writeups.sql to replace placeholder/generic
-- write-ups for Apricot, Grapefruit, Japanese Quince, Bunya Bunya,
-- California Coffeeberry, and Rosemary with real ones.

-- ────────────────────────────────────────────────────────────
-- plant_info: one row per fruit species.
-- ────────────────────────────────────────────────────────────
create table plant_info (
  common_name     text primary key,
  scientific_name text,
  icon_key        text,          -- null means "no custom icon yet" — frontend falls back to a default map pin
  image           text,
  ripening        text,
  months          text[] not null default '{}',
  description     text,
  usage           text,
  created_at      timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- plants: individual tree locations. Public submissions land
-- here as 'pending' and only appear on the map once approved.
-- ────────────────────────────────────────────────────────────
create table plants (
  id            uuid primary key default gen_random_uuid(),
  common_name   text not null,
  lat           double precision not null,
  lng           double precision not null,
  status        text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitter_note text,
  photo_path    text,          -- path within the 'plant-photos' storage bucket, set by submitters
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz
);

create index plants_status_idx on plants (status);

-- ────────────────────────────────────────────────────────────
-- admins: membership table — anyone listed here is a site admin.
-- Replaces a single hardcoded admin email, so admins can add or
-- remove other admins from the dashboard without touching SQL.
-- ────────────────────────────────────────────────────────────
create table admins (
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

create policy "admins readable by admins"
  on admins for select
  using (is_admin());

create policy "admins can insert"
  on admins for insert
  with check (is_admin());

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

create trigger admins_prevent_last_delete
  before delete on admins
  for each row execute function public.prevent_last_admin_delete();

-- The email below becomes the first admin on a fresh install. It's a fixed
-- placeholder — see fruit-map/js/admin.js's ADMIN_LOGIN_EMAIL comment for
-- why a password-only admin login still needs an "email" on file.
insert into admins (email) values ('admin@stanfordfruitmap.local');

-- ────────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────────
alter table plant_info enable row level security;
alter table plants enable row level security;

-- Anyone can read species info (not sensitive).
create policy "plant_info readable by everyone"
  on plant_info for select
  using (true);

-- Only admins can create/edit species info.
create policy "plant_info editable by admin"
  on plant_info for all
  using (is_admin())
  with check (is_admin());

-- Anyone can read approved plant locations.
create policy "approved plants readable by everyone"
  on plants for select
  using (status = 'approved');

-- Admins can read everything, including pending/rejected.
create policy "all plants readable by admin"
  on plants for select
  using (is_admin());

-- Anyone can submit a new sighting, but it always lands as 'pending'
-- regardless of what they send — the check below rejects any insert
-- that tries to set a different status.
create policy "anyone can submit a pending sighting"
  on plants for insert
  with check (status = 'pending');

-- Only admins can change status (approve/reject) or edit/delete entries.
create policy "admin can update plants"
  on plants for update
  using (is_admin())
  with check (is_admin());

create policy "admin can delete plants"
  on plants for delete
  using (is_admin());

-- ────────────────────────────────────────────────────────────
-- edible_plants / edible_plant_photos: plants worth knowing about
-- that aren't tied to a specific mapped tree location.
-- ────────────────────────────────────────────────────────────
create table edible_plants (
  id              uuid primary key default gen_random_uuid(),
  common_name     text not null,
  scientific_name text,
  location_notes  text,
  usage           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table edible_plant_photos (
  id              uuid primary key default gen_random_uuid(),
  edible_plant_id uuid not null references edible_plants(id) on delete cascade,
  photo_path      text not null,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);
create index edible_plant_photos_plant_idx on edible_plant_photos (edible_plant_id, sort_order);

alter table edible_plants enable row level security;
alter table edible_plant_photos enable row level security;

create policy "edible_plants readable by everyone"
  on edible_plants for select
  using (true);

create policy "edible_plants editable by admin"
  on edible_plants for all
  using (is_admin())
  with check (is_admin());

create policy "edible_plant_photos readable by everyone"
  on edible_plant_photos for select
  using (true);

create policy "edible_plant_photos editable by admin"
  on edible_plant_photos for all
  using (is_admin())
  with check (is_admin());

-- ────────────────────────────────────────────────────────────
-- plant_photos: extra photos for a Fruit Gallery species, beyond its
-- single plant_info.image cover thumbnail. Same shape as
-- edible_plant_photos above, keyed by common_name instead of a uuid.
-- ────────────────────────────────────────────────────────────
create table plant_photos (
  id          uuid primary key default gen_random_uuid(),
  common_name text not null references plant_info(common_name) on delete cascade,
  photo_path  text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index plant_photos_common_name_idx on plant_photos (common_name, sort_order);

alter table plant_photos enable row level security;

create policy "plant_photos readable by everyone"
  on plant_photos for select
  using (true);

create policy "plant_photos editable by admin"
  on plant_photos for all
  using (is_admin())
  with check (is_admin());

-- ────────────────────────────────────────────────────────────
-- photo_submissions: public photo submissions, pending admin review.
-- Visitors submit either an "id_photo" for a specific species or just a
-- "fun_photo" — nothing is filed into plant_photos/edible_plant_photos
-- until an admin approves it.
-- ────────────────────────────────────────────────────────────
create table photo_submissions (
  id                uuid primary key default gen_random_uuid(),
  photo_path        text not null,
  kind              text not null check (kind in ('id_photo', 'fun_photo')),
  target_type       text check (target_type in ('plant_info', 'edible_plant')),
  target_id         text,
  submitter_note    text,  -- doubles as the caption for fun_photo submissions
  photographer_name text,  -- collected for fun_photo submissions
  status            text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at        timestamptz not null default now(),
  reviewed_at       timestamptz
);
create index photo_submissions_status_idx on photo_submissions (status);

alter table photo_submissions enable row level security;

create policy "anyone can submit a pending photo"
  on photo_submissions for insert
  with check (status = 'pending');

create policy "photo submissions readable by admin"
  on photo_submissions for select
  using (is_admin());

-- Approved fun photos make up the public "What Other Foragers Have Found"
-- gallery; pending/rejected rows and all id_photo submissions stay
-- admin-only via the policy above.
create policy "approved fun photos readable by everyone"
  on photo_submissions for select
  using (status = 'approved' and kind = 'fun_photo');

create policy "photo submissions editable by admin"
  on photo_submissions for update
  using (is_admin())
  with check (is_admin());

create policy "photo submissions deletable by admin"
  on photo_submissions for delete
  using (is_admin());

-- ────────────────────────────────────────────────────────────
-- Storage bucket for submitted and admin-uploaded photos. Public
-- sighting photos live under 'submissions/', edible-plant photos
-- under 'edible-plants/<id>/', fruit-species photos under
-- 'plants/<common_name>/', and public photo submissions under
-- 'photo-submissions/', all in this one bucket.
-- ────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('plant-photos', 'plant-photos', true)
on conflict (id) do nothing;

create policy "anyone can upload a plant photo"
  on storage.objects for insert
  with check (bucket_id = 'plant-photos');

create policy "anyone can view plant photos"
  on storage.objects for select
  using (bucket_id = 'plant-photos');

create policy "admin can delete plant photos"
  on storage.objects for delete
  using (bucket_id = 'plant-photos' and is_admin());
