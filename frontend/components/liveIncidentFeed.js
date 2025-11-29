// Live Incident Feed Module - Real-time updates on accidents, roadblocks, and construction zones
export function initLiveIncidentFeed() {
  const container = document.getElementById('incident-feed-panel');
  if (!container) return;

  // Incident feed state
  const state = {
    incidents: [],
    filters: {
      type: 'all',
      severity: 'all',
      status: 'all'
    },
    autoRefresh: true
  };

  container.innerHTML = `
    <div class="incident-feed-container">
      <!-- Feed Header with Controls -->
      <div class="feed-header">
        <div class="feed-title">
          <h3>🚨 Live Incident Feed</h3>
          <span class="live-indicator">
            <span class="pulse-dot"></span>
            LIVE
          </span>
        </div>
        
        <div class="feed-controls">
          <button id="refresh-feed" class="icon-btn" title="Refresh Feed">🔄</button>
          <button id="toggle-auto-refresh" class="icon-btn active" title="Auto-refresh: ON">⏱️</button>
          <button id="add-incident" class="btn-primary">➕ Report Incident</button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="feed-filters">
        <div class="filter-group">
          <label>Type:</label>
          <select id="filter-type" class="filter-select">
            <option value="all">All Types</option>
            <option value="accident">Accident</option>
            <option value="roadblock">Road Blockage</option>
            <option value="construction">Construction</option>
            <option value="breakdown">Vehicle Breakdown</option>
            <option value="weather">Weather Hazard</option>
            <option value="event">Special Event</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Severity:</label>
          <select id="filter-severity" class="filter-select">
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Status:</label>
          <select id="filter-status" class="filter-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="responding">Responding</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <button id="clear-filters" class="btn-secondary">Clear Filters</button>
      </div>

      <!-- Statistics Bar -->
      <div class="incident-stats">
        <div class="stat-item">
          <span class="stat-label">Active Incidents:</span>
          <span id="stat-active" class="stat-value">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Critical:</span>
          <span id="stat-critical" class="stat-value critical">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Responding:</span>
          <span id="stat-responding" class="stat-value">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Resolved Today:</span>
          <span id="stat-resolved" class="stat-value">0</span>
        </div>
      </div>

      <!-- Incidents List -->
      <div id="incidents-list" class="incidents-feed-list"></div>

      <!-- Load More Button -->
      <div class="feed-footer">
        <button id="load-more" class="btn-secondary">Load More Incidents</button>
      </div>
    </div>

    <!-- Add Incident Modal -->
    <div id="add-incident-modal" class="modal" style="display: none;">
      <div class="modal-content">
        <span class="modal-close">&times;</span>
        <h3>Report New Incident</h3>
        <form id="add-incident-form" class="incident-form">
          <div class="form-group">
            <label>Incident Type:</label>
            <select id="new-incident-type" required>
              <option value="">Select type</option>
              <option value="accident">Accident</option>
              <option value="roadblock">Road Blockage</option>
              <option value="construction">Construction</option>
              <option value="breakdown">Vehicle Breakdown</option>
              <option value="weather">Weather Hazard</option>
              <option value="event">Special Event</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Location:</label>
            <input type="text" id="new-incident-location" placeholder="Junction or street name" required>
          </div>
          
          <div class="form-group">
            <label>Severity:</label>
            <select id="new-incident-severity" required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Description:</label>
            <textarea id="new-incident-description" rows="4" placeholder="Describe the incident..." required></textarea>
          </div>
          
          <div class="form-group">
            <label>Estimated Duration:</label>
            <input type="text" id="new-incident-duration" placeholder="e.g., 30 minutes, 2 hours">
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary">Submit Incident</button>
            <button type="button" class="btn-secondary modal-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Generate sample incidents
  function generateSampleIncidents() {
    const types = ['accident', 'roadblock', 'construction', 'breakdown', 'weather', 'event'];
    const severities = ['critical', 'high', 'medium', 'low'];
    const statuses = ['active', 'responding', 'resolved'];
    const locations = ['Junction 0', 'Junction 1', 'Junction 2', 'Junction 3', 'Junction 4', 'Junction 5', 'Main St', 'Park Ave', 'Highway 101'];
    
    const descriptions = {
      accident: ['Multiple vehicle collision', 'Head-on collision', 'Vehicle rollover', 'Minor fender bender'],
      roadblock: ['Fallen tree blocking road', 'Debris on highway', 'Police barricade', 'Protest blocking traffic'],
      construction: ['Road resurfacing in progress', 'Bridge maintenance work', 'Utility line installation', 'Lane closure for repairs'],
      breakdown: ['Stalled vehicle in lane', 'Truck breakdown blocking traffic', 'Vehicle with mechanical issues'],
      weather: ['Flooding on roadway', 'Ice on bridge', 'Heavy fog reducing visibility', 'Fallen power lines'],
      event: ['Marathon event in progress', 'Parade route active', 'Street fair blocking traffic', 'Concert causing congestion']
    };

    const sampleIncidents = [
      {
        id: 'INC-' + Date.now(),
        type: 'accident',
        location: 'Junction 2',
        severity: 'critical',
        status: 'responding',
        description: 'Major multi-vehicle collision. Multiple injuries reported. Emergency services on scene.',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        duration: '2+ hours',
        responders: ['AMB-001', 'FIRE-045', 'POL-123'],
        lanesAffected: 3
      },
      {
        id: 'INC-' + (Date.now() - 1000),
        type: 'roadblock',
        location: 'Junction 5',
        severity: 'high',
        status: 'active',
        description: 'Large truck overturned. Road completely blocked. Hazmat team requested.',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        duration: '3-4 hours',
        responders: ['FIRE-045', 'POL-124'],
        lanesAffected: 4
      },
      {
        id: 'INC-' + (Date.now() - 2000),
        type: 'construction',
        location: 'Junction 0',
        severity: 'medium',
        status: 'active',
        description: 'Scheduled road resurfacing. Single lane open. Expect delays.',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        duration: 'Until 6:00 PM',
        responders: [],
        lanesAffected: 2
      },
      {
        id: 'INC-' + (Date.now() - 3000),
        type: 'breakdown',
        location: 'Junction 3',
        severity: 'low',
        status: 'responding',
        description: 'Vehicle breakdown in right lane. Tow truck en route.',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        duration: '20-30 minutes',
        responders: ['TOW-012'],
        lanesAffected: 1
      },
      {
        id: 'INC-' + (Date.now() - 4000),
        type: 'weather',
        location: 'Highway 101',
        severity: 'high',
        status: 'active',
        description: 'Heavy fog reducing visibility to less than 50 meters. Drive with caution.',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        duration: '1-2 hours',
        responders: [],
        lanesAffected: 0
      },
      {
        id: 'INC-' + (Date.now() - 5000),
        type: 'event',
        location: 'Main St',
        severity: 'medium',
        status: 'active',
        description: 'City marathon in progress. Road closures until 2:00 PM.',
        timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
        duration: 'Until 2:00 PM',
        responders: ['POL-125', 'POL-126'],
        lanesAffected: 4
      },
      {
        id: 'INC-' + (Date.now() - 6000),
        type: 'accident',
        location: 'Junction 1',
        severity: 'low',
        status: 'resolved',
        description: 'Minor collision. No injuries. Vehicles moved to shoulder.',
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        duration: 'Resolved',
        responders: ['POL-127'],
        lanesAffected: 0
      }
    ];

    return sampleIncidents;
  }

  // Initialize incidents
  state.incidents = generateSampleIncidents();

  // Render incidents
  function renderIncidents() {
    const list = document.getElementById('incidents-list');
    
    // Apply filters
    let filteredIncidents = state.incidents.filter(incident => {
      const typeMatch = state.filters.type === 'all' || incident.type === state.filters.type;
      const severityMatch = state.filters.severity === 'all' || incident.severity === state.filters.severity;
      const statusMatch = state.filters.status === 'all' || incident.status === state.filters.status;
      return typeMatch && severityMatch && statusMatch;
    });

    if (filteredIncidents.length === 0) {
      list.innerHTML = '<div class="no-incidents">No incidents match your filters.</div>';
      return;
    }

    list.innerHTML = filteredIncidents.map(incident => {
      const timeAgo = getTimeAgo(incident.timestamp);
      const icon = getIncidentIcon(incident.type);
      
      return `
        <div class="incident-feed-card ${incident.severity} ${incident.status}">
          <div class="incident-header">
            <span class="incident-icon">${icon}</span>
            <div class="incident-title">
              <h4>${incident.type.charAt(0).toUpperCase() + incident.type.slice(1)} - ${incident.location}</h4>
              <span class="incident-time">${timeAgo}</span>
            </div>
            <span class="incident-severity-badge ${incident.severity}">${incident.severity.toUpperCase()}</span>
          </div>
          
          <div class="incident-body">
            <p class="incident-description">${incident.description}</p>
            
            <div class="incident-details">
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="status-badge ${incident.status}">${incident.status.toUpperCase()}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${incident.duration}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Lanes Affected:</span>
                <span class="detail-value">${incident.lanesAffected}</span>
              </div>
              ${incident.responders.length > 0 ? `
                <div class="detail-item">
                  <span class="detail-label">Responders:</span>
                  <span class="detail-value">${incident.responders.join(', ')}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="incident-actions">
            <button class="action-btn" onclick="alert('View details for ${incident.id}')">View Details</button>
            <button class="action-btn" onclick="alert('Navigate to ${incident.location}')">Navigate</button>
            ${incident.status !== 'resolved' ? 
              `<button class="action-btn" onclick="alert('Update status for ${incident.id}')">Update Status</button>` : 
              ''}
          </div>
        </div>
      `;
    }).join('');

    updateStatistics();
  }

  // Update statistics
  function updateStatistics() {
    const active = state.incidents.filter(i => i.status === 'active').length;
    const critical = state.incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
    const responding = state.incidents.filter(i => i.status === 'responding').length;
    const resolved = state.incidents.filter(i => i.status === 'resolved').length;

    document.getElementById('stat-active').textContent = active;
    document.getElementById('stat-critical').textContent = critical;
    document.getElementById('stat-responding').textContent = responding;
    document.getElementById('stat-resolved').textContent = resolved;
  }

  // Helper functions
  function getTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  function getIncidentIcon(type) {
    const icons = {
      accident: '🚗💥',
      roadblock: '🚧',
      construction: '🏗️',
      breakdown: '🔧',
      weather: '🌧️',
      event: '🎉'
    };
    return icons[type] || '⚠️';
  }

  // Event listeners
  document.getElementById('filter-type').addEventListener('change', (e) => {
    state.filters.type = e.target.value;
    renderIncidents();
  });

  document.getElementById('filter-severity').addEventListener('change', (e) => {
    state.filters.severity = e.target.value;
    renderIncidents();
  });

  document.getElementById('filter-status').addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    renderIncidents();
  });

  document.getElementById('clear-filters').addEventListener('click', () => {
    state.filters = { type: 'all', severity: 'all', status: 'all' };
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-severity').value = 'all';
    document.getElementById('filter-status').value = 'all';
    renderIncidents();
  });

  document.getElementById('refresh-feed').addEventListener('click', () => {
    renderIncidents();
    showNotification('Feed refreshed');
  });

  const autoRefreshBtn = document.getElementById('toggle-auto-refresh');
  autoRefreshBtn.addEventListener('click', () => {
    state.autoRefresh = !state.autoRefresh;
    autoRefreshBtn.classList.toggle('active');
    autoRefreshBtn.title = state.autoRefresh ? 'Auto-refresh: ON' : 'Auto-refresh: OFF';
    showNotification(state.autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled');
  });

  // Modal handling
  const modal = document.getElementById('add-incident-modal');
  const addBtn = document.getElementById('add-incident');
  const closeBtn = modal.querySelector('.modal-close');
  const cancelBtn = modal.querySelector('.modal-cancel');

  addBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Add incident form submission
  document.getElementById('add-incident-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newIncident = {
      id: 'INC-' + Date.now(),
      type: document.getElementById('new-incident-type').value,
      location: document.getElementById('new-incident-location').value,
      severity: document.getElementById('new-incident-severity').value,
      status: 'active',
      description: document.getElementById('new-incident-description').value,
      timestamp: new Date().toISOString(),
      duration: document.getElementById('new-incident-duration').value || 'Unknown',
      responders: [],
      lanesAffected: 0
    };
    
    state.incidents.unshift(newIncident);
    renderIncidents();
    modal.style.display = 'none';
    e.target.reset();
    showNotification('✅ Incident reported successfully');
  });

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'feed-notification';
    notification.textContent = message;
    container.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Auto-refresh every 30 seconds
  setInterval(() => {
    if (state.autoRefresh) {
      renderIncidents();
    }
  }, 30000);

  // Initial render
  renderIncidents();
  
  console.log('✅ Live Incident Feed initialized');
}
