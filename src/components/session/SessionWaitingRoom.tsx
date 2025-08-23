'use client'

import { useState, useEffect } from 'react'
import WaitingRoom from '@/components/lobby/WaitingRoom'
import { GameSession } from '@/lib/supabase'

interface SessionWaitingRoomProps {
  sessionId: string
  session: GameSession
}

export default function SessionWaitingRoom({ sessionId, session }: SessionWaitingRoomProps) {
  const [currentPlayerId, setCurrentPlayerId] = useState<string | undefined>(undefined)
  const [isCreator, setIsCreator] = useState(false)

  useEffect(() => {
    // Get the current player ID from sessionStorage (set when joining/creating session)
    const playerId = sessionStorage.getItem('currentPlayerId')
    setCurrentPlayerId(playerId || undefined)
    
    // Check if current player is the session creator
    if (playerId && session.creator_id) {
      setIsCreator(playerId === session.creator_id)
    }
  }, [session.creator_id])

  if (currentPlayerId === undefined) {
    return <div className="text-gray-500">Loading player information...</div>
  }

  return (
    <WaitingRoom
      sessionId={sessionId}
      session={session}
      currentPlayerId={currentPlayerId}
      isCreator={isCreator}
    />
  )
}