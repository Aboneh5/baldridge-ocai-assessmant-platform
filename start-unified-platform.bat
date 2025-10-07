@echo off
title Unified Assessment Hub Startup

echo.
echo 🚀 Starting Unified Assessment Hub...
echo ==================================
echo.

echo 🎯 Starting OCAI Hub (Main Platform)...
echo ======================================
echo Starting OCAI Hub on port 3010...
start "OCAI Hub" cmd /k "npm run dev"

echo.
echo ⏳ Waiting for OCAI Hub to start...
timeout /t 10 /nobreak > nul

echo.
echo 🏆 Starting Baldrige Assessment App...
echo ====================================

echo Starting Baldrige backend on port 5000...
start "Baldrige Backend" cmd /k "cd \"Tenadam Assessment App\tenadam-assessment-app\backend\" && npm run dev"

echo.
echo ⏳ Waiting for Baldrige backend to start...
timeout /t 8 /nobreak > nul

echo Starting Baldrige frontend on port 3000...
start "Baldrige Frontend" cmd /k "cd \"Tenadam Assessment App\tenadam-assessment-app\frontend\" && npm run dev"

echo.
echo 🎉 Unified Assessment Hub is starting up!
echo ========================================
echo.
echo 📍 Access Points:
echo    🏠 Main Assessment Hub: http://localhost:3010
echo    📊 OCAI Hub: http://localhost:3010
echo    🏆 Baldrige App: http://localhost:3000
echo.
echo ⏱️  Please wait 30-60 seconds for all services to fully start up
echo.
echo 🛑 To stop all services, close the command windows that opened
echo.
echo Press any key to open the main assessment hub in your browser...
pause > nul

start http://localhost:3010

echo.
echo ✅ All services are starting up!
echo You can now access the Unified Assessment Hub at http://localhost:3010
echo.
pause
