import { buildIcon, initializeMap, updateMapTiles } from './mapConfig.js';
import { fetchPlantInfo, fetchApprovedPlants, fetchEdiblePlants, fetchApprovedFunPhotos, plantPhotoUrl, submitSighting, submitPhoto } from './dataService.js';
import { initEdiblePlants, initEdiblePlantModalClose } from './ediblePlants.js';
import { escapeHtml } from './escapeHtml.js';

const BASEMAP_KEY = 'fruitmap-basemap';
const KNOWN_PAGES = ['map', 'gallery', 'edible', 'about', 'community'];
let currentPage = 'map';

let basemapStyle = localStorage.getItem(BASEMAP_KEY) || 'streets';
const map = initializeMap(basemapStyle);

// Show the right tab immediately if arriving via a link like
// fruit-map/index.html#gallery — this runs before any data has loaded, so
// the map never flashes on screen first. See showPage()/populatePage()
// further down for how the data-dependent half catches up once ready.
{
  const initialHashPage = location.hash.replace('#', '');
  if (KNOWN_PAGES.includes(initialHashPage)) showPage(initialHashPage);
}

let allMarkers = [];
let plantInfo = {};
let ediblePlants = [];
let pickedLocation = null;
let pickingLocation = false;
let activeTypeFilter = null;

function initBasemapToggle() {
  document.querySelectorAll('#basemap-toggle button').forEach(button => {
    button.classList.toggle('active', button.dataset.basemap === basemapStyle);

    button.addEventListener('click', () => {
      basemapStyle = button.dataset.basemap;
      localStorage.setItem(BASEMAP_KEY, basemapStyle);

      document.querySelectorAll('#basemap-toggle button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      updateMapTiles(map, basemapStyle);
    });
  });
}

function addMarker(plant) {
  const info = plantInfo[plant.common_name];
  const icon = buildIcon(info?.icon_key);
  const marker = icon
    ? L.marker([plant.lat, plant.lng], { icon }).addTo(map)
    : L.marker([plant.lat, plant.lng]).addTo(map);

  const infoButton = L.DomUtil.create('button', 'info-button');
  infoButton.textContent = 'i';
  infoButton.setAttribute('data-type', plant.common_name);

  const popupDiv = L.DomUtil.create('div');
  popupDiv.innerHTML = `<strong>${escapeHtml(plant.common_name)}</strong><br>`;
  popupDiv.appendChild(infoButton);

  marker.bindPopup(popupDiv);

  allMarkers.push({ marker, type: plant.common_name });
}

// Shows/hides markers based on the season dropdown AND the optional
// "Find on Map" species filter at once, so the two never fight each other.
function applyFilters() {
  const month = document.getElementById('season-filter').value;
  const visibleLatLngs = [];

  allMarkers.forEach(({ marker, type }) => {
    const info = plantInfo[type];
    const monthMatch = month === 'all' || (info && info.months && info.months.includes(month));
    const typeMatch = !activeTypeFilter || type === activeTypeFilter;
    const visible = monthMatch && typeMatch;

    if (visible) {
      if (!map.hasLayer(marker)) marker.addTo(map);
      visibleLatLngs.push(marker.getLatLng());
    } else if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  });

  return visibleLatLngs;
}

function updateTypeFilterBadge() {
  const badge = document.getElementById('type-filter-badge');
  document.getElementById('type-filter-label').textContent = activeTypeFilter ? `Showing: ${activeTypeFilter}` : '';
  badge.style.display = activeTypeFilter ? 'flex' : 'none';
}

function setTypeFilter(fruitType) {
  activeTypeFilter = fruitType;
  updateTypeFilterBadge();
  const visibleLatLngs = applyFilters();
  if (visibleLatLngs.length) {
    map.fitBounds(visibleLatLngs, { padding: [60, 60], maxZoom: 18 });
  }
}

function clearTypeFilter() {
  activeTypeFilter = null;
  updateTypeFilterBadge();
  applyFilters();
}

function showOnMap(fruitType) {
  showPage('map');
  document.getElementById('season-filter').value = 'all';
  setTypeFilter(fruitType);
}

// Falls back to the first admin-approved extra photo when a species has
// no cover `image` set yet, so a fruit isn't stuck photoless on its card
// just because nobody's gotten around to picking an official cover shot.
function cardImage(info, fruitType) {
  const src = info.image || plantPhotoUrl((info.plant_photos || [])[0]?.photo_path);
  return src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(fruitType)}">` : '<div class="edible-tile-placeholder" aria-hidden="true"></div>';
}

