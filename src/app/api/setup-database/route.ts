import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { adminOperations } from '@/lib/database-operations'

export async function POST() {
  try {
    console.log('Running database setup...')
    
    const admin = supabaseAdmin()
    
    // Test admin connection
    const { data: connectionTest, error: connectionError } = await admin
      .from('_supabase_migrations')
      .select('*')
      .limit(1)
    
    if (connectionError) {
      throw new Error(`Admin connection failed: ${connectionError.message}`)
    }
    
    // Seed factions data
    console.log('Seeding factions data...')
    const factions = await adminOperations.seedFactions()
    
    console.log('Database setup completed successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      results: {
        factions: {
          count: factions.length,
          data: factions
        }
      }
    })
    
  } catch (error) {
    console.error('Database setup failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database setup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log('Checking database schema status...')
    
    const admin = supabaseAdmin()
    
    const checks = {
      players: false,
      factions: false,
      game_sessions: false,
      session_players: false,
      factions_seeded: false
    }
    
    // Try to query each table to see if it exists
    try {
      const { error: playersError } = await admin.from('players').select('*').limit(0)
      checks.players = !playersError
    } catch (e) { /* table doesn't exist */ }
    
    try {
      const { error: factionsError } = await admin.from('factions').select('*').limit(0)
      checks.factions = !factionsError
    } catch (e) { /* table doesn't exist */ }
    
    try {
      const { error: sessionsError } = await admin.from('game_sessions').select('*').limit(0)
      checks.game_sessions = !sessionsError
    } catch (e) { /* table doesn't exist */ }
    
    try {
      const { error: sessionPlayersError } = await admin.from('session_players').select('*').limit(0)
      checks.session_players = !sessionPlayersError
    } catch (e) { /* table doesn't exist */ }
    
    // Check if factions are seeded
    if (checks.factions) {
      try {
        const { data: factionCount } = await admin.from('factions').select('*', { count: 'exact' })
        checks.factions_seeded = (factionCount?.length ?? 0) >= 4
      } catch (e) { /* ignore */ }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database status checked',
      results: {
        tables_exist: checks,
        setup_needed: !Object.values(checks).every(Boolean)
      }
    })
    
  } catch (error) {
    console.error('Database status check failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database status check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}