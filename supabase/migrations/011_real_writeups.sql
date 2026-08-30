-- Replace placeholder/generic write-ups with the real ones for six
-- species: three Fruit Gallery entries (description + usage) and three
-- Edible Plants entries (location_notes + usage). Uses dollar-quoting so
-- none of the apostrophes/quotes in the prose need manual escaping.

update plant_info set
  description = $desc$While most of the apricots I’ve had are lime-sized, rich golden-orange, and a bit dilute in
      flavor, these apricots near Ricker Dining are a different experience. Most of them are gone before they fully ripen
      (due to squirrels and birds, perhaps?), but this is a blessing in disguise, as they are far tastier in their firmer
      state. They have a satisfying crunch to them but no hints of bitterness or sourness, as one might initially expect.
      The distinct apricot flavor is also considerably more concentrated than in a fully ripe apricot, and no trace of
      mealyness can be detected. This is sure to become one of your preferred campus stone fruits.$desc$,
  usage = $usage$Visit the bushy trees late in spring quarter and enjoy fresh, or make jams, pies, and glazes.$usage$
where common_name = 'Apricot';

update plant_info set
  description = $desc$One of the larger citrus fruits, grapefruits have a tangy sweetness and a pleasant note of
      bitterness. Due to hybridization with other citrus plants on campus, they often have more complex flavor profiles
      than the ordinary pink grapefruits you might find in the store, and their flesh is generally paler. Interestingly,
      all grapefruits are already hybrids: a cross between a pomelo and a sweet orange.$desc$,
  usage = $usage$Scoop the juicy flesh out of the rind to eat on its own, squeeze into drinks or cocktails
      (notably the Paloma), or add a citrusy punch to salads. But please note that grapefruits contain furanocoumarins,
      chemicals that can negatively interact with certain medications. Make sure this fruit is safe for you to consume
      before picking one.$usage$
where common_name = 'Grapefruit';

update plant_info set
  description = $desc$The Japanese Quinces on campus were undoubtedly planted for purely aesthetic purposes. In
      return for a low level of maintenance, these shrubs produce prolific bursts of gorgeous scarlet flowers, contrasting
      well with the plant’s dark, glossy leaves. The flowers eventually give way to small, hard, yellow fruits containing
      several large seeds. These fruits are technically edible raw, but they are quite astringent. I personally don’t mind
      this, as the rich, floral flavor of the fruit is worth the astringency for me.$desc$,
  usage = $usage$Most people prefer to enjoy Japanese Quince in the same way they enjoy any other quince:
      turning it into a jam or jelly. Because the fruits naturally contain very high amounts of pectin, the soluble fiber
      that gives fruit preserves their gel-like consistency, no additional pectin needs to be added during the process of
      jam-making. You could also try adding a bit of quince to a savory lamb stew, as the floral notes complement meat
      nicely.$usage$
where common_name = 'Japanese Quince';

update edible_plants set
  location_notes = $loc$A striking, spike-domed conifer native to Queensland, Australia, used as food by
      Australian Aboriginal peoples. Mature specimens can be found near the Mausoleum or by Kingscote gardens. This
      ancient tree produces cones that can weigh up to ten pounds, but usually all you’ll see of them are the scales
      detached by squirrels.$loc$,
  usage = $usage$If you’re lucky enough to find an intact cone, pry off the scales to reveal what are essentially
      very large pine nuts. It’s my dream to one day try one of these “nuts,” which are good both raw and roasted.$usage$
where common_name = 'Bunya Bunya';

update edible_plants set
  location_notes = $loc$These native evergreen shrubs are commonly found in drought-tolerant landscaping around
      campus, including around Meyer Green and near Terman Fountain.$loc$,
  usage = $usage$The berries are technically edible in small quantities once fully ripe (dark purple-black), though
      they have a mild laxative effect in larger amounts, so they’re best sampled sparingly rather than treated as a
      staple food. Regional Indigenous communities historically used the bark and berries medicinally more than as a
      food source.$usage$
where common_name = 'California Coffeeberry';

update edible_plants set
  location_notes = $loc$Grows in sunny, well-drained beds and hedges around campus, such as on the patio behind
      STLC, the paths by the d.school, and the courtyards of West Flo.$loc$,
  usage = $usage$Strip the needle-like leaves from the woody stems and use fresh or dried to season roasted
      vegetables, breads, and meats, or steep a sprig in hot water for a fragrant, piney tea.$usage$
where common_name = 'Rosemary';
