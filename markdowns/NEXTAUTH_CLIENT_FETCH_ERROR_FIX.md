# NextAuth CLIENT_FETCH_ERROR Fix

## Problem
The error `[next-auth][error][CLIENT_FETCH_ERROR] "Unexpected token '<', \"<!DOCTYPE \"... is not valid JSON"` was occurring because of compatibility issues between NextAuth v4.24.11 and Next.js 15.5.4 with Turbopack.

## Root Cause
- Next.js 15 with Turbopack handles API routes differently than previous versions
- NextAuth v4 wasn't explicitly configured with a `basePath`, causing routing issues
- When errors occurred, the API was returning HTML error pages instead of JSON responses
- The SessionProvider on the client side wasn't configured to match the server configuration

## Changes Made

### 1. Updated NextAuth Configuration (`src/lib/auth.ts`)
Added explicit configuration to ensure proper API routing:
```typescript
debug: process.env.NODE_ENV === 'development',
basePath: '/api/auth',
```

**Why**: 
- `basePath` explicitly tells NextAuth where its API routes are located
- `debug` mode helps identify issues during development

### 2. Updated SessionProvider (`src/components/providers/session-provider.tsx`)
Added matching configuration for the client-side provider:
```typescript
<SessionProvider 
  basePath="/api/auth"
  refetchInterval={0}
  refetchOnWindowFocus={false}
>
  {children}
</SessionProvider>
```

**Why**: 
- Client and server must use the same `basePath`
- Disabled automatic refetching to prevent unnecessary API calls that could trigger errors
- Prevents session polling issues with Next.js 15

### 3. Added Error Handling (`src/app/api/auth/[...nextauth]/route.ts`)
Wrapped the NextAuth handlers with try-catch blocks:
```typescript
export async function GET(req: NextRequest, context: any) {
  try {
    return await handler(req, context)
  } catch (error) {
    console.error('[NextAuth GET Error]:', error)
    return new Response(JSON.stringify({ error: 'Authentication error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
```

**Why**: 
- Ensures errors always return JSON responses instead of HTML
- Prevents the "Unexpected token '<'" error
- Provides better error logging

### 4. Fixed Middleware (`src/middleware.ts`)
Updated the public routes pattern:
```typescript
'/api/auth/',  // Changed from '/api/auth' to match the basePath properly
```

**Why**: 
- Ensures all NextAuth routes (like `/api/auth/session`, `/api/auth/signin`, etc.) are public
- The trailing slash ensures all subpaths are included

## How to Verify the Fix

1. **Stop the current development server** (Ctrl+C)

2. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   # or on Windows:
   rmdir /s /q .next
   ```

3. **Restart the development server**:
   ```bash
   npm run dev
   ```

4. **Test authentication**:
   - Navigate to `http://localhost:3010`
   - Try signing in with credentials
   - Check the browser console - the error should be gone

## Alternative Solution (If Issues Persist)

If the error still occurs, consider upgrading to NextAuth v5 (Auth.js):

```bash
npm install next-auth@beta
```

NextAuth v5 has better compatibility with Next.js 15+ and includes:
- Improved TypeScript support
- Better App Router integration
- Native support for Turbopack
- Enhanced error handling

However, this requires migration of the auth configuration, so the current fix should work for NextAuth v4.

## Testing Checklist

- [ ] No console errors on page load
- [ ] Sign in with credentials works
- [ ] Sign out works
- [ ] Session persistence works
- [ ] Protected routes redirect properly
- [ ] API authentication works

## Additional Notes

- The `NEXTAUTH_URL` and `NEXTAUTH_SECRET` environment variables are still required
- Current values in `.env` are correct: `NEXTAUTH_URL="http://localhost:3010"`
- For production, ensure `NEXTAUTH_SECRET` is a strong, randomly generated string
- The debug mode is only enabled in development for troubleshooting

## Related Files Modified

1. `src/lib/auth.ts` - NextAuth server configuration
2. `src/components/providers/session-provider.tsx` - Client-side SessionProvider
3. `src/app/api/auth/[...nextauth]/route.ts` - API route handlers
4. `src/middleware.ts` - Public route patterns

## Date Fixed
October 15, 2024

