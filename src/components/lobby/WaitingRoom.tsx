'use client'

import { useState, useEffect } from 'react'
import { GameSession, SessionPlayer, Faction, Player } from '@/lib/supabase'
import { realtimeManager, createSessionFilter } from '@/lib/realtime'

interface WaitingRoomPlayer extends SessionPlayer {
  players?: Player
  factions?: Faction
}

interface WaitingRoomProps {
  sessionId: string
  session: GameSession
  currentPlayerId?: string
  isCreator?: boolean
}

export default function WaitingRoom({ sessionId, session, currentPlayerId, isCreator }: WaitingRoomProps) {
  const [players, setPlayers] = useState<WaitingRoomPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startingGame, setStartingGame] = useState(false)

  // Load session players
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const response = await fetch(`/api/lobby/session-players/${sessionId}`)
        if (!response.ok) {
          throw new Error('Failed to load session players')
        }
        const playersData = await response.json()
        setPlayers(playersData)
      } catch (err) {
        console.error('Error loading session players:', err)
        setError('Failed to load session players')
      } finally {
        setLoading(false)
      }
    }

    loadPlayers()

    // Set up real-time subscription for session players changes
    const unsubscribeSessionPlayers = realtimeManager.subscribe(
      `waiting-room-${sessionId}`,
      { 
        table: 'session_players', 
        event: '*', 
        filter: createSessionFilter(sessionId)
      },
      (payload) => {
        console.log('Session players change in waiting room:', payload)
        // Reload players when changes occur
        loadPlayers()
      }
    )

    return () => {
      unsubscribeSessionPlayers()
    }
  }, [sessionId])

  const handleLeaveSession = async () => {
    if (!currentPlayerId) return

    try {
      const response = await fetch('/api/lobby/leave-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          playerId: currentPlayerId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to leave session')
      }

      // Redirect back to lobby
      window.location.href = '/lobby'
    } catch (err) {
      console.error('Error leaving session:', err)
      setError(err instanceof Error ? err.message : 'Failed to leave session')
    }
  }

  const handleStartGame = async () => {
    if (!isCreator) return

    setStartingGame(true)
    setError(null)

    try {
      const response = await fetch('/api/lobby/start-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to start game')
      }

      // Redirect to game page
      window.location.href = `/game/${sessionId}`
    } catch (err) {
      console.error('Error starting game:', err)
      setError(err instanceof Error ? err.message : 'Failed to start game')
    } finally {
      setStartingGame(false)
    }
  }

  const allPlayersHaveFactions = players.length > 0 && players.every(player => player.faction_id)
  const canStartGame = isCreator && players.length >= 2 && allPlayersHaveFactions

  if (loading) {
    return <div className="text-gray-500">Loading waiting room...</div>
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {/* Session Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {session.name}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            session.status === 'waiting' 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {session.status}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <div>👥 {players.length}/4 players joined</div>
          <div>🎯 Shared project: {session.shared_project_id || 'Not selected'}</div>
          <div>🕒 Created: {new Date(session.created_at).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Players List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Players ({players.length})
        </h4>
        
        {players.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No players in the session yet.
          </div>
        ) : (
          <div className="space-y-3">
            {players.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {(player.players?.username || `Player ${index + 1}`).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {player.players?.username || `Player ${index + 1}`}
                      {player.player_id === currentPlayerId && ' (You)'}
                      {index === 0 && ' (Host)'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Joined {new Date(player.joined_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {player.faction_id ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {getFactionEmoji(player.factions?.system_type || 'unknown')}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {player.factions?.name || 'Unknown Faction'}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          Ready
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 italic">
                      Selecting faction...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Game Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-blue-800 text-sm">
          <strong>Game Status:</strong>
          {players.length < 2 ? (
            ' Waiting for more players (minimum 2 required)'
          ) : !allPlayersHaveFactions ? (
            ' Waiting for all players to select their factions'
          ) : (
            ' Ready to start!'
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {isCreator ? (
          <button
            onClick={handleStartGame}
            disabled={!canStartGame || startingGame}
            className={`
              flex-1 px-6 py-3 rounded-md font-medium text-center transition-colors
              ${canStartGame && !startingGame
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {startingGame ? 'Starting Game...' : 'Start Game'}
          </button>
        ) : (
          <div className="flex-1 px-6 py-3 rounded-md bg-gray-100 text-gray-600 text-center">
            Waiting for host to start the game
          </div>
        )}

        <button
          onClick={handleLeaveSession}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          Leave Session
        </button>
      </div>

      {/* Communication placeholder */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Session Chat (Coming Soon)
        </h4>
        <div className="text-sm text-gray-600">
          Chat functionality will be added in a future update to help players coordinate their strategy.
        </div>
      </div>
    </div>
  )
}

function getFactionEmoji(systemType: string): string {
  switch (systemType) {
    case 'provisioner': return '🌱'
    case 'guardian': return '🛡️'
    case 'mystic': return '🔮'
    case 'explorer': return '🗺️'
    default: return '❓'
  }
}