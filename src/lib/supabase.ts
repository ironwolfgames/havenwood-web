import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Environment variable validation
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  }
  return url
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return key
}

/**
 * Create Supabase client for browser/client-side usage
 * Uses the anonymous key for public operations
 */
function createSupabaseClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  })
}

/**
 * Supabase client for browser/client-side usage
 * Uses the anonymous key for public operations
 */
export const supabase: SupabaseClient = (() => {
  try {
    return createSupabaseClient()
  } catch (error) {
    console.warn('Supabase client creation failed:', error instanceof Error ? error.message : 'Unknown error')
    // Return a mock client for build time
    return {} as SupabaseClient
  }
})()

/**
 * Supabase client for server-side usage with service role key
 * Should only be used on the server side (API routes, middleware, etc.)
 * Has elevated permissions - use with caution
 */
export function supabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin should only be used on the server side')
  }
  
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY - required for server-side operations')
  }
  
  return createClient(getSupabaseUrl(), supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Database type definitions
 * These should be generated from your Supabase schema
 */
export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          user_id: string
          username: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          created_at?: string
          updated_at?: string
        }
      }
      factions: {
        Row: {
          id: string
          name: string
          description: string
          system_type: 'provisioner' | 'guardian' | 'mystic' | 'explorer'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          system_type: 'provisioner' | 'guardian' | 'mystic' | 'explorer'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          system_type?: 'provisioner' | 'guardian' | 'mystic' | 'explorer'
          created_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          name: string
          status: 'waiting' | 'active' | 'completed'
          current_turn: number
          max_turns: number
          shared_project_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          status?: 'waiting' | 'active' | 'completed'
          current_turn?: number
          max_turns?: number
          shared_project_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: 'waiting' | 'active' | 'completed'
          current_turn?: number
          max_turns?: number
          shared_project_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      session_players: {
        Row: {
          id: string
          session_id: string
          player_id: string
          faction_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          session_id: string
          player_id: string
          faction_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          player_id?: string
          faction_id?: string
          joined_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

/**
 * Custom error class for Supabase operations
 */
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}

/**
 * Helper function to handle Supabase responses with proper error handling
 */
export function handleSupabaseResponse<T>(
  response: { data: T | null; error: any }
): T {
  if (response.error) {
    console.error('Supabase error:', response.error)
    throw new SupabaseError(
      response.error.message || 'An unknown Supabase error occurred',
      response.error.code,
      response.error.details
    )
  }
  
  if (response.data === null) {
    throw new SupabaseError('No data returned from Supabase operation')
  }
  
  return response.data
}

/**
 * Helper function to safely get the current user
 */
export async function getCurrentUser() {
  try {
    const client = createSupabaseClient()
    const { data: { user }, error } = await client.auth.getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}