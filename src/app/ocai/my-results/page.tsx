'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

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

interface MyOCAIResult {
  responseId: string;
  submittedAt: string;
  nowScores: OCAIScores;
  preferredScores: OCAIScores;
  delta: OCAIScores;
}

export default function MyOCAIResultsPage() {
  const router = useRouter();
  const radarChartRef = useRef<any>(null);
  const [user, setUser] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [myResult, setMyResult] = useState<MyOCAIResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedOrg = localStorage.getItem('organization');

    if (!storedUser || !storedOrg) {
      router.push('/auth/signin');
      return;
    }

    setUser(JSON.parse(storedUser));
    setOrganization(JSON.parse(storedOrg));
    loadMyResults();
  }, [router]);

  const loadMyResults = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      // Fetch user's own OCAI response
      const response = await fetch('/api/ocai/my-response', {
        headers: {
          'x-user-id': user.id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          setMyResult(data.response);
        }
      }
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRadarChartData = () => {
    if (!myResult) return null;

    return {
      labels: [
        'Clan (Collaborate)',
        'Adhocracy (Create)',
        'Market (Compete)',
        'Hierarchy (Control)',
      ],
      datasets: [
        {
          label: 'Current Culture',
          data: [
            myResult.nowScores.clan,
            myResult.nowScores.adhocracy,
            myResult.nowScores.market,
            myResult.nowScores.hierarchy,
          ],
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
          data: [
            myResult.preferredScores.clan,
            myResult.preferredScores.adhocracy,
            myResult.preferredScores.market,
            myResult.preferredScores.hierarchy,
          ],
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

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
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

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (delta < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getDeltaColor = (delta: number) => {
    if (delta > 0) return 'text-green-600';
    if (delta < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!myResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My OCAI Results</h1>
                  <p className="text-sm text-gray-600">{organization?.name}</p>
                </div>
              </div>
              <Link
                href="/employee/assessments"
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Assessments</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-6">
              You haven't completed the OCAI assessment yet.
            </p>
            <Link
              href="/assessments/ocai"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start OCAI Assessment
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const chartData = getRadarChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My OCAI Results</h1>
                <p className="text-sm text-gray-600">{organization?.name}</p>
              </div>
            </div>
            <Link
              href="/employee/assessments"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Assessments</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Completion Badge */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-blue-900">Assessment Completed!</h2>
              <p className="text-blue-700 text-sm">
                You completed the OCAI assessment on{' '}
                {new Date(myResult.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Culture Profile Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Culture Profile</h3>
          <div className="max-w-2xl mx-auto">
            {chartData && <Radar ref={radarChartRef} data={chartData} options={radarOptions} />}
          </div>
        </div>

        {/* Scores Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Your Scores</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Culture Type
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferred
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'Clan (Collaborate)', key: 'clan' as keyof OCAIScores },
                  { name: 'Adhocracy (Create)', key: 'adhocracy' as keyof OCAIScores },
                  { name: 'Market (Compete)', key: 'market' as keyof OCAIScores },
                  { name: 'Hierarchy (Control)', key: 'hierarchy' as keyof OCAIScores },
                ].map((dimension) => {
                  const delta = myResult.delta[dimension.key];
                  return (
                    <tr key={dimension.key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dimension.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                        {myResult.nowScores[dimension.key].toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                        {myResult.preferredScores[dimension.key].toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className={`flex items-center justify-center space-x-1 ${getDeltaColor(delta)}`}>
                          {getDeltaIcon(delta)}
                          <span className="font-medium">
                            {delta > 0 ? '+' : ''}
                            {delta.toFixed(2)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interpretation Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Understanding Your Results</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Current:</strong> Your perception of the organization's current culture
            </p>
            <p>
              <strong>Preferred:</strong> Your desired culture for the organization in 5 years
            </p>
            <p>
              <strong>Change:</strong> The gap between current and preferred culture
            </p>
            <ul className="list-disc list-inside ml-4 mt-3 space-y-1">
              <li>
                <strong className="text-green-700">Positive values (+)</strong> indicate you want
                more of this culture type
              </li>
              <li>
                <strong className="text-red-700">Negative values (-)</strong> indicate you want less
                of this culture type
              </li>
              <li>
                <strong>Zero (0)</strong> indicates alignment between current and preferred
              </li>
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/employee/assessments"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
