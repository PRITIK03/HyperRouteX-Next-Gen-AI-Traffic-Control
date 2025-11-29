from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
import json
import time
from datetime import datetime
import random
import threading
import schedule
import requests
import os

app = FastAPI(title="Smart Traffic Management API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class TrafficData(BaseModel):
    junction_id: int
    congestion_level: float
    vehicle_count: int
    avg_speed: float
    timestamp: Optional[str] = None

class PredictionRequest(BaseModel):
    junction_id: int
    timeframe_minutes: int = 30

class EmergencyAlert(BaseModel):
    alert_type: str
    junction_id: int
    severity: str
    description: str

# In-memory data storage (in production, use database)
traffic_data = {}
predictions = {}
emergency_alerts = []

# Background tasks
def update_traffic_data():
    """Simulate real-time traffic data updates"""
    while True:
        for junction_id in range(1, 10):
            traffic_data[junction_id] = {
                "congestion_level": round(random.uniform(1.0, 5.0), 1),
                "vehicle_count": random.randint(10, 100),
                "avg_speed": round(random.uniform(20, 60), 1),
                "timestamp": datetime.now().isoformat(),
                "weather_impact": round(random.uniform(0.1, 0.5), 2)
            }
        time.sleep(30)  # Update every 30 seconds

def run_predictions():
    """Run AI predictions periodically"""
    for junction_id in range(1, 10):
        predictions[junction_id] = {
            "predicted_congestion": round(random.uniform(1.0, 5.0), 1),
            "confidence": round(random.uniform(0.85, 0.98), 3),
            "timestamp": datetime.now().isoformat(),
            "factors": ["weather", "time_of_day", "historical_data"]
        }

traffic_thread = threading.Thread(target=update_traffic_data, daemon=True)
traffic_thread.start()

# API Endpoints

@app.get("/")
async def root():
    return {"message": "Smart Traffic Management API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/traffic/{junction_id}")
async def get_traffic_data(junction_id: int):
    if junction_id not in traffic_data:
        raise HTTPException(status_code=404, detail="Junction not found")
    return traffic_data[junction_id]

@app.get("/traffic")
async def get_all_traffic_data():
    return {"data": traffic_data, "total_junctions": len(traffic_data)}

@app.post("/traffic")
async def update_traffic_data(data: TrafficData):
    junction_id = data.junction_id
    traffic_data[junction_id] = {
        "congestion_level": data.congestion_level,
        "vehicle_count": data.vehicle_count,
        "avg_speed": data.avg_speed,
        "timestamp": data.timestamp or datetime.now().isoformat()
    }
    return {"message": f"Traffic data updated for junction {junction_id}"}

@app.get("/predictions/{junction_id}")
async def get_predictions(junction_id: int):
    if junction_id not in predictions:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return predictions[junction_id]

@app.post("/predictions")
async def request_prediction(request: PredictionRequest):
    # Simulate AI prediction
    prediction = {
        "junction_id": request.junction_id,
        "timeframe_minutes": request.timeframe_minutes,
        "predicted_congestion": round(random.uniform(1.0, 5.0), 1),
        "confidence": round(random.uniform(0.85, 0.98), 3),
        "recommendations": [
            "Extend green light by 5 seconds",
            "Monitor for next 15 minutes",
            "Consider alternative routes"
        ],
        "timestamp": datetime.now().isoformat()
    }
    return prediction

@app.post("/emergency")
async def create_emergency_alert(alert: EmergencyAlert, background_tasks: BackgroundTasks):
    alert_data = {
        "id": len(emergency_alerts) + 1,
        "alert_type": alert.alert_type,
        "junction_id": alert.junction_id,
        "severity": alert.severity,
        "description": alert.description,
        "timestamp": datetime.now().isoformat(),
        "status": "active"
    }

    emergency_alerts.append(alert_data)

    # Background task to handle emergency response
    background_tasks.add_task(handle_emergency_response, alert_data)

    return {"message": "Emergency alert created", "alert_id": alert_data["id"]}

@app.get("/emergency")
async def get_emergency_alerts():
    return {"alerts": emergency_alerts, "active_count": len([a for a in emergency_alerts if a["status"] == "active"])}

@app.put("/emergency/{alert_id}/resolve")
async def resolve_emergency_alert(alert_id: int):
    for alert in emergency_alerts:
        if alert["id"] == alert_id:
            alert["status"] = "resolved"
            alert["resolved_at"] = datetime.now().isoformat()
            return {"message": f"Emergency alert {alert_id} resolved"}
    raise HTTPException(status_code=404, detail="Alert not found")

@app.get("/analytics/summary")
async def get_analytics_summary():
    total_junctions = len(traffic_data)
    avg_congestion = sum([data["congestion_level"] for data in traffic_data.values()]) / total_junctions if total_junctions > 0 else 0

    return {
        "total_junctions": total_junctions,
        "average_congestion": round(avg_congestion, 2),
        "active_alerts": len([a for a in emergency_alerts if a["status"] == "active"]),
        "system_status": "operational",
        "last_updated": datetime.now().isoformat()
    }

@app.get("/weather")
async def get_weather_data():
    """Get real-time weather data for traffic prediction"""
    try:
        # Using OpenWeatherMap API (free tier)
        # In production, use environment variable for API key
        api_key = os.getenv("OPENWEATHER_API_KEY", "demo_key")  # Replace with actual API key

        # Default coordinates for demonstration (can be made configurable)
        lat, lon = 40.7128, -74.0060  # New York City coordinates

        if api_key == "demo_key":
            # Fallback to mock data if no API key
            weather_conditions = ["Sunny", "Cloudy", "Rainy", "Foggy", "Partly Cloudy"]
            return {
                "condition": random.choice(weather_conditions),
                "temperature": round(random.uniform(15, 35), 1),
                "humidity": random.randint(40, 90),
                "visibility": round(random.uniform(5, 20), 1),
                "wind_speed": round(random.uniform(0, 15), 1),
                "impact_on_traffic": round(random.uniform(0.1, 0.8), 2),
                "source": "mock",
                "last_updated": datetime.now().isoformat()
            }

        # Real API call
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"

        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()

        # Calculate traffic impact based on weather conditions
        condition = data["weather"][0]["main"].lower()
        traffic_impact = 0.1  # Default low impact

        if "rain" in condition:
            traffic_impact = 0.6
        elif "snow" in condition:
            traffic_impact = 0.8
        elif "fog" in condition or "mist" in condition:
            traffic_impact = 0.7
        elif "storm" in condition or "thunderstorm" in condition:
            traffic_impact = 0.9

        return {
            "condition": data["weather"][0]["main"],
            "description": data["weather"][0]["description"],
            "temperature": round(data["main"]["temp"], 1),
            "humidity": data["main"]["humidity"],
            "visibility": round(data.get("visibility", 10000) / 1000, 1),  # Convert to km
            "wind_speed": round(data["wind"]["speed"], 1),
            "impact_on_traffic": traffic_impact,
            "source": "openweathermap",
            "location": data["name"],
            "last_updated": datetime.now().isoformat()
        }

    except Exception as e:
        # Fallback to mock data on error
        weather_conditions = ["Sunny", "Cloudy", "Rainy", "Foggy", "Partly Cloudy"]
        return {
            "condition": random.choice(weather_conditions),
            "temperature": round(random.uniform(15, 35), 1),
            "humidity": random.randint(40, 90),
            "visibility": round(random.uniform(5, 20), 1),
            "wind_speed": round(random.uniform(0, 15), 1),
            "impact_on_traffic": round(random.uniform(0.1, 0.8), 2),
            "source": "fallback",
            "error": str(e),
            "last_updated": datetime.now().isoformat()
        }

# Background task handler
def handle_emergency_response(alert_data: dict):
    """Handle emergency response in background"""
    print(f"🚨 Processing emergency alert: {alert_data}")

    # Simulate emergency response actions
    time.sleep(2)  # Simulate processing time

    # In a real system, this would:
    # - Notify emergency services
    # - Adjust traffic signals
    # - Send alerts to nearby vehicles
    # - Update navigation systems

    print(f"✅ Emergency response completed for alert {alert_data['id']}")

if __name__ == "__main__":
    print("🚀 Starting Smart Traffic Management API...")
    print("📡 API will be available at: http://localhost:8000")
    print("📚 Documentation at: http://localhost:8000/docs")

    uvicorn.run(app, host="0.0.0.0", port=8000)