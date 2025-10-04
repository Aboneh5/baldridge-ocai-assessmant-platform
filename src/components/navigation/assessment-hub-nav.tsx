'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AssessmentHubNav() {
  const pathname = usePathname()

  const isAssessmentPage = pathname?.includes('/assessment') || pathname?.includes('/survey') || pathname?.includes('/dashboard')

  if (!isAssessmentPage) return null

  return (
    <div className="bg-teal-700 text-white py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-teal-100 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Back to Assessment Selection</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-teal-100">
              Currently in: <span className="font-semibold">
                {pathname?.includes('/dashboard') ? 'OCAI Dashboard' : 
                 pathname?.includes('/survey') ? 'OCAI Assessment' :
                 pathname?.includes('/assessment') ? 'Assessment' : 'OCAI Hub'}
              </span>
            </span>
            
              <Link 
                href="http://localhost:3000/assessment/entry" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                target="_blank"
              >
                Switch to Baldrige
              </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
