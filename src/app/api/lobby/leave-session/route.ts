import { NextRequest, NextResponse } from 'next/server'
import { sessionPlayerOperations, gameSessionOperations } from '@/lib/database-operations'
import { getCurrentUser } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, playerId } = await request.json()

    if (!sessionId || !playerId) {
      return NextResponse.json(
        { message: 'Session ID and Player ID are required' },
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

    // Check if session can be left (not started)
    if (session.status !== 'waiting') {
      return NextResponse.json(
        { message: 'Cannot leave a session that has already started' },
        { status: 400 }
      )
    }

    // Remove player from session
    await sessionPlayerOperations.leaveSession(playerId, sessionId)

    // TODO: Update current_players count when that field is properly implemented
    // This would require updating the game_sessions table to decrement current_players

    return NextResponse.json({ 
      message: 'Successfully left session',
      sessionId,
      playerId
    })
  } catch (error) {
    console.error('Error leaving session:', error)
    return NextResponse.json(
      { message: 'Failed to leave session' },
      { status: 500 }
    )
  }
}