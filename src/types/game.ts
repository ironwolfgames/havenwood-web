/**
 * Game State and Action Type Definitions
 * 
 * Extends the base database types with game-specific structures
 * for turn resolution, action processing, and state management.
 */

import { Action, TurnResult, Resource } from '@/lib/supabase'
import { ResourceType } from '@/lib/game/resources'

/**
 * Database action types (what's actually stored)
 */
export type DatabaseActionType = 'gather' | 'build' | 'research' | 'protect' | 'trade' | 'special'

/**
 * Game action types (logical types for processing)
 */
export type GameActionType = 
  | 'gather'     // Resource generation
  | 'trade'      // Resource exchange between factions
  | 'convert'    // Transform one resource to another (stored as 'trade' in DB)
  | 'build'      // Construct buildings/infrastructure
  | 'research'   // Advance knowledge/unlock abilities
  | 'protect'    // Generate protection tokens
  | 'special'    // Faction-specific unique actions

/**
 * Action processing phases during turn resolution
 */
export type ActionPhase = 
  | 'validation'   // Check if action is valid
  | 'gather'       // Process resource generation
  | 'exchange'     // Process trade/convert actions
  | 'consumption'  // Process build/research/protect actions
  | 'special'      // Process faction-specific actions
  | 'global'       // Apply global effects and modifiers
  | 'complete'     // Resolution finished

/**
 * Structured action data for different action types
 */
export interface GatherActionData {
  resourceType: ResourceType
  baseAmount: number
  modifiers?: string[] // e.g., 'stability_bonus', 'insight_bonus'
}

export interface TradeActionData {
  fromResourceType: ResourceType
  toResourceType: ResourceType
  amount: number
  exchangeRate: number
  targetFactionId?: string // If trading with another faction
}

export interface ConvertActionData {
  fromResourceType: ResourceType
  toResourceType: ResourceType
  amount: number
  conversionRate: number
}

export interface BuildActionData {
  buildingType: string
  resourceCosts: Record<ResourceType, number>
  benefits?: string[] // e.g., 'production_boost', 'efficiency_increase'
}

export interface ResearchActionData {
  researchType: string
  resourceCosts: Record<ResourceType, number>
  unlocks?: string[] // New abilities or actions unlocked
}

export interface ProtectActionData {
  resourceCosts: Record<ResourceType, number>
  protectionGenerated: number
}

export interface SpecialActionData {
  abilityType: string
  parameters: Record<string, any>
  resourceCosts?: Record<ResourceType, number>
}

/**
 * Union type for all action data structures
 */
export type ActionData = 
  | GatherActionData
  | TradeActionData  
  | ConvertActionData
  | BuildActionData
  | ResearchActionData
  | ProtectActionData
  | SpecialActionData

/**
 * Enhanced action interface with typed data
 * Uses GameActionType for logical processing, but stores as DatabaseActionType
 */
export interface GameAction extends Omit<Action, 'action_data' | 'action_type'> {
  action_type: GameActionType // Logical type for processing
  action_data: ActionData
}

/**
 * Action validation result
 */
export interface ActionValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  actionId: string
  actionType: GameActionType
}

/**
 * Resource change record for audit trail
 */
export interface ResourceChange {
  factionId: string
  resourceType: ResourceType
  oldQuantity: number
  newQuantity: number
  delta: number
  reason: string
  phase: ActionPhase
}

/**
 * Action processing result
 */
export interface ActionProcessingResult {
  success: boolean
  actionId: string
  phase: ActionPhase
  resourceChanges: ResourceChange[]
  errors: string[]
  warnings: string[]
  metadata?: Record<string, any>
}

/**
 * Turn resolution state
 */
export interface TurnResolutionState {
  sessionId: string
  turnNumber: number
  phase: ActionPhase
  startedAt: Date
  completedAt?: Date
  totalActions: number
  processedActions: number
  failedActions: number
  resourceChanges: ResourceChange[]
  errors: string[]
  warnings: string[]
}

/**
 * Turn resolution result
 */
export interface TurnResolutionResult {
  success: boolean
  sessionId: string
  turnNumber: number
  processedActions: ActionProcessingResult[]
  finalResourceState: Record<string, Record<ResourceType, number>>
  globalEffects: {
    foodShortagePenalty: number
    stabilityBonus: number
    insightBonus: number  
    infrastructureBonus: number
  }
  turnResultId?: string
  errors: string[]
  warnings: string[]
  resolutionTime: number // milliseconds
}

/**
 * Turn status for checking readiness
 */
export interface TurnStatus {
  sessionId: string
  turnNumber: number
  totalPlayers: number
  submittedActions: number
  playersSubmitted: string[] // player IDs
  playersNotSubmitted: string[] // player IDs
  allSubmitted: boolean
  canResolve: boolean
  lastSubmissionAt?: Date
}

/**
 * Global resource pools for shared resources
 */
export interface GlobalResourcePools {
  protectionTokens: number
  stabilityTokens: number
  insightTokens: number
  infrastructureTokens: number
  projectProgress: number
}

/**
 * Faction resource state snapshot
 */
export interface FactionResourceState {
  factionId: string
  resources: Record<ResourceType, number>
  efficiency: {
    base: number
    modifiers: Record<string, number>
    total: number
  }
}

/**
 * Complete game state snapshot
 */
export interface GameState {
  sessionId: string
  turnNumber: number
  factionStates: Record<string, FactionResourceState>
  globalPools: GlobalResourcePools
  pendingActions: GameAction[]
  lastResolutionAt?: Date
  gameStatus: 'waiting' | 'active' | 'completed'
}

/**
 * Resolution configuration options
 */
export interface ResolutionOptions {
  validateOnly?: boolean // Just validate, don't execute
  allowPartialFailure?: boolean // Continue if some actions fail
  timeoutMs?: number // Maximum resolution time
  auditTrail?: boolean // Include detailed audit logging
}