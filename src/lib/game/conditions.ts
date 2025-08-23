/**
 * Victory and defeat condition evaluation system
 */

import { canCompleteProject } from '@/lib/game/projects'
import { 
  GameSession, 
  ProjectProgress, 
  SharedProject, 
  FactionGoal, 
  Resource 
} from '@/lib/supabase'

export type VictoryType = 'project_completion' | 'mini_goals'
export type DefeatReason = 'famine' | 'instability' | 'destruction' | 'timeout'

export interface ConditionCheckResult {
  gameEnded: boolean
  isVictory: boolean
  victoryType?: VictoryType
  defeatReason?: DefeatReason
  details: string
  triggerTurn: number
}

export interface SurvivalMetrics {
  food: number
  stability: number
  protection: number
  totalResources: number
}

export interface FactionGoalsSummary {
  [playerId: string]: {
    factionType: string
    completed: number
    total: number
    goals: FactionGoal[]
  }
}

/**
 * Check if the shared project has been completed (primary victory condition)
 */
export function checkProjectCompletion(
  projectProgress: ProjectProgress,
  sharedProject: SharedProject
): ConditionCheckResult | null {
  if (canCompleteProject(projectProgress, sharedProject)) {
    return {
      gameEnded: true,
      isVictory: true,
      victoryType: 'project_completion',
      details: 'Shared project has been completed successfully!',
      triggerTurn: projectProgress.current_stage
    }
  }
  return null
}

/**
 * Check mini-goals victory condition
 * Victory requires all factions to achieve their goals AND survival thresholds to be maintained
 */
export function checkMiniGoalsVictory(
  factionGoals: FactionGoal[],
  survivalMetrics: SurvivalMetrics,
  currentTurn: number
): ConditionCheckResult | null {
  const goalsSummary = summarizeFactionGoals(factionGoals)
  const factionsWithPlayers = Object.keys(goalsSummary)
  
  // Check if all factions with players have completed their goals
  const allGoalsCompleted = factionsWithPlayers.every(playerId => {
    const playerGoals = goalsSummary[playerId]
    return playerGoals.completed === playerGoals.total && playerGoals.total > 0
  })
  
  if (allGoalsCompleted && checkSurvivalThresholds(survivalMetrics)) {
    return {
      gameEnded: true,
      isVictory: true,
      victoryType: 'mini_goals',
      details: `All faction mini-goals completed with survival maintained! (${factionsWithPlayers.length} factions)`,
      triggerTurn: currentTurn
    }
  }
  
  return null
}

/**
 * Check for global defeat conditions
 */
export function checkDefeatConditions(
  session: GameSession,
  survivalMetrics: SurvivalMetrics,
  currentTurn: number
): ConditionCheckResult | null {
  // Check timeout condition
  if (currentTurn >= session.max_turns) {
    return {
      gameEnded: true,
      isVictory: false,
      defeatReason: 'timeout',
      details: `Game ended after ${session.max_turns} turns without completing the shared project.`,
      triggerTurn: currentTurn
    }
  }
  
  // Check famine condition (food shortage)
  if (survivalMetrics.food <= 0) {
    return {
      gameEnded: true,
      isVictory: false,
      defeatReason: 'famine',
      details: 'Food supplies have been exhausted, leading to kingdom collapse.',
      triggerTurn: currentTurn
    }
  }
  
  // Check instability condition
  if (survivalMetrics.stability <= 0) {
    return {
      gameEnded: true,
      isVictory: false,
      defeatReason: 'instability',
      details: 'Kingdom stability has collapsed, causing widespread rebellion.',
      triggerTurn: currentTurn
    }
  }
  
  // Check destruction condition (insufficient protection)
  if (survivalMetrics.protection <= 0 && currentTurn > 1) {
    return {
      gameEnded: true,
      isVictory: false,
      defeatReason: 'destruction',
      details: 'Without adequate protection, the kingdoms have been overrun by threats.',
      triggerTurn: currentTurn
    }
  }
  
  return null
}

/**
 * Main function to evaluate all victory and defeat conditions
 */
export function evaluateGameConditions(
  session: GameSession,
  projectProgress: ProjectProgress,
  sharedProject: SharedProject,
  factionGoals: FactionGoal[],
  resources: Resource[],
  currentTurn: number
): ConditionCheckResult {
  const survivalMetrics = calculateSurvivalMetrics(resources, session.id)
  
  // Check victory conditions first (higher priority)
  const projectVictory = checkProjectCompletion(projectProgress, sharedProject)
  if (projectVictory) {
    return projectVictory
  }
  
  // Check mini-goals victory on the final turn
  if (currentTurn === session.max_turns) {
    const miniGoalsVictory = checkMiniGoalsVictory(factionGoals, survivalMetrics, currentTurn)
    if (miniGoalsVictory) {
      return miniGoalsVictory
    }
  }
  
  // Check defeat conditions
  const defeat = checkDefeatConditions(session, survivalMetrics, currentTurn)
  if (defeat) {
    return defeat
  }
  
  // Game continues
  return {
    gameEnded: false,
    isVictory: false,
    details: 'Game continues...',
    triggerTurn: currentTurn
  }
}

/**
 * Calculate survival metrics from current resources
 */
export function calculateSurvivalMetrics(resources: Resource[], sessionId: string): SurvivalMetrics {
  const sessionResources = resources.filter(r => r.session_id === sessionId)
  const latestTurn = Math.max(...sessionResources.map(r => r.turn_number))
  const currentResources = sessionResources.filter(r => r.turn_number === latestTurn)
  
  const metrics: SurvivalMetrics = {
    food: 0,
    stability: 0,
    protection: 0,
    totalResources: 0
  }
  
  currentResources.forEach(resource => {
    switch (resource.resource_type) {
      case 'food':
        metrics.food += resource.quantity
        break
      case 'stability_tokens':
        metrics.stability += resource.quantity
        break
      case 'protection_tokens':
        metrics.protection += resource.quantity
        break
    }
    metrics.totalResources += resource.quantity
  })
  
  return metrics
}

/**
 * Summarize faction goals progress by player
 */
export function summarizeFactionGoals(factionGoals: FactionGoal[]): FactionGoalsSummary {
  const summary: FactionGoalsSummary = {}
  
  factionGoals.forEach(goal => {
    if (!summary[goal.player_id]) {
      summary[goal.player_id] = {
        factionType: goal.faction_type,
        completed: 0,
        total: 0,
        goals: []
      }
    }
    
    summary[goal.player_id].goals.push(goal)
    summary[goal.player_id].total += 1
    if (goal.is_completed) {
      summary[goal.player_id].completed += 1
    }
  })
  
  return summary
}

/**
 * Check if survival thresholds are maintained for mini-goals victory
 */
export function checkSurvivalThresholds(survivalMetrics: SurvivalMetrics): boolean {
  // Minimum thresholds for mini-goals victory
  return survivalMetrics.food > 0 && 
         survivalMetrics.stability > 0 && 
         survivalMetrics.protection >= 0
}