import { fruits } from './fruitData.js';
import { fruitInfo } from './fruitInfo.js';
import { icons, iconAlias, initializeMap } from './mapConfig.js';

const map = initializeMap();
let allMarkers = [];

function showSidebar(fruitType) {
  const info = fruitInfo[fruitType];
  if (!info) {
    console.warn(`No info available for "${fruitType}"`);
    return;
  }
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <button id="closeSidebar">✕</button>
    <h2>${fruitType}</h2>
    <img src="${info.image}" alt="${fruitType}" style="width: 100%; margin: 10px 0;">
    <p><strong>Ripening:</strong> ${info.ripening}</p>
    <p>${info.description}</p>
    <p><strong>Usage:</strong> ${info.usage}</p>
  `;
  sidebar.classList.add('open');
}

// Add fruit markers
fruits.forEach(fruit => {
  const iconKey = icons[fruit.type] ? fruit.type
                : iconAlias[fruit.type] ? iconAlias[fruit.type]
                : null;
  
  if (!iconKey) {
    console.warn(`No icon found for "${fruit.type}"`);
    return;
  }

  const icon = icons[iconKey];
  const marker = L.marker([fruit.lat, fruit.lng], { icon }).addTo(map);

  const infoButton = L.DomUtil.create('button', 'info-button');
  infoButton.textContent = 'i';
  infoButton.setAttribute('data-type', fruit.type);

  const popupDiv = L.DomUtil.create('div');
  popupDiv.innerHTML = `<strong>${fruit.type}</strong><br>`;
  popupDiv.appendChild(infoButton);

  marker.bindPopup(popupDiv);
  
  allMarkers.push({ marker, type: fruit.type });
});

// Filter function
function filterByMonth(month) {
  allMarkers.forEach(({ marker, type }) => {
    const info = fruitInfo[type];
    
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

// Load fruit gallery
function loadGallery() {
  const grid = document.getElementById('fruit-grid');
  if (grid.children.length > 0) return; // Already loaded
  
  const uniqueFruits = {};
  
  // Get unique fruit types
  fruits.forEach(fruit => {
    if (!uniqueFruits[fruit.type]) {
      uniqueFruits[fruit.type] = true;
    }
  });
  
  // Create cards for each fruit
  Object.keys(uniqueFruits).sort().forEach(fruitType => {
    const info = fruitInfo[fruitType];
    if (!info) return;
    
    const card = document.createElement('div');
    card.className = 'fruit-card';
    card.innerHTML = `
      <img src="${info.image}" alt="${fruitType}">
      <div class="fruit-card-content">
        <h3>${fruitType}</h3>
        <p><strong>Ripening:</strong> ${info.ripening}</p>
        <p>${info.description.substring(0, 100)}...</p>
      </div>
    `;
    
    card.addEventListener('click', () => {
      // Switch to map page and show this fruit's info
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('map-page').classList.add('active');
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelector('[data-page="map"]').classList.add('active');
      setTimeout(() => map.invalidateSize(), 100);
      showSidebar(fruitType);
    });
    
    grid.appendChild(card);
  });
}

// Handle clicks
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('info-button')) {
    const fruitType = e.target.getAttribute('data-type');
    showSidebar(fruitType);
  }
  
  if (e.target.id === 'closeSidebar') {
    document.getElementById('sidebar').classList.remove('open');
  }
});