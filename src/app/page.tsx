'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, CheckCircle, Users, Building2, TrendingUp, Shield, Target, Award } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 animate-fade-in-up animation-delay-200">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src="/tenadam-logo.png"
                  alt="Tenadam Logo"
                  width={48}
                  height={48}
                  className="object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Assessment Hub
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  by <span className="text-teal-600 font-semibold">Tenadam Training, Consultancy & Research PLC</span>
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 animate-fade-in-up animation-delay-400">
              <Link
                href="/about"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link
                href="/auth/signin"
                className="relative group px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden animate-fade-in-up animation-delay-400">
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Transform Your Organization with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-emerald-600 mt-2 animate-gradient animate-float">
                Data-Driven Assessments
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              A comprehensive assessment platform designed by Tenadam Training, Consultancy & Research PLC 
              to help organizations assess culture, performance, and excellence. Powered by proven frameworks including OCAI and Baldrige.
            </p>
            <div className="mt-10 animate-fade-in-up animation-delay-400">
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-lg font-medium rounded-lg hover:from-teal-800 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
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
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-fade-in-up">
            Powerful Features for Organizations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow hover:shadow-2xl hover:border-teal-400 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer animate-fade-in-up animation-delay-200 hover:rotate-1 hover:bg-gradient-to-br hover:from-teal-50 hover:to-white group">
              <div className="w-12 h-12 bg-teal-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-900 transition-all duration-300 hover:rotate-12 hover:scale-110 transform">
                <Users className="w-6 h-6 text-white group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-800 transition-colors duration-300">Multi-User Access</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                System administrators, facilitators, and employees - each with tailored access and permissions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow hover:shadow-2xl hover:border-emerald-400 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer animate-fade-in-up animation-delay-300 hover:rotate-1 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white group">
              <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-800 transition-all duration-300 hover:rotate-12 hover:scale-110 transform">
                <Building2 className="w-6 h-6 text-white group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-800 transition-colors duration-300">Organization Management</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Create and manage multiple organizations with custom branding and assessment access.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow hover:shadow-2xl hover:border-teal-400 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer animate-fade-in-up animation-delay-400 hover:rotate-1 hover:bg-gradient-to-br hover:from-teal-50 hover:to-white group">
              <div className="w-12 h-12 bg-teal-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-800 transition-all duration-300 hover:rotate-12 hover:scale-110 transform">
                <Shield className="w-6 h-6 text-white group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-800 transition-colors duration-300">Secure Access Keys</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Generate unique access codes for employees to participate in assessments anonymously and securely.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow hover:shadow-2xl hover:border-teal-400 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer animate-fade-in-up animation-delay-500 hover:rotate-1 hover:bg-gradient-to-br hover:from-teal-50 hover:to-white group">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-700 transition-all duration-300 hover:rotate-12 hover:scale-110 transform">
                <TrendingUp className="w-6 h-6 text-white group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors duration-300">Real-Time Analytics</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Track participation, view aggregate results, and gain insights with comprehensive reporting tools.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow hover:shadow-2xl hover:border-teal-400 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer animate-fade-in-up animation-delay-600 hover:rotate-1 hover:bg-gradient-to-br hover:from-teal-50 hover:to-white group">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-all duration-300 hover:rotate-12 hover:scale-110 transform">
                <Target className="w-6 h-6 text-white group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-300">OCAI Assessment</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Measure organizational culture across 6 dimensions using the proven Competing Values Framework.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow hover:shadow-2xl hover:border-teal-400 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer animate-fade-in-up animation-delay-700 hover:rotate-1 hover:bg-gradient-to-br hover:from-teal-50 hover:to-white group">
              <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-500 transition-all duration-300 hover:rotate-12 hover:scale-110 transform">
                <Award className="w-6 h-6 text-white group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-500 transition-colors duration-300">Baldrige Framework</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Assess organizational excellence across 7 categories with the 1000-point Baldrige system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-fade-in-up">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up animation-delay-200 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-teal-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 hover:bg-teal-800 transition-colors duration-300 hover:rotate-12 transform">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Sign In</h4>
              <p className="text-gray-600">
                Administrators and facilitators sign in with credentials. Employees use secure access keys.
              </p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-400 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 hover:bg-emerald-700 transition-colors duration-300 hover:rotate-12 transform">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Take Assessment</h4>
              <p className="text-gray-600">
                Choose from available assessments (OCAI, Baldrige) and complete them at your own pace.
              </p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-600 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-slate-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 hover:bg-slate-800 transition-colors duration-300 hover:rotate-12 transform">
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
          <h3 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            Ready to Transform Your Organization?
          </h3>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in-up animation-delay-200">
            Join organizations worldwide using Tenadam's assessment platform to drive meaningful change and organizational excellence.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-lg font-medium rounded-lg hover:from-teal-800 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform animate-fade-in-up animation-delay-400"
          >
            Get Started Today
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="animate-fade-in-up animation-delay-200">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img
                    src="/tenadam-logo.png"
                    alt="Tenadam Logo"
                    width={40}
                    height={40}
                    className="object-contain hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-xl font-bold">Assessment Hub</span>
              </div>
              <p className="text-gray-400">
                Empowering organizations through data-driven assessments and insights.
              </p>
            </div>
            <div className="animate-fade-in-up animation-delay-400">
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/auth/signin" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Sign In</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Contact</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in-up animation-delay-600">
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 animate-fade-in-up animation-delay-800">
            <p>&copy; 2024 Tenadam Training, Consultancy & Research PLC. All rights reserved.</p>
          </div>
      </div>
      </footer>
    </div>
  )
}
