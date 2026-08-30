-- Stanford Fruit Map — migration 004
-- Run this once in the Supabase SQL editor. Safe to re-run.
--
-- What this does:
--   1. Gives Fruit Gallery species (plant_info) the same multi-photo
--      capability Edible Plants already has via edible_plant_photos.
--   2. Adds a public photo-submission queue: visitors can submit either an
--      "ID photo" for a specific species or just a fun photo, and nothing
--      goes live until an admin approves it.

-- ────────────────────────────────────────────────────────────
-- plant_photos: extra photos for a Fruit Gallery species, beyond its
-- single plant_info.image cover thumbnail.
-- ────────────────────────────────────────────────────────────
create table if not exists plant_photos (
  id          uuid primary key default gen_random_uuid(),
  common_name text not null references plant_info(common_name) on delete cascade,
  photo_path  text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists plant_photos_common_name_idx on plant_photos (common_name, sort_order);

alter table plant_photos enable row level security;

drop policy if exists "plant_photos readable by everyone" on plant_photos;
create policy "plant_photos readable by everyone"
  on plant_photos for select
  using (true);

drop policy if exists "plant_photos editable by admin" on plant_photos;
create policy "plant_photos editable by admin"
  on plant_photos for all
  using (is_admin())
  with check (is_admin());

-- ────────────────────────────────────────────────────────────
-- photo_submissions: public submissions, pending admin review. On
-- approval, an admin files 'id_photo' submissions into plant_photos or
-- edible_plant_photos as appropriate — this table itself is just the
-- queue, not a live photo source.
-- ────────────────────────────────────────────────────────────
create table if not exists photo_submissions (
  id             uuid primary key default gen_random_uuid(),
  photo_path     text not null,
  kind           text not null check (kind in ('id_photo', 'fun_photo')),
  target_type    text check (target_type in ('plant_info', 'edible_plant')),
  target_id      text,
  submitter_note text,
  status         text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at     timestamptz not null default now(),
  reviewed_at    timestamptz
);
create index if not exists photo_submissions_status_idx on photo_submissions (status);

alter table photo_submissions enable row level security;

-- Anyone can submit, but it always lands as 'pending' regardless of what
-- they send — same pattern as the "anyone can submit a pending sighting"
-- policy on the plants table.
drop policy if exists "anyone can submit a pending photo" on photo_submissions;
create policy "anyone can submit a pending photo"
  on photo_submissions for insert
  with check (status = 'pending');

drop policy if exists "photo submissions readable by admin" on photo_submissions;
create policy "photo submissions readable by admin"
  on photo_submissions for select
  using (is_admin());

drop policy if exists "photo submissions editable by admin" on photo_submissions;
create policy "photo submissions editable by admin"
  on photo_submissions for update
  using (is_admin())
  with check (is_admin());

drop policy if exists "photo submissions deletable by admin" on photo_submissions;
create policy "photo submissions deletable by admin"
  on photo_submissions for delete
  using (is_admin());

-- No new storage bucket/policy needed — both plant_photos (admin uploads,
-- path 'plants/<common_name>/<uuid>.<ext>') and photo_submissions (public
-- uploads, path 'photo-submissions/<uuid>.<ext>') reuse the existing
-- public 'plant-photos' bucket and its bucket-wide storage.objects policies.
