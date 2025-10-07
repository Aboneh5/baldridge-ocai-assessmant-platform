'use client'

import { useState, useEffect } from 'react'
import { OCAI_DIMENSIONS, OCAIResponse, validateOCAIResponse, calculateOCAIScores, OCAIScores } from '@/lib/ocai-data'
import { OCAIDimensionInput } from './ocai-dimension-input'
import { OCAIHelpPanel } from './ocai-help-panel'
import { OCAIResults } from './ocai-results'

interface Demographics {
  department?: string
  team?: string
  tenure?: string
  location?: string
  gender?: string
  laborUnit?: string
  raceEthnicity?: string
}

interface OCAIQuestionnaireProps {
  surveyId: string
  onComplete?: (scores: OCAIScores, demographics: Demographics) => void
}

export function OCAIQuestionnaire({ surveyId, onComplete }: OCAIQuestionnaireProps) {
  const [currentPhase, setCurrentPhase] = useState<'now' | 'preferred' | 'demographics' | 'results'>('now')
  const [currentDimension, setCurrentDimension] = useState(0)
  const [responses, setResponses] = useState<OCAIResponse[]>([])
  const [demographics, setDemographics] = useState<Demographics>({})
  const [scores, setScores] = useState<OCAIScores | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Initialize responses and load from localStorage
  useEffect(() => {
    const storageKey = `ocai_progress_${surveyId}`
    const savedProgress = localStorage.getItem(storageKey)

    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      setResponses(parsed.responses || [])
      setCurrentPhase(parsed.currentPhase || 'now')
      setCurrentDimension(parsed.currentDimension || 0)
      setDemographics(parsed.demographics || {})
    } else if (responses.length === 0) {
      const initialResponses = OCAI_DIMENSIONS.map(dimension => ({
        dimensionId: dimension.id,
        now: { A: 25, B: 25, C: 25, D: 25 },
        preferred: { A: 25, B: 25, C: 25, D: 25 }
      }))
      setResponses(initialResponses)
    }
  }, [surveyId])

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    if (responses.length > 0 && currentPhase !== 'results') {
      const storageKey = `ocai_progress_${surveyId}`
      const progressData = {
        responses,
        currentPhase,
        currentDimension,
        demographics,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem(storageKey, JSON.stringify(progressData))
    }
  }, [responses, currentPhase, currentDimension, demographics, surveyId])

  const handleDimensionChange = (dimensionId: string, phase: 'now' | 'preferred', values: { A: number; B: number; C: number; D: number }) => {
    setResponses(prev => prev.map(response => 
      response.dimensionId === dimensionId 
        ? { ...response, [phase]: values }
        : response
    ))
  }

  const handleNext = () => {
    setIsTransitioning(true)

    if (currentPhase === 'now') {
      if (currentDimension < OCAI_DIMENSIONS.length - 1) {
        setCurrentDimension(prev => prev + 1)
      } else {
        setCurrentPhase('preferred')
        setCurrentDimension(0)
      }
    } else if (currentPhase === 'preferred') {
      if (currentDimension < OCAI_DIMENSIONS.length - 1) {
        setCurrentDimension(prev => prev + 1)
      } else {
        setCurrentPhase('demographics')
      }
    } else if (currentPhase === 'demographics') {
      // Calculate scores and show results
      const calculatedScores = calculateOCAIScores(responses)
      setScores(calculatedScores)
      setCurrentPhase('results')

      // Clear saved progress since assessment is complete
      const storageKey = `ocai_progress_${surveyId}`
      localStorage.removeItem(storageKey)

      if (onComplete) {
        onComplete(calculatedScores, demographics)
      }
    }

    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handlePrevious = () => {
    setIsTransitioning(true)

    if (currentPhase === 'preferred') {
      if (currentDimension > 0) {
        setCurrentDimension(prev => prev - 1)
      } else {
        setCurrentPhase('now')
        setCurrentDimension(OCAI_DIMENSIONS.length - 1)
      }
    } else if (currentPhase === 'demographics') {
      setCurrentPhase('preferred')
      setCurrentDimension(OCAI_DIMENSIONS.length - 1)
    } else if (currentPhase === 'results') {
      setCurrentPhase('demographics')
    }

    setTimeout(() => setIsTransitioning(false), 300)
  }

  const getCurrentResponse = () => {
    return responses.find(r => r.dimensionId === OCAI_DIMENSIONS[currentDimension].id)
  }

  const isCurrentDimensionValid = () => {
    const response = getCurrentResponse()
    if (!response) return false
    
    const validation = validateOCAIResponse(response)
    return validation.isValid
  }

  const canProceed = () => {
    if (currentPhase === 'now' || currentPhase === 'preferred') {
      return isCurrentDimensionValid()
    } else if (currentPhase === 'demographics') {
      return true // Demographics are optional
    }
    return false
  }

  const getProgress = () => {
    if (currentPhase === 'now') {
      return ((currentDimension + 1) / OCAI_DIMENSIONS.length) * 50
    } else if (currentPhase === 'preferred') {
      return 50 + ((currentDimension + 1) / OCAI_DIMENSIONS.length) * 50
    } else if (currentPhase === 'demographics') {
      return 100
    }
    return 100
  }

  if (currentPhase === 'results' && scores) {
    return <OCAIResults scores={scores} onRestart={() => setCurrentPhase('now')} />
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Warning Banner */}
      <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-amber-800">Important Notice</h3>
            <div className="mt-1 text-sm text-amber-700">
              <p>• Your progress is automatically saved as you go, so you can return later if needed.</p>
              <p>• Please review your answers carefully before proceeding to the next question.</p>
              <p>• Once submitted, you cannot modify your responses.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            OCAI Culture Assessment
          </h1>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="group px-5 py-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 font-medium transform hover:scale-105 active:scale-95 flex items-center space-x-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{showHelp ? 'Hide Help' : 'Show Help'}</span>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${getProgress()}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            {currentPhase === 'now' && `Now: Dimension ${currentDimension + 1} of ${OCAI_DIMENSIONS.length}`}
            {currentPhase === 'preferred' && `Preferred: Dimension ${currentDimension + 1} of ${OCAI_DIMENSIONS.length}`}
            {currentPhase === 'demographics' && 'Demographics (Optional)'}
          </span>
          <span>{Math.round(getProgress())}% Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className={`lg:col-span-2 transition-all duration-300 ease-in-out ${
          isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
        }`}>
          {currentPhase === 'demographics' ? (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-900">Demographics (Optional)</h2>
              <p className="text-gray-600">This information is used only for aggregated reporting and analysis.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={demographics.department || ''}
                    onChange={(e) => setDemographics(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Engineering, Marketing"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
                  <input
                    type="text"
                    value={demographics.team || ''}
                    onChange={(e) => setDemographics(prev => ({ ...prev, team: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Frontend Team, Sales Team"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tenure</label>
                  <select
                    value={demographics.tenure || ''}
                    onChange={(e) => setDemographics(prev => ({ ...prev, tenure: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select tenure</option>
                    <option value="less-than-1">Less than 1 year</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="more-than-10">More than 10 years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={demographics.location || ''}
                    onChange={(e) => setDemographics(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., New York, Remote"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={demographics.gender || ''}
                    onChange={(e) => setDemographics(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Labor Unit</label>
                  <input
                    type="text"
                    value={demographics.laborUnit || ''}
                    onChange={(e) => setDemographics(prev => ({ ...prev, laborUnit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Management, Individual Contributor"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Race/Ethnicity</label>
                  <select
                    value={demographics.raceEthnicity || ''}
                    onChange={(e) => setDemographics(prev => ({ ...prev, raceEthnicity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select race/ethnicity</option>
                    <option value="american-indian">American Indian or Alaska Native</option>
                    <option value="asian">Asian</option>
                    <option value="black">Black or African American</option>
                    <option value="hispanic">Hispanic or Latino</option>
                    <option value="native-hawaiian">Native Hawaiian or Other Pacific Islander</option>
                    <option value="white">White</option>
                    <option value="two-or-more">Two or More Races</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <OCAIDimensionInput
              dimension={OCAI_DIMENSIONS[currentDimension]}
              phase={currentPhase}
              response={getCurrentResponse()}
              onChange={(values) => handleDimensionChange(OCAI_DIMENSIONS[currentDimension].id, currentPhase, values)}
            />
          )}
        </div>

        {/* Help Panel */}
        {showHelp && (
          <div className="lg:col-span-1 animate-slideInRight">
            <OCAIHelpPanel />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentPhase === 'now' && currentDimension === 0}
          className="group px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed() || isTransitioning}
          className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <span>{currentPhase === 'demographics' ? 'View Results' : 'Next'}</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
