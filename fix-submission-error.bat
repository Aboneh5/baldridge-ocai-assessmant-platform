@echo off
echo ================================================================================
echo FIXING BALDRIGE SUBMISSION ERROR - Prisma Connection Issue
echo ================================================================================
echo.

echo Step 1: Stopping all Node processes...
echo.
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node processes stopped
) else (
    echo ⚠️  No Node processes running
)
echo.
timeout /t 2 /nobreak >nul

echo Step 2: Cleaning build caches...
echo.
if exist .next (
    rmdir /s /q .next
    echo ✅ Deleted .next folder
)
if exist node_modules\.prisma (
    rmdir /s /q node_modules\.prisma
    echo ✅ Deleted node_modules\.prisma folder
)
echo.

echo Step 3: Regenerating Prisma Client...
echo.
call npx prisma generate
if %ERRORLEVEL% EQU 0 (
    echo ✅ Prisma Client regenerated successfully
) else (
    echo ❌ Failed to regenerate Prisma Client
    pause
    exit /b 1
)
echo.

echo Step 4: Syncing database schema...
echo.
call npx prisma db push
if %ERRORLEVEL% EQU 0 (
    echo ✅ Database schema synced
) else (
    echo ❌ Failed to sync database
    pause
    exit /b 1
)
echo.

echo Step 5: Checking if Baldrige questions exist...
echo.
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.baldrigeQuestion.count().then(count => { console.log('Total questions:', count); if (count === 0) { console.log('⚠️  WARNING: No questions in database! Run seed script.'); } else { console.log('✅ Questions exist in database'); } prisma.$disconnect(); }).catch(err => { console.error('❌ Error:', err.message); prisma.$disconnect(); });"
echo.

echo Step 6: Starting development server...
echo.
echo ⚠️  The server will start in a NEW window
echo ⚠️  Watch for "✓ Ready" message before testing
echo.
start "Baldrige Dev Server" cmd /k "npm run dev"
echo.

echo ================================================================================
echo SETUP COMPLETE!
echo ================================================================================
echo.
echo 📋 NEXT STEPS:
echo    1. Wait for "Ready" message in the server window (10-30 seconds)
echo    2. Open browser: http://localhost:3010/baldrige/assessment
echo    3. Sign in if needed (admin@test.com / password123)
echo    4. Answer questions and test submission
echo.
echo 🧪 TO TEST SUBMISSION:
echo    Run: node test-submission-now.js
echo.
pause


