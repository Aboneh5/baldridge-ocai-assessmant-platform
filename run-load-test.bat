@echo off
REM Quick Load Test Script for Tenadam Assessment Platform

echo =========================================
echo Tenadam Assessment Load Test
echo =========================================
echo.

REM Check if locust is installed
python -m pip show locust >nul 2>&1
if errorlevel 1 (
    echo Locust is not installed. Installing now...
    python -m pip install -r load-test-requirements.txt
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install Locust
        echo Please run: pip install locust
        pause
        exit /b 1
    )
    echo Locust installed successfully!
    echo.
)

echo Select test type:
echo 1. Web UI (recommended for first time)
echo 2. Light Test (50 users, 2 min)
echo 3. Medium Test (200 users, 5 min)
echo 4. Heavy Test (500 users, 10 min)
echo 5. Quick Spike Test (1000 users, 2 min)
echo 6. Anonymous Users Only
echo 7. Custom
echo.

set /p choice="Enter your choice (1-7): "

set HOST=https://hub.tenadamconsulting.com

if "%choice%"=="1" (
    echo.
    echo Starting Locust Web UI...
    echo Open http://localhost:8089 in your browser
    echo.
    locust -f locustfile.py --host=%HOST%
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Running Light Load Test...
    echo 50 users, spawn rate 5/sec, 2 minutes
    echo.
    locust -f locustfile.py --host=%HOST% --headless --users 50 --spawn-rate 5 --run-time 2m --html=report-light.html
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Running Medium Load Test...
    echo 200 users, spawn rate 10/sec, 5 minutes
    echo.
    locust -f locustfile.py --host=%HOST% --headless --users 200 --spawn-rate 10 --run-time 5m --html=report-medium.html
    goto end
)

if "%choice%"=="4" (
    echo.
    echo Running Heavy Load Test...
    echo 500 users, spawn rate 20/sec, 10 minutes
    echo WARNING: This will generate significant load!
    echo.
    set /p confirm="Are you sure? (y/n): "
    if /i not "%confirm%"=="y" goto end
    locust -f locustfile.py --host=%HOST% --headless --users 500 --spawn-rate 20 --run-time 10m --html=report-heavy.html
    goto end
)

if "%choice%"=="5" (
    echo.
    echo Running Spike Test...
    echo 1000 users, spawn rate 100/sec, 2 minutes
    echo WARNING: This is a stress test!
    echo.
    set /p confirm="Are you sure? (y/n): "
    if /i not "%confirm%"=="y" goto end
    locust -f locustfile.py --host=%HOST% --headless --users 1000 --spawn-rate 100 --run-time 2m --html=report-spike.html
    goto end
)

if "%choice%"=="6" (
    echo.
    echo Testing Anonymous Users Only...
    echo 100 users, spawn rate 10/sec, 3 minutes
    echo.
    locust -f locustfile.py --host=%HOST% AnonymousUser --headless --users 100 --spawn-rate 10 --run-time 3m --html=report-anonymous.html
    goto end
)

if "%choice%"=="7" (
    echo.
    echo Custom Test Configuration
    echo.
    set /p users="Number of users: "
    set /p spawn="Spawn rate (users/sec): "
    set /p runtime="Run time (e.g., 5m, 30s): "
    echo.
    echo Running custom test: %users% users, spawn rate %spawn%, duration %runtime%
    echo.
    locust -f locustfile.py --host=%HOST% --headless --users %users% --spawn-rate %spawn% --run-time %runtime% --html=report-custom.html
    goto end
)

echo Invalid choice!
goto end

:end
echo.
echo =========================================
echo Test Complete!
echo =========================================
if exist report-*.html (
    echo.
    echo Report generated! Opening in browser...
    for %%f in (report-*.html) do (
        start %%f
    )
)
echo.
pause

