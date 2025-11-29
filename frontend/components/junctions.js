import { fetchDummyData } from './api.js';

let currentImageIndex = 0;
let junctionsData = [];
let rotationInterval = null;
let imageRotationInterval = null;
const totalImages = 9;

export async function renderJunctions() {
  console.log('renderJunctions called');
  const grid = document.getElementById('junctions-grid');
  if (!grid) {
    console.error('junctions-grid element not found!');
    return;
  }
  grid.innerHTML = '';
  junctionsData = await fetchDummyData('dummy_traffic.json');
  console.log('Loaded junctions:', junctionsData);
  grid.className = 'junctions-grid';
  
  junctionsData.forEach((j, index) => {
    const card = document.createElement('div');
    card.className = 'junction-card animated border-glow';
    card.id = `junction-card-${j.junction_id}`;
    
    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';
    
    const img = document.createElement('img');
    img.src = `../predicted0/${j.junction_id}.jpg`;
    img.alt = j.name;
    img.className = 'junction-img';
    img.id = `junction-img-${j.junction_id}`;
    img.onerror = function() {
      this.src = 'https://via.placeholder.com/180x120?text=No+Image';
    };
    
    imgContainer.appendChild(img);
    card.appendChild(imgContainer);
    card.innerHTML += `
      <h3>${j.name}</h3>
      <p>Congestion: <span class="congestion highlight-value" id="congestion-${j.junction_id}">${j.congestion_level}</span></p>
      <p>Vehicles: <span class="vehicles highlight-value" id="vehicles-${j.junction_id}">${j.vehicle_count}</span></p>
      <p>Avg Speed: <span class="speed highlight-value" id="speed-${j.junction_id}">${j.avg_speed} km/h</span></p>
      <div class="live-indicator">🔴 LIVE</div>
    `;
    grid.appendChild(card);
  });
  
  startLiveUpdates();
  startImageSlideshow();
}

function startLiveUpdates() {
  if (rotationInterval) clearInterval(rotationInterval);
  
  rotationInterval = setInterval(() => {
    junctionsData.forEach((j) => {
      const congestion = (Math.random() * 4 + 1).toFixed(1);
      const vehicles = Math.floor(Math.random() * 150 + 50);
      const speed = Math.floor(Math.random() * 40 + 20);
      
      updateValueWithAnimation('congestion-' + j.junction_id, congestion);
      updateValueWithAnimation('vehicles-' + j.junction_id, vehicles);
      updateValueWithAnimation('speed-' + j.junction_id, speed + ' km/h');
      
      j.congestion_level = parseFloat(congestion);
      j.vehicle_count = vehicles;
      j.avg_speed = speed;
    });
  }, 3000);
}

function startImageSlideshow() {
  if (imageRotationInterval) clearInterval(imageRotationInterval);
  
  imageRotationInterval = setInterval(() => {
    junctionsData.forEach((j) => {
      const img = document.getElementById(`junction-img-${j.junction_id}`);
      if (img) {
        img.classList.add('fade-out');
        setTimeout(() => {
          const newImageIndex = Math.floor(Math.random() * totalImages) + 1;
          img.src = `../predicted0/${newImageIndex}.jpg`;
          img.classList.remove('fade-out');
          img.classList.add('fade-in');
          setTimeout(() => img.classList.remove('fade-in'), 500);
        }, 300);
      }
    });
  }, 4000);
}

function updateValueWithAnimation(elementId, newValue) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add('value-update', 'highlight-pulse');
    element.textContent = newValue;
    setTimeout(() => {
      element.classList.remove('value-update', 'highlight-pulse');
    }, 800);
  }
}

export function getJunctionsData() {
  return junctionsData;
}
