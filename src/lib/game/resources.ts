/**
 * Resource Management Utilities
 * 
 * Implements resource validation, transfer rules, and game logic
 * based on faction interdependencies from the Game Design Document.
 */

import { Resource, ResourceInsert } from '@/lib/supabase'

/**
 * Resource types as defined in Game Design Document
 */
export type ResourceType = 
  | 'food'                    // Produced by Moles, consumed by all
  | 'timber'                  // Produced by Moles, used by Badgers + Otters
  | 'fiber'                   // Produced by Moles, used by Otters + Scholars
  | 'protection_tokens'       // Produced by Badgers, defends against events
  | 'stability_tokens'        // Produced by Badgers, boosts Scholars/Otters efficiency
  | 'magic_crystals'          // Produced by Scholars, used by Otters and Projects
  | 'insight_tokens'          // Produced by Scholars, boosts efficiency of all factions
  | 'infrastructure_tokens'   // Produced by Otters, boosts other factions
  | 'project_progress'        // Produced by Otters, advances shared project (win condition)

/**
 * Faction system types from Game Design Document
 */
export type FactionSystemType = 'provisioner' | 'guardian' | 'mystic' | 'explorer'

/**
 * Resource production rules based on Game Design Document
 */
export const RESOURCE_PRODUCTION_RULES: Record<FactionSystemType, ResourceType[]> = {
  provisioner: ['food', 'timber', 'fiber'],              // Meadow Moles
  guardian: ['protection_tokens', 'stability_tokens'],    // Oakshield Badgers
  mystic: ['magic_crystals', 'insight_tokens'],          // Starling Scholars
  explorer: ['infrastructure_tokens', 'project_progress'] // River Otters
}

/**
 * Resource consumption rules based on Game Design Document
 */
export const RESOURCE_CONSUMPTION_RULES: Record<ResourceType, FactionSystemType[]> = {
  food: ['provisioner', 'guardian', 'mystic', 'explorer'], // All factions need food
  timber: ['guardian', 'explorer'],                         // Badgers (fortifications) + Otters (bridges)
  fiber: ['mystic', 'explorer'],                           // Scholars (scrolls) + Otters (sails, ropes)
  protection_tokens: [],                                    // Global defense resource
  stability_tokens: ['mystic', 'explorer'],                // Boosts Scholar rituals + Otter engineering
  magic_crystals: ['explorer', 'provisioner'],             // Otters use + Projects (via Moles?)
  insight_tokens: ['provisioner', 'guardian', 'mystic', 'explorer'], // Boosts all factions
  infrastructure_tokens: ['provisioner', 'guardian', 'mystic'], // Boosts other factions
  project_progress: []                                      // Global win condition resource
}

/**
 * Resources that contribute to global pools
 */
export const GLOBAL_POOL_RESOURCES: ResourceType[] = [
  'protection_tokens',      // Global defense against events
  'stability_tokens',       // Global stability pool
  'insight_tokens',         // Global efficiency boost
  'infrastructure_tokens',  // Global infrastructure boost
  'project_progress'        // Shared project advancement
]

/**
 * Validation result for resource operations
 */
export interface ResourceValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Resource adjustment parameters
 */
export interface ResourceAdjustment {
  sessionId: string
  factionId: string
  resourceType: ResourceType
  turnNumber: number
  delta: number  // Can be positive (add) or negative (subtract)
  reason?: string
  allowNegative?: boolean
}

/**
 * Resource transfer parameters
 */
export interface ResourceTransfer {
  sessionId: string
  fromFactionId: string
  toFactionId: string | 'global_pool'
  resourceType: ResourceType
  amount: number
  turnNumber: number
  reason?: string
}

/**
 * Resource query parameters
 */
export interface ResourceQuery {
  sessionId: string
  factionId?: string
  resourceType?: ResourceType
  turnNumber?: number
  includeHistory?: boolean
}

/**
 * Validate resource adjustment according to game rules
 */
export function validateResourceAdjustment(
  adjustment: ResourceAdjustment,
  currentResources: Resource[],
  factionSystemType: FactionSystemType
): ResourceValidationResult {
  const result: ResourceValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  }

  // Check if faction can produce this resource
  if (adjustment.delta > 0) {
    const canProduce = RESOURCE_PRODUCTION_RULES[factionSystemType].includes(adjustment.resourceType)
    if (!canProduce) {
      result.warnings.push(
        `${factionSystemType} faction typically doesn't produce ${adjustment.resourceType}`
      )
    }
  }

  // Check if adjustment would result in negative resources (unless explicitly allowed)
  if (adjustment.delta < 0 && !adjustment.allowNegative) {
    const currentResource = currentResources.find(
      r => r.faction_id === adjustment.factionId && 
           r.resource_type === adjustment.resourceType &&
           r.turn_number === adjustment.turnNumber
    )
    
    const currentQuantity = currentResource?.quantity || 0
    const newQuantity = currentQuantity + adjustment.delta
    
    if (newQuantity < 0) {
      result.valid = false
      result.errors.push(
        `Insufficient ${adjustment.resourceType}: has ${currentQuantity}, trying to subtract ${Math.abs(adjustment.delta)}`
      )
    }
  }

  // Validate turn number
  if (adjustment.turnNumber < 1) {
    result.valid = false
    result.errors.push('Turn number must be positive')
  }

  return result
}

