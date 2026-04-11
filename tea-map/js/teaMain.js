import { teaPlants } from './teaData.js';
import { teaInfo } from './teaInfo.js';
import { teaIcons, teaIconAlias, initializeTeaMap } from './teaMapConfig.js';
import { ediblePlantsInfo } from './ediblePlantInfo.js';

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

// Load plant gallery (tea/herbs)
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

// Load edible plants gallery
function loadEdiblePlantGallery() {
  const gallery = document.getElementById('plants-gallery');
  if (gallery.children.length > 0) return; // Already loaded
  
  // Create cards for each plant
  Object.keys(ediblePlantInfo).sort().forEach(plantName => {
    const plant = ediblePlantInfo[plantName];
    
    const card = document.createElement('div');
    card.className = 'plant-detail-card';
    
    // Create image carousel or single image
    let imageHTML = '';
    if (plant.images.length > 1) {
      imageHTML = `
        <div class="plant-image-carousel" data-plant="${plantName}">
          ${plant.images.map((img, index) => `
            <img src="${img}" alt="${plantName} ${index + 1}" class="plant-carousel-image ${index === 0 ? 'active' : ''}">
          `).join('')}
          <button class="carousel-button prev" onclick="changeImage('${plantName}', -1)">‹</button>
          <button class="carousel-button next" onclick="changeImage('${plantName}', 1)">›</button>
          <div class="carousel-dots">
            ${plant.images.map((_, index) => `
              <div class="carousel-dot ${index === 0 ? 'active' : ''}" onclick="goToImage('${plantName}', ${index})"></div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      imageHTML = `<img src="${plant.images[0]}" alt="${plantName}" class="single-plant-image">`;
    }
    
    card.innerHTML = `
      ${imageHTML}
      <div class="plant-detail-content">
        <h2>${plantName}</h2>
        <div class="plant-scientific-name">${plant.scientificName}</div>
        
        <div class="plant-section">
          <h3>Where to Find</h3>
          <p>${plant.whereToFind}</p>
        </div>
        
        <div class="plant-section">
          <h3>About</h3>
          <p>${plant.description}</p>
        </div>
        
        <div class="plant-section">
          <h3>Usage</h3>
          <p>${plant.usage}</p>
        </div>
        
        <div class="plant-section safety-warning">
          <h3>⚠️ Safety & Identification</h3>
          <p>${plant.safety}</p>
        </div>
      </div>
    `;
    
    gallery.appendChild(card);
  });
}

// Image carousel functionality
window.currentImageIndices = {};

window.changeImage = function(plantName, direction) {
  const carousel = document.querySelector(`.plant-image-carousel[data-plant="${plantName}"]`);
  const images = carousel.querySelectorAll('.plant-carousel-image');
  const dots = carousel.querySelectorAll('.carousel-dot');
  
  if (!window.currentImageIndices[plantName]) {
    window.currentImageIndices[plantName] = 0;
  }
  
  let currentIndex = window.currentImageIndices[plantName];
  images[currentIndex].classList.remove('active');
  dots[currentIndex].classList.remove('active');
  
  currentIndex = (currentIndex + direction + images.length) % images.length;
  
  images[currentIndex].classList.add('active');
  dots[currentIndex].classList.add('active');
  window.currentImageIndices[plantName] = currentIndex;
}

window.goToImage = function(plantName, index) {
  const carousel = document.querySelector(`.plant-image-carousel[data-plant="${plantName}"]`);
  const images = carousel.querySelectorAll('.plant-carousel-image');
  const dots = carousel.querySelectorAll('.carousel-dot');
  
  if (!window.currentImageIndices[plantName]) {
    window.currentImageIndices[plantName] = 0;
  }
  
  const currentIndex = window.currentImageIndices[plantName];
  images[currentIndex].classList.remove('active');
  dots[currentIndex].classList.remove('active');
  
  images[index].classList.add('active');
  dots[index].classList.add('active');
  window.currentImageIndices[plantName] = index;
}

// Page navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = e.target.getAttribute('data-page');
    
    if (!pageId) return;
    
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
    
    // Load edible plants gallery if switching to annuals page
    if (pageId === 'annuals') {
      loadEdiblePlantGallery();
    }
  });
});

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