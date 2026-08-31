-- Stanford Fruit Map — migration 012
-- Adds a `credit` column to plant_photos and edible_plant_photos so photo
-- attribution can be shown beneath each ID photo in the species/edible-plant
-- detail modal. Populated either by an admin (manually, e.g. for a
-- Wikimedia Commons photo) or automatically from
-- photo_submissions.photographer_name when a user-submitted ID photo is
-- approved. Safe to re-run.

alter table plant_photos add column if not exists credit text;
alter table edible_plant_photos add column if not exists credit text;
