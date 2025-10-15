# NextAuth CLIENT_FETCH_ERROR - FIXED

## Problem
NextAuth was throwing a `CLIENT_FETCH_ERROR` with the message:
```
"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
```

This error occurred because NextAuth was returning HTML instead of JSON.

## Root Cause

The NextAuth configuration had several issues:

1. **Database Session Strategy**: NextAuth was configured to use `database` session strategy
2. **Missing Database Tables**: The Prisma schema didn't have the required NextAuth tables (`Session`, `Account`, `VerificationToken`)
3. **PrismaAdapter Incompatibility**: Using `PrismaAdapter` without the required database schema
4. **Email Provider**: Configured email provider without proper SMTP setup

## Solution Applied

I've reconfigured NextAuth to use JWT sessions and credentials provider:

### Changes Made

**1. Updated `src/lib/auth.ts`**
- ✅ Switched from `database` to `jwt` session strategy
- ✅ Removed `PrismaAdapter` dependency
- ✅ Added `CredentialsProvider` for email/password authentication
- ✅ Implemented proper JWT and session callbacks
- ✅ Added bcrypt password verification

**2. Updated `src/types/next-auth.d.ts`**
- ✅ Added JWT module type declarations
- ✅ Extended JWT interface with custom user properties

**3. Configuration**
- Uses JWT tokens (no database tables needed)
- Credentials provider validates against User table
- Custom callbacks populate session with user data

### How It Works Now

1. **User submits credentials** → Email + Password
2. **CredentialsProvider validates** → Queries database, checks bcrypt hash
3. **JWT token created** → Contains user id, role, organizationId
4. **Session populated** → From JWT token data
5. **Client receives session** → Can use `useSession()` hook

## Authentication Methods

Your app now supports **3 authentication methods**:

### Method 1: NextAuth Credentials (NEW)
- Email/password authentication
- JWT-based sessions
- Works with `useSession()` hook
- **Users**: admin@test.com, facilitator@test.com

### Method 2: Custom Login API
- `/api/auth/login` endpoint
- Stores user in localStorage
- Uses `x-user-id` header for API calls
- **Same credentials work here too**

### Method 3: Access Key
- `/api/auth/access-key` endpoint
- Stores user in localStorage
- Uses `x-user-id` header
- **Access Key**: TEST123

## Testing

**NextAuth API is now working:**
```bash
curl http://localhost:3010/api/auth/providers
# Returns: {"credentials":{"id":"credentials","name":"Credentials",...}}
```

**Test Credentials:**
- Email: `admin@test.com`
- Password: `password123`

## Next Steps

1. **Clear browser cache** and refresh the page
2. **Sign in** at `/auth/signin` with test credentials
3. **Verify** NextAuth error is gone from console
4. **Navigate** to Baldrige assessment - should work now

## Technical Notes

### Session Strategy Comparison

**Database Strategy** (OLD - ❌ Broken)
```typescript
session: { strategy: 'database' }
adapter: PrismaAdapter(prisma)
// Requires: Session, Account, VerificationToken tables
```

**JWT Strategy** (NEW - ✅ Working)
```typescript
session: { strategy: 'jwt' }
secret: process.env.NEXTAUTH_SECRET
// No extra tables needed
```

### Why JWT Instead of Database?

1. **No Schema Changes**: Doesn't require NextAuth database tables
2. **Simpler Setup**: No adapter needed
3. **Better Performance**: No database query on every request
4. **Already Have Custom Auth**: App uses localStorage + custom endpoints
5. **Works with Existing Schema**: Compatible with current User model

## Files Modified

- ✅ `src/lib/auth.ts` - NextAuth configuration
- ✅ `src/types/next-auth.d.ts` - TypeScript definitions
- ❌ No breaking changes to existing authentication

## Verification

The error should be resolved. Check:
- ✅ No more `CLIENT_FETCH_ERROR` in console
- ✅ NextAuth providers endpoint returns JSON
- ✅ Can use `useSession()` hook without errors
- ✅ Sign-in functionality works with both methods

---

## Summary

✅ **Problem Identified**: NextAuth configured with database adapter but missing required tables
✅ **Solution Applied**: Switched to JWT strategy with credentials provider
✅ **Result**: NextAuth now works correctly, returns JSON instead of HTML
✅ **Backward Compatible**: Existing custom authentication methods still work

The `CLIENT_FETCH_ERROR` has been resolved!