function loadGallery(plants) {
  const grid = document.getElementById('fruit-grid');
  if (grid.children.length > 0) return;

  const uniqueTypes = [...new Set(plants.map(p => p.common_name))].sort();

  uniqueTypes.forEach(fruitType => {
    const info = plantInfo[fruitType];
    if (!info) return;

    const card = document.createElement('div');
    card.className = 'fruit-card';
    card.innerHTML = `
      ${cardImage(info, fruitType)}
      <div class="fruit-card-content">
        <h3>${escapeHtml(fruitType)}</h3>
        ${info.scientific_name ? `<p class="scientific-name">${escapeHtml(info.scientific_name)}</p>` : ''}
      </div>
    `;

    card.addEventListener('click', () => openFruitDetailModal(fruitType));

    grid.appendChild(card);
  });
}

function openFruitDetailModal(fruitType) {
  const info = plantInfo[fruitType];
  if (!info) return;

  const realPhotos = [
    ...(info.image ? [{ src: info.image, credit: null }] : []),
    ...(info.plant_photos || []).map(p => ({ src: plantPhotoUrl(p.photo_path), credit: p.credit })),
  ];
  const placeholderCount = Math.max(0, 3 - realPhotos.length);

  const content = document.getElementById('fruitDetailModalContent');
  content.innerHTML = `
    <div class="edible-photo-strip">
      ${realPhotos.map(p => `
        <div class="photo-strip-item">
          <img src="${escapeHtml(p.src)}" alt="${escapeHtml(fruitType)}">
          ${p.credit ? `<p class="photo-credit">Photo: ${escapeHtml(p.credit)}</p>` : ''}
        </div>`).join('')}
      ${Array.from({ length: placeholderCount }).map(() => '<div class="photo-placeholder-lg">More ID photos coming soon</div>').join('')}
    </div>
    <button class="share-photo-link" type="button" data-target-type="plant_info" data-target-id="${escapeHtml(fruitType)}" data-target-label="${escapeHtml(fruitType)}">+ Share a photo of this</button>
    <h2>${escapeHtml(fruitType)}</h2>
    ${info.scientific_name ? `<p class="scientific-name">${escapeHtml(info.scientific_name)}</p>` : ''}
    <p class="ripening-line"><strong>Ripening:</strong> ${escapeHtml(info.ripening || 'TBD')}</p>
    <div class="info-box">
      <h4>Description</h4>
      <p>${escapeHtml(info.description) || 'Coming soon.'}</p>
    </div>
    <div class="info-box">
      <h4>Usage</h4>
      <p>${escapeHtml(info.usage) || 'Coming soon.'}</p>
    </div>
    <button id="findOnMapBtn" class="find-on-map-btn" type="button">Find on Map</button>
  `;

  document.getElementById('findOnMapBtn').addEventListener('click', () => {
    closeFruitDetailModal();
    showOnMap(fruitType);
  });

  document.getElementById('fruitDetailModal').classList.add('open');
}

function closeFruitDetailModal() {
  document.getElementById('fruitDetailModal').classList.remove('open');
}

// ─── Share a Photo (ID photo only) ────────────────────────────
// Opened only from a specific fruit/edible plant's detail modal — there's
// no choice to make here, it's always an ID photo for that exact plant.
// Fun/haul photos live in the separate Community Finds flow below.

let sharePhotoTarget = { targetType: null, targetId: null };

