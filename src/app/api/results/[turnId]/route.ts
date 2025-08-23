/**
 * Turn Results API Endpoint
 * 
 * Retrieves detailed results for a specific turn including:
 * - Resource changes per faction
 * - Action outcomes and effects  
 * - Global events and modifiers
 * - Summary statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { turnResultOperations, sessionPlayerOperations } from '@/lib/database-operations'
import { getCurrentUser, SupabaseError } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ turnId: string }> }
) {
  try {
    const { turnId } = await params
    
    // Verify user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get turn results by ID
    const turnResult = await turnResultOperations.getById(turnId)
    if (!turnResult) {
      return NextResponse.json(
        { error: 'Turn result not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this session
    const sessionPlayers = await sessionPlayerOperations.getSessionPlayers(turnResult.session_id)
    const userInSession = sessionPlayers.some(sp => sp.player_id === user.id)

    if (!userInSession) {
      return NextResponse.json(
        { error: 'Access denied: not a participant in this session' },
        { status: 403 }
      )
    }

    // Parse and structure the results data
    const resultsData = turnResult.results_data || {}
    
    return NextResponse.json({
      success: true,
      turnResult: {
        id: turnResult.id,
        sessionId: turnResult.session_id,
        turnNumber: turnResult.turn_number,
        resolvedAt: turnResult.resolved_at,
        data: {
          processedActions: resultsData.processedActions || [],
          resourceChanges: resultsData.resourceChanges || [],
          globalEffects: resultsData.globalEffects || {},
          summary: resultsData.summary || {},
          events: resultsData.events || []
        }
      }
    })

  } catch (error) {
    console.error('Turn results retrieval error:', error)
    
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