
export const icons = {
  "pomelo": L.icon({ iconUrl: 'icons/pomelo.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "loquat": L.icon({ iconUrl: 'icons/loquat.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "apple": L.icon({ iconUrl: 'icons/apple.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "plum": L.icon({ iconUrl: 'icons/plum.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "opuntia": L.icon({ iconUrl: 'icons/opuntia.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "natal": L.icon({ iconUrl: 'icons/natal.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "lilly": L.icon({ iconUrl: 'icons/lilly.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "feijoa": L.icon({ iconUrl: 'icons/feijoa.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "fig": L.icon({ iconUrl: 'icons/fig.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "lime": L.icon({ iconUrl: 'icons/lime.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "lemon": L.icon({ iconUrl: 'icons/lemon.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "kumquat": L.icon({ iconUrl: 'icons/kumquat.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "hachiya": L.icon({ iconUrl: 'icons/hachiya.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "kousa": L.icon({ iconUrl: 'icons/kousa.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "orange": L.icon({ iconUrl: 'icons/orange.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "fuyu": L.icon({ iconUrl: 'icons/fuyu.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "avocado": L.icon({ iconUrl: 'icons/avocado.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "canary": L.icon({ iconUrl: 'icons/canary.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "grape": L.icon({ iconUrl: 'icons/grape.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "quince": L.icon({ iconUrl: 'icons/quince.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "passion": L.icon({ iconUrl: 'icons/passion.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "fuyu": L.icon({ iconUrl: 'icons/fuyu.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "pomegranate": L.icon({ iconUrl: 'icons/pomegranate.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "arbutus": L.icon({ iconUrl: 'icons/arbutus.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "fall": L.icon({ iconUrl: 'icons/fall.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] })
};


//Alias Map
export const iconAlias = {
  "natal plum": "natal",
  "brush cherry": "lilly",
  "hachiya persimmon": "hachiya",
  "kousa dogwood": "kousa",
  "natal plum": "natal",
  "prickly pear": "opuntia",
  "fuyu persimmon": "fuyu",
  "canary island date palm": "canary",
  "passionfruit": "passion",
  "strawberry tree": "arbutus",
  "fall loquat": "fall",
};

export function initializeMap() {
  const map = L.map("map").setView([37.424, -122.166], 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
  return map;
}