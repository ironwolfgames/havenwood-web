/**
 * API endpoint to end a game session when victory/defeat conditions are met
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  gameSessionOperations,
  projectProgressOperations,
  serverFactionGoalOperations,
  serverResourceOperations,
  serverGameOutcomeOperations
} from '@/lib/database-operations'
import { evaluateGameConditions, calculateSurvivalMetrics, summarizeFactionGoals } from '@/lib/game/conditions'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, triggerTurn, reason } = await request.json()
    
    if (!sessionId || typeof triggerTurn !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, triggerTurn' },
        { status: 400 }
      )
    }
    
    // Get session data
    const session = await gameSessionOperations.getById(sessionId)
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    if (session.status === 'completed') {
      return NextResponse.json(
        { error: 'Session is already completed' },
        { status: 400 }
      )
    }
    
    // Get all necessary data for outcome recording
    const projectProgress = await projectProgressOperations.getBySessionId(sessionId)
    const factionGoals = await serverFactionGoalOperations.getBySessionId(sessionId)
    const resources = await serverResourceOperations.getBySessionId(sessionId)
    
    if (!projectProgress) {
      return NextResponse.json(
        { error: 'Project progress not found' },
        { status: 404 }
      )
    }
    
    // Calculate final metrics
    const survivalMetrics = calculateSurvivalMetrics(resources, sessionId)
    const factionGoalsSummary = summarizeFactionGoals(factionGoals)
    
    // Determine outcome type and details
    let outcomeType: 'victory' | 'defeat' = 'defeat'
    let victoryType: 'project_completion' | 'mini_goals' | null = null
    let defeatReason: 'famine' | 'instability' | 'destruction' | 'timeout' | null = null
    
    if (reason === 'project_completion') {
      outcomeType = 'victory'
      victoryType = 'project_completion'
    } else if (reason === 'mini_goals') {
      outcomeType = 'victory'
      victoryType = 'mini_goals'
    } else if (['famine', 'instability', 'destruction', 'timeout'].includes(reason)) {
      outcomeType = 'defeat'
      defeatReason = reason as 'famine' | 'instability' | 'destruction' | 'timeout'
    }
    
    // Calculate session duration
    const startedAt = session.started_at ? new Date(session.started_at) : new Date(session.created_at)
    const completedAt = new Date()
    const sessionDuration = `${Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000)} seconds`
    
    // Create game outcome record
    const gameOutcome = await serverGameOutcomeOperations.create({
      session_id: sessionId,
      outcome_type: outcomeType,
      victory_type: victoryType,
      defeat_reason: defeatReason,
      final_turn: triggerTurn,
      faction_goals: factionGoalsSummary,
      project_progress: {
        current_stage: projectProgress.current_stage,
        is_completed: projectProgress.is_completed,
        stage_contributions: projectProgress.stage_contributions,
        completed_stages: projectProgress.completed_stages
      },
      survival_metrics: survivalMetrics,
      session_duration: sessionDuration
    })
    
    // Update session status to completed
    await gameSessionOperations.update(sessionId, {
      status: 'completed',
      current_turn: triggerTurn,
      completed_at: completedAt.toISOString()
    })
    
    return NextResponse.json({
      success: true,
      sessionId,
      outcome: gameOutcome,
      sessionUpdated: true,
      message: outcomeType === 'victory' 
        ? `Game completed with ${victoryType} victory!`
        : `Game ended in defeat due to ${defeatReason}`
    })
    
  } catch (error) {
    console.error('Error ending game session:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to end game session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check if session can be ended
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing sessionId query parameter' },
      { status: 400 }
    )
  }
  
  try {
    const session = await gameSessionOperations.getById(sessionId)
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    const existingOutcome = await serverGameOutcomeOperations.getBySessionId(sessionId)
    
    return NextResponse.json({
      sessionId,
      canEnd: session.status !== 'completed',
      alreadyCompleted: !!existingOutcome,
      sessionStatus: session.status,
      currentTurn: session.current_turn,
      maxTurns: session.max_turns
    })
    
  } catch (error) {
    console.error('Error checking session end status:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to check session status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}