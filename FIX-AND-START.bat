@echo off
echo =====================================================
echo  COMPLETE FIX - SQLite Setup
echo =====================================================
echo.

echo Stopping any running servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo.
echo Cleaning all caches...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.prisma 2>nul
echo Caches cleaned.

echo.
echo Generating Prisma Client for SQLite...
call npx prisma generate

echo.
echo Syncing database...
call npx prisma db push

echo.
echo =====================================================
echo  Starting Development Server
echo =====================================================
echo.
echo Server will start on: http://localhost:3010
echo.
echo After server starts:
echo   1. CLOSE your browser completely
echo   2. Open fresh browser
echo   3. Go to: http://localhost:3010/baldrige/assessment
echo   4. Answer questions - they WILL save now!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  Server Output Below:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

call npm run dev

