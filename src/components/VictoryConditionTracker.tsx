'use client'

import React from 'react'
import { ProjectStatusSummary } from '@/types/projects'

interface GlobalContext {
  stabilityTokens: number
  protectionTokens: number
  infrastructureTokens: number
  turnsRemaining?: number
  maxTurns?: number
}

interface VictoryConditionTrackerProps {
  status: ProjectStatusSummary
  globalContext: GlobalContext
  className?: string
}

export default function VictoryConditionTracker({
  status,
  globalContext,
  className = ''
}: VictoryConditionTrackerProps) {
  const { turnsRemaining, maxTurns } = globalContext
  const { completion } = status

  // Calculate completion rate and risk assessment
  const calculateRiskAssessment = () => {
    if (completion.isCompleted) {
      return { status: 'victory', level: 'success', message: 'Project completed successfully!' }
    }

    if (!turnsRemaining || !maxTurns) {
      return { status: 'unknown', level: 'neutral', message: 'Turn information not available' }
    }

    const turnsUsed = maxTurns - turnsRemaining
    const progressRate = turnsUsed > 0 ? completion.completedStages / turnsUsed : 0
    const estimatedTurnsNeeded = progressRate > 0 ? (status.totalStages - completion.completedStages) / progressRate : Infinity

    if (estimatedTurnsNeeded <= turnsRemaining * 0.8) {
      return { status: 'ahead', level: 'success', message: 'Ahead of schedule! 🎉' }
    } else if (estimatedTurnsNeeded <= turnsRemaining) {
      return { status: 'on_track', level: 'warning', message: 'On track, maintain pace' }
    } else if (estimatedTurnsNeeded <= turnsRemaining * 1.2) {
      return { status: 'behind', level: 'danger', message: 'Behind schedule - need acceleration!' }
    } else {
      return { status: 'critical', level: 'danger', message: 'Critical - major push needed!' }
    }
  }

  // Calculate stability risk
  const getStabilityRisk = () => {
    const { stabilityTokens, protectionTokens, infrastructureTokens } = globalContext
    
    if (stabilityTokens >= 8 && protectionTokens >= 8 && infrastructureTokens >= 8) {
      return { level: 'safe', message: 'All systems stable', color: 'text-green-600' }
    } else if (stabilityTokens >= 5 && protectionTokens >= 5 && infrastructureTokens >= 5) {
      return { level: 'warning', message: 'Some systems under stress', color: 'text-yellow-600' }
    } else {
      return { level: 'danger', message: 'Critical system instability!', color: 'text-red-600' }
    }
  }

  const riskAssessment = calculateRiskAssessment()
  const stabilityRisk = getStabilityRisk()
  const progressPercentage = (completion.completedStages / status.totalStages) * 100

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🏆 Victory Conditions
        </h3>
        <p className="text-sm text-gray-600">
          Track progress toward session victory and manage risks
        </p>
      </div>

      {/* Overall Status */}
      <div className={`mb-6 p-4 rounded-lg border-l-4 ${
        riskAssessment.level === 'success' 
          ? 'bg-green-50 border-green-400' 
          : riskAssessment.level === 'warning'
            ? 'bg-yellow-50 border-yellow-400'
            : 'bg-red-50 border-red-400'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-800">Mission Status</span>
          <span className={`px-2 py-1 text-xs font-bold rounded ${
            riskAssessment.level === 'success' 
              ? 'bg-green-200 text-green-800' 
              : riskAssessment.level === 'warning'
                ? 'bg-yellow-200 text-yellow-800'
                : 'bg-red-200 text-red-800'
          }`}>
            {riskAssessment.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <p className={`text-sm ${
          riskAssessment.level === 'success' ? 'text-green-700' 
          : riskAssessment.level === 'warning' ? 'text-yellow-700'
          : 'text-red-700'
        }`}>
          {riskAssessment.message}
        </p>
      </div>

      {/* Progress Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Project Completion */}
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-800 mb-1">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-sm text-blue-600 mb-2">Project Complete</div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Time Remaining */}
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-800 mb-1">
            {turnsRemaining || '?'}
          </div>
          <div className="text-sm text-purple-600 mb-2">Turns Left</div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: turnsRemaining && maxTurns 
                  ? `${(turnsRemaining / maxTurns) * 100}%` 
                  : '0%' 
              }}
            />
          </div>
        </div>
      </div>

      {/* Victory Requirements */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">🎯 Victory Requirements</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">Complete all project stages</span>
            <span className={`text-sm font-medium ${
              completion.isCompleted ? 'text-green-600' : 'text-gray-500'
            }`}>
              {completion.completedStages}/{status.totalStages}
              {completion.isCompleted && ' ✓'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">Maintain kingdom stability</span>
            <span className={stabilityRisk.color + ' text-sm font-medium'}>
              {stabilityRisk.level === 'safe' ? '✓' : stabilityRisk.level === 'warning' ? '⚠️' : '❌'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">Complete within turn limit</span>
            <span className={`text-sm font-medium ${
              !turnsRemaining || turnsRemaining > 5 ? 'text-green-600' 
              : turnsRemaining > 2 ? 'text-yellow-600' 
              : 'text-red-600'
            }`}>
              {turnsRemaining ? (turnsRemaining > 0 ? `${turnsRemaining} left` : 'Time up!') : 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Stability Overview */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">⚖️ Kingdom Stability</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className={`text-sm font-medium mb-2 ${stabilityRisk.color}`}>
            {stabilityRisk.message}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className={`text-lg font-bold ${
                globalContext.stabilityTokens >= 8 ? 'text-green-600' 
                : globalContext.stabilityTokens >= 5 ? 'text-yellow-600' 
                : 'text-red-600'
              }`}>
                {globalContext.stabilityTokens}
              </div>
              <div className="text-xs text-gray-600">Stability</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${
                globalContext.protectionTokens >= 8 ? 'text-green-600' 
                : globalContext.protectionTokens >= 5 ? 'text-yellow-600' 
                : 'text-red-600'
              }`}>
                {globalContext.protectionTokens}
              </div>
              <div className="text-xs text-gray-600">Protection</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${
                globalContext.infrastructureTokens >= 8 ? 'text-green-600' 
                : globalContext.infrastructureTokens >= 5 ? 'text-yellow-600' 
                : 'text-red-600'
              }`}>
                {globalContext.infrastructureTokens}
              </div>
              <div className="text-xs text-gray-600">Infrastructure</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Probability */}
      {!completion.isCompleted && turnsRemaining && maxTurns && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">📈 Success Probability</h4>
          <div className="bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {Math.min(Math.max(Math.round(((progressPercentage / 100) * (turnsRemaining / maxTurns) * 100) + 20), 10), 95)}%
            </div>
            <div className="text-sm text-gray-600">
              Estimated success chance based on current progress and time remaining
            </div>
          </div>
        </div>
      )}

      {/* Victory State */}
      {completion.isCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h4 className="text-lg font-bold text-green-800 mb-2">Victory Achieved!</h4>
          <p className="text-sm text-green-700">
            The kingdoms have been saved through collaborative effort and strategic planning!
          </p>
        </div>
      )}
    </div>
  )
}