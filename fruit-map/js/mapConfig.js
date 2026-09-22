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

// "My location" control — a live-updating blue dot with an accuracy
// radius, the same convention Google Maps uses, built on Leaflet's own
// map.locate()/map.stopLocate() wrapper around the browser Geolocation
// API. Clicking the button centers/zooms to the first fix and starts
// watching; clicking again turns it off. Only that first fix ever moves
// the map — later position updates just move the dot, so a user who's
// panned elsewhere doesn't get yanked back while their location keeps
// updating live in the background.
function addLocateControl(map) {
  let locationMarker = null;
  let accuracyCircle = null;
  let watching = false;
  let button = null;

  function clearLocationLayers() {
    if (locationMarker) { map.removeLayer(locationMarker); locationMarker = null; }
    if (accuracyCircle) { map.removeLayer(accuracyCircle); accuracyCircle = null; }
  }

  function onLocationFound(e) {
    if (!locationMarker) {
      locationMarker = L.circleMarker(e.latlng, {
        radius: 8,
        color: '#fff',
        weight: 3,
        fillColor: '#4285f4',
        fillOpacity: 1,
      }).addTo(map);
      accuracyCircle = L.circle(e.latlng, {
        radius: e.accuracy,
        color: '#4285f4',
        weight: 1,
        fillColor: '#4285f4',
        fillOpacity: 0.15,
      }).addTo(map);
      map.setView(e.latlng, Math.max(map.getZoom(), 17));
    } else {
      locationMarker.setLatLng(e.latlng);
      accuracyCircle.setLatLng(e.latlng);
      accuracyCircle.setRadius(e.accuracy);
    }
  }

  function onLocationError(e) {
    watching = false;
    button.classList.remove('active');
    clearLocationLayers();
    alert(e.message || "Couldn't get your location. Please check your browser's location permissions.");
  }

  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);

  const LocateControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd() {
      const container = L.DomUtil.create('div', 'leaflet-bar locate-control');
      button = L.DomUtil.create('a', 'locate-control-btn', container);
      button.href = '#';
      button.title = 'Show my location';
      button.setAttribute('role', 'button');
      button.setAttribute('aria-label', 'Show my location');
      button.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="3"></circle>
          <circle cx="12" cy="12" r="8"></circle>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path>
        </svg>`;

      L.DomEvent.on(button, 'click', L.DomEvent.stop)
        .on(button, 'click', () => {
          if (watching) {
            watching = false;
            map.stopLocate();
            clearLocationLayers();
            button.classList.remove('active');
          } else {
            watching = true;
            button.classList.add('active');
            map.locate({ watch: true, enableHighAccuracy: true, maxZoom: 18 });
          }
        });

      return container;
    },
  });

  new LocateControl().addTo(map);
}

export function initializeMap(basemapStyle = 'streets') {
  const map = L.map('map', {
    zoomControl: false,
  }).setView([37.424, -122.166], 16);

  L.control.zoom({
    position: 'bottomleft',
  }).addTo(map);

  addLocateControl(map);

  activeTileLayer = L.tileLayer(TILE_SOURCES[basemapStyle] || TILE_SOURCES.streets, tileOptions(basemapStyle)).addTo(map);

  return map;
}

// Swaps the basemap in place (called on the streets/satellite toggle)
// without disturbing pan/zoom/markers.
export function updateMapTiles(map, basemapStyle) {
  if (activeTileLayer) map.removeLayer(activeTileLayer);
  activeTileLayer = L.tileLayer(TILE_SOURCES[basemapStyle] || TILE_SOURCES.streets, tileOptions(basemapStyle)).addTo(map);
}
