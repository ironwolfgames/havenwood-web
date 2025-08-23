import { NextRequest, NextResponse } from 'next/server'
import { projectProgressOperations, sharedProjectOperations } from '@/lib/database-operations'

/**
 * POST /api/projects/select - Select a shared project for a session
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId, projectId } = await request.json()
    
    if (!sessionId || !projectId) {
      return NextResponse.json(
        { success: false, message: 'Session ID and project ID are required' },
        { status: 400 }
      )
    }
    
    // Check if project exists
    const project = await sharedProjectOperations.getById(projectId)
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Check if session already has a project selected
    const existingProgress = await projectProgressOperations.getBySessionId(sessionId)
    if (existingProgress) {
      return NextResponse.json(
        { success: false, message: 'Session already has a project selected' },
        { status: 409 }
      )
    }
    
    // Create project progress record
    const projectProgress = await projectProgressOperations.create({
      session_id: sessionId,
      project_id: projectId,
      current_stage: 1,
      stage_contributions: {},
      completed_stages: [],
      is_completed: false
    })
    
    return NextResponse.json({
      success: true,
      message: 'Project selected successfully',
      data: {
        projectProgress,
        project
      }
    })
    
  } catch (error) {
    console.error('Project selection failed:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Project selection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/projects/select?sessionId=xxx - Get available projects for selection
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      )
    }
    
    // Check if session already has a project
    const existingProgress = await projectProgressOperations.getBySessionId(sessionId)
    if (existingProgress) {
      return NextResponse.json({
        success: true,
        message: 'Session already has a project selected',
        data: {
          hasSelection: true,
          projectProgress: existingProgress
        }
      })
    }
    
    // Get all available projects
    const projects = await sharedProjectOperations.getAll()
    
    return NextResponse.json({
      success: true,
      message: 'Available projects retrieved',
      data: {
        hasSelection: false,
        projects
      }
    })
    
  } catch (error) {
    console.error('Failed to get project selection options:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get project selection options',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}