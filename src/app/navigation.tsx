'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePlayer } from '@/hooks/usePlayer'
import { PlayerProfileCard } from '@/components/PlayerProfile'

export default function Navigation() {
  const { user, signOut, loading } = useAuth()
  const { player } = usePlayer()

  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-green-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold hover:text-green-200">
              Havenwood Kingdoms
            </Link>
            
            {/* Main navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/test-supabase"
                className="text-green-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Test Supabase
              </Link>
              <Link
                href="/faction-dashboards"
                className="text-green-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Faction Dashboards
              </Link>
            </nav>
          </div>

          {/* User section */}
          <div className="flex items-center space-x-4">
            {!isSupabaseConfigured ? (
              // Supabase not configured
              <Link 
                href="/profile"
                className="text-green-200 hover:text-white text-sm font-medium"
              >
                Profile Setup
              </Link>
            ) : loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : user && player ? (
              // Authenticated user with player profile
              <div className="flex items-center space-x-3">
                <Link 
                  href="/profile"
                  className="text-green-200 hover:text-white text-sm font-medium"
                >
                  {player.username}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-green-200 hover:text-white text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : user ? (
              // Authenticated user without player profile
              <div className="flex items-center space-x-3">
                <Link 
                  href="/profile"
                  className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Create Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-green-200 hover:text-white text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              // Unauthenticated user
              <Link 
                href="/profile"
                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}