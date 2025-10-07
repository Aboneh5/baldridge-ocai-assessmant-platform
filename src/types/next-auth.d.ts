import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      organizationId: string
      organization?: {
        id: string
        name: string
        industry?: string | null
        size?: string | null
        country?: string | null
        logoUrl?: string | null
        settings?: any
      }
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: string
    organizationId: string
    organization?: {
      id: string
      name: string
      industry?: string | null
      size?: string | null
      country?: string | null
      logoUrl?: string | null
      settings?: any
    }
  }
}
