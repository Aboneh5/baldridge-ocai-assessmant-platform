'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart3,
  Users,
  Key,
  FileText,
  LogOut,
  TrendingUp,
  Building2,
  Activity,
  Calendar,
} from 'lucide-react'

interface Organization {
  id: string
  name: string
  logoUrl?: string
  primaryColor: string
  subscribedAssessments: string
}

interface DashboardStats {
  totalSurveys: number
  totalResponses: number
  activeAccessKeys: number
  assessmentBreakdown: {
    OCAI: number
    BALDRIGE: number
  }
}

export default function FacilitatorDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/signin')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== 'FACILITATOR') {
      router.push('/')
      return
    }

    setUser(parsedUser)
    loadDashboardData(parsedUser.organizationId)
  }, [router])

  const loadDashboardData = async (orgId: string) => {
    try {
      const [orgResponse, statsResponse] = await Promise.all([
        fetch(`/api/admin/organizations/${orgId}`),
        fetch(`/api/facilitator/stats?organizationId=${orgId}`)
      ])

      if (orgResponse.ok) {
        const orgData = await orgResponse.json()
        setOrganization(orgData.organization)
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const primaryColor = organization.primaryColor || '#3B82F6'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Branded Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {organization.logoUrl ? (
                <img
                  src={organization.logoUrl}
                  alt={organization.name}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{organization.name}</h1>
                <p className="text-sm text-gray-600">Assessment Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <Link
              href="/facilitator/dashboard"
              className="border-b-2 py-4 px-1 text-sm font-medium"
              style={{
                borderColor: primaryColor,
                color: primaryColor
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/facilitator/surveys"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Surveys
            </Link>
            <Link
              href="/facilitator/reports"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Reports
            </Link>
            <Link
              href="/facilitator/access-keys"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Access Keys
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h2>
          <p className="text-sm text-gray-600 mt-1">
            Here's an overview of your organization's assessment activities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: primaryColor }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Surveys</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalSurveys || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">All assessments</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
                <FileText className="w-8 h-8" style={{ color: primaryColor }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalResponses || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Employee submissions</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Access Keys</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.activeAccessKeys || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Currently valid</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Key className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subscriptions</p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  {organization.subscribedAssessments.split(',').length} Types
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {organization.subscribedAssessments.split(',').join(', ')}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Breakdown */}
        {stats && (stats.assessmentBreakdown.OCAI > 0 || stats.assessmentBreakdown.BALDRIGE > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Assessment Distribution</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.assessmentBreakdown.OCAI > 0 && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">OCAI</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {stats.assessmentBreakdown.OCAI} surveys
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-purple-600 h-3 rounded-full"
                          style={{
                            width: `${(stats.assessmentBreakdown.OCAI / stats.totalSurveys) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {stats.assessmentBreakdown.BALDRIGE > 0 && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Baldrige</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {stats.assessmentBreakdown.BALDRIGE} surveys
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-orange-600 h-3 rounded-full"
                          style={{
                            width: `${(stats.assessmentBreakdown.BALDRIGE / stats.totalSurveys) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/facilitator/surveys"
                  className="block p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <FileText className="w-5 h-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-gray-700">View All Surveys</p>
                      <p className="text-sm text-gray-600">Browse assessment surveys</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/facilitator/reports"
                  className="block p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-gray-700">View Reports</p>
                      <p className="text-sm text-gray-600">Aggregate results & analytics</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/facilitator/access-keys"
                  className="block p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Key className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-gray-700">Manage Access Keys</p>
                      <p className="text-sm text-gray-600">View employee access codes</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats && stats.totalSurveys === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Activity className="w-8 h-8" style={{ color: primaryColor }} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Assessment Activity Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Your organization hasn't created any surveys yet. Contact your system administrator to get started with assessments.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/facilitator/access-keys"
                className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                <Key className="w-5 h-5 mr-2" />
                View Access Keys
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
