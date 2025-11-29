import { fetchDummyData } from './api.js';

let signalTimings = {};
let updateInterval = null;
let emergencyVehicles = {}; // Track emergency vehicles by junction
let emergencyRoutes = {}; // Track emergency vehicle routes

export async function renderSignalControl() {
  console.log('renderSignalControl called');
  const panel = document.getElementById('signal-control-panel');
  if (!panel) {
    console.error('signal-control-panel element not found!');
    return;
  }
  
  const junctions = await fetchDummyData('dummy_traffic.json');
  
  panel.innerHTML = `
    <div class="signal-control-header">
      <p class="info">🤖 AI-Powered Adaptive Signal Control | Real-time optimization with predictive analytics</p>
      <div class="system-stats-header">
        <div class="stat-card">
          <div class="stat-label">Active Signals</div>
          <div class="stat-value" id="active-signals">9</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Avg Wait Time</div>
          <div class="stat-value" id="avg-wait-time">28s</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">System Efficiency</div>
          <div class="stat-value" id="system-efficiency">87%</div>
        </div>
        <div class="stat-card emergency-stat">
          <div class="stat-label">Emergency Vehicles</div>
          <div class="stat-value" id="emergency-count">0</div>
        </div>
      </div>
      <div id="emergency-banner" class="emergency-banner" style="display: none;">
        <div class="banner-content">
          <span class="banner-icon">🚨</span>
          <span class="banner-text">EMERGENCY VEHICLE DETECTED - Green Corridor Activated</span>
          <span class="banner-icon">🚨</span>
        </div>
      </div>
      <div class="control-modes">
        <button class="mode-btn active" data-mode="adaptive">⚡ Adaptive Mode</button>
        <button class="mode-btn" data-mode="emergency">🚨 Emergency Priority</button>
        <button class="mode-btn" data-mode="pedestrian">🚶 Pedestrian Mode</button>
        <button class="mode-btn" data-mode="coordinated">🔗 Coordinated Signals</button>
      </div>
    </div>
    <div class="signal-grid" id="signal-grid"></div>
  `;
  
  const signalGrid = document.getElementById('signal-grid');
  
  junctions.forEach(j => {
    const timing = calculateSignalTiming(j.congestion_level);
    signalTimings[j.junction_id] = timing;
    
    const signalCard = document.createElement('div');
    signalCard.className = 'signal-card animated signal-card-glow';
    signalCard.id = `signal-${j.junction_id}`;
    
    const queueLength = Math.floor(j.congestion_level * 8 + Math.random() * 5);
    const pedestrianWaiting = Math.floor(Math.random() * 15);
    
    signalCard.innerHTML = `
      <div class="signal-card-header">
        <h3>${j.name}</h3>
        <span class="junction-status active">✅ ACTIVE</span>
      </div>
      <div class="emergency-detection" id="emergency-detection-${j.junction_id}" style="display: none;">
        <div class="emergency-alert">
          <div class="emergency-icon-large">🚨</div>
          <div class="emergency-details">
            <div class="emergency-type" id="emergency-type-${j.junction_id}">Ambulance</div>
            <div class="emergency-distance" id="emergency-distance-${j.junction_id}">200m away</div>
            <div class="emergency-eta" id="emergency-eta-${j.junction_id}">ETA: 15s</div>
          </div>
          <div class="green-corridor-status">
            <div class="corridor-icon">🟢</div>
            <div class="corridor-text">Green Corridor Active</div>
            <div class="corridor-countdown" id="corridor-countdown-${j.junction_id}">30s</div>
          </div>
        </div>
      </div>
      <div class="signal-metrics">
        <div class="metric">
          <span class="metric-icon">🚗</span>
          <span class="metric-label">Queue:</span>
          <span class="metric-value" id="queue-${j.junction_id}">${queueLength}</span>
        </div>
        <div class="metric">
          <span class="metric-icon">🚶</span>
          <span class="metric-label">Pedestrians:</span>
          <span class="metric-value" id="ped-${j.junction_id}">${pedestrianWaiting}</span>
        </div>
        <div class="metric emergency-indicator" id="emergency-${j.junction_id}" style="display: none;">
          <span class="metric-icon">🚨</span>
          <span class="metric-label">Emergency Vehicle Priority Active!</span>
        </div>
      </div>
      <div class="signal-lights">
        <div class="light red active" data-junction="${j.junction_id}">
          <div class="light-inner"></div>
        </div>
        <div class="light yellow" data-junction="${j.junction_id}">
          <div class="light-inner"></div>
        </div>
        <div class="light green" data-junction="${j.junction_id}">
          <div class="light-inner"></div>
        </div>
      </div>
      <div class="timing-info">
        <div class="timing-item">
          <span class="label">🔴 Red Phase:</span>
          <span class="value timing-value" id="red-time-${j.junction_id}">${timing.red}s</span>
        </div>
        <div class="timing-item">
          <span class="label">🟢 Green Phase:</span>
          <span class="value timing-value" id="green-time-${j.junction_id}">${timing.green}s</span>
        </div>
        <div class="timing-item">
          <span class="label">🟡 Yellow Phase:</span>
          <span class="value timing-value">${timing.yellow}s</span>
        </div>
        <div class="timing-item pedestrian-phase" id="ped-phase-${j.junction_id}">
          <span class="label">🚶 Walk Phase:</span>
          <span class="value timing-value">${timing.pedestrian}s</span>
        </div>
      </div>
      <div class="signal-progress">
        <div class="progress-label">Current Cycle Progress</div>
        <div class="progress-bar-container">
          <div class="progress-bar" id="progress-${j.junction_id}"></div>
        </div>
      </div>
      <div class="congestion-indicator" style="background: ${getCongestionColor(j.congestion_level)}">
        <span class="congestion-label">Traffic Density:</span>
        <span class="congestion-value" id="signal-congestion-${j.junction_id}">${j.congestion_level.toFixed(1)}</span>
        <span class="congestion-trend">${getCongestionTrend(j.congestion_level)}</span>
      </div>
      <div class="optimization-info">
        <span class="opt-label">🎯 Optimization:</span>
        <span class="opt-value" id="opt-${j.junction_id}">Queue-based adaptive</span>
      </div>
    `;
    
    signalGrid.appendChild(signalCard);
  });
  
  startSignalAnimation();
}

