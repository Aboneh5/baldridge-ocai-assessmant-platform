'use client'

import { CULTURE_TYPES } from '@/lib/ocai-data'

export function OCAIHelpPanel() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Competing Values Framework</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">About the OCAI</h4>
          <p className="text-sm text-gray-600">
            The Organizational Culture Assessment Instrument (OCAI) is based on the Competing Values Framework. 
            It helps identify your organization's current culture and preferred culture across six key dimensions.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">The Six Dimensions</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Dominant Characteristics:</strong> How the organization presents itself</li>
            <li>• <strong>Leadership:</strong> The style and approach of leaders</li>
            <li>• <strong>Management of Employees:</strong> How employees are managed</li>
            <li>• <strong>Organization Glue:</strong> What holds the organization together</li>
            <li>• <strong>Strategic Emphases:</strong> What the organization emphasizes</li>
            <li>• <strong>Criteria of Success:</strong> How success is defined</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">The Four Culture Types</h4>
          <div className="space-y-3">
            {Object.entries(CULTURE_TYPES).map(([key, culture]) => (
              <div key={key} className="border-l-4 p-3" style={{ borderLeftColor: culture.color }}>
                <h5 className="font-medium text-gray-900" style={{ color: culture.color }}>
                  {culture.name}
                </h5>
                <p className="text-xs text-gray-600 mt-1">{culture.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">How to Complete</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Read each dimension carefully</li>
            <li>Distribute 100 points across the four options</li>
            <li>Complete for both "Now" (current state) and "Preferred" (ideal state)</li>
            <li>Be honest about your current organization</li>
            <li>Think about what would work best for your organization</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <h4 className="font-medium text-yellow-800 mb-1">Tips for Accuracy</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Consider the organization as a whole, not just your department</li>
            <li>• Think about what you observe, not what you wish was true</li>
            <li>• If unsure, distribute points more evenly</li>
            <li>• There are no "right" or "wrong" answers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
