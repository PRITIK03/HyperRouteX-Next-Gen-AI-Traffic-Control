@echo off
echo ====================================
echo Smart Traffic Management System
echo Starting Backend and Frontend...
echo ====================================
echo.

REM Start backend in a new window
start "Backend API Server" cmd /k "uvicorn api_server:app --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
start "Frontend Server" cmd /k "python -m http.server 8080"
timeout /t 2 /nobreak > nul

REM Open browser
echo.
echo Opening dashboard in browser...
timeout /t 2 /nobreak > nul
start http://localhost:8080/frontend/index.html

echo.
echo ====================================
echo Dashboard is now running!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:8080/frontend/index.html
echo API Docs: http://localhost:8000/docs
echo ====================================
echo.
echo Press any key to close this window (servers will keep running)
pause > nul