function calculateSignalTiming(congestionLevel, queueLength = 0) {
  // Real-world adaptive timing based on queue length and congestion
  const baseGreen = 25;
  const baseRed = 35;
  const queueFactor = Math.min(queueLength * 2, 25); // Max 25s additional
  
  if (congestionLevel < 2) {
    // Low traffic - shorter cycles, include pedestrian phase
    return { 
      green: baseGreen + queueFactor, 
      red: baseRed, 
      yellow: 3,
      pedestrian: 15 // Walk phase for pedestrians
    };
  } else if (congestionLevel < 3.5) {
    // Medium traffic - balanced timing
    return { 
      green: baseGreen + 15 + queueFactor, 
      red: baseRed + 5, 
      yellow: 4,
      pedestrian: 20
    };
  } else {
    // High traffic - prioritize vehicle flow, coordinated timing
    return { 
      green: baseGreen + 30 + queueFactor, 
      red: baseRed - 5, 
      yellow: 5,
      pedestrian: 12 // Shorter walk phase during peak
    };
  }
}

function getCongestionColor(level) {
  if (level < 2) return 'rgba(50, 255, 126, 0.3)';
  if (level < 3.5) return 'rgba(255, 206, 86, 0.3)';
  return 'rgba(255, 99, 132, 0.3)';
}

function getCongestionTrend(level) {
  if (level < 2) return '📉 Low';
  if (level < 3.5) return '📊 Moderate';
  return '📈 High';
}

