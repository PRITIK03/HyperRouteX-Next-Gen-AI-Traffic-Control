export function renderSettings() {
  console.log('renderSettings called');
  const settings = document.getElementById('settings-panel');
  if (!settings) {
    console.error('settings-panel element not found!');
    return;
  }
  settings.innerHTML = '';
  settings.innerHTML = `
    <form class="settings-form">
      <label>Notification Level:
        <select>
          <option>All</option>
          <option>High Only</option>
          <option>None</option>
        </select>
      </label>
      <label>Theme:
        <select>
          <option>Dark</option>
          <option>Light</option>
        </select>
      </label>
      <button type="submit">Save Settings</button>
    </form>
  `;
  console.log('Settings form rendered');
}
