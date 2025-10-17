@echo off
echo ================================================================================
echo COMPLETE FIX: Switch to PostgreSQL and Fix Prisma Connection
echo ================================================================================
echo.
echo This script will:
echo   1. Kill all Node processes
echo   2. Clear all caches
echo   3. Configure PostgreSQL
echo   4. Regenerate Prisma client
echo   5. Sync database schema
echo   6. Start dev server
echo.
echo ⚠️  IMPORTANT: Close ALL browser tabs and VS Code/Cursor first!
echo.
pause

echo.
echo Step 1: Killing all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✅ Done
echo.

echo Step 2: Clearing caches...
if exist .next rmdir /s /q .next
if exist node_modules\.prisma rmdir /s /q node_modules\.prisma
echo ✅ Caches cleared
echo.

echo Step 3: Waiting for file locks to release...
timeout /t 3 /nobreak >nul
echo ✅ Ready
echo.

echo Step 4: Regenerating Prisma client for PostgreSQL...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Prisma generate failed
    echo ⚠️  Try running this after restarting your computer
    echo.
    pause
    exit /b 1
)
echo ✅ Prisma client generated
echo.

echo Step 5: Syncing database schema with PostgreSQL...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Database sync failed
    echo ⚠️  Make sure PostgreSQL is running
    echo.
    pause
    exit /b 1
)
echo ✅ Database schema synced
echo.

echo Step 6: Testing database connection...
node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.baldrigeQuestion.count().then(c => {console.log('✅ PostgreSQL connected! Questions:', c); p.$disconnect();}).catch(e => {console.error('❌ Connection failed:', e.message); p.$disconnect(); process.exit(1);});"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Database connection test failed
    pause
    exit /b 1
)
echo.

echo Step 7: Starting development server...
echo.
echo ⚠️  Server will start in a NEW window
echo ⚠️  Watch for "✓ Ready" message (10-30 seconds)
echo ⚠️  Then test at: http://localhost:3010/baldrige/assessment
echo.
start "Baldrige Dev Server - PostgreSQL" cmd /k "npm run dev"
echo.

echo ================================================================================
echo ✅ SETUP COMPLETE!
echo ================================================================================
echo.
echo 📋 NEXT STEPS:
echo    1. Wait for "Ready" message in the server window
echo    2. Open browser: http://localhost:3010/baldrige/assessment
echo    3. Sign in: admin@test.com / password123
echo    4. Answer questions
echo    5. Watch console for "POST /api/baldrige/response 200" (should be 200, not 500!)
echo.
echo 🧪 TO TEST CONNECTION:
echo    Run: node test-submission-now.js
echo    Should show: Status 400 (validation error) instead of 500 (connection error)
echo.
echo ✅ PostgreSQL is more stable than SQLite for Next.js!
echo.
pause