function openSharePhotoModal({ targetType, targetId, label }) {
  sharePhotoTarget = { targetType, targetId };
  document.getElementById('sharePhotoTarget').textContent = label;
  document.getElementById('sharePhotoForm').reset();
  document.getElementById('sharePhotoForm').style.display = 'flex';
  document.getElementById('sharePhotoSuccess').style.display = 'none';
  document.getElementById('sharePhotoModal').classList.add('open');
}

function closeSharePhotoModal() {
  document.getElementById('sharePhotoModal').classList.remove('open');
}

function initSharePhotoFlow() {
  document.getElementById('closeSharePhotoModal').addEventListener('click', closeSharePhotoModal);
  document.getElementById('sharePhotoDoneBtn').addEventListener('click', closeSharePhotoModal);

  document.getElementById('sharePhotoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const photoFile = document.getElementById('sharePhotoFile').files[0];
    if (!photoFile) {
      alert('Please choose a photo.');
      return;
    }

    const note = document.getElementById('sharePhotoNote').value.trim();
    const photographerName = document.getElementById('sharePhotoName').value.trim();
    const submitBtn = document.getElementById('sharePhotoSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      await submitPhoto({
        kind: 'id_photo',
        targetType: sharePhotoTarget.targetType,
        targetId: sharePhotoTarget.targetId,
        note,
        photographerName,
        photoFile,
      });
      document.getElementById('sharePhotoForm').style.display = 'none';
      document.getElementById('sharePhotoSuccess').style.display = 'block';
    } catch (err) {
      console.error(err);
      alert('Something went wrong submitting your photo. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Photo';
    }
  });
}

// ─── Community Finds ──────────────────────────────────────────
// "What Other Foragers Have Found" — a public gallery of fun/haul photos,
// each with a caption, date, and photographer name collected at
// submission time. Separate from ID photos: no plant is implied or
// required here.

function formatFoundDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function loadCommunityFinds() {
  const grid = document.getElementById('community-grid');
  if (grid.dataset.loaded === 'true') return;
  grid.dataset.loaded = 'true';

  try {
    const photos = await fetchApprovedFunPhotos();
    grid.innerHTML = photos.length
      ? photos.map(p => `
          <div class="community-tile">
            <img src="${escapeHtml(plantPhotoUrl(p.photo_path))}" alt="${escapeHtml(p.submitter_note) || 'Community photo'}">
            <div class="community-tile-content">
              ${p.submitter_note ? `<p class="community-caption">${escapeHtml(p.submitter_note)}</p>` : ''}
              <p class="community-meta">${p.photographer_name ? `${escapeHtml(p.photographer_name)} — ` : ''}${escapeHtml(formatFoundDate(p.created_at))}</p>
            </div>
          </div>`).join('')
      : '<p class="empty-state">No community photos yet — be the first to share one!</p>';
  } catch (err) {
    console.error('Failed to load community photos:', err);
    grid.innerHTML = '<p class="empty-state">Could not load community photos.</p>';
  }
}

function openFunPhotoModal() {
  document.getElementById('funPhotoForm').reset();
  document.getElementById('funPhotoForm').style.display = 'flex';
  document.getElementById('funPhotoSuccess').style.display = 'none';
  document.getElementById('funPhotoModal').classList.add('open');
}

function closeFunPhotoModal() {
  document.getElementById('funPhotoModal').classList.remove('open');
}

function initFunPhotoFlow() {
  document.getElementById('openFunPhotoModalBtn').addEventListener('click', openFunPhotoModal);
  document.getElementById('closeFunPhotoModal').addEventListener('click', closeFunPhotoModal);
  document.getElementById('funPhotoDoneBtn').addEventListener('click', closeFunPhotoModal);

  document.getElementById('funPhotoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const photoFile = document.getElementById('funPhotoFile').files[0];
    if (!photoFile) {
      alert('Please choose a photo.');
      return;
    }

    const caption = document.getElementById('funPhotoCaption').value.trim();
    const photographerName = document.getElementById('funPhotoName').value.trim();
    const submitBtn = document.getElementById('funPhotoSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      await submitPhoto({ kind: 'fun_photo', note: caption, photographerName, photoFile });
      document.getElementById('funPhotoForm').style.display = 'none';
      document.getElementById('funPhotoSuccess').style.display = 'block';
    } catch (err) {
      console.error(err);
      alert('Something went wrong submitting your photo. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Photo';
    }
  });
}

// ─── Report a Sighting ──────────────────────────────────────

function populateSpeciesDropdown() {
  const select = document.getElementById('reportSpecies');
  const existingOptions = Object.keys(plantInfo).sort();
  select.innerHTML = '<option value="">Select a fruit...</option>' +
    existingOptions.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('') +
    '<option value="__other__">Other (fruit not listed)</option>';
}

function openReportModal() {
  document.getElementById('reportModal').classList.add('open');
  document.getElementById('reportForm').style.display = 'flex';
  document.getElementById('reportSuccess').style.display = 'none';
  document.getElementById('reportForm').reset();
  document.getElementById('reportNewSpeciesField').style.display = 'none';
  pickedLocation = null;
  pickingLocation = false;
  updateLocationStatus();
}

function closeReportModal() {
  document.getElementById('reportModal').classList.remove('open');
  pickingLocation = false;
  document.getElementById('map').style.cursor = '';
}

function updateLocationStatus() {
  const statusEl = document.getElementById('reportLocationStatus');
  if (pickedLocation) {
    statusEl.textContent = `Location set: ${pickedLocation.lat.toFixed(5)}, ${pickedLocation.lng.toFixed(5)}`;
  } else if (pickingLocation) {
    statusEl.textContent = 'Click anywhere on the map to drop a pin...';
  } else {
    statusEl.textContent = 'No location set yet — pick it on the map or enter coordinates below.';
  }
}

function handleCoordInput() {
  const lat = parseFloat(document.getElementById('reportLat').value);
  const lng = parseFloat(document.getElementById('reportLng').value);
  const valid = Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  pickedLocation = valid ? { lat, lng } : null;
  updateLocationStatus();
}

function initReportFlow() {
  document.getElementById('reportSightingBtn').addEventListener('click', openReportModal);
  document.getElementById('closeReportModal').addEventListener('click', closeReportModal);
  document.getElementById('reportDoneBtn').addEventListener('click', closeReportModal);

  document.getElementById('reportSpecies').addEventListener('change', (e) => {
    const isOther = e.target.value === '__other__';
    document.getElementById('reportNewSpeciesField').style.display = isOther ? 'block' : 'none';
  });

  document.getElementById('pickLocationBtn').addEventListener('click', () => {
    pickingLocation = true;
    // The modal is a full-screen overlay, so it has to get out of the way
    // for clicks to reach the map underneath.
    document.getElementById('reportModal').classList.remove('open');
    document.getElementById('map').style.cursor = 'crosshair';
  });

  document.getElementById('reportLat').addEventListener('input', handleCoordInput);
  document.getElementById('reportLng').addEventListener('input', handleCoordInput);

  map.on('click', (e) => {
    if (!pickingLocation) return;
    pickedLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
    pickingLocation = false;
    document.getElementById('map').style.cursor = '';
    document.getElementById('reportModal').classList.add('open');
    document.getElementById('reportLat').value = pickedLocation.lat.toFixed(6);
    document.getElementById('reportLng').value = pickedLocation.lng.toFixed(6);
    updateLocationStatus();
  });

  document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!pickedLocation) {
      alert('Please pick a location on the map or enter valid coordinates first.');
      return;
    }

    const speciesSelect = document.getElementById('reportSpecies');
    let commonName = speciesSelect.value;
    if (!commonName) {
      alert('Please select a fruit type.');
      return;
    }
    if (commonName === '__other__') {
      commonName = document.getElementById('reportNewSpeciesName').value.trim();
      if (!commonName) {
        alert('Please enter the name of the fruit.');
        return;
      }
    }

    const note = document.getElementById('reportNote').value.trim();
    const photoFile = document.getElementById('reportPhoto').files[0] || null;
    const submitBtn = document.getElementById('reportSubmitBtn');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      await submitSighting({ commonName, lat: pickedLocation.lat, lng: pickedLocation.lng, note, photoFile });
      document.getElementById('reportForm').style.display = 'none';
      document.getElementById('reportSuccess').style.display = 'block';
    } catch (err) {
      console.error(err);
      alert('Something went wrong submitting your sighting. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Sighting';
    }
  });
}

