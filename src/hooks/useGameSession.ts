'use client'

import { useState, useCallback } from 'react'
import { usePlayer } from './usePlayer'
import { joinGameSession, leaveGameSession, canPlayerJoinSession, validatePlayerForGameSession } from '@/lib/game-session-integration'

/**
 * Hook for managing player participation in game sessions
 */
export function useGameSession() {
  const { player } = usePlayer()
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Join a game session with the current player
   */
  const joinSession = useCallback(async (sessionId: string, factionId: string) => {
    if (!player) {
      throw new Error('Must be authenticated with a player profile to join sessions')
    }

    setIsJoining(true)
    setError(null)

    try {
      // Validate player can join
      const validation = validatePlayerForGameSession(player)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      // Check eligibility
      const eligibility = await canPlayerJoinSession(sessionId, factionId, player)
      if (!eligibility.canJoin) {
        throw new Error(eligibility.reason || 'Cannot join session')
      }

      // Join the session
      const sessionPlayer = await joinGameSession({ sessionId, factionId, player })
      return sessionPlayer
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join session'
      setError(errorMessage)
      throw error
    } finally {
      setIsJoining(false)
    }
  }, [player])

  /**
   * Leave a game session
   */
  const leaveSession = useCallback(async (sessionId: string) => {
    if (!player) {
      throw new Error('Must be authenticated with a player profile to leave sessions')
    }

    setIsLeaving(true)
    setError(null)

    try {
      await leaveGameSession(sessionId, player)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to leave session'
      setError(errorMessage)
      throw error
    } finally {
      setIsLeaving(false)
    }
  }, [player])

  /**
   * Check if player can join a specific session
   */
  const checkEligibility = useCallback(async (sessionId: string, factionId: string) => {
    if (!player) {
      return { canJoin: false, reason: 'No player profile' }
    }

    try {
      return await canPlayerJoinSession(sessionId, factionId, player)
    } catch (error) {
      return { canJoin: false, reason: 'Error checking eligibility' }
    }
  }, [player])

  /**
   * Validate current player for game sessions
   */
  const validatePlayer = useCallback(() => {
    return validatePlayerForGameSession(player)
  }, [player])

  return {
    player,
    joinSession,
    leaveSession,
    checkEligibility,
    validatePlayer,
    isJoining,
    isLeaving,
    error,
    // Helper properties
    canJoinSessions: player !== null && validatePlayerForGameSession(player).isValid,
  }
}