-- Stanford Fruit Map — migration 013: security hardening ahead of public launch
--
-- 1. Length/range caps on publicly-insertable columns, so an attacker calling
--    the REST API directly (bypassing all client-side validation, which they
--    trivially can with the public anon key) can't stuff megabyte-sized text
--    blobs or nonsensical coordinates into the database.
-- 2. A hard cap on how many *pending* (unreviewed) rows can pile up in
--    plants/photo_submissions, as a backstop against automated flooding —
--    Postgres/PostgREST has no per-visitor identity for anonymous inserts, so
--    true per-IP rate limiting isn't available at this layer, but this stops
--    unbounded growth.
-- 3. Bucket-level file size/type limits on storage, enforced by the Storage
--    API itself (not just app-side checks) so arbitrary non-image files or
--    huge files can't be uploaded even via a direct API call.
-- 4. A tightened storage.objects INSERT policy: anonymous uploads are only
--    allowed into the two "inbox" prefixes the app actually uses for public
--    submissions (submissions/, photo-submissions/); every other path
--    (species photos, edible-plant photos) now requires an admin session,
--    closing off unrestricted anonymous writes to arbitrary storage paths.
--
-- Safe to re-run.

-- ── 1. Length/range caps ──────────────────────────────────────
alter table plants
  drop constraint if exists plants_common_name_length,
  drop constraint if exists plants_submitter_note_length,
  drop constraint if exists plants_lat_range,
  drop constraint if exists plants_lng_range,
  add constraint plants_common_name_length check (char_length(common_name) <= 100),
  add constraint plants_submitter_note_length check (submitter_note is null or char_length(submitter_note) <= 1000),
  add constraint plants_lat_range check (lat between -90 and 90),
  add constraint plants_lng_range check (lng between -180 and 180);

alter table photo_submissions
  drop constraint if exists photo_submissions_note_length,
  drop constraint if exists photo_submissions_photographer_length,
  drop constraint if exists photo_submissions_target_id_length,
  add constraint photo_submissions_note_length check (submitter_note is null or char_length(submitter_note) <= 1000),
  add constraint photo_submissions_photographer_length check (photographer_name is null or char_length(photographer_name) <= 100),
  add constraint photo_submissions_target_id_length check (target_id is null or char_length(target_id) <= 200);

-- ── 2. Anti-flood backstop on pending rows ───────────────────
create or replace function public.enforce_pending_cap(tbl regclass, max_pending integer)
returns void
language plpgsql
as $$
declare
  current_count integer;
begin
  execute format('select count(*) from %s where status = ''pending''', tbl) into current_count;
  if current_count >= max_pending then
    raise exception 'Too many pending submissions right now — please try again later.';
  end if;
end;
$$;

create or replace function public.check_plants_pending_cap()
returns trigger
language plpgsql
as $$
begin
  perform public.enforce_pending_cap('public.plants', 500);
  return new;
end;
$$;

drop trigger if exists plants_pending_cap on plants;
create trigger plants_pending_cap
  before insert on plants
  for each row execute function public.check_plants_pending_cap();

create or replace function public.check_photo_submissions_pending_cap()
returns trigger
language plpgsql
as $$
begin
  perform public.enforce_pending_cap('public.photo_submissions', 500);
  return new;
end;
$$;

drop trigger if exists photo_submissions_pending_cap on photo_submissions;
create trigger photo_submissions_pending_cap
  before insert on photo_submissions
  for each row execute function public.check_photo_submissions_pending_cap();

-- ── 3. Bucket-level file size/type limits ────────────────────
update storage.buckets
set file_size_limit = 10485760, -- 10 MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
where id = 'plant-photos';

-- ── 4. Tightened storage.objects INSERT policy ────────────────
drop policy if exists "anyone can upload a plant photo" on storage.objects;
drop policy if exists "public inbox uploads only, admin uploads anywhere" on storage.objects;
create policy "public inbox uploads only, admin uploads anywhere"
  on storage.objects for insert
  with check (
    bucket_id = 'plant-photos'
    and (
      name like 'submissions/%'
      or name like 'photo-submissions/%'
      or is_admin()
    )
  );
