// Admin Dashboard Module - Role-based access for traffic police, city planners, and maintenance teams
export function initAdminDashboard() {
  const container = document.getElementById('admin-dashboard-panel');
  if (!container) return;

  // Admin state
  const state = {
    currentRole: 'traffic-police', // Default role
    users: [],
    systemLogs: [],
    permissions: {
      'traffic-police': ['view-incidents', 'manage-signals', 'view-analytics', 'respond-emergency'],
      'city-planner': ['view-analytics', 'view-reports', 'plan-routes', 'view-predictions'],
      'maintenance': ['view-incidents', 'manage-infrastructure', 'update-status', 'view-maintenance']
    }
  };

  container.innerHTML = `
    <div class="admin-dashboard-container">
      <!-- Role Selector -->
      <div class="admin-header">
        <div class="role-selector">
          <label for="admin-role">👤 Current Role:</label>
          <select id="admin-role" class="role-select">
            <option value="traffic-police">🚔 Traffic Police</option>
            <option value="city-planner">🏙️ City Planner</option>
            <option value="maintenance">🔧 Maintenance Team</option>
          </select>
        </div>
        <div class="admin-status">
          <span class="status-indicator online"></span>
          <span>System Online</span>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="admin-content">
        <!-- Traffic Police Dashboard -->
        <div id="traffic-police-dashboard" class="role-dashboard active">
          <h3>🚔 Traffic Police Control Center</h3>
          
          <div class="admin-grid">
            <!-- Active Incidents -->
            <div class="admin-card">
              <h4>🚨 Active Incidents</h4>
              <div id="police-incidents-list" class="incidents-list"></div>
              <button class="btn-action" onclick="document.getElementById('incident-response-modal').style.display='block'">
                Respond to Incident
              </button>
            </div>

            <!-- Signal Override Control -->
            <div class="admin-card">
              <h4>🚦 Signal Override Control</h4>
              <div class="signal-override-controls">
                <div class="control-group">
                  <label>Junction:</label>
                  <select id="override-junction" class="admin-select">
                    <option value="0">Junction 0</option>
                    <option value="1">Junction 1</option>
                    <option value="2">Junction 2</option>
                    <option value="3">Junction 3</option>
                    <option value="4">Junction 4</option>
                    <option value="5">Junction 5</option>
                  </select>
                </div>
                <div class="control-group">
                  <label>Override Signal:</label>
                  <div class="signal-buttons">
                    <button class="signal-btn green" data-signal="green">Green</button>
                    <button class="signal-btn yellow" data-signal="yellow">Yellow</button>
                    <button class="signal-btn red" data-signal="red">Red</button>
                  </div>
                </div>
                <div class="control-group">
                  <label>Duration (seconds):</label>
                  <input type="number" id="override-duration" value="60" min="10" max="300">
                </div>
                <button class="btn-primary" id="apply-override">Apply Override</button>
                <button class="btn-secondary" id="clear-override">Clear All Overrides</button>
              </div>
            </div>

            <!-- Emergency Dispatch -->
            <div class="admin-card">
              <h4>🚑 Emergency Vehicle Dispatch</h4>
              <div id="emergency-vehicles-list" class="vehicles-list"></div>
              <button class="btn-emergency" onclick="document.getElementById('dispatch-modal').style.display='block'">
                Dispatch Emergency Vehicle
              </button>
            </div>

            <!-- Violation Monitoring -->
            <div class="admin-card">
              <h4>⚠️ Traffic Violations</h4>
              <div id="violations-list" class="violations-list">
                <div class="violation-item">
                  <span class="violation-type">Red Light Running</span>
                  <span class="violation-location">Junction 2</span>
                  <span class="violation-time">2 mins ago</span>
                  <button class="btn-mini">Review</button>
                </div>
                <div class="violation-item">
                  <span class="violation-type">Speeding</span>
                  <span class="violation-location">Junction 5</span>
                  <span class="violation-time">8 mins ago</span>
                  <button class="btn-mini">Review</button>
                </div>
                <div class="violation-item">
                  <span class="violation-type">Illegal Parking</span>
                  <span class="violation-location">Junction 0</span>
                  <span class="violation-time">15 mins ago</span>
                  <button class="btn-mini">Review</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- City Planner Dashboard -->
        <div id="city-planner-dashboard" class="role-dashboard">
          <h3>🏙️ City Planning & Analytics Center</h3>
          
          <div class="admin-grid">
            <!-- Traffic Flow Analysis -->
            <div class="admin-card large">
              <h4>📊 Traffic Flow Analysis</h4>
              <div class="analysis-metrics">
                <div class="metric">
                  <span class="metric-label">Average Daily Traffic:</span>
                  <span class="metric-value">45,230 vehicles</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Peak Hour Volume:</span>
                  <span class="metric-value">8,540 vehicles/hour</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Average Wait Time:</span>
                  <span class="metric-value">42 seconds</span>
                </div>
                <div class="metric">
                  <span class="metric-label">System Efficiency:</span>
                  <span class="metric-value">87.5%</span>
                </div>
              </div>
              <canvas id="planner-flow-chart" width="400" height="200"></canvas>
            </div>

            <!-- Infrastructure Planning -->
            <div class="admin-card">
              <h4>🏗️ Infrastructure Planning</h4>
              <div class="planning-tools">
                <button class="tool-btn">📍 Add New Junction</button>
                <button class="tool-btn">🛣️ Plan New Route</button>
                <button class="tool-btn">🚧 Schedule Construction</button>
                <button class="tool-btn">📈 Generate Report</button>
              </div>
              <div class="planned-projects">
                <h5>Upcoming Projects:</h5>
                <div class="project-item">
                  <span>Junction 7 Installation</span>
                  <span class="project-date">Q1 2026</span>
                </div>
                <div class="project-item">
                  <span>Road Widening - Zone A</span>
                  <span class="project-date">Q2 2026</span>
                </div>
              </div>
            </div>

            <!-- Citizen Reports Review -->
            <div class="admin-card">
              <h4>📋 Citizen Reports Review</h4>
              <div id="planner-reports-list" class="reports-review-list"></div>
              <button class="btn-action">Export Report Data</button>
            </div>

            <!-- Budget & Resources -->
            <div class="admin-card">
              <h4>💰 Budget & Resources</h4>
              <div class="budget-overview">
                <div class="budget-item">
                  <span>Annual Budget:</span>
                  <span class="budget-amount">$5.2M</span>
                </div>
                <div class="budget-item">
                  <span>Spent (YTD):</span>
                  <span class="budget-amount">$3.1M</span>
                </div>
                <div class="budget-item">
                  <span>Remaining:</span>
                  <span class="budget-amount">$2.1M</span>
                </div>
                <div class="budget-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 60%;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Maintenance Team Dashboard -->
        <div id="maintenance-dashboard" class="role-dashboard">
          <h3>🔧 Maintenance Operations Center</h3>
          
          <div class="admin-grid">
            <!-- Work Orders -->
            <div class="admin-card">
              <h4>📝 Active Work Orders</h4>
              <div id="work-orders-list" class="work-orders-list">
                <div class="work-order-item pending">
                  <div class="order-header">
                    <span class="order-id">#WO-1234</span>
                    <span class="order-priority high">High Priority</span>
                  </div>
                  <p class="order-description">Signal malfunction at Junction 3</p>
                  <p class="order-assigned">Assigned to: Team A</p>
                  <button class="btn-mini">Update Status</button>
                </div>
                <div class="work-order-item in-progress">
                  <div class="order-header">
                    <span class="order-id">#WO-1235</span>
                    <span class="order-priority medium">Medium Priority</span>
                  </div>
                  <p class="order-description">Pothole repair at Junction 0</p>
                  <p class="order-assigned">Assigned to: Team B</p>
                  <button class="btn-mini">Update Status</button>
                </div>
              </div>
              <button class="btn-action" onclick="document.getElementById('create-work-order-modal').style.display='block'">
                Create New Work Order
              </button>
            </div>

            <!-- Equipment Status -->
            <div class="admin-card">
              <h4>🛠️ Equipment Status</h4>
              <div class="equipment-list">
                <div class="equipment-item operational">
                  <span class="equipment-name">Traffic Lights - Set A</span>
                  <span class="equipment-status">✅ Operational</span>
                </div>
                <div class="equipment-item maintenance">
                  <span class="equipment-name">Traffic Lights - Set B</span>
                  <span class="equipment-status">🔧 Maintenance</span>
                </div>
                <div class="equipment-item operational">
                  <span class="equipment-name">CCTV Cameras</span>
                  <span class="equipment-status">✅ Operational</span>
                </div>
                <div class="equipment-item warning">
                  <span class="equipment-name">Sensors - Junction 5</span>
                  <span class="equipment-status">⚠️ Needs Check</span>
                </div>
              </div>
            </div>

            <!-- Maintenance Schedule -->
            <div class="admin-card">
              <h4>📅 Maintenance Schedule</h4>
              <div class="schedule-calendar">
                <div class="schedule-item">
                  <span class="schedule-date">Nov 18</span>
                  <span class="schedule-task">Routine inspection - All junctions</span>
                </div>
                <div class="schedule-item">
                  <span class="schedule-date">Nov 20</span>
                  <span class="schedule-task">Signal timing calibration - Junction 2,3</span>
                </div>
                <div class="schedule-item">
                  <span class="schedule-date">Nov 25</span>
                  <span class="schedule-task">Camera maintenance - Zone B</span>
                </div>
              </div>
            </div>

            <!-- Inventory -->
            <div class="admin-card">
              <h4>📦 Parts Inventory</h4>
              <div class="inventory-list">
                <div class="inventory-item">
                  <span>LED Bulbs:</span>
                  <span class="inventory-qty sufficient">250 units</span>
                </div>
                <div class="inventory-item">
                  <span>Signal Controllers:</span>
                  <span class="inventory-qty low">8 units</span>
                </div>
                <div class="inventory-item">
                  <span>Camera Units:</span>
                  <span class="inventory-qty sufficient">15 units</span>
                </div>
                <div class="inventory-item">
                  <span>Sensors:</span>
                  <span class="inventory-qty critical">3 units</span>
                </div>
              </div>
              <button class="btn-action">Request Parts</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Role switching logic
  const roleSelect = document.getElementById('admin-role');
  const dashboards = container.querySelectorAll('.role-dashboard');

  roleSelect.addEventListener('change', (e) => {
    state.currentRole = e.target.value;
    
    dashboards.forEach(dash => dash.classList.remove('active'));
    document.getElementById(`${state.currentRole}-dashboard`).classList.add('active');
    
    console.log(`Switched to ${state.currentRole} dashboard`);
  });

  // Signal Override functionality
  const applyOverrideBtn = document.getElementById('apply-override');
  const clearOverrideBtn = document.getElementById('clear-override');

  applyOverrideBtn?.addEventListener('click', () => {
    const junction = document.getElementById('override-junction').value;
    const duration = document.getElementById('override-duration').value;
    const activeBtn = container.querySelector('.signal-btn.active');
    
    if (!activeBtn) {
      alert('Please select a signal color');
      return;
    }
    
    const signal = activeBtn.dataset.signal;
    
    alert(`✅ Signal override applied:\nJunction ${junction}\nSignal: ${signal.toUpperCase()}\nDuration: ${duration}s`);
    console.log(`Override: Junction ${junction} → ${signal} for ${duration}s`);
  });

  clearOverrideBtn?.addEventListener('click', () => {
    if (confirm('Clear all signal overrides?')) {
      alert('✅ All signal overrides cleared');
      console.log('All overrides cleared');
    }
  });

  // Signal button selection
  const signalBtns = container.querySelectorAll('.signal-btn');
  signalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      signalBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Load emergency vehicles for police dashboard
  function loadEmergencyVehicles() {
    const list = document.getElementById('emergency-vehicles-list');
    if (!list) return;
    
    list.innerHTML = `
      <div class="vehicle-card">
        <span class="vehicle-id">AMB-001</span>
        <span class="vehicle-status available">Available</span>
        <button class="btn-mini">Dispatch</button>
      </div>
      <div class="vehicle-card">
        <span class="vehicle-id">FIRE-045</span>
        <span class="vehicle-status on-route">On Route</span>
        <button class="btn-mini">Track</button>
      </div>
      <div class="vehicle-card">
        <span class="vehicle-id">POL-123</span>
        <span class="vehicle-status available">Available</span>
        <button class="btn-mini">Dispatch</button>
      </div>
    `;
  }

  // Load active incidents for police dashboard
  function loadPoliceIncidents() {
    const list = document.getElementById('police-incidents-list');
    if (!list) return;
    
    list.innerHTML = `
      <div class="incident-card critical">
        <h5>Major Accident - Junction 2</h5>
        <p>Multiple vehicles involved. Lane blockage.</p>
        <span class="incident-time">2 mins ago</span>
        <button class="btn-respond">Respond</button>
      </div>
      <div class="incident-card high">
        <h5>Traffic Jam - Junction 5</h5>
        <p>Heavy congestion. Est. 15 min delay.</p>
        <span class="incident-time">10 mins ago</span>
        <button class="btn-respond">Respond</button>
      </div>
    `;
  }

  // Load citizen reports for city planner
  function loadPlannerReports() {
    const list = document.getElementById('planner-reports-list');
    if (!list) return;
    
    list.innerHTML = `
      <div class="report-review-item">
        <span class="report-type">Pothole</span>
        <span class="report-location">Junction 0</span>
        <button class="btn-mini">Review</button>
      </div>
      <div class="report-review-item">
        <span class="report-type">Signal Issue</span>
        <span class="report-location">Junction 3</span>
        <button class="btn-mini">Review</button>
      </div>
      <div class="report-review-item">
        <span class="report-type">Illegal Parking</span>
        <span class="report-location">Junction 1</span>
        <button class="btn-mini">Review</button>
      </div>
    `;
  }

  // Initialize data
  loadEmergencyVehicles();
  loadPoliceIncidents();
  loadPlannerReports();

  console.log('✅ Admin Dashboard initialized');
}
