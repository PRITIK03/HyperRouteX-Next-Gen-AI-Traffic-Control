// Smart Traffic Management System - JavaScript Dashboard
// Global variables and data structures
let currentTab = 'traffic-monitor';
let monitoringActive = true;
let refreshInterval = 3000;
let notifications = [];
let incidents = [];
let trafficData = {};
let signalStates = {};
let animationSpeed = 100;

// Junction data with locations and coordinates
const junctionData = [
    { id: 1, name: "Big Ben, London", coords: "51.50,-0.12", imageIndex: 0 },
    { id: 2, name: "Times Square, NYC", coords: "40.75,-73.98", imageIndex: 1 },
    { id: 3, name: "Central Park, NYC", coords: "40.78,-73.96", imageIndex: 2 },
    { id: 4, name: "Union Station, DC", coords: "38.89,-77.00", imageIndex: 3 },
    { id: 5, name: "City Hall, Chicago", coords: "41.87,-87.62", imageIndex: 4 },
    { id: 6, name: "Airport Terminal, LA", coords: "33.94,-118.40", imageIndex: 5 },
    { id: 7, name: "Harbor View, Miami", coords: "25.76,-80.19", imageIndex: 6 },
    { id: 8, name: "Grand Mall, Dallas", coords: "32.77,-96.79", imageIndex: 7 },
    { id: 9, name: "Stadium Plaza, Denver", coords: "39.73,-104.98", imageIndex: 8 }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Helper to determine API base URL. Defaults to http://localhost:8000 but
// can be overridden by setting window.API_BASE or adding ?api=http://host:port
function getApiBase() {
    if (window.API_BASE) return window.API_BASE.replace(/\/$/, '');
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const api = urlParams.get('api');
        if (api) return api.replace(/\/$/, '');
    } catch (e) {
        // ignore
    }
    return 'http://localhost:8000';
}

function initializeApp() {
    // Enhanced loading with progress
    showLoadingProgress();

    // Initialize components
    initializeTabs();
    initializeTrafficMonitor();
    initializeSignalControl();
    initializeAnalytics();
    initializeEmergency();
    initializeSettings();
    initializeNotifications();
    initializeSearch();
    initializeFAB();

    // Start real-time updates
    startRealTimeUpdates();

    // Initialize time display
    updateTime();
    setInterval(updateTime, 1000);

    // Add event listeners
    setupEventListeners();
}

// Tab switching functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            currentTab = tabId;
        });
    });
}

// Traffic Monitor functionality
// Traffic monitor grid is now static in index.html. Only update traffic data if needed.
function initializeTrafficMonitor() {
    // No need to generate grid, just update data if needed.
    generateTrafficData();
}

function createJunctionCard(junction) {
    const card = document.createElement('div');
    card.className = 'junction-card';
    card.id = `junction-${junction.id}`;

    card.innerHTML = `
        <div class="junction-header">
            <div class="junction-title">
                <span class="status-indicator">🟢</span>
                <span>Junction ${junction.id}</span>
            </div>
            <div class="update-indicator">●</div>
        </div>
        <div class="junction-image loading">
            <div class="image-placeholder">Loading camera feed...</div>
        </div>
        <div class="junction-info">
            <div class="congestion-meter">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="congestion-value">
                    <span>0.0 mins</span>
                    <span class="status-text">Clear</span>
                </div>
            </div>
            <div class="location-info">
                <div class="location-name">📍 ${junction.name}</div>
                <div class="coordinates">📌 ${junction.coords}</div>
            </div>
        </div>
    `;

    return card;
}

function generateTrafficData() {
    // Generate realistic traffic data
    junctionData.forEach(junction => {
        const baseCongestion = Math.random() * 6; // 0-6 minutes
        const variation = (Math.random() - 0.5) * 2; // -1 to +1
        const congestion = Math.max(0, Math.min(8, baseCongestion + variation));

        trafficData[junction.id] = {
            congestion: congestion,
            vehicles: Math.floor(Math.random() * 50) + 10,
            speed: Math.max(5, 60 - congestion * 8),
            timestamp: new Date().toISOString()
        };
    });
}

function updateTrafficMonitor() {
    if (!monitoringActive) return;

    generateTrafficData();

    junctionData.forEach(junction => {
        const card = document.getElementById(`junction-${junction.id}`);
        const data = trafficData[junction.id];

        // Update congestion display
        updateJunctionDisplay(card, junction, data);

        // Update border animation based on congestion
        updateJunctionAnimation(card, data.congestion);
    });

    // Update sidebar stats
    updateSidebarStats();
}

