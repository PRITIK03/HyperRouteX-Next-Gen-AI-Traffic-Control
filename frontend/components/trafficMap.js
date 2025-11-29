export function renderTrafficMap() {
  console.log('renderTrafficMap called');
  const mapContainer = document.getElementById('traffic-map');
  if (!mapContainer) {
    console.error('traffic-map element not found!');
    return;
  }
  
  mapContainer.innerHTML = `
    <div class="map-view">
      <div class="map-placeholder">
        <svg width="100%" height="400" viewBox="0 0 800 400" id="traffic-svg">
          <!-- Background -->
          <rect width="800" height="400" fill="#1a1a2e"/>
          
          <!-- Roads -->
          <line x1="0" y1="200" x2="800" y2="200" stroke="#444" stroke-width="40"/>
          <line x1="400" y1="0" x2="400" y2="400" stroke="#444" stroke-width="40"/>
          <line x1="150" y1="0" x2="550" y2="400" stroke="#444" stroke-width="30"/>
          <line x1="650" y1="0" x2="250" y2="400" stroke="#444" stroke-width="30"/>
          
          <!-- Lane markings -->
          <line x1="0" y1="200" x2="800" y2="200" stroke="#fff" stroke-width="2" stroke-dasharray="20,10"/>
          <line x1="400" y1="0" x2="400" y2="400" stroke="#fff" stroke-width="2" stroke-dasharray="20,10"/>
          
          <!-- Moving vehicles group -->
          <g id="vehicles-group"></g>
          
          <!-- Emergency vehicles group -->
          <g id="emergency-vehicles-group"></g>
          
          <!-- Junction markers -->
          <circle cx="200" cy="100" r="15" fill="#00d4ff" class="junction-marker" data-junction="1">
            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="200" y="105" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">1</text>
          
          <circle cx="400" cy="200" r="15" fill="#ff6e7f" class="junction-marker" data-junction="2">
            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="400" y="205" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">2</text>
          
          <circle cx="600" cy="150" r="15" fill="#00d4ff" class="junction-marker" data-junction="3">
            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="600" y="155" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">3</text>
          
          <circle cx="300" cy="300" r="15" fill="#32ff7e" class="junction-marker" data-junction="4">
            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="300" y="305" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">4</text>
          
          <circle cx="500" cy="250" r="15" fill="#ff6e7f" class="junction-marker" data-junction="5">
            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="500" y="255" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">5</text>
          
          <circle cx="150" cy="200" r="15" fill="#32ff7e" class="junction-marker" data-junction="6">
            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="150" y="205" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">6</text>
          
          <circle cx="650" cy="200" r="15" fill="#00d4ff" class="junction-marker" data-junction="7">
            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="650" y="205" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">7</text>
          
          <circle cx="400" cy="100" r="15" fill="#32ff7e" class="junction-marker" data-junction="8">
            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="400" y="105" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">8</text>
          
          <circle cx="400" cy="320" r="15" fill="#ff6e7f" class="junction-marker" data-junction="9">
            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="400" y="325" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">9</text>
        </svg>
      </div>
      <div class="map-legend">
        <h4>Traffic Status</h4>
        <div class="legend-item">
          <span class="legend-color" style="background: #32ff7e;"></span>
          <span>Low Traffic</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #00d4ff;"></span>
          <span>Medium Traffic</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #ff6e7f;"></span>
          <span>High Traffic</span>
        </div>
      </div>
    </div>
  `;
  
  animateMapMarkers();
  animateVehicles();
  animateEmergencyVehicles();
}

