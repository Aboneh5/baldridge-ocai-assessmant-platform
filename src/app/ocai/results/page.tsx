'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Download,
  Building2,
  Users,
  FileText,
  LogOut,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface OCAIScores {
  clan: number;
  adhocracy: number;
  market: number;
  hierarchy: number;
}

interface IndividualResult {
  responseId: string;
  userId: string;
  userName: string;
  userEmail: string;
  accessKey: string;
  submittedAt: string;
  nowScores: OCAIScores;
  preferredScores: OCAIScores;
  delta: OCAIScores;
}

interface OrganizationAggregate {
  n: number;
  now: OCAIScores;
  preferred: OCAIScores;
  delta: OCAIScores;
}

interface ResultsData {
  organization: {
    id: string;
    name: string;
  };
  totalResponses: number;
  individualResults: IndividualResult[];
  organizationAggregate: OrganizationAggregate | null;
}

interface Organization {
  id: string;
  name: string;
}

export default function OCAIResultsPage() {
  const router = useRouter();
  const radarChartRef = useRef<any>(null);
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'organization' | 'individual'>('organization');
  const [selectedIndividual, setSelectedIndividual] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/auth/signin');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'SYSTEM_ADMIN' && parsedUser.role !== 'FACILITATOR') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    loadOrganizations(parsedUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const loadOrganizations = async (currentUser: any) => {
    try {
      if (currentUser.role === 'SYSTEM_ADMIN') {
        // Admin can see all organizations
        const response = await fetch('/api/admin/organizations', {
          headers: {
            'x-user-id': currentUser.id,
          },
        });
        if (response.ok) {
          const result = await response.json();
          console.log('[loadOrganizations] All orgs:', result.organizations?.map(o => ({ id: o.id, name: o.name })));
          setOrganizations(result.organizations || []);
          if (result.organizations && result.organizations.length > 0) {
            // Try to find an organization with responses
            let selectedOrg = null;
            for (const org of result.organizations) {
              const checkResponse = await fetch(`/api/ocai/organization-results?organizationId=${org.id}`, {
                headers: { 'x-user-id': currentUser.id },
              });
              if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                if (checkData.data?.totalResponses > 0) {
                  selectedOrg = org;
                  console.log('[loadOrganizations] Found org with responses:', org.name, '(', org.id, ') - ', checkData.data.totalResponses, 'responses');
                  break;
                }
              }
            }

            // If no org has responses, just select first one
            const orgToSelect = selectedOrg || result.organizations[0];
            console.log('[loadOrganizations] Auto-selecting org:', orgToSelect.name, '(', orgToSelect.id, ')');
            setSelectedOrgId(orgToSelect.id);
            loadResults(orgToSelect.id, currentUser);
          } else {
            setLoading(false);
          }
        }
      } else if (currentUser.role === 'FACILITATOR' && currentUser.organizationId) {
        // Facilitator can only see their own organization
        const response = await fetch(`/api/admin/organizations/${currentUser.organizationId}`, {
          headers: {
            'x-user-id': currentUser.id,
          },
        });
        if (response.ok) {
          const result = await response.json();
          setOrganizations([result.organization]);
          setSelectedOrgId(currentUser.organizationId);
          loadResults(currentUser.organizationId, currentUser);
        }
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const loadResults = async (orgId?: string, currentUser?: any) => {
    const organizationId = orgId || selectedOrgId;
    const userToUse = currentUser || user;

    console.log('[loadResults] orgId:', orgId, 'selectedOrgId:', selectedOrgId, 'user:', userToUse);

    if (!organizationId || !userToUse) {
      console.error('[loadResults] Missing organizationId or user!', { organizationId, userToUse });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const url = `/api/ocai/organization-results?organizationId=${organizationId}`;
      console.log('[loadResults] Fetching:', url, 'with userId:', userToUse.id);

      const response = await fetch(url, {
        headers: {
          'x-user-id': userToUse.id,
        },
      });

      console.log('[loadResults] Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('[loadResults] API result:', JSON.stringify(result, null, 2));
        console.log('[loadResults] result.data:', result.data);
        console.log('[loadResults] organizationAggregate:', result.data?.organizationAggregate);
        setData(result.data);
      } else {
        const errorText = await response.text();
        console.error('[loadResults] Failed to fetch results:', errorText);
      }
    } catch (error) {
      console.error('[loadResults] Exception:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrgChange = (newOrgId: string) => {
    setSelectedOrgId(newOrgId);
    loadResults(newOrgId);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const getRadarChartData = (nowScores: OCAIScores, preferredScores: OCAIScores) => {
    return {
      labels: ['Clan (Collaborate)', 'Adhocracy (Create)', 'Market (Compete)', 'Hierarchy (Control)'],
      datasets: [
        {
          label: 'Current Culture',
          data: [nowScores.clan, nowScores.adhocracy, nowScores.market, nowScores.hierarchy],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        },
        {
          label: 'Preferred Culture',
          data: [preferredScores.clan, preferredScores.adhocracy, preferredScores.market, preferredScores.hierarchy],
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
        },
      ],
    };
  };

  const radarOptions: ChartOptions<'radar'> = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const exportToPDF = async () => {
    if (!data || !data.organizationAggregate) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(59, 130, 246);
    pdf.text('OCAI Assessment Report', pageWidth / 2, 20, { align: 'center' });

    // Organization info
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Organization: ${data.organization.name}`, 20, 35);
    pdf.text(`Total Responses: ${data.totalResponses}`, 20, 42);
    pdf.text(`Report Generated: ${new Date().toLocaleString()}`, 20, 49);

    // Organization-wide results
    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Organization-Wide Results', 20, 65);

    // Scores table
    pdf.setFontSize(10);
    const aggregate = data.organizationAggregate;

    (pdf as any).autoTable({
      startY: 75,
      head: [['Dimension', 'Current', 'Preferred', 'Delta', 'Change']],
      body: [
        ['Clan (Collaborate)', aggregate.now.clan.toFixed(2), aggregate.preferred.clan.toFixed(2), aggregate.delta.clan.toFixed(2), getDeltaIcon(aggregate.delta.clan)],
        ['Adhocracy (Create)', aggregate.now.adhocracy.toFixed(2), aggregate.preferred.adhocracy.toFixed(2), aggregate.delta.adhocracy.toFixed(2), getDeltaIcon(aggregate.delta.adhocracy)],
        ['Market (Compete)', aggregate.now.market.toFixed(2), aggregate.preferred.market.toFixed(2), aggregate.delta.market.toFixed(2), getDeltaIcon(aggregate.delta.market)],
        ['Hierarchy (Control)', aggregate.now.hierarchy.toFixed(2), aggregate.preferred.hierarchy.toFixed(2), aggregate.delta.hierarchy.toFixed(2), getDeltaIcon(aggregate.delta.hierarchy)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Capture radar chart
    if (radarChartRef.current) {
      const chartCanvas = radarChartRef.current.canvas;
      const chartImage = chartCanvas.toDataURL('image/png');
      const chartY = (pdf as any).lastAutoTable.finalY + 15;
      pdf.addImage(chartImage, 'PNG', 20, chartY, 170, 120);
    }

    // Individual results
    if (data.individualResults.length > 0) {
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setTextColor(59, 130, 246);
      pdf.text('Individual Results', 20, 20);

      const individualData = data.individualResults.map(result => [
        result.userName,
        result.nowScores.clan.toFixed(1),
        result.nowScores.adhocracy.toFixed(1),
        result.nowScores.market.toFixed(1),
        result.nowScores.hierarchy.toFixed(1),
      ]);

      (pdf as any).autoTable({
        startY: 30,
        head: [['Name', 'Clan', 'Adhocracy', 'Market', 'Hierarchy']],
        body: individualData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      });
    }

    // Footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text('Generated by Tenadam Assessment Hub - OCAI Report', pageWidth / 2, footerY, { align: 'center' });

    // Save PDF
    pdf.save(`OCAI_Report_${data.organization.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  };

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return '↑ Increase';
    if (delta < 0) return '↓ Decrease';
    return '→ No Change';
  };

  const DeltaIndicator = ({ value }: { value: number }) => {
    if (value > 0) {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">+{value.toFixed(2)}</span>
        </div>
      );
    }
    if (value < 0) {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{value.toFixed(2)}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-gray-600">
        <Minus className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">0.00</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading OCAI results...</p>
        </div>
      </div>
    );
  }

  const getDashboardLink = () => {
    if (user?.role === 'SYSTEM_ADMIN') {
      return '/admin/dashboard';
    } else if (user?.role === 'FACILITATOR') {
      return '/facilitator/dashboard';
    }
    return '/dashboard';
  };

  const aggregate = data?.organizationAggregate;
  const chartData = aggregate ? getRadarChartData(aggregate.now, aggregate.preferred) : null;

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
                <h1 className="text-xl font-bold text-gray-900">OCAI Results</h1>
                <p className="text-sm text-gray-600">{data.organization.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export PDF</span>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Organization Selector (for SYSTEM_ADMIN) */}
        {user?.role === 'SYSTEM_ADMIN' && organizations.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center space-x-4">
              <Building2 className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Organization
                </label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => handleOrgChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Organization Display (for FACILITATOR) */}
        {user?.role === 'FACILITATOR' && data?.organization && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center space-x-4">
              <Building2 className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization
                </label>
                <p className="text-xl font-semibold text-gray-900">{data.organization.name}</p>
                <p className="text-sm text-gray-500 mt-1">Viewing results for your organization</p>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {(!data || !data.organizationAggregate) && (
          <div className="bg-white rounded-lg shadow p-12 text-center mb-8">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No OCAI Results Available</h3>
            <p className="text-gray-600 mb-1">
              {data?.organization?.name ? `No responses yet for ${data.organization.name}` : 'No data available'}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Employees can complete OCAI assessments using access keys. Results will appear here once submitted.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={getDashboardLink()}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Dashboard
              </Link>
              {user?.role === 'SYSTEM_ADMIN' && (
                <Link
                  href="/admin/access-keys"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Access Keys
                </Link>
              )}
              {user?.role === 'FACILITATOR' && (
                <Link
                  href="/facilitator/access-keys"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Access Keys
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Results Section - Only show if we have data */}
        {data && data.organizationAggregate && (
          <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Organization</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{data.organization.name}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{data.totalResponses}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">View Mode</p>
                <select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value as 'organization' | 'individual')}
                  className="mt-2 text-lg font-semibold text-gray-900 border-none focus:outline-none bg-transparent cursor-pointer"
                >
                  <option value="organization">Organization-Wide</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Organization-Wide View */}
        {selectedView === 'organization' && (
          <>
            {/* Radar Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Culture Profile</h2>
              <div className="max-w-2xl mx-auto">
                <Radar ref={radarChartRef} data={chartData} options={radarOptions} />
              </div>
            </div>

            {/* Scores Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Organization-Wide Scores (Mean)</h2>
                <p className="text-sm text-gray-600 mt-1">Based on {aggregate.n} responses</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimension</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Clan (Collaborate)</div>
                        <div className="text-xs text-gray-500">Family-like, mentoring</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aggregate.now.clan.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aggregate.preferred.clan.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><DeltaIndicator value={aggregate.delta.clan} /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Adhocracy (Create)</div>
                        <div className="text-xs text-gray-500">Dynamic, entrepreneurial</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aggregate.now.adhocracy.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aggregate.preferred.adhocracy.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><DeltaIndicator value={aggregate.delta.adhocracy} /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Market (Compete)</div>
                        <div className="text-xs text-gray-500">Results-oriented, competitive</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aggregate.now.market.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aggregate.preferred.market.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><DeltaIndicator value={aggregate.delta.market} /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Hierarchy (Control)</div>
                        <div className="text-xs text-gray-500">Structured, controlled</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aggregate.now.hierarchy.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aggregate.preferred.hierarchy.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><DeltaIndicator value={aggregate.delta.hierarchy} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Individual View */}
        {selectedView === 'individual' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Individual Results</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {data.individualResults.map(result => (
                <div key={result.responseId} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{result.userName}</h3>
                      <p className="text-sm text-gray-600">{result.userEmail}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(result.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-medium">Clan</p>
                      <p className="text-lg font-bold text-blue-900">{result.nowScores.clan.toFixed(1)}</p>
                      <p className="text-xs text-blue-600">→ {result.preferredScores.clan.toFixed(1)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 font-medium">Adhocracy</p>
                      <p className="text-lg font-bold text-green-900">{result.nowScores.adhocracy.toFixed(1)}</p>
                      <p className="text-xs text-green-600">→ {result.preferredScores.adhocracy.toFixed(1)}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-orange-600 font-medium">Market</p>
                      <p className="text-lg font-bold text-orange-900">{result.nowScores.market.toFixed(1)}</p>
                      <p className="text-xs text-orange-600">→ {result.preferredScores.market.toFixed(1)}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-red-600 font-medium">Hierarchy</p>
                      <p className="text-lg font-bold text-red-900">{result.nowScores.hierarchy.toFixed(1)}</p>
                      <p className="text-xs text-red-600">→ {result.preferredScores.hierarchy.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}
