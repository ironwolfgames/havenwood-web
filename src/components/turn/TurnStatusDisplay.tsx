/**
 * Turn Status Display Component
 * 
 * Shows current turn number, phase indicator, and session timing information.
 * Provides clear visual indication of game progress and current phase.
 */

import React from 'react'
import { TurnPhase, TurnStatusInfo } from '@/types/turn-management'
import { formatDuration } from '@/lib/turn-timer'

export interface TurnStatusDisplayProps {
  turnStatus: TurnStatusInfo
  className?: string
}

/**
 * Get phase display information
 */
function getPhaseInfo(phase: TurnPhase): {
  name: string
  description: string
  icon: string
  color: string
} {
  switch (phase) {
    case 'plan':
      return {
        name: 'Planning Phase',
        description: 'Players are selecting their actions',
        icon: '🎯',
        color: 'blue',
      }
    case 'resolution':
      return {
        name: 'Resolution Phase', 
        description: 'Actions are being processed',
        icon: '⚙️',
        color: 'yellow',
      }
    case 'event':
      return {
        name: 'Event Phase',
        description: 'Global events are occurring',
        icon: '⚡',
        color: 'purple',
      }
    case 'progress':
      return {
        name: 'Progress Check',
        description: 'Checking victory and failure conditions',
        icon: '📊',
        color: 'green',
      }
    default:
      return {
        name: 'Unknown Phase',
        description: 'Phase information unavailable',
        icon: '❓',
        color: 'gray',
      }
  }
}

/**
 * Get color classes for phase indicator
 */
function getPhaseColorClasses(color: string): {
  bg: string
  text: string
  border: string
} {
  switch (color) {
    case 'blue':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      }
    case 'yellow':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
      }
    case 'purple':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
      }
    case 'green':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
      }
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
      }
  }
}

/**
 * Calculate session elapsed time
 */
function calculateElapsedTime(startTime: string): string {
  const start = new Date(startTime)
  const now = new Date()
  const elapsedMs = now.getTime() - start.getTime()
  const elapsedSeconds = Math.floor(elapsedMs / 1000)
  return formatDuration(elapsedSeconds)
}

/**
 * Turn Status Display Component
 */
export function TurnStatusDisplay({ turnStatus, className = '' }: TurnStatusDisplayProps) {
  const phaseInfo = getPhaseInfo(turnStatus.currentPhase)
  const phaseColors = getPhaseColorClasses(phaseInfo.color)
  const elapsedTime = calculateElapsedTime(turnStatus.sessionStartedAt)

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        {/* Turn Progress Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Turn {turnStatus.turnNumber} of {turnStatus.totalTurns}
          </h2>
          <div className="mt-2">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(turnStatus.turnNumber / turnStatus.totalTurns) * 100}%`,
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Game Progress: {Math.round((turnStatus.turnNumber / turnStatus.totalTurns) * 100)}%
            </p>
          </div>
        </div>

        {/* Current Phase Display */}
        <div className={`rounded-lg border p-4 text-center ${phaseColors.bg} ${phaseColors.border}`}>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl" role="img" aria-label={phaseInfo.name}>
              {phaseInfo.icon}
            </span>
            <div>
              <h3 className={`font-semibold text-lg ${phaseColors.text}`}>
                {phaseInfo.name}
              </h3>
              <p className={`text-sm ${phaseColors.text} opacity-80`}>
                {phaseInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Session Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">
              {elapsedTime}
            </div>
            <div className="text-sm text-gray-600">
              Session Time
            </div>
          </div>
          
          {turnStatus.estimatedRemainingTime && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-gray-900">
                {formatDuration(turnStatus.estimatedRemainingTime * 60)}
              </div>
              <div className="text-sm text-gray-600">
                Est. Remaining
              </div>
            </div>
          )}
        </div>

        {/* Quick Status Indicators */}
        <div className="flex flex-wrap justify-center gap-2">
          {/* Players Ready Indicator */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            turnStatus.allPlayersReady
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <span className="w-2 h-2 rounded-full mr-2 ${
              turnStatus.allPlayersReady ? 'bg-green-600' : 'bg-yellow-600'
            }"/>
            {turnStatus.allPlayersReady ? 'All Ready' : 'Waiting for Players'}
          </div>

          {/* Resolution Ready Indicator */}
          {turnStatus.canResolve && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"/>
              Can Resolve
            </div>
          )}

          {/* Player Count */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            👥 {turnStatus.playerStatuses.length} Players
          </div>
        </div>
      </div>
    </div>
  )
}

export default TurnStatusDisplay