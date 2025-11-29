import { fetchDummyData } from './api.js';

export async function renderWeather() {
  console.log('renderWeather called');
  const weather = document.getElementById('weather-info');
  if (!weather) {
    console.error('weather-info element not found!');
    return;
  }
  weather.innerHTML = '';
  const dummyWeather = await fetchDummyData('dummy_weather.json');
  dummyWeather.forEach(w => {
    const card = document.createElement('div');
    card.className = 'weather-card animated';
    card.innerHTML = `<b>${w.junction}</b>: ${w.temp}, ${w.condition}, Humidity: ${w.humidity}`;
    weather.appendChild(card);
  });
}
