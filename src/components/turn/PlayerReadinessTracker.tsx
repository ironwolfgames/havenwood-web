/**
 * Player Readiness Tracker Component
 * 
 * Displays real-time status of all players, their action submissions,
 * and readiness states. Includes controls for manual readiness and force resolution.
 */

import React, { useState } from 'react'
import { PlayerStatus, PlayerReadiness, TurnStatusInfo } from '@/types/turn-management'

export interface PlayerReadinessTrackerProps {
  turnStatus: TurnStatusInfo
  currentPlayerId?: string
  isSessionCreator?: boolean
  onToggleReadiness?: (ready: boolean) => void
  onForceResolution?: () => void
  className?: string
}

/**
 * Get readiness display information
 */
function getReadinessInfo(readiness: PlayerReadiness): {
  icon: string
  color: string
  text: string
  bgColor: string
  textColor: string
} {
  switch (readiness) {
    case 'ready':
      return {
        icon: '✅',
        color: 'green',
        text: 'Ready',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
      }
    case 'waiting':
      return {
        icon: '⏳',
        color: 'blue',
        text: 'Waiting',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
      }
    case 'not_ready':
      return {
        icon: '⏱️',
        color: 'yellow',
        text: 'Planning',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
      }
    case 'disconnected':
      return {
        icon: '🔌',
        color: 'red',
        text: 'Disconnected',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
      }
    default:
      return {
        icon: '❓',
        color: 'gray',
        text: 'Unknown',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
      }
  }
}

/**
 * Get faction icon emoji based on faction name
 */
function getFactionIcon(factionName: string): string {
  switch (factionName.toLowerCase()) {
    case 'meadow moles':
      return '🐹'
    case 'oakshield badgers':
      return '🦡'
    case 'starling scholars':
      return '🦅'
    case 'river otters':
      return '🦦'
    default:
      return '🏳️'
  }
}

/**
 * Individual Player Status Card
 */
