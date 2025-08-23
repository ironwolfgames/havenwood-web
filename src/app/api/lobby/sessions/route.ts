import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Fetch sessions with enhanced player count and related data
    const { data: sessions, error } = await supabase
      .from('game_sessions')
      .select(`
        id,
        name,
        description,
        status,
        max_players,
        current_players,
        turn_timer_minutes,
        configuration,
        created_at,
        updated_at,
        shared_projects:shared_project_id(name, description),
        session_players(id, faction_id, factions(name)),
        creator:creator_id(username)
      `)
      .eq('status', 'waiting')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Transform the data to include accurate player counts and flatten structure
    const sessionsWithDetails = sessions.map((session: any) => ({
      id: session.id,
      name: session.name,
      description: session.description,
      status: session.status,
      maxPlayers: session.max_players || 4,
      playerCount: session.session_players?.length || 0,
      turnTimerMinutes: session.turn_timer_minutes,
      configuration: session.configuration,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
      shared_project: session.shared_projects,
      creator: session.creator,
      players: session.session_players?.map((sp: any) => ({
        factionId: sp.faction_id,
        factionName: sp.factions?.name || null
      })) || []
    }))

    return NextResponse.json(sessionsWithDetails)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { message: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}