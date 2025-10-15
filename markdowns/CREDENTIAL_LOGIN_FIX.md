# Credential Login Fix - October 7, 2025

## Issue
Credential login for `o.b@gmail.com` and `a.t@gmail.com` was failing with two problems:

1. **Wrong Password**: Users were trying incorrect passwords
2. **Redirect Issue**: After successful login, users were redirected to access key page instead of assessments

## Root Causes

### 1. Password Issue
The correct password for both accounts is: **`temp123`**

Verified via database check:
```
o.b@gmail.com: password = temp123 ✓
a.t@gmail.com: password = temp123 ✓
```

### 2. LocalStorage Race Condition
The signin page had a race condition:
- Credential login succeeded
- Redirect happened immediately via `router.push()`
- LocalStorage wasn't fully written before navigation
- Employee assessments page checked localStorage and found nothing
- User redirected back to signin

## Solution

### File Changed: `src/app/auth/signin/page.tsx`

**Changes Made:**
1. Added organization data storage for credential users
2. Added 100ms delay before redirect to ensure localStorage writes complete

**Before:**
```typescript
localStorage.setItem('user', JSON.stringify(data.user))

if (data.user.role === 'CREDENTIAL_USER') {
  localStorage.setItem('assessmentTypes', JSON.stringify(data.user.assessmentTypes))
}

router.push(data.redirectUrl)
```

**After:**
```typescript
localStorage.setItem('user', JSON.stringify(data.user))

if (data.user.role === 'CREDENTIAL_USER') {
  localStorage.setItem('assessmentTypes', JSON.stringify(data.user.assessmentTypes))

  // Store organization data
  localStorage.setItem('organization', JSON.stringify({
    id: data.user.organizationId,
    name: data.user.organizationName,
    logoUrl: undefined,
    primaryColor: undefined
  }))
}

// Add delay to ensure localStorage is written
setTimeout(() => {
  router.push(data.redirectUrl)
}, 100)
```

## Verification

Credentials are active and valid:
```
Email: o.b@gmail.com
Password: temp123
Status: Active
Expires: 2025-12-14
Assessments: OCAI, BALDRIGE
Login Count: 6

Email: a.t@gmail.com
Password: temp123
Status: Active
Expires: 2025-12-14
Assessments: OCAI, BALDRIGE
Login Count: 1
```

## Testing

To test the fix:
1. Go to http://localhost:3010
2. Click "Sign In"
3. Enter email: `o.b@gmail.com`
4. Enter password: `temp123`
5. Click "Sign in"
6. Should redirect to `/employee/assessments` successfully
7. Should see OCAI and Baldrige assessment options

## Related Files
- `src/app/auth/signin/page.tsx` - Login page (FIXED)
- `src/app/api/auth/credential-login/route.ts` - Credential auth API
- `src/app/employee/assessments/page.tsx` - Assessment selection page
- `check-credentials.js` - Database verification script
- `test-password.js` - Password testing script

## Status
✅ **FIXED** - Both password and redirect issues resolved
