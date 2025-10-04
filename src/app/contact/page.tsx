"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Clock, Send, MessageCircle, Building2, Users, Globe, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          organization: '',
          service: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrorMessage(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
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
            <MessageCircle className="w-10 h-10 text-teal-700" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your organization? Let's discuss how Tenadam's comprehensive 
            training, consultancy, and assessment services can help you achieve your goals.
          </p>
        </div>

        {/* Contact Information Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Address</h3>
              <p className="text-gray-600 leading-relaxed">
                Lem-Hotel Area<br />
                Addis Ababa, Ethiopia
              </p>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Phone Numbers</h3>
              <div className="space-y-2 text-gray-600">
                <p className="font-medium">+251-911-58-4260</p>
                <p className="font-medium">+251-912-44-2502</p>
                <p className="font-medium">+251-993-51-8990</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Email Address</h3>
              <p className="text-gray-600">
                <a href="mailto:info@tenadamconsulting.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  info@tenadamconsulting.com
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Working Hours */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-slate-900 to-gray-800 rounded-2xl p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Working Hours</h2>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Monday - Friday</h3>
                    <p className="text-gray-300">8:30 AM - 5:30 PM</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Our team is available during business hours to assist you with your training, 
                  consultancy, and assessment needs. We're committed to providing timely and 
                  professional support for all your organizational development requirements.
                </p>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-lg font-semibold mb-6">Quick Contact Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Call us directly</p>
                        <p className="text-sm text-gray-300">Available during business hours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Send us an email</p>
                        <p className="text-sm text-gray-300">We'll respond within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Visit our office</p>
                        <p className="text-sm text-gray-300">Lem-Hotel Area, Addis Ababa</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions about our services or need a custom solution? We'd love to hear from you.
              </p>
            </div>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-green-800">
                      Thank you for contacting us. We have received your message and will get back to you within 24 hours. 
                      You should also receive a confirmation email shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Error Sending Message</h3>
                    <p className="text-red-800">
                      {errorMessage || 'There was an error sending your message. Please try again or contact us directly.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your organization name"
                />
              </div>

              <div className="mb-8">
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Interest
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a service</option>
                  <option value="training">Training Services</option>
                  <option value="consultancy">Consultancy Services</option>
                  <option value="research">Research Services</option>
                  <option value="assessment">Assessment Hub Platform</option>
                  <option value="ocai">OCAI Assessment</option>
                  <option value="baldrige">Baldrige Framework</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Tell us about your needs, challenges, or questions..."
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-8 py-4 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium text-lg shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Service Areas */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Can Help</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the range of services we offer to support your organizational development goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Training Services */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Training Services</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Leadership and Management</li>
                <li>• Quality Enhancement and Standardization</li>
                <li>• Accounting and Finance</li>
                <li>• Marketing and Service Management</li>
                <li>• IT, Business and General Skills</li>
              </ul>
            </div>

            {/* Consultancy Services */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 border border-emerald-200">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-4">Consultancy Services</h3>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li>• Business Strategy</li>
                <li>• Process Optimization</li>
                <li>• Change Management</li>
                <li>• Organizational Development</li>
                <li>• Market Research and Analysis</li>
                <li>• Risk Management</li>
              </ul>
            </div>

            {/* Research Services */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 border border-teal-200">
              <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-teal-900 mb-4">Research Services</h3>
              <ul className="space-y-2 text-teal-800 text-sm">
                <li>• Competitive Analysis</li>
                <li>• Feasibility Studies</li>
                <li>• Industry Research</li>
                <li>• Data Analysis and Interpretation</li>
                <li>• Custom Research Projects</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what our clients think about our service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <span>★★★★★</span>
                </div>
              </div>
              <blockquote className="text-gray-600 leading-relaxed mb-6">
                "The support we received from Tenadam Research, Training, and Consultancy was truly exceptional. 
                Their meticulous research and practical training modules significantly boosted our operational 
                efficiency and helped us navigate complex challenges with confidence. A fantastic partner for 
                anyone seeking to enhance their capabilities!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Shem Assefa</p>
                  <p className="text-gray-600 text-sm">Client</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <span>★★★★★</span>
                </div>
              </div>
              <blockquote className="text-gray-600 leading-relaxed mb-6">
                "Tenadam Research, Training, and Consultancy has been instrumental in refining our strategic 
                approach. Their in-depth research and tailored training programs have equipped our team with 
                invaluable insights, leading to more effective decision-making and improved project outcomes. 
                We highly recommend their expertise!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Henok Gessesse</p>
                  <p className="text-gray-600 text-sm">Client</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-8 lg:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Experience?</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Transform your organization with our comprehensive training, consultancy, and assessment services. 
              Let's work together to achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-8 py-4 bg-white text-teal-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
              >
                Access Assessment Hub
              </Link>
              <a
                href="mailto:info@tenadamconsulting.com"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-teal-700 transition-colors font-medium text-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Us Directly
              </a>
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
              Transforming Potential into Performance through comprehensive training, consultancy, 
              and research services.
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
