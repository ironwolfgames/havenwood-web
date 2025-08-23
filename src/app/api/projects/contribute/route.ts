import { NextRequest, NextResponse } from 'next/server'
import { projectProgressOperations, sharedProjectOperations, resourceOperations } from '@/lib/database-operations'
import { executeResourceAdjustment } from '@/lib/database/resources'
import { validateResourceContribution, canAdvanceToNextStage, canCompleteProject } from '@/lib/game/projects'
import { ResourceType, ResourceAdjustment } from '@/lib/game/resources'
import { ResourceContribution } from '@/types/projects'

/**
 * POST /api/projects/contribute - Contribute resources to the current project stage
 */
export async function POST(request: NextRequest) {
  try {
    const contribution: ResourceContribution = await request.json()
    
    const { sessionId, playerId, factionId, resourceType, amount, turnNumber } = contribution
    
    if (!sessionId || !playerId || !factionId || !resourceType || !amount || !turnNumber) {
      return NextResponse.json(
        { success: false, message: 'All contribution fields are required' },
        { status: 400 }
      )
    }
    
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Contribution amount must be positive' },
        { status: 400 }
      )
    }
    
    // Get current project progress
    const currentProgress = await projectProgressOperations.getBySessionId(sessionId)
    if (!currentProgress) {
      return NextResponse.json(
        { success: false, message: 'No project selected for this session' },
        { status: 404 }
      )
    }
    
    if (currentProgress.is_completed) {
      return NextResponse.json(
        { success: false, message: 'Project is already completed' },
        { status: 400 }
      )
    }
    
    // Get project details
    const project = await sharedProjectOperations.getById(currentProgress.project_id)
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Validate the contribution
    const validation = validateResourceContribution(contribution, currentProgress, project)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Invalid contribution', errors: validation.errors },
        { status: 400 }
      )
    }
    
    // Check if player has enough resources
    const playerResources = await resourceOperations.getBySessionFactionAndTurn(
      sessionId,
      factionId,
      turnNumber
    )
    
    const availableResource = playerResources.find(r => r.resource_type === resourceType)
    const availableAmount = availableResource?.quantity || 0
    
    if (availableAmount < amount) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Insufficient ${resourceType}. Available: ${availableAmount}, Required: ${amount}` 
        },
        { status: 400 }
      )
    }
    
    // Deduct resources from player
    const adjustmentRequest: ResourceAdjustment = {
      sessionId,
      factionId,
      resourceType: resourceType as ResourceType,
      turnNumber,
      delta: -amount,
      reason: `Contributed to shared project: ${project.name}`
    }
    
    const adjustmentResult = await executeResourceAdjustment(adjustmentRequest)
    if (!adjustmentResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to deduct resources',
          errors: adjustmentResult.errors 
        },
        { status: 500 }
      )
    }
    
    // Add resources to project progress
    const updatedProgress = await projectProgressOperations.contribute(
      sessionId,
      resourceType,
      amount
    )
    
    // Check if stage can be advanced
    const canAdvance = canAdvanceToNextStage(updatedProgress, project)
    let finalProgress = updatedProgress
    let stageAdvanced = false
    let projectCompleted = false
    
    if (canAdvance) {
      const canComplete = canCompleteProject(updatedProgress, project)
      
      if (canComplete) {
        // Complete the entire project
        finalProgress = await projectProgressOperations.completeProject(sessionId)
        projectCompleted = true
      } else {
        // Advance to next stage
        finalProgress = await projectProgressOperations.advanceStage(sessionId)
        stageAdvanced = true
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Resources contributed successfully',
      data: {
        projectProgress: finalProgress,
        contribution: {
          resourceType,
          amount,
          playerId,
          factionId
        },
        effects: {
          stageAdvanced,
          projectCompleted,
          canAdvanceNext: !projectCompleted && canAdvanceToNextStage(finalProgress, project)
        }
      }
    })
    
  } catch (error) {
    console.error('Resource contribution failed:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Resource contribution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}