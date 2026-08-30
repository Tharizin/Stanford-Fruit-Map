-- Apricot and Prank Orange were seeded with no icon_key (falling back to
-- Leaflet's default pin). Now that apricot.png and prank.png exist in
-- fruit-map/icons/, wire them in for existing databases (fresh installs
-- get this from seed.sql).
update plant_info set icon_key = 'Apricot' where common_name = 'Apricot';
update plant_info set icon_key = 'Prank' where common_name = 'Prank Orange';
