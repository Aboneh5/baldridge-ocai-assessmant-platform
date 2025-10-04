import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

/**
 * Get user ID from either NextAuth session or custom header (for access key users)
 * Access key users will send their user ID in a custom header
 */
export async function getUserId(request: NextRequest): Promise<string | null> {
  // First, check for custom user ID header (from localStorage/access key auth)
  const customUserId = request.headers.get('x-user-id');
  if (customUserId) {
    return customUserId;
  }

  // Otherwise, check NextAuth session
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }

  return null;
}