function startSignalAnimation() {
  if (updateInterval) clearInterval(updateInterval);
  
  // Add mode button listeners
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  let cycleCount = 0;
  let totalWaitTime = 0;
  
  updateInterval = setInterval(async () => {
    const junctions = await fetchDummyData('dummy_traffic.json');
    
    junctions.forEach(j => {
      const congestion = (Math.random() * 4 + 1).toFixed(1);
      const queueLength = Math.floor(parseFloat(congestion) * 8 + Math.random() * 5);
      const pedestrianCount = Math.floor(Math.random() * 15);
      
      // Emergency vehicle detection (15% probability for realistic simulation)
      const hasEmergency = Math.random() > 0.85;
      const emergencyTypes = [
        { type: '🚑 Ambulance', priority: 1, icon: '🚑' },
        { type: '🚒 Fire Brigade', priority: 1, icon: '🚒' },
        { type: '🚓 Police', priority: 2, icon: '🚓' },
        { type: '🚐 Emergency Services', priority: 3, icon: '🚐' }
      ];
      
      if (hasEmergency && !emergencyVehicles[j.junction_id]) {
        // New emergency vehicle detected
        const emergencyType = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
        const distance = Math.floor(Math.random() * 300 + 100); // 100-400m
        const eta = Math.floor(distance / 10); // Approximate ETA in seconds
        
        emergencyVehicles[j.junction_id] = {
          type: emergencyType.type,
          icon: emergencyType.icon,
          priority: emergencyType.priority,
          distance: distance,
          eta: eta,
          corridorTime: 30 + eta, // Green corridor duration
          startTime: Date.now()
        };
        
        // Show emergency banner
        showEmergencyBanner();
        
        // Trigger alert notification
        triggerEmergencyAlert(j.name, emergencyType.type);
      }
      
      // Update emergency vehicle status
      if (emergencyVehicles[j.junction_id]) {
        const emergency = emergencyVehicles[j.junction_id];
        const elapsed = Math.floor((Date.now() - emergency.startTime) / 1000);
        const remainingTime = Math.max(0, emergency.corridorTime - elapsed);
        
        if (remainingTime > 0) {
          // Update emergency detection display
          const detectionDiv = document.getElementById(`emergency-detection-${j.junction_id}`);
          const emergencyTypeEl = document.getElementById(`emergency-type-${j.junction_id}`);
          const emergencyDistanceEl = document.getElementById(`emergency-distance-${j.junction_id}`);
          const emergencyEtaEl = document.getElementById(`emergency-eta-${j.junction_id}`);
          const corridorCountdownEl = document.getElementById(`corridor-countdown-${j.junction_id}`);
          
          if (detectionDiv) detectionDiv.style.display = 'block';
          if (emergencyTypeEl) emergencyTypeEl.textContent = emergency.type;
          if (emergencyDistanceEl) {
            const currentDistance = Math.max(0, emergency.distance - (elapsed * 10));
            emergencyDistanceEl.textContent = currentDistance > 0 ? `${currentDistance}m away` : 'At junction';
          }
          if (emergencyEtaEl) {
            const currentEta = Math.max(0, emergency.eta - elapsed);
            emergencyEtaEl.textContent = currentEta > 0 ? `ETA: ${currentEta}s` : 'Passing through';
          }
          if (corridorCountdownEl) {
            corridorCountdownEl.textContent = `${remainingTime}s`;
          }
        } else {
          // Emergency cleared
          delete emergencyVehicles[j.junction_id];
          const detectionDiv = document.getElementById(`emergency-detection-${j.junction_id}`);
          if (detectionDiv) detectionDiv.style.display = 'none';
          
          // Hide banner if no more emergencies
          if (Object.keys(emergencyVehicles).length === 0) {
            hideEmergencyBanner();
          }
        }
      }
      
      const timing = calculateSignalTiming(parseFloat(congestion), queueLength);
      
      // Update queue length
      const queueEl = document.getElementById(`queue-${j.junction_id}`);
      if (queueEl) {
        queueEl.textContent = queueLength;
        queueEl.classList.add('highlight-pulse');
        setTimeout(() => queueEl.classList.remove('highlight-pulse'), 800);
      }
      
      // Update pedestrian count
      const pedEl = document.getElementById(`ped-${j.junction_id}`);
      if (pedEl) pedEl.textContent = pedestrianCount;
      
      // Show/hide emergency indicator
      const emergencyEl = document.getElementById(`emergency-${j.junction_id}`);
      if (emergencyEl) {
        const hasActiveEmergency = emergencyVehicles[j.junction_id] !== undefined;
        emergencyEl.style.display = hasActiveEmergency ? 'flex' : 'none';
        
        if (hasActiveEmergency) {
          // EMERGENCY PRIORITY: Force immediate green light
          const lights = document.querySelectorAll(`.light[data-junction="${j.junction_id}"]`);
          lights.forEach(light => light.classList.remove('active'));
          const greenLight = Array.from(lights).find(l => l.classList.contains('green'));
          if (greenLight) {
            greenLight.classList.add('active');
            greenLight.classList.add('emergency-green'); // Special styling
          }
          
          // Override timing display to show extended green
          if (greenTimeEl) {
            greenTimeEl.textContent = 'Extended';
            greenTimeEl.style.color = '#32ff7e';
          }
          if (redTimeEl) {
            redTimeEl.textContent = '0s';
            redTimeEl.style.color = '#666';
          }
        } else {
          // Remove emergency styling
          const lights = document.querySelectorAll(`.light[data-junction="${j.junction_id}"]`);
          lights.forEach(light => light.classList.remove('emergency-green'));
          
          // Restore normal timing colors
          if (greenTimeEl) greenTimeEl.style.color = '#00d4ff';
          if (redTimeEl) redTimeEl.style.color = '#00d4ff';
        }
      }
      
      const redTimeEl = document.getElementById(`red-time-${j.junction_id}`);
      const greenTimeEl = document.getElementById(`green-time-${j.junction_id}`);
      const congestionEl = document.getElementById(`signal-congestion-${j.junction_id}`);
      const card = document.getElementById(`signal-${j.junction_id}`);
      const progressBar = document.getElementById(`progress-${j.junction_id}`);
      const optEl = document.getElementById(`opt-${j.junction_id}`);
      
      if (redTimeEl) {
        redTimeEl.classList.add('value-update', 'highlight-pulse');
        redTimeEl.textContent = timing.red + 's';
        setTimeout(() => redTimeEl.classList.remove('value-update', 'highlight-pulse'), 800);
      }
      
      if (greenTimeEl) {
        greenTimeEl.classList.add('value-update', 'highlight-pulse');
        greenTimeEl.textContent = timing.green + 's';
        setTimeout(() => greenTimeEl.classList.remove('value-update', 'highlight-pulse'), 800);
      }
      
      if (congestionEl) {
        congestionEl.textContent = congestion;
        const trendSpan = congestionEl.parentElement.querySelector('.congestion-trend');
        if (trendSpan) {
          trendSpan.textContent = getCongestionTrend(parseFloat(congestion));
        }
      }
      
      if (card) {
        const indicator = card.querySelector('.congestion-indicator');
        if (indicator) {
          indicator.style.background = getCongestionColor(parseFloat(congestion));
        }
      }
      
      if (optEl) {
        const modes = ['Queue-based adaptive', 'Predictive optimization', 'Coordinated timing', 'Flow maximization'];
        optEl.textContent = modes[Math.floor(Math.random() * modes.length)];
      }
      
      if (progressBar) {
        progressBar.style.width = '0%';
        setTimeout(() => {
          progressBar.style.width = '100%';
          progressBar.style.transition = 'width 5s linear';
        }, 100);
      }
      
      // Only animate lights if no emergency vehicle
      if (!emergencyVehicles[j.junction_id]) {
        animateLights(j.junction_id);
      }
      
      totalWaitTime += queueLength * 2;
    });
    
    // Update emergency vehicle count
    const emergencyCountEl = document.getElementById('emergency-count');
    if (emergencyCountEl) {
      const count = Object.keys(emergencyVehicles).length;
      emergencyCountEl.textContent = count;
      if (count > 0) {
        emergencyCountEl.style.color = '#ff6e7f';
        emergencyCountEl.parentElement.classList.add('emergency-active');
      } else {
        emergencyCountEl.style.color = '#00d4ff';
        emergencyCountEl.parentElement.classList.remove('emergency-active');
      }
    }
    
    // Update global stats
    const avgWaitEl = document.getElementById('avg-wait-time');
    if (avgWaitEl) {
      const avgWait = Math.floor(totalWaitTime / junctions.length);
      avgWaitEl.textContent = avgWait + 's';
    }
    
    const efficiencyEl = document.getElementById('system-efficiency');
    if (efficiencyEl) {
      const efficiency = Math.max(70, Math.min(95, 100 - (totalWaitTime / junctions.length / 2)));
      efficiencyEl.textContent = Math.floor(efficiency) + '%';
    }
    
    totalWaitTime = 0;
    cycleCount++;
  }, 5000);
}

