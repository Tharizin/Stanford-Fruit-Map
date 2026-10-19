-- Stanford Fruit Map — migration 014
-- Lets visitors report that a tree/species they expected to see is no
-- longer there (removed, dead, etc.), distinct from reporting a brand-new
-- sighting. Kept as its own table rather than reusing `plants`, since a
-- missing-plant report isn't a tree location to approve onto the map —
-- it's a tip for an admin to go verify and then manually remove/update
-- the actual plant entry. Safe to re-run.

create table if not exists missing_plant_reports (
  id          uuid primary key default gen_random_uuid(),
  common_name text not null check (char_length(common_name) <= 100),
  lat         double precision not null check (lat between -90 and 90),
  lng         double precision not null check (lng between -180 and 180),
  note        text check (note is null or char_length(note) <= 1000),
  status      text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at  timestamptz not null default now(),
  reviewed_at timestamptz
);
create index if not exists missing_plant_reports_status_idx on missing_plant_reports (status);

alter table missing_plant_reports enable row level security;

drop policy if exists "anyone can submit a pending missing report" on missing_plant_reports;
create policy "anyone can submit a pending missing report"
  on missing_plant_reports for insert
  with check (status = 'pending');

drop policy if exists "missing reports readable by admin" on missing_plant_reports;
create policy "missing reports readable by admin"
  on missing_plant_reports for select
  using (is_admin());

drop policy if exists "missing reports editable by admin" on missing_plant_reports;
create policy "missing reports editable by admin"
  on missing_plant_reports for update
  using (is_admin())
  with check (is_admin());

drop policy if exists "missing reports deletable by admin" on missing_plant_reports;
create policy "missing reports deletable by admin"
  on missing_plant_reports for delete
  using (is_admin());

-- Same anti-flood backstop as plants/photo_submissions (see migration 013).
-- Relies on public.enforce_pending_cap(), already defined by that migration.
create or replace function public.check_missing_reports_pending_cap()
returns trigger
language plpgsql
as $$
begin
  perform public.enforce_pending_cap('public.missing_plant_reports', 500);
  return new;
end;
$$;

drop trigger if exists missing_plant_reports_pending_cap on missing_plant_reports;
create trigger missing_plant_reports_pending_cap
  before insert on missing_plant_reports
  for each row execute function public.check_missing_reports_pending_cap();