function updateJunctionDisplay(card, junction, data) {
    const progressFill = card.querySelector('.progress-fill');
    const congestionValue = card.querySelector('.congestion-value span:first-child');
    const statusText = card.querySelector('.status-text');
    const statusIndicator = card.querySelector('.status-indicator');
    const imageContainer = card.querySelector('.junction-image');

    // Update progress bar
    const progressPercent = Math.min(100, (data.congestion / 8) * 100);
    progressFill.style.width = `${progressPercent}%`;

    // Update colors and status based on congestion
    let color, status, statusEmoji, statusClass;

    if (data.congestion < 2) {
        color = '#00ff88';
        status = 'Clear';
        statusEmoji = '🟢';
        statusClass = 'clear';
    } else if (data.congestion < 4) {
        color = '#ffa500';
        status = 'Moderate';
        statusEmoji = '🟡';
        statusClass = 'moderate';
    } else {
        color = '#ff4444';
        status = 'Congested';
        statusEmoji = '🔴';
        statusClass = 'congested';
    }

    progressFill.style.backgroundColor = color;
    congestionValue.textContent = `${data.congestion.toFixed(1)} mins`;
    congestionValue.style.color = color;
    statusText.textContent = status;
    statusText.style.color = color;
    statusIndicator.textContent = statusEmoji;

    // Update card class for border animation
    card.className = `junction-card ${statusClass}`;

    // Simulate image loading (in real app, this would load actual camera feeds)
    if (imageContainer.classList.contains('loading')) {
        // Preload image to avoid broken images showing in the UI
        const img = new Image();
        // Use explicit relative path so it resolves correctly when served
        img.src = `./predicted0/${junction.id}.jpg`;
        img.alt = `Junction ${junction.id} Camera Feed`;
        img.className = 'junction-camera-image';

        const displayLoadedImage = () => {
            // Only update if container still exists
            if (!imageContainer) return;
            imageContainer.classList.remove('loading');
            imageContainer.classList.remove('error');
            // Build the camera feed container using the preloaded image element
            const feed = document.createElement('div');
            feed.className = 'camera-feed';
            feed.appendChild(img);

            const overlay = document.createElement('div');
            overlay.className = 'feed-overlay';
            overlay.innerHTML = `
                <div class="feed-info">
                    <span class="feed-status">● LIVE</span>
                    <span class="feed-time">${new Date().toLocaleTimeString()}</span>
                </div>
            `;
            feed.appendChild(overlay);

            // Replace container content safely
            imageContainer.innerHTML = '';
            imageContainer.appendChild(feed);
        };

        const displayErrorPlaceholder = () => {
            if (!imageContainer) return;
            imageContainer.classList.remove('loading');
            imageContainer.classList.add('error');
            imageContainer.innerHTML = `
                <div class="image-placeholder">Camera feed unavailable</div>
            `;
        };

        // Attach handlers
        img.onload = () => {
            // Add a small delay to simulate realistic camera startup
            setTimeout(displayLoadedImage, Math.random() * 800 + 200);
        };
        img.onerror = () => {
            // If image fails to load, show an error placeholder
            displayErrorPlaceholder();
        };

        // In case the image is cached and already complete
        if (img.complete && img.naturalWidth) {
            // small timeout to ensure DOM readiness
            setTimeout(displayLoadedImage, 150);
        }
    }

    // Update indicator animation
    const updateIndicator = card.querySelector('.update-indicator');
    updateIndicator.style.color = '#00ff00';
    setTimeout(() => {
        updateIndicator.style.color = '#666666';
    }, 500);
}

function updateJunctionAnimation(card, congestion) {
    // Remove existing animation classes
    card.classList.remove('congested', 'moderate', 'clear');

    if (congestion >= 4) {
        card.classList.add('congested');
    } else if (congestion >= 2) {
        card.classList.add('moderate');
    } else {
        card.classList.add('clear');
    }
}

function updateSidebarStats() {
    const totalJunctions = junctionData.length;
    const activeJunctions = Object.values(trafficData).filter(d => d.congestion < 4).length;
    const avgCongestion = Object.values(trafficData).reduce((sum, d) => sum + d.congestion, 0) / totalJunctions;

    document.getElementById('total-junctions').textContent = totalJunctions;
    document.getElementById('last-update').textContent = new Date().toLocaleTimeString();

    // Update performance metrics (simulated)
    const cpuUsage = 35 + Math.random() * 30;
    const memoryUsage = 50 + Math.random() * 25;
    const networkUsage = 15 + Math.random() * 20;

    document.getElementById('cpu-usage').style.width = `${cpuUsage}%`;
    document.getElementById('memory-usage').style.width = `${memoryUsage}%`;
    document.getElementById('network-usage').style.width = `${networkUsage}%`;

    // Fetch and update weather data
    fetchWeatherData();
}

async function fetchWeatherData() {
    try {
        const apiBase = getApiBase();
        const response = await fetch(`${apiBase}/weather`);
        const weatherData = await response.json();

        if (weatherData.error) {
            console.warn('Weather API error:', weatherData.error);
            // Show fallback weather data
            updateWeatherDisplay({
                temperature: 22,
                condition: 'Partly Cloudy',
                humidity: 65,
                visibility: 10,
                wind_speed: 12,
                traffic_impact: 'low'
            });
            return;
        }

        updateWeatherDisplay(weatherData);
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        // Show fallback weather data
        updateWeatherDisplay({
            temperature: 22,
            condition: 'Partly Cloudy',
            humidity: 65,
            visibility: 10,
            wind_speed: 12,
            traffic_impact: 'low'
        });
    }
}

function updateWeatherDisplay(weatherData) {
    // Update temperature
    document.getElementById('weather-temp').textContent = `${Math.round(weatherData.temperature)}°C`;

    // Update condition
    document.getElementById('weather-condition').textContent = weatherData.condition;

    // Update humidity
    document.getElementById('weather-humidity').textContent = `${weatherData.humidity}%`;

    // Update visibility
    document.getElementById('weather-visibility').textContent = `${weatherData.visibility} km`;

    // Update wind speed
    document.getElementById('weather-wind').textContent = `${weatherData.wind_speed} km/h`;

    // Update traffic impact badge
    const impactBadge = document.getElementById('traffic-impact-badge');
    const impactText = document.getElementById('traffic-impact-text');

    impactBadge.className = 'traffic-impact-badge';
    impactBadge.classList.add(weatherData.traffic_impact);

    impactText.textContent = weatherData.traffic_impact.charAt(0).toUpperCase() + weatherData.traffic_impact.slice(1);

    // Update weather icon based on condition
    updateWeatherIcon(weatherData.condition);
}

function updateWeatherIcon(condition) {
    const iconElement = document.getElementById('weather-icon');
    const conditionLower = condition.toLowerCase();

    let iconClass = 'fas fa-sun'; // default

    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        iconClass = 'fas fa-cloud-rain';
    } else if (conditionLower.includes('snow')) {
        iconClass = 'fas fa-snowflake';
    } else if (conditionLower.includes('cloud')) {
        iconClass = 'fas fa-cloud';
    } else if (conditionLower.includes('clear')) {
        iconClass = 'fas fa-sun';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        iconClass = 'fas fa-bolt';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
        iconClass = 'fas fa-smog';
    }

    iconElement.className = iconClass;
}

// Signal Control functionality
function initializeSignalControl() {
    const signalGrid = document.querySelector('.signal-control-grid');

    // Create signal control cards
    junctionData.forEach(junction => {
        const card = createSignalCard(junction);
        signalGrid.appendChild(card);

        // Initialize signal state
        signalStates[junction.id] = {
            currentLight: 'green',
            timer: 45,
            lanes: ['green', 'red', 'red', 'red']
        };
    });

    // Start signal updates
    updateSignalControls();
}