function animateLights(junctionId) {
  const lights = document.querySelectorAll(`.light[data-junction="${junctionId}"]`);
  if (lights.length === 0) return;
  
  lights.forEach(light => light.classList.remove('active'));
  
  const sequence = ['red', 'yellow', 'green'];
  let currentIndex = Math.floor(Math.random() * sequence.length);
  
  const currentLight = Array.from(lights).find(l => l.classList.contains(sequence[currentIndex]));
  if (currentLight) {
    currentLight.classList.add('active');
  }
}

function showEmergencyBanner() {
  const banner = document.getElementById('emergency-banner');
  if (banner) {
    banner.style.display = 'block';
    banner.classList.add('banner-slide-in');
  }
}

function hideEmergencyBanner() {
  const banner = document.getElementById('emergency-banner');
  if (banner) {
    banner.classList.add('banner-slide-out');
    setTimeout(() => {
      banner.style.display = 'none';
      banner.classList.remove('banner-slide-in', 'banner-slide-out');
    }, 500);
  }
}

function triggerEmergencyAlert(junctionName, vehicleType) {
  // Create temporary alert notification
  const alertsSection = document.getElementById('alerts-list');
  if (alertsSection) {
    const alertCard = document.createElement('div');
    alertCard.className = 'alert-card emergency-alert-card animated';
    alertCard.innerHTML = `
      <strong>🚨 EMERGENCY VEHICLE DETECTED</strong> 
      <br/>
      <b>${vehicleType}</b> approaching <b>${junctionName}</b>
      <br/>
      <em>Green corridor activated - Priority clearance in progress</em>
      <span class="alert-time">${new Date().toLocaleTimeString()}</span>
    `;
    alertsSection.insertBefore(alertCard, alertsSection.firstChild);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      alertCard.style.opacity = '0';
      setTimeout(() => alertCard.remove(), 500);
    }, 30000);
  }
}
