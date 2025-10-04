'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface BaldrigeQuestion {
  id: string;
  itemCode: string;
  questionText: string;
  orderIndex: number;
  userResponse: {
    responseText: string;
    timeSpent: number;
  } | null;
}

interface BaldrigeSubcategory {
  id: string;
  name: string;
  displayOrder: number;
  description?: string;
  points: number;
  questions: BaldrigeQuestion[];
}

interface BaldrigeCategory {
  id: string;
  name: string;
  displayOrder: number;
  description?: string;
  totalPoints: number;
  subcategories: BaldrigeSubcategory[];
}

export default function BaldrigeAssessmentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<BaldrigeCategory[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentSubcategoryIndex, setCurrentSubcategoryIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showOrgProfile, setShowOrgProfile] = useState(true);
  const [hasAccessKey, setHasAccessKey] = useState(false);
  const [accessKeyUser, setAccessKeyUser] = useState<any>(null);

  useEffect(() => {
    // Check for access key authentication first
    const storedUser = localStorage.getItem('user');
    const storedOrg = localStorage.getItem('organization');
    const storedTypes = localStorage.getItem('assessmentTypes');

    if (storedUser && storedOrg && storedTypes) {
      const types = JSON.parse(storedTypes);
      if (types.includes('BALDRIGE')) {
        setHasAccessKey(true);
        setAccessKeyUser(JSON.parse(storedUser));
        fetchCategories();
        fetchProgress();
        return;
      }
    }

    // Otherwise check NextAuth session
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/baldrige/assessment');
      return;
    }

    if (status === 'authenticated') {
      fetchCategories();
      fetchProgress();
    }
  }, [status]);

  const getHeaders = () => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    // Add user ID header if using access key auth
    if (hasAccessKey && accessKeyUser?.id) {
      headers['x-user-id'] = accessKeyUser.id;
    }

    return headers;
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/baldrige/categories', {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);

        // Load existing responses
        const initialResponses: Record<string, string> = {};
        data.data.forEach((cat: BaldrigeCategory) => {
          cat.subcategories.forEach((sub) => {
            sub.questions.forEach((q) => {
              if (q.userResponse?.responseText) {
                initialResponses[q.id] = q.userResponse.responseText;
              }
            });
          });
        });
        setResponses(initialResponses);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/baldrige/progress', {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success && data.data.completedQuestions) {
        setCompletedQuestions(new Set(data.data.completedQuestions));
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const saveResponse = async (questionId: string, responseText: string) => {
    setSaving(true);
    try {
      await fetch('/api/baldrige/response', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ questionId, responseText }),
      });
    } catch (error) {
      console.error('Error saving response:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));

    // Debounce auto-save
    const timeoutId = setTimeout(() => {
      saveResponse(questionId, value);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleSubcategoryComplete = async () => {
    const currentCategory = categories[currentCategoryIndex];
    const currentSubcategory = currentCategory?.subcategories[currentSubcategoryIndex];

    if (!currentSubcategory) return;

    const allQuestionsAnswered = currentSubcategory.questions.every(
      q => responses[q.id]?.trim()
    );

    if (!allQuestionsAnswered) {
      alert('Please answer all questions before proceeding.');
      return;
    }

    // Mark questions as completed
    const newCompleted = new Set(completedQuestions);
    currentSubcategory.questions.forEach(q => newCompleted.add(q.id));
    setCompletedQuestions(newCompleted);

    // Save progress
    await fetch('/api/baldrige/progress', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        completedQuestions: Array.from(newCompleted),
      }),
    });

    // Move to next subcategory or category
    if (currentSubcategoryIndex < currentCategory.subcategories.length - 1) {
      setCurrentSubcategoryIndex(currentSubcategoryIndex + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentSubcategoryIndex(0);
    } else {
      // Assessment complete
      await submitAssessment();
    }
  };

  const submitAssessment = async () => {
    try {
      const res = await fetch('/api/baldrige/submit', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (data.success) {
        alert('Congratulations! You have completed the Baldrige Excellence Framework Assessment.');
        router.push('/dashboard');
      } else {
        alert(data.message || 'Please complete all questions before submitting.');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    }
  };

  const handlePrevious = () => {
    if (currentSubcategoryIndex > 0) {
      setCurrentSubcategoryIndex(currentSubcategoryIndex - 1);
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      const prevCategory = categories[currentCategoryIndex - 1];
      setCurrentSubcategoryIndex(prevCategory.subcategories.length - 1);
    }
  };

  const getTotalPoints = () => {
    return categories.reduce((total, cat) => total + cat.totalPoints, 0);
  };

  const getCompletedPoints = () => {
    let points = 0;
    categories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        const allAnswered = sub.questions.every(q => responses[q.id]?.trim());
        if (allAnswered) {
          points += sub.points;
        }
      });
    });
    return points;
  };

  if (loading || (!hasAccessKey && status === 'loading')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Organizational Profile
  const orgProfileCategory = categories.find(c => c.displayOrder === 0);
  if (showOrgProfile && orgProfileCategory) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Baldrige Excellence Framework Assessment
              </h1>
              <p className="text-gray-600">
                Total Points: 1,000 | Duration: 45-60 minutes
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {orgProfileCategory.name}
              </h2>
              <p className="text-gray-600 mb-6">
                Before beginning the assessment, please provide information about your organization.
                This helps contextualize your responses.
              </p>

              {orgProfileCategory.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="mb-8 border-l-4 border-emerald-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {subcategory.name}
                  </h3>

                  {subcategory.questions.map((question) => (
                    <div key={question.id} className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {question.itemCode}
                      </label>
                      <p className="text-gray-600 mb-3 text-sm">{question.questionText}</p>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        rows={4}
                        value={responses[question.id] || ''}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        placeholder="Enter your response..."
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setShowOrgProfile(false)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Continue to Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Assessment
  const mainCategories = categories.filter(c => c.displayOrder > 0);
  const currentCategory = mainCategories[currentCategoryIndex];
  const currentSubcategory = currentCategory?.subcategories[currentSubcategoryIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Baldrige Excellence Framework Assessment
            </h1>
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-semibold text-emerald-600">
                {getCompletedPoints()} / {getTotalPoints()} points
              </p>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 mb-4">
            {mainCategories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCurrentCategoryIndex(idx);
                  setCurrentSubcategoryIndex(0);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  idx === currentCategoryIndex
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.displayOrder}. {cat.name}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getCompletedPoints() / getTotalPoints()) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Subcategory Assessment */}
        {currentSubcategory && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentSubcategory.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Category {currentCategory.displayOrder}: {currentCategory.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Points</p>
                  <p className="text-xl font-bold text-emerald-600">{currentSubcategory.points}</p>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6 mb-8">
              {currentSubcategory.questions.map((question) => (
                <div key={question.id} className="border-l-4 border-emerald-500 pl-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {question.itemCode}
                  </label>
                  <p className="text-gray-700 mb-4">{question.questionText}</p>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    rows={6}
                    value={responses[question.id] || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    placeholder="Describe your organization's approach, deployment, and results for this criterion..."
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                onClick={handlePrevious}
                disabled={currentCategoryIndex === 0 && currentSubcategoryIndex === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Subcategory {currentSubcategoryIndex + 1} of {currentCategory.subcategories.length} in Category {currentCategory.displayOrder}
                </p>
              </div>

              <button
                onClick={handleSubcategoryComplete}
                disabled={saving}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' :
                  currentSubcategoryIndex < currentCategory.subcategories.length - 1
                    ? 'Next Subcategory'
                    : currentCategoryIndex < mainCategories.length - 1
                    ? 'Next Category'
                    : 'Complete Assessment'}
              </button>
            </div>
          </div>
        )}

        {/* Assessment Info */}
        <div className="mt-6 bg-emerald-50 rounded-lg p-6">
          <h3 className="font-semibold text-emerald-900 mb-3">Assessment Guidelines:</h3>
          <ul className="space-y-2 text-sm text-emerald-800">
            <li>• Answer all questions thoroughly, providing specific examples from your organization</li>
            <li>• Focus on describing your approach, deployment, and results for each criterion</li>
            <li>• You can navigate between categories and subcategories at any time</li>
            <li>• Your progress is saved automatically as you type</li>
            <li>• Total assessment time: 45-60 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