function createSignalCard(junction) {
    const card = document.createElement('div');
    card.className = 'signal-card';
    card.id = `signal-${junction.id}`;

    card.innerHTML = `
        <div class="signal-header">
            <div class="signal-title">Junction ${junction.id}</div>
            <div class="signal-timer">45s</div>
        </div>
        <div class="traffic-lights">
            <div class="traffic-light">
                <div class="light red" data-lane="0"></div>
                <div class="light-label">N</div>
            </div>
            <div class="traffic-light">
                <div class="light yellow" data-lane="1"></div>
                <div class="light-label">E</div>
            </div>
            <div class="traffic-light">
                <div class="light green" data-lane="2"></div>
                <div class="light-label">S</div>
            </div>
            <div class="traffic-light">
                <div class="light red" data-lane="3"></div>
                <div class="light-label">W</div>
            </div>
        </div>
        <div class="signal-info">
            <div class="location">📍 ${junction.name}</div>
            <div class="congestion">🚗 ${Math.floor(Math.random() * 30) + 5} vehicles</div>
        </div>
    `;

    return card;
}

function updateSignalControls() {
    junctionData.forEach(junction => {
        const card = document.getElementById(`signal-${junction.id}`);
        const state = signalStates[junction.id];

        // Update timer
        state.timer--;
        if (state.timer <= 0) {
            // Cycle to next light
            cycleTrafficLight(junction.id);
        }

        // Update display
        updateSignalDisplay(card, state);
    });

    setTimeout(updateSignalControls, 1000);
}

function cycleTrafficLight(junctionId) {
    const state = signalStates[junctionId];
    const congestion = trafficData[junctionId]?.congestion || 0;

    // Adaptive timing based on congestion
    const baseTime = congestion > 4 ? 60 : congestion > 2 ? 45 : 30;

    if (state.currentLight === 'green') {
        state.currentLight = 'yellow';
        state.timer = 5;
        state.lanes = ['yellow', 'red', 'red', 'red'];
    } else if (state.currentLight === 'yellow') {
        state.currentLight = 'red';
        state.timer = 2;
        state.lanes = ['red', 'red', 'red', 'red'];
    } else {
        state.currentLight = 'green';
        state.timer = baseTime;
        // Rotate to next lane (simple round-robin)
        const nextGreen = (state.lanes.indexOf('green') + 1) % 4;
        state.lanes = ['red', 'red', 'red', 'red'];
        state.lanes[nextGreen] = 'green';
    }
}

function updateSignalDisplay(card, state) {
    const timer = card.querySelector('.signal-timer');
    const lights = card.querySelectorAll('.light');

    timer.textContent = `${state.timer}s`;

    lights.forEach((light, index) => {
        // Remove all active classes
        light.classList.remove('active');

        // Add active class if this lane should be lit
        if (state.lanes[index] !== 'red') {
            light.classList.add('active');
        }
    });
}

// Analytics functionality
function initializeAnalytics() {
    initializeCharts();
    updateAnalytics();
}

