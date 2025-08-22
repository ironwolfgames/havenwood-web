/**
 * Game session integration utilities for player profiles
 */

import { sessionPlayerOperations } from '@/lib/database-operations'
import { Player } from '@/lib/supabase'

export interface GameSessionJoinParams {
  sessionId: string
  factionId: string
  player: Player
}

export interface GameSessionParticipant {
  player: Player
  factionId: string
  joinedAt: string
}

/**
 * Join a game session with the authenticated player
 */
export async function joinGameSession({ sessionId, factionId, player }: GameSessionJoinParams) {
  if (!player) {
    throw new Error('Player profile is required to join a game session')
  }

  try {
    // Check if player is already in this session
    const existingParticipation = await sessionPlayerOperations.getPlayerSession(player.id, sessionId)
    
    if (existingParticipation) {
      throw new Error('Player is already participating in this session')
    }

    // Join the session
    const sessionPlayer = await sessionPlayerOperations.joinSession({
      session_id: sessionId,
      player_id: player.id,
      faction_id: factionId
    })

    return sessionPlayer
  } catch (error) {
    console.error('Error joining game session:', error)
    throw error
  }
}

/**
 * Leave a game session
 */
export async function leaveGameSession(sessionId: string, player: Player) {
  if (!player) {
    throw new Error('Player profile is required to leave a game session')
  }

  try {
    await sessionPlayerOperations.leaveSession(player.id, sessionId)
  } catch (error) {
    console.error('Error leaving game session:', error)
    throw error
  }
}

/**
 * Get all sessions where the player is participating
 */
export async function getPlayerSessions(player: Player) {
  if (!player) {
    throw new Error('Player profile is required to get sessions')
  }

  try {
    // This would require a new database operation to get sessions by player
    // For now, this is a placeholder showing the intended functionality
    throw new Error('getPlayerSessions not yet implemented - would need new database operation')
  } catch (error) {
    console.error('Error getting player sessions:', error)
    throw error
  }
}

/**
 * Check if a player can join a specific session
 */
export async function canPlayerJoinSession(sessionId: string, factionId: string, player: Player): Promise<{
  canJoin: boolean
  reason?: string
}> {
  if (!player) {
    return { canJoin: false, reason: 'Player profile required' }
  }

  try {
    // Check if player is already in this session
    const existingParticipation = await sessionPlayerOperations.getPlayerSession(player.id, sessionId)
    
    if (existingParticipation) {
      return { canJoin: false, reason: 'Already participating in this session' }
    }

    // Additional checks could be added here:
    // - Session capacity limits
    // - Faction availability
    // - Session status (waiting vs active vs completed)
    
    return { canJoin: true }
  } catch (error) {
    console.error('Error checking if player can join session:', error)
    return { canJoin: false, reason: 'Error checking session eligibility' }
  }
}

/**
 * Validation helper for game session integration
 */
export function validatePlayerForGameSession(player: Player | null): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!player) {
    errors.push('No player profile found')
    return { isValid: false, errors }
  }

  if (!player.username || player.username.trim().length < 3) {
    errors.push('Player must have a valid username')
  }

  if (!player.user_id) {
    errors.push('Player must be linked to an authenticated user')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}