-- The fruit-species image folder was renamed from images/ to fruit-images/
-- (to disambiguate it from the homepage's site-images/ folder). Existing
-- rows still point at the old path — repoint them.
update plant_info
set image = replace(image, 'images/', 'fruit-images/')
where image like 'images/%';
