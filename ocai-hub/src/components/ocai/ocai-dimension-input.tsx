'use client'

import { useState, useEffect } from 'react'
import { OCAIDimension, OCAIResponse, validateOCAIResponse } from '@/lib/ocai-data'

interface OCAIDimensionInputProps {
  dimension: OCAIDimension
  phase: 'now' | 'preferred'
  response?: OCAIResponse
  onChange: (values: { A: number; B: number; C: number; D: number }) => void
}

export function OCAIDimensionInput({ dimension, phase, response, onChange }: OCAIDimensionInputProps) {
  const [values, setValues] = useState({ A: 25, B: 25, C: 25, D: 25 })
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (response) {
      setValues(response[phase])
    }
  }, [response, phase])

  const updateValue = (key: 'A' | 'B' | 'C' | 'D', newValue: number) => {
    const clampedValue = Math.max(0, Math.min(100, newValue))
    const newValues = { ...values, [key]: clampedValue }
    
    // Adjust other values to maintain sum of 100
    const currentSum = Object.values(newValues).reduce((sum, val) => sum + val, 0)
    const difference = 100 - currentSum
    
    if (difference !== 0) {
      const otherKeys = (['A', 'B', 'C', 'D'] as const).filter(k => k !== key)
      const adjustmentPerKey = Math.floor(difference / otherKeys.length)
      const remainder = difference % otherKeys.length
      
      otherKeys.forEach((otherKey, index) => {
        const adjustment = adjustmentPerKey + (index < remainder ? 1 : 0)
        newValues[otherKey] = Math.max(0, Math.min(100, newValues[otherKey] + adjustment))
      })
    }
    
    setValues(newValues)
    onChange(newValues)
    
    // Validate
    const validation = validateOCAIResponse({
      dimensionId: dimension.id,
      now: phase === 'now' ? newValues : response?.now || { A: 25, B: 25, C: 25, D: 25 },
      preferred: phase === 'preferred' ? newValues : response?.preferred || { A: 25, B: 25, C: 25, D: 25 }
    })
    setErrors(validation.errors)
  }

  const handleKeyDown = (key: 'A' | 'B' | 'C' | 'D', event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      updateValue(key, values[key] + 1)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      updateValue(key, values[key] - 1)
    }
  }

  const total = Object.values(values).reduce((sum, val) => sum + val, 0)
  const isValid = total === 100 && errors.length === 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {dimension.title} - {phase === 'now' ? 'Current State' : 'Preferred State'}
        </h2>
        <p className="text-gray-600 mb-4">{dimension.description}</p>
      </div>

      <div className="space-y-4">
        {Object.entries(dimension.options).map(([key, option]) => (
          <div key={key} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    Option {key}: {option.culture}
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={values[key as keyof typeof values]}
                      onChange={(e) => updateValue(key as 'A' | 'B' | 'C' | 'D', parseInt(e.target.value) || 0)}
                      onKeyDown={(e) => handleKeyDown(key as 'A' | 'B' | 'C' | 'D', e)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{option.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Validation */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">Total:</span>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-semibold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {total}%
            </span>
            {isValid && <span className="text-green-600">✓</span>}
          </div>
        </div>
        
        {!isValid && (
          <div className="mt-2 text-sm text-red-600">
            {total !== 100 && <p>Total must equal 100%</p>}
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          Use arrow keys to adjust values quickly
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Distribute 100 points across the four options based on how well each describes your organization</li>
          <li>• You can give all 100 points to one option or distribute them across multiple options</li>
          <li>• Use the number inputs or arrow keys to adjust values</li>
          <li>• The total must equal exactly 100%</li>
        </ul>
      </div>
    </div>
  )
}
