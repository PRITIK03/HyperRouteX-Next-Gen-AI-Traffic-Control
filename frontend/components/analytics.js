import { fetchDummyData } from './api.js';

let charts = {};

export async function renderAnalytics() {
  console.log('renderAnalytics called');
  const analytics = document.getElementById('analytics-summary');
  if (!analytics) {
    console.error('analytics-summary element not found!');
    return;
  }
  analytics.innerHTML = '';
  const junctions = await fetchDummyData('dummy_traffic.json');
  const totalVehicles = junctions.reduce((sum, j) => sum + j.vehicle_count, 0);
  const avgCongestion = (junctions.reduce((sum, j) => sum + j.congestion_level, 0) / junctions.length).toFixed(2);
  const summary = [
    { label: 'Total Vehicles', value: totalVehicles, icon: '🚗' },
    { label: 'Avg Congestion', value: avgCongestion, icon: '📊' },
    { label: 'Incidents Today', value: 3, icon: '⚠️' },
    { label: 'Peak Hour', value: '17:00-18:00', icon: '⏰' }
  ];
  summary.forEach(item => {
    const card = document.createElement('div');
    card.className = 'analytics-card animated';
    card.innerHTML = `<div class="icon">${item.icon}</div><h4>${item.label}</h4><p class="value">${item.value}</p>`;
    analytics.appendChild(card);
  });
  
  renderCharts(junctions);
  startRealTimeUpdates();
}

function startRealTimeUpdates() {
  setInterval(async () => {
    const junctions = await fetchDummyData('dummy_traffic.json');
    updateCharts(junctions);
  }, 5000);
}

function renderCharts(junctions) {
  const chartsContainer = document.getElementById('analytics-charts');
  if (!chartsContainer) return;
  
  chartsContainer.innerHTML = `
    <div class="charts-grid">
      <div class="chart-container">
        <h3>📊 Congestion by Junction</h3>
        <canvas id="congestionChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>🚗 Vehicle Count Trend</h3>
        <canvas id="vehicleChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>⚡ Speed Distribution</h3>
        <canvas id="speedChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>📈 Traffic Status</h3>
        <canvas id="statusChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>⏰ Peak Hour Analysis</h3>
        <canvas id="peakHourChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>⌛ Average Wait Time</h3>
        <canvas id="waitTimeChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>🎯 System Efficiency</h3>
        <canvas id="efficiencyChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>🌍 CO₂ Emissions Estimate</h3>
        <canvas id="emissionsChart"></canvas>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    createCongestionChart(junctions);
    createVehicleChart(junctions);
    createSpeedChart(junctions);
    createStatusChart(junctions);
    createPeakHourChart(junctions);
    createWaitTimeChart(junctions);
    createEfficiencyChart(junctions);
    createEmissionsChart(junctions);
  }, 100);
}

function updateCharts(junctions) {
  if (charts.congestion) {
    charts.congestion.data.datasets[0].data = junctions.map(j => j.congestion_level);
    charts.congestion.update('none');
  }
  if (charts.vehicle) {
    charts.vehicle.data.datasets[0].data = junctions.map(j => j.vehicle_count);
    charts.vehicle.update('none');
  }
  if (charts.speed) {
    charts.speed.data.datasets[0].data = junctions.map(j => j.avg_speed);
    charts.speed.update('none');
  }
}

function createCongestionChart(junctions) {
  const ctx = document.getElementById('congestionChart');
  if (!ctx) return;
  
  if (charts.congestion) charts.congestion.destroy();
  
  charts.congestion = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: junctions.map(j => j.name.split(',')[0]),
      datasets: [{
        label: 'Congestion Level',
        data: junctions.map(j => j.congestion_level),
        backgroundColor: 'rgba(0, 212, 255, 0.6)',
        borderColor: 'rgba(0, 212, 255, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, max: 5 }
      }
    }
  });
}

function createVehicleChart(junctions) {
  const ctx = document.getElementById('vehicleChart');
  if (!ctx) return;
  
  if (charts.vehicle) charts.vehicle.destroy();
  
  charts.vehicle = new Chart(ctx, {
    type: 'line',
    data: {
      labels: junctions.map(j => j.name.split(',')[0]),
      datasets: [{
        label: 'Vehicle Count',
        data: junctions.map(j => j.vehicle_count),
        backgroundColor: 'rgba(255, 110, 127, 0.2)',
        borderColor: 'rgba(255, 110, 127, 1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function createSpeedChart(junctions) {
  const ctx = document.getElementById('speedChart');
  if (!ctx) return;
  
  if (charts.speed) charts.speed.destroy();
  
  charts.speed = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: junctions.map(j => j.name.split(',')[0]),
      datasets: [{
        label: 'Avg Speed (km/h)',
        data: junctions.map(j => j.avg_speed),
        backgroundColor: 'rgba(50, 255, 126, 0.6)',
        borderColor: 'rgba(50, 255, 126, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function createStatusChart(junctions) {
  const ctx = document.getElementById('statusChart');
  if (!ctx) return;
  
  if (charts.status) charts.status.destroy();
  
  const low = junctions.filter(j => j.congestion_level < 2).length;
  const medium = junctions.filter(j => j.congestion_level >= 2 && j.congestion_level < 3.5).length;
  const high = junctions.filter(j => j.congestion_level >= 3.5).length;
  
  charts.status = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Low Traffic', 'Medium Traffic', 'High Traffic'],
      datasets: [{
        data: [low, medium, high],
        backgroundColor: [
          'rgba(50, 255, 126, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgba(50, 255, 126, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#fff' }
        }
      }
    }
  });
}

function createPeakHourChart(junctions) {
  const ctx = document.getElementById('peakHourChart');
  if (!ctx) return;
  
  if (charts.peakHour) charts.peakHour.destroy();
  
  const hours = ['6-9 AM', '9-12 PM', '12-3 PM', '3-6 PM', '6-9 PM', '9-12 AM'];
  const trafficData = [45, 60, 70, 90, 85, 50];
  
  charts.peakHour = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: 'Average Traffic Volume',
        data: trafficData,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, labels: { color: '#fff' } }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#aaa' } },
        x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#aaa' } }
      }
    }
  });
}

function createWaitTimeChart(junctions) {
  const ctx = document.getElementById('waitTimeChart');
  if (!ctx) return;
  
  if (charts.waitTime) charts.waitTime.destroy();
  
  const waitTimes = junctions.map(j => Math.floor(j.congestion_level * 15 + Math.random() * 10));
  
  charts.waitTime = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: junctions.map(j => j.name.split(',')[0]),
      datasets: [{
        label: 'Wait Time (seconds)',
        data: waitTimes,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#aaa' } },
        x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#aaa' } }
      }
    }
  });
}

function createEfficiencyChart(junctions) {
  const ctx = document.getElementById('efficiencyChart');
  if (!ctx) return;
  
  if (charts.efficiency) charts.efficiency.destroy();
  
  const efficiency = junctions.map(j => Math.max(30, 100 - j.congestion_level * 15));
  
  charts.efficiency = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: junctions.map(j => j.name.split(',')[0]),
      datasets: [{
        label: 'Efficiency %',
        data: efficiency,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, labels: { color: '#fff' } }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { color: '#aaa', backdropColor: 'transparent' },
          grid: { color: 'rgba(255,255,255,0.2)' },
          pointLabels: { color: '#fff' }
        }
      }
    }
  });
}

function createEmissionsChart(junctions) {
  const ctx = document.getElementById('emissionsChart');
  if (!ctx) return;
  
  if (charts.emissions) charts.emissions.destroy();
  
  const emissions = junctions.map(j => (j.vehicle_count * j.congestion_level * 0.5).toFixed(1));
  
  charts.emissions = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: junctions.map(j => j.name.split(',')[0]),
      datasets: [{
        label: 'CO₂ (kg/hour)',
        data: emissions,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, labels: { color: '#fff' } }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#aaa' } },
        x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#aaa' } }
      }
    }
  });
}
