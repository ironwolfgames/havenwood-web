import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Fetch sessions with player count and related data
    const { data: sessions, error } = await supabase
      .from('game_sessions')
      .select(`
        *,
        shared_projects:shared_project_id(name),
        session_players(id)
      `)
      .eq('status', 'waiting')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Transform the data to include player counts and flatten structure
    const sessionsWithDetails = sessions.map((session: any) => ({
      ...session,
      playerCount: session.session_players?.length || 0,
      maxPlayers: 4, // TODO: Add max_players to the database schema
      shared_project: session.shared_projects,
      creator: null, // TODO: Add creator relationship once auth is implemented
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