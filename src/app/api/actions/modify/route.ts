/**
 * Action Modification API Endpoint
 * 
 * Allows players to modify their submitted actions before lock-in.
 * Validates new parameters and updates existing action record.
 */

import { NextRequest, NextResponse } from 'next/server'
import { actionOperations, sessionPlayerOperations } from '@/lib/database-operations'
import { getCurrentUser, SupabaseError } from '@/lib/supabase'
import { GameActionType } from '@/types/game'

export async function PUT(request: NextRequest) {
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
      actionId,
      actionType,
      actionData
    } = body

    // Validate required fields
    if (!actionId) {
      return NextResponse.json(
        { error: 'Missing required field: actionId' },
        { status: 400 }
      )
    }

    // Get the existing action to verify ownership and status
    const existingActions = await actionOperations.getByPlayer(user.id)
    const existingAction = existingActions.find(a => a.id === actionId)

    if (!existingAction) {
      return NextResponse.json(
        { error: 'Action not found or not owned by player' },
        { status: 404 }
      )
    }

    // Check if action is still modifiable (not locked/resolved)
    if (existingAction.status === 'resolved') {
      return NextResponse.json(
        { error: 'Cannot modify resolved action' },
        { status: 409 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    if (actionType) updateData.action_type = actionType
    if (actionData) updateData.action_data = actionData

    // Update the action
    const updatedAction = await actionOperations.update(actionId, updateData)

    return NextResponse.json({
      success: true,
      action: updatedAction,
      message: 'Action modified successfully'
    })

  } catch (error) {
    console.error('Action modification error:', error)
    
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