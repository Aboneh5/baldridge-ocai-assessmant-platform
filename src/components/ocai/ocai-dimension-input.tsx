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

    // Calculate how much we need to distribute among other keys
    const remainingPoints = 100 - clampedValue
    const otherKeys = (['A', 'B', 'C', 'D'] as const).filter(k => k !== key)

    // Get current total of other keys
    const otherTotal = otherKeys.reduce((sum, k) => sum + values[k], 0)

    const newValues = { ...values, [key]: clampedValue }

    // Proportionally distribute remaining points based on current ratios
    if (remainingPoints > 0 && otherTotal > 0) {
      // Calculate proportional values based on current distribution
      let assignedTotal = 0
      otherKeys.forEach((otherKey, index) => {
        if (index === otherKeys.length - 1) {
          // Last key gets the remainder to ensure exactly 100
          newValues[otherKey] = remainingPoints - assignedTotal
        } else {
          // Proportional distribution
          const proportion = values[otherKey] / otherTotal
          const newVal = Math.round(remainingPoints * proportion)
          newValues[otherKey] = newVal
          assignedTotal += newVal
        }
      })
    } else if (remainingPoints > 0 && otherTotal === 0) {
      // If all other values are 0, distribute equally
      const equalShare = Math.floor(remainingPoints / otherKeys.length)
      const remainder = remainingPoints % otherKeys.length
      otherKeys.forEach((otherKey, index) => {
        newValues[otherKey] = equalShare + (index < remainder ? 1 : 0)
      })
    } else if (remainingPoints === 0) {
      // If new value is 100, set all others to 0
      otherKeys.forEach(otherKey => {
        newValues[otherKey] = 0
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

      <div className="max-h-[900px] overflow-y-auto space-y-6 pr-2 border border-gray-200 rounded-lg p-6 bg-gray-50">
        {Object.entries(dimension.options).map(([key, option]) => (
          <div key={key} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900 text-lg">
                    Option {key}: {option.culture}
                  </span>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={values[key as keyof typeof values]}
                      onChange={(e) => updateValue(key as 'A' | 'B' | 'C' | 'D', parseInt(e.target.value) || 0)}
                      onKeyDown={(e) => handleKeyDown(key as 'A' | 'B' | 'C' | 'D', e)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded text-center text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                    <span className="text-lg text-gray-500 font-medium">%</span>
                  </div>
                </div>
                <p className="text-base text-gray-700 leading-relaxed">{option.text}</p>
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
