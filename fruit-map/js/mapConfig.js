import { MAPTILER_API_KEY } from './mapTilerConfig.js';

// Builds a Leaflet icon from a species' icon_key (e.g. "Apple" -> icons/apple.png).
// A null/missing icon_key falls back to Leaflet's default marker pin, so
// species without custom artwork still show up on the map.
export function buildIcon(iconKey) {
  if (!iconKey) return undefined;
  return L.icon({
    iconUrl: `icons/${iconKey.toLowerCase()}.png`,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -25],
  });
}

// "basic-v2" was picked deliberately over MapTiler's other styles: it's
// the one with no amenity/POI icon clutter (no parking/food/shop pins),
// while still labeling every street and the main campus building name at
// a legible size — the combination this map actually needs (find a street,
// not browse nearby coffee shops). "bright-v2" and "outdoor-v2" both label
// buildings too, but bury them under dozens of icons; "streets-v2" is
// clean but labels fewer streets at a smaller size.
const TILE_SOURCES = {
  streets: `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}{r}.png?key=${MAPTILER_API_KEY}`,
  satellite: `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`,
};

const TILE_ATTRIBUTION = '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

let activeTileLayer = null;

// MapTiler's "-v2" styles are rendered from vector tiles at a native 512px
// tile size, not the classic 256px raster convention. Without
// tileSize/zoomOffset, Leaflet requests them as 256px tiles and everything
// ends up rendered one zoom level too coarse.
function tileOptions(basemapStyle) {
  const base = {
    maxZoom: 20,
    detectRetina: true,
    attribution: TILE_ATTRIBUTION,
  };
  return basemapStyle === 'streets' ? { ...base, tileSize: 512, zoomOffset: -1 } : base;
}

export function initializeMap(basemapStyle = 'streets') {
  const map = L.map('map', {
    zoomControl: false,
  }).setView([37.424, -122.166], 16);

  L.control.zoom({
    position: 'bottomleft',
  }).addTo(map);

  activeTileLayer = L.tileLayer(TILE_SOURCES[basemapStyle] || TILE_SOURCES.streets, tileOptions(basemapStyle)).addTo(map);

  return map;
}

// Swaps the basemap in place (called on the streets/satellite toggle)
// without disturbing pan/zoom/markers.
export function updateMapTiles(map, basemapStyle) {
  if (activeTileLayer) map.removeLayer(activeTileLayer);
  activeTileLayer = L.tileLayer(TILE_SOURCES[basemapStyle] || TILE_SOURCES.streets, tileOptions(basemapStyle)).addTo(map);
}
