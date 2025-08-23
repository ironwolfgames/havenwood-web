import { NextRequest, NextResponse } from 'next/server'
import { projectProgressOperations, sharedProjectOperations } from '@/lib/database-operations'
import { 
  calculateStageAdvancement, 
  calculateProjectCompletion, 
  getNextRequiredResources,
  assessProjectDifficulty 
} from '@/lib/game/projects'
import { ProjectStatusSummary } from '@/types/projects'

/**
 * GET /api/projects/status/[sessionId] - Get current project status for session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      )
    }
    
    // Get project progress for session
    const projectProgress = await projectProgressOperations.getBySessionId(sessionId)
    if (!projectProgress) {
      return NextResponse.json(
        { success: false, message: 'No project found for this session' },
        { status: 404 }
      )
    }
    
    // Get project details
    const project = await sharedProjectOperations.getById(projectProgress.project_id)
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project details not found' },
        { status: 404 }
      )
    }
    
    // Calculate advancement and completion status
    const advancement = calculateStageAdvancement(projectProgress, project)
    const completion = calculateProjectCompletion(projectProgress, project)
    const nextResources = getNextRequiredResources(projectProgress, project, 5)
    const difficulty = assessProjectDifficulty(project)
    
    // Build comprehensive status summary
    const statusSummary: ProjectStatusSummary = {
      sessionId,
      projectId: project.id,
      projectName: project.name,
      projectDescription: project.description,
      currentStage: projectProgress.current_stage,
      totalStages: (project.stages as any[]).length,
      stageContributions: projectProgress.stage_contributions as Record<string, number> || {},
      completedStages: projectProgress.completed_stages as any[] || [],
      advancement,
      completion,
      lastUpdated: projectProgress.updated_at
    }
    
    return NextResponse.json({
      success: true,
      message: 'Project status retrieved',
      data: {
        status: statusSummary,
        project,
        nextRequiredResources: nextResources,
        difficulty,
        details: {
          isCompleted: projectProgress.is_completed,
          completedAt: projectProgress.completed_at,
          createdAt: projectProgress.created_at,
          stages: project.stages
        }
      }
    })
    
  } catch (error) {
    console.error('Failed to get project status:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get project status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/projects/status/[sessionId] - Update project progress manually (admin use)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const updates = await request.json()
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      )
    }
    
    // Update project progress
    const updatedProgress = await projectProgressOperations.updateProgress(sessionId, updates)
    
    return NextResponse.json({
      success: true,
      message: 'Project progress updated',
      data: {
        projectProgress: updatedProgress
      }
    })
    
  } catch (error) {
    console.error('Failed to update project progress:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update project progress',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}