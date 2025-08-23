/**
 * Turn Results History API Endpoint
 * 
 * Retrieves complete turn history for a game session including:
 * - Paginated results for long games
 * - Summary statistics across turns
 * - Optional date range filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { turnResultOperations, sessionPlayerOperations } from '@/lib/database-operations'
import { getCurrentUser, SupabaseError } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Max 50 results per page
    const startTurn = searchParams.get('startTurn') ? parseInt(searchParams.get('startTurn')!) : undefined
    const endTurn = searchParams.get('endTurn') ? parseInt(searchParams.get('endTurn')!) : undefined
    
    // Verify user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user has access to this session
    const sessionPlayers = await sessionPlayerOperations.getSessionPlayers(sessionId)
    const userInSession = sessionPlayers.some(sp => sp.player_id === user.id)

    if (!userInSession) {
      return NextResponse.json(
        { error: 'Access denied: not a participant in this session' },
        { status: 403 }
      )
    }

    // Get all turn results for the session
    let turnResults = await turnResultOperations.getBySession(sessionId)
    
    // Apply turn range filtering if specified
    if (startTurn !== undefined) {
      turnResults = turnResults.filter(tr => tr.turn_number >= startTurn)
    }
    if (endTurn !== undefined) {
      turnResults = turnResults.filter(tr => tr.turn_number <= endTurn)
    }

    // Calculate pagination
    const total = turnResults.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedResults = turnResults.slice(offset, offset + limit)

    // Generate summary statistics
    const summary = {
      totalTurns: total,
      completedTurns: turnResults.length,
      averageResolutionTime: 0,
      totalActions: 0,
      failedActions: 0
    }

    // Calculate summary stats from results data
    turnResults.forEach(result => {
      const data = result.results_data || {}
      if (data.summary) {
        summary.averageResolutionTime += data.summary.resolutionTime || 0
        summary.totalActions += data.summary.totalActions || 0
        summary.failedActions += data.summary.failedActions || 0
      }
    })

    if (turnResults.length > 0) {
      summary.averageResolutionTime = Math.round(summary.averageResolutionTime / turnResults.length)
    }

    // Structure the response
    const structuredResults = paginatedResults.map(result => ({
      id: result.id,
      turnNumber: result.turn_number,
      resolvedAt: result.resolved_at,
      summary: result.results_data?.summary || {},
      hasData: !!result.results_data
    }))

    return NextResponse.json({
      success: true,
      history: {
        sessionId,
        results: structuredResults,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: {
          startTurn,
          endTurn
        },
        summary
      }
    })

  } catch (error) {
    console.error('Turn results history error:', error)
    
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