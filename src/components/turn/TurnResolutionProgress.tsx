/**
 * Turn Resolution Progress Component
 * 
 * Shows the progress of turn resolution with detailed step information,
 * error handling, and estimated completion time.
 */

import React from 'react'
import { ResolutionProgress } from '@/types/turn-management'

export interface TurnResolutionProgressProps {
  progress: ResolutionProgress
  showDetailedSteps?: boolean
  className?: string
}

/**
 * Get progress phase display information
 */
function getPhaseInfo(phase: string): {
  icon: string
  name: string
  description: string
  color: string
} {
  switch (phase) {
    case 'validation':
      return {
        icon: '🔍',
        name: 'Validation',
        description: 'Checking action validity',
        color: 'blue',
      }
    case 'gather':
      return {
        icon: '🌾',
        name: 'Resource Generation',
        description: 'Processing resource gathering',
        color: 'green',
      }
    case 'exchange':
      return {
        icon: '🔄',
        name: 'Trading & Converting',
        description: 'Processing resource exchanges',
        color: 'purple',
      }
    case 'consumption':
      return {
        icon: '🏗️',
        name: 'Construction & Research',
        description: 'Processing builds and research',
        color: 'orange',
      }
    case 'special':
      return {
        icon: '✨',
        name: 'Special Abilities',
        description: 'Processing faction abilities',
        color: 'pink',
      }
    case 'global':
      return {
        icon: '🌍',
        name: 'Global Effects',
        description: 'Applying global modifiers',
        color: 'teal',
      }
    case 'complete':
      return {
        icon: '✅',
        name: 'Complete',
        description: 'Turn resolution finished',
        color: 'green',
      }
    default:
      return {
        icon: '⚙️',
        name: phase,
        description: 'Processing...',
        color: 'gray',
      }
  }
}

/**
 * Get color classes based on phase color
 */
function getColorClasses(color: string): {
  bg: string
  text: string
  border: string
  progress: string
} {
  switch (color) {
    case 'blue':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        progress: 'bg-blue-500',
      }
    case 'green':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        progress: 'bg-green-500',
      }
    case 'purple':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        progress: 'bg-purple-500',
      }
    case 'orange':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        progress: 'bg-orange-500',
      }
    case 'pink':
      return {
        bg: 'bg-pink-50',
        text: 'text-pink-700',
        border: 'border-pink-200',
        progress: 'bg-pink-500',
      }
    case 'teal':
      return {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        progress: 'bg-teal-500',
      }
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        progress: 'bg-gray-500',
      }
  }
}

/**
 * Format time remaining in human-readable format
 */
function formatEstimatedTime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return 'Less than 1 second'
  }
  
  const seconds = Math.ceil(milliseconds / 1000)
  
  if (seconds < 60) {
    return `~${seconds} second${seconds !== 1 ? 's' : ''}`
  }
  
  const minutes = Math.ceil(seconds / 60)
  return `~${minutes} minute${minutes !== 1 ? 's' : ''}`
}

/**
 * Progress Step Indicator
 */
function ProgressSteps({ 
  currentStep, 
  totalSteps, 
  stepName,
  phaseInfo,
  colorClasses
}: {
  currentStep: number
  totalSteps: number
  stepName: string
  phaseInfo: ReturnType<typeof getPhaseInfo>
  colorClasses: ReturnType<typeof getColorClasses>
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {stepName}
        </span>
      </div>
      
      {/* Step Progress Bar */}
      <div className="flex space-x-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i < currentStep 
                ? colorClasses.progress
                : i === currentStep - 1
                ? colorClasses.progress + ' animate-pulse'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        {Math.round((currentStep / totalSteps) * 100)}% complete
      </div>
    </div>
  )
}

/**
 * Turn Resolution Progress Component
 */
export function TurnResolutionProgress({
  progress,
  showDetailedSteps = true,
  className = '',
}: TurnResolutionProgressProps) {
  const phaseInfo = getPhaseInfo(progress.phase)
  const colorClasses = getColorClasses(phaseInfo.color)
  const estimatedTime = formatEstimatedTime(progress.estimatedRemainingMs)

  if (progress.hasError) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-red-200 p-6 ${className}`}>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">❌</div>
            <h3 className="text-lg font-medium text-red-700">
              Resolution Error
            </h3>
            <p className="text-sm text-red-600 mt-1">
              An error occurred during turn resolution
            </p>
          </div>
          
          {progress.errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">Error Details:</h4>
              <p className="text-sm text-red-700">
                {progress.errorMessage}
              </p>
            </div>
          )}
          
          <div className="text-center">
            <button className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium">
              🔄 Retry Resolution
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (progress.isComplete) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-green-200 p-6 ${className}`}>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-medium text-green-700">
              Turn Resolution Complete
            </h3>
            <p className="text-sm text-green-600 mt-1">
              All actions have been processed successfully
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-700">
              ✅ Turn resolved • Results are ready for review
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <div className="text-3xl mb-2">⚙️</div>
          <h3 className="text-lg font-medium text-gray-900">
            Resolving Turn...
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Processing all player actions
          </p>
        </div>

        {/* Current Phase Display */}
        <div className={`rounded-lg border p-4 ${colorClasses.bg} ${colorClasses.border}`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl" role="img" aria-label={phaseInfo.name}>
              {phaseInfo.icon}
            </span>
            <div className="flex-1">
              <h4 className={`font-medium ${colorClasses.text}`}>
                {phaseInfo.name}
              </h4>
              <p className={`text-sm ${colorClasses.text} opacity-80`}>
                {phaseInfo.description}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${colorClasses.text}`}>
                {progress.progressPercent}%
              </div>
              <div className="text-xs text-gray-500">
                {estimatedTime}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${colorClasses.progress}`}
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Processing...</span>
            <span>{progress.progressPercent}% complete</span>
          </div>
        </div>

        {/* Detailed Steps */}
        {showDetailedSteps && progress.totalSteps > 1 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Resolution Steps
            </h4>
            <ProgressSteps
              currentStep={progress.currentStep}
              totalSteps={progress.totalSteps}
              stepName={progress.stepName}
              phaseInfo={phaseInfo}
              colorClasses={colorClasses}
            />
          </div>
        )}

        {/* Status Message */}
        {progress.message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Status:</span> {progress.message}
            </p>
          </div>
        )}

        {/* Loading Animation */}
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className={`w-2 h-2 rounded-full animate-pulse ${colorClasses.progress}`} />
            <div className={`w-2 h-2 rounded-full animate-pulse ${colorClasses.progress}`} style={{ animationDelay: '0.1s' }} />
            <div className={`w-2 h-2 rounded-full animate-pulse ${colorClasses.progress}`} style={{ animationDelay: '0.2s' }} />
          </div>
        </div>

        {/* Time Estimates */}
        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="font-medium text-gray-900">
              {estimatedTime}
            </div>
            <div className="text-gray-600">
              Remaining
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="font-medium text-gray-900">
              {progress.currentStep}/{progress.totalSteps}
            </div>
            <div className="text-gray-600">
              Steps
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TurnResolutionProgress