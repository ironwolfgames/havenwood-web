import { 
  supabase, 
  supabaseAdmin, 
  handleSupabaseResponse, 
  SupabaseError,
  Database,
  Player,
  PlayerInsert,
  Faction,
  GameSession,
  GameSessionInsert,
  SessionPlayer,
  SessionPlayerInsert,
  Resource,
  ResourceInsert,
  ResourceUpdate,
  Action,
  ActionInsert,
  ActionUpdate,
  TurnResult,
  TurnResultInsert,
  SharedProject,
  SharedProjectInsert,
  ProjectProgress,
  ProjectProgressInsert,
  ProjectProgressUpdate,
  GameOutcome,
  GameOutcomeInsert,
  FactionGoal,
  FactionGoalInsert,
  FactionGoalUpdate
} from './supabase'

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
 * Resource CRUD operations
 */
export const resourceOperations = {
  async create(resourceData: ResourceInsert): Promise<Resource> {
    const response = await supabase
      .from('resources')
      .insert(resourceData)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async getBySessionAndTurn(sessionId: string, turnNumber: number): Promise<Resource[]> {
    const response = await supabase
      .from('resources')
      .select()
      .eq('session_id', sessionId)
      .eq('turn_number', turnNumber)
      .order('faction_id')
    
    return handleSupabaseResponse(response)
  },

  async getBySessionFactionAndTurn(sessionId: string, factionId: string, turnNumber: number): Promise<Resource[]> {
    const response = await supabase
      .from('resources')
      .select()
      .eq('session_id', sessionId)
      .eq('faction_id', factionId)
      .eq('turn_number', turnNumber)
      .order('resource_type')
    
    return handleSupabaseResponse(response)
  },

  async updateQuantity(id: string, quantity: number): Promise<Resource> {
    const response = await supabase
      .from('resources')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async upsertResource(sessionId: string, factionId: string, resourceType: string, turnNumber: number, quantity: number): Promise<Resource> {
    const response = await supabase
      .from('resources')
      .upsert(
        {
          session_id: sessionId,
          faction_id: factionId,
          resource_type: resourceType as any,
          turn_number: turnNumber,
          quantity
        },
        {
          onConflict: 'session_id,faction_id,resource_type,turn_number'
        }
      )
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Action CRUD operations
 */
export const actionOperations = {
  async create(actionData: ActionInsert): Promise<Action> {
    const response = await supabase
      .from('actions')
      .insert(actionData)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async getBySessionAndTurn(sessionId: string, turnNumber: number): Promise<Action[]> {
    const response = await supabase
      .from('actions')
      .select()
      .eq('session_id', sessionId)
      .eq('turn_number', turnNumber)
      .order('submitted_at')
    
    return handleSupabaseResponse(response)
  },

  async getByPlayerAndTurn(playerId: string, sessionId: string, turnNumber: number): Promise<Action[]> {
    const response = await supabase
      .from('actions')
      .select()
      .eq('player_id', playerId)
      .eq('session_id', sessionId)
      .eq('turn_number', turnNumber)
      .order('submitted_at')
    
    return handleSupabaseResponse(response)
  },

  async updateStatus(id: string, status: 'submitted' | 'resolved'): Promise<Action> {
    const response = await supabase
      .from('actions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async update(id: string, updates: ActionUpdate): Promise<Action> {
    const response = await supabase
      .from('actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async getByPlayer(playerId: string): Promise<Action[]> {
    const response = await supabase
      .from('actions')
      .select()
      .eq('player_id', playerId)
      .order('submitted_at', { ascending: false })
    
    return handleSupabaseResponse(response)
  },

  async delete(id: string): Promise<void> {
    const response = await supabase
      .from('actions')
      .delete()
      .eq('id', id)
    
    if (response.error) {
      throw new SupabaseError(response.error.message, response.error.code)
    }
  }
}

/**
 * Server-side Action operations (using admin client)
 */
export const serverActionOperations = {
  async getBySessionAndTurn(sessionId: string, turnNumber: number): Promise<Action[]> {
    if (typeof window !== 'undefined') {
      throw new Error('Server operations can only be used on the server side')
    }
    
    const admin = supabaseAdmin()
    const response = await admin
      .from('actions')
      .select()
      .eq('session_id', sessionId)
      .eq('turn_number', turnNumber)
      .order('submitted_at')
    
    return handleSupabaseResponse(response)
  },

  async update(id: string, updates: ActionUpdate): Promise<Action> {
    if (typeof window !== 'undefined') {
      throw new Error('Server operations can only be used on the server side')
    }
    
    const admin = supabaseAdmin()
    const response = await admin
      .from('actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async getFactions(): Promise<Faction[]> {
    if (typeof window !== 'undefined') {
      throw new Error('Server operations can only be used on the server side')
    }
    
    const admin = supabaseAdmin()
    const response = await admin
      .from('factions')
      .select()
      .order('name')
    
    return handleSupabaseResponse(response)
  },

  async getSessionPlayers(sessionId: string): Promise<SessionPlayer[]> {
    if (typeof window !== 'undefined') {
      throw new Error('Server operations can only be used on the server side')
    }
    
    const admin = supabaseAdmin()
    const response = await admin
      .from('session_players')
      .select(`
        *,
        players(*),
        factions(*)
      `)
      .eq('session_id', sessionId)
      .order('joined_at')
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Server-side Resource operations (using admin client)  
 */
export const serverResourceOperations = {
  async getBySessionAndTurn(sessionId: string, turnNumber: number): Promise<Resource[]> {
    if (typeof window !== 'undefined') {
      throw new Error('Server operations can only be used on the server side')
    }
    
    const admin = supabaseAdmin()
    const response = await admin
      .from('resources')
      .select()
      .eq('session_id', sessionId)
      .eq('turn_number', turnNumber)
      .order('faction_id')
    
    return handleSupabaseResponse(response)
  },
  
  async getBySessionId(sessionId: string): Promise<Resource[]> {
    if (typeof window !== 'undefined') {
      throw new Error('Server operations can only be used on the server side')
    }
    
    const admin = supabaseAdmin()
    const response = await admin
      .from('resources')
      .select()
      .eq('session_id', sessionId)
      .order('turn_number', { ascending: false })
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Server-side Turn Result operations (using admin client)
 */
export const serverTurnResultOperations = {
  async create(resultData: TurnResultInsert): Promise<TurnResult> {
    if (typeof window !== 'undefined') {
      throw new Error('Server operations can only be used on the server side')
    }
    
    const admin = supabaseAdmin()
    const response = await admin
      .from('turn_results')
      .insert(resultData)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Turn Result operations
 */
export const turnResultOperations = {
  async create(resultData: TurnResultInsert): Promise<TurnResult> {
    const response = await supabase
      .from('turn_results')
      .insert(resultData)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async getBySession(sessionId: string): Promise<TurnResult[]> {
    const response = await supabase
      .from('turn_results')
      .select()
      .eq('session_id', sessionId)
      .order('turn_number')
    
    return handleSupabaseResponse(response)
  },

  async getBySessionAndTurn(sessionId: string, turnNumber: number): Promise<TurnResult | null> {
    const response = await supabase
      .from('turn_results')
      .select()
      .eq('session_id', sessionId)
      .eq('turn_number', turnNumber)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      return null
    }
    
    return handleSupabaseResponse(response)
  },

  async getById(id: string): Promise<TurnResult | null> {
    const response = await supabase
      .from('turn_results')
      .select()
      .eq('id', id)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      return null
    }
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Shared Project operations
 */
export const sharedProjectOperations = {
  async getAll(): Promise<SharedProject[]> {
    const response = await supabase
      .from('shared_projects')
      .select()
      .order('name')
    
    return handleSupabaseResponse(response)
  },

  async getById(id: string): Promise<SharedProject | null> {
    const response = await supabase
      .from('shared_projects')
      .select()
      .eq('id', id)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      return null
    }
    
    return handleSupabaseResponse(response)
  },

  async getByName(name: string): Promise<SharedProject | null> {
    const response = await supabase
      .from('shared_projects')
      .select()
      .eq('name', name)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      return null
    }
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Project Progress operations
 */
export const projectProgressOperations = {
  async create(progressData: ProjectProgressInsert): Promise<ProjectProgress> {
    const response = await supabase
      .from('project_progress')
      .insert(progressData)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async getBySessionId(sessionId: string): Promise<ProjectProgress | null> {
    const response = await supabase
      .from('project_progress')
      .select(`
        *,
        project:shared_projects(*),
        session:game_sessions(*)
      `)
      .eq('session_id', sessionId)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      return null
    }
    
    return handleSupabaseResponse(response)
  },

  async updateProgress(sessionId: string, updates: ProjectProgressUpdate): Promise<ProjectProgress> {
    const response = await supabase
      .from('project_progress')
      .update(updates)
      .eq('session_id', sessionId)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async contribute(sessionId: string, resourceType: string, amount: number): Promise<ProjectProgress> {
    // First get current progress
    const currentProgress = await this.getBySessionId(sessionId)
    if (!currentProgress) {
      throw new Error('No project progress found for session')
    }

    // Update stage contributions
    const contributions = currentProgress.stage_contributions as Record<string, number> || {}
    contributions[resourceType] = (contributions[resourceType] || 0) + amount

    const response = await supabase
      .from('project_progress')
      .update({ 
        stage_contributions: contributions,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async advanceStage(sessionId: string): Promise<ProjectProgress> {
    const currentProgress = await this.getBySessionId(sessionId)
    if (!currentProgress) {
      throw new Error('No project progress found for session')
    }

    const completedStages = (currentProgress.completed_stages as any[]) || []
    const newCompletedStage = {
      stage: currentProgress.current_stage,
      completedAt: new Date().toISOString(),
      contributions: currentProgress.stage_contributions
    }
    
    completedStages.push(newCompletedStage)

    const response = await supabase
      .from('project_progress')
      .update({
        current_stage: currentProgress.current_stage + 1,
        stage_contributions: {},
        completed_stages: completedStages,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async completeProject(sessionId: string): Promise<ProjectProgress> {
    const response = await supabase
      .from('project_progress')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async delete(sessionId: string): Promise<void> {
    const response = await supabase
      .from('project_progress')
      .delete()
      .eq('session_id', sessionId)
    
    handleSupabaseResponse(response)
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
  },

  async seedSharedProjects(): Promise<SharedProject[]> {
    if (typeof window !== 'undefined') {
      throw new Error('Admin operations can only be used on the server side')
    }

    const admin = supabaseAdmin()
    
    const projectsData = [
      {
        name: 'Sky Lantern of Eternal Dawn',
        description: 'Illuminate the land to hold back encroaching darkness. This massive lantern will provide eternal light to protect all kingdoms from the shadow plague.',
        stages: [
          {
            stage: 1,
            name: 'Craft the Lantern Frame',
            description: 'Build the basic structure using timber and magical components.',
            requirements: {
              timber: 15,
              magic_crystals: 8,
              infrastructure_tokens: 5
            }
          },
          {
            stage: 2,
            name: 'Enchant the Light Crystal',
            description: 'Imbue the central crystal with protective magic and insights.',
            requirements: {
              magic_crystals: 20,
              insight_tokens: 12,
              stability_tokens: 8
            }
          },
          {
            stage: 3,
            name: 'Raise the Lantern',
            description: 'Install the completed lantern and activate its eternal flame.',
            requirements: {
              infrastructure_tokens: 15,
              protection_tokens: 10,
              project_progress: 25
            }
          }
        ]
      },
      {
        name: 'Heartwood Tree Restoration',
        description: 'Revive the central life-giving tree that once nourished all the kingdoms. Its restoration will bring abundance and healing to the land.',
        stages: [
          {
            stage: 1,
            name: 'Clear the Corrupted Roots',
            description: 'Remove dark corruption from the ancient root system.',
            requirements: {
              protection_tokens: 12,
              stability_tokens: 10,
              magic_crystals: 8
            }
          },
          {
            stage: 2,
            name: 'Replant Sacred Seeds',
            description: 'Plant blessed seeds and nurture new growth with care.',
            requirements: {
              food: 25,
              fiber: 15,
              insight_tokens: 10
            }
          },
          {
            stage: 3,
            name: 'Perform the Great Awakening',
            description: 'Channel collective energy to awaken the Heartwood Tree.',
            requirements: {
              magic_crystals: 18,
              infrastructure_tokens: 12,
              project_progress: 30
            }
          }
        ]
      },
      {
        name: 'Crystal Bridge Across the Chasm',
        description: 'Reconnect isolated kingdoms by spanning the Great Chasm with a magnificent crystal bridge powered by cooperative magic.',
        stages: [
          {
            stage: 1,
            name: 'Anchor the Foundation',
            description: 'Secure crystal anchors on both sides of the chasm.',
            requirements: {
              timber: 20,
              infrastructure_tokens: 15,
              protection_tokens: 8
            }
          },
          {
            stage: 2,
            name: 'Weave the Crystal Spans',
            description: 'Use magic and engineering to create the bridge structure.',
            requirements: {
              magic_crystals: 25,
              fiber: 18,
              insight_tokens: 12
            }
          },
          {
            stage: 3,
            name: 'Harmonize the Resonance',
            description: 'Tune the bridge\'s crystal matrix for safe passage.',
            requirements: {
              stability_tokens: 15,
              infrastructure_tokens: 20,
              project_progress: 28
            }
          }
        ]
      },
      {
        name: 'Moon Temple Ritual',
        description: 'Seal away corruption with a massive magical ritual performed at the ancient Moon Temple, requiring perfect coordination of all factions.',
        stages: [
          {
            stage: 1,
            name: 'Restore the Temple Grounds',
            description: 'Repair the ancient structures and clear the ritual space.',
            requirements: {
              timber: 18,
              infrastructure_tokens: 12,
              stability_tokens: 10
            }
          },
          {
            stage: 2,
            name: 'Gather Ritual Components',
            description: 'Collect rare materials and prepare ceremonial items.',
            requirements: {
              fiber: 20,
              magic_crystals: 22,
              insight_tokens: 15
            }
          },
          {
            stage: 3,
            name: 'Perform the Sealing Ritual',
            description: 'Channel the power of all factions to seal the corruption.',
            requirements: {
              protection_tokens: 18,
              magic_crystals: 15,
              project_progress: 35
            }
          }
        ]
      },
      {
        name: 'Skyship Ark',
        description: 'Build an airship to evacuate the kingdoms to safety in the floating islands above the clouds, preserving civilization for the future.',
        stages: [
          {
            stage: 1,
            name: 'Construct the Hull',
            description: 'Build the main body of the skyship with reinforced timber.',
            requirements: {
              timber: 30,
              fiber: 20,
              infrastructure_tokens: 18
            }
          },
          {
            stage: 2,
            name: 'Install Flight Systems',
            description: 'Add magical propulsion and navigation systems.',
            requirements: {
              magic_crystals: 28,
              insight_tokens: 18,
              stability_tokens: 12
            }
          },
          {
            stage: 3,
            name: 'Launch the Ark',
            description: 'Power up all systems and launch to the safety of the sky.',
            requirements: {
              protection_tokens: 15,
              infrastructure_tokens: 25,
              project_progress: 40
            }
          }
        ]
      }
    ]

    const response = await admin
      .from('shared_projects')
      .upsert(projectsData, { onConflict: 'name' })
      .select()
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Server-side game outcome operations (using admin client)
 */
export const serverGameOutcomeOperations = {
  async create(outcomeData: GameOutcomeInsert): Promise<GameOutcome> {
    const admin = supabaseAdmin()
    const response = await admin
      .from('game_outcomes')
      .insert(outcomeData)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async getBySessionId(sessionId: string): Promise<GameOutcome | null> {
    const admin = supabaseAdmin()
    const response = await admin
      .from('game_outcomes')
      .select()
      .eq('session_id', sessionId)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      return null
    }
    
    return handleSupabaseResponse(response)
  },

  async getAll(): Promise<GameOutcome[]> {
    const admin = supabaseAdmin()
    const response = await admin
      .from('game_outcomes')
      .select()
      .order('created_at', { ascending: false })
    
    return handleSupabaseResponse(response)
  }
}

/**
 * Server-side faction goal operations (using admin client)
 */
export const serverFactionGoalOperations = {
  async createMany(goals: FactionGoalInsert[]): Promise<FactionGoal[]> {
    const admin = supabaseAdmin()
    const response = await admin
      .from('faction_goals')
      .insert(goals)
      .select()
    
    return handleSupabaseResponse(response)
  },

  async getBySessionId(sessionId: string): Promise<FactionGoal[]> {
    const admin = supabaseAdmin()
    const response = await admin
      .from('faction_goals')
      .select()
      .eq('session_id', sessionId)
      .order('player_id', { ascending: true })
    
    return handleSupabaseResponse(response)
  },

  async updateProgress(goalId: string, updateData: FactionGoalUpdate): Promise<FactionGoal> {
    const admin = supabaseAdmin()
    const response = await admin
      .from('faction_goals')
      .update(updateData)
      .eq('id', goalId)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  async areAllGoalsCompleted(sessionId: string): Promise<boolean> {
    const allGoals = await this.getBySessionId(sessionId)
    return allGoals.length > 0 && allGoals.every(goal => goal.is_completed)
  }
}