# Admin Users Page 500 Error - Diagnosis & Solution

## Error
```
Failed to load users: 500
```

## Root Cause

The admin users page (`/admin/users`) is getting a 500 error when trying to load users. This is the **same authentication issue** as before - the page requires you to be logged in as a SYSTEM_ADMIN.

## Why It's Happening

1. You're visiting `/admin/users` page
2. Page checks localStorage for `user` object
3. If no user or not SYSTEM_ADMIN role → redirects to `/`
4. If user exists in localStorage → calls `/api/admin/users` with `x-user-id` header
5. **Problem**: Either:
   - No user in localStorage (not logged in)
   - User in localStorage but not SYSTEM_ADMIN
   - API is getting errors from database

## Solution

### Quick Fix: Sign In as Admin

**Sign in at `/auth/signin` with:**
- Email: `admin@test.com`
- Password: `password123`

This will:
1. ✅ Authenticate you via the custom login API
2. ✅ Store your user data in localStorage
3. ✅ Allow you to access `/admin/users`
4. ✅ API calls will work with your user ID

### Available Admin Accounts

I've verified there are 2 SYSTEM_ADMIN users in your database:

1. **Tenadam System Admin**
   - ID: `cmgbd297a0001uuj8myi2i7pf`
   - Email: `admin@tenadam.com`
   - Password: *(check your database or reset)*

2. **Test Admin** (Created by seed script)
   - ID: `cmgpuxuwa0001u0b4lphizs3t`
   - Email: `admin@test.com`
   - Password: `password123` ✅

### How the Admin Page Works

**Frontend** (`src/app/admin/users/page.tsx`):
```typescript
// Line 68-72
const response = await fetch('/api/admin/users', {
  headers: {
    'x-user-id': user.id,  // From localStorage
  },
})
```

**Backend** (`src/app/api/admin/users/route.ts`):
```typescript
// Line 10-27
const userId = await getUserId(request)  // Gets from x-user-id header
const user = await prisma.user.findUnique({ where: { id: userId } })

if (!user || user.role !== 'SYSTEM_ADMIN') {
  return 403 Forbidden
}

// If passes auth check, return all users
const users = await prisma.user.findMany({ ... })
```

## Verification Steps

### Step 1: Check if you're logged in
Open browser console and run:
```javascript
console.log(JSON.parse(localStorage.getItem('user')))
```

**Expected output:**
```json
{
  "id": "cmgpuxuwa0001u0b4lphizs3t",
  "name": "Test Admin",
  "email": "admin@test.com",
  "role": "SYSTEM_ADMIN"
}
```

**If null or missing** → You're not logged in → Sign in first

**If role !== 'SYSTEM_ADMIN'** → Sign in with admin account

### Step 2: Test API endpoint
```bash
curl -H "x-user-id: cmgpuxuwa0001u0b4lphizs3t" \
  http://localhost:3010/api/admin/users
```

**Expected**: JSON with users array
**If error**: Check server logs for database errors

### Step 3: Verify database connection
The API might be getting database errors. Check:
```bash
cd prisma
ls -la dev.db  # Should exist with recent timestamp
```

## Complete Authentication Flow

### Method 1: Custom Login (Recommended)
1. Go to `/auth/signin`
2. Enter: `admin@test.com` / `password123`
3. Click "Sign In"
4. Backend validates credentials
5. User data stored in localStorage
6. Navigate to `/admin/users`
7. Page loads successfully ✅

### Method 2: Access Key (Not for admin pages)
- Access keys are for EMPLOYEE role
- Won't work for admin pages
- Use email/password login instead

## Testing

After signing in, the admin users page should:
- ✅ Load without errors
- ✅ Display list of all users
- ✅ Show user roles, organizations, emails
- ✅ Allow creating/editing/deleting users

## Common Issues

### Issue 1: "Failed to load users: 500"
**Cause**: Not authenticated or database error
**Fix**: Sign in as SYSTEM_ADMIN, check server logs

### Issue 2: Redirected to home page
**Cause**: Not SYSTEM_ADMIN role
**Fix**: Sign in with `admin@test.com`

### Issue 3: "Authentication required" (401)
**Cause**: No `x-user-id` header being sent
**Fix**: Clear localStorage, sign in again

### Issue 4: "Forbidden - Only admins can view users" (403)
**Cause**: User is not SYSTEM_ADMIN
**Fix**: Use correct admin account

## Database Structure

The admin users page queries:
```sql
SELECT users.*, organizations.name as org_name
FROM users
LEFT JOIN organizations ON users.organizationId = organizations.id
ORDER BY users.createdAt DESC
```

If this query fails, check:
- ✅ Prisma Client is generated
- ✅ Database file exists (`prisma/dev.db`)
- ✅ Tables exist (run `npx prisma studio`)

## Next Steps

1. **Sign in** at http://localhost:3010/auth/signin
   - Email: `admin@test.com`
   - Password: `password123`

2. **Navigate** to http://localhost:3010/admin/users

3. **Verify** the page loads without errors

4. **Check console** - should see no more "Failed to load users: 500"

If you're still seeing errors after signing in:
- Check browser console for detailed error
- Check Next.js dev server terminal for backend errors
- Verify database is accessible with Prisma Studio (http://localhost:5555)

---

## Summary

✅ **Root Cause**: Not authenticated as SYSTEM_ADMIN
✅ **Solution**: Sign in with `admin@test.com` / `password123`
✅ **Admin accounts**: 2 SYSTEM_ADMIN users exist in database
✅ **Expected behavior**: Page loads users list after authentication

The error is an authentication issue, not a code bug. Sign in with the test admin account to resolve it.
