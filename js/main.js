import { fruits } from './fruitData.js';
import { fruitInfo } from './fruitInfo.js';
import { icons, iconAlias, initializeMap } from './mapConfig.js';

const map = initializeMap();
let allMarkers = []; // Store all markers so we can filter them

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
  
  // Store marker with its fruit type for filtering
  allMarkers.push({ marker, type: fruit.type });
});

// Filter function
function filterByMonth(month) {
  allMarkers.forEach(({ marker, type }) => {
    const info = fruitInfo[type];
    
    if (month === 'all') {
      // Show all markers
      if (!map.hasLayer(marker)) {
        marker.addTo(map);
      }
    } else {
      // Check if fruit is available in selected month
      if (info && info.months && info.months.includes(month)) {
        if (!map.hasLayer(marker)) {
          marker.addTo(map);
        }
      } else {
        // Hide marker
        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      }
    }
  });
}

// Handle season filter change
document.getElementById('season-filter').addEventListener('change', (e) => {
  filterByMonth(e.target.value);
});

// Handle info button clicks
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('info-button')) {
    const fruitType = e.target.getAttribute('data-type');
    showSidebar(fruitType);
  }
  
  if (e.target.id === 'closeSidebar') {
    document.getElementById('sidebar').classList.remove('open');
  }
});