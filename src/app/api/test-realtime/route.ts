/**
 * Test API route for real-time subscriptions
 * 
 * This API route creates test data to demonstrate real-time subscriptions
 * by inserting/updating records that will trigger Supabase real-time events.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, sessionId, ...params } = body

    if (!action || !sessionId) {
      return NextResponse.json(
        { error: 'Missing action or sessionId' },
        { status: 400 }
      )
    }

    const admin = supabaseAdmin()

    switch (action) {
      case 'create_session': {
        const { sessionName = `Test Session ${sessionId}` } = params
        
        // Create or update game session
        const { data: session, error } = await admin
          .from('game_sessions')
          .upsert({
            id: sessionId,
            name: sessionName,
            status: 'waiting' as const,
            current_turn: 1,
            max_turns: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          console.error('Error creating session:', error)
          return NextResponse.json(
            { error: 'Failed to create session', details: error.message },
            { status: 500 }
          )
        }

        return NextResponse.json({ 
          success: true, 
          action: 'create_session',
          data: session 
        })
      }

      case 'update_resource': {
        const { resourceType = 'food', quantity = 10 } = params
        
        // Create a fake faction ID for testing
        const factionId = `test-faction-${sessionId}`
        
        // Insert or update resource
        const { data: resource, error } = await admin
          .from('resources')
          .upsert({
            session_id: sessionId,
            faction_id: factionId,
            resource_type: resourceType,
            quantity: quantity,
            turn_number: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          console.error('Error updating resource:', error)
          return NextResponse.json(
            { error: 'Failed to update resource', details: error.message },
            { status: 500 }
          )
        }

        return NextResponse.json({ 
          success: true, 
          action: 'update_resource',
          data: resource 
        })
      }

      case 'submit_action': {
        const { actionType = 'gather', actionData = {} } = params
        
        // Create a fake player ID for testing
        const playerId = `test-player-${sessionId}`
        
        // Insert action
        const { data: action, error } = await admin
          .from('actions')
          .insert({
            session_id: sessionId,
            player_id: playerId,
            turn_number: 1,
            action_type: actionType,
            action_data: actionData,
            status: 'submitted',
            submitted_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          console.error('Error submitting action:', error)
          return NextResponse.json(
            { error: 'Failed to submit action', details: error.message },
            { status: 500 }
          )
        }

        return NextResponse.json({ 
          success: true, 
          action: 'submit_action',
          data: action 
        })
      }

      case 'resolve_turn': {
        const { turnNumber = 1, results = {} } = params
        
        // Insert turn result
        const { data: turnResult, error } = await admin
          .from('turn_results')
          .insert({
            session_id: sessionId,
            turn_number: turnNumber,
            results_data: results,
            resolved_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          console.error('Error resolving turn:', error)
          return NextResponse.json(
            { error: 'Failed to resolve turn', details: error.message },
            { status: 500 }
          )
        }

        return NextResponse.json({ 
          success: true, 
          action: 'resolve_turn',
          data: turnResult 
        })
      }

      case 'update_session': {
        const { status = 'active', currentTurn = 2 } = params
        
        // Update game session
        const { data: session, error } = await admin
          .from('game_sessions')
          .update({
            status,
            current_turn: currentTurn,
            updated_at: new Date().toISOString()
          })
          .eq('id', sessionId)
          .select()
          .single()

        if (error) {
          console.error('Error updating session:', error)
          return NextResponse.json(
            { error: 'Failed to update session', details: error.message },
            { status: 500 }
          )
        }

        return NextResponse.json({ 
          success: true, 
          action: 'update_session',
          data: session 
        })
      }

      case 'cleanup_test_data': {
        // Clean up test data for the session
        const cleanupResults = []

        // Delete resources
        const { error: resourcesError } = await admin
          .from('resources')
          .delete()
          .eq('session_id', sessionId)
        
        if (resourcesError) {
          cleanupResults.push({ table: 'resources', error: resourcesError.message })
        } else {
          cleanupResults.push({ table: 'resources', success: true })
        }

        // Delete actions
        const { error: actionsError } = await admin
          .from('actions')
          .delete()
          .eq('session_id', sessionId)
        
        if (actionsError) {
          cleanupResults.push({ table: 'actions', error: actionsError.message })
        } else {
          cleanupResults.push({ table: 'actions', success: true })
        }

        // Delete turn results
        const { error: turnResultsError } = await admin
          .from('turn_results')
          .delete()
          .eq('session_id', sessionId)
        
        if (turnResultsError) {
          cleanupResults.push({ table: 'turn_results', error: turnResultsError.message })
        } else {
          cleanupResults.push({ table: 'turn_results', success: true })
        }

        // Delete session
        const { error: sessionError } = await admin
          .from('game_sessions')
          .delete()
          .eq('id', sessionId)
        
        if (sessionError) {
          cleanupResults.push({ table: 'game_sessions', error: sessionError.message })
        } else {
          cleanupResults.push({ table: 'game_sessions', success: true })
        }

        return NextResponse.json({ 
          success: true, 
          action: 'cleanup_test_data',
          data: cleanupResults 
        })
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Real-time test API is running',
    availableActions: [
      'create_session',
      'update_resource', 
      'submit_action',
      'resolve_turn',
      'update_session',
      'cleanup_test_data'
    ]
  })
}