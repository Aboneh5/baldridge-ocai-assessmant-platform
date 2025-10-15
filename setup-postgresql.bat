@echo off
echo ===================================
echo PostgreSQL Setup for Tenadam Assessment
echo ===================================
echo.

echo Step 1: Cleaning Prisma cache...
rmdir /s /q node_modules\.prisma 2>nul
echo Prisma cache cleaned.
echo.

echo Step 2: Generating Prisma Client for PostgreSQL...
npx prisma generate
echo.

echo Step 3: Pushing schema to PostgreSQL database...
npx prisma db push
echo.

echo Step 4: Seeding Baldrige data...
npx ts-node prisma/seed-baldrige.ts
echo.

echo Step 5: Seeding demo data (optional)...
set /p seed_demo="Do you want to seed demo data? (y/n): "
if /i "%seed_demo%"=="y" (
    npx ts-node prisma/seed-demo.ts
)
echo.

echo ===================================
echo PostgreSQL Setup Complete!
echo ===================================
echo.
echo You can now start the development server with:
echo   npm run dev
echo.
pause

