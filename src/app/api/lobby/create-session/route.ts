import { NextRequest, NextResponse } from 'next/server'
import { gameSessionOperations, playerOperations, sessionPlayerOperations } from '@/lib/database-operations'
import { getCurrentUser } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { name, playerLimit, sharedProjectId, privacy, difficulty, description, turnTimer } = await request.json()

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
    
    // For demo purposes, create a mock player as the creator
    let creatorPlayer
    try {
      creatorPlayer = await playerOperations.create({
        user_id: currentUser?.id || 'temp-creator-' + Date.now(),
        username: 'SessionCreator_' + Math.random().toString(36).substr(2, 6)
      })
    } catch (error) {
      // If player creation fails (e.g. user already has a player), 
      // try to get existing player (this is a temporary workaround)
      console.log('Player creation failed, using temporary creator')
      creatorPlayer = { id: 'temp-creator-' + Date.now() }
    }

    // Create session with enhanced data
    const sessionData = {
      name: name.trim(),
      description: description?.trim() || null,
      status: 'waiting' as const,
      current_turn: 0,
      max_turns: 7, // Default max turns
      max_players: playerLimit,
      current_players: 0,
      creator_id: creatorPlayer.id,
      shared_project_id: sharedProjectId,
      turn_timer_minutes: turnTimer || null,
      configuration: {
        privacy: privacy || 'public',
        difficulty: difficulty || 'normal'
      }
    }

    const session = await gameSessionOperations.create(sessionData)

    // Automatically add the creator to the session
    try {
      await sessionPlayerOperations.joinSession({
        session_id: session.id,
        player_id: creatorPlayer.id,
        faction_id: null // Creator can select faction later
      })
    } catch (error) {
      console.log('Failed to auto-join creator to session, continuing anyway')
    }

    return NextResponse.json({
      ...session,
      creatorPlayerId: creatorPlayer.id
    })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { message: 'Failed to create session' },
      { status: 500 }
    )
  }
}