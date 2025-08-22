'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Player } from '@/lib/supabase'
import { playerOperations } from '@/lib/database-operations'

interface AuthContextType {
  user: User | null
  player: Player | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  createPlayerProfile: (username: string) => Promise<Player>
  updatePlayerProfile: (updates: Partial<Player>) => Promise<Player>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured - authentication disabled')
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else if (session?.user) {
          setUser(session.user)
          await loadPlayerProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        
        if (session?.user) {
          setUser(session.user)
          await loadPlayerProfile(session.user.id)
        } else {
          setUser(null)
          setPlayer(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadPlayerProfile = async (userId: string) => {
    try {
      const playerProfile = await playerOperations.getByUserId(userId)
      setPlayer(playerProfile)
    } catch (error) {
      console.error('Error loading player profile:', error)
      setPlayer(null)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        throw error
      }

      // Player profile will be loaded via auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        throw error
      }

      // Player profile will be created after user confirms email and signs in
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const createPlayerProfile = async (username: string): Promise<Player> => {
    if (!user) {
      throw new Error('User must be authenticated to create player profile')
    }

    try {
      const newPlayer = await playerOperations.create({
        user_id: user.id,
        username: username.trim(),
      })
      
      setPlayer(newPlayer)
      return newPlayer
    } catch (error) {
      console.error('Error creating player profile:', error)
      throw error
    }
  }

  const updatePlayerProfile = async (updates: Partial<Player>): Promise<Player> => {
    if (!player) {
      throw new Error('No player profile to update')
    }

    try {
      const updatedPlayer = await playerOperations.update(player.id, updates)
      setPlayer(updatedPlayer)
      return updatedPlayer
    } catch (error) {
      console.error('Error updating player profile:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    player,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    createPlayerProfile,
    updatePlayerProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}