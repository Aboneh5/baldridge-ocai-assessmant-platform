"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText, CheckCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                <h1 className="text-2xl font-bold text-gray-900">Assessment Hub</h1>
                <p className="text-sm text-teal-700 font-medium">by Tenadam Training, Consultancy & Research PLC</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 text-teal-700 hover:text-teal-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-6">
            <Shield className="w-8 h-8 text-teal-700" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy and data security are fundamental to our assessment platform. 
            Learn how we protect and handle your information.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: January 2024
          </div>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 text-teal-600 mr-3" />
            Privacy at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Secure Data Handling</h3>
                <p className="text-gray-600 text-sm">All assessment data is encrypted and stored securely</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Anonymous Responses</h3>
                <p className="text-gray-600 text-sm">Individual responses are anonymized for privacy protection</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Database className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Data Minimization</h3>
                <p className="text-gray-600 text-sm">We collect only what's necessary for assessments</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Your Rights</h3>
                <p className="text-gray-600 text-sm">You have full control over your personal data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Tenadam Training, Consultancy & Research PLC ("we," "our," or "us") operates the Assessment Hub platform 
                (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our organizational assessment platform.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                We are committed to protecting your privacy and ensuring the security of your personal information. 
                This policy applies to all users of our assessment platform, including administrators, facilitators, 
                and assessment participants.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Account Information:</strong> Name, email address, organization affiliation, role</li>
                <li><strong>Contact Information:</strong> Business address, phone number (for administrators)</li>
                <li><strong>Authentication Data:</strong> Login credentials and access keys</li>
                <li><strong>Profile Information:</strong> Job title, department, assessment preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Assessment Data</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Response Data:</strong> Assessment answers and scores (anonymized for individual responses)</li>
                <li><strong>Metadata:</strong> Assessment completion times, progress tracking</li>
                <li><strong>Aggregate Data:</strong> Group statistics and organizational insights</li>
                <li><strong>Consent Records:</strong> Your agreement to participate in assessments</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.3 Technical Information</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Usage Data:</strong> Platform interactions, feature usage, session duration</li>
                <li><strong>Device Information:</strong> Browser type, operating system, IP address (hashed)</li>
                <li><strong>Log Data:</strong> System logs, error reports, performance metrics</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Primary Purposes</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide and maintain our assessment platform services</li>
                <li>Process and analyze assessment responses for organizational insights</li>
                <li>Generate reports and analytics for authorized users</li>
                <li>Manage user accounts and access permissions</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Secondary Purposes</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Improve our platform functionality and user experience</li>
                <li>Conduct research and development for assessment methodologies</li>
                <li>Provide customer support and technical assistance</li>
                <li>Comply with legal obligations and regulatory requirements</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Within Your Organization</h3>
              <p className="text-gray-600 leading-relaxed">
                Assessment results are shared only with authorized personnel within your organization, 
                such as administrators and designated facilitators. Individual responses remain anonymous 
                unless explicitly consented otherwise.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Service Providers</h3>
              <p className="text-gray-600 leading-relaxed">
                We may share information with trusted third-party service providers who assist in platform 
                operations, including cloud hosting, data analytics, and customer support. All service 
                providers are bound by strict confidentiality agreements.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Legal Requirements</h3>
              <p className="text-gray-600 leading-relaxed">
                We may disclose information when required by law, legal process, or to protect our rights, 
                property, or safety, or that of our users or the public.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-teal-900 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Measures
                </h3>
                <ul className="list-disc list-inside text-teal-800 space-y-2">
                  <li>End-to-end encryption for data transmission and storage</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and role-based permissions</li>
                  <li>Secure data centers with physical and logical security</li>
                  <li>Employee training on data protection best practices</li>
                </ul>
              </div>

              <p className="text-gray-600 leading-relaxed">
                While we implement industry-standard security measures, no method of transmission over the internet 
                or electronic storage is 100% secure. We continuously work to improve our security practices and 
                respond to emerging threats.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Retention Periods</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Account Information:</strong> Retained while your account is active and for 3 years after closure</li>
                <li><strong>Assessment Data:</strong> Retained for 7 years for research and organizational analysis</li>
                <li><strong>Technical Logs:</strong> Retained for 1 year for security and performance monitoring</li>
                <li><strong>Communication Records:</strong> Retained for 3 years for customer support purposes</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 Data Deletion</h3>
              <p className="text-gray-600 leading-relaxed">
                Upon request or account closure, we will delete your personal information within 30 days, 
                except where retention is required by law or for legitimate business purposes.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="font-semibold text-emerald-900 mb-3">Access & Portability</h3>
                  <p className="text-emerald-800 text-sm">Request a copy of your personal data and assessment results</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="font-semibold text-emerald-900 mb-3">Correction</h3>
                  <p className="text-emerald-800 text-sm">Update or correct inaccurate personal information</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="font-semibold text-emerald-900 mb-3">Deletion</h3>
                  <p className="text-emerald-800 text-sm">Request deletion of your personal data</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="font-semibold text-emerald-900 mb-3">Restriction</h3>
                  <p className="text-emerald-800 text-sm">Limit how we process your personal information</p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mt-6">
                To exercise these rights, please contact us at privacy@tenadamconsulting.com. 
                We will respond to your request within 30 days.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Essential Cookies</h3>
              <p className="text-gray-600 leading-relaxed">
                We use essential cookies for platform functionality, authentication, and security. 
                These cookies are necessary for the platform to operate properly.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.2 Analytics Cookies</h3>
              <p className="text-gray-600 leading-relaxed">
                We use analytics cookies to understand platform usage and improve user experience. 
                These cookies collect aggregated, anonymized data.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.3 Cookie Management</h3>
              <p className="text-gray-600 leading-relaxed">
                You can manage cookie preferences through your browser settings. Note that disabling 
                essential cookies may affect platform functionality.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country 
                of residence. We ensure appropriate safeguards are in place for international transfers, 
                including standard contractual clauses and adequacy decisions.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our platform is designed for organizational use and is not intended for individuals under 16 years of age. 
                We do not knowingly collect personal information from children under 16. If you become aware that a child 
                has provided us with personal information, please contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                Your continued use of the platform after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Protection Officer</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email:</strong> privacy@tenadamconsulting.com</p>
                  <p><strong>Phone:</strong> +251-993-51-8990</p>
                  <p><strong>Address:</strong> Tenadam Training, Consultancy & Research PLC</p>
                  <p className="ml-4">Addis Ababa, Ethiopia</p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mt-6">
                If you have any questions about this Privacy Policy or our data practices, 
                please don't hesitate to contact us. We are committed to addressing your concerns 
                and ensuring your privacy rights are respected.
              </p>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Terms of Service
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Tenadam Training, Consultancy & Research PLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
