import { fruits } from './fruitData.js';  // Changed from 'fruits' to 'fruitData'
import { fruitInfo } from './fruitInfo.js';
import { icons, iconAlias, initializeMap } from './mapConfig.js';

const map = initializeMap();

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
fruits.forEach(fruit => {  // Changed from 'fruits' to 'fruitData'
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