'use client'

import { useState, useEffect } from 'react'
import { Faction, SessionPlayer } from '@/lib/supabase'

interface FactionSelectorProps {
  sessionId: string
  currentPlayerId?: string
  onFactionSelect?: (factionId: string) => void
}

export default function FactionSelector({ sessionId, currentPlayerId, onFactionSelect }: FactionSelectorProps) {
  const [factions, setFactions] = useState<Faction[]>([])
  const [sessionPlayers, setSessionPlayers] = useState<SessionPlayer[]>([])
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load factions and session players
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load available factions
        const factionsResponse = await fetch('/api/lobby/factions')
        if (!factionsResponse.ok) {
          throw new Error('Failed to load factions')
        }
        const factionsData = await factionsResponse.json()
        setFactions(factionsData)

        // Load session players with their faction selections
        const playersResponse = await fetch(`/api/lobby/session-players/${sessionId}`)
        if (!playersResponse.ok) {
          throw new Error('Failed to load session players')
        }
        const playersData = await playersResponse.json()
        setSessionPlayers(playersData)

        // Set current player's faction if they have one
        const currentPlayer = playersData.find((p: SessionPlayer) => p.player_id === currentPlayerId)
        if (currentPlayer?.faction_id) {
          setSelectedFactionId(currentPlayer.faction_id)
        }
      } catch (err) {
        console.error('Error loading faction data:', err)
        setError('Failed to load faction selection data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [sessionId, currentPlayerId])

  const handleFactionSelect = async (factionId: string) => {
    if (!currentPlayerId) {
      setError('You must be logged in to select a faction')
      return
    }

    try {
      const response = await fetch('/api/lobby/select-faction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          playerId: currentPlayerId,
          factionId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to select faction')
      }

      setSelectedFactionId(factionId)
      onFactionSelect?.(factionId)
    } catch (err) {
      console.error('Error selecting faction:', err)
      setError(err instanceof Error ? err.message : 'Failed to select faction')
    }
  }

  const isFactionTaken = (factionId: string) => {
    return sessionPlayers.some(player => 
      player.faction_id === factionId && player.player_id !== currentPlayerId
    )
  }

  if (loading) {
    return <div className="text-gray-500">Loading factions...</div>
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choose Your Faction
        </h3>
        <p className="text-sm text-gray-600">
          Each faction has unique abilities and resources. Choose wisely to complement your team!
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factions.map((faction) => {
          const taken = isFactionTaken(faction.id)
          const selected = selectedFactionId === faction.id
          
          return (
            <div
              key={faction.id}
              className={`
                relative p-6 rounded-lg border-2 transition-all cursor-pointer
                ${selected 
                  ? 'border-green-500 bg-green-50' 
                  : taken 
                  ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                  : 'border-gray-300 bg-white hover:border-green-300 hover:bg-green-50'
                }
              `}
              onClick={() => !taken && handleFactionSelect(faction.id)}
            >
              {/* Faction Icon/Avatar placeholder */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {getFactionEmoji(faction.system_type)}
                </span>
              </div>

              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {faction.name}
                </h4>
                <p className="text-xs text-gray-600 mb-3 uppercase tracking-wide font-medium">
                  {faction.system_type}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {getShortDescription(faction.system_type)}
                </p>
              </div>

              {/* Status indicators */}
              {selected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {taken && !selected && (
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                    Taken
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedFactionId && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="text-green-800 text-sm">
            <strong>Faction Selected:</strong> {factions.find(f => f.id === selectedFactionId)?.name}
          </div>
          <p className="text-green-700 text-sm mt-1">
            {factions.find(f => f.id === selectedFactionId)?.description}
          </p>
        </div>
      )}
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

function getShortDescription(systemType: string): string {
  switch (systemType) {
    case 'provisioner': 
      return 'Masters of agriculture and resource production. Provide food, timber, and fiber to sustain all factions.'
    case 'guardian': 
      return 'Protectors and defenders. Generate protection and stability tokens to safeguard the community.'
    case 'mystic': 
      return 'Scholars of magic and knowledge. Create insight tokens and magical crystals to empower others.'
    case 'explorer': 
      return 'Builders and adventurers. Construct infrastructure and drive progress on shared victory projects.'
    default: 
      return 'A unique faction with special abilities.'
  }
}