-- Stanford Fruit Map — starter data for the "Edible Plants Not on the Map" tab.
-- Run this once in the Supabase SQL editor AFTER migrations/002 has been applied.
-- These are placeholder-quality write-ups (like the original Lorem Ipsum
-- species entries) meant to be refined later via the admin dashboard.
-- No photos are seeded — upload real ones through the admin editor.

insert into edible_plants (common_name, scientific_name, location_notes, usage) values
  ('Rosemary', 'Salvia rosmarinus',
   'Grows in sunny, well-drained beds and hedges around campus, such as on the patio behind STLC, the paths by the d.school, and the courtyards of West Flo.',
   'Strip the needle-like leaves from the woody stems and use fresh or dried to season roasted vegetables, breads, and meats, or steep a sprig in hot water for a fragrant, piney tea.'),
  ('Bunya Bunya', 'Araucaria bidwillii',
   'A striking, spike-domed conifer native to Queensland, Australia, used as food by Australian Aboriginal peoples. Mature specimens can be found near the Mausoleum or by Kingscote gardens. This ancient tree produces cones that can weigh up to ten pounds, but usually all you''ll see of them are the scales detached by squirrels.',
   'If you''re lucky enough to find an intact cone, pry off the scales to reveal what are essentially very large pine nuts. It''s my dream to one day try one of these "nuts," which are good both raw and roasted.'),
  ('California Coffeeberry', 'Frangula californica',
   'These native evergreen shrubs are commonly found in drought-tolerant landscaping around campus, including around Meyer Green and near Terman Fountain.',
   'The berries are technically edible in small quantities once fully ripe (dark purple-black), though they have a mild laxative effect in larger amounts, so they''re best sampled sparingly rather than treated as a staple food. Regional Indigenous communities historically used the bark and berries medicinally more than as a food source.');
