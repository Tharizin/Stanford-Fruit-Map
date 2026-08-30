-- Apricot and Cherry were seeded with no cover image (image = null). Now
-- that apricot_tree.jpg and cherry_tree.jpg exist in fruit-images/, wire
-- them in for existing databases (fresh installs get this from seed.sql).
update plant_info set image = 'fruit-images/apricot_tree.jpg' where common_name = 'Apricot';
update plant_info set image = 'fruit-images/cherry_tree.jpg' where common_name = 'Cherry';
