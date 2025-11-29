# Smart Traffic Management System - Setup Guide

## Quick Start (3 Steps)

### Step 1: Install Dependencies
Open PowerShell in the project root folder and run:
```powershell
pip install -r requirements.txt
```

### Step 2: Start Backend Server
In the same PowerShell window, run:
```powershell
uvicorn api_server:app --host 0.0.0.0 --port 8000
```
Leave this terminal open. You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 3: Start Frontend Server
Open a NEW PowerShell window in the project root folder and run:
```powershell
python -m http.server 8080
```
Leave this terminal open. You should see:
```
Serving HTTP on :: port 8080 (http://[::]:8080/) ...
```

### Step 4: Open Dashboard
Open your browser and go to:
```
http://localhost:8080/frontend/index.html
```

## Troubleshooting

### Issue: "Nothing shows up on the page"
**Solution:** 
1. Open browser console (Press F12)
2. Look for any red error messages
3. Common fixes:
   - Make sure you're accessing `http://localhost:8080/frontend/index.html` (not just `index.html`)
   - Clear browser cache (Ctrl + Shift + Delete)
   - Check both terminal windows are still running

### Issue: "Module not found" error
**Solution:** 
- Make sure you're using `http://localhost:8080` not opening the file directly (`file://`)
- ES6 modules require a web server

### Issue: "Failed to fetch data"
**Solution:**
1. Check that files exist in `frontend/data/` folder:
   - dummy_traffic.json
   - dummy_alerts.json
   - dummy_weather.json
2. Make sure the frontend server is running on port 8080

### Issue: "Port already in use"
**Solution:**
```powershell
# Find process using port 8000 or 8080
netstat -ano | findstr :8000
netstat -ano | findstr :8080

# Kill the process (replace <PID> with the number from above)
taskkill /PID <PID> /F
```

## Testing the Setup

### Test 1: Check Backend API
Open browser and go to: `http://localhost:8000/docs`
You should see the FastAPI documentation page.

### Test 2: Check Frontend Server
Open browser and go to: `http://localhost:8080/frontend/test.html`
You should see a green checkmark if data loads correctly.

### Test 3: Check Console Logs
1. Open `http://localhost:8080/frontend/index.html`
2. Press F12 to open browser console
3. You should see logs like:
   ```
   Dashboard initializing...
   Successfully loaded dummy_traffic.json: [...]
   Junctions rendered
   Analytics rendered
   Dashboard fully loaded!
   ```

## What Should You See?

When everything works correctly, you should see:
- ✅ Navigation bar with links (Dashboard, Analytics, Alerts, Weather, Settings)
- ✅ Live Junctions section with 9 camera frames showing images
- ✅ Traffic data (congestion, vehicles, speed) under each camera
- ✅ Traffic Analytics section with summary cards
- ✅ Emergency Alerts section with recent alerts
- ✅ Weather Updates section with weather info
- ✅ System Settings section with dropdown options

## Project Structure
```
Smart-Traffic-Management-System/
├── frontend/
│   ├── index.html          # Main dashboard
│   ├── test.html           # Test page
│   ├── main.js             # Main JavaScript
│   ├── components/         # Modular JS components
│   │   ├── api.js
│   │   ├── junctions.js
│   │   ├── analytics.js
│   │   ├── alerts.js
│   │   ├── weather.js
│   │   └── settings.js
│   ├── styles/             # CSS files
│   │   ├── main.css
│   │   └── components.css
│   └── data/               # JSON data files
│       ├── dummy_traffic.json
│       ├── dummy_alerts.json
│       └── dummy_weather.json
├── api_server.py           # Backend FastAPI server
├── predicted0/             # Junction images (1.jpg to 9.jpg)
└── requirements.txt        # Python dependencies
```

## Features
- 🚦 Live traffic monitoring for 9 junctions
- 📊 Real-time analytics and statistics
- ⚠️ Emergency alerts system
- 🌤️ Weather integration
- ⚙️ Customizable settings
- 📱 Responsive design
- 🎨 Modern, animated UI

## Need Help?
If you still face issues:
1. Check browser console (F12) for errors
2. Check both terminal windows for error messages
3. Make sure all files are in the correct folders
4. Try refreshing the page with Ctrl + F5 (hard refresh)