function PlayerStatusCard({ 
  player, 
  isCurrentPlayer = false,
  showActions = true 
}: { 
  player: PlayerStatus
  isCurrentPlayer?: boolean
  showActions?: boolean
}) {
  const readinessInfo = getReadinessInfo(player.readiness)
  const factionIcon = getFactionIcon(player.factionName)

  return (
    <div className={`rounded-lg border p-4 transition-all duration-200 ${
      isCurrentPlayer 
        ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-200' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      <div className="space-y-3">
        {/* Player Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl" title={player.factionName}>
                {factionIcon}
              </span>
              <div>
                <div className="font-medium text-gray-900 flex items-center">
                  {player.username}
                  {player.isSessionCreator && (
                    <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-md font-semibold">
                      HOST
                    </span>
                  )}
                  {isCurrentPlayer && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-md font-semibold">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {player.factionName}
                </div>
              </div>
            </div>
          </div>

          {/* Readiness Status */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            readinessInfo.bgColor} ${readinessInfo.textColor
          }`}>
            <span className="mr-1">{readinessInfo.icon}</span>
            {readinessInfo.text}
          </div>
        </div>

        {/* Action Progress */}
        {showActions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Actions Submitted:</span>
              <span className={`font-medium ${
                player.actionsSubmitted === player.totalActionsRequired 
                  ? 'text-green-600' 
                  : 'text-gray-900'
              }`}>
                {player.actionsSubmitted} / {player.totalActionsRequired}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  player.actionsSubmitted === player.totalActionsRequired 
                    ? 'bg-green-500' 
                    : 'bg-blue-500'
                }`}
                style={{
                  width: `${Math.min(100, (player.actionsSubmitted / player.totalActionsRequired) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Last Activity */}
        <div className="text-xs text-gray-500">
          Last activity: {new Date(player.lastActivityAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

/**
 * Player Readiness Tracker Component
 */
export function PlayerReadinessTracker({
  turnStatus,
  currentPlayerId,
  isSessionCreator = false,
  onToggleReadiness,
  onForceResolution,
  className = '',
}: PlayerReadinessTrackerProps) {
  const [showDetails, setShowDetails] = useState(true)

  // Get current player status
  const currentPlayer = currentPlayerId 
    ? turnStatus.playerStatuses.find(p => p.playerId === currentPlayerId)
    : null

  // Calculate summary stats
  const readyPlayers = turnStatus.playerStatuses.filter(p => p.readiness === 'ready' || p.readiness === 'waiting')
  const disconnectedPlayers = turnStatus.playerStatuses.filter(p => p.readiness === 'disconnected')
  const totalActions = turnStatus.playerStatuses.reduce((sum, p) => sum + p.actionsSubmitted, 0)
  const requiredActions = turnStatus.playerStatuses.reduce((sum, p) => sum + p.totalActionsRequired, 0)

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            👥 Player Readiness
            <span className="ml-2 text-sm text-gray-500">
              ({readyPlayers.length}/{turnStatus.playerStatuses.length} ready)
            </span>
          </h3>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showDetails ? '👁️ Hide Details' : '👁️ Show Details'}
          </button>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-600">
              {readyPlayers.length}
            </div>
            <div className="text-sm text-green-800">Ready</div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-yellow-600">
              {turnStatus.playerStatuses.length - readyPlayers.length - disconnectedPlayers.length}
            </div>
            <div className="text-sm text-yellow-800">Planning</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600">
              {totalActions}
            </div>
            <div className="text-sm text-blue-800">Actions</div>
          </div>
          
          <div className={`rounded-lg p-3 text-center ${
            disconnectedPlayers.length > 0 ? 'bg-red-50' : 'bg-gray-50'
          }`}>
            <div className={`text-xl font-bold ${
              disconnectedPlayers.length > 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {disconnectedPlayers.length}
            </div>
            <div className={`text-sm ${
              disconnectedPlayers.length > 0 ? 'text-red-800' : 'text-gray-800'
            }`}>
              Offline
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overall Progress:</span>
            <span className="font-medium">
              {totalActions} / {requiredActions} actions
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                turnStatus.allPlayersReady ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min(100, requiredActions > 0 ? (totalActions / requiredActions) * 100 : 0)}%`,
              }}
            />
          </div>
        </div>

        {/* Player List */}
        {showDetails && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Player Status</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {turnStatus.playerStatuses.map((player) => (
                <PlayerStatusCard
                  key={player.playerId}
                  player={player}
                  isCurrentPlayer={player.playerId === currentPlayerId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Current Player Actions */}
        {currentPlayer && onToggleReadiness && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Your Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getReadinessInfo(currentPlayer.readiness).bgColor
                } ${getReadinessInfo(currentPlayer.readiness).textColor}`}>
                  {getReadinessInfo(currentPlayer.readiness).icon} {getReadinessInfo(currentPlayer.readiness).text}
                </span>
              </div>
              
              <button
                onClick={() => onToggleReadiness(currentPlayer.readiness !== 'ready')}
                disabled={currentPlayer.readiness === 'disconnected'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPlayer.readiness === 'ready'
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {currentPlayer.readiness === 'ready' ? '↩️ Continue Planning' : '✅ Mark Ready'}
              </button>
            </div>
          </div>
        )}

        {/* Session Creator Controls */}
        {isSessionCreator && (
          <div className="border-t pt-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="text-sm text-gray-600">
                Host Controls:
              </div>
              
              <div className="flex gap-2">
                {turnStatus.canResolve && onForceResolution && (
                  <button
                    onClick={onForceResolution}
                    className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg text-sm font-medium"
                  >
                    🚀 Force Resolution
                  </button>
                )}
              </div>
            </div>
            
            {!turnStatus.allPlayersReady && (
              <div className="mt-2 text-xs text-gray-500">
                Waiting for: {turnStatus.playerStatuses
                  .filter(p => p.readiness === 'not_ready')
                  .map(p => p.username)
                  .join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Auto-resolution notice */}
        {turnStatus.allPlayersReady && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">🎯</span>
              <p className="text-sm text-green-700">
                <strong>All players ready!</strong> Turn can be resolved or will auto-resolve when timer expires.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerReadinessTracker