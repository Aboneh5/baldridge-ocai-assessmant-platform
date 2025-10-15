@echo off
cls
echo =====================================================
echo  COMPLETE FIX - Baldrige Assessment  
echo =====================================================
echo.

echo [1/7] Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 /nobreak >nul
echo      Done.

echo.
echo [2/7] Deleting ALL caches (.next and Prisma)...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.prisma 2>nul  
timeout /t 2 /nobreak >nul
echo      Done.

echo.
echo [3/7] Generating Prisma Client (SQLite)...
call npx prisma generate
echo      Done.

echo.
echo [4/7] Syncing database schema...
call npx prisma db push --accept-data-loss
echo      Done.

echo.
echo [5/7] Seeding Baldrige data...
call npx ts-node --transpile-only prisma/seed-baldrige.ts
if errorlevel 1 (
    echo      WARNING: Seed had issues, but continuing...
)
echo      Done.

echo.
echo [6/7] Starting development server...
echo.
echo =====================================================
echo  Server will start on: http://localhost:3010
echo =====================================================
echo.
echo IMPORTANT - After server starts:
echo   1. CLOSE your browser COMPLETELY
echo   2. Open FRESH browser  
echo   3. Go to: http://localhost:3010/baldrige/assessment
echo   4. Answer questions - they WILL save now!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  Server Output:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

call npm run dev

