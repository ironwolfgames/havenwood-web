/**
 * API endpoint for faction mini-goals tracking
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  serverFactionGoalOperations,
  gameSessionOperations,
  serverResourceOperations,
  serverActionOperations
} from '@/lib/database-operations'
import { 
  createPlayerMiniGoals, 
  getMiniGoalProgress,
  calculateGoalProgress,
  FACTION_MINI_GOALS
} from '@/lib/game/minigoals'
import type { FactionType } from '@/lib/game/minigoals'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }
    
    // Get session to verify it exists
    const session = await gameSessionOperations.getById(sessionId)
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    // Get faction goals for the session
    const factionGoals = await serverFactionGoalOperations.getBySessionId(sessionId)
    
    // Group goals by player and faction type
    const goalsByPlayer: Record<string, {
      playerId: string
      factionType: FactionType
      goals: any[]
    }> = {}
    
    factionGoals.forEach(goal => {
      if (!goalsByPlayer[goal.player_id]) {
        goalsByPlayer[goal.player_id] = {
          playerId: goal.player_id,
          factionType: goal.faction_type as FactionType,
          goals: []
        }
      }
      
      const progressData = getMiniGoalProgress([goal], goal.faction_type as FactionType)
      goalsByPlayer[goal.player_id].goals.push(progressData[0])
    })
    
    return NextResponse.json({
      success: true,
      sessionId,
      playerGoals: Object.values(goalsByPlayer),
      totalGoals: factionGoals.length,
      completedGoals: factionGoals.filter(g => g.is_completed).length,
      factionTypes: Object.keys(FACTION_MINI_GOALS)
    })
    
  } catch (error) {
    console.error('Error fetching mini-goals:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch mini-goals',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params
    const { playerId, factionType, action } = await request.json()
    
    if (!sessionId || !playerId || !factionType) {
      return NextResponse.json(
        { error: 'Missing required fields: playerId, factionType' },
        { status: 400 }
      )
    }
    
    if (!['provisioner', 'guardian', 'mystic', 'explorer'].includes(factionType)) {
      return NextResponse.json(
        { error: 'Invalid faction type' },
        { status: 400 }
      )
    }
    
    if (action === 'initialize') {
      // Initialize mini-goals for a new player
      const goalInserts = createPlayerMiniGoals(sessionId, playerId, factionType as FactionType)
      const createdGoals = await serverFactionGoalOperations.createMany(goalInserts)
      
      return NextResponse.json({
        success: true,
        message: 'Mini-goals initialized successfully',
        goals: createdGoals
      })
    }
    
    if (action === 'update') {
      // Update progress for existing goals
      const { currentTurn } = await request.json()
      
      if (typeof currentTurn !== 'number') {
        return NextResponse.json(
          { error: 'currentTurn is required for update action' },
          { status: 400 }
        )
      }
      
      // Get current goals for player
      const existingGoals = await serverFactionGoalOperations.getBySessionId(sessionId)
      const playerGoals = existingGoals.filter(g => g.player_id === playerId)
      
      if (playerGoals.length === 0) {
        return NextResponse.json(
          { error: 'No goals found for player' },
          { status: 404 }
        )
      }
      
      // Get game data for progress calculation
      const resources = await serverResourceOperations.getBySessionId(sessionId)
      const actions = await serverActionOperations.getBySessionAndTurn(sessionId, currentTurn)
      
      const gameData = {
        resources,
        actions,
        currentTurn
      }
      
      // Update each goal
      const updatePromises = playerGoals.map(async (goal) => {
        const progressUpdate = calculateGoalProgress(goal, gameData)
        
        if (Object.keys(progressUpdate).length > 0) {
          return serverFactionGoalOperations.updateProgress(goal.id, progressUpdate)
        }
        
        return goal
      })
      
      const updatedGoals = await Promise.all(updatePromises)
      
      return NextResponse.json({
        success: true,
        message: 'Goals updated successfully',
        updatedGoals,
        currentTurn
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use "initialize" or "update"' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error managing mini-goals:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to manage mini-goals',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}