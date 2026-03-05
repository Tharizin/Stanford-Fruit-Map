export const teaIcons = {
  "Rosemary": L.icon({ iconUrl: 'icons/rosemary.png', iconSize: [60,60], iconAnchor: [30, 60], popupAnchor: [0, -60] }),
  "Magnolia": L.icon({ iconUrl: 'icons/magnolia.png', iconSize: [60,60], iconAnchor: [30, 60], popupAnchor: [0, -60] }),
  "Osmanthus": L.icon({ iconUrl: 'icons/osmanthus.png', iconSize: [60,60], iconAnchor: [30, 60], popupAnchor: [0, -60] }),
  // Add more icons as needed
};

// Alias map for common name variations
export const teaIconAlias = {
  "rosemary": "Rosemary",
  "magnolia tree": "Magnolia",
  "sweet olive": "Osmanthus",
  // Add aliases as needed
};

export function initializeTeaMap() {
  const map = L.map("map", {
    zoomControl: false
  }).setView([37.424, -122.166], 16);
  
  L.control.zoom({
    position: 'topright'
  }).addTo(map);
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
  return map;
}