/**
 * Faction mini-goals tracking and management
 */

import { FactionGoal, FactionGoalInsert, FactionGoalUpdate, Faction } from '@/lib/supabase'

export type FactionType = 'provisioner' | 'guardian' | 'mystic' | 'explorer'

export interface MiniGoalDefinition {
  goalType: string
  name: string
  description: string
  targetValue: number
  trackingMetric: string
}

export interface MiniGoalProgress {
  goal: FactionGoal
  definition: MiniGoalDefinition
  progressPercentage: number
  isAchievable: boolean
  turnsRemaining?: number
}

export interface FactionMiniGoals {
  factionType: FactionType
  factionName: string
  goals: MiniGoalDefinition[]
}

/**
 * Define mini-goals for each faction type
 */
export const FACTION_MINI_GOALS: Record<FactionType, FactionMiniGoals> = {
  provisioner: {
    factionType: 'provisioner',
    factionName: 'Meadow Moles',
    goals: [
      {
        goalType: 'food_security',
        name: 'Food Security',
        description: 'Maintain food surplus for 3 consecutive turns',
        targetValue: 3,
        trackingMetric: 'consecutive_food_surplus_turns'
      },
      {
        goalType: 'trade_network',
        name: 'Trade Network',
        description: 'Complete 5 resource trades with other factions',
        targetValue: 5,
        trackingMetric: 'completed_trades'
      },
      {
        goalType: 'sustainability',
        name: 'Sustainability',
        description: 'Reach maximum farm production efficiency',
        targetValue: 10,
        trackingMetric: 'total_food_produced'
      }
    ]
  },
  guardian: {
    factionType: 'guardian',
    factionName: 'Oakshield Badgers',
    goals: [
      {
        goalType: 'fortress_builder',
        name: 'Fortress Builder',
        description: 'Construct 4 defensive fortifications',
        targetValue: 4,
        trackingMetric: 'fortifications_built'
      },
      {
        goalType: 'event_defender',
        name: 'Event Defender',
        description: 'Successfully defend against 3 major events',
        targetValue: 3,
        trackingMetric: 'events_defended'
      },
      {
        goalType: 'stability_keeper',
        name: 'Stability Keeper',
        description: 'Maintain global stability above 5 for 4 turns',
        targetValue: 4,
        trackingMetric: 'stability_maintenance_turns'
      }
    ]
  },
  mystic: {
    factionType: 'mystic',
    factionName: 'Starling Scholars',
    goals: [
      {
        goalType: 'knowledge_master',
        name: 'Knowledge Master',
        description: 'Complete 4 research projects',
        targetValue: 4,
        trackingMetric: 'research_completed'
      },
      {
        goalType: 'event_predictor',
        name: 'Event Predictor',
        description: 'Successfully predict and mitigate 3 events',
        targetValue: 3,
        trackingMetric: 'events_predicted'
      },
      {
        goalType: 'magic_channeler',
        name: 'Magic Channeler',
        description: 'Generate 15 total magic crystals',
        targetValue: 15,
        trackingMetric: 'magic_crystals_generated'
      }
    ]
  },
  explorer: {
    factionType: 'explorer',
    factionName: 'River Otters',
    goals: [
      {
        goalType: 'master_builder',
        name: 'Master Builder',
        description: 'Complete 5 infrastructure projects',
        targetValue: 5,
        trackingMetric: 'infrastructure_built'
      },
      {
        goalType: 'project_leader',
        name: 'Project Leader',
        description: 'Contribute 30% of shared project progress',
        targetValue: 30,
        trackingMetric: 'project_contribution_percentage'
      },
      {
        goalType: 'network_creator',
        name: 'Network Creator',
        description: 'Build 8 infrastructure tokens for global benefit',
        targetValue: 8,
        trackingMetric: 'infrastructure_tokens_created'
      }
    ]
  }
}

/**
 * Initialize mini-goals for a player in a session
 */
export function createPlayerMiniGoals(
  sessionId: string,
  playerId: string,
  factionType: FactionType
): FactionGoalInsert[] {
  const factionGoals = FACTION_MINI_GOALS[factionType]
  
  return factionGoals.goals.map(goalDef => ({
    session_id: sessionId,
    player_id: playerId,
    faction_type: factionType,
    goal_type: goalDef.goalType,
    target_value: goalDef.targetValue,
    current_progress: 0,
    is_completed: false
  }))
}

