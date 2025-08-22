'use client'

import React, { useState, useEffect } from 'react'
import { usePlayer } from '@/hooks/usePlayer'

interface ProfileFormProps {
  mode: 'create' | 'edit'
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProfileForm({ mode, onSuccess, onCancel }: ProfileFormProps) {
  const { player, createProfile, updateProfile, validateUsername, isValidatingUsername } = usePlayer()
  const [username, setUsername] = useState(mode === 'edit' && player ? player.username : '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Debounced username validation
  useEffect(() => {
    if (!username || username === player?.username) {
      setValidationError(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      const error = await validateUsername(username)
      setValidationError(error)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [username, validateUsername, player?.username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (mode === 'create') {
        await createProfile(username)
      } else {
        await updateProfile({ username })
      }
      
      onSuccess?.()
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} profile:`, error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = username.length >= 3 && 
                   !validationError && 
                   !isValidatingUsername && 
                   !isSubmitting &&
                   (mode === 'create' || username !== player?.username)

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {mode === 'create' ? 'Create Your Player Profile' : 'Edit Profile'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your username"
            maxLength={20}
            required
          />
          
          <div className="mt-1 min-h-[1.25rem]">
            {isValidatingUsername && (
              <p className="text-sm text-blue-600">Checking availability...</p>
            )}
            {validationError && (
              <p className="text-sm text-red-600">{validationError}</p>
            )}
            {!validationError && !isValidatingUsername && username.length >= 3 && (
              <p className="text-sm text-green-600">Username looks good!</p>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            3-20 characters, letters, numbers, and underscores only
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting 
              ? (mode === 'create' ? 'Creating...' : 'Updating...') 
              : (mode === 'create' ? 'Create Profile' : 'Update Profile')
            }
          </button>
        </div>
      </form>
    </div>
  )
}