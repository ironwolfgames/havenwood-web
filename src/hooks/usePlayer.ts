'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { playerOperations } from '@/lib/database-operations'

export function usePlayer() {
  const { user, player, createPlayerProfile, updatePlayerProfile } = useAuth()
  const [isValidatingUsername, setIsValidatingUsername] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)

  /**
   * Validate username format
   */
  const validateUsernameFormat = (username: string): string | null => {
    if (!username) {
      return 'Username is required'
    }
    
    if (username.length < 3) {
      return 'Username must be at least 3 characters'
    }
    
    if (username.length > 20) {
      return 'Username must be 20 characters or less'
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores'
    }
    
    return null
  }

  /**
   * Check if username is available (not taken by another player)
   */
  const checkUsernameAvailability = useCallback(async (username: string): Promise<boolean> => {
    try {
      const existingPlayer = await playerOperations.getByUsername(username)
      
      // Username is available if no player found or it's the current player
      return existingPlayer === null || (player !== null && existingPlayer.id === player.id)
    } catch (error) {
      console.error('Error checking username availability:', error)
      return false
    }
  }, [player])

  /**
   * Validate username with format and availability check
   */
  const validateUsername = useCallback(async (username: string): Promise<string | null> => {
    setIsValidatingUsername(true)
    setUsernameError(null)

    try {
      // First check format
      const formatError = validateUsernameFormat(username)
      if (formatError) {
        setUsernameError(formatError)
        return formatError
      }

      // Then check availability
      const isAvailable = await checkUsernameAvailability(username)
      if (!isAvailable) {
        const error = 'Username is already taken'
        setUsernameError(error)
        return error
      }

      return null
    } catch (error) {
      const errorMessage = 'Error validating username'
      setUsernameError(errorMessage)
      return errorMessage
    } finally {
      setIsValidatingUsername(false)
    }
  }, [checkUsernameAvailability])

  /**
   * Create player profile with username validation
   */
  const createProfile = useCallback(async (username: string) => {
    const validationError = await validateUsername(username)
    if (validationError) {
      throw new Error(validationError)
    }

    return await createPlayerProfile(username)
  }, [validateUsername, createPlayerProfile])

  /**
   * Update player profile with username validation if username is being changed
   */
  const updateProfile = useCallback(async (updates: { username?: string; [key: string]: any }) => {
    if (updates.username && updates.username !== player?.username) {
      const validationError = await validateUsername(updates.username)
      if (validationError) {
        throw new Error(validationError)
      }
    }

    return await updatePlayerProfile(updates)
  }, [validateUsername, updatePlayerProfile, player])

  /**
   * Check if user needs to create a player profile
   */
  const needsPlayerProfile = user && !player

  return {
    user,
    player,
    needsPlayerProfile,
    validateUsername,
    validateUsernameFormat,
    checkUsernameAvailability,
    createProfile,
    updateProfile,
    isValidatingUsername,
    usernameError,
  }
}