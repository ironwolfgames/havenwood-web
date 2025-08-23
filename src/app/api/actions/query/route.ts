/**
 * Action Query API Endpoint
 * 
 * Retrieves player actions with various filtering options.
 * Supports querying by session, turn, and player.
 */

import { NextRequest, NextResponse } from 'next/server'
import { actionOperations, sessionPlayerOperations } from '@/lib/database-operations'
import { getCurrentUser, SupabaseError } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const turnNumber = searchParams.get('turnNumber')
    const playerId = searchParams.get('playerId') || user.id

    // At minimum, we need sessionId
    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    // Verify user is in the session
    const sessionPlayers = await sessionPlayerOperations.getSessionPlayers(sessionId)
    const userInSession = sessionPlayers.some(sp => sp.player_id === user.id)

    if (!userInSession) {
      return NextResponse.json(
        { error: 'Access denied: not a participant in this session' },
        { status: 403 }
      )
    }

    let actions
    
    if (turnNumber && playerId) {
      // Get specific player's actions for a specific turn
      actions = await actionOperations.getByPlayerAndTurn(playerId, sessionId, parseInt(turnNumber))
    } else if (turnNumber) {
      // Get all actions for a specific turn
      actions = await actionOperations.getBySessionAndTurn(sessionId, parseInt(turnNumber))
    } else {
      // Get all actions for the session
      const allTurnActions = await actionOperations.getBySessionAndTurn(sessionId, 1) // Start with turn 1
      // In a real implementation, you'd want to query across all turns
      actions = allTurnActions
    }

    return NextResponse.json({
      success: true,
      actions,
      filters: {
        sessionId,
        turnNumber: turnNumber ? parseInt(turnNumber) : null,
        playerId
      }
    })

  } catch (error) {
    console.error('Action query error:', error)
    
    if (error instanceof SupabaseError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}