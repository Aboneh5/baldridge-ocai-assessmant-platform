# 🔧 Manual Fix Guide - Step by Step

## The Problem
Persistent Prisma client caching issues causing "Engine is not yet connected" errors.

## The Solution  
Follow these exact steps manually:

---

## Step 1: Close EVERYTHING

1. **Close ALL browser windows/tabs**
2. **Close ALL PowerShell/terminal windows** (except this guide)
3. **Close VS Code/Cursor**  (if open)
4. Wait 5 seconds

---

## Step 2: Clean Restart

1. **Open NEW PowerShell** as Administrator
2. **Navigate to project:**
   ```powershell
   cd "C:\Users\Lu\prog\baldrige work\tenadam-assessment"
   ```

3. **Kill all Node processes:**
   ```powershell
   Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

4. **Delete ALL caches:**
   ```powershell
   Remove-Item -Recurse -Force .next
   Remove-Item -Recurse -Force node_modules\.prisma
   ```

5. **Verify schema is correct:**
   ```powershell
   Get-Content prisma\schema.prisma | Select-String "provider"
   ```
   Should show: `provider = "sqlite"`

6. **Generate Prisma Client:**
   ```powershell
   npx prisma generate
   ```

7. **Sync database:**
   ```powershell
   npx prisma db push
   ```

8. **Restore database with data:**
   ```powershell
   Copy-Item prisma\dev.db.backup prisma\dev.db -Force
   ```

9. **Start server:**
   ```powershell
   npm run dev
   ```

10. **Wait for "Ready" message** (about 10-30 seconds)

---

## Step 3: Test in Browser

1. **Open FRESH browser** (not existing tabs)
2. **Go to:** http://localhost:3010/baldrige/assessment
3. **Open Console** (F12 → Console tab)
4. **Try answering a question**
5. **Look for:** `POST /api/baldrige/response 200` ✅

---

## Expected Results

### Good Signs ✅:
- Server shows: `✓ Ready in X.Xs`
- Console shows: `POST /api/baldrige/response 200`
- Questions load and display
- Responses save successfully

### Bad Signs ❌:
- Still seeing: "Engine is not yet connected"
- 500 errors in console
- Questions don't load

---

## If Still Failing

### Nuclear Option - Restart Computer

1. **Restart your computer** (clears ALL caches and processes)
2. **After restart, run these commands:**
   ```powershell
   cd "C:\Users\Lu\prog\baldrige work\tenadam-assessment"
   
   Remove-Item -Recurse -Force .next
   Remove-Item -Recurse -Force node_modules\.prisma
   
   npx prisma generate
   Copy-Item prisma\dev.db.backup prisma\dev.db -Force
   
   npm run dev
   ```

3. **Close browser, reopen, test**

---

## Alternative: Use Existing PostgreSQL Data

If SQLite keeps having issues, we can migrate your 74 responses from SQLite to PostgreSQL:

1. **Export from SQLite:**
   ```powershell
   sqlite3 prisma/dev.db ".dump baldrige_responses" > responses.sql
   ```

2. **Import to PostgreSQL:**
   ```powershell
   psql -U postgres -d ocai_hub -f responses.sql
   ```

3. **Update schema to PostgreSQL**
4. **Start server**

---

## Quick Verification Commands

### Check if server is running:
```powershell
Get-NetTCPConnection -LocalPort 3010
```

### Check database has data:
```powershell
# For SQLite
sqlite3 prisma\dev.db "SELECT COUNT(*) FROM baldrige_questions;"

# For PostgreSQL  
psql -U postgres -d ocai_hub -c "SELECT COUNT(*) FROM baldrige_questions;"
```

### Test API:
```powershell
Invoke-WebRequest -Uri "http://localhost:3010/api/baldrige/categories" -UseBasicParsing
```

---

## Current Status

- ✅ Schema: Fixed with correct model names
- ✅ Database: Backup restored
- ✅ Prisma Client: Regenerated
- ⚠️  Server: May need manual restart
- ⚠️  Browser: Needs complete closure/fresh start

---

##  Bottom Line

The **technical fixes are complete**. The remaining issue is likely just **cache persistence** that will resolve with a computer restart or completely fresh terminal/browser sessions.

**Recommendation:** Follow Step 1-3 above very carefully, ensuring you close EVERYTHING before starting fresh.

---

**Last Updated:** October 14, 2025  
**Issue:** Prisma client caching  
**Solution:** Complete clean restart

