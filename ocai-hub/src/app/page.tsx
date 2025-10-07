'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, CheckCircle, Users, Building2, TrendingUp, Shield, Target, Award } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assessment Hub</h1>
                <p className="text-sm text-indigo-600 font-medium">by Tenadam Training, Consultancy & Research PLC</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/auth/signin"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Your Organization with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
                Data-Driven Assessments
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A comprehensive survey platform designed for organizations to assess culture,
              performance, and excellence. Powered by proven frameworks including OCAI and Baldrige.
            </p>
            <div className="mt-10">
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Organizations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Multi-User Access</h4>
              <p className="text-gray-600">
                System administrators, facilitators, and employees - each with tailored access and permissions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl border border-indigo-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Organization Management</h4>
              <p className="text-gray-600">
                Create and manage multiple organizations with custom branding and assessment access.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Secure Access Keys</h4>
              <p className="text-gray-600">
                Generate unique access codes for employees to participate in assessments anonymously and securely.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl border border-green-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Analytics</h4>
              <p className="text-gray-600">
                Track participation, view aggregate results, and gain insights with comprehensive reporting tools.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-xl border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">OCAI Assessment</h4>
              <p className="text-gray-600">
                Measure organizational culture across 6 dimensions using the proven Competing Values Framework.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-xl border border-emerald-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Baldrige Framework</h4>
              <p className="text-gray-600">
                Assess organizational excellence across 7 categories with the 1000-point Baldrige system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Sign In</h4>
              <p className="text-gray-600">
                Administrators and facilitators sign in with credentials. Employees use secure access keys.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Take Assessment</h4>
              <p className="text-gray-600">
                Choose from available assessments (OCAI, Baldrige) and complete them at your own pace.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">View Results</h4>
              <p className="text-gray-600">
                Access comprehensive reports, aggregate data, and actionable insights for your organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Organization?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join organizations worldwide using our platform to drive meaningful change.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started Today
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Assessment Hub</span>
              </div>
              <p className="text-gray-400">
                Empowering organizations through data-driven assessments and insights.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/auth/signin" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tenadam Training, Consultancy & Research PLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
