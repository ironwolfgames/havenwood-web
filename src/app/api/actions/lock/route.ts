/**
 * Action Lock-in API Endpoint
 * 
 * Locks in player's actions for turn resolution.
 * Prevents further modifications and triggers turn resolution check.
 */

import { NextRequest, NextResponse } from 'next/server'
import { actionOperations, sessionPlayerOperations, gameSessionOperations } from '@/lib/database-operations'
import { getCurrentUser, SupabaseError } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sessionId, turnNumber } = body

    // Validate required fields
    if (!sessionId || !turnNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, turnNumber' },
        { status: 400 }
      )
    }

    // Get player info and verify they're in the session
    const sessionPlayers = await sessionPlayerOperations.getSessionPlayers(sessionId)
    const currentPlayer = sessionPlayers.find(sp => 
      sp.player_id && sp.player_id === user.id
    )

    if (!currentPlayer || !currentPlayer.player_id) {
      return NextResponse.json(
        { error: 'Player not found in session' },
        { status: 403 }
      )
    }

    // Get player's actions for the current turn
    const playerActions = await actionOperations.getByPlayerAndTurn(
      currentPlayer.player_id, 
      sessionId, 
      turnNumber
    )

    if (playerActions.length === 0) {
      return NextResponse.json(
        { error: 'No actions submitted for this turn' },
        { status: 400 }
      )
    }

    // Check if actions are already locked/resolved
    const alreadyResolved = playerActions.some(a => a.status === 'resolved')
    if (alreadyResolved) {
      return NextResponse.json(
        { error: 'Actions already locked for this turn' },
        { status: 409 }
      )
    }

    // For simplicity, we'll add an "is_locked" flag to action_data
    // In a more sophisticated system, we might have a separate table
    const lockPromises = playerActions.map(action => 
      actionOperations.update(action.id, {
        action_data: {
          ...action.action_data,
          is_locked: true,
          locked_at: new Date().toISOString()
        }
      })
    )

    const lockedActions = await Promise.all(lockPromises)

    // Check if all players have locked their actions
    const allActions = await actionOperations.getBySessionAndTurn(sessionId, turnNumber)
    const playersWithActions = new Set(allActions.map(a => a.player_id))
    const totalPlayers = sessionPlayers.length

    const allPlayersSubmitted = playersWithActions.size === totalPlayers
    const allActionsLocked = allActions.every(a => 
      a.action_data && typeof a.action_data === 'object' && 
      (a.action_data as any).is_locked === true
    )

    return NextResponse.json({
      success: true,
      actions: lockedActions,
      message: 'Actions locked successfully',
      turnStatus: {
        allPlayersSubmitted,
        allActionsLocked,
        readyForResolution: allPlayersSubmitted && allActionsLocked,
        playersWithActions: playersWithActions.size,
        totalPlayers
      }
    })

  } catch (error) {
    console.error('Action lock error:', error)
    
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