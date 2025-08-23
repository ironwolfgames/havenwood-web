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
          description: string | null
          status: 'waiting' | 'active' | 'completed'
          current_turn: number
          max_turns: number
          max_players: number
          current_players: number
          creator_id: string | null
          shared_project_id: string | null
          turn_timer_minutes: number | null
          configuration: any
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: 'waiting' | 'active' | 'completed'
          current_turn?: number
          max_turns?: number
          max_players?: number
          current_players?: number
          creator_id?: string | null
          shared_project_id?: string | null
          turn_timer_minutes?: number | null
          configuration?: any
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'waiting' | 'active' | 'completed'
          current_turn?: number
          max_turns?: number
          max_players?: number
          current_players?: number
          creator_id?: string | null
          shared_project_id?: string | null
          turn_timer_minutes?: number | null
          configuration?: any
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      session_players: {
        Row: {
          id: string
          session_id: string
          player_id: string
          faction_id: string | null
          is_ready: boolean
          joined_at: string
        }
        Insert: {
          id?: string
          session_id: string
          player_id: string
          faction_id?: string | null
          is_ready?: boolean
          joined_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          player_id?: string
          faction_id?: string | null
          is_ready?: boolean
          joined_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          session_id: string
          faction_id: string
          resource_type: 'food' | 'timber' | 'fiber' | 'protection_tokens' | 'stability_tokens' | 'magic_crystals' | 'insight_tokens' | 'infrastructure_tokens' | 'project_progress'
          quantity: number
          turn_number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          faction_id: string
          resource_type: 'food' | 'timber' | 'fiber' | 'protection_tokens' | 'stability_tokens' | 'magic_crystals' | 'insight_tokens' | 'infrastructure_tokens' | 'project_progress'
          quantity?: number
          turn_number: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          faction_id?: string
          resource_type?: 'food' | 'timber' | 'fiber' | 'protection_tokens' | 'stability_tokens' | 'magic_crystals' | 'insight_tokens' | 'infrastructure_tokens' | 'project_progress'
          quantity?: number
          turn_number?: number
          created_at?: string
          updated_at?: string
        }
      }
      actions: {
        Row: {
          id: string
          session_id: string
          player_id: string
          turn_number: number
          action_type: 'gather' | 'build' | 'research' | 'protect' | 'trade' | 'special'
          action_data: any
          status: 'submitted' | 'resolved'
          submitted_at: string
        }
        Insert: {
          id?: string
          session_id: string
          player_id: string
          turn_number: number
          action_type: 'gather' | 'build' | 'research' | 'protect' | 'trade' | 'special'
          action_data?: any
          status?: 'submitted' | 'resolved'
          submitted_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          player_id?: string
          turn_number?: number
          action_type?: 'gather' | 'build' | 'research' | 'protect' | 'trade' | 'special'
          action_data?: any
          status?: 'submitted' | 'resolved'
          submitted_at?: string
        }
      }
      turn_results: {
        Row: {
          id: string
          session_id: string
          turn_number: number
          results_data: any
          resolved_at: string
        }
        Insert: {
          id?: string
          session_id: string
          turn_number: number
          results_data?: any
          resolved_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          turn_number?: number
          results_data?: any
          resolved_at?: string
        }
      }
      shared_projects: {
        Row: {
          id: string
          name: string
          description: string
          stages: any
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          stages: any
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          stages?: any
          created_at?: string
        }
      }
      project_progress: {
        Row: {
          id: string
          session_id: string
          project_id: string
          current_stage: number
          stage_contributions: any
          completed_stages: any
          is_completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          project_id: string
          current_stage?: number
          stage_contributions?: any
          completed_stages?: any
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          project_id?: string
          current_stage?: number
          stage_contributions?: any
          completed_stages?: any
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
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
 * Type aliases for database tables
 */
export type Player = Database['public']['Tables']['players']['Row']
export type PlayerInsert = Database['public']['Tables']['players']['Insert']
export type PlayerUpdate = Database['public']['Tables']['players']['Update']

export type Faction = Database['public']['Tables']['factions']['Row']
export type FactionInsert = Database['public']['Tables']['factions']['Insert']
export type FactionUpdate = Database['public']['Tables']['factions']['Update']

export type GameSession = Database['public']['Tables']['game_sessions']['Row']
export type GameSessionInsert = Database['public']['Tables']['game_sessions']['Insert']
export type GameSessionUpdate = Database['public']['Tables']['game_sessions']['Update']

export type SessionPlayer = Database['public']['Tables']['session_players']['Row']
export type SessionPlayerInsert = Database['public']['Tables']['session_players']['Insert']
export type SessionPlayerUpdate = Database['public']['Tables']['session_players']['Update']

export type Resource = Database['public']['Tables']['resources']['Row']
export type ResourceInsert = Database['public']['Tables']['resources']['Insert']
export type ResourceUpdate = Database['public']['Tables']['resources']['Update']

export type Action = Database['public']['Tables']['actions']['Row']
export type ActionInsert = Database['public']['Tables']['actions']['Insert']
export type ActionUpdate = Database['public']['Tables']['actions']['Update']

export type TurnResult = Database['public']['Tables']['turn_results']['Row']
export type TurnResultInsert = Database['public']['Tables']['turn_results']['Insert']
export type TurnResultUpdate = Database['public']['Tables']['turn_results']['Update']

export type SharedProject = Database['public']['Tables']['shared_projects']['Row']
export type SharedProjectInsert = Database['public']['Tables']['shared_projects']['Insert']
export type SharedProjectUpdate = Database['public']['Tables']['shared_projects']['Update']

export type ProjectProgress = Database['public']['Tables']['project_progress']['Row']
export type ProjectProgressInsert = Database['public']['Tables']['project_progress']['Insert']
export type ProjectProgressUpdate = Database['public']['Tables']['project_progress']['Update']

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