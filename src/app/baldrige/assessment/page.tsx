'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  loadAssessmentProgress,
  saveAssessmentProgress,
  markAssessmentCompleted,
  isAssessmentCompleted,
  calculateProgressPercentage,
} from '@/lib/assessment-progress';
import { useLocale } from '@/lib/i18n/context';
import { getLocalizedBaldrigeQuestionText } from '@/lib/baldrige-data';
// LanguageSwitcher removed to prevent accidental language switching during assessment

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
  const { t, locale, translations } = useLocale();
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [isResuming, setIsResuming] = useState(false);
  const [resumedCount, setResumedCount] = useState(0);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const DEBOUNCE_MS = 500;
  
  // Memoize main categories (must be before any conditional returns per React Rules of Hooks)
  const mainCategories = useMemo(() => categories.filter(c => c.displayOrder > 0), [categories]);
  
  // Helper function to get localized category name (memoized to prevent re-computation)
  const getCategoryName = useCallback((name: string) => {
    return translations?.categoryNames?.[name] || name;
  }, [translations]);

  // Helper function to get localized subcategory name (memoized to prevent re-computation)
  const getSubcategoryName = useCallback((name: string) => {
    return translations?.subcategoryNames?.[name] || name;
  }, [translations]);
  
  // Helper function to get localized question text (memoized to prevent re-computation)
  const getQuestionText = useCallback((itemCode: string, fallbackText: string) => {
    // Always try to use translation if translations object exists
    if (translations?.questions?.[itemCode]) {
      return translations.questions[itemCode];
    }
    
    // Only use fallback if translation not found
    return fallbackText;
  }, [translations]);

  useEffect(() => {
    // Check for localStorage authentication first (both access key and credential users)
    const storedUser = localStorage.getItem('user');
    const storedOrg = localStorage.getItem('organization');
    const storedTypes = localStorage.getItem('assessmentTypes');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // Handle credential users
      if (user.role === 'CREDENTIAL_USER') {
        if (storedTypes && user.assessmentTypes) {
          const types = JSON.parse(storedTypes);
          if (types.includes('BALDRIGE') || user.assessmentTypes.includes('BALDRIGE')) {
            // Check if already completed
            if (isAssessmentCompleted('BALDRIGE', user.organizationId, user.id)) {
              router.push('/baldrige/answers');
              return;
            }

            setHasAccessKey(true);
            setAccessKeyUser(user);
            fetchCategories();
            fetchProgress();
            return;
          }
        }
      }
      // Handle access key users
      else if (storedOrg && storedTypes) {
        const types = JSON.parse(storedTypes);
        if (types.includes('BALDRIGE')) {
          const org = JSON.parse(storedOrg);

          // Check if already completed
          if (isAssessmentCompleted('BALDRIGE', org.id, user.id)) {
            router.push('/baldrige/answers');
            return;
          }

          setHasAccessKey(true);
          setAccessKeyUser(user);
          fetchCategories();
          fetchProgress();
          return;
        }
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
  }, [status, router]);

  const getHeaders = () => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    // Add user ID header for both access key and credential users
    if (hasAccessKey && accessKeyUser?.id) {
      headers['x-user-id'] = accessKeyUser.id;
    } else {
      // For credential users, get user ID from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.id) {
          headers['x-user-id'] = user.id;
        }
      }
    }

    return headers;
  };

  const fetchCategories = async () => {
    try {
      // First check if user already completed this assessment
      const completionCheck = await fetch('/api/baldrige/check-completion', {
        headers: getHeaders(),
      });

      if (completionCheck.ok) {
        const completionData = await completionCheck.json();
        if (completionData.isCompleted) {
          alert(t('assessment.alreadyCompleted'));
          router.push('/baldrige/answers');
          return;
        }
      }

      const res = await fetch('/api/baldrige/categories', {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);

        // Load existing responses (for resuming)
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

        // If user has responses, show a message that they're resuming
        const responseCount = Object.keys(initialResponses).length;
        if (responseCount > 0) {
          setIsResuming(true);
          setResumedCount(responseCount);
          console.log(`Resuming assessment: ${responseCount} questions already answered`);

          // Auto-hide the resume banner after 5 seconds
          setTimeout(() => {
            setIsResuming(false);
          }, 5000);
        }
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

  const saveResponseImmediate = async (questionId: string, responseText: string) => {
    try {
      await fetch('/api/baldrige/response', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ questionId, responseText }),
      });
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));

    // Debounce saves to avoid lag on every keystroke
    const existing = saveTimers.current[questionId];
    if (existing) clearTimeout(existing);
    saveTimers.current[questionId] = setTimeout(() => {
      saveResponseImmediate(questionId, value);
      delete saveTimers.current[questionId];
    }, DEBOUNCE_MS);

    // Update progress tracking in localStorage
    const storedUser = localStorage.getItem('user');
    const storedOrg = localStorage.getItem('organization');
    const storedAccessKey = localStorage.getItem('accessKey');

    if (storedUser && storedOrg) {
      const user = JSON.parse(storedUser);
      const org = JSON.parse(storedOrg);

      // Calculate total questions and answered questions
      const totalQuestions = categories.reduce((total, cat) => {
        return total + cat.subcategories.reduce((subTotal, sub) => {
          return subTotal + sub.questions.length;
        }, 0);
      }, 0);

      const answeredQuestions = Object.keys(responses).filter(key => responses[key]?.trim()).length + 1; // +1 for current answer
      const percentage = calculateProgressPercentage(answeredQuestions, totalQuestions);

      saveAssessmentProgress({
        assessmentType: 'BALDRIGE',
        organizationId: org.id,
        accessKey: storedAccessKey || '',
        userId: user.id,
        status: 'in_progress',
        progress: {
          currentStep: answeredQuestions,
          totalSteps: totalQuestions,
          percentage,
          data: { currentCategoryIndex, currentSubcategoryIndex },
        },
        timestamps: {
          startedAt: new Date().toISOString(),
        },
      });
    }
  };

  const handleSubcategoryComplete = async () => {
    // Get main categories (excluding organizational profile)
    const mainCategories = categories.filter(c => c.displayOrder > 0);
    const currentCategory = mainCategories[currentCategoryIndex];
    const currentSubcategory = currentCategory?.subcategories[currentSubcategoryIndex];

    if (!currentSubcategory) return;

    const allQuestionsAnswered = currentSubcategory.questions.every(
      q => responses[q.id]?.trim()
    );

    if (!allQuestionsAnswered) {
      alert(t('assessment.pleaseAnswerAllQuestions'));
      return;
    }

    // Save all responses for this subcategory before proceeding
    setSaving(true);
    await Promise.all(
      currentSubcategory.questions
        .filter(q => responses[q.id]?.trim()) // Only save non-empty responses
        .map(q =>
          fetch('/api/baldrige/response', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              questionId: q.id,
              responseText: responses[q.id],
            }),
          })
        )
    );
    setSaving(false);

    // Start transition
    setIsTransitioning(true);

    // Mark questions as completed
    const newCompleted = new Set(completedQuestions);
    currentSubcategory.questions.forEach(q => newCompleted.add(q.id));
    setCompletedQuestions(newCompleted);

    // Check if this is the last subcategory of the last category
    const isLastSubcategory = currentSubcategoryIndex === currentCategory.subcategories.length - 1;
    const isLastCategory = currentCategoryIndex === mainCategories.length - 1;

    if (isLastSubcategory && isLastCategory) {
      // Assessment complete - submit it
      submitAssessment();
    } else if (currentSubcategoryIndex < currentCategory.subcategories.length - 1) {
      // Move to next subcategory in same category
      setCurrentSubcategoryIndex(currentSubcategoryIndex + 1);
    } else {
      // Move to next category, first subcategory
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentSubcategoryIndex(0);
    }

    // End transition after animation
    setTimeout(() => setIsTransitioning(false), 300);

    // Save progress in background (non-blocking)
    fetch('/api/baldrige/progress', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        completedQuestions: Array.from(newCompleted),
      }),
    }).catch(err => console.error('Progress save failed:', err));
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
        // Mark assessment as permanently completed
        const storedUser = localStorage.getItem('user');
        const storedOrg = localStorage.getItem('organization');
        const storedAccessKey = localStorage.getItem('accessKey');

        if (storedUser && storedOrg) {
          const user = JSON.parse(storedUser);
          const org = JSON.parse(storedOrg);
          markAssessmentCompleted('BALDRIGE', org.id, user.id, storedAccessKey || '');
        }

        setSubmissionData(data.data);
        setShowResults(true);
      } else {
        // Show detailed error message with missing questions
        let errorMessage = data.message || t('assessment.pleaseCompleteAll');

        if (data.data?.unansweredQuestions && data.data.unansweredQuestions.length > 0) {
          errorMessage += '\n\nMissing answers for:\n';
          data.data.unansweredQuestions.forEach((q: any) => {
            errorMessage += `\n• ${q.itemCode} (${q.category} - ${q.subcategory})`;
          });

          if (data.data.remainingQuestions > data.data.unansweredQuestions.length) {
            errorMessage += `\n\n...and ${data.data.remainingQuestions - data.data.unansweredQuestions.length} more questions.`;
          }
        }

        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert(t('assessment.submitFailed'));
    }
  };

  const handlePrevious = () => {
    setIsTransitioning(true);

    if (currentSubcategoryIndex > 0) {
      setCurrentSubcategoryIndex(currentSubcategoryIndex - 1);
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      const prevCategory = categories[currentCategoryIndex - 1];
      setCurrentSubcategoryIndex(prevCategory.subcategories.length - 1);
    }

    setTimeout(() => setIsTransitioning(false), 300);
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
          <p className="mt-4 text-gray-600">{t('assessment.loadingAssessment')}</p>
        </div>
      </div>
    );
  }

  // Results Display
  if (showResults && submissionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-12 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {t('assessment.assessmentComplete')}
              </h1>
              <p className="text-xl text-emerald-50">
                {t('assessment.thankYou')}
              </p>
            </div>

            {/* Results Content */}
            <div className="px-8 py-10 space-y-8">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-2">{t('assessment.questionsAnswered')}</p>
                  <p className="text-4xl font-bold text-blue-900">{submissionData.totalQuestions}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border-2 border-emerald-200">
                  <p className="text-sm font-medium text-emerald-700 mb-2">{t('assessment.completionRate')}</p>
                  <p className="text-4xl font-bold text-emerald-900">{submissionData.completionRate}%</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                  <p className="text-sm font-medium text-purple-700 mb-2">{t('assessment.submittedOn')}</p>
                  <p className="text-lg font-bold text-purple-900">
                    {new Date(submissionData.submittedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-purple-700">
                    {new Date(submissionData.submittedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('assessment.assessmentDetails')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('assessment.participantName')}</p>
                    <p className="text-base font-medium text-gray-900">{submissionData.user.name}</p>
                  </div>
                  {submissionData.user.email && (
                    <div>
                      <p className="text-sm text-gray-600">{t('assessment.email')}</p>
                      <p className="text-base font-medium text-gray-900">{submissionData.user.email}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">{t('assessment.submissionId')}</p>
                    <p className="text-base font-mono text-gray-900">{submissionData.submissionId}</p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('assessment.whatHappensNext')}
                </h3>
                <ul className="space-y-3 text-emerald-800">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{t('assessment.nextStep1')}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{t('assessment.nextStep2')}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{t('assessment.nextStep3')}</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <button
                  onClick={() => router.push('/employee/assessments')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  {t('assessment.returnToDashboard')}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-600 rounded-xl hover:bg-emerald-50 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  {t('assessment.printSummary')}
                </button>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {t('assessment.contactAdmin')}
                </p>
              </div>
            </div>
          </div>
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
          {/* Resume Banner */}
          {isResuming && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg animate-pulse">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-blue-800">{t('assessment.welcomeBack')}</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>{t('assessment.resumingProgress', { count: resumedCount })}</p>
                    <p className="mt-1">{t('assessment.continueFromWhere')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning Banner */}
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-amber-800">{t('assessment.importantNotice')}</h3>
                <div className="mt-1 text-amber-700">
                  <p>• {t('assessment.autoSaved')}</p>
                  <p>• {t('assessment.reviewCarefully')}</p>
                  <p>• {t('assessment.cannotModify')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('assessment.title')}
              </h1>
              <p className="text-gray-600">
                {t('assessment.totalPoints')} | {t('assessment.duration')}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {getCategoryName(orgProfileCategory.name)}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('assessment.provideOrgInfo')}
              </p>

              <div className="max-h-[600px] overflow-y-auto pr-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                {orgProfileCategory.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="mb-8 border-l-4 border-emerald-500 pl-6 bg-white p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {getSubcategoryName(subcategory.name)}
                    </h3>

                    {subcategory.questions.map((question) => (
                      <div key={question.id} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {question.itemCode}
                        </label>
                        <p className="text-gray-600 mb-3 text-sm">{getQuestionText(question.itemCode, question.questionText)}</p>
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
                          rows={4}
                          value={responses[question.id] || ''}
                          onChange={(e) => handleResponseChange(question.id, e.target.value)}
                          placeholder={t('assessment.enterResponse')}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end items-center">
              <button
                onClick={async () => {
                  // Check if all organizational profile questions are answered
                  const allAnswered = orgProfileCategory.subcategories.every(sub =>
                    sub.questions.every(q => responses[q.id]?.trim())
                  );

                  if (!allAnswered) {
                    alert(t('assessment.pleaseAnswerAll'));
                    return;
                  }

                  // Save all organizational profile responses
                  setSaving(true);
                  const allQuestions = orgProfileCategory.subcategories.flatMap(sub => sub.questions);
                  await Promise.all(
                    allQuestions
                      .filter(q => responses[q.id]?.trim()) // Only save non-empty responses
                      .map(q =>
                        fetch('/api/baldrige/response', {
                          method: 'POST',
                          headers: getHeaders(),
                          body: JSON.stringify({
                            questionId: q.id,
                            responseText: responses[q.id],
                          }),
                        })
                      )
                  );
                  setSaving(false);

                  setShowOrgProfile(false);
                }}
                disabled={
                  !orgProfileCategory.subcategories.every(sub =>
                    sub.questions.every(q => responses[q.id]?.trim())
                  )
                }
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                {t('assessment.continueToAssessment')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Assessment
  const currentCategory = mainCategories[currentCategoryIndex];
  const currentSubcategory = currentCategory?.subcategories[currentSubcategoryIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Resume Banner */}
        {isResuming && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg animate-pulse">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-blue-800">{t('assessment.welcomeBack')}</h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>{t('assessment.resumingProgress', { count: resumedCount })}</p>
                  <p className="mt-1">{t('assessment.continueFromWhere')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning Banner */}
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-amber-800">{t('assessment.importantNotice')}</h3>
              <div className="mt-1 text-amber-700">
                <p>• {t('assessment.autoSaved')}</p>
                <p>• {t('assessment.reviewCarefully')}</p>
                <p>• {t('assessment.cannotModify')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('assessment.title')}
            </h1>
            <div className="flex items-center gap-4">
              {/* Language switcher removed during assessment to prevent accidental changes */}
              <div className="text-right">
                <p className="text-sm text-gray-600">{t('assessment.progress')}</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {getCompletedPoints()} / {getTotalPoints()} points
                </p>
              </div>
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
                {getCategoryName(cat.name)}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${(getCompletedPoints() / getTotalPoints()) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Current Subcategory Assessment */}
        {currentSubcategory && (
          <div className={`bg-white rounded-lg shadow-lg p-8 transition-all duration-300 ease-in-out ${
            isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
          }`}>
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    {getSubcategoryName(currentSubcategory.name)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t('assessment.category')} {currentCategory.displayOrder}: {getCategoryName(currentCategory.name)}
                  </p>
                </div>
                <div className="text-right bg-emerald-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-emerald-700 font-medium">{t('assessment.points')}</p>
                  <p className="text-2xl font-bold text-emerald-600">{currentSubcategory.points}</p>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="max-h-[600px] overflow-y-auto space-y-6 mb-8 pr-2 border-2 border-emerald-100 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-emerald-50 shadow-inner">
              {currentSubcategory.questions.map((question) => (
                <div key={question.id} className="border-l-4 border-emerald-500 pl-6 bg-white p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {question.itemCode}
                  </label>
                  <p className="text-gray-700 mb-4">{getQuestionText(question.itemCode, question.questionText)}</p>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
                    rows={6}
                    value={responses[question.id] || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    placeholder={t('assessment.describeApproach')}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="w-32"></div>

              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">
                  {t('assessment.subcategory')} {currentSubcategoryIndex + 1} {t('assessment.of')} {currentCategory.subcategories.length}
                </p>
                <p className="text-xs text-gray-500">{t('assessment.category')} {currentCategory.displayOrder}: {getCategoryName(currentCategory.name)}</p>
              </div>

              <button
                onClick={handleSubcategoryComplete}
                disabled={
                  saving ||
                  isTransitioning ||
                  !currentSubcategory.questions.every(q => responses[q.id]?.trim())
                }
                className="group px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>{saving ? t('assessment.saving') :
                  currentSubcategoryIndex < currentCategory.subcategories.length - 1
                    ? t('assessment.nextSubcategory')
                    : currentCategoryIndex < mainCategories.length - 1
                    ? t('assessment.nextCategory')
                    : t('assessment.completeAssessment')}</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Assessment Info */}
        <div className="mt-6 bg-emerald-50 rounded-lg p-6">
          <h3 className="font-semibold text-emerald-900 mb-3">{t('assessment.assessmentGuidelines')}</h3>
          <ul className="space-y-2 text-sm text-emerald-800">
            <li>• {t('assessment.guideline1')}</li>
            <li>• {t('assessment.guideline2')}</li>
            <li>• {t('assessment.guideline3')}</li>
            <li>• {t('assessment.guideline4')}</li>
            <li>• {t('assessment.guideline5')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
