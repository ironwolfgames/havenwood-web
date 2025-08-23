/**
 * Action History Component
 * 
 * Displays a chronological list of player actions with status and details.
 * Provides audit trail functionality for submitted and resolved actions.
 */

import React, { useState, useEffect } from 'react'
import { Action } from '@/lib/supabase'
import { GameActionType } from '@/types/game'

export interface ActionHistoryProps {
  sessionId: string
  playerId?: string
  turnNumber?: number
  maxItems?: number
  showAllPlayers?: boolean
  className?: string
}

export function ActionHistory({
  sessionId,
  playerId,
  turnNumber,
  maxItems = 10,
  showAllPlayers = false,
  className = ""
}: ActionHistoryProps) {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActions()
  }, [sessionId, playerId, turnNumber, maxItems]) // Fixed dependency array

  const fetchActions = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ sessionId })
      if (turnNumber) params.set('turnNumber', turnNumber.toString())
      if (playerId && !showAllPlayers) params.set('playerId', playerId)

      const response = await fetch(`/api/actions/query?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch actions')
      }

      setActions(result.actions.slice(0, maxItems))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [sessionId, playerId, turnNumber, maxItems, showAllPlayers]) // Added useCallback dependencies

  const getActionIcon = (type: GameActionType): string => {
    const icons: Record<GameActionType, string> = {
      gather: '🏗️',
      trade: '🤝',
      convert: '🔄',
      build: '🏘️',
      research: '🔬',
      protect: '🛡️',
      special: '✨'
    }
    return icons[type as GameActionType] || '❓'
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'submitted':
        return 'text-blue-600 bg-blue-50'
      case 'resolved':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatActionData = (actionData: any): string => {
    if (!actionData || typeof actionData !== 'object') return 'No details'
    
    const details = []
    if (actionData.amount) details.push(`Amount: ${actionData.amount}`)
    if (actionData.resourceType) details.push(`Resource: ${actionData.resourceType}`)
    if (actionData.fromResource && actionData.toResource) {
      details.push(`${actionData.fromResource} → ${actionData.toResource}`)
    }
    if (actionData.buildingType) details.push(`Building: ${actionData.buildingType}`)
    if (actionData.ability) details.push(`Ability: ${actionData.ability}`)
    if (actionData.is_locked) details.push('🔒 Locked')
    
    return details.length > 0 ? details.join(', ') : 'Basic action'
  }

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <div className={`action-history ${className}`}>
        <div className="text-center py-4">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full" />
          <div className="mt-2 text-sm text-gray-600">Loading actions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`action-history ${className}`}>
        <div className="text-center py-4 text-red-600">
          <div className="text-lg">⚠️</div>
          <div className="text-sm">{error}</div>
          <button
            onClick={fetchActions}
            className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`action-history bg-white border rounded-lg ${className}`}>
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-medium text-gray-900">
          Action History
          {turnNumber && ` - Turn ${turnNumber}`}
          {showAllPlayers ? ' (All Players)' : ' (Your Actions)'}
        </h3>
        <button
          onClick={fetchActions}
          className="mt-1 text-xs text-blue-600 hover:text-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {actions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm">No actions found</div>
            {turnNumber && (
              <div className="text-xs mt-1">Try a different turn number</div>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {actions.map((action, index) => (
              <div key={action.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getActionIcon(action.action_type as GameActionType)}</span>
                    <div>
                      <div className="font-medium text-sm capitalize">
                        {action.action_type.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-gray-500">
                        Turn {action.turn_number}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(action.status)}`}>
                      {action.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                  {formatActionData(action.action_data)}
                </div>

                <div className="text-xs text-gray-400">
                  Submitted: {formatTimestamp(action.submitted_at)}
                </div>

                {showAllPlayers && (
                  <div className="text-xs text-gray-500 mt-1">
                    Player ID: {action.player_id.slice(-8)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {actions.length > 0 && actions.length === maxItems && (
        <div className="p-3 border-t bg-gray-50 text-center">
          <div className="text-xs text-gray-500">
            Showing {maxItems} most recent actions
          </div>
        </div>
      )}
    </div>
  )
}