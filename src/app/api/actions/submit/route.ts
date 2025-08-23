/**
 * Action Submission API Endpoint
 * 
 * Handles player action submission for the current turn.
 * Validates action parameters and stores them in Supabase.
 */

import { NextRequest, NextResponse } from 'next/server'
import { actionOperations, sessionPlayerOperations, resourceOperations } from '@/lib/database-operations'
import { validateAction } from '@/lib/game/validation'
import { getCurrentUser, SupabaseError } from '@/lib/supabase'
import { GameActionType } from '@/types/game'

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
    const { 
      sessionId,
      actionType,
      actionData,
      turnNumber
    } = body

    // Validate required fields
    if (!sessionId || !actionType || !turnNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, actionType, turnNumber' },
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

    // Check if player already has an action for this turn
    const existingActions = await actionOperations.getByPlayerAndTurn(
      currentPlayer.player_id, 
      sessionId, 
      turnNumber
    )

    if (existingActions.length > 0) {
      return NextResponse.json(
        { error: 'Action already submitted for this turn. Use modify endpoint to update.' },
        { status: 409 }
      )
    }

    // Create the action record
    const actionRecord = await actionOperations.create({
      session_id: sessionId,
      player_id: currentPlayer.player_id,
      turn_number: turnNumber,
      action_type: actionType as any,
      action_data: actionData || {},
      status: 'submitted'
    })

    return NextResponse.json({
      success: true,
      action: actionRecord,
      message: 'Action submitted successfully'
    })

  } catch (error) {
    console.error('Action submission error:', error)
    
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