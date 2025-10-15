# API Error Fix - Baldrige Assessment

## Problem
Your Baldrige assessment was showing 500 errors on multiple API endpoints because the application requires authentication but no user was logged in.

## Root Cause
- The API endpoints require authentication via `x-user-id` header or NextAuth session
- The frontend checks localStorage for user data and includes `x-user-id` in requests
- Without authentication, `getUserId()` returns `null`, causing database queries to fail

## Affected Endpoints
- ❌ `/api/baldrige/check-completion` - 404/500
- ❌ `/api/baldrige/response` - 500
- ❌ `/api/baldrige/categories` - 500
- ❌ `/api/baldrige/progress` - 500
- ❌ `/api/assessments/progress` - 500

## Solution: Test Users Created

I've created test data for you to use:

### Test Accounts

**System Admin (Full Access)**
- Email: `admin@test.com`
- Password: `password123`
- Role: SYSTEM_ADMIN

**Facilitator (Organization Admin)**
- Email: `facilitator@test.com`
- Password: `password123`
- Role: FACILITATOR
- Organization: Test Organization

**Employee**
- Email: `employee@test.com`
- Role: EMPLOYEE
- Organization: Test Organization

**Access Key**
- Key: `TEST123`
- Assessment Types: OCAI, BALDRIGE

## How to Fix

### Option 1: Sign In (Recommended)
1. Navigate to: `http://localhost:3010/auth/signin`
2. Sign in with one of the test accounts above
3. Navigate back to the Baldrige assessment
4. The errors should be resolved

### Option 2: Use Access Key
1. Navigate to the access key entry page
2. Enter: `TEST123`
3. Proceed to assessment

### Option 3: View Database
Prisma Studio is running at: `http://localhost:5555`
- You can view/edit all data
- Create additional users, organizations, access keys

## Next Steps

1. **Sign in** at `/auth/signin` with `admin@test.com` / `password123`
2. **Navigate to Baldrige assessment**
3. **Test the assessment** - all API endpoints should work now
4. **Check Prisma Studio** at http://localhost:5555 to see data being saved

## Technical Details

### Authentication Flow
1. User signs in via NextAuth OR uses access key
2. User data is stored in localStorage
3. Frontend includes `x-user-id` header in API requests
4. Backend `getUserId()` extracts user ID from header or session
5. User ID is used for database queries

### Files Modified
- Created: `prisma/seed-test-user.ts` - Seed script for test data
- No existing files were modified

### Database Structure
- Using SQLite: `prisma/dev.db`
- Schema location: `prisma/schema.prisma`
- Prisma Client: Auto-generated in `node_modules/.prisma/client`

## Verification

After signing in, check the browser console. You should see:
- ✅ Locale loaded successfully
- ✅ API calls returning 200 status
- ❌ No more 404/500 errors

## Common Issues

**Issue**: Still getting 500 errors after signing in
**Fix**: Check browser localStorage - should contain `user` and `organization` keys

**Issue**: Access key not working
**Fix**: Verify in Prisma Studio that access key `TEST123` exists and is active

**Issue**: Can't sign in
**Fix**: Check that NextAuth is configured properly in `.env` - `NEXTAUTH_SECRET` should be set

---

## Summary

✅ **Problem Identified**: Missing authentication causing 500 errors
✅ **Test Data Created**: Admin, Facilitator, Employee users + Access Key
✅ **Solution**: Sign in at `/auth/signin` with test credentials
✅ **Tools Available**: Prisma Studio running at http://localhost:5555

The API errors will be resolved once you authenticate with any of the test accounts provided above.
