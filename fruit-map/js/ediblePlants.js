import { plantPhotoUrl } from './dataService.js';
import { escapeHtml } from './escapeHtml.js';
import { matchPhotoCreditWidths } from './photoStrip.js';

function tileImage(entry) {
  const first = entry.edible_plant_photos[0];
  if (!first) return '<div class="edible-tile-placeholder" aria-hidden="true"></div>';
  return `<img src="${escapeHtml(plantPhotoUrl(first.photo_path))}" alt="${escapeHtml(entry.common_name)}">`;
}

export function initEdiblePlants(entries) {
  const grid = document.getElementById('edible-grid');
  if (!grid || grid.children.length > 0) return;

  if (!entries.length) {
    grid.innerHTML = '<p class="empty-state">No edible plants have been added yet.</p>';
    return;
  }

  entries.forEach(entry => {
    const tile = document.createElement('div');
    tile.className = 'edible-tile';
    tile.innerHTML = `
      ${tileImage(entry)}
      <div class="edible-tile-content">
        <h3>${escapeHtml(entry.common_name)}</h3>
        ${entry.scientific_name ? `<p class="scientific-name">${escapeHtml(entry.scientific_name)}</p>` : ''}
      </div>
    `;
    tile.addEventListener('click', () => openEdiblePlantModal(entry));
    grid.appendChild(tile);
  });
}

export function openEdiblePlantModal(entry) {
  const content = document.getElementById('ediblePlantModalContent');
  const photos = entry.edible_plant_photos;

  content.innerHTML = `
    ${photos.length
      ? `<div class="edible-photo-strip">${photos.map(p => `
          <div class="photo-strip-item">
            <img src="${escapeHtml(plantPhotoUrl(p.photo_path))}" alt="${escapeHtml(entry.common_name)}">
            ${p.credit ? `<p class="photo-credit">Photo: ${escapeHtml(p.credit)}</p>` : ''}
          </div>`).join('')}</div>`
      : ''}
    <button class="share-photo-link" type="button" data-target-type="edible_plant" data-target-id="${escapeHtml(entry.id)}" data-target-label="${escapeHtml(entry.common_name)}">+ Share a photo of this</button>
    <h2>${escapeHtml(entry.common_name)}</h2>
    ${entry.scientific_name ? `<p class="scientific-name">${escapeHtml(entry.scientific_name)}</p>` : ''}
    <div class="info-box">
      <h4>Where it's found</h4>
      <p>${escapeHtml(entry.location_notes) || 'Coming soon.'}</p>
    </div>
    <div class="info-box">
      <h4>What you can do with it</h4>
      <p>${escapeHtml(entry.usage) || 'Coming soon.'}</p>
    </div>
  `;

  matchPhotoCreditWidths(content);
  document.getElementById('ediblePlantModal').classList.add('open');
}

export function initEdiblePlantModalClose() {
  document.getElementById('closeEdibleModal').addEventListener('click', () => {
    document.getElementById('ediblePlantModal').classList.remove('open');
  });
}
