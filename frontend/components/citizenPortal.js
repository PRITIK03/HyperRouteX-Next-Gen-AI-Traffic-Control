// Citizen Portal Module
export function initCitizenPortal() {
  const container = document.getElementById('citizen-portal-panel');
  if (!container) return;

  // Citizen Portal State
  const state = {
    issues: [],
    alerts: [],
    emergencyRequests: []
  };

  // Initialize portal tabs and sections
  container.innerHTML = `
    <div class="citizen-portal-container">
      <div class="portal-tabs">
        <button class="portal-tab active" data-tab="report">Report Issue</button>
        <button class="portal-tab" data-tab="alerts">Traffic Alerts</button>
        <button class="portal-tab" data-tab="emergency">Emergency Priority</button>
        <button class="portal-tab" data-tab="history">My Reports</button>
      </div>
      
      <div class="portal-content">
        <!-- Report Issue Section -->
        <div id="report-tab" class="portal-tab-content active">
          <h3>🚨 Report a Traffic Issue</h3>
          <form id="issue-report-form" class="citizen-form">
            <div class="form-group">
              <label for="issue-type">Issue Type</label>
              <select id="issue-type" required>
                <option value="">Select issue type</option>
                <option value="accident">Accident</option>
                <option value="roadblock">Road Blockage</option>
                <option value="signal-malfunction">Signal Malfunction</option>
                <option value="pothole">Pothole</option>
                <option value="illegal-parking">Illegal Parking</option>
                <option value="traffic-jam">Traffic Jam</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="issue-location">Location</label>
              <input type="text" id="issue-location" placeholder="Enter junction or street name" required>
            </div>
            
            <div class="form-group">
              <label for="issue-severity">Severity</label>
              <select id="issue-severity" required>
                <option value="low">Low - Minor inconvenience</option>
                <option value="medium">Medium - Moderate impact</option>
                <option value="high">High - Serious issue</option>
                <option value="critical">Critical - Emergency</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="issue-description">Description</label>
              <textarea id="issue-description" rows="4" placeholder="Describe the issue in detail..." required></textarea>
            </div>
            
            <div class="form-group">
              <label for="reporter-contact">Your Contact (Optional)</label>
              <input type="tel" id="reporter-contact" placeholder="Phone or email for updates">
            </div>
            
            <button type="submit" class="btn-primary">Submit Report</button>
          </form>
          <div id="report-confirmation" class="confirmation-message" style="display: none;"></div>
        </div>

        <!-- Traffic Alerts Section -->
        <div id="alerts-tab" class="portal-tab-content">
          <h3>🚦 Live Traffic Alerts</h3>
          <div class="alert-filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="accident">Accidents</button>
            <button class="filter-btn" data-filter="roadblock">Roadblocks</button>
            <button class="filter-btn" data-filter="construction">Construction</button>
          </div>
          <div id="traffic-alerts-list" class="alerts-list"></div>
        </div>

        <!-- Emergency Priority Section -->
        <div id="emergency-tab" class="portal-tab-content">
          <h3>🚑 Request Emergency Vehicle Priority</h3>
          <div class="emergency-notice">
            <strong>⚠️ Notice:</strong> This feature is for authorized emergency vehicles only. 
            Misuse may result in legal consequences.
          </div>
          
          <form id="emergency-request-form" class="citizen-form">
            <div class="form-group">
              <label for="vehicle-type">Vehicle Type</label>
              <select id="vehicle-type" required>
                <option value="">Select vehicle type</option>
                <option value="ambulance">Ambulance</option>
                <option value="fire-truck">Fire Truck</option>
                <option value="police">Police Vehicle</option>
                <option value="rescue">Emergency Rescue</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="vehicle-id">Vehicle ID / Registration</label>
              <input type="text" id="vehicle-id" placeholder="e.g., AMB-1234" required>
            </div>
            
            <div class="form-group">
              <label for="current-location">Current Location</label>
              <input type="text" id="current-location" placeholder="Current junction or street" required>
            </div>
            
            <div class="form-group">
              <label for="destination">Destination</label>
              <input type="text" id="destination" placeholder="Destination junction or street" required>
            </div>
            
            <div class="form-group">
              <label for="emergency-code">Emergency Authorization Code</label>
              <input type="password" id="emergency-code" placeholder="Enter authorization code" required>
            </div>
            
            <button type="submit" class="btn-emergency">Request Green Corridor</button>
          </form>
          <div id="emergency-confirmation" class="confirmation-message" style="display: none;"></div>
          <div id="active-emergency-status" class="emergency-status"></div>
        </div>

        <!-- My Reports Section -->
        <div id="history-tab" class="portal-tab-content">
          <h3>📋 My Report History</h3>
          <div id="user-reports-list" class="reports-list"></div>
        </div>
      </div>
    </div>
  `;

  // Tab switching
  const tabs = container.querySelectorAll('.portal-tab');
  const tabContents = container.querySelectorAll('.portal-tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });

  // Handle Issue Report Form
  const issueForm = document.getElementById('issue-report-form');
  issueForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const issue = {
      id: Date.now(),
      type: document.getElementById('issue-type').value,
      location: document.getElementById('issue-location').value,
      severity: document.getElementById('issue-severity').value,
      description: document.getElementById('issue-description').value,
      contact: document.getElementById('reporter-contact').value,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    state.issues.push(issue);
    
    // Show confirmation
    const confirmation = document.getElementById('report-confirmation');
    confirmation.style.display = 'block';
    confirmation.innerHTML = `
      <div class="success-message">
        ✅ <strong>Report Submitted Successfully!</strong><br>
        Report ID: #${issue.id}<br>
        Status: Under Review<br>
        Expected Response: Within 30 minutes
      </div>
    `;
    
    issueForm.reset();
    updateReportsHistory();
    
    setTimeout(() => {
      confirmation.style.display = 'none';
    }, 5000);
  });

  // Handle Emergency Request Form
  const emergencyForm = document.getElementById('emergency-request-form');
  emergencyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emergencyCode = document.getElementById('emergency-code').value;
    
    // Validate emergency code (in real system, this would be server-side)
    if (emergencyCode !== 'EMERGENCY-2025') {
      const confirmation = document.getElementById('emergency-confirmation');
      confirmation.style.display = 'block';
      confirmation.innerHTML = `
        <div class="error-message">
          ❌ <strong>Invalid Authorization Code</strong><br>
          Please contact your emergency services coordinator.
        </div>
      `;
      setTimeout(() => confirmation.style.display = 'none', 5000);
      return;
    }
    
    const request = {
      id: Date.now(),
      vehicleType: document.getElementById('vehicle-type').value,
      vehicleId: document.getElementById('vehicle-id').value,
      currentLocation: document.getElementById('current-location').value,
      destination: document.getElementById('destination').value,
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    
    state.emergencyRequests.push(request);
    
    const confirmation = document.getElementById('emergency-confirmation');
    confirmation.style.display = 'block';
    confirmation.innerHTML = `
      <div class="success-message">
        🚨 <strong>Emergency Priority Activated!</strong><br>
        Request ID: #${request.id}<br>
        Green corridor is being established on your route.<br>
        ETA Update: Real-time navigation active
      </div>
    `;
    
    emergencyForm.reset();
    updateEmergencyStatus(request);
  });

  // Load traffic alerts
  function loadTrafficAlerts() {
    const alertsList = document.getElementById('traffic-alerts-list');
    
    // Sample alerts (in real system, fetch from backend)
    const sampleAlerts = [
      { type: 'accident', location: 'Junction 0', severity: 'high', time: '5 mins ago', message: 'Vehicle collision reported. Lane 2 blocked.' },
      { type: 'roadblock', location: 'Junction 3', severity: 'medium', time: '15 mins ago', message: 'Construction work in progress. Use alternate route.' },
      { type: 'construction', location: 'Junction 5', severity: 'low', time: '1 hour ago', message: 'Scheduled maintenance until 6:00 PM.' },
      { type: 'accident', location: 'Junction 2', severity: 'critical', time: '2 mins ago', message: 'Major accident. Emergency services on site.' }
    ];
    
    alertsList.innerHTML = sampleAlerts.map(alert => `
      <div class="traffic-alert-card ${alert.severity}">
        <div class="alert-header">
          <span class="alert-icon">${getAlertIcon(alert.type)}</span>
          <span class="alert-location">${alert.location}</span>
          <span class="alert-time">${alert.time}</span>
        </div>
        <div class="alert-message">${alert.message}</div>
        <div class="alert-severity">Severity: <span class="severity-badge ${alert.severity}">${alert.severity.toUpperCase()}</span></div>
      </div>
    `).join('');
  }

  // Alert filter functionality
  const filterBtns = container.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      const alertCards = container.querySelectorAll('.traffic-alert-card');
      
      alertCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
        } else {
          const icon = card.querySelector('.alert-icon').textContent;
          const showCard = (filter === 'accident' && icon === '🚗') ||
                          (filter === 'roadblock' && icon === '🚧') ||
                          (filter === 'construction' && icon === '⚠️');
          card.style.display = showCard ? 'block' : 'none';
        }
      });
    });
  });

  function getAlertIcon(type) {
    const icons = {
      accident: '🚗',
      roadblock: '🚧',
      construction: '⚠️'
    };
    return icons[type] || '⚠️';
  }

  function updateReportsHistory() {
    const reportsList = document.getElementById('user-reports-list');
    
    if (state.issues.length === 0) {
      reportsList.innerHTML = '<p class="no-data">No reports submitted yet.</p>';
      return;
    }
    
    reportsList.innerHTML = state.issues.map(issue => `
      <div class="report-card">
        <div class="report-header">
          <span class="report-id">#${issue.id}</span>
          <span class="report-status ${issue.status}">${issue.status.toUpperCase()}</span>
        </div>
        <div class="report-details">
          <p><strong>Type:</strong> ${issue.type}</p>
          <p><strong>Location:</strong> ${issue.location}</p>
          <p><strong>Severity:</strong> ${issue.severity}</p>
          <p><strong>Submitted:</strong> ${new Date(issue.timestamp).toLocaleString()}</p>
        </div>
      </div>
    `).join('');
  }

  function updateEmergencyStatus(request) {
    const statusDiv = document.getElementById('active-emergency-status');
    statusDiv.innerHTML = `
      <div class="active-emergency-card">
        <h4>🚨 Active Emergency Route</h4>
        <p><strong>Vehicle:</strong> ${request.vehicleType} (${request.vehicleId})</p>
        <p><strong>Route:</strong> ${request.currentLocation} → ${request.destination}</p>
        <p><strong>Status:</strong> <span class="status-active">GREEN CORRIDOR ACTIVE</span></p>
        <div class="route-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 25%; animation: progressMove 8s linear infinite;"></div>
          </div>
          <p class="eta">ETA: 5 minutes</p>
        </div>
        <button class="btn-secondary" onclick="this.parentElement.style.display='none'">Clear Status</button>
      </div>
    `;
  }

  // Initialize alerts
  loadTrafficAlerts();
  updateReportsHistory();
  
  // Auto-refresh alerts every 30 seconds
  setInterval(loadTrafficAlerts, 30000);
  
  console.log('✅ Citizen Portal initialized');
}
