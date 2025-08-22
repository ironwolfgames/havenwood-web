'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase, Player } from '@/lib/supabase'

export default function UserProfile() {
  const { user, signOut } = useAuth()
  const [player, setPlayer] = useState<Player | null>(null)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching player profile:', error)
          setError('Failed to load profile')
        } else if (data) {
          setPlayer(data)
          setUsername(data.username)
        }
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPlayerProfile()
    }
  }, [user])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setError('')
    setSuccess('')

    if (!username.trim()) {
      setError('Username is required')
      setSaving(false)
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long')
      setSaving(false)
      return
    }

    try {
      const playerData = {
        user_id: user.id,
        username: username.trim(),
        updated_at: new Date().toISOString()
      }

      if (player) {
        // Update existing player
        const { error } = await supabase
          .from('players')
          .update(playerData)
          .eq('id', player.id)

        if (error) throw error
      } else {
        // Create new player
        const { data, error } = await supabase
          .from('players')
          .insert(playerData)
          .select()
          .single()

        if (error) throw error
        setPlayer(data)
      }

      setSuccess('Profile saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      console.error('Error saving profile:', err)
      if (err.code === '23505') {
        setError('Username is already taken')
      } else {
        setError('Failed to save profile')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      setError('Failed to sign out')
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-2">Your Profile</h2>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user.email || ''}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Choose a username"
              disabled={saving}
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">This is how other players will see you</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <div className="border-t border-gray-200 pt-6">
          <div className="text-sm text-gray-600 mb-4">
            <p><strong>Account ID:</strong> {user.id}</p>
            <p><strong>Created:</strong> {new Date(user.created_at || '').toLocaleDateString()}</p>
            {player && (
              <p><strong>Player ID:</strong> {player.id}</p>
            )}
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}