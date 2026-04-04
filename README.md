# Smart Traffic Management System

## 🚦 Project Introduction
A next-generation AI-powered platform for real-time traffic monitoring, prediction, and control. Designed for smart cities, it integrates live data, advanced analytics, and automated signal management to reduce congestion and improve emergency response.

---

## 🏗️ System Architecture
```
Traffic Data Sources (Sensors, Cameras, IoT)
				↓
Backend (FastAPI, Python)
				↓
Real-Time Prediction & Analytics (AI/ML)
				↓
Frontend (Web: Vanilla JS, Desktop: CustomTkinter)
				↓
User Interfaces (Admin Dashboard, Citizen Portal)
				↓
Signal Control & Alerts
```
- **Backend:** `api_server.py` (REST API, real-time simulation)
- **Web Frontend:** `index.html`, `frontend/components/`
- **Desktop App:** `modern_main.py` (CustomTkinter)
- **Data:** `predicted0/` (images), `output0.csv`, `output5.csv`, `frontend/data/` (mock JSON)

---

## ✨ Features
- Live traffic monitoring (9 junctions)
- AI-powered congestion prediction
- Emergency vehicle priority routing
- Dynamic traffic signal control
- Real-time analytics dashboard
- Incident detection & alert system
- Citizen portal for reporting issues
- Admin dashboard for control & analytics
- Export data (CSV, PDF, JSON)
- Responsive UI (web & desktop)

---

## 🚀 Instructions to Run

### Backend (API Server)
```powershell
pip install -r requirements.txt
uvicorn api_server:app --host 0.0.0.0 --port 8000
```
- Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Web Frontend
- Open `index.html` in your browser
- Connects to backend at `http://localhost:8000`

### Desktop App
```powershell
python modern_main.py
```
- Requires: CustomTkinter, pandas, matplotlib

---

## 🖼️ Screenshots
- ![Junction Camera 1](predicted0/1.jpg)
- ![Junction Camera 2](predicted0/2.jpg)
- ![Junction Camera 3](predicted0/3.jpg)

---

## 🤖 AI/ML Model Description
- Uses scikit-learn and TensorFlow for traffic prediction
- Models trained on historical congestion, weather, and incident data
- Features: vehicle count, avg speed, weather impact, time of day
- Real-time inference for congestion and emergency routing

---

## 📊 Dataset Explanation
- **Traffic Data:**  
	- `frontend/data/dummy_traffic.json`: 9 junctions, congestion, vehicle count, speed
- **Alerts:**  
	- `frontend/data/dummy_alerts.json`: Sample incidents (accident, congestion, roadwork)
- **Weather:**  
	- `frontend/data/dummy_weather.json`: Junction-wise weather conditions
- **Images:**  
	- `predicted0/`: Camera snapshots for each junction
- **CSV:**  
	- `output0.csv`, `output5.csv`: Congestion data for analytics

---

## 🏙️ Live Junctions
1. Big Ben, London
2. Times Square, NYC
3. Central Park, NYC
4. Union Station, DC
5. City Hall, Chicago
6. Airport Terminal, LA
7. Harbor View, Miami
8. Grand Mall, Dallas
9. Stadium Plaza, Denver

---

## 💡 Use Cases
- Real-time city traffic monitoring
- Emergency vehicle green corridor creation
- Citizen issue reporting (accidents, potholes)
- Dynamic signal adjustment during congestion
- Analytics for city planners and police
- Incident alerting and response coordination

---

## 🚀 Future Enhancements
- Real backend integration for all forms
- Database for persistent storage
- WebSocket for live updates
- Mobile app (iOS/Android)
- Advanced AI models (deep learning, reinforcement)
- GPS-based routing and map integration
- Automated incident detection from camera feeds
- Email/SMS notifications for critical alerts

---

> For more details, see `QUICK_START.md`, `USER_FACING_FEATURES.md`, and `EMERGENCY_VEHICLE_SYSTEM.md`.
