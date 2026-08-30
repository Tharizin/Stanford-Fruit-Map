-- Auto-generated seed data migrated from fruitData.js / fruitInfo.js / mapConfig.js
-- Run this in the Supabase SQL editor AFTER schema.sql has been applied.

insert into plant_info (common_name, icon_key, image, ripening, months, description, usage) values
  ('Apple', 'Apple', 'fruit-images/apple_tree.webp', 'Late summer–fall', ARRAY['august', 'september', 'october'], 'A crowd favorite, no fruit list would be complete without the humble
    apple. There are a few types that can be found on campus, including a tasty yellow
    variety in front of Florence Moore Hall, “donut” apples behind Loro (West Florence
    Moore), and an extremely disappointing specimen in the Engineering Quad. In this
    climate region, apples hit their prime before the start of fall quarter, so the
    few apples remaining once students arrive in the autumn are not exactly the cream
    of the crop. Regardless, these trees are worth a visit – you never know whether
    you might find something delicious.', 'Eat fresh, bake into pies or crisps, make applesauce or apple butter, juice them, 
    or dry slices for a chewy snack.'),
  ('Apricot', 'Apricot', 'fruit-images/apricot_tree.jpg', 'TBD', '{}', 'While most of the apricots I’ve had are lime-sized, rich golden-orange, and a bit dilute in
      flavor, these apricots near Ricker Dining are a different experience. Most of them are gone before they fully ripen
      (due to squirrels and birds, perhaps?), but this is a blessing in disguise, as they are far tastier in their firmer
      state. They have a satisfying crunch to them but no hints of bitterness or sourness, as one might initially expect.
      The distinct apricot flavor is also considerably more concentrated than in a fully ripe apricot, and no trace of
      mealyness can be detected. This is sure to become one of your preferred campus stone fruits.', 'Visit the bushy trees late in spring quarter and enjoy fresh, or make jams, pies, and glazes.'),
  ('Asian Pear', 'Asian', 'fruit-images/asian_pear.jpg', 'Late summer, very early fall', ARRAY['august', 'september'], 'Alas, when I discovered this tree it had been completely stripped save for one tiny malformed
fruit, the only clue I had as to what it was (it still tasted great). Also called sand pears,
  Asian pears are very round, sand-colored, and incredibly juicy and crisp, like if a 
  honeycrisp apple carried more water. They have a gloriously light and sweet flavor, floral
  with notes of honey, and are often sold individually wrapped in foam due to their tendency
  to bruise. Interestingly, they contain meat-tenderizing enzymes, which makes them a common 
  ingredient in marinades for things including Korean bulgogi beef.', 'These pears are best directly from the tree (if you haven’t been beaten to them!), but are
 also great in marinades or sliced into salads.'),
  ('Avocado', 'Avocado', 'fruit-images/avocado_tree.jpg', 'Does not ripen on tree; typically harvested in late fall to winter', ARRAY['november', 'december'], 'I knew of the presence of avocados at Stanford since year one, but I 
      never knew that they were capable of producing fruit. Indeed, most that 
      I’ve found seem to grow only leaves. But to my delight, in the fall of 
      2025, I discovered that a few of the plants in Main Quad were highly 
      productive! They remain rock hard on the tree for months, and apparently 
      only ripen once removed. Avocados contain more potassium than a banana, 
      are rich in fiber and vitamins, and are very high in healthy fats – they’re 
      an all-around superfood!', 'Eat alone or on avocado toast, try a rich avocado smoothie, make guacamole, 
    add to salads, etc. You can also carve the pit into buttons or figurines, or
    boil it with the skin to produce a gorgeous pink hued natural dye.'),
  ('Brush Cherry', 'Lilly', 'fruit-images/brush_cherry.jpg', 'Year round', ARRAY['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'], 'This tree (and sometimes hedge) is native to eastern Australia and is
      in the myrtle family. Fruit fans familiar with wax apples will notice 
      a delightful similarity in the small magenta “cherries,” which have a 
      pleasant juicy, spongy texture with a delicate and herbal flavor. They
      have a seed of varying size hidden within the flesh, which is safe to 
      eat but not very palatable. Look for the single lilly pilly (Syzygium 
      smithii) tree nearby in the Psychology corner, which is very similar 
      but produces much larger and juicier fruits. Both brush cherries and 
      lilly pillies produce attractive and fluffy flowers that are appealing 
      to bees.', 'Eat fresh off the tree, use in desserts, or make into jams and jellies.'),
  ('Cherry', 'Cherry', 'fruit-images/cherry_tree.jpg', 'TBD', '{}', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. (Placeholder — full description coming soon!)', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
      (Placeholder — usage info coming soon!)'),
  ('Dragonfruit', 'Dragonfruit', 'fruit-images/dragonfruit.jpeg', 'Spring? Summer? I have no idea', ARRAY['march', 'april', 'may'], 'During a fruit walk in March 2026, I stumbled across this spectacular specimen that to my knowledge is the only dragonfruit cactus on campus. This gorgeous, alien-looking fruit is one I’ve only ever tried from the grocery store, but the lackluster flavor held within a Safeway dragonfruit is said to be nothing compared to the taste of a fresh one, picked when truly ripe. Unfortunately, this cactus appears to be well-maintained (someone put a protective bag around the fruit I found and neatly trained the stems to a fence), which indicates that this isn’t one you can freely pick. Maybe if you email the District Work Center people who likely care for the plant, they’ll let you try a sample.', 'The flesh of the dragonfruit is mildly sweet and refreshing, with a texture similar to kiwi due to the presence of small black seeds. It can be eaten fresh, added to smoothies, used in desserts, or even added to a tropical salsa. The vibrant pink skin is not edible, but it makes for a stunning presentation when sliced open.'),
  ('Fall Loquat', 'Fall', 'fruit-images/fall_loquat.jpg', 'Fall', ARRAY['october', 'november'], 'This is one of the most enigmatic fruits I’ve found. It is most certainly a loquat,
     but it lacks many characteristics of normal loquats. For example, it flowers in the 
     spring and bears fruit in the fall, the complete opposite of the standard variety, 
     and has very small fruits with a mucilaginous texture. The leaves are also a bit more 
     sharply toothed, and the green to rusty-colored fruits have a very sweet, floral flavor. 
     Try as I might, I have found no other accounts of this fruit online, perhaps because 
     it is easily eclipsed in terms of deliciousness by its well-known spring-ripening
      counterpart.', 'I generally just eat these fresh off the tree, spitting out the many 
    small seeds as I go. They are a welcome snack if you happen to be behind MemChu. 
    I don’t know what else you can use them for, presumably baking. Email me if you
    find any intriguing use cases.'),
  ('Feijoa', 'Feijoa', 'fruit-images/feijoa_bush.jpg', 'Fall quarter', ARRAY['october', 'november'], 'Also known as pineapple guava, feijoas are a unique fruit with a sweet, aromatic 
      flavor reminiscent of guava and mint, and to me they seem to have notes of cola as well.
      The trees are evergreen and produce beautiful pink flowers with striking red stamens in the
      spring. The fruits are green and oval-shaped, ripening in the fall, and are best eaten 
      when a gentle shake of the tree causes them to fall to the ground. While edible, the skin is
      a bit gritty, so scooping out the tasty inner flesh is recommended.', 'Eat fresh, use in smoothies, or incorporate into desserts. The spongy flower petals are also
    edible, and have a delicate sweetness that makes them a lovely garnish for salads and desserts.'),
  ('Fig', 'Fig', 'fruit-images/fig_tree.jpeg', 'Late summer through fall', ARRAY['august', 'september', 'october', 'november'], 'A close contender for the best plant of all at Stanford, the fig is a 
      prince among fruits. There are not many specimens on campus, and I
      hesitate even to make their locations known as I don’t want them to be
      picked when underripe (a common action from new and eager foragers). 
      The figs growing at Stanford are some sort of purple variety, although
      I am not sure of the specific cultivar. Pick when richly purple in
      color and quite soft, but be sure to check that you are not about to 
      eat a family of maggots, as rotting figs often resemble ripe ones. 
      The dried leaves of fig trees are also said to make an excellent tea 
      with almond notes, although I have yet to try this.', 'Eat fresh, dry them for later, dry leaves for tea, or use fruits in 
      baking and savory dishes.'),
  ('Fuyu Persimmon', 'Fuyu', 'fruit-images/fuyu_tree.webp', 'Late fall–early winter', ARRAY['november'], 'Fuyu persimmons are a popular variety known for their sweet, crisp flesh and
      flat-bottomed shape. They are typically harvested in late fall and can be eaten
      while still firm, unlike their Hachiya counterparts. The tree itself is small to
      medium-sized, with beautiful foliage that turns vibrant shades of orange and red
      in the fall. Look for them in the math corner of Main Quad or behind Casper Dining, 
      if the birds haven''t gotten to them first!', 'Enjoy fresh, dried, or in baked goods. They also make a lovely topping for salads and 
      yogurt bowls.'),
  ('Grape', 'Grape', 'fruit-images/grape_vine.jpg', 'Late summer–early fall', ARRAY['september', 'october'], 'The grapes on campus are not the crisp, seedless variety you can pick up at the grocery store, but are still quite deserving of our appreciation. They are likely just common wine grapes, and can be eaten raw as well as being turned into wine. Find them decking the awning of Kingscote Gardens as well as on the fence by Hillel, recognizable by their distinct green leaves that turn a lovely shade of red as the weather cools.', 'Eat fresh out of hand (the seeds are perfectly edible and add a nice crunch), ferment into wine (obviously), concoct jams and jellies, dry to make raisins, or add to both sweet and savory dishes. The leaves are also edible and a staple of Mediterranean and Middle Eastern cuisine. I’m particularly fond of dolma, or stuffed grape leaves.'),
  ('Grapefruit', 'Grapefruit', NULL, 'TBD', '{}', 'One of the larger citrus fruits, grapefruits have a tangy sweetness and a pleasant note of
      bitterness. Due to hybridization with other citrus plants on campus, they often have more complex flavor profiles
      than the ordinary pink grapefruits you might find in the store, and their flesh is generally paler. Interestingly,
      all grapefruits are already hybrids: a cross between a pomelo and a sweet orange.', 'Scoop the juicy flesh out of the rind to eat on its own, squeeze into drinks or cocktails
      (notably the Paloma), or add a citrusy punch to salads. But please note that grapefruits contain furanocoumarins,
      chemicals that can negatively interact with certain medications. Make sure this fruit is safe for you to consume
      before picking one.'),
  ('Hachiya Persimmon', 'Hachiya', 'fruit-images/hachiya_tree.jpg', 'Fall quarter', ARRAY['october', 'november'], 'There are a few Hachiyas on campus, most notably the large and stately 
      tree behind the Stanford bookstore. Its large fruits ripen during the 
      middle to end of fall quarter, although hints of orange can be seen 
      starting to take shape during early fall. This type, unlike the Fuyu 
      variety, must be eaten only once extremely ripe, as any degree of firmness 
      indicates a terrible astringency rendering the fruit completely inedible. 
      Harvest when uniformly rich orange (do this by checking out a fruit picker
      from the Law School Library!) and keep on a windowsill until total 
      ripeness is achieved, which occurs when the consistency of the inner flesh 
      is almost spreadable like jelly.', 'Enjoy fresh once completely ripe either on its own or added to yogurt or oatmeal,
      bake into sweet treats, or freeze and thaw to eat like custard. There is also a
      Japanese method of preservation called Hoshigaki, in which the unripe fruit 
      is skinned, hung by the stem near a window, and allowed to dry completely, 
      resulting in a chewy sugar crystal-coated delicacy.'),
  ('Japanese Quince', 'Quince', NULL, 'TBD', '{}', 'The Japanese Quinces on campus were undoubtedly planted for purely aesthetic purposes. In
      return for a low level of maintenance, these shrubs produce prolific bursts of gorgeous scarlet flowers, contrasting
      well with the plant’s dark, glossy leaves. The flowers eventually give way to small, hard, yellow fruits containing
      several large seeds. These fruits are technically edible raw, but they are quite astringent. I personally don’t mind
      this, as the rich, floral flavor of the fruit is worth the astringency for me.', 'Most people prefer to enjoy Japanese Quince in the same way they enjoy any other quince:
      turning it into a jam or jelly. Because the fruits naturally contain very high amounts of pectin, the soluble fiber
      that gives fruit preserves their gel-like consistency, no additional pectin needs to be added during the process of
      jam-making. You could also try adding a bit of quince to a savory lamb stew, as the floral notes complement meat
      nicely.'),
  ('Kousa Dogwood', 'Kousa', 'fruit-images/kousa_dogwood.jpg', 'Late summer–fall', ARRAY['september', 'october'], 'A popular ornamental, the kousa dogwood is originally from Asia, grown for its 
      attractive fruits in addition to the flowers dogwoods are known for. I find the
      fruit to be more of a novelty than a particularly tasty treat, as their strange
      and bumpy appearance gives them the air of being from another planet. However 
      they are still perfectly edible, and if one sucks the soft, custardy flesh out
      from under the bitter, grainy skin, they will notice notes of persimmon, guava, 
      and earthiness.', 'Discard both the seeds and the skin, they are not pleasant to eat. Eat fresh,
      add to desserts, infuse into dressings, or make jam.'),
  ('Kumquat', 'Kumquat', 'fruit-images/kumquat_tree.jpg', 'Winter', ARRAY['december', 'january', 'february', 'march'], 'Most people I meet seem to love the humble kumquat, but try as I might, I’ve never 
    found them palatable. However, to the many kumquat enjoyers, these fruits are bright
     and tangy citrus treats, made all the better due to the fact they don’t need to be
      peeled. They are a traditional symbol of wealth and prosperity during Chinese New 
      Year, and are high in vitamins and fiber.', 'Eat the whole grape-sized fruit fresh, skin and all. You can also make marmalade, 
    add some zing to salads, candy, or include in beverages.'),
  ('Lemon', 'Lemon', 'fruit-images/lemon_tree.jpg', 'Winter', ARRAY['december', 'january', 'february', 'march'], 'The bright yellow lemon is a staple of Bay Area front yards, and the many trees on 
      campus are certainly just as underutilized. Botanically a berry, lemons are native 
      to Asia, and contain a high amount of vitamin C and citric acid, the source of their
       signature sourness and cleaning capabilities. Lemons can technically be productive 
       year-round, although winter is a typical time of ripeness. Shoutout to the Columbae 
       residents for actually using the fruits produced by their spectacularly productive 
       lemon!', 'When life gives you lemons, make… Well, you know that one already. You can 
       also make all sorts of tasty desserts like lemon bars, add to myriad savory dishes
        (garlicky lemon pasta, anyone?), or even use the juice as an element of a natural 
        cleaner.'),
  ('Lime', 'Lime', 'fruit-images/lime_tree.webp', 'Winter', ARRAY['december', 'january', 'february'], 'A great scurvy-preventer, limes are a staple of any citrus lover’s repertoire. 
      Like lemons, this sour green fruit originated in Asia, and the variety found on
       campus is most likely the Persian lime (sorry, no key lime pies possible here.)
        Limes are quite versatile and have numerous applications in both sweet and savory
         dishes..', 'Make margheritas, ceviche, meat marinades, squeeze over your bowl of Wilbur
    dining phở, combine with cilantro and add to rice; there’s really no limit.'),
  ('Loquat', 'Loquat', 'fruit-images/loquat_tree.png', 'Late spring–early summer', ARRAY['may', 'june'], 'Hailing from cool regions in China and Japan, this gorgeous tree
      is certainly one of the best fruits on campus. Your patience for waiting
      until mid-spring quarter is well-rewarded with the sweet and juicy orbs 
      of flavor weighing down trees across campus. The fruits bruise very 
      easily, so eat them fresh or cook them into baked goods before they 
      lose their spark. This is also likely why you never see them sold in 
      stores, a shame because they’re so delicious. Ripeness is indicated by 
      a completely yellow to golden fruit, although the underripe ones are 
      also tasty if you prefer more tartness.', 'Eat fresh off the tree, juice them, or bake into pies, tarts,
      jams, or jellies. I suspect they would also be delicious as a rosemary-loquat
      pork marinade!'),
  ('Natal Plum', 'Natal', 'fruit-images/natal_plum.jpg', 'Somewhat year round', ARRAY['july', 'august', 'september', 'october', 'november', 'december'], 'A delightfully obscure fruit, the natal plum is a prizewinner in the flavor department. 
      It’s also a prizewinner in the thorns department, second perhaps only to the trifoliate
      orange. It is native to South Africa, and is a hardy shrub that produces
      small, bright red fruits. Use caution, because unripe fruits and
      all other parts of the plant are toxic. The flavor is quite nice, similar to a sweet cranberry
      with the texture of a perfectly ripe strawberry. Those with a latex allergy are advised to avoid
      consuming the fruit, but otherwise, they are a delightful treat.', 'Eat fresh off the tree, or use in jams, jellies, and desserts.'),
  ('Nectarine', 'Nectarine', 'fruit-images/nectarine.webp', 'Summer', ARRAY['july', 'august'], 'These juicy stone fruits are actually a genetic variant of the beloved peach, likely domesticated in China. Indeed, the trees of peaches and nectarines are virtually indistinguishable, and I was only able to identify the Loro courtyard grove by the developing fruits. It’s quite interesting to me that these trees produce fruit in the mild Mediterranean climate of Stanford, as most nectarines require a colder winter season in which they lay dormant, resting before they can once again become laden with fruit.', 'In late summer, you can pick the nectarines fresh from the tree and eat out of hand, enjoying a flavor and juiciness that is impossible to get from the grocery store. They also make a lovely jam and can be used in desserts, served with ricotta or ice cream, or as a complement to a savory meat dish.'),
  ('Orange', 'Orange', 'fruit-images/orange_tree.jpg', 'Winter–early spring', ARRAY['january', 'february', 'march', 'april'], 'Most people will be very familiar with this bright and tangy fruit.
      These trees can be found throughout Main Quad, but you’ll have to 
      do some taste-testing to determine which are worth consuming. 
      Some appear far more delicious than they are in reality!', 'Eat fresh off the tree, press for fresh and delicious orange juice,
      candy the peels, flavor water, use in sweet or savory cooking — 
      the sky’s the limit!'),
  ('Passionfruit', 'Passion', 'fruit-images/passionfruit_vine.jpg', 'Probably summer', ARRAY['june', 'july', 'august'], 'While ornamental varieties are common across campus, this vine is the only fruiting 
      passionfruit that I have discovered. As of fall 2025, I have no idea when these
      actually ripen. They are ready to harvest when purple and a bit shriveled-looking,
      but they seem to hang onto the plant, hard as rocks, for a very long time. I was 
      lucky enough to find one that had ripened and fallen to the ground, and I can attest 
      that once ready, their sharp flavor is divine. Contrary to a few of my friends’ 
      opinions, the black seeds within the tangy yellow flesh of the passionfruit are
      quite edible, and provide a nice crunch and fiber boost.', 'Enjoy by breaking open 
      the wrinkled purple fruit (do not attempt if still green – it’s not ready yet!) 
      and scooping out the jelly-like yellow filling. This fruit is delicious fresh, 
      blended into drinks, or incorporated into desserts such as pavlova.'),
  ('Plum', 'Plum', 'fruit-images/plum_tree.jpg', 'Summer–early fall', ARRAY['june', 'july', 'august', 'september'], 'The variety of plums to be had around campus is truly wonderful. 
    One of the most common varieties are the deep red-purple ornamentals that can 
    be found throughout campus. Their rosy fruits are roughly ping-pong ball sized
    and very tasty, though they are almost impossible to spot amidst dense foliage
    of the exact same color. Even tastier than these are the red and green (they might 
    be dwarf green gages) plums found next to Hillel, the Knoll, or the Polynesian sculpture garden. Growing 
    to the size of large marbles, these gems are addictive bursts of flavor during
    late spring to early summer. There’s also a gorgeous specimen next to Snu that
    produces larger yellow fruits with a scarlet blush, although I haven’t had the 
    pleasure of tasting them yet.', 'Consume fresh from the tree, dry to make prunes, ferment into wine, make jam or 
    chutney, or include in desserts.'),
  ('Pomegranate', 'Pomegranate', 'fruit-images/pomegranate_tree.webp', 'Late summer–early fall', ARRAY['september', 'october', 'november'], 'The pomegranates growing on campus are some sort of ornamental, and as a result
    the fruits are not as large or sweet as those sold in stores. However, they are
    still a delightfully tasty fruit, simply a bit on the tarter side. Harvest the
    biggest ones you can find and don’t worry if the arils are pale - they still
    have a good flavor. The bushes are identifiable when not fruiting by their 
    blazingly scarlet flowers.', 'Eat the arils fresh, sprinkle them on salads or yogurt, juice them, or use
    them in cooking and baking. A fantastic application of these seeds is to make the NYT 
    tabbouleh-inspired dish with bulgur, shredded brussels sprouts, and plenty of 
    pomegranate arils.'),
  ('Pomelo', 'Pomelo', 'fruit-images/pomelo_lemon.jpg', 'Winter', ARRAY['december', 'january', 'february', 'march'], 'Stanford’s pomelo trees would be more accurately referred to as “giant lemons.” 
      These colossal citrus fruits are not the magnificent sweet pink beauties I purchase
      almost monthly from H-mart, they are quite sour and not pleasant to eat plain. The 
      reason for the existence of the po-lemon-o is actually quite interesting: citrus 
      fruits hybridize like crazy. Indeed, if you were to plant a seed from a citrus fruit 
      you particularly enjoyed, the chances that the resulting plant would produce that 
      same fruit are quite low. This is why most commercially grown citrus comes from 
      grafting rather than plants grown from seed. However, if you need a large quantity 
      of lemon juice, this might be your best bet.', 'Use the juice in place of lemon juice, zest over desserts, or candy the plentiful pith 
  of these well-insulated fruits.'),
  ('Prank Orange', 'Prank', NULL, 'TBD', '{}', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. (Placeholder — full description coming soon!)', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
      (Placeholder — usage info coming soon!)'),
  ('Prickly Pear', 'Opuntia', 'fruit-images/prickly_pear.webp', 'Summer', ARRAY['july', 'august'], 'On Halloween of my sophomore year at Stanford (2024), I went to Synergy’s Halloween
     Party. The fire alarm was pulled after 30 minutes, but fortunately I didn’t leave
    empty-handed – the co-op boasts a large and stately prickly pear cactus in the front
    yard, and the vibrant magenta fruits (tunas in Spanish) are absolutely delicious.
    Just take great care to skin them well, as they have tiny little spines called 
    glochids that will burrow deep into your skin, causing itching and pain. You can 
    also burn them off over an open flame, or roll them in sand like the Tequesta tribe 
    of FL. There are actually other fruit trees and plants at Synergy, but I haven’t 
    included them because they are in the co-op’s designated garden. Make a friend there
    before asking to eat their fruit. As for the one other prickly pear on this map, the
    fruits are not nearly as tasty as the Synergy one. I ate one my freshman year and 
    was rewarded with numerous rock-hard seeds, lackluster flavor, and spines in my 
    mouth for days. Eat at your own risk.', 'These are a common ingredient in Mexican cuisine, eaten fresh, made into candies and
    juices, included in alcoholic beverages, or added to salads. The pads of the cactus
    are also edible (nopales), but I would suggest leaving them alone to avoid destroying
    the plant.'),
  ('Quince', 'Quince', 'fruit-images/quince_tree.jpg', 'Late fall', ARRAY['october', 'november', 'december'], 'Quinces are delightfully aromatic yellow fruits, related to apples and native to Iran.
    They can get much larger than apples, sometimes reaching a kilogram in weight. As far
    as I know, we have two kinds of quince on campus, an ornamental Japanese variety that 
    is very hard and sour, and a much larger, softer type that I believe is the ‘Cooke’s 
    Jumbo’ variety. I have yet to cook them, but they apparently develop a rosy color when
    prepared due to the release of anthocyanin.', 'There seems to be a lot of negative propaganda around uncooked quinces. Somebody on Reddit
  proclaimed, “I bit into a raw quince once. ONCE.” The Spike Jones song “Now Laugh” has the
  memorable line, “My brother climbed a quince tree/ To pick himself a quince. /He ate the
  quince and puckered up, /And we ain’t seen brother since!” However, while perhaps not the
  most delectable thing to consume fresh from the tree, they are perfectly edible and very
  nice to gnaw on. With that said, where the fruit truly shines is when cooked into firm
  quince jelly, added to give complexity to applesauce or pie, or used in making kibbeh.'),
  ('Strawberry Tree', 'Arbutus', 'fruit-images/strawberry_tree.webp', 'Year-round', ARRAY['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'], 'To be perfectly honest, I created this map with the full intention of omitting
      this fruit. For some reason I find it immensely unpalatable (but it’s not all
      about me, is it?), and it’s so ubiquitous around campus that it just seemed
      superfluous to include it. However, other people seem to enjoy these sunset
      -colored, gently spiked orbs dotting our campus, so I went ahead and gave the 
      people what they wanted. The tree is in the same family as blueberries, a fact
      that is obvious when observing its showers of bell-shaped blooms, and is 
      native to the Mediterranean Basin. Its flesh is soft and custardy, with a delicate
      floral taste reminiscent of guava and apricot. They are very soft and easily 
      bruised, so take care when transporting them. While I have recorded this fruit as
      being ripe year-round, not every tree/bush will produce fruit at all times, so it’s 
      worth checking back on them throughout the year to see if they’re ready to eat.', 'While not the most exciting fruit, the berries can be used in jams, jellies,
      or even fermented into a unique liqueur. The tree''s bark and leaves also have
      traditional medicinal uses.'),
  ('Trifoliate Orange', 'Trifoliate', 'fruit-images/trifoliate_orange.jpg', 'Fall, winter', ARRAY['november', 'december', 'january'], 'It is a topic of debate as to whether the trifoliate orange belongs to the citrus genus or not. While it does share characteristics with regular oranges and lemons, this unusual plant has deciduous triplets of compound leaves (hence “trifoliate”) and bears fuzzy fruits, in contrast with true citrus. However, it’s similar enough to support grafting, and its cold-hardiness makes it a great rootstock for more delicate citrus. };', 'The “oranges” are somewhat bitter and quite sour, and the high concentration of seeds makes them a bit challenging to eat. They have an unique flavor though, and are reportedly good in marmalade or turned into a powdered condiment. I bet they would make an interesting lemonade-style beverage as well.');

insert into plants (common_name, lat, lng, status) values
  ('Orange', 37.427947968534205, -122.16905814532062, 'approved'),
  ('Orange', 37.4267999864428, -122.16350192307186, 'approved'),
  ('Orange', 37.42780881901705, -122.1687393601934, 'approved'),
  ('Orange', 37.427942956499834, -122.16892497969309, 'approved'),
  ('Orange', 37.4279817173611, -122.16953324331152, 'approved'),
  ('Orange', 37.42180513152339, -122.16601712345398, 'approved'),
  ('Orange', 37.422557780419595, -122.1686259938304, 'approved'),
  ('Orange', 37.419442134314714, -122.1634156236069, 'approved'),
  ('Orange', 37.42059267706833, -122.16493960081388, 'approved'),
  ('Prank Orange', 37.42072334600763, -122.17229469786531, 'approved'),
  ('Orange', 37.42759281903844, -122.16869673841525, 'approved'),
  ('Orange', 37.4272901201435, -122.17143515762969, 'approved'),
  ('Orange', 37.4241539938239, -122.1657304309454, 'approved'),
  ('Orange', 37.423970191466836, -122.16576670180844, 'approved'),
  ('Orange', 37.42396881980576, -122.16581333577238, 'approved'),
  ('Orange', 37.42697338177819, -122.17116873771535, 'approved'),
  ('Orange', 37.42242186536661, -122.16007302944509, 'approved'),
  ('Orange', 37.42429046504758, -122.16922806440745, 'approved'),
  ('Orange', 37.42570692513744, -122.18086683373654, 'approved'),
  ('Orange', 37.42377842890092, -122.17293354110184, 'approved'),
  ('Orange', 37.4200831276773, -122.16771128856477, 'approved'),
  ('Orange', 37.420318030497064, -122.16759788531701, 'approved'),
  ('Orange', 37.42026477527383, -122.16752814788605, 'approved'),
  ('Orange', 37.42903503027111, -122.16539262686578, 'approved'),
  ('Orange', 37.429296066553974, -122.1651070780544, 'approved'),
  ('Orange', 37.42930618501543, -122.16511089451272, 'approved'),
  ('Orange', 37.42423744179543, -122.17497310651585, 'approved'),
  ('Lemon', 37.42294344817035, -122.16883372556157, 'approved'),
  ('Lemon', 37.427650817567596, -122.16891192117446, 'approved'),
  ('Lemon', 37.42762636488284, -122.16884300548311, 'approved'),
  ('Lemon', 37.42798207470609, -122.16921899971358, 'approved'),
  ('Lemon', 37.42220492827898, -122.16634869726141, 'approved'),
  ('Lemon', 37.42666300630228, -122.16467269015017, 'approved'),
  ('Lemon', 37.42793658496206, -122.16899300027255, 'approved'),
  ('Lemon', 37.426750893146405, -122.16348711664826, 'approved'),
  ('Lemon', 37.42220492827898, -122.16634869726141, 'approved'),
  ('Lemon', 37.42123408949555, -122.15947929482098, 'approved'),
  ('Lemon', 37.42152810664942, -122.15915817903367, 'approved'),
  ('Lemon', 37.42163781051716, -122.15936068581611, 'approved'),
  ('Lemon', 37.421501828989975, -122.15952142944508, 'approved'),
  ('Lemon', 37.421656266481754, -122.15964682271762, 'approved'),
  ('Lemon', 37.42174386389667, -122.15953618220632, 'approved'),
  ('Lemon', 37.42523148653049, -122.1616146062331, 'approved'),
  ('Lemon', 37.42198829727892, -122.15958987301427, 'approved'),
  ('Lemon', 37.4244608724669, -122.16917442022667, 'approved'),
  ('Lemon', 37.425704791874864, -122.18083867104654, 'approved'),
  ('Lemon', 37.42571012021967, -122.1808929852747, 'approved'),
  ('Lemon', 37.42373316405544, -122.17297779755098, 'approved'),
  ('Lemon', 37.42246331251022, -122.16586364462295, 'approved'),
  ('Lemon', 37.42939080290062, -122.17761365964732, 'approved'),
  ('Lemon', 37.42644948918549, -122.16220433415576, 'approved'),
  ('Lemon', 37.42438850207932, -122.17488858214027, 'approved'),
  ('Lemon', 37.42432051551962, -122.1749328733826, 'approved'),
  ('Lime', 37.42506849021938, -122.16153208224652, 'approved'),
  ('Trifoliate Orange', 37.426404369454495, -122.16499077763497, 'approved'),
  ('Trifoliate Orange', 37.426126578521156, -122.17474280236627, 'approved'),
  ('Trifoliate Orange', 37.42127636390835, -122.16539077054959, 'approved'),
  ('Kumquat', 37.42706464758015, -122.1690954238442, 'approved'),
  ('Kumquat', 37.4270470080672, -122.16903784965835, 'approved'),
  ('Kumquat', 37.42751922912981, -122.16888255445512, 'approved'),
  ('Pomelo', 37.42621715486784, -122.16379974874764, 'approved'),
  ('Pomelo', 37.42145214331984, -122.16549782861901, 'approved'),
  ('Grapefruit', 37.42409484898927, -122.17395413719682, 'approved'),
  ('Grapefruit', 37.422442011035734, -122.16592801763612, 'approved'),
  ('Grapefruit', 37.41902945585726, -122.16587292334273, 'approved'),
  ('Loquat', 37.422276960086414, -122.17240128411594, 'approved'),
  ('Loquat', 37.42242189280133, -122.1710573901757, 'approved'),
  ('Loquat', 37.42186313215311, -122.17231653396009, 'approved'),
  ('Loquat', 37.42181610582603, -122.17223578833139, 'approved'),
  ('Loquat', 37.42671005041531, -122.1691963912162, 'approved'),
  ('Loquat', 37.42653282636692, -122.16929353445383, 'approved'),
  ('Loquat', 37.42665062828112, -122.1692830324822, 'approved'),
  ('Loquat', 37.42151705797503, -122.1656577697942, 'approved'),
  ('Loquat', 37.42397300200459, -122.16577842871465, 'approved'),
  ('Loquat', 37.42414021499962, -122.16572679619307, 'approved'),
  ('Loquat', 37.42104641644832, -122.17367389396074, 'approved'),
  ('Loquat', 37.42455537565893, -122.16595946984052, 'approved'),
  ('Loquat', 37.424934595115324, -122.16842536440744, 'approved'),
  ('Loquat', 37.43728772296064, -122.16874421165411, 'approved'),
  ('Loquat', 37.42319122878133, -122.15571778640499, 'approved'),
  ('Loquat', 37.42314727337836, -122.15558495190416, 'approved'),
  ('Loquat', 37.422327855528856, -122.15586458223828, 'approved'),
  ('Fall Loquat', 37.42655209428253, -122.17062602227958, 'approved'),
  ('Fall Loquat', 37.42653505403401, -122.17054488546201, 'approved'),
  ('Fall Loquat', 37.421149812946595, -122.17354076817902, 'approved'),
  ('Fall Loquat', 37.420992271301024, -122.17363764527856, 'approved'),
  ('Plum', 37.42191856032541, -122.16789565277986, 'approved'),
  ('Plum', 37.421826946075385, -122.16806128776862, 'approved'),
  ('Plum', 37.42211037270107, -122.16860018982305, 'approved'),
  ('Plum', 37.42109636101486, -122.17175282763888, 'approved'),
  ('Plum', 37.42420231030755, -122.17356093317099, 'approved'),
  ('Plum', 37.42263771597658, -122.17185840799338, 'approved'),
  ('Plum', 37.42262907733425, -122.17177138791851, 'approved'),
  ('Plum', 37.422604395493536, -122.17134871898331, 'approved'),
  ('Plum', 37.422584650015075, -122.17102239370246, 'approved'),
  ('Plum', 37.422518008987254, -122.16953683661724, 'approved'),
  ('Plum', 37.42265992962412, -122.169370566117, 'approved'),
  ('Plum', 37.421095392998616, -122.172827441321, 'approved'),
  ('Cherry', 37.42303293013097, -122.16851731167544, 'approved'),
  ('Cherry', 37.42306725305208, -122.1684686819365, 'approved'),
  ('Brush Cherry', 37.4282834563917, -122.17101691882813, 'approved'),
  ('Brush Cherry', 37.42826159918318, -122.17093612259852, 'approved'),
  ('Brush Cherry', 37.42826582961112, -122.17071326706406, 'approved'),
  ('Brush Cherry', 37.428164299274144, -122.17041316678261, 'approved'),
  ('Brush Cherry', 37.423302186113766, -122.17228518355442, 'approved'),
  ('Brush Cherry', 37.42811220673593, -122.16951963723307, 'approved'),
  ('Brush Cherry', 37.428129779121974, -122.16960613847182, 'approved'),
  ('Brush Cherry', 37.428140429050885, -122.16966313541208, 'approved'),
  ('Brush Cherry', 37.420794585301905, -122.17250195187802, 'approved'),
  ('Brush Cherry', 37.41984913010283, -122.16633327751828, 'approved'),
  ('Avocado', 37.42794373280669, -122.16931552147051, 'approved'),
  ('Avocado', 37.428034789877145, -122.16949925278392, 'approved'),
  ('Nectarine', 37.42236011237303, -122.17250573303961, 'approved'),
  ('Nectarine', 37.42223816118159, -122.17236022320775, 'approved'),
  ('Passionfruit', 37.423929450527915, -122.1685974411421, 'approved'),
  ('Asian Pear', 37.42147792070122, -122.1616635822465, 'approved'),
  ('Apple', 37.42257391837668, -122.17238515085957, 'approved'),
  ('Apple', 37.42193110308943, -122.17233649824513, 'approved'),
  ('Apple', 37.421956665032496, -122.17241025898838, 'approved'),
  ('Apple', 37.422333125377214, -122.1656582824954, 'approved'),
  ('Apple', 37.42834267143247, -122.17495613434171, 'approved'),
  ('Apple', 37.42431446383271, -122.17982109999734, 'approved'),
  ('Apple', 37.4205374416174, -122.1677668644766, 'approved'),
  ('Fig', 37.4268705333791, -122.16355535473778, 'approved'),
  ('Fig', 37.42422260878312, -122.17396729820906, 'approved'),
  ('Fig', 37.42050532091026, -122.16483883454022, 'approved'),
  ('Fig', 37.42722042198242, -122.1585792710607, 'approved'),
  ('Feijoa', 37.42378177074066, -122.17236709983095, 'approved'),
  ('Feijoa', 37.42827175493699, -122.1705017466165, 'approved'),
  ('Feijoa', 37.428263235008934, -122.1704185981363, 'approved'),
  ('Feijoa', 37.428184425628324, -122.17063585706845, 'approved'),
  ('Feijoa', 37.428216375387215, -122.17073778101192, 'approved'),
  ('Feijoa', 37.428246195149875, -122.17080751844692, 'approved'),
  ('Feijoa', 37.42829518473418, -122.17087457367292, 'approved'),
  ('Feijoa', 37.424585116609464, -122.16610533583722, 'approved'),
  ('Feijoa', 37.423834396895295, -122.16608623081964, 'approved'),
  ('Feijoa', 37.424004482985566, -122.16589105904559, 'approved'),
  ('Feijoa', 37.42382753858025, -122.16595669203187, 'approved'),
  ('Feijoa', 37.42512737482181, -122.16529629998938, 'approved'),
  ('Feijoa', 37.42520405735134, -122.16561816507404, 'approved'),
  ('Kousa Dogwood', 37.42792926580345, -122.16963270484162, 'approved'),
  ('Hachiya Persimmon', 37.42500426328591, -122.16805903010118, 'approved'),
  ('Hachiya Persimmon', 37.42137855703106, -122.16528179499714, 'approved'),
  ('Hachiya Persimmon', 37.42200353135018, -122.16581024110184, 'approved'),
  ('Hachiya Persimmon', 37.420821846261255, -122.15812919445355, 'approved'),
  ('Fuyu Persimmon', 37.42201356114258, -122.16580656124283, 'approved'),
  ('Fuyu Persimmon', 37.425740550270326, -122.1620109878485, 'approved'),
  ('Fuyu Persimmon', 37.42200616254017, -122.16580714694425, 'approved'),
  ('Fuyu Persimmon', 37.4208652049385, -122.16517175856303, 'approved'),
  ('Natal Plum', 37.42538702457125, -122.1676384354342, 'approved'),
  ('Natal Plum', 37.42536218678804, -122.16749545894034, 'approved'),
  ('Prickly Pear', 37.41932480649855, -122.1690191841805, 'approved'),
  ('Prickly Pear', 37.435972593305316, -122.17088462944507, 'approved'),
  ('Quince', 37.42122907956953, -122.16290601835178, 'approved'),
  ('Quince', 37.42737319376413, -122.17505854110186, 'approved'),
  ('Japanese Quince', 37.422010463890054, -122.16539921165412, 'approved'),
  ('Grape', 37.421916003818, -122.16790790636371, 'approved'),
  ('Grape', 37.42382377366111, -122.17287342038557, 'approved'),
  ('Pomegranate', 37.425543491712986, -122.17002968009335, 'approved'),
  ('Pomegranate', 37.42607577533452, -122.16277934661645, 'approved'),
  ('Pomegranate', 37.42629516958358, -122.16286785951476, 'approved'),
  ('Pomegranate', 37.426339900371005, -122.16302342763899, 'approved'),
  ('Pomegranate', 37.42651733708178, -122.1631974935661, 'approved'),
  ('Pomegranate', 37.426356354126625, -122.16324441834276, 'approved'),
  ('Pomegranate', 37.426642545807574, -122.16306235020946, 'approved'),
  ('Pomegranate', 37.42673340466314, -122.16336048921377, 'approved'),
  ('Pomegranate', 37.4213876318665, -122.16523246521125, 'approved'),
  ('Pomegranate', 37.422400563880345, -122.16007571165412, 'approved'),
  ('Pomegranate', 37.4272347431511, -122.17509408037164, 'approved'),
  ('Pomegranate', 37.425671255195944, -122.17564826440743, 'approved'),
  ('Pomegranate', 37.42571811530093, -122.17640497789897, 'approved'),
  ('Pomegranate', 37.427061455057526, -122.16266296440745, 'approved'),
  ('Pomegranate', 37.42708701524913, -122.16280780369556, 'approved'),
  ('Pomegranate', 37.422043847196, -122.17106858590259, 'approved'),
  ('Strawberry Tree', 37.42662636749165, -122.16468653122743, 'approved'),
  ('Strawberry Tree', 37.42587366552967, -122.16628155029996, 'approved'),
  ('Strawberry Tree', 37.42535657274624, -122.1664444311263, 'approved'),
  ('Strawberry Tree', 37.425473196735986, -122.16620704945157, 'approved'),
  ('Strawberry Tree', 37.425027468448725, -122.16655708683139, 'approved'),
  ('Strawberry Tree', 37.424821378128506, -122.1665872624676, 'approved'),
  ('Strawberry Tree', 37.42749247408696, -122.17494655887448, 'approved'),
  ('Strawberry Tree', 37.42506666875945, -122.16496373727747, 'approved'),
  ('Strawberry Tree', 37.424527730088435, -122.17924944420025, 'approved'),
  ('Strawberry Tree', 37.42711785007437, -122.1764911288148, 'approved'),
  ('Strawberry Tree', 37.427509771758196, -122.1764213913798, 'approved'),
  ('Strawberry Tree', 37.427198790590225, -122.1764911288148, 'approved'),
  ('Strawberry Tree', 37.43090434953571, -122.17358256439681, 'approved'),
  ('Strawberry Tree', 37.43405456621114, -122.17139734704756, 'approved'),
  ('Strawberry Tree', 37.4339533600254, -122.17135236352031, 'approved'),
  ('Strawberry Tree', 37.433872394585926, -122.17137935413082, 'approved'),
  ('Strawberry Tree', 37.43317645444857, -122.17177844496294, 'approved'),
  ('Strawberry Tree', 37.43195712469277, -122.16523089998938, 'approved'),
  ('Strawberry Tree', 37.43194221555203, -122.16542938345825, 'approved'),
  ('Strawberry Tree', 37.42984152739029, -122.1722981705669, 'approved'),
  ('Strawberry Tree', 37.42996453116441, -122.1722948178058, 'approved'),
  ('Strawberry Tree', 37.430024701768204, -122.17226665461254, 'approved'),
  ('Strawberry Tree', 37.430276622256095, -122.17215297056693, 'approved'),
  ('Strawberry Tree', 37.43103852733067, -122.17138624111912, 'approved'),
  ('Strawberry Tree', 37.43105503407843, -122.17127895276383, 'approved'),
  ('Strawberry Tree', 37.43075662221171, -122.17103080001472, 'approved'),
  ('Strawberry Tree', 37.43080827254038, -122.17120380248761, 'approved'),
  ('Strawberry Tree', 37.43042652480167, -122.17111294111915, 'approved'),
  ('Strawberry Tree', 37.43027157291849, -122.17117865523677, 'approved'),
  ('Strawberry Tree', 37.423561950580215, -122.15578480002941, 'approved'),
  ('Apricot', 37.42576212882335, -122.18081554110185, 'approved'),
  ('Apricot', 37.425732840584786, -122.18082425828125, 'approved'),
  ('Dragonfruit', 37.43005319234539, -122.16660351167133, 'approved');
