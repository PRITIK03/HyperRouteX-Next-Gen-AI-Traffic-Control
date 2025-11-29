# 🚦 QUICK START - 3 SIMPLE STEPS

## ✅ Step 1: Double-click `START_PROJECT.bat`
This will automatically:
- Start the backend server (port 8000)
- Start the frontend server (port 8080)
- Open your browser to the dashboard

## ✅ Step 2: Wait 5 seconds
Let the servers start up completely.

## ✅ Step 3: View Dashboard
Your browser will open automatically to:
`http://localhost:8080/frontend/index.html`

---

## 🔍 What You Should See:

### ✓ Navigation Bar
- Dashboard | Analytics | Alerts | Weather | Settings

### ✓ Live Junctions (9 camera frames with images)
- Each showing: Image, Junction Name, Congestion Level, Vehicle Count, Speed

### ✓ Traffic Analytics
- Total Vehicles
- Average Congestion
- Incidents Today
- Peak Hour

### ✓ Emergency Alerts
- Recent alerts with severity levels

### ✓ Weather Updates
- Temperature, conditions, humidity for each junction

### ✓ System Settings
- Notification level dropdown
- Theme selection
- Save button

---

## 🐛 If Nothing Shows Up:

### Option 1: Check Browser Console
1. Press **F12** on keyboard
2. Click "Console" tab
3. Look for error messages
4. Should see: "Dashboard initializing..." and "Dashboard fully loaded!"

### Option 2: Test Page
Go to: `http://localhost:8080/frontend/test.html`
- ✅ Green checkmark = Everything works
- ❌ Red X = Data loading issue

### Option 3: Manual Start
If batch file doesn't work:

**Terminal 1 (Backend):**
```powershell
uvicorn api_server:app --host 0.0.0.0 --port 8000
```

**Terminal 2 (Frontend):**
```powershell
python -m http.server 8080
```

**Browser:**
```
http://localhost:8080/frontend/index.html
```

---

## 📱 Features Working:
- ✅ Live traffic data for 9 junctions
- ✅ Camera frame images
- ✅ Real-time analytics
- ✅ Emergency alerts
- ✅ Weather information
- ✅ System settings
- ✅ Smooth animations
- ✅ Responsive design

---

## 🆘 Still Having Issues?

1. **Clear browser cache**: Ctrl + Shift + Delete
2. **Hard refresh**: Ctrl + F5
3. **Check both terminal windows are running**
4. **Make sure you're using `http://` not `file://`**
5. **Read SETUP_GUIDE.md for detailed troubleshooting**

---

## 📊 API Documentation:
Backend API docs available at: `http://localhost:8000/docs`

---

## 💡 Pro Tips:
- Keep both terminal windows open while using the dashboard
- Press F12 to see live console logs
- All data is dummy/fake data for demonstration
- Images are loaded from `predicted0/` folder
