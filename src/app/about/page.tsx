"use client";

import Link from "next/link";
import { ArrowLeft, Users, Target, Award, Globe, Heart, BookOpen, Lightbulb, BarChart3, Building2, TrendingUp } from "lucide-react";

export default function AboutPage() {
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-8">
            <Building2 className="w-10 h-10 text-teal-700" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Tenadam Training, Consultancy & Research PLC
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering organizations through comprehensive assessment solutions, training programs, 
            and strategic consultancy services across Africa and the Middle East.
          </p>
        </div>

        {/* Company Overview */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Established in 2023 through the merger of six experienced professionals, 
                  Tenadam Training, Consultancy, and Research PLC has rapidly emerged as a 
                  trusted partner for organizations seeking transformative solutions.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  The name "Tenadam," meaning rue (a healing herb), symbolizes our commitment 
                  to being the remedy for business challenges. Just as rue has been used 
                  throughout history for its healing properties, we provide healing solutions 
                  for organizational challenges.
                </p>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-teal-900 mb-2 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Local Impact, Global Vision
                  </h3>
                  <p className="text-teal-800 text-sm">
                    As a company deeply rooted in Ethiopia, we are committed to making a positive 
                    and sustainable impact on local communities while expanding our reach across 
                    Africa and the Middle East.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl p-8 text-center">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Founded</h4>
                      <p className="text-2xl font-bold text-teal-600">2023</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Team</h4>
                      <p className="text-2xl font-bold text-emerald-600">6+ Experts</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Regions</h4>
                      <p className="text-lg font-bold text-teal-600">Africa & Middle East</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Vision Year</h4>
                      <p className="text-2xl font-bold text-emerald-600">2035</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 border border-teal-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-teal-900">Our Mission</h2>
              </div>
              <p className="text-teal-800 leading-relaxed">
                To assist business partners by providing practical solutions to their challenges 
                in a value-adding manner. We aim to support our clients in achieving their goals 
                and overcoming obstacles through our expertise in training, consultancy, and research.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 border border-emerald-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-900">Our Vision</h2>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                To become a notable and preferred company in training, consultancy, and research 
                services in Africa and the Middle East by the year 2035. We envision being the 
                go-to partner for organizations seeking excellence and transformation.
              </p>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions designed to drive organizational excellence and sustainable growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Training Services */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Training Services</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Leadership and Management</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Quality Enhancement and Standardization</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Accounting and Finance</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Marketing and Service Management</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>IT, Business, and General Skills</span>
                </li>
              </ul>
            </div>

            {/* Consultancy Services */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Consultancy Services</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Business Strategy</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Process Optimization</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Change Management</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Organizational Development</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Market Research and Analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Risk Management</span>
                </li>
              </ul>
            </div>

            {/* Research Services */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Research Services</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Competitive Analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Feasibility Studies</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Industry Research</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Data Analysis and Interpretation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Custom Research Projects</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Assessment Platform Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-slate-900 to-gray-800 rounded-2xl p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Assessment Hub Platform</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Our cutting-edge Assessment Hub represents the convergence of our expertise in 
                  organizational development and technological innovation. Built specifically for 
                  modern organizations, it provides comprehensive assessment solutions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-gray-300">OCAI (Organizational Culture Assessment Instrument) integration</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-gray-300">Baldrige Excellence Framework assessments</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-gray-300">Advanced analytics and reporting capabilities</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-gray-300">Multi-user access with role-based permissions</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-xl p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                      <h4 className="font-semibold mb-2">Real-time Analytics</h4>
                      <p className="text-sm text-gray-300">Live insights and reporting</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6 text-center">
                      <Users className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                      <h4 className="font-semibold mb-2">Multi-User Support</h4>
                      <p className="text-sm text-gray-300">Administrators, facilitators, employees</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6 text-center">
                      <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <h4 className="font-semibold mb-2">Advanced Reports</h4>
                      <p className="text-sm text-gray-300">Comprehensive data visualization</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6 text-center">
                      <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <h4 className="font-semibold mb-2">Industry Standards</h4>
                      <p className="text-sm text-gray-300">OCAI & Baldrige frameworks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Tenadam */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Tenadam?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our unique approach combines local expertise with international best practices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Impact, Global Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Deeply rooted in Ethiopia with a vision to serve across Africa and the Middle East, 
                we understand both local challenges and international best practices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Client-Centric Approach</h3>
              <p className="text-gray-600 leading-relaxed">
                We place the success of our clients at the forefront of our operations, ensuring 
                every solution is tailored to meet specific organizational needs and objectives.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expertise & Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Our team comprises seasoned professionals with diverse and extensive experience 
                in training, consultancy, and research across various industries and sectors.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ready to transform your organization? Let's discuss how we can help you achieve your goals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">Lem-Hotel Area<br />Addis Ababa, Ethiopia</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone Numbers</h4>
                      <div className="text-gray-600 space-y-1">
                        <p>+251-911-58-4260</p>
                        <p>+251-912-44-2502</p>
                        <p>+251-993-51-8990</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">info@tenadamconsulting.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Working Hours</h4>
                      <p className="text-gray-600">Monday - Friday<br />8:30 AM - 5:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Whether you're looking to assess your organizational culture, implement the Baldrige 
                  framework, or develop your team through comprehensive training programs, we're here to help.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium"
                  >
                    Access Assessment Hub
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Learn More About Our Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img
                src="/tenadam-logo.png"
                alt="Tenadam Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold">Tenadam Training, Consultancy & Research PLC</span>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Empowering organizations through comprehensive assessment solutions, training programs, 
              and strategic consultancy services.
            </p>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tenadam Training, Consultancy & Research PLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