// ─── Page navigation ────────────────────────────────────────

// Pure visual tab switch — no data dependency, safe to call before any
// fetch has resolved. Kept separate from populatePage() below so a
// homepage link like fruit-map/index.html#gallery shows the right tab
// immediately instead of flashing the map while data loads.
function showPage(pageId) {
  if (!KNOWN_PAGES.includes(pageId)) return;
  currentPage = pageId;

  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(`${pageId}-page`).classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-page') === pageId);
  });

  if (pageId === 'map') {
    setTimeout(() => map.invalidateSize(), 100);
  }
}

// The data-dependent half of switching tabs. loadGallery/initEdiblePlants
// both guard against re-populating an already-filled grid, so calling this
// again after data loads (even for a tab shown earlier with no data yet)
// is safe.
function populatePage(pageId, plants) {
  if (pageId === 'gallery') {
    loadGallery(plants);
  }
  if (pageId === 'edible') {
    initEdiblePlants(ediblePlants);
  }
  if (pageId === 'community') {
    loadCommunityFinds();
  }
}

function initCommunityLink() {
  document.getElementById('communityLink').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('community');
    populatePage('community');
  });
}

function initNav(plants) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = e.target.getAttribute('data-page');
      showPage(pageId);
      populatePage(pageId, plants);
    });
  });
}

function initNavHamburger() {
  const btn = document.getElementById('navHamburgerBtn');
  const menu = document.getElementById('navMobileMenu');

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

function initAboutSubnav() {
  document.querySelectorAll('.about-subnav button').forEach(button => {
    button.addEventListener('click', () => {
      const subpageId = button.getAttribute('data-subpage');

      document.querySelectorAll('.about-subpage').forEach(sub => sub.classList.remove('active'));
      document.getElementById(`about-${subpageId}`).classList.add('active');

      document.querySelectorAll('.about-subnav button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('info-button')) {
    openFruitDetailModal(e.target.getAttribute('data-type'));
  }
  if (e.target.classList.contains('share-photo-link')) {
    openSharePhotoModal({
      targetType: e.target.dataset.targetType,
      targetId: e.target.dataset.targetId,
      label: e.target.dataset.targetLabel,
    });
  }
});

document.getElementById('season-filter').addEventListener('change', () => {
  applyFilters();
});

document.getElementById('clearTypeFilterBtn').addEventListener('click', clearTypeFilter);
document.getElementById('closeFruitDetailModal').addEventListener('click', closeFruitDetailModal);

// ─── Bootstrap ──────────────────────────────────────────────

function showLoadError(message) {
  const banner = document.getElementById('load-error-banner');
  banner.textContent = message;
  banner.style.display = 'block';
}

async function init() {
  let plants = [];
  try {
    plantInfo = await fetchPlantInfo();
    plants = await fetchApprovedPlants();
  } catch (err) {
    console.error('Failed to load fruit data:', err);
    showLoadError('Could not load fruit map data. Please refresh and try again.');
  }

  try {
    ediblePlants = await fetchEdiblePlants();
  } catch (err) {
    console.error('Failed to load edible plants:', err);
  }

  plants.forEach(addMarker);
  initNav(plants);
  initNavHamburger();
  // Whatever tab showPage() already switched to on script load (e.g. a
  // homepage link landing on #gallery) can only populate its grid now
  // that plantInfo/plants/ediblePlants have actually loaded.
  populatePage(currentPage, plants);

  populateSpeciesDropdown();
  initReportFlow();
  initSharePhotoFlow();
  initFunPhotoFlow();
  initCommunityLink();
  initAboutSubnav();
  initEdiblePlantModalClose();
  initBasemapToggle();
}

init();
