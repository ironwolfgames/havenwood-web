import { supabase, supabaseAdmin, handleSupabaseResponse, Database } from './supabase'

type Tables = Database['public']['Tables']
type Player = Tables['players']['Row']
type PlayerInsert = Tables['players']['Insert']
type Faction = Tables['factions']['Row']
type GameSession = Tables['game_sessions']['Row']
type GameSessionInsert = Tables['game_sessions']['Insert']
type SessionPlayer = Tables['session_players']['Row']
type SessionPlayerInsert = Tables['session_players']['Insert']

/**
 * Player CRUD operations
 */
export const playerOperations = {
  async create(playerData: PlayerInsert): Promise<Player> {
    const response = await supabase
      .from('players')
      .insert(playerData)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async getByUserId(userId: string): Promise<Player | null> {
    const response = await supabase
      .from('players')
      .select()
      .eq('user_id', userId)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      // No rows returned is not an error in this case
      return null
    }
    
    return handleSupabaseResponse(response)
  },

  async getByUsername(username: string): Promise<Player | null> {
    const response = await supabase
      .from('players')
      .select()
      .eq('username', username)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      // No rows returned is not an error in this case
      return null
    }
    
    return handleSupabaseResponse(response)
  },

  async update(id: string, updates: Partial<PlayerInsert>): Promise<Player> {
    const response = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async delete(id: string): Promise<void> {
    const response = await supabase
      .from('players')
      .delete()
      .eq('id', id)
    
    handleSupabaseResponse(response)
  }
}

/**
 * Faction CRUD operations
 */
export const factionOperations = {
  async getAll(): Promise<Faction[]> {
    const response = await supabase
      .from('factions')
      .select()
      .order('name')
    
    return handleSupabaseResponse(response)
  },

  async getById(id: string): Promise<Faction | null> {
    const response = await supabase
      .from('factions')
      .select()
      .eq('id', id)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      return null
    }
    
    return handleSupabaseResponse(response)
  },

  async getBySystemType(systemType: Faction['system_type']): Promise<Faction[]> {
    const response = await supabase
      .from('factions')
      .select()
      .eq('system_type', systemType)
      .order('name')
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Game Session CRUD operations
 */
export const gameSessionOperations = {
  async create(sessionData: GameSessionInsert): Promise<GameSession> {
    const response = await supabase
      .from('game_sessions')
      .insert(sessionData)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async getById(id: string): Promise<GameSession | null> {
    const response = await supabase
      .from('game_sessions')
      .select()
      .eq('id', id)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      return null
    }
    
    return handleSupabaseResponse(response)
  },

  async getUserSessions(userId: string): Promise<GameSession[]> {
    const response = await supabase
      .from('game_sessions')
      .select(`
        *,
        session_players!inner(
          player_id,
          players!inner(user_id)
        )
      `)
      .eq('session_players.players.user_id', userId)
      .order('created_at', { ascending: false })
    
    return handleSupabaseResponse(response)
  },

  async update(id: string, updates: Partial<GameSessionInsert>): Promise<GameSession> {
    const response = await supabase
      .from('game_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Session Player operations
 */
export const sessionPlayerOperations = {
  async joinSession(sessionPlayerData: SessionPlayerInsert): Promise<SessionPlayer> {
    const response = await supabase
      .from('session_players')
      .insert(sessionPlayerData)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async getSessionPlayers(sessionId: string): Promise<SessionPlayer[]> {
    const response = await supabase
      .from('session_players')
      .select(`
        *,
        players(*),
        factions(*)
      `)
      .eq('session_id', sessionId)
      .order('joined_at')
    
    return handleSupabaseResponse(response)
  },

  async getPlayerSession(playerId: string, sessionId: string): Promise<SessionPlayer | null> {
    const response = await supabase
      .from('session_players')
      .select()
      .eq('player_id', playerId)
      .eq('session_id', sessionId)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      return null
    }
    
    return handleSupabaseResponse(response)
  },

  async leaveSession(playerId: string, sessionId: string): Promise<void> {
    const response = await supabase
      .from('session_players')
      .delete()
      .eq('player_id', playerId)
      .eq('session_id', sessionId)
    
    handleSupabaseResponse(response)
  },

  async updateFaction(playerId: string, sessionId: string, factionId: string): Promise<SessionPlayer> {
    const response = await supabase
      .from('session_players')
      .update({ faction_id: factionId })
      .eq('player_id', playerId)
      .eq('session_id', sessionId)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Admin operations (using service role)
 */
export const adminOperations = {
  async seedFactions(): Promise<Faction[]> {
    if (typeof window !== 'undefined') {
      throw new Error('Admin operations can only be used on the server side')
    }

    const admin = supabaseAdmin()
    
    const factionsData = [
      {
        name: 'Meadow Moles',
        description: 'Provisioner faction specializing in agriculture and crafting. They transform labor and infrastructure into essential resources like food, timber, and fiber that sustain all other factions.',
        system_type: 'provisioner' as const
      },
      {
        name: 'Oakshield Badgers', 
        description: 'Guardian faction focused on defense and stability. They use timber and food to create protection tokens and stability tokens that defend the shared project and boost other factions\' reliability.',
        system_type: 'guardian' as const
      },
      {
        name: 'Starling Scholars',
        description: 'Mystic faction dedicated to knowledge and magic research. They convert fiber and stability into magic crystals and insight tokens that fuel rituals and enhance the efficiency of all factions.',
        system_type: 'mystic' as const
      },
      {
        name: 'River Otters',
        description: 'Explorer faction specializing in expansion and engineering. They use timber, fiber, and magic crystals to build infrastructure and make direct progress on the shared winning project.',
        system_type: 'explorer' as const
      }
    ]

    const response = await admin
      .from('factions')
      .upsert(factionsData, { onConflict: 'name' })
      .select()
    
    return handleSupabaseResponse(response)
  }
}