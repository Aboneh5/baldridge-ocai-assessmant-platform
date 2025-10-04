@echo off
echo ============================================
echo Starting Complete Tenadam Assessment System
echo ============================================
echo.
echo This will start:
echo   1. OCAI Hub          - http://localhost:3010
echo   2. Baldrige App      - http://localhost:3000
echo   3. Backend Server    - http://localhost:5001
echo.
echo Press any key to continue or Ctrl+C to cancel
pause
echo.

:: Start OCAI Hub
echo [1/3] Starting OCAI Hub on port 3010...
start "OCAI Hub (Port 3010)" cmd /k "cd /d "%~dp0" && npm run dev"
timeout /t 2 /nobreak >nul

:: Start Baldrige Frontend
echo [2/3] Starting Baldrige App on port 3000...
start "Baldrige App (Port 3000)" cmd /k "cd /d "%~dp0Tenadam Assessment App\tenadam-assessment-app\frontend" && npm run dev"
timeout /t 2 /nobreak >nul

:: Start Backend
echo [3/3] Starting Backend Server on port 5001...
start "Backend Server (Port 5001)" cmd /k "cd /d "%~dp0Tenadam Assessment App\tenadam-assessment-app\backend" && npm run dev"

echo.
echo ============================================
echo All services are starting!
echo ============================================
echo.
echo Access your applications:
echo   - Assessment Hub: http://localhost:3010
echo   - Baldrige App:   http://localhost:3000
echo   - Backend API:    http://localhost:5001
echo.
echo Close the terminal windows to stop the services
echo ============================================
echo.
pause
