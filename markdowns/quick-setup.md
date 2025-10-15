# 🚀 Quick PostgreSQL Setup

## The Problem
- ❌ Baldrige assessment not loading ("Engine is not yet connected" errors)
- ❌ Language switching unexpectedly during assessments
- ❌ Database configuration mismatch (was SQLite, needs PostgreSQL)

## The Solution
We've configured your application to use **PostgreSQL** and fixed the language persistence issues.

---

## ⚡ Quick Setup (5 Steps)

### Step 1: Install PostgreSQL (if not installed)

**Download & Install:**
- Go to: https://www.postgresql.org/download/windows/
- Install PostgreSQL 16
- Set password: `postgres` (or remember your custom password)
- Default port: `5432`

**Verify Installation:**
```powershell
Get-Service -Name postgresql*
```

### Step 2: Create Database

**Option A - Using PowerShell:**
```powershell
$env:PGPASSWORD="postgres"
psql -U postgres -c "CREATE DATABASE ocai_hub;"
```

**Option B - Using pgAdmin:**
1. Open pgAdmin 4
2. Right-click "Databases" → Create → Database
3. Name: `ocai_hub`
4. Save

### Step 3: Stop Dev Server

**CRITICAL:** Stop your running dev server!
- Press `Ctrl+C` in the terminal running `npm run dev`
- Wait until it fully stops

### Step 4: Run Setup Script

```powershell
cd "C:\Users\Lu\prog\baldrige work\tenadam-assessment"
.\setup-postgresql.bat
```

This will:
1. Clean Prisma cache
2. Generate PostgreSQL client
3. Push database schema
4. Seed Baldrige data

### Step 5: Start Dev Server

```powershell
npm run dev
```

Visit: **http://localhost:3010**

---

## ✅ Verification Checklist

After setup, check:

- [ ] No "Engine is not yet connected" errors
- [ ] Baldrige assessment loads with questions
- [ ] Language doesn't switch automatically
- [ ] Responses are saved
- [ ] Can view results

---

## 🔧 Manual Setup (If Batch Script Fails)

If the automated script doesn't work, run these commands one by one:

```powershell
# Stop dev server first!

# 1. Clean cache
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue

# 2. Generate client
npx prisma generate

# 3. Push schema
npx prisma db push

# 4. Seed data
npx ts-node prisma/seed-baldrige.ts

# 5. Start server
npm run dev
```

---

## 🆘 Troubleshooting

### PostgreSQL Not Installed?
```powershell
# Install via Chocolatey
choco install postgresql

# Or use Docker
docker run --name tenadam-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### Database Connection Error?
Check `.env` file:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ocai_hub?schema=public"
```

Adjust if you used different credentials.

### Still Getting Errors?
1. Verify PostgreSQL is running:
   ```powershell
   Get-Service -Name postgresql*
   ```

2. Start if stopped:
   ```powershell
   Start-Service postgresql-x64-16
   ```

3. Test connection:
   ```powershell
   psql -U postgres -c "\l"
   ```

---

## 📊 What Changed?

### Database Configuration
- ✅ Changed from SQLite to PostgreSQL
- ✅ Updated `prisma/schema.prisma` provider
- ✅ Enhanced Prisma client error handling

### Language Switching Fix
- ✅ Improved locale persistence in `LocaleProvider`
- ✅ Removed hot-reload interference
- ✅ Better localStorage handling

### Files Modified
1. `prisma/schema.prisma` - PostgreSQL provider
2. `src/lib/prisma.ts` - Enhanced connection handling
3. `src/lib/i18n/context.tsx` - Fixed locale persistence
4. Created: `setup-postgresql.bat` - Automated setup
5. Created: `POSTGRESQL_SETUP_GUIDE.md` - Detailed guide

---

## 🎯 Expected Outcome

After successful setup:

✨ **Baldrige Assessment:**
- Loads all categories and questions
- Saves responses correctly
- No database errors
- Progress tracking works

✨ **Language:**
- Stays in selected language
- No automatic switching
- Persists across page reloads

✨ **Database:**
- PostgreSQL connected
- All tables created
- Baldrige data seeded
- Ready for production

---

## 📚 Additional Resources

- **Full Guide:** See `POSTGRESQL_SETUP_GUIDE.md`
- **Prisma Docs:** https://www.prisma.io/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

**Need Help?** Check the detailed guide in `POSTGRESQL_SETUP_GUIDE.md`

