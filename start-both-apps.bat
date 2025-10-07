@echo off
echo ====================================
echo Starting Tenadam Assessment System
echo ====================================
echo.
echo Starting OCAI Hub on http://localhost:3010
echo Starting Baldrige App on http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo ====================================
echo.

:: Start OCAI Hub in the background
start "OCAI Hub (Port 3010)" cmd /k "cd /d "%~dp0" && npm run dev"

:: Wait a bit before starting the second app
timeout /t 2 /nobreak >nul

:: Start Baldrige App in a new window
start "Baldrige App (Port 3000)" cmd /k "cd /d "%~dp0Tenadam Assessment App\tenadam-assessment-app\frontend" && npm run dev"

echo.
echo Both applications are starting...
echo.
echo OCAI Hub: http://localhost:3010
echo Baldrige App: http://localhost:3000
echo.
pause
