@echo off
echo Creating .env.local file for PostgreSQL configuration...
echo.

(
echo # Database - PostgreSQL (more stable than SQLite for Next.js^)
echo DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ocai_hub?schema=public"
echo.
echo # NextAuth
echo NEXTAUTH_URL=http://localhost:3010
echo NEXTAUTH_SECRET=your-secret-key-change-this-in-production
echo.
echo # App Configuration
echo NEXT_PUBLIC_APP_URL=http://localhost:3010
) > .env.local

echo ✅ Created .env.local file
echo.
type .env.local
echo.
echo ✅ Environment file created successfully!
pause


