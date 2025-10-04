'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Target, Award, CheckCircle, ArrowRight, LogOut } from 'lucide-react'

interface Organization {
  id: string
  name: string
  logoUrl?: string
  primaryColor?: string
}

interface AssessmentOption {
  type: 'OCAI' | 'BALDRIGE'
  title: string
  description: string
  duration: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
}

export default function EmployeeAssessmentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [assessmentTypes, setAssessmentTypes] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [ocaiSurveyId, setOcaiSurveyId] = useState<string | null>(null)

  useEffect(() => {
    // Load from localStorage
    const storedUser = localStorage.getItem('user')
    const storedOrg = localStorage.getItem('organization')
    const storedTypes = localStorage.getItem('assessmentTypes')

    if (!storedUser || !storedOrg || !storedTypes) {
      router.push('/auth/signin')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    const parsedOrg = JSON.parse(storedOrg)

    setUser(parsedUser)
    setOrganization(parsedOrg)
    setAssessmentTypes(JSON.parse(storedTypes))

    // Fetch OCAI survey for this organization
    fetchOcaiSurvey(parsedOrg.id)
  }, [router])

  const fetchOcaiSurvey = async (orgId: string) => {
    try {
      const response = await fetch(`/api/surveys?organizationId=${orgId}&type=OCAI&status=OPEN`)
      const data = await response.json()

      if (data.surveys && data.surveys.length > 0) {
        setOcaiSurveyId(data.surveys[0].id)
      }
    } catch (error) {
      console.error('Error fetching survey:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('organization')
    localStorage.removeItem('assessmentTypes')
    router.push('/')
  }

  const assessmentOptions: AssessmentOption[] = [
    {
      type: 'OCAI',
      title: 'OCAI Culture Assessment',
      description: 'Assess your organization\'s culture across 6 key dimensions using the Competing Values Framework.',
      duration: '15-20 minutes',
      icon: <Target className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      type: 'BALDRIGE',
      title: 'Baldrige Excellence Assessment',
      description: 'Evaluate organizational excellence across 7 categories with the comprehensive Baldrige framework.',
      duration: '45-60 minutes',
      icon: <Award className="w-8 h-8" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
  ]

  // Filter available assessments based on access key
  const availableAssessments = assessmentOptions.filter(a =>
    assessmentTypes.includes(a.type)
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {organization?.logoUrl ? (
                <img
                  src={organization.logoUrl}
                  alt={organization.name}
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
                  style={{
                    background: organization?.primaryColor
                      ? `linear-gradient(to br, ${organization.primaryColor}, ${organization.primaryColor}dd)`
                      : 'linear-gradient(to br, #3b82f6, #6366f1)',
                  }}
                >
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{organization?.name}</h1>
                <p className="text-sm text-gray-600">Assessment Portal</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome, {user?.name}!
          </h2>
          <p className="text-lg text-gray-600">
            Select an assessment below to begin. Your responses will help {organization?.name} improve and grow.
          </p>
        </div>

        {/* Assessment Cards */}
        {availableAssessments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {availableAssessments.map((assessment) => {
              const getAssessmentLink = () => {
                if (assessment.type === 'OCAI') {
                  return ocaiSurveyId ? `/assessments/ocai?surveyId=${ocaiSurveyId}` : '#'
                } else if (assessment.type === 'BALDRIGE') {
                  return '/assessments/baldrige'
                }
                return '#'
              }

              const handleClick = (e: React.MouseEvent) => {
                if (assessment.type === 'OCAI' && ocaiSurveyId) {
                  localStorage.setItem('currentSurveyId', ocaiSurveyId)
                } else if (assessment.type === 'OCAI' && !ocaiSurveyId) {
                  e.preventDefault()
                  alert('No OCAI survey available. Please contact your administrator.')
                }
              }

              return (
              <Link
                key={assessment.type}
                href={getAssessmentLink()}
                onClick={handleClick}
                className={`${assessment.bgColor} border-2 ${assessment.borderColor} rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group block`}
              >
                <div className={`${assessment.color} mb-4`}>
                  {assessment.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {assessment.title}
                </h3>
                <p className="text-gray-700 mb-4 text-sm">
                  {assessment.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    ⏱ {assessment.duration}
                  </span>
                  <span className="flex items-center space-x-2 text-blue-600 font-medium group-hover:text-blue-700">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            )})}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600">No assessments available with your access key.</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Your responses are confidential and will be aggregated with others</li>
                <li>• You can complete assessments in one sitting or return later</li>
                <li>• Answer honestly - there are no right or wrong answers</li>
                <li>• Results will be shared with your organization to drive improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
