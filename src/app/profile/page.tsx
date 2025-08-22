'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePlayer } from '@/hooks/usePlayer'
import { PlayerProfile } from '@/components/PlayerProfile'
import { ProfileForm } from '@/components/ProfileForm'
import { AuthForm } from '@/components/AuthForm'

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth()
  const { player, needsPlayerProfile } = usePlayer()
  const [isEditing, setIsEditing] = useState(false)

  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleProfileSuccess = () => {
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Supabase not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">Player Profiles</h1>
          <p className="text-blue-800 mb-4">
            Player profile functionality requires Supabase configuration.
          </p>
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-medium text-gray-900 mb-2">To enable authentication:</h3>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Set up your Supabase project</li>
              <li>Copy environment variables to <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
              <li>Restart the development server</li>
            </ol>
            <a
              href="/test-supabase"
              className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Test Supabase Connection →
            </a>
          </div>
        </div>
      </div>
    )
  }

  // User not authenticated
  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Player Profile</h1>
          <p className="text-gray-600 mt-2">Sign in to access your player profile</p>
        </div>
        <AuthForm />
      </div>
    )
  }

  // User authenticated but needs to create player profile
  if (needsPlayerProfile) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Havenwood Kingdoms!</h1>
          <p className="text-gray-600 mt-2">Create your player profile to get started</p>
        </div>
        <ProfileForm mode="create" onSuccess={handleProfileSuccess} />
      </div>
    )
  }

  // User has player profile
  if (player) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Player Profile</h1>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Sign Out
          </button>
        </div>

        {isEditing ? (
          <ProfileForm 
            mode="edit" 
            onSuccess={handleProfileSuccess}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <PlayerProfile player={player} showDetails={true} />
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
                  <p className="text-sm text-gray-600">Manage your player information</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Email:</span>
              <span className="text-sm text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Account Created:</span>
              <span className="text-sm text-gray-900">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-700">Last Sign In:</span>
              <span className="text-sm text-gray-900">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}