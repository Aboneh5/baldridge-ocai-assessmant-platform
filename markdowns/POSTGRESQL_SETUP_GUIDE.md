# PostgreSQL Setup Guide for Tenadam Assessment

## 🚨 Current Issue
The application was configured for SQLite but needs PostgreSQL for proper operation. This guide will help you set up PostgreSQL and migrate your data.

## 📋 Prerequisites

### Step 1: Install PostgreSQL

#### Option 1: Official PostgreSQL Installer (Recommended)
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Set password for `postgres` user (default: `postgres`)
   - Keep default port: `5432`
   - Install all components including pgAdmin 4

#### Option 2: Using Chocolatey
```powershell
choco install postgresql
```

#### Option 3: Using Docker (Alternative)
```powershell
docker run --name tenadam-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### Step 2: Verify PostgreSQL Installation

1. Open PowerShell and check if PostgreSQL is running:
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# Or try connecting via psql (if in PATH)
psql --version
```

2. If `psql` is not recognized, add PostgreSQL to your PATH:
   - Default location: `C:\Program Files\PostgreSQL\16\bin`
   - Add to System Environment Variables

## 🔧 Database Setup

### Step 3: Create the Database

#### Using pgAdmin (GUI):
1. Open pgAdmin 4
2. Connect to PostgreSQL server (password: `postgres`)
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `ocai_hub` (or `tenadam_assessment`)
5. Click "Save"

#### Using Command Line:
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ocai_hub;

# Exit
\q
```

#### Using PowerShell:
```powershell
$env:PGPASSWORD="postgres"
psql -U postgres -c "CREATE DATABASE ocai_hub;"
```

### Step 4: Update Environment Variables

Your `.env` file should have (already configured):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ocai_hub?schema=public"
```

**Important:** If you used a different:
- Username (default: `postgres`)
- Password (default: `postgres`)
- Database name (default: `ocai_hub`)

Update the `DATABASE_URL` accordingly:
```
postgresql://[username]:[password]@localhost:5432/[database_name]?schema=public
```

## 🚀 Migration Steps

### Step 5: Stop the Development Server

**IMPORTANT:** You must stop the dev server before proceeding!

1. Go to the terminal running `npm run dev`
2. Press `Ctrl+C` to stop it
3. Confirm the server has stopped

### Step 6: Run the Setup Script

1. Open PowerShell in the project directory:
```powershell
cd "C:\Users\Lu\prog\baldrige work\tenadam-assessment"
```

2. Run the setup script:
```powershell
.\setup-postgresql.bat
```

This script will:
- ✅ Clean Prisma cache
- ✅ Generate Prisma Client for PostgreSQL
- ✅ Push schema to database
- ✅ Seed Baldrige assessment data
- ✅ Optionally seed demo data

### Step 7: Manual Setup (If Script Fails)

If the batch script doesn't work, run these commands manually:

```powershell
# 1. Clean Prisma cache (stop dev server first!)
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue

# 2. Generate Prisma Client
npx prisma generate

# 3. Push schema to database
npx prisma db push

# 4. Seed Baldrige data
npx ts-node prisma/seed-baldrige.ts

# 5. (Optional) Seed demo data
npx ts-node prisma/seed-demo.ts
```

## ✅ Verification

### Step 8: Verify Database Setup

Check if tables were created:

#### Using pgAdmin:
1. Refresh the database
2. Expand `ocai_hub` → `Schemas` → `public` → `Tables`
3. You should see tables like: `users`, `organizations`, `baldrige_categories`, etc.

#### Using psql:
```powershell
psql -U postgres -d ocai_hub -c "\dt"
```

### Step 9: Start Development Server

```powershell
npm run dev
```

Visit: http://localhost:3010

## 🔍 Troubleshooting

### Issue 1: "Engine is not yet connected"
**Solution:** Make sure you:
1. Stopped the dev server before regenerating Prisma client
2. Ran `npx prisma generate` after schema changes
3. PostgreSQL service is running

### Issue 2: "Database does not exist"
**Solution:** Create the database manually:
```powershell
psql -U postgres -c "CREATE DATABASE ocai_hub;"
```

### Issue 3: "Connection refused"
**Solution:** 
1. Check if PostgreSQL is running:
```powershell
Get-Service -Name postgresql*
```

2. Start if needed:
```powershell
Start-Service postgresql-x64-16  # Adjust version number
```

### Issue 4: Authentication failed
**Solution:** 
1. Check your PostgreSQL password
2. Update `DATABASE_URL` in `.env` file
3. Or reset PostgreSQL password:
```powershell
# Using psql as postgres
ALTER USER postgres PASSWORD 'postgres';
```

### Issue 5: Port 5432 already in use
**Solution:**
1. Find what's using the port:
```powershell
netstat -ano | findstr :5432
```

2. Stop the conflicting service or use a different port in `.env`

## 📊 Data Migration (Optional)

If you have existing data in SQLite (`dev.db`) that you want to migrate:

### Option 1: Manual Migration
1. Export data from SQLite
2. Transform to PostgreSQL format
3. Import using `psql` or pgAdmin

### Option 2: Fresh Start (Recommended)
Just seed new demo data:
```powershell
npx ts-node prisma/seed-demo.ts
```

## 🎯 Next Steps

After successful setup:

1. ✅ PostgreSQL is running
2. ✅ Database `ocai_hub` is created
3. ✅ Schema is pushed
4. ✅ Baldrige data is seeded
5. ✅ Dev server is running

You can now:
- Access the application at http://localhost:3010
- Take Baldrige assessments
- View results
- Manage users and organizations

## 📝 Quick Reference

### Useful Commands

```powershell
# Check PostgreSQL status
Get-Service -Name postgresql*

# Start PostgreSQL
Start-Service postgresql-x64-16

# Stop PostgreSQL  
Stop-Service postgresql-x64-16

# Access PostgreSQL CLI
psql -U postgres

# View databases
psql -U postgres -c "\l"

# View tables in database
psql -U postgres -d ocai_hub -c "\dt"

# Reset database (CAUTION: Deletes all data)
npx prisma db push --force-reset

# View Prisma Studio (Database GUI)
npx prisma studio
```

### Environment Variables
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ocai_hub?schema=public"
NEXTAUTH_URL="http://localhost:3010"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production-12345678"
```

## 🆘 Getting Help

If you encounter issues:

1. Check PostgreSQL is running: `Get-Service -Name postgresql*`
2. Check logs in: `C:\Program Files\PostgreSQL\16\data\log`
3. Verify `.env` file has correct `DATABASE_URL`
4. Try `npx prisma studio` to browse database

## ✨ Success Indicators

Your setup is successful when:
- ✅ No "Engine is not yet connected" errors
- ✅ No language switching issues during assessments
- ✅ Baldrige assessment loads with questions
- ✅ Responses are saved correctly
- ✅ Results page displays data

---

**Last Updated:** October 2025  
**Configuration:** PostgreSQL + Prisma + Next.js

