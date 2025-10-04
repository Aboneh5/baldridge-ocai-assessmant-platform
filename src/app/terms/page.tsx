"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle, Users, Building2, BarChart3 } from "lucide-react";

export default function TermsOfServicePage() {
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
            <FileText className="w-8 h-8 text-teal-700" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            These terms govern your use of our assessment platform. Please read them carefully 
            before using our services.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: January 2024
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-amber-900 mb-2">Important Notice</h2>
              <p className="text-amber-800">
                By accessing or using our Assessment Hub platform, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>
          </div>
        </div>

        {/* Key Terms Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 text-teal-600 mr-3" />
            Key Terms Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">User Responsibilities</h3>
                <p className="text-gray-600 text-sm">Provide accurate information and use the platform appropriately</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Data Protection</h3>
                <p className="text-gray-600 text-sm">Your assessment data is protected and used responsibly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Organizational Use</h3>
                <p className="text-gray-600 text-sm">Platform designed for legitimate organizational assessment purposes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Assessment Integrity</h3>
                <p className="text-gray-600 text-sm">Maintain the integrity and confidentiality of assessments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
            
            {/* Agreement to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and 
                Tenadam Training, Consultancy & Research PLC ("Company," "we," "our," or "us") regarding 
                your use of the Assessment Hub platform and services.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                By accessing, browsing, or using our platform, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms and our Privacy Policy.
              </p>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Platform Overview</h3>
              <p className="text-gray-600 leading-relaxed">
                The Assessment Hub is a comprehensive organizational assessment platform that provides:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-3">
                <li>Organizational Culture Assessment (OCAI) tools</li>
                <li>Baldrige Excellence Framework assessments</li>
                <li>Multi-user access management for organizations</li>
                <li>Secure assessment data collection and analysis</li>
                <li>Reporting and analytics capabilities</li>
                <li>Data export and visualization tools</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 User Roles</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Administrators:</strong> Full platform access, user management, organization settings</li>
                <li><strong>Facilitators:</strong> Assessment management, participant access, report generation</li>
                <li><strong>Employees/Participants:</strong> Assessment participation, response submission</li>
              </ul>
            </section>

            {/* User Accounts and Registration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Registration</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-600 leading-relaxed">
                To access certain features of the platform, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-3">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as necessary</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Account Types</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Credential-based accounts:</strong> For administrators and facilitators</li>
                <li><strong>Access key accounts:</strong> For assessment participants</li>
                <li><strong>Demo accounts:</strong> For testing and evaluation purposes</li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Permitted Uses</h3>
              <p className="text-gray-600 leading-relaxed">You may use the platform for:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-3">
                <li>Legitimate organizational assessment purposes</li>
                <li>Conducting authorized organizational culture evaluations</li>
                <li>Baldrige excellence framework assessments</li>
                <li>Generating reports for authorized stakeholders</li>
                <li>Training and development activities</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Prohibited Uses</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold mb-2">You may NOT use the platform to:</p>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to gain unauthorized access to the platform</li>
                  <li>Interfere with platform functionality or security</li>
                  <li>Use automated systems to access the platform</li>
                  <li>Collect user information without authorization</li>
                  <li>Share assessment responses inappropriately</li>
                  <li>Use the platform for commercial purposes without permission</li>
                </ul>
              </div>
            </section>

            {/* Assessment Data and Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Assessment Data and Privacy</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Data Ownership</h3>
              <p className="text-gray-600 leading-relaxed">
                Assessment data belongs to the organization that commissioned the assessment. 
                Individual responses are anonymized and aggregated for privacy protection.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Data Usage</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Assessment data is used solely for organizational analysis and reporting</li>
                <li>Individual responses remain confidential and anonymous</li>
                <li>Aggregate data may be used for platform improvement and research</li>
                <li>Data sharing is limited to authorized organizational personnel</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.3 Consent</h3>
              <p className="text-gray-600 leading-relaxed">
                By participating in assessments, you consent to the collection, processing, 
                and use of your responses as described in our Privacy Policy.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Platform Content</h3>
              <p className="text-gray-600 leading-relaxed">
                The Assessment Hub platform, including its design, functionality, and content, 
                is owned by Tenadam Training, Consultancy & Research PLC and protected by 
                intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 Assessment Frameworks</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>OCAI (Organizational Culture Assessment Instrument) is used under license</li>
                <li>Baldrige Excellence Framework is used in accordance with NIST guidelines</li>
                <li>Custom assessment content may be subject to additional licensing terms</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.3 User Content</h3>
              <p className="text-gray-600 leading-relaxed">
                You retain ownership of your assessment responses and organizational data. 
                By using the platform, you grant us a limited license to process and analyze 
                your data for service delivery purposes.
              </p>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Availability</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Uptime Commitment</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive to maintain high platform availability but do not guarantee uninterrupted service. 
                Scheduled maintenance will be communicated in advance when possible.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.2 Service Modifications</h3>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of the platform 
                with reasonable notice to users.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.3 Data Backup</h3>
              <p className="text-gray-600 leading-relaxed">
                We implement regular data backup procedures, but users are responsible for 
                maintaining their own copies of important data.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-3">Important Legal Notice</h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  To the maximum extent permitted by law, Tenadam Training, Consultancy & Research PLC 
                  shall not be liable for any indirect, incidental, special, consequential, or punitive 
                  damages, including but not limited to loss of profits, data, or business opportunities, 
                  arising from your use of the platform.
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed mt-4">
                Our total liability for any claims arising from these Terms or your use of the platform 
                shall not exceed the amount you paid for the service in the 12 months preceding the claim.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-600 leading-relaxed">
                You agree to indemnify and hold harmless Tenadam Training, Consultancy & Research PLC 
                from any claims, damages, or expenses arising from your use of the platform, violation 
                of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">10.1 Termination by You</h3>
              <p className="text-gray-600 leading-relaxed">
                You may terminate your account at any time by contacting our support team. 
                Upon termination, your access to the platform will be discontinued.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.2 Termination by Us</h3>
              <p className="text-gray-600 leading-relaxed">
                We may suspend or terminate your account if you violate these Terms, engage in 
                prohibited activities, or for other legitimate business reasons with reasonable notice.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.3 Effect of Termination</h3>
              <p className="text-gray-600 leading-relaxed">
                Upon termination, your right to use the platform ceases immediately. We will 
                retain your data according to our Privacy Policy and data retention policies.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law and Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">11.1 Governing Law</h3>
              <p className="text-gray-600 leading-relaxed">
                These Terms are governed by the laws of Ethiopia, without regard to conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">11.2 Dispute Resolution</h3>
              <p className="text-gray-600 leading-relaxed">
                Any disputes arising from these Terms or your use of the platform shall be resolved 
                through good faith negotiation. If negotiation fails, disputes shall be resolved 
                through binding arbitration in Addis Ababa, Ethiopia.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update these Terms from time to time. Material changes will be communicated 
                through the platform or via email. Your continued use of the platform after changes 
                constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal and Support Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Legal Department</h4>
                    <div className="space-y-1 text-gray-600 text-sm">
                      <p><strong>Email:</strong> legal@tenadamconsulting.com</p>
                      <p><strong>Phone:</strong> +251-993-51-8990</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Support</h4>
                    <div className="space-y-1 text-gray-600 text-sm">
                      <p><strong>Email:</strong> support@tenadamconsulting.com</p>
                      <p><strong>Phone:</strong> +251-993-51-8990</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-gray-600 text-sm">
                    <strong>Address:</strong> Tenadam Training, Consultancy & Research PLC<br />
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mt-6">
                If you have any questions about these Terms of Service, please contact us using 
                the information above. We are committed to addressing your concerns and ensuring 
                a clear understanding of your rights and obligations.
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
              href="/privacy"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
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
