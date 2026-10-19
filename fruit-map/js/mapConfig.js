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

// The dot + heading cone are one HTML structure (a Leaflet divIcon)
// instead of separate circleMarkers, specifically so the cone can be
// rotated with a plain CSS transform. The accuracy ring stays a real
// geographic L.circle (radius in meters) so it scales correctly as the
// map zooms, which a pixel-sized divIcon element can't do on its own.
const LOCATION_ICON = L.divIcon({
  className: 'locate-dot-icon',
  html: `
    <svg class="locate-heading" viewBox="-30 -30 60 60" width="60" height="60">
      <path d="M 0 0 L -13 -27 A 29 29 0 0 1 13 -27 Z" fill="#4285f4" fill-opacity="0.35"></path>
    </svg>
    <div class="locate-dot"></div>`,
  iconSize: [60, 60],
  iconAnchor: [30, 30],
});

// Reads a compass heading (degrees clockwise from true north) out of a
// DeviceOrientationEvent. iOS exposes this directly as
// `webkitCompassHeading`; everything else reports `alpha`, which
// increases counter-clockwise, so it needs flipping to match. Returns
// null when the event doesn't carry usable heading data (no
// magnetometer, or the browser only fires relative — non-absolute —
// events).
function headingFromOrientationEvent(e) {
  if (typeof e.webkitCompassHeading === 'number') return e.webkitCompassHeading;
  if (e.absolute && typeof e.alpha === 'number') return (360 - e.alpha) % 360;
  return null;
}

// "My location" control — a live-updating blue dot with an accuracy
// radius and a heading cone, the same convention Google Maps uses, built
// on Leaflet's own map.locate()/map.stopLocate() wrapper around the
// browser Geolocation API plus the device orientation API for which way
// the phone itself is pointing. Clicking the button centers/zooms to the
// first fix and starts watching; clicking again turns it off. Only that
// first fix ever moves the map — later position updates just move the
// dot, so a user who's panned elsewhere doesn't get yanked back while
// their location keeps updating live in the background.
function addLocateControl(map) {
  let locationMarker = null;
  let accuracyCircle = null;
  let watching = false;
  let button = null;
  let orientationHandler = null;
  let orientationEventName = null;

  function clearLocationLayers() {
    if (locationMarker) { map.removeLayer(locationMarker); locationMarker = null; }
    if (accuracyCircle) { map.removeLayer(accuracyCircle); accuracyCircle = null; }
  }

  function onLocationFound(e) {
    if (!locationMarker) {
      locationMarker = L.marker(e.latlng, { icon: LOCATION_ICON, interactive: false, zIndexOffset: 1000 }).addTo(map);
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
    stopWatchingHeading();
    alert(e.message || "Couldn't get your location. Please check your browser's location permissions.");
  }

  function updateHeadingCone(heading) {
    if (!locationMarker) return;
    const svg = locationMarker.getElement()?.querySelector('.locate-heading');
    if (!svg) return;
    svg.style.display = 'block';
    svg.style.transform = `rotate(${heading}deg)`;
  }

  function onOrientation(e) {
    const heading = headingFromOrientationEvent(e);
    if (heading !== null) updateHeadingCone(heading);
  }

  // iOS 13+ requires an explicit, user-gesture-triggered permission
  // prompt before orientation events fire at all; everywhere else they
  // just work. "deviceorientationabsolute" (true-north-relative) is
  // preferred over plain "deviceorientation" where supported.
  function startWatchingHeading() {
    orientationEventName = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
    orientationHandler = onOrientation;

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(state => {
          if (state === 'granted') window.addEventListener(orientationEventName, orientationHandler);
        })
        .catch(() => {});
    } else if ('DeviceOrientationEvent' in window) {
      window.addEventListener(orientationEventName, orientationHandler);
    }
  }

  function stopWatchingHeading() {
    if (orientationHandler && orientationEventName) {
      window.removeEventListener(orientationEventName, orientationHandler);
    }
    orientationHandler = null;
    orientationEventName = null;
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
            stopWatchingHeading();
            button.classList.remove('active');
          } else {
            watching = true;
            button.classList.add('active');
            map.locate({ watch: true, enableHighAccuracy: true, maxZoom: 18 });
            startWatchingHeading();
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
