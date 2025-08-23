import { NextRequest, NextResponse } from 'next/server'
import { sessionPlayerOperations, gameSessionOperations } from '@/lib/database-operations'
import { getCurrentUser } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { message: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Check if session exists
    const session = await gameSessionOperations.getById(sessionId)
    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if session is in waiting status
    if (session.status !== 'waiting') {
      return NextResponse.json(
        { message: 'Session has already been started or completed' },
        { status: 400 }
      )
    }

    // Get session players to validate readiness
    const sessionPlayers = await sessionPlayerOperations.getSessionPlayers(sessionId)
    
    // Check minimum players (at least 2)
    if (sessionPlayers.length < 2) {
      return NextResponse.json(
        { message: 'Need at least 2 players to start a game' },
        { status: 400 }
      )
    }

    // Check that all players have selected factions
    const playersWithoutFactions = sessionPlayers.filter(player => !player.faction_id)
    if (playersWithoutFactions.length > 0) {
      return NextResponse.json(
        { message: 'All players must select a faction before starting the game' },
        { status: 400 }
      )
    }

    // TODO: In future, check if all players are ready (is_ready = true)
    // For now, we assume players are ready if they have factions

    // Update session status to active and set started_at timestamp
    const updatedSession = await gameSessionOperations.update(sessionId, {
      status: 'active',
      started_at: new Date().toISOString()
    })

    return NextResponse.json({
      message: 'Game started successfully',
      session: updatedSession
    })
  } catch (error) {
    console.error('Error starting game:', error)
    return NextResponse.json(
      { message: 'Failed to start game' },
      { status: 500 }
    )
  }
}