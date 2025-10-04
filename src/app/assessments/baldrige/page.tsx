'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Clock, FileText, Award, CheckCircle, Info, BarChart3 } from 'lucide-react'

export default function BaldrigeIntroPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src="/tenadam-logo.png"
                  alt="Tenadam Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Baldrige Assessment</h1>
                <p className="text-sm text-emerald-600 font-medium">Excellence Framework Assessment</p>
              </div>
            </div>
            <Link
              href="/employee/assessments"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Back</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <Award className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Baldrige Excellence Framework Assessment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Evaluate your organization's performance across the seven categories of the Baldrige Excellence Framework
          </p>
        </div>

        {/* Assessment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
            <p className="text-gray-600">45-60 minutes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Questions</h3>
            <p className="text-gray-600">97 questions across 8 categories</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Format</h3>
            <p className="text-gray-600">Open-ended responses</p>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Assessment Categories</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-white rounded-lg border border-emerald-100">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                0
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Organizational Profile</h4>
                <p className="text-sm text-gray-600">Understanding your organization's environment, relationships, and challenges</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Leadership</h4>
                <p className="text-sm text-gray-600">How senior leaders guide and sustain your organization</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-100">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Strategy</h4>
                <p className="text-sm text-gray-600">How your organization develops strategic objectives and action plans</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-white rounded-lg border border-pink-100">
              <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Customers</h4>
                <p className="text-sm text-gray-600">How your organization engages customers and determines satisfaction</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-teal-50 to-white rounded-lg border border-teal-100">
              <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Measurement, Analysis, and Knowledge Management</h4>
                <p className="text-sm text-gray-600">How your organization selects, gathers, analyzes, and manages data and information</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-100">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                5
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Workforce</h4>
                <p className="text-sm text-gray-600">How your organization engages, manages, and develops your workforce</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-white rounded-lg border border-indigo-100">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                6
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Operations</h4>
                <p className="text-sm text-gray-600">How your organization designs, manages, and improves work systems and processes</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                7
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Results</h4>
                <p className="text-sm text-gray-600">Your organization's performance and improvement in key business areas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-12">
          <div className="flex items-start space-x-3 mb-4">
            <Info className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-emerald-900 mb-3">How It Works</h3>
              <div className="space-y-3 text-emerald-800">
                <p>
                  <strong>Step 1:</strong> You'll answer open-ended questions about different aspects of your organization.
                </p>
                <p>
                  <strong>Step 2:</strong> Questions are organized by categories and subcategories for easy navigation.
                </p>
                <p>
                  <strong>Step 3:</strong> Your responses are auto-saved as you type, so you can take breaks and return later.
                </p>
                <p>
                  <strong>Step 4:</strong> Navigate through categories using the "Continue" button after completing each section.
                </p>
                <p className="pt-2">
                  <strong>Remember:</strong> Be honest and specific in your responses. There are no right or wrong answers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips for Success */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Tips for Success</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Be specific:</strong> Provide concrete examples and details in your responses</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Think strategically:</strong> Consider both current practices and future improvements</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Take your time:</strong> Thoughtful responses lead to better insights</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Save frequently:</strong> Responses auto-save, but you can also manually save progress</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Navigate freely:</strong> You can move between sections and update answers anytime</span>
            </li>
          </ul>
        </div>

        {/* Privacy & Confidentiality */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy & Confidentiality</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Your responses are confidential and used only for organizational improvement</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Data is aggregated for analysis and reporting</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>You can pause and resume the assessment at any time</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Your honest feedback drives meaningful organizational change</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/employee/assessments"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
          >
            Back to Assessments
          </Link>
          <button
            onClick={() => router.push('/baldrige/assessment')}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl font-medium text-lg"
          >
            Start Baldrige Assessment
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Tenadam Training, Consultancy & Research PLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