/**
 * Update goal progress based on game actions
 */
export function calculateGoalProgress(
  goal: FactionGoal,
  gameData: {
    resources: any[]
    actions: any[]
    currentTurn: number
    sessionData?: any
  }
): Partial<FactionGoalUpdate> {
  const goalDef = getGoalDefinition(goal.faction_type, goal.goal_type)
  if (!goalDef) {
    return {}
  }
  
  let newProgress = goal.current_progress
  
  // Calculate progress based on the specific tracking metric
  switch (goalDef.trackingMetric) {
    case 'completed_trades':
      newProgress = calculateTradeProgress(gameData.actions, goal.player_id)
      break
      
    case 'total_food_produced':
      newProgress = calculateResourceProduction(gameData.resources, goal.player_id, 'food')
      break
      
    case 'fortifications_built':
      newProgress = calculateBuildProgress(gameData.actions, goal.player_id, 'protect')
      break
      
    case 'research_completed':
      newProgress = calculateBuildProgress(gameData.actions, goal.player_id, 'research')
      break
      
    case 'infrastructure_built':
      newProgress = calculateBuildProgress(gameData.actions, goal.player_id, 'build')
      break
      
    case 'magic_crystals_generated':
      newProgress = calculateResourceProduction(gameData.resources, goal.player_id, 'magic_crystals')
      break
      
    case 'infrastructure_tokens_created':
      newProgress = calculateResourceProduction(gameData.resources, goal.player_id, 'infrastructure_tokens')
      break
      
    case 'consecutive_food_surplus_turns':
    case 'stability_maintenance_turns':
    case 'events_defended':
    case 'events_predicted':
    case 'project_contribution_percentage':
      // These require more complex tracking that would be handled elsewhere
      // For now, keep existing progress
      newProgress = goal.current_progress
      break
  }
  
  const isCompleted = newProgress >= goal.target_value
  const update: Partial<FactionGoalUpdate> = {
    current_progress: newProgress
  }
  
  if (isCompleted && !goal.is_completed) {
    update.is_completed = true
    update.completed_turn = gameData.currentTurn
  }
  
  return update
}

/**
 * Get progress summary for display
 */
export function getMiniGoalProgress(
  goals: FactionGoal[],
  factionType: FactionType
): MiniGoalProgress[] {
  const factionGoals = FACTION_MINI_GOALS[factionType]
  
  return goals.map(goal => {
    const definition = factionGoals.goals.find(g => g.goalType === goal.goal_type)!
    const progressPercentage = Math.min((goal.current_progress / goal.target_value) * 100, 100)
    
    return {
      goal,
      definition,
      progressPercentage,
      isAchievable: true, // Could add more complex logic here
      turnsRemaining: goal.is_completed ? 0 : undefined
    }
  })
}

/**
 * Check if all faction goals are completed
 */
export function areAllGoalsCompleted(goals: FactionGoal[]): boolean {
  return goals.length > 0 && goals.every(goal => goal.is_completed)
}

/**
 * Get mini-goal definition for a faction type and goal type
 */
export function getGoalDefinition(
  factionType: FactionType,
  goalType: string
): MiniGoalDefinition | undefined {
  return FACTION_MINI_GOALS[factionType]?.goals.find(g => g.goalType === goalType)
}

/**
 * Calculate progress for trade-related goals
 */
function calculateTradeProgress(actions: any[], playerId: string): number {
  return actions.filter(action => 
    action.player_id === playerId && 
    action.action_type === 'trade' &&
    action.status === 'resolved'
  ).length
}

/**
 * Calculate progress for resource production goals
 */
function calculateResourceProduction(
  resources: any[], 
  playerId: string, 
  resourceType: string
): number {
  return resources
    .filter(r => r.player_id === playerId && r.resource_type === resourceType)
    .reduce((total, r) => total + r.quantity, 0)
}

/**
 * Calculate progress for building/construction related goals
 */
function calculateBuildProgress(
  actions: any[], 
  playerId: string, 
  actionType: string
): number {
  return actions.filter(action =>
    action.player_id === playerId && 
    action.action_type === actionType &&
    action.status === 'resolved'
  ).length
}