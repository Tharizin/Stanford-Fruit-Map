-- Stanford Fruit Map — migration 005
-- Run this once in the Supabase SQL editor. Safe to re-run.
--
-- Splits photo submissions into two distinct, unambiguous flows:
--   - "Share a photo of this" (inside a fruit/edible plant's detail modal)
--     is always an ID photo for that exact plant — no choice to make.
--   - A new "What Other Foragers Have Found" community gallery, reached
--     from the Fruit Gallery page, is where fun/haul photos go instead.
--     Approved fun photos are public, shown with a caption, date, and
--     the photographer's name (all collected at submission time).

alter table photo_submissions add column if not exists photographer_name text;

-- Approved fun photos are readable by everyone (pending/rejected ones,
-- and all id_photo submissions, stay admin-only via the existing policy).
drop policy if exists "approved fun photos readable by everyone" on photo_submissions;
create policy "approved fun photos readable by everyone"
  on photo_submissions for select
  using (status = 'approved' and kind = 'fun_photo');
