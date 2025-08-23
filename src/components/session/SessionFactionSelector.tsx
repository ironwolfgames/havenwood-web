'use client'

import { useState, useEffect } from 'react'
import FactionSelector from '@/components/lobby/FactionSelector'

interface SessionFactionSelectorProps {
  sessionId: string
}

export default function SessionFactionSelector({ sessionId }: SessionFactionSelectorProps) {
  const [currentPlayerId, setCurrentPlayerId] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Get the current player ID from sessionStorage (set when joining/creating session)
    const playerId = sessionStorage.getItem('currentPlayerId')
    setCurrentPlayerId(playerId || undefined)
  }, [])

  if (currentPlayerId === undefined) {
    return <div className="text-gray-500">Loading player information...</div>
  }

  return (
    <FactionSelector 
      sessionId={sessionId}
      currentPlayerId={currentPlayerId}
    />
  )
}