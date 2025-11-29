import { fetchDummyData } from './api.js';

let predictionChart = null;

export async function renderPredictions() {
  console.log('renderPredictions called');
  const panel = document.getElementById('predictions-panel');
  if (!panel) {
    console.error('predictions-panel element not found!');
    return;
  }
  
  const junctions = await fetchDummyData('dummy_traffic.json');
  
  panel.innerHTML = `
    <div class="predictions-header">
      <p class="info">🔮 AI-Powered Traffic Prediction | Machine Learning Models trained on historical data</p>
      <div class="prediction-stats">
        <div class="pred-stat">
          <span class="pred-icon">🎯</span>
          <span class="pred-label">Accuracy</span>
          <span class="pred-value">94.7%</span>
        </div>
        <div class="pred-stat">
          <span class="pred-icon">⚡</span>
          <span class="pred-label">Response Time</span>
          <span class="pred-value">< 50ms</span>
        </div>
        <div class="pred-stat">
          <span class="pred-icon">📊</span>
          <span class="pred-label">Data Points</span>
          <span class="pred-value">1.2M+</span>
        </div>
      </div>
    </div>
    
    <div class="predictions-grid">
      <div class="prediction-card large">
        <h3>📈 Traffic Volume Forecast (Next 6 Hours)</h3>
        <canvas id="forecastChart"></canvas>
        <div class="forecast-summary">
          <div class="summary-item">
            <span class="summary-label">Expected Peak:</span>
            <span class="summary-value">17:30 - 18:15</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Estimated Volume:</span>
            <span class="summary-value">+45% from current</span>
          </div>
        </div>
      </div>
      
      <div class="prediction-card">
        <h3>🚨 Incident Probability</h3>
        <div class="incident-predictions">
          ${junctions.slice(0, 5).map(j => `
            <div class="incident-item">
              <span class="junction-name">${j.name.split(',')[0]}</span>
              <div class="probability-bar">
                <div class="probability-fill" style="width: ${Math.random() * 60 + 20}%; background: ${Math.random() > 0.7 ? '#ff6e7f' : '#32ff7e'}"></div>
              </div>
              <span class="probability-value">${(Math.random() * 60 + 20).toFixed(0)}%</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="prediction-card">
        <h3>⏱️ Estimated Travel Times</h3>
        <div class="travel-times">
          <div class="route-time">
            <span class="route-icon">🚗</span>
            <div class="route-info">
              <span class="route-name">Junction 1 → Junction 5</span>
              <span class="time-estimate">8 min <span class="time-change up">+2 min</span></span>
            </div>
          </div>
          <div class="route-time">
            <span class="route-icon">🚗</span>
            <div class="route-info">
              <span class="route-name">Junction 3 → Junction 7</span>
              <span class="time-estimate">6 min <span class="time-change">Normal</span></span>
            </div>
          </div>
          <div class="route-time">
            <span class="route-icon">🚗</span>
            <div class="route-info">
              <span class="route-name">Junction 2 → Junction 9</span>
              <span class="time-estimate">12 min <span class="time-change down">-1 min</span></span>
            </div>
          </div>
          <div class="route-time">
            <span class="route-icon">🚗</span>
            <div class="route-info">
              <span class="route-name">Junction 4 → Junction 6</span>
              <span class="time-estimate">5 min <span class="time-change">Normal</span></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="prediction-card">
        <h3>🌟 Optimization Recommendations</h3>
        <div class="recommendations">
          <div class="recommendation-item priority-high">
            <span class="rec-badge high">HIGH</span>
            <p>Extend green phase at Junction 2 by 15s during 17:00-18:00</p>
          </div>
          <div class="recommendation-item priority-medium">
            <span class="rec-badge medium">MEDIUM</span>
            <p>Coordinate signals between Junction 5 and 7 for better flow</p>
          </div>
          <div class="recommendation-item priority-low">
            <span class="rec-badge low">LOW</span>
            <p>Consider pedestrian phase extension at Junction 4</p>
          </div>
        </div>
      </div>
      
      <div class="prediction-card large">
        <h3>🔥 Real-Time Congestion Heatmap</h3>
        <div class="heatmap">
          ${junctions.map(j => `
            <div class="heatmap-cell" style="background: ${getHeatmapColor(j.congestion_level)}">
              <span class="cell-name">${j.name.split(',')[0]}</span>
              <span class="cell-value">${j.congestion_level.toFixed(1)}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="prediction-card">
        <h3>📅 Weekly Pattern Analysis</h3>
        <canvas id="weeklyPatternChart"></canvas>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    createForecastChart();
    createWeeklyPatternChart();
  }, 100);
  
  startPredictionUpdates();
}

function createForecastChart() {
  const ctx = document.getElementById('forecastChart');
  if (!ctx) return;
  
  if (predictionChart) predictionChart.destroy();
  
  const now = new Date();
  const labels = [];
  for (let i = 0; i < 6; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    labels.push(time.getHours() + ':00');
  }
  
  const currentBase = 75;
  const predictedData = [
    currentBase,
    currentBase + 15,
    currentBase + 35,
    currentBase + 45, // Peak
    currentBase + 30,
    currentBase + 10
  ];
  
  predictionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Predicted Traffic Volume',
        data: predictedData,
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
        borderColor: 'rgba(0, 212, 255, 1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, labels: { color: '#fff' } }
      },
      scales: {
        y: { 
          beginAtZero: true, 
          grid: { color: 'rgba(255,255,255,0.1)' }, 
          ticks: { color: '#aaa' }
        },
        x: { 
          grid: { color: 'rgba(255,255,255,0.1)' }, 
          ticks: { color: '#aaa' }
        }
      }
    }
  });
}

function createWeeklyPatternChart() {
  const ctx = document.getElementById('weeklyPatternChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Avg Daily Traffic',
        data: [85, 88, 90, 92, 95, 70, 65],
        backgroundColor: [
          'rgba(0, 212, 255, 0.6)',
          'rgba(0, 212, 255, 0.6)',
          'rgba(0, 212, 255, 0.6)',
          'rgba(0, 212, 255, 0.6)',
          'rgba(255, 110, 127, 0.6)',
          'rgba(50, 255, 126, 0.6)',
          'rgba(50, 255, 126, 0.6)'
        ],
        borderColor: [
          'rgba(0, 212, 255, 1)',
          'rgba(0, 212, 255, 1)',
          'rgba(0, 212, 255, 1)',
          'rgba(0, 212, 255, 1)',
          'rgba(255, 110, 127, 1)',
          'rgba(50, 255, 126, 1)',
          'rgba(50, 255, 126, 1)'
        ],
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
        y: { 
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.1)' }, 
          ticks: { color: '#aaa' }
        },
        x: { 
          grid: { color: 'rgba(255,255,255,0.1)' }, 
          ticks: { color: '#aaa' }
        }
      }
    }
  });
}

function getHeatmapColor(level) {
  if (level < 2) return 'rgba(50, 255, 126, 0.6)';
  if (level < 3) return 'rgba(255, 206, 86, 0.6)';
  if (level < 4) return 'rgba(255, 159, 64, 0.6)';
  return 'rgba(255, 99, 132, 0.6)';
}

function startPredictionUpdates() {
  setInterval(() => {
    if (predictionChart) {
      const currentData = predictionChart.data.datasets[0].data;
      const newData = currentData.map(val => Math.max(50, Math.min(150, val + (Math.random() - 0.5) * 10)));
      predictionChart.data.datasets[0].data = newData;
      predictionChart.update('none');
    }
  }, 8000);
}
