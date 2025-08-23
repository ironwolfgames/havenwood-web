/**
 * Database operations for game outcomes and faction goals
 */

import { 
  supabaseAdmin,
  handleSupabaseResponse,
  GameOutcome,
  GameOutcomeInsert,
  FactionGoal,
  FactionGoalInsert,
  FactionGoalUpdate
} from '@/lib/supabase'

/**
 * Game outcomes database operations
 */
export const gameOutcomeOperations = {
  /**
   * Create a new game outcome record
   */
  async create(outcomeData: GameOutcomeInsert): Promise<GameOutcome> {
    const response = await supabaseAdmin()
      .from('game_outcomes')
      .insert(outcomeData)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  /**
   * Get outcome for a specific session
   */
  async getBySessionId(sessionId: string): Promise<GameOutcome | null> {
    const response = await supabaseAdmin()
      .from('game_outcomes')
      .select()
      .eq('session_id', sessionId)
      .single()
    
    if (response.error && response.error.code === 'PGRST116') {
      return null
    }
    
    return handleSupabaseResponse(response)
  },

  /**
   * Get all outcomes (for statistics/analysis)
   */
  async getAll(): Promise<GameOutcome[]> {
    const response = await supabaseAdmin()
      .from('game_outcomes')
      .select()
      .order('created_at', { ascending: false })
    
    return handleSupabaseResponse(response)
  },

  /**
   * Get outcomes by type for analytics
   */
  async getByOutcomeType(outcomeType: 'victory' | 'defeat'): Promise<GameOutcome[]> {
    const response = await supabaseAdmin()
      .from('game_outcomes')
      .select()
      .eq('outcome_type', outcomeType)
      .order('created_at', { ascending: false })
    
    return handleSupabaseResponse(response)
  },

  /**
   * Delete outcome (cleanup)
   */
  async delete(id: string): Promise<void> {
    const response = await supabaseAdmin()
      .from('game_outcomes')
      .delete()
      .eq('id', id)
    
    handleSupabaseResponse(response)
  }
}

/**
 * Faction goals database operations
 */
export const factionGoalOperations = {
  /**
   * Create new faction goals for a player
   */
  async createMany(goals: FactionGoalInsert[]): Promise<FactionGoal[]> {
    const response = await supabaseAdmin()
      .from('faction_goals')
      .insert(goals)
      .select()
    
    return handleSupabaseResponse(response)
  },

  /**
   * Get all goals for a specific session
   */
  async getBySessionId(sessionId: string): Promise<FactionGoal[]> {
    const response = await supabaseAdmin()
      .from('faction_goals')
      .select()
      .eq('session_id', sessionId)
      .order('player_id', { ascending: true })
    
    return handleSupabaseResponse(response)
  },

  /**
   * Get goals for a specific player in a session
   */
  async getByPlayerAndSession(playerId: string, sessionId: string): Promise<FactionGoal[]> {
    const response = await supabaseAdmin()
      .from('faction_goals')
      .select()
      .eq('player_id', playerId)
      .eq('session_id', sessionId)
      .order('goal_type', { ascending: true })
    
    return handleSupabaseResponse(response)
  },

  /**
   * Update goal progress
   */
  async updateProgress(goalId: string, updateData: FactionGoalUpdate): Promise<FactionGoal> {
    const response = await supabaseAdmin()
      .from('faction_goals')
      .update(updateData)
      .eq('id', goalId)
      .select()
      .single()
    
    return handleSupabaseResponse(response)
  },

  /**
   * Update multiple goals at once
   */
  async updateMany(updates: Array<{ id: string; data: FactionGoalUpdate }>): Promise<FactionGoal[]> {
    const promises = updates.map(update => 
      this.updateProgress(update.id, update.data)
    )
    
    return Promise.all(promises)
  },

  /**
   * Mark goal as completed
   */
  async markCompleted(goalId: string, completedTurn: number): Promise<FactionGoal> {
    return this.updateProgress(goalId, {
      is_completed: true,
      completed_turn: completedTurn
    })
  },

  /**
   * Get completed goals for a session
   */
  async getCompletedBySession(sessionId: string): Promise<FactionGoal[]> {
    const response = await supabaseAdmin()
      .from('faction_goals')
      .select()
      .eq('session_id', sessionId)
      .eq('is_completed', true)
      .order('completed_turn', { ascending: true })
    
    return handleSupabaseResponse(response)
  },

  /**
   * Get goals by faction type
   */
  async getByFactionType(
    sessionId: string, 
    factionType: 'provisioner' | 'guardian' | 'mystic' | 'explorer'
  ): Promise<FactionGoal[]> {
    const response = await supabaseAdmin()
      .from('faction_goals')
      .select()
      .eq('session_id', sessionId)
      .eq('faction_type', factionType)
      .order('goal_type', { ascending: true })
    
    return handleSupabaseResponse(response)
  },

  /**
   * Delete goals for a session (cleanup)
   */
  async deleteBySessionId(sessionId: string): Promise<void> {
    const response = await supabaseAdmin()
      .from('faction_goals')
      .delete()
      .eq('session_id', sessionId)
    
    handleSupabaseResponse(response)
  },

  /**
   * Check if all faction goals are completed for a session
   */
  async areAllGoalsCompleted(sessionId: string): Promise<boolean> {
    const allGoals = await this.getBySessionId(sessionId)
    return allGoals.length > 0 && allGoals.every(goal => goal.is_completed)
  },

  /**
   * Get goal completion statistics for a session
   */
  async getCompletionStats(sessionId: string): Promise<{
    total: number
    completed: number
    completionRate: number
    byFaction: Record<string, { completed: number; total: number }>
  }> {
    const allGoals = await this.getBySessionId(sessionId)
    const completed = allGoals.filter(goal => goal.is_completed).length
    
    const byFaction: Record<string, { completed: number; total: number }> = {}
    
    allGoals.forEach(goal => {
      if (!byFaction[goal.faction_type]) {
        byFaction[goal.faction_type] = { completed: 0, total: 0 }
      }
      
      byFaction[goal.faction_type].total += 1
      if (goal.is_completed) {
        byFaction[goal.faction_type].completed += 1
      }
    })
    
    return {
      total: allGoals.length,
      completed,
      completionRate: allGoals.length > 0 ? (completed / allGoals.length) * 100 : 0,
      byFaction
    }
  }
}