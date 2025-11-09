
export const icons = {
  "Pomelo": L.icon({ iconUrl: 'icons/pomelo.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Loquat": L.icon({ iconUrl: 'icons/loquat.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Apple": L.icon({ iconUrl: 'icons/apple.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Plum": L.icon({ iconUrl: 'icons/plum.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Opuntia": L.icon({ iconUrl: 'icons/opuntia.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Natal": L.icon({ iconUrl: 'icons/natal.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Lilly": L.icon({ iconUrl: 'icons/lilly.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Feijoa": L.icon({ iconUrl: 'icons/feijoa.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Fig": L.icon({ iconUrl: 'icons/fig.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Lime": L.icon({ iconUrl: 'icons/lime.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Lemon": L.icon({ iconUrl: 'icons/lemon.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Kumquat": L.icon({ iconUrl: 'icons/kumquat.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Hachiya": L.icon({ iconUrl: 'icons/hachiya.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Kousa": L.icon({ iconUrl: 'icons/kousa.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Orange": L.icon({ iconUrl: 'icons/orange.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Fuyu": L.icon({ iconUrl: 'icons/fuyu.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Avocado": L.icon({ iconUrl: 'icons/avocado.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Canary": L.icon({ iconUrl: 'icons/canary.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Grape": L.icon({ iconUrl: 'icons/grape.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Quince": L.icon({ iconUrl: 'icons/quince.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Passion": L.icon({ iconUrl: 'icons/passion.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Pomegranate": L.icon({ iconUrl: 'icons/pomegranate.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Arbutus": L.icon({ iconUrl: 'icons/arbutus.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Fall": L.icon({ iconUrl: 'icons/fall.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Asian": L.icon({ iconUrl: 'icons/asian.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Cherry": L.icon({ iconUrl: 'icons/cherry.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] }),
  "Trifoliate": L.icon({ iconUrl: 'icons/trifoliate.png', iconSize: [60,60], iconAnchor: [30,30], popupAnchor: [0,-60] })
};

// Alias Map
export const iconAlias = {
  "Natal Plum": "Natal",
  "Brush Cherry": "Lilly",
  "Hachiya Persimmon": "Hachiya",
  "Kousa Dogwood": "Kousa",
  "Prickly Pear": "Opuntia",
  "Fuyu Persimmon": "Fuyu",
  "Canary Island Date Palm": "Canary",
  "Passionfruit": "Passion",
  "Strawberry Tree": "Arbutus",
  "Fall Loquat": "Fall",
  "Asian Pear": "Asian",
  "Trifoliate Orange": "Trifoliate"
};

export function initializeMap() {
  const map = L.map("map").setView([37.424, -122.166], 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
  return map;
}