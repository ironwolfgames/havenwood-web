import { NextRequest, NextResponse } from 'next/server'
import { gameSessionOperations, playerOperations, sessionPlayerOperations } from '@/lib/database-operations'
import { getCurrentUser } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { name, playerLimit, sharedProjectId, privacy, difficulty } = await request.json()

    // Validate required fields
    if (!name || !playerLimit || !sharedProjectId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current user (for now, we'll create a mock user since auth isn't fully implemented)
    // In a real implementation, you'd get the user from the session
    const currentUser = await getCurrentUser()
    
    // For now, create a basic session without user authentication
    // This will need to be updated once authentication is implemented
    const sessionData = {
      name: name.trim(),
      status: 'waiting' as const,
      current_turn: 0,
      max_turns: 20, // Default max turns
      shared_project_id: sharedProjectId,
    }

    const session = await gameSessionOperations.create(sessionData)
    
    // TODO: Once user authentication is implemented:
    // 1. Get the current user's player profile
    // 2. Add the creator to the session as the first player
    // 3. Set up proper session ownership

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { message: 'Failed to create session' },
      { status: 500 }
    )
  }
}