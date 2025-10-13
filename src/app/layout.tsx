import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthSessionProvider } from '@/components/providers/session-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { LocaleProvider } from '@/lib/i18n/context'
import { AssessmentHubNav } from '@/components/navigation/assessment-hub-nav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Assessment Hub - OCAI & Baldrige Assessments',
  description: 'Unified platform for organizational culture assessment (OCAI) and excellence framework assessment (Baldrige)',
  keywords: ['OCAI', 'Baldrige', 'organizational culture', 'assessment', 'survey', 'analysis', 'excellence framework'],
  authors: [{ name: 'Assessment Hub Team' }],
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <LocaleProvider>
          <AuthSessionProvider>
            <QueryProvider>
              <AssessmentHubNav />
              <div className="min-h-full">
                {children}
              </div>
            </QueryProvider>
          </AuthSessionProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}