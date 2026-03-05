import { teaPlants } from './teaData.js';
import { teaInfo } from './teaInfo.js';
import { teaIcons, teaIconAlias, initializeTeaMap } from './teaMapConfig.js';

const map = initializeTeaMap();
let allMarkers = [];

function showSidebar(plantType) {
  const info = teaInfo[plantType];
  if (!info) {
    console.warn(`No info available for "${plantType}"`);
    return;
  }
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <button id="closeSidebar">✕</button>
    <h2>${plantType}</h2>
    <img src="${info.image}" alt="${plantType}" style="width: 100%; margin: 10px 0;">
    <p><strong>Harvest Season:</strong> ${info.harvest}</p>
    <p>${info.description}</p>
    <p><strong>Usage:</strong> ${info.usage}</p>
  `;
  sidebar.classList.add('open');
}

// Add plant markers
teaPlants.forEach(plant => {
  const iconKey = teaIcons[plant.type] ? plant.type
                : teaIconAlias[plant.type] ? teaIconAlias[plant.type]
                : null;
  
  if (!iconKey) {
    console.warn(`No icon found for "${plant.type}"`);
    return;
  }

  const icon = teaIcons[iconKey];
  const marker = L.marker([plant.lat, plant.lng], { icon }).addTo(map);

  const infoButton = L.DomUtil.create('button', 'info-button');
  infoButton.textContent = 'i';
  infoButton.setAttribute('data-type', plant.type);

  const popupDiv = L.DomUtil.create('div');
  popupDiv.innerHTML = `<strong>${plant.type}</strong><br>`;
  popupDiv.appendChild(infoButton);

  marker.bindPopup(popupDiv);
  
  allMarkers.push({ marker, type: plant.type });
});

// Filter function
function filterByMonth(month) {
  allMarkers.forEach(({ marker, type }) => {
    const info = teaInfo[type];
    
    if (month === 'all') {
      if (!map.hasLayer(marker)) {
        marker.addTo(map);
      }
    } else {
      if (info && info.months && info.months.includes(month)) {
        if (!map.hasLayer(marker)) {
          marker.addTo(map);
        }
      } else {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      }
    }
  });
}

// Season filter
document.getElementById('season-filter').addEventListener('change', (e) => {
  filterByMonth(e.target.value);
});

// Page navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = e.target.getAttribute('data-page');
    
    if (!pageId) return; // Skip links without data-page (like fruit map link)
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    e.target.classList.add('active');
    
    // Refresh map if switching to map page
    if (pageId === 'map') {
      setTimeout(() => map.invalidateSize(), 100);
    }
    
    // Load gallery if switching to gallery page
    if (pageId === 'gallery') {
      loadGallery();
    }
  });
});

// Load plant gallery
function loadGallery() {
  const grid = document.getElementById('plant-grid');
  if (grid.children.length > 0) return; // Already loaded
  
  const uniquePlants = {};
  
  // Get unique plant types
  teaPlants.forEach(plant => {
    if (!uniquePlants[plant.type]) {
      uniquePlants[plant.type] = true;
    }
  });
  
  // Create cards for each plant
  Object.keys(uniquePlants).sort().forEach(plantType => {
    const info = teaInfo[plantType];
    if (!info) return;
    
    const card = document.createElement('div');
    card.className = 'fruit-card'; // Reusing fruit card styling
    card.innerHTML = `
      <img src="${info.image}" alt="${plantType}">
      <div class="fruit-card-content">
        <h3>${plantType}</h3>
        <p><strong>Harvest:</strong> ${info.harvest}</p>
        <p>${info.description.substring(0, 100)}...</p>
      </div>
    `;
    
    card.addEventListener('click', () => {
      // Switch to map page and show this plant's info
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('map-page').classList.add('active');
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelector('[data-page="map"]').classList.add('active');
      setTimeout(() => map.invalidateSize(), 100);
      showSidebar(plantType);
    });
    
    grid.appendChild(card);
  });
}

// Handle clicks
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('info-button')) {
    const plantType = e.target.getAttribute('data-type');
    showSidebar(plantType);
  }
  
  if (e.target.id === 'closeSidebar') {
    document.getElementById('sidebar').classList.remove('open');
  }
});