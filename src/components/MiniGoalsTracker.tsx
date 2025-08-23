/**
 * Mini-goals tracker component to display faction goal progress
 */

'use client'

import React, { useState, useEffect } from 'react'

export interface MiniGoal {
  goal: {
    id: string
    goal_type: string
    target_value: number
    current_progress: number
    is_completed: boolean
    completed_turn?: number | null
  }
  definition: {
    goalType: string
    name: string
    description: string
    targetValue: number
    trackingMetric: string
  }
  progressPercentage: number
  isAchievable: boolean
}

export interface PlayerGoals {
  playerId: string
  factionType: string
  goals: MiniGoal[]
}

export interface MiniGoalsTrackerProps {
  sessionId: string
  currentPlayerId?: string
  compact?: boolean
  showAllPlayers?: boolean
}

export default function MiniGoalsTracker({
  sessionId,
  currentPlayerId,
  compact = false,
  showAllPlayers = false
}: MiniGoalsTrackerProps) {
  const [playerGoals, setPlayerGoals] = useState<PlayerGoals[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMiniGoals()
  }, [sessionId])

  const fetchMiniGoals = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/game/mini-goals/${sessionId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch mini-goals')
      }

      const data = await response.json()
      setPlayerGoals(data.playerGoals || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const getFactionDisplayName = (factionType: string) => {
    const names = {
      provisioner: 'Meadow Moles',
      guardian: 'Oakshield Badgers',
      mystic: 'Starling Scholars',
      explorer: 'River Otters'
    }
    return names[factionType as keyof typeof names] || factionType
  }

  const getFactionEmoji = (factionType: string) => {
    const emojis = {
      provisioner: '🌾',
      guardian: '🛡️',
      mystic: '✨',
      explorer: '⚡'
    }
    return emojis[factionType as keyof typeof emojis] || '❓'
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-600">Error loading mini-goals: {error}</div>
        <button 
          onClick={fetchMiniGoals}
          className="mt-2 text-sm text-red-600 underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    )
  }

  // Filter to current player if specified and not showing all players
  let displayGoals = playerGoals
  if (currentPlayerId && !showAllPlayers) {
    displayGoals = playerGoals.filter(p => p.playerId === currentPlayerId)
  }

  if (displayGoals.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-gray-600">No mini-goals found for this session.</div>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {displayGoals.map(playerGoal => (
          <div key={playerGoal.playerId} className="bg-white border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getFactionEmoji(playerGoal.factionType)}</span>
                <span className="font-medium text-sm">
                  {getFactionDisplayName(playerGoal.factionType)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {playerGoal.goals.filter(g => g.goal.is_completed).length}/{playerGoal.goals.length}
              </div>
            </div>
            <div className="space-y-1">
              {playerGoal.goals.map(goal => (
                <div key={goal.goal.id} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${goal.goal.is_completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-xs ${goal.goal.is_completed ? 'text-green-700' : 'text-gray-600'}`}>
                    {goal.definition.name}
                  </span>
                  <div className="flex-1"></div>
                  <span className="text-xs text-gray-500">
                    {goal.goal.current_progress}/{goal.goal.target_value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Faction Mini-Goals</h3>
        <button 
          onClick={fetchMiniGoals}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Refresh
        </button>
      </div>

      {displayGoals.map(playerGoal => (
        <div key={playerGoal.playerId} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">{getFactionEmoji(playerGoal.factionType)}</span>
            <div>
              <h4 className="font-semibold text-lg">
                {getFactionDisplayName(playerGoal.factionType)}
              </h4>
              <p className="text-sm text-gray-600">
                {playerGoal.goals.filter(g => g.goal.is_completed).length} of {playerGoal.goals.length} completed
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {playerGoal.goals.map(goal => (
              <div key={goal.goal.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-medium">{goal.definition.name}</h5>
                      {goal.goal.is_completed && (
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          ✓ Complete
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{goal.definition.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Progress:</span>
                  <span className="text-sm font-medium">
                    {goal.goal.current_progress} / {goal.goal.target_value}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      goal.goal.is_completed ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                  ></div>
                </div>

                {goal.goal.is_completed && goal.goal.completed_turn && (
                  <p className="text-xs text-green-600 mt-2">
                    Completed on turn {goal.goal.completed_turn}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {displayGoals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No mini-goals to display
        </div>
      )}
    </div>
  )
}