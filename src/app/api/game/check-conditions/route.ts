/**
 * API endpoint to check victory and defeat conditions for a game session
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  gameSessionOperations,
  projectProgressOperations,
  sharedProjectOperations,
  serverFactionGoalOperations,
  serverResourceOperations
} from '@/lib/database-operations'
import { evaluateGameConditions } from '@/lib/game/conditions'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, currentTurn } = await request.json()
    
    if (!sessionId || typeof currentTurn !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, currentTurn' },
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
    
    // Get project progress
    const projectProgress = await projectProgressOperations.getBySessionId(sessionId)
    if (!projectProgress) {
      return NextResponse.json(
        { error: 'Project progress not found' },
        { status: 404 }
      )
    }
    
    // Get shared project definition
    const sharedProject = await sharedProjectOperations.getById(projectProgress.project_id)
    if (!sharedProject) {
      return NextResponse.json(
        { error: 'Shared project not found' },
        { status: 404 }
      )
    }
    
    // Get faction goals
    const factionGoals = await serverFactionGoalOperations.getBySessionId(sessionId)
    
    // Get current resources
    const resources = await serverResourceOperations.getBySessionId(sessionId)
    
    // Evaluate all conditions
    const conditionResult = evaluateGameConditions(
      session,
      projectProgress,
      sharedProject,
      factionGoals,
      resources,
      currentTurn
    )
    
    return NextResponse.json({
      success: true,
      sessionId,
      currentTurn,
      conditions: conditionResult,
      metadata: {
        sessionStatus: session.status,
        maxTurns: session.max_turns,
        projectStage: projectProgress.current_stage,
        projectCompleted: projectProgress.is_completed,
        totalFactionGoals: factionGoals.length,
        completedFactionGoals: factionGoals.filter(g => g.is_completed).length
      }
    })
    
  } catch (error) {
    console.error('Error checking game conditions:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to check game conditions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  const currentTurn = searchParams.get('currentTurn')
  
  if (!sessionId || !currentTurn) {
    return NextResponse.json(
      { error: 'Missing required query parameters: sessionId, currentTurn' },
      { status: 400 }
    )
  }
  
  // Reuse the POST logic
  return POST(new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({
      sessionId,
      currentTurn: parseInt(currentTurn)
    })
  }))
}