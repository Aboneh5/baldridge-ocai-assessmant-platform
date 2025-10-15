import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced Prisma client with automatic reconnection
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Ensure proper connection handling
export async function ensurePrismaConnected() {
  try {
    await prisma.$connect()
  } catch (error) {
    console.error('[Prisma] Connection error:', error)
    // Try to disconnect and reconnect
    try {
      await prisma.$disconnect()
      await prisma.$connect()
    } catch (retryError) {
      console.error('[Prisma] Reconnection failed:', retryError)
    }
  }
}

// Connect on startup
if (typeof window === 'undefined') {
  ensurePrismaConnected().catch(console.error)
}

// Handle cleanup
if (process.env.NODE_ENV !== 'development') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
