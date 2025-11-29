import { fetchDummyData } from './api.js';

export async function renderAlerts() {
  console.log('renderAlerts called');
  const alerts = document.getElementById('alerts-list');
  if (!alerts) {
    console.error('alerts-list element not found!');
    return;
  }
  alerts.innerHTML = '';
  const dummyAlerts = await fetchDummyData('dummy_alerts.json');
  dummyAlerts.forEach(a => {
    const card = document.createElement('div');
    card.className = 'alert-card animated';
    card.innerHTML = `<strong>${a.type}</strong> at <b>${a.junction}</b> <span>(${a.severity})</span> <em>${a.time}</em>`;
    alerts.appendChild(card);
  });
}
