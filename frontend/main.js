import { renderJunctions } from './components/junctions.js';
import { renderAnalytics } from './components/analytics.js';
import { renderAlerts } from './components/alerts.js';
import { renderWeather } from './components/weather.js';
import { renderSettings } from './components/settings.js';
import { renderSignalControl } from './components/signalControl.js';
import { renderTrafficMap } from './components/trafficMap.js';
import { renderPredictions } from './components/predictions.js';
import { initCitizenPortal } from './components/citizenPortal.js';
import { initAdminDashboard } from './components/adminDashboard.js';
import { initLiveIncidentFeed } from './components/liveIncidentFeed.js';
import { initFeedback } from './components/feedback.js';

window.addEventListener('DOMContentLoaded', async () => {
  console.log('Dashboard initializing...');
  try {
    await renderJunctions();
    console.log('Junctions rendered');
    await renderSignalControl();
    console.log('Signal Control rendered');
    await renderAnalytics();
    console.log('Analytics rendered');
    await renderPredictions();
    console.log('Predictions rendered');
    initCitizenPortal();
    console.log('Citizen Portal initialized');
    initAdminDashboard();
    console.log('Admin Dashboard initialized');
    initLiveIncidentFeed();
    console.log('Live Incident Feed initialized');
    initFeedback();
    console.log('Feedback module initialized');
    renderTrafficMap();
    console.log('Traffic Map rendered');
    await renderAlerts();
    console.log('Alerts rendered');
    await renderWeather();
    console.log('Weather rendered');
    renderSettings();
    console.log('Settings rendered');
    console.log('Dashboard fully loaded!');
  } catch (error) {
    console.error('Error initializing dashboard:', error);
  }
});