'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, Building2, Users, FileText, LogOut, Shield, ChevronDown, ChevronRight, FileSpreadsheet, BarChart3 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface OCAIResponse {
  id: string;
  demographics: any;
  nowScores: any;
  preferredScores: any;
  submittedAt: string;
  userId: string;
  surveyId: string;
}

interface UserAssessment {
  userId: string;
  userName: string;
  userEmail: string;
  accessKey: string;
  completedAt: string;
  surveyId: string | null;
  surveyTitle: string;
  responses: OCAIResponse[];
}

interface OrganizationData {
  organizationId: string;
  organizationName: string;
  users: UserAssessment[];
  totalUsers: number;
}

interface ResponseData {
  success: boolean;
  data: OrganizationData[];
  summary: {
    totalOrganizations: number;
    totalUsers: number;
    totalResponses: number;
  };
}

export default function AdminOCAIPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<OrganizationData[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/auth/signin');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'SYSTEM_ADMIN') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    loadOCAIData();
  }, [router]);

  const loadOCAIData = async () => {
    try {
      const response = await fetch('/api/admin/ocai/responses');
      if (response.ok) {
        const result: ResponseData = await response.json();
        setData(result.data);
        setSummary(result.summary);
      }
    } catch (error) {
      console.error('Failed to load OCAI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const toggleOrg = (orgId: string) => {
    const newExpanded = new Set(expandedOrgs);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedOrgs(newExpanded);
  };

  const toggleUser = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const exportToCSV = (org: OrganizationData) => {
    // Build CSV header
    const header = [
      'Organization',
      'User Name',
      'User Email',
      'Access Key',
      'Completed At',
      'Survey',
      'Now - Clan',
      'Now - Adhocracy',
      'Now - Market',
      'Now - Hierarchy',
      'Preferred - Clan',
      'Preferred - Adhocracy',
      'Preferred - Market',
      'Preferred - Hierarchy',
      'Demographics',
    ].join(',');

    // Build CSV rows
    const rows = org.users.map(user => {
      const response = user.responses[0]; // OCAI typically has one response per user
      const nowScores = response?.nowScores || {};
      const preferredScores = response?.preferredScores || {};
      const demographics = response?.demographics ? JSON.stringify(response.demographics).replace(/"/g, '""') : '';

      return [
        `"${org.organizationName}"`,
        `"${user.userName}"`,
        `"${user.userEmail}"`,
        `"${user.accessKey}"`,
        `"${new Date(user.completedAt).toLocaleString()}"`,
        `"${user.surveyTitle}"`,
        nowScores.clan || 0,
        nowScores.adhocracy || 0,
        nowScores.market || 0,
        nowScores.hierarchy || 0,
        preferredScores.clan || 0,
        preferredScores.adhocracy || 0,
        preferredScores.market || 0,
        preferredScores.hierarchy || 0,
        `"${demographics}"`,
      ].join(',');
    });

    const csv = [header, ...rows].join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ocai_${org.organizationName.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (org: OrganizationData) => {
    // Build Excel headers
    const headers = [
      'Organization',
      'User Name',
      'User Email',
      'Access Key',
      'Completed At',
      'Survey',
      'Now - Clan',
      'Now - Adhocracy',
      'Now - Market',
      'Now - Hierarchy',
      'Preferred - Clan',
      'Preferred - Adhocracy',
      'Preferred - Market',
      'Preferred - Hierarchy',
      'Demographics',
    ];

    // Build Excel data rows
    const rows = org.users.map(user => {
      const response = user.responses[0];
      const nowScores = response?.nowScores || {};
      const preferredScores = response?.preferredScores || {};
      const demographics = response?.demographics ? JSON.stringify(response.demographics) : '';

      return [
        org.organizationName,
        user.userName,
        user.userEmail,
        user.accessKey,
        new Date(user.completedAt).toLocaleString(),
        user.surveyTitle,
        nowScores.clan || 0,
        nowScores.adhocracy || 0,
        nowScores.market || 0,
        nowScores.hierarchy || 0,
        preferredScores.clan || 0,
        preferredScores.adhocracy || 0,
        preferredScores.market || 0,
        preferredScores.hierarchy || 0,
        demographics,
      ];
    });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Set column widths
    const colWidths = [
      { wch: 25 }, // Organization
      { wch: 20 }, // User Name
      { wch: 25 }, // User Email
      { wch: 15 }, // Access Key
      { wch: 20 }, // Completed At
      { wch: 25 }, // Survey
      { wch: 12 }, // Now - Clan
      { wch: 15 }, // Now - Adhocracy
      { wch: 12 }, // Now - Market
      { wch: 15 }, // Now - Hierarchy
      { wch: 15 }, // Preferred - Clan
      { wch: 18 }, // Preferred - Adhocracy
      { wch: 15 }, // Preferred - Market
      { wch: 18 }, // Preferred - Hierarchy
      { wch: 40 }, // Demographics
    ];
    worksheet['!cols'] = colWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OCAI Responses');

    // Download Excel file
    XLSX.writeFile(workbook, `ocai_${org.organizationName.replace(/\s+/g, '_')}_${Date.now()}.xlsx`);
  };

  const exportAllToCSV = () => {
    data.forEach(org => {
      exportToCSV(org);
    });
  };

  const exportAllToExcel = () => {
    data.forEach(org => {
      exportToExcel(org);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading OCAI data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OCAI Assessment Data</h1>
                <p className="text-sm text-gray-600">Organizational Culture Assessment Instrument</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportAllToCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export All CSV</span>
              </button>
              <button
                onClick={exportAllToExcel}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="text-sm font-medium">Export All Excel</span>
              </button>
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
              href="/admin/dashboard"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/organizations"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Organizations
            </Link>
            <Link
              href="/admin/ocai"
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
            >
              OCAI Responses
            </Link>
            <Link
              href="/admin/baldrige"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Baldrige Responses
            </Link>
            <Link
              href="/admin/surveys"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Surveys
            </Link>
            <Link
              href="/admin/settings"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Organizations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{summary?.totalOrganizations || 0}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Assessments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{summary?.totalUsers || 0}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{summary?.totalResponses || 0}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Organizations List */}
        <div className="space-y-4">
          {data.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No OCAI assessments completed yet</p>
              <p className="text-gray-500 text-sm mt-2">Completed assessments will appear here</p>
            </div>
          ) : (
            data.map(org => (
              <div key={org.organizationId} className="bg-white rounded-lg shadow">
                {/* Organization Header */}
                <div
                  className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOrg(org.organizationId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {expandedOrgs.has(org.organizationId) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                      <Building2 className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{org.organizationName}</h3>
                        <p className="text-sm text-gray-600">{org.totalUsers} completed assessment(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportToCSV(org);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">CSV</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportToExcel(org);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span className="text-sm font-medium">Excel</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Organization Users */}
                {expandedOrgs.has(org.organizationId) && (
                  <div className="p-6 space-y-4">
                    {org.users.map(user => (
                      <div key={user.userId} className="border border-gray-200 rounded-lg">
                        {/* User Header */}
                        <div
                          className="px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors rounded-t-lg"
                          onClick={() => toggleUser(user.userId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {expandedUsers.has(user.userId) ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                              <Users className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-medium text-gray-900">{user.userName}</p>
                                <p className="text-sm text-gray-600">
                                  {user.userEmail} • Access Key: {user.accessKey}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Completed: {new Date(user.completedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* User OCAI Scores */}
                        {expandedUsers.has(user.userId) && user.responses[0] && (
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              {/* Now Scores */}
                              <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-3">Current Culture (Now)</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-700">Clan:</span>
                                    <span className="text-sm font-medium">{user.responses[0].nowScores?.clan || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-700">Adhocracy:</span>
                                    <span className="text-sm font-medium">{user.responses[0].nowScores?.adhocracy || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-700">Market:</span>
                                    <span className="text-sm font-medium">{user.responses[0].nowScores?.market || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-700">Hierarchy:</span>
                                    <span className="text-sm font-medium">{user.responses[0].nowScores?.hierarchy || 0}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Preferred Scores */}
                              <div className="bg-green-50 rounded-lg p-4">
                                <h4 className="font-semibold text-green-900 mb-3">Preferred Culture</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-700">Clan:</span>
                                    <span className="text-sm font-medium">{user.responses[0].preferredScores?.clan || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-700">Adhocracy:</span>
                                    <span className="text-sm font-medium">{user.responses[0].preferredScores?.adhocracy || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-700">Market:</span>
                                    <span className="text-sm font-medium">{user.responses[0].preferredScores?.market || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-700">Hierarchy:</span>
                                    <span className="text-sm font-medium">{user.responses[0].preferredScores?.hierarchy || 0}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Demographics */}
                            {user.responses[0].demographics && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Demographics</h4>
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {JSON.stringify(user.responses[0].demographics, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
