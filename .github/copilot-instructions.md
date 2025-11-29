# Smart Traffic Management System - AI Coding Guidelines

## Architecture Overview

This is a multi-platform traffic management system with three main components:

### Backend (FastAPI)
- **File**: `api_server.py`
- **Purpose**: REST API server with real-time traffic simulation
- **Key Features**:
  - In-memory data storage (traffic, predictions, alerts)
  - Background threads for data updates (30s intervals)
  - OpenWeatherMap integration (falls back to mock data)
  - CORS enabled for frontend communication
  - Endpoints: `/traffic`, `/predictions`, `/emergency`, `/analytics`, `/weather`

### Web Frontend (Vanilla JS)
- **Files**: `index.html`, `script.js`, `styles.css`, `frontend/` directory
- **Structure**: Tabbed interface with modular components
- **Components**: Located in `frontend/components/` (e.g., `trafficMap.js`, `signalControl.js`)
- **Data Flow**: Fetches from backend API, displays junction images from `predicted0/`
- **Charts**: Uses Chart.js for analytics visualizations

### Desktop App (CustomTkinter)
- **File**: `modern_main.py`
- **Purpose**: Standalone GUI application with similar features
- **Modules**: Imports `ModernTrafficMonitor`, `AnalyticsWindow`, etc.
- **UI**: Dark theme with animations, tabbed interface
- **Data**: Reads CSV files (`output0.csv`, `output5.csv`) for traffic data

## Critical Workflows

### Running the System
1. **Backend**: `uvicorn api_server:app --host 0.0.0.0 --port 8000`
2. **Web Frontend**: Open `index.html` in browser (serves static files)
3. **Desktop App**: `python modern_main.py` (requires CustomTkinter)

### Development Setup
- Install dependencies: `pip install -r requirements.txt`
- Backend runs on port 8000, docs at `/docs`                                                                                                                                                                                                                                                            
- Frontend connects to `http://localhost:8000` for API calls
- No build process required - direct Python execution

### Data Sources
- **Traffic Images**: `predicted0/` folder (9 junction images)
- **CSV Data**: `output0.csv`, `output5.csv` (congestion data)
- **Mock Data**: Extensive dummy data in `frontend/data/` (alerts, traffic, weather)
- **Weather API**: OpenWeatherMap (requires `OPENWEATHER_API_KEY` env var)

## Project Conventions

### Code Organization
- **Backend**: Single file `api_server.py` with all endpoints
- **Frontend**: Modular JS files in `frontend/components/`
- **Styling**: Centralized in `styles.css` and `frontend/styles/components.css`
- **Data**: JSON files in `frontend/data/` for mock data

### Naming Patterns
- **Files**: snake_case for Python, camelCase for JS
- **APIs**: RESTful endpoints with JSON responses
- **Components**: PascalCase class names (e.g., `TrafficMap`, `SignalControl`)
- **IDs**: kebab-case for HTML elements (e.g., `traffic-monitor`)

### Data Structures
- **Traffic Data**: `{junction_id, congestion_level, vehicle_count, avg_speed, timestamp}`
- **Predictions**: `{predicted_congestion, confidence, recommendations, factors}`
- **Alerts**: `{alert_type, junction_id, severity, description, status}`
- **Weather**: `{condition, temperature, humidity, visibility, wind_speed, impact_on_traffic}`

### Error Handling
- Backend: Returns HTTP 404 for missing junctions
- Frontend: Graceful fallbacks for API failures
- Weather: Automatic fallback to mock data if API unavailable

## Integration Patterns

### Frontend-Backend Communication
- **Method**: REST API calls using `fetch()`
- **Base URL**: `http://localhost:8000` (configurable)
- **Error Handling**: Check `response.ok`, display user-friendly messages
- **Data Updates**: Auto-refresh every 3-5 seconds for live data

### Component Initialization
- **Pattern**: Each JS component exports an `init()` function
- **Example**: `TrafficMap.init()`, `SignalControl.init()`
- **Dependencies**: Components may depend on each other (e.g., analytics needs traffic data)

### State Management
- **Backend**: In-memory dictionaries (not persistent)
- **Frontend**: DOM manipulation with data attributes
- **Desktop**: Class instance variables with threading

## Common Patterns

### UI Updates
- **Real-time**: Use `setInterval()` for periodic updates
- **Event-driven**: Click handlers for user interactions
- **Animations**: CSS transitions for smooth state changes

### Data Processing
- **CSV Reading**: Use pandas for data analysis
- **JSON Storage**: Serialize/deserialize for persistence
- **Mock Data**: Extensive use of dummy data for development

### Emergency Handling
- **Priority Routes**: Special handling for emergency vehicles
- **Alert System**: Background tasks for response coordination
- **Status Tracking**: Active/resolved states with timestamps

## Key Files to Reference

- `api_server.py`: Complete backend implementation
- `frontend/components/api.js`: Frontend API communication layer
- `frontend/components/trafficMap.js`: Main traffic visualization
- `requirements.txt`: All Python dependencies
- `QUICK_START.md`: Feature overview and testing guide
- `frontend/data/dummy_traffic.json`: Sample data structure

## Development Tips

- Start backend first, then open frontend
- Use browser dev tools for frontend debugging
- Check console logs for both backend and frontend
- Mock data enables offline development
- Junction IDs: 1-9, each with specific locations (Big Ben, Times Square, etc.)
- Weather impacts traffic calculations (rain/snow increase congestion)

## Testing Approach

- **Manual Testing**: Interact with web interface, check API responses
- **Data Validation**: Verify CSV/JSON data formats
- **Integration**: Test frontend-backend communication
- **Edge Cases**: Handle missing data, API failures, invalid inputs

## Deployment Considerations

- **Environment Variables**: `OPENWEATHER_API_KEY` for weather
- **Ports**: Backend on 8000, frontend static hosting
- **Dependencies**: All listed in `requirements.txt`
- **Data Persistence**: Currently in-memory (add database for production)