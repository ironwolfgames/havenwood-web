'use client'

import { useState, useEffect } from 'react'
import { GameSession, SessionPlayer } from '@/lib/supabase'

interface SessionWithDetails extends GameSession {
  playerCount: number
  maxPlayers: number
  shared_project: {
    name: string
  } | null
  creator: {
    username: string
  } | null
}

export default function SessionBrowser() {
  const [sessions, setSessions] = useState<SessionWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlayerCount, setFilterPlayerCount] = useState<number | ''>('')
  const [joining, setJoining] = useState<string | null>(null)

  // Load available sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await fetch('/api/lobby/sessions')
        if (!response.ok) {
          throw new Error('Failed to load sessions')
        }
        const sessionsData = await response.json()
        setSessions(sessionsData)
      } catch (err) {
        console.error('Error loading sessions:', err)
        setError('Failed to load sessions')
      } finally {
        setLoading(false)
      }
    }

    loadSessions()
    
    // Poll for updates every 10 seconds
    const interval = setInterval(loadSessions, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleJoinSession = async (sessionId: string) => {
    setJoining(sessionId)
    setError(null)

    try {
      const response = await fetch('/api/lobby/join-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to join session')
      }

      // Redirect to session page
      window.location.href = `/session/${sessionId}`
    } catch (err) {
      console.error('Error joining session:', err)
      setError(err instanceof Error ? err.message : 'Failed to join session')
    } finally {
      setJoining(null)
    }
  }

  // Filter sessions based on search and filter criteria
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchTerm || 
      session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.shared_project?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.creator?.username.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPlayerCount = filterPlayerCount === '' || 
      session.playerCount === filterPlayerCount
    
    return matchesSearch && matchesPlayerCount && session.status === 'waiting'
  })

  if (loading) {
    return <div className="text-gray-500">Loading sessions...</div>
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-2">
            Search Sessions
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Search by name, project, or creator..."
          />
        </div>

        <div>
          <label htmlFor="filterPlayerCount" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Player Count
          </label>
          <select
            id="filterPlayerCount"
            value={filterPlayerCount}
            onChange={(e) => setFilterPlayerCount(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Sessions</option>
            <option value={1}>1 Player</option>
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4+ Players</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">
              {sessions.length === 0 
                ? 'No active sessions found. Create one to get started!'
                : 'No sessions match your search criteria.'
              }
            </div>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {session.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session.status === 'waiting' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : session.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>👥 {session.playerCount}/{session.maxPlayers} players</span>
                      {session.shared_project && (
                        <span>🎯 {session.shared_project.name}</span>
                      )}
                      {session.creator && (
                        <span>👤 Created by {session.creator.username}</span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Created {new Date(session.created_at).toLocaleDateString()} at {' '}
                      {new Date(session.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => handleJoinSession(session.id)}
                    disabled={joining === session.id || session.playerCount >= session.maxPlayers}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      session.playerCount >= session.maxPlayers
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50'
                    }`}
                  >
                    {joining === session.id ? 'Joining...' : 
                     session.playerCount >= session.maxPlayers ? 'Full' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-green-600 hover:text-green-700 underline"
        >
          Refresh Sessions
        </button>
      </div>
    </div>
  )
}