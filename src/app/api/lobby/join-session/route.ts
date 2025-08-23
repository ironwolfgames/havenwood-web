import { NextRequest, NextResponse } from 'next/server'
import { gameSessionOperations, sessionPlayerOperations, playerOperations } from '@/lib/database-operations'
import { getCurrentUser } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, playerId, factionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { message: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Check if session exists and is available
    const session = await gameSessionOperations.getById(sessionId)
    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      )
    }

    if (session.status !== 'waiting') {
      return NextResponse.json(
        { message: 'Session is no longer accepting players' },
        { status: 400 }
      )
    }

    // For demo purposes, create a mock player if playerId not provided
    // In a real app, this would come from authenticated user session
    let playerIdToUse = playerId
    if (!playerIdToUse) {
      // Create a temporary player for demo purposes
      const mockPlayer = await playerOperations.create({
        user_id: 'temp-' + Date.now(), // temporary user ID
        username: 'Player_' + Math.random().toString(36).substr(2, 6)
      })
      playerIdToUse = mockPlayer.id
    }

    // Check if player is already in this session
    const existingParticipation = await sessionPlayerOperations.getPlayerSession(playerIdToUse, sessionId)
    if (existingParticipation) {
      return NextResponse.json(
        { message: 'Player is already in this session' },
        { status: 400 }
      )
    }

    // Get current session players to check capacity
    const sessionPlayers = await sessionPlayerOperations.getSessionPlayers(sessionId)
    const maxPlayers = session.max_players || 4
    
    if (sessionPlayers.length >= maxPlayers) {
      return NextResponse.json(
        { message: 'Session is full' },
        { status: 400 }
      )
    }

    // If factionId provided, check if it's already taken
    if (factionId) {
      const factionTaken = sessionPlayers.some(player => player.faction_id === factionId)
      if (factionTaken) {
        return NextResponse.json(
          { message: 'Faction is already taken by another player' },
          { status: 400 }
        )
      }
    }

    // Add player to session
    const sessionPlayer = await sessionPlayerOperations.joinSession({
      session_id: sessionId,
      player_id: playerIdToUse,
      faction_id: factionId || null
    })

    return NextResponse.json({
      message: 'Successfully joined session',
      sessionPlayer,
      playerId: playerIdToUse
    })
  } catch (error) {
    console.error('Error joining session:', error)
    return NextResponse.json(
      { message: 'Failed to join session' },
      { status: 500 }
    )
  }
}