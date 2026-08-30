-- Stanford Fruit Map — migration 003
-- Run this once in the Supabase SQL editor, after schema.sql/seed.sql (or
-- migration 002) have been applied. Safe to re-run.
--
-- Adds a scientific_name column to plant_info (needed for the Fruit Gallery
-- cards, which now show the Latin name under the common name, same as the
-- Edible Plants gallery) and backfills it for every species from the
-- original seed data. 'Prank Orange' is intentionally left blank — it isn't
-- a real species. Anything added later can be filled in via the admin
-- Species Info editor, which now has a Scientific Name field.

alter table plant_info add column if not exists scientific_name text;

update plant_info set scientific_name = 'Malus domestica' where common_name = 'Apple';
update plant_info set scientific_name = 'Prunus armeniaca' where common_name = 'Apricot';
update plant_info set scientific_name = 'Pyrus pyrifolia' where common_name = 'Asian Pear';
update plant_info set scientific_name = 'Persea americana' where common_name = 'Avocado';
update plant_info set scientific_name = 'Syzygium paniculatum' where common_name = 'Brush Cherry';
update plant_info set scientific_name = 'Prunus avium' where common_name = 'Cherry';
update plant_info set scientific_name = 'Hylocereus undatus' where common_name = 'Dragonfruit';
update plant_info set scientific_name = 'Eriobotrya japonica' where common_name = 'Fall Loquat';
update plant_info set scientific_name = 'Acca sellowiana' where common_name = 'Feijoa';
update plant_info set scientific_name = 'Ficus carica' where common_name = 'Fig';
update plant_info set scientific_name = 'Diospyros kaki' where common_name = 'Fuyu Persimmon';
update plant_info set scientific_name = 'Vitis vinifera' where common_name = 'Grape';
update plant_info set scientific_name = 'Citrus × paradisi' where common_name = 'Grapefruit';
update plant_info set scientific_name = 'Diospyros kaki' where common_name = 'Hachiya Persimmon';
update plant_info set scientific_name = 'Chaenomeles japonica' where common_name = 'Japanese Quince';
update plant_info set scientific_name = 'Cornus kousa' where common_name = 'Kousa Dogwood';
update plant_info set scientific_name = 'Citrus japonica' where common_name = 'Kumquat';
update plant_info set scientific_name = 'Citrus × limon' where common_name = 'Lemon';
update plant_info set scientific_name = 'Citrus × latifolia' where common_name = 'Lime';
update plant_info set scientific_name = 'Eriobotrya japonica' where common_name = 'Loquat';
update plant_info set scientific_name = 'Carissa macrocarpa' where common_name = 'Natal Plum';
update plant_info set scientific_name = 'Prunus persica var. nucipersica' where common_name = 'Nectarine';
update plant_info set scientific_name = 'Citrus × sinensis' where common_name = 'Orange';
update plant_info set scientific_name = 'Passiflora edulis' where common_name = 'Passionfruit';
update plant_info set scientific_name = 'Prunus domestica' where common_name = 'Plum';
update plant_info set scientific_name = 'Punica granatum' where common_name = 'Pomegranate';
update plant_info set scientific_name = 'Citrus maxima' where common_name = 'Pomelo';
update plant_info set scientific_name = 'Opuntia ficus-indica' where common_name = 'Prickly Pear';
update plant_info set scientific_name = 'Cydonia oblonga' where common_name = 'Quince';
update plant_info set scientific_name = 'Arbutus unedo' where common_name = 'Strawberry Tree';
update plant_info set scientific_name = 'Citrus trifoliata' where common_name = 'Trifoliate Orange';
update plant_info set scientific_name = 'Citrus × sinensis' where common_name = 'Prank Orange';