/**
 * Validate resource transfer according to faction interdependency rules
 */
export function validateResourceTransfer(
  transfer: ResourceTransfer,
  fromFactionSystemType: FactionSystemType,
  toFactionSystemType?: FactionSystemType,
  currentResources: Resource[] = []
): ResourceValidationResult {
  const result: ResourceValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  }

  // Validate basic parameters
  if (transfer.amount <= 0) {
    result.valid = false
    result.errors.push('Transfer amount must be positive')
    return result
  }

  if (transfer.turnNumber < 1) {
    result.valid = false
    result.errors.push('Turn number must be positive')
    return result
  }

  // Check if source faction has sufficient resources
  const currentResource = currentResources.find(
    r => r.faction_id === transfer.fromFactionId && 
         r.resource_type === transfer.resourceType &&
         r.turn_number === transfer.turnNumber
  )
  
  const availableQuantity = currentResource?.quantity || 0
  if (availableQuantity < transfer.amount) {
    result.valid = false
    result.errors.push(
      `Insufficient ${transfer.resourceType}: has ${availableQuantity}, trying to transfer ${transfer.amount}`
    )
  }

  // Check if source faction typically produces this resource
  const canProduce = RESOURCE_PRODUCTION_RULES[fromFactionSystemType].includes(transfer.resourceType)
  if (!canProduce) {
    result.warnings.push(
      `${fromFactionSystemType} faction typically doesn't produce ${transfer.resourceType}`
    )
  }

  // For global pool transfers, allow any resource that contributes to global pools
  if (transfer.toFactionId === 'global_pool') {
    if (!GLOBAL_POOL_RESOURCES.includes(transfer.resourceType)) {
      result.valid = false
      result.errors.push(
        `${transfer.resourceType} does not contribute to global resource pools`
      )
    }
    return result
  }

  // Check if target faction can consume this resource
  if (toFactionSystemType) {
    const canConsume = RESOURCE_CONSUMPTION_RULES[transfer.resourceType].includes(toFactionSystemType)
    if (!canConsume && !GLOBAL_POOL_RESOURCES.includes(transfer.resourceType)) {
      result.warnings.push(
        `${toFactionSystemType} faction typically doesn't consume ${transfer.resourceType}`
      )
    }
  }

  return result
}

/**
 * Calculate food shortage penalty
 * All factions need food to avoid penalties
 */
export function calculateFoodShortagePenalty(
  foodQuantity: number,
  factionCount: number = 4
): number {
  const foodPerFaction = foodQuantity / factionCount
  
  // Penalty increases exponentially with shortage severity
  if (foodPerFaction >= 1) return 0      // No penalty with adequate food
  if (foodPerFaction >= 0.5) return 0.1  // Minor penalty with some food
  if (foodPerFaction >= 0.25) return 0.2 // Moderate penalty with little food
  return 0.5                             // Severe penalty with no food
}

/**
 * Calculate global stability bonus
 * Stability tokens boost Scholar and Otter efficiency
 */
export function calculateStabilityBonus(stabilityTokens: number): number {
  // Diminishing returns on stability bonus
  return Math.min(0.5, stabilityTokens * 0.1)
}

/**
 * Calculate global insight bonus
 * Insight tokens boost efficiency of all factions
 */
export function calculateInsightBonus(insightTokens: number): number {
  // Diminishing returns on insight bonus
  return Math.min(0.3, insightTokens * 0.05)
}

/**
 * Calculate infrastructure bonus
 * Infrastructure tokens boost other factions' production
 */
export function calculateInfrastructureBonus(infrastructureTokens: number): number {
  // Diminishing returns on infrastructure bonus
  return Math.min(0.4, infrastructureTokens * 0.08)
}

/**
 * Get default resource quantities for a new turn
 */
export function getDefaultResourceQuantities(): Record<ResourceType, number> {
  return {
    food: 0,
    timber: 0,
    fiber: 0,
    protection_tokens: 0,
    stability_tokens: 0,
    magic_crystals: 0,
    insight_tokens: 0,
    infrastructure_tokens: 0,
    project_progress: 0
  }
}

/**
 * Calculate resource efficiency modifiers based on global resources
 */
export interface ResourceEfficiencyModifiers {
  foodShortagePenalty: number
  stabilityBonus: number
  insightBonus: number
  infrastructureBonus: number
}

export function calculateResourceEfficiencyModifiers(
  globalResources: Record<ResourceType, number>
): ResourceEfficiencyModifiers {
  return {
    foodShortagePenalty: calculateFoodShortagePenalty(globalResources.food),
    stabilityBonus: calculateStabilityBonus(globalResources.stability_tokens),
    insightBonus: calculateInsightBonus(globalResources.insight_tokens),
    infrastructureBonus: calculateInfrastructureBonus(globalResources.infrastructure_tokens)
  }
}