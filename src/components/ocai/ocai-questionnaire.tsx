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

  // Initialize responses
  useEffect(() => {
    if (responses.length === 0) {
      const initialResponses = OCAI_DIMENSIONS.map(dimension => ({
        dimensionId: dimension.id,
        now: { A: 25, B: 25, C: 25, D: 25 },
        preferred: { A: 25, B: 25, C: 25, D: 25 }
      }))
      setResponses(initialResponses)
    }
  }, [responses.length])

  const handleDimensionChange = (dimensionId: string, phase: 'now' | 'preferred', values: { A: number; B: number; C: number; D: number }) => {
    setResponses(prev => prev.map(response => 
      response.dimensionId === dimensionId 
        ? { ...response, [phase]: values }
        : response
    ))
  }

  const handleNext = () => {
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
      
      if (onComplete) {
        onComplete(calculatedScores, demographics)
      }
    }
  }

  const handlePrevious = () => {
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">OCAI Culture Assessment</h1>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {showHelp ? 'Hide Help' : 'Show Help'}
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
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
        <div className="lg:col-span-2">
          {currentPhase === 'demographics' ? (
            <div className="space-y-6">
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
          <div className="lg:col-span-1">
            <OCAIHelpPanel />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentPhase === 'now' && currentDimension === 0}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentPhase === 'demographics' ? 'View Results' : 'Next'}
        </button>
      </div>
    </div>
  )
}
