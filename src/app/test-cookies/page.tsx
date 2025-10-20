'use client'

import { useEffect, useState } from 'react'
import { CONSENT_COOKIE, parseConsentCookie, ConsentState } from '@/lib/consent'

export default function TestCookiesPage() {
  const [cookies, setCookies] = useState<string>('')
  const [consentState, setConsentState] = useState<ConsentState | null>(null)
  const [allCookies, setAllCookies] = useState<string>('')

  useEffect(() => {
    // Read all cookies
    setAllCookies(document.cookie)
    
    // Read consent cookie specifically
    const match = document.cookie.split('; ').find(row => row.startsWith(CONSENT_COOKIE + '='))
    const consentValue = match ? match.split('=')[1] : undefined
    setCookies(consentValue || 'No consent cookie found')
    
    // Parse consent state
    if (consentValue) {
      const parsed = parseConsentCookie(consentValue)
      setConsentState(parsed)
    }
  }, [])

  const refresh = () => {
    window.location.reload()
  }

  const clearCookies = () => {
    document.cookie = `${CONSENT_COOKIE}=; Path=/; Max-Age=0`
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Cookie Consent Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">All Browser Cookies</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {allCookies || 'No cookies found'}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Consent Cookie Raw Value</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {cookies}
          </pre>
        </div>

        {consentState && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Parsed Consent State</h2>
            <div className="space-y-2">
              <p><strong>Version:</strong> {consentState.version}</p>
              <p><strong>Given:</strong> {consentState.given ? 'Yes' : 'No'}</p>
              <p><strong>Timestamp:</strong> {new Date(consentState.timestamp).toLocaleString()}</p>
              <div>
                <strong>Categories:</strong>
                <ul className="ml-6 mt-2 space-y-1">
                  <li>Essential: {consentState.categories.essential ? '✓' : '✗'}</li>
                  <li>Analytics: {consentState.categories.analytics ? '✓' : '✗'}</li>
                  <li>Marketing: {consentState.categories.marketing ? '✓' : '✗'}</li>
                  <li>Preferences: {consentState.categories.preferences ? '✓' : '✗'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={refresh}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Refresh Page
          </button>
          <button
            onClick={clearCookies}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
          >
            Clear Consent Cookie
          </button>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Testing Instructions:</h3>
          <ol className="list-decimal ml-6 space-y-1 text-sm">
            <li>If you see the cookie banner, make a choice (Accept all, Essential only, or Reject all twice)</li>
            <li>The banner should close and the consent cookie should be set</li>
            <li>Refresh this page to see the cookie persisted</li>
            <li>Click "Clear Consent Cookie" to reset and see the banner again</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