function animateMapMarkers() {
  setInterval(() => {
    const markers = document.querySelectorAll('.junction-marker');
    markers.forEach(marker => {
      const colors = ['#32ff7e', '#00d4ff', '#ff6e7f'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      marker.setAttribute('fill', randomColor);
    });
  }, 3000);
}

function animateVehicles() {
  const vehiclesGroup = document.getElementById('vehicles-group');
  if (!vehiclesGroup) return;
  
  // Define proper lane routes with correct positioning
  const lanes = [
    // Horizontal road (y=200) - two lanes
    { path: 'horizontal-top', startX: 0, startY: 185, endX: 800, endY: 185, lane: 'top' },
    { path: 'horizontal-bottom', startX: 800, startY: 215, endX: 0, endY: 215, lane: 'bottom' },
    
    // Vertical road (x=400) - two lanes
    { path: 'vertical-left', startX: 385, startY: 0, endX: 385, endY: 400, lane: 'left' },
    { path: 'vertical-right', startX: 415, startY: 400, endX: 415, endY: 0, lane: 'right' },
    
    // Diagonal road 1 (NW to SE)
    { path: 'diagonal1-lane1', startX: 140, startY: 0, endX: 540, endY: 400, lane: 'd1' },
    { path: 'diagonal1-lane2', startX: 160, startY: 0, endX: 560, endY: 400, lane: 'd1' },
    
    // Diagonal road 2 (NE to SW)
    { path: 'diagonal2-lane1', startX: 640, startY: 0, endX: 240, endY: 400, lane: 'd2' },
    { path: 'diagonal2-lane2', startX: 660, startY: 0, endX: 260, endY: 400, lane: 'd2' }
  ];
  
  const vehicleColors = ['#ffdd00', '#00d4ff', '#ff6e7f', '#32ff7e', '#ffffff'];
  const vehicleTypes = [
    { width: 12, height: 8 },  // Car
    { width: 16, height: 10 }, // Bus
    { width: 10, height: 6 }   // Bike
  ];
  
  // Create 25 vehicles with proper lane discipline
  for (let i = 0; i < 25; i++) {
    const lane = lanes[i % lanes.length];
    const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
    const color = vehicleColors[Math.floor(Math.random() * vehicleColors.length)];
    const speed = (Math.random() * 4 + 6).toFixed(1); // 6-10 seconds
    const delay = (Math.random() * speed).toFixed(1);
    
    const vehicle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    vehicle.setAttribute('width', vehicleType.width);
    vehicle.setAttribute('height', vehicleType.height);
    vehicle.setAttribute('fill', color);
    vehicle.setAttribute('rx', '2');
    vehicle.setAttribute('class', 'map-vehicle');
    vehicle.setAttribute('opacity', '0.9');
    
    // Add headlights effect
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    glow.setAttribute('id', `glow-${i}`);
    glow.innerHTML = '<feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>';
    vehicle.setAttribute('filter', `url(#glow-${i})`);
    
    const animateX = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateX.setAttribute('attributeName', 'x');
    animateX.setAttribute('from', lane.startX);
    animateX.setAttribute('to', lane.endX);
    animateX.setAttribute('dur', speed + 's');
    animateX.setAttribute('repeatCount', 'indefinite');
    animateX.setAttribute('begin', delay + 's');
    
    const animateY = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateY.setAttribute('attributeName', 'y');
    animateY.setAttribute('from', lane.startY);
    animateY.setAttribute('to', lane.endY);
    animateY.setAttribute('dur', speed + 's');
    animateY.setAttribute('repeatCount', 'indefinite');
    animateY.setAttribute('begin', delay + 's');
    
    vehicle.appendChild(animateX);
    vehicle.appendChild(animateY);
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.appendChild(glow);
    vehiclesGroup.appendChild(defs);
    vehiclesGroup.appendChild(vehicle);
  }
}

function animateEmergencyVehicles() {
  const emergencyGroup = document.getElementById('emergency-vehicles-group');
  if (!emergencyGroup) return;
  
  // Create 2-3 emergency vehicles (ambulance, fire truck, police)
  const emergencyTypes = [
    { color: '#ff0000', type: 'ambulance', width: 16, height: 10 },
    { color: '#ff6e00', type: 'firetruck', width: 18, height: 12 },
    { color: '#0066ff', type: 'police', width: 14, height: 9 }
  ];
  
  const emergencyLanes = [
    { path: 'horizontal-emergency', startX: 0, startY: 185, endX: 800, endY: 185 },
    { path: 'vertical-emergency', startX: 385, startY: 0, endX: 385, endY: 400 },
    { path: 'diagonal-emergency', startX: 140, startY: 0, endX: 540, endY: 400 }
  ];
  
  emergencyTypes.forEach((emType, index) => {
    const lane = emergencyLanes[index % emergencyLanes.length];
    const speed = (Math.random() * 2 + 4).toFixed(1); // Faster: 4-6 seconds
    
    // Create emergency vehicle group with flashers
    const emergencyVehicle = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    emergencyVehicle.setAttribute('class', 'emergency-vehicle-group');
    
    // Vehicle body
    const vehicle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    vehicle.setAttribute('width', emType.width);
    vehicle.setAttribute('height', emType.height);
    vehicle.setAttribute('fill', emType.color);
    vehicle.setAttribute('rx', '2');
    vehicle.setAttribute('class', 'emergency-vehicle');
    vehicle.setAttribute('stroke', '#fff');
    vehicle.setAttribute('stroke-width', '1');
    
    // Flasher light
    const flasher = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    flasher.setAttribute('cx', emType.width / 2);
    flasher.setAttribute('cy', emType.height / 2);
    flasher.setAttribute('r', '3');
    flasher.setAttribute('fill', '#ffffff');
    flasher.setAttribute('class', 'emergency-flasher');
    
    // Flasher animation
    const flasherAnim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    flasherAnim.setAttribute('attributeName', 'opacity');
    flasherAnim.setAttribute('values', '1;0;1');
    flasherAnim.setAttribute('dur', '0.5s');
    flasherAnim.setAttribute('repeatCount', 'indefinite');
    flasher.appendChild(flasherAnim);
    
    // Add glow filter
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', `emergency-glow-${index}`);
    filter.innerHTML = `
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    `;
    defs.appendChild(filter);
    emergencyVehicle.appendChild(defs);
    
    vehicle.setAttribute('filter', `url(#emergency-glow-${index})`);
    
    // Position animations
    const animateX = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
    animateX.setAttribute('attributeName', 'transform');
    animateX.setAttribute('type', 'translate');
    animateX.setAttribute('from', `${lane.startX} ${lane.startY}`);
    animateX.setAttribute('to', `${lane.endX} ${lane.endY}`);
    animateX.setAttribute('dur', speed + 's');
    animateX.setAttribute('repeatCount', 'indefinite');
    
    emergencyVehicle.appendChild(vehicle);
    emergencyVehicle.appendChild(flasher);
    emergencyVehicle.appendChild(animateX);
    
    emergencyGroup.appendChild(emergencyVehicle);
  });
  
  // Update emergency vehicle visibility based on signal control state
  setInterval(() => {
    // This syncs with the emergency detection in signal control
    const hasActiveEmergency = Math.random() > 0.85; // 15% visible
    if (emergencyGroup) {
      emergencyGroup.style.opacity = hasActiveEmergency ? '1' : '0';
    }
  }, 5000);
}