function initializeCharts() {
    // Traffic Flow Chart
    const trafficFlowCtx = document.getElementById('traffic-flow-chart').getContext('2d');
    window.trafficFlowChart = new Chart(trafficFlowCtx, {
        type: 'line',
        data: {
            labels: generateTimeLabels(24),
            datasets: [{
                label: 'Traffic Flow (vehicles/hour)',
                data: generateRandomData(24, 100, 500),
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: '#333333'
                    }
                },
                y: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: '#333333'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    // Congestion Chart
    const congestionCtx = document.getElementById('congestion-chart').getContext('2d');
    window.congestionChart = new Chart(congestionCtx, {
        type: 'bar',
        data: {
            labels: junctionData.map(j => `J${j.id}`),
            datasets: [{
                label: 'Congestion (minutes)',
                data: generateRandomData(9, 0, 6),
                backgroundColor: 'rgba(255, 68, 68, 0.6)',
                borderColor: '#ff4444',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: '#333333'
                    }
                },
                y: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: '#333333'
                    }
                }
            }
        }
    });

    // Junction Performance Chart
    const junctionPerfCtx = document.getElementById('junction-performance-chart').getContext('2d');
    window.junctionPerfChart = new Chart(junctionPerfCtx, {
        type: 'radar',
        data: {
            labels: ['Efficiency', 'Flow Rate', 'Safety', 'Response Time', 'Utilization'],
            datasets: junctionData.slice(0, 3).map((junction, index) => ({
                label: `Junction ${junction.id}`,
                data: generateRandomData(5, 60, 95),
                borderColor: ['#00d4ff', '#00ff88', '#ffa500'][index],
                backgroundColor: ['rgba(0, 212, 255, 0.2)', 'rgba(0, 255, 136, 0.2)', 'rgba(255, 165, 0, 0.2)'][index],
                pointBackgroundColor: ['#00d4ff', '#00ff88', '#ffa500'][index]
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                r: {
                    ticks: {
                        color: '#b0b0b0',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: '#333333'
                    },
                    angleLines: {
                        color: '#333333'
                    },
                    pointLabels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });

    // Peak Hours Chart
    const peakHoursCtx = document.getElementById('peak-hours-chart').getContext('2d');
    window.peakHoursChart = new Chart(peakHoursCtx, {
        type: 'doughnut',
        data: {
            labels: ['Morning Peak', 'Midday', 'Evening Peak', 'Night'],
            datasets: [{
                data: [35, 25, 30, 10],
                backgroundColor: [
                    'rgba(255, 68, 68, 0.8)',
                    'rgba(255, 165, 0, 0.8)',
                    'rgba(0, 212, 255, 0.8)',
                    'rgba(0, 255, 136, 0.8)'
                ],
                borderColor: [
                    '#ff4444',
                    '#ffa500',
                    '#00d4ff',
                    '#00ff88'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

function generateTimeLabels(hours) {
    const labels = [];
    for (let i = hours; i >= 1; i--) {
        labels.push(`${i}h ago`);
    }
    return labels;
}

function generateRandomData(count, min, max) {
    return Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function resizeCharts() {
    // Resize all charts to fit their containers properly
    if (window.trafficFlowChart) {
        window.trafficFlowChart.resize();
    }
    if (window.congestionChart) {
        window.congestionChart.resize();
    }
    if (window.junctionPerfChart) {
        window.junctionPerfChart.resize();
    }
    if (window.peakHoursChart) {
        window.peakHoursChart.resize();
    }
}

function updateAnalytics() {
    // Update summary values
    const avgCongestion = Object.values(trafficData).reduce((sum, d) => sum + d.congestion, 0) / Object.keys(trafficData).length;
    const totalVehicles = Object.values(trafficData).reduce((sum, d) => sum + d.vehicles, 0);

    document.getElementById('avg-congestion').textContent = `${avgCongestion.toFixed(1)} min`;
    document.getElementById('total-vehicles').textContent = totalVehicles.toLocaleString();

    // Update charts with new data
    if (window.trafficFlowChart) {
        window.trafficFlowChart.data.datasets[0].data = generateRandomData(24, 100, 500);
        window.trafficFlowChart.update();
    }

    if (window.congestionChart) {
        window.congestionChart.data.datasets[0].data = Object.values(trafficData).map(d => d.congestion);
        window.congestionChart.update();
    }
}

// Emergency functionality
function initializeEmergency() {
    // Add some sample incidents
    addSampleIncidents();
    updateIncidentList();
}

function addSampleIncidents() {
    incidents = [
        {
            id: 1,
            type: 'accident',
            location: 'Junction 2 - Times Square',
            description: 'Multi-vehicle collision at intersection',
            time: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString(),
            priority: 'high',
            status: 'active'
        },
        {
            id: 2,
            type: 'medical',
            location: 'Junction 5 - City Hall',
            description: 'Medical emergency reported',
            time: new Date(Date.now() - 8 * 60 * 1000).toLocaleTimeString(),
            priority: 'critical',
            status: 'active'
        }
    ];
}

function updateIncidentList() {
    const incidentList = document.getElementById('incident-list');
    incidentList.innerHTML = '';

    incidents.forEach(incident => {
        const incidentElement = document.createElement('div');
        incidentElement.className = 'incident-item';

        const priorityColor = incident.priority === 'critical' ? '#ff4444' :
                             incident.priority === 'high' ? '#ffa500' : '#00d4ff';

        incidentElement.innerHTML = `
            <div class="incident-header">
                <span class="incident-type" style="background-color: ${priorityColor}20; color: ${priorityColor}">
                    ${incident.type.toUpperCase()}
                </span>
                <span class="incident-time">${incident.time}</span>
            </div>
            <div class="incident-location">${incident.location}</div>
            <div class="incident-description">${incident.description}</div>
        `;

        incidentList.appendChild(incidentElement);
    });
}

// Settings functionality
function initializeSettings() {
    // Load saved settings
    loadSavedSettings();

    // Setup event listeners for settings
    setupSettingsListeners();

    // Auto-save settings on change
    document.addEventListener('change', autoSaveSettings);
}

function loadSettings() {
    // Load settings from localStorage or set defaults
    const settings = {
        theme: localStorage.getItem('theme') || 'dark',
        animationSpeed: parseInt(localStorage.getItem('animationSpeed')) || 100,
        refreshInterval: parseInt(localStorage.getItem('refreshInterval')) || 3000,
        soundAlerts: localStorage.getItem('soundAlerts') !== 'false',
        visualAlerts: localStorage.getItem('visualAlerts') !== 'false',
        notificationAlerts: localStorage.getItem('notificationAlerts') !== 'false',
        congestionThreshold: parseFloat(localStorage.getItem('congestionThreshold')) || 4.0,
        dataRetention: parseInt(localStorage.getItem('dataRetention')) || 30
    };

    // Apply settings to UI
    document.getElementById('theme-select').value = settings.theme;
    document.getElementById('animation-speed').value = settings.animationSpeed;
    document.getElementById('animation-speed-value').textContent = `${settings.animationSpeed}%`;
    document.getElementById('refresh-interval').value = settings.refreshInterval;
    document.getElementById('sound-alerts').checked = settings.soundAlerts;
    document.getElementById('visual-alerts').checked = settings.visualAlerts;
    document.getElementById('notification-alerts').checked = settings.notificationAlerts;
    document.getElementById('congestion-threshold').value = settings.congestionThreshold;
    document.getElementById('data-retention').value = settings.dataRetention;

    // Apply settings
    applySettings(settings);
}

function setupSettingsListeners() {
    // Animation speed slider
    document.getElementById('animation-speed').addEventListener('input', function(e) {
        const value = e.target.value;
        document.getElementById('animation-speed-value').textContent = `${value}%`;
        animationSpeed = value;
        localStorage.setItem('animationSpeed', value);

        // Update CSS custom property for animation speed
        document.documentElement.style.setProperty('--animation-speed', `${value}ms`);
    });

    // Other settings
    ['theme-select', 'refresh-interval', 'congestion-threshold', 'data-retention'].forEach(id => {
        document.getElementById(id).addEventListener('change', saveSetting);
    });

    ['sound-alerts', 'visual-alerts', 'notification-alerts'].forEach(id => {
        document.getElementById(id).addEventListener('change', saveSetting);
    });

    // Export and clear buttons
    document.getElementById('export-data-btn').addEventListener('click', exportData);
    document.getElementById('clear-data-btn').addEventListener('click', clearData);
}

function saveSetting(e) {
    const id = e.target.id;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    localStorage.setItem(id, value);

    // Apply setting immediately
    applySettings({ [id]: value });
}

function applySettings(settings) {
    // Apply theme
    if (settings.theme || settings['theme-select']) {
        const theme = settings.theme || settings['theme-select'];
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }

    // Apply refresh interval
    if (settings.refreshInterval || settings['refresh-interval']) {
        refreshInterval = settings.refreshInterval || settings['refresh-interval'];
        if (monitoringActive) {
            clearInterval(window.monitoringInterval);
            startRealTimeUpdates();
        }
    }

    // Apply animation speed
    if (settings.animationSpeed || settings['animation-speed']) {
        animationSpeed = settings.animationSpeed || settings['animation-speed'];
        document.documentElement.style.setProperty('--animation-speed', `${animationSpeed}ms`);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    let newTheme;

    if (currentTheme === 'dark') {
        newTheme = 'light';
    } else if (currentTheme === 'light') {
        newTheme = 'auto';
    } else {
        newTheme = 'dark';
    }

    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);

    // Update settings dropdown
    document.getElementById('theme-select').value = newTheme;

    // Save to localStorage
    localStorage.setItem('theme', newTheme);

    // Show notification
    addNotification(`Theme changed to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`, 'info');
}

function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');

        if (theme === 'light') {
            icon.className = 'fas fa-sun';
        } else if (theme === 'auto') {
            icon.className = 'fas fa-adjust';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

function exportData() {
    const format = document.getElementById('export-format').value;

    if (format === 'json') {
        exportAsJSON();
    } else if (format === 'csv') {
        exportAsCSV();
    } else if (format === 'pdf') {
        exportAsPDF();
    }
}

function exportAsJSON() {
    const data = {
        trafficData,
        signalStates,
        incidents,
        notifications,
        analytics: {
            avgCongestion: Object.values(trafficData).reduce((sum, d) => sum + d.congestion, 0) / Object.keys(trafficData).length,
            totalVehicles: Object.values(trafficData).reduce((sum, d) => sum + d.vehicles, 0),
            systemUptime: '99.8%',
            activeJunctions: Object.values(trafficData).filter(d => d.congestion < 4).length
        },
        settings: {
            theme: document.getElementById('theme-select').value,
            animationSpeed: document.getElementById('animation-speed').value,
            refreshInterval: document.getElementById('refresh-interval').value,
            soundAlerts: document.getElementById('sound-alerts').checked,
            visualAlerts: document.getElementById('visual-alerts').checked,
            notificationAlerts: document.getElementById('notification-alerts').checked,
            congestionThreshold: document.getElementById('congestion-threshold').value,
            dataRetention: document.getElementById('data-retention').value
        },
        exportTime: new Date().toISOString(),
        version: '2.1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic-system-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Data exported as JSON successfully!', 'success');
}

function exportAsCSV() {
    const csvData = [];

    // Add headers
    csvData.push(['Junction ID', 'Name', 'Congestion Level', 'Vehicle Count', 'Status', 'Last Update']);

    // Add traffic data
    Object.entries(trafficData).forEach(([id, data]) => {
        csvData.push([
            id,
            junctionData.find(j => j.id == id)?.name || 'Unknown',
            data.congestion.toFixed(1),
            data.vehicles,
            data.congestion < 2 ? 'Clear' : data.congestion < 4 ? 'Moderate' : 'Congested',
            new Date().toLocaleString()
        ]);
    });

    // Add analytics summary
    csvData.push([]);
    csvData.push(['Analytics Summary']);
    csvData.push(['Average Congestion', (Object.values(trafficData).reduce((sum, d) => sum + d.congestion, 0) / Object.keys(trafficData).length).toFixed(2)]);
    csvData.push(['Total Vehicles', Object.values(trafficData).reduce((sum, d) => sum + d.vehicles, 0)]);
    csvData.push(['Active Junctions', Object.values(trafficData).filter(d => d.congestion < 4).length]);
    csvData.push(['System Status', 'Online']);

    // Convert to CSV string
    const csvContent = csvData.map(row =>
        row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic-system-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Data exported as CSV successfully!', 'success');
}

function exportAsPDF() {
    // Create a simple HTML report for PDF generation
    const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Smart Traffic Management System Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #00d4ff; }
                h2 { color: #333; border-bottom: 2px solid #00d4ff; padding-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
                .status-good { color: #00ff88; }
                .status-warning { color: #ffa500; }
                .status-danger { color: #ff4444; }
            </style>
        </head>
        <body>
            <h1>🚦 Smart Traffic Management System Report</h1>
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>

            <h2>System Overview</h2>
            <div class="summary">
                <p><strong>Total Junctions:</strong> ${junctionData.length}</p>
                <p><strong>Active Junctions:</strong> ${Object.values(trafficData).filter(d => d.congestion < 4).length}</p>
                <p><strong>Average Congestion:</strong> ${(Object.values(trafficData).reduce((sum, d) => sum + d.congestion, 0) / Object.keys(trafficData).length).toFixed(2)} minutes</p>
                <p><strong>Total Vehicles:</strong> ${Object.values(trafficData).reduce((sum, d) => sum + d.vehicles, 0)}</p>
                <p><strong>System Status:</strong> <span class="status-good">Online</span></p>
            </div>

            <h2>Junction Status</h2>
            <table>
                <thead>
                    <tr>
                        <th>Junction ID</th>
                        <th>Name</th>
                        <th>Congestion Level</th>
                        <th>Vehicle Count</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(trafficData).map(([id, data]) => `
                        <tr>
                            <td>${id}</td>
                            <td>${junctionData.find(j => j.id == id)?.name || 'Unknown'}</td>
                            <td>${data.congestion.toFixed(1)}</td>
                            <td>${data.vehicles}</td>
                            <td class="${data.congestion < 2 ? 'status-good' : data.congestion < 4 ? 'status-warning' : 'status-danger'}">
                                ${data.congestion < 2 ? 'Clear' : data.congestion < 4 ? 'Moderate' : 'Congested'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <h2>Active Incidents</h2>
            ${incidents.length > 0 ?
                `<table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${incidents.map(incident => `
                            <tr>
                                <td>${incident.type.toUpperCase()}</td>
                                <td>${incident.location}</td>
                                <td>${incident.description}</td>
                                <td class="${incident.priority === 'critical' ? 'status-danger' : incident.priority === 'high' ? 'status-warning' : 'status-good'}">${incident.priority.toUpperCase()}</td>
                                <td>${incident.time}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>` :
                '<p>No active incidents.</p>'
            }

            <h2>System Settings</h2>
            <div class="summary">
                <p><strong>Theme:</strong> ${document.getElementById('theme-select').value}</p>
                <p><strong>Refresh Interval:</strong> ${document.getElementById('refresh-interval').value}ms</p>
                <p><strong>Congestion Threshold:</strong> ${document.getElementById('congestion-threshold').value} minutes</p>
                <p><strong>Sound Alerts:</strong> ${document.getElementById('sound-alerts').checked ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Visual Alerts:</strong> ${document.getElementById('visual-alerts').checked ? 'Enabled' : 'Disabled'}</p>
            </div>
        </body>
        </html>
    `;

    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic-system-report-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Report exported as HTML successfully! (Can be printed as PDF)', 'success');
}

function exportAnalyticsReport() {
    const analyticsData = {
        summary: {
            totalJunctions: junctionData.length,
            activeJunctions: Object.values(trafficData).filter(d => d.congestion < 4).length,
            averageCongestion: (Object.values(trafficData).reduce((sum, d) => sum + d.congestion, 0) / Object.keys(trafficData).length).toFixed(2),
            totalVehicles: Object.values(trafficData).reduce((sum, d) => sum + d.vehicles, 0),
            systemUptime: '99.8%',
            emergencyCount: incidents.length
        },
        junctionPerformance: Object.entries(trafficData).map(([id, data]) => ({
            id: parseInt(id),
            name: junctionData.find(j => j.id == id)?.name || 'Unknown',
            congestion: data.congestion,
            vehicles: data.vehicles,
            status: data.congestion < 2 ? 'Clear' : data.congestion < 4 ? 'Moderate' : 'Congested',
            efficiency: Math.max(0, 100 - (data.congestion * 10))
        })),
        trafficTrends: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            data: [120, 180, 450, 380, 520, 280]
        },
        peakHours: {
            morning: 35,
            midday: 25,
            evening: 30,
            night: 10
        },
        incidents: incidents.map(incident => ({
            type: incident.type,
            location: incident.location,
            priority: incident.priority,
            time: incident.time,
            status: incident.status
        })),
        generatedAt: new Date().toISOString(),
        period: 'Last 24 hours'
    };

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Analytics report exported successfully!', 'success');
}

function clearData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        trafficData = {};
        signalStates = {};
        incidents = [];
        notifications = [];
        localStorage.clear();

        // Reset UI
        initializeTrafficMonitor();
        initializeSignalControl();
        updateIncidentList();
        updateNotificationList();

        showNotification('All data cleared successfully!', 'warning');
    }
}

// Notifications functionality
function initializeNotifications() {
    updateNotificationList();
}

function addNotification(message, type = 'info', persistent = false) {
    const notification = {
        id: Date.now(),
        message,
        type,
        time: new Date().toLocaleTimeString(),
        read: false,
        persistent
    };

    notifications.unshift(notification);
    updateNotificationList();
    updateNotificationBadge();

    // Show browser notification if enabled
    if (document.getElementById('notification-alerts').checked && 'Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Smart Traffic System', {
                body: message,
                icon: '/favicon.ico'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }

    // Play sound if enabled
    if (document.getElementById('sound-alerts').checked) {
        playNotificationSound();
    }
}

function updateNotificationList() {
    const notificationList = document.getElementById('notification-list');
    notificationList.innerHTML = '';

    notifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = `notification-item ${notification.read ? '' : 'unread'}`;

        item.innerHTML = `
            <div class="notification-time">${notification.time}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-type ${notification.type}">${notification.type.toUpperCase()}</div>
        `;

        notificationList.appendChild(item);
    });
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notification-count');
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
}

function showNotification(message, type = 'info') {
    addNotification(message, type);
}

// Utility functions
function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString();
}

function startRealTimeUpdates() {
    if (window.monitoringInterval) {
        clearInterval(window.monitoringInterval);
    }

    window.monitoringInterval = setInterval(() => {
        if (monitoringActive) {
            updateTrafficMonitor();
            updateAnalytics();
            updatePerformanceMetrics();
            updateSystemStatus();
        }
    }, refreshInterval);
}

function playNotificationSound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Fallback: do nothing if Web Audio API is not supported
    }
}

function setupEventListeners() {
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
        updateTrafficMonitor();
        showNotification('Traffic data refreshed', 'info');
    });

    // Auto refresh toggle
    document.getElementById('auto-refresh').addEventListener('change', function(e) {
        monitoringActive = e.target.checked;
        if (monitoringActive) {
            startRealTimeUpdates();
            showNotification('Auto refresh enabled', 'success');
        } else {
            clearInterval(window.monitoringInterval);
            showNotification('Auto refresh disabled', 'warning');
        }
    });

    // Notification panel toggle
    document.getElementById('notification-btn').addEventListener('click', () => {
        document.getElementById('notification-panel').classList.toggle('active');
    });

    document.getElementById('close-notifications').addEventListener('click', () => {
        document.getElementById('notification-panel').classList.remove('active');
    });

    // Theme toggle button
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

    // Keyboard shortcuts button
    document.getElementById('keyboard-shortcuts-btn').addEventListener('click', () => {
        document.getElementById('keyboard-modal').classList.add('active');
    });

    document.getElementById('close-keyboard-modal').addEventListener('click', () => {
        document.getElementById('keyboard-modal').classList.remove('active');
    });

    // Emergency modal
    document.getElementById('emergency-alert-btn').addEventListener('click', () => {
        document.getElementById('emergency-modal').classList.add('active');
    });

    document.getElementById('close-emergency-modal').addEventListener('click', () => {
        document.getElementById('emergency-modal').classList.remove('active');
    });

    document.getElementById('cancel-emergency').addEventListener('click', () => {
        document.getElementById('emergency-modal').classList.remove('active');
    });

    document.getElementById('send-emergency-alert').addEventListener('click', () => {
        const type = document.getElementById('alert-type').value;
        const location = document.getElementById('alert-location').value;
        const description = document.getElementById('alert-description').value;
        const priority = document.getElementById('alert-priority').value;

        if (description.trim()) {
            const incident = {
                id: Date.now(),
                type,
                location: document.getElementById('alert-location').options[document.getElementById('alert-location').selectedIndex].text,
                description,
                time: new Date().toLocaleTimeString(),
                priority,
                status: 'active'
            };

            incidents.unshift(incident);
            updateIncidentList();

            showNotification(`Emergency alert sent: ${type.toUpperCase()}`, 'emergency');
            document.getElementById('emergency-modal').classList.remove('active');

            // Clear form
            document.getElementById('alert-description').value = '';
        } else {
            alert('Please enter a description for the emergency.');
        }
    });

    // AI Optimize button
    document.getElementById('optimize-btn').addEventListener('click', () => {
        showNotification('AI optimization in progress...', 'info');
        setTimeout(() => {
            showNotification('Traffic signals optimized successfully!', 'success');
        }, 2000);
    });

    // Manual override button
    document.getElementById('manual-override-btn').addEventListener('click', () => {
        showNotification('Manual override mode activated', 'warning');
    });

    // Time range selector for analytics
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateAnalytics();
        });
    });

    // Clear alerts button
    document.getElementById('clear-alerts-btn').addEventListener('click', () => {
        incidents = [];
        updateIncidentList();
        showNotification('All alerts cleared', 'warning');
    });

    // Export analytics button
    document.getElementById('export-analytics-btn').addEventListener('click', exportAnalyticsReport);
}

// Initialize with some sample data
function initializeSampleData() {
    // Add some sample notifications
    addNotification('System initialized successfully', 'success', true);
    addNotification('Traffic monitoring active on all junctions', 'info', true);
    addNotification('Weather data updated', 'info', false);

    // Add some sample incidents
    setTimeout(() => {
        addNotification('High congestion detected at Junction 3', 'warning');
    }, 5000);

    setTimeout(() => {
        addNotification('Emergency response team dispatched', 'emergency');
    }, 10000);
}

// Enhanced Loading with Progress
function showLoadingProgress() {
    const overlay = document.getElementById('loading-overlay');
    const progressBar = document.getElementById('loading-progress');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                overlay.classList.add('hidden');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 500);
            }, 500);
        }
        progressBar.style.width = progress + '%';
    }, 200);
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('junction-search');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const junctionCards = document.querySelectorAll('.junction-card');

        junctionCards.forEach(card => {
            const junctionName = card.querySelector('h3').textContent.toLowerCase();
            const junctionId = card.dataset.junctionId;

            if (junctionName.includes(searchTerm) || junctionId.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                card.style.display = 'none';
            }
        });

        // Update grid layout after filtering
        updateTrafficGridLayout();
    });
}

function updateTrafficGridLayout() {
    const trafficGrid = document.querySelector('.traffic-grid');
    const visibleCards = document.querySelectorAll('.junction-card[style*="display: block"]');

    if (visibleCards.length === 0) {
        trafficGrid.innerHTML += `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No junctions found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        `;
    } else {
        const noResults = trafficGrid.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }
}

// Floating Action Button Functionality
function initializeFAB() {
    const fabMain = document.getElementById('fab-main');
    const fabContainer = document.querySelector('.fab-container');
    const fabRefresh = document.getElementById('fab-refresh');
    const fabEmergency = document.getElementById('fab-emergency');
    const fabAnalytics = document.getElementById('fab-analytics');

    // Toggle FAB menu
    fabMain.addEventListener('click', function() {
        fabContainer.classList.toggle('active');
        const icon = this.querySelector('i');
        if (fabContainer.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-plus';
        }
    });

    // FAB actions
    fabRefresh.addEventListener('click', function() {
        updateTrafficMonitor();
        fabContainer.classList.remove('active');
        fabMain.querySelector('i').className = 'fas fa-plus';
        addNotification('Traffic data refreshed', 'success');
    });

    fabEmergency.addEventListener('click', function() {
        document.getElementById('emergency-modal').style.display = 'flex';
        fabContainer.classList.remove('active');
        fabMain.querySelector('i').className = 'fas fa-plus';
    });

    fabAnalytics.addEventListener('click', function() {
        switchTab('analytics');
        fabContainer.classList.remove('active');
        fabMain.querySelector('i').className = 'fas fa-plus';
    });

    // Close FAB menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!fabContainer.contains(e.target)) {
            fabContainer.classList.remove('active');
            fabMain.querySelector('i').className = 'fas fa-plus';
        }
    });
}

// Enhanced Notification System
function addNotification(message, type = 'info', duration = 5000) {
    const notificationList = document.getElementById('notification-list');
    const notificationCount = document.getElementById('notification-count');

    const notification = document.createElement('div');
    notification.className = `notification-item ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
            <div class="notification-time">${new Date().toLocaleTimeString()}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    notificationList.insertBefore(notification, notificationList.firstChild);
    updateNotificationCount();

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
                updateNotificationCount();
            }
        }, duration);
    }

    // Play notification sound if enabled
    if (localStorage.getItem('sound-alerts') !== 'false') {
        playNotificationSound(type);
    }

    // Browser notification if enabled
    if (localStorage.getItem('notification-alerts') !== 'false' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Smart Traffic System', {
                body: message,
                icon: '/favicon.ico'
            });
        }
    }
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'warning': 'fa-exclamation-triangle',
        'error': 'fa-times-circle',
        'info': 'fa-info-circle',
        'emergency': 'fa-siren-on'
    };
    return icons[type] || 'fa-info-circle';
}

function updateNotificationCount() {
    const count = document.querySelectorAll('.notification-item').length;
    document.getElementById('notification-count').textContent = count;
    document.getElementById('notification-count').style.display = count > 0 ? 'flex' : 'none';
}

// Enhanced Modal Management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    modal.style.animation = 'fadeIn 0.3s ease-out';
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Enhanced Tab Switching with Animations
function switchTab(tabName) {
    // Remove active class from current tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to new tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');

    currentTab = tabName;

    // Update URL hash without page reload
    window.location.hash = tabName;

    // Add entrance animation
    const tabContent = document.getElementById(tabName);
    tabContent.style.animation = 'slideInRight 0.4s ease-out';

    // Resize charts if switching to analytics tab
    if (tabName === 'analytics') {
        setTimeout(() => {
            resizeCharts();
        }, 100);
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ignore if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        // Allow Ctrl+K even in inputs
        if (!(e.ctrlKey || e.metaKey) || e.key !== 'k') {
            return;
        }
    }

    // Ctrl/Cmd + K: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('junction-search').focus();
        showNotification('Search focused', 'info');
    }

    // Ctrl/Cmd + R: Refresh data
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        updateTrafficMonitor();
        addNotification('Data refreshed via keyboard shortcut', 'info');
    }

    // Ctrl/Cmd + E: Emergency alert
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        document.getElementById('emergency-modal').classList.add('active');
        addNotification('Emergency modal opened', 'warning');
    }

    // Ctrl/Cmd + T: Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }

    // Ctrl/Cmd + S: Export data
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        exportData();
    }

    // Number keys 1-5: Switch tabs
    const tabKeys = {
        '1': 'traffic-monitor',
        '2': 'analytics',
        '3': 'signal-control',
        '4': 'emergency',
        '5': 'settings'
    };

    if (tabKeys[e.key]) {
        e.preventDefault();
        switchTab(tabKeys[e.key]);
        addNotification(`Switched to ${tabKeys[e.key].replace('-', ' ').toUpperCase()}`, 'info');
    }

    // Letter keys for quick tab switching
    const letterTabs = {
        'm': 'traffic-monitor',
        'a': 'analytics',
        'c': 'signal-control',
        'e': 'emergency',
        's': 'settings'
    };

    if (letterTabs[e.key.toLowerCase()] && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        switchTab(letterTabs[e.key.toLowerCase()]);
        addNotification(`Switched to ${letterTabs[e.key.toLowerCase()].replace('-', ' ').toUpperCase()}`, 'info');
    }

    // ?: Show keyboard shortcuts
    if (e.key === '?') {
        e.preventDefault();
        document.getElementById('keyboard-modal').classList.add('active');
    }

    // Escape: Close modals
    if (e.key === 'Escape') {
        e.preventDefault();
        // Close any open modals
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.getElementById('notification-panel').classList.remove('active');
    }
});

// Performance Monitoring
function updatePerformanceMetrics() {
    const cpuUsage = document.getElementById('cpu-usage');
    const memoryUsage = document.getElementById('memory-usage');
    const networkUsage = document.getElementById('network-usage');

    // Simulate performance data (in real app, get from system APIs)
    const cpu = Math.floor(Math.random() * 30) + 20;
    const memory = Math.floor(Math.random() * 40) + 40;
    const network = Math.floor(Math.random() * 50) + 10;

    cpuUsage.style.width = cpu + '%';
    cpuUsage.nextElementSibling.textContent = cpu + '%';

    memoryUsage.style.width = memory + '%';
    memoryUsage.nextElementSibling.textContent = memory + '%';

    networkUsage.style.width = network + '%';
    networkUsage.nextElementSibling.textContent = network + '%';
}

// Enhanced Status Indicator
function updateSystemStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');

    // Check system health
    const isOnline = navigator.onLine;
    const hasErrors = document.querySelectorAll('.error').length > 0;
    const highCongestion = Object.values(trafficData).some(j => j.congestion > 4);

    if (!isOnline) {
        statusDot.className = 'status-dot error';
        statusText.textContent = 'Offline';
    } else if (hasErrors) {
        statusDot.className = 'status-dot error';
        statusText.textContent = 'System Error';
    } else if (highCongestion) {
        statusDot.className = 'status-dot warning';
        statusText.textContent = 'High Congestion';
    } else {
        statusDot.className = 'status-dot active';
        statusText.textContent = 'System Online';
    }
}

// Auto-save settings
function autoSaveSettings() {
    const settings = {
        theme: document.getElementById('theme-select').value,
        animationSpeed: document.getElementById('animation-speed').value,
        refreshInterval: document.getElementById('refresh-interval').value,
        soundAlerts: document.getElementById('sound-alerts').checked,
        visualAlerts: document.getElementById('visual-alerts').checked,
        notificationAlerts: document.getElementById('notification-alerts').checked,
        congestionThreshold: document.getElementById('congestion-threshold').value,
        dataRetention: document.getElementById('data-retention').value
    };

    localStorage.setItem('trafficSettings', JSON.stringify(settings));
}

// Load saved settings
function loadSavedSettings() {
    const settings = JSON.parse(localStorage.getItem('trafficSettings'));
    if (settings) {
        document.getElementById('theme-select').value = settings.theme || 'dark';
        document.getElementById('animation-speed').value = settings.animationSpeed || 100;
        document.getElementById('refresh-interval').value = settings.refreshInterval || 3000;
        document.getElementById('sound-alerts').checked = settings.soundAlerts !== false;
        document.getElementById('visual-alerts').checked = settings.visualAlerts !== false;
        document.getElementById('notification-alerts').checked = settings.notificationAlerts !== false;
        document.getElementById('congestion-threshold').value = settings.congestionThreshold || 4;
        document.getElementById('data-retention').value = settings.dataRetention || 30;

        applySettings();
    }
}

// Apply settings to UI
function applySettings() {
    const animationSpeed = document.getElementById('animation-speed').value;
    document.documentElement.style.setProperty('--transition', `all ${animationSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`);

    const theme = document.getElementById('theme-select').value;
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);

    refreshInterval = parseInt(document.getElementById('refresh-interval').value);
    if (monitoringActive) {
        clearInterval(window.refreshTimer);
        window.refreshTimer = setInterval(updateTrafficMonitor, refreshInterval);
    }
}

// Start the application
initializeSampleData();

// Handle window resize for charts
window.addEventListener('resize', function() {
    // Debounce chart resizing
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        if (currentTab === 'analytics') {
            resizeCharts();
        }
    }, 250);
});