/**
 * Turn Results Processing Utilities
 * 
 * Helper functions for processing and formatting turn results data
 * for display in the UI components.
 */

import { TurnResult } from '@/lib/supabase'
import { ResourceType } from '@/lib/game/resources'
import { ActionProcessingResult, ResourceChange } from '@/types/game'

export interface ProcessedTurnResults {
  id: string
  sessionId: string
  turnNumber: number
  resolvedAt: string
  resourceChanges: ProcessedResourceChange[]
  actionOutcomes: ProcessedActionOutcome[]
  globalEffects: GlobalEffectsSummary
  factionInteractions: FactionInteraction[]
  summary: TurnSummary
}

export interface ProcessedResourceChange {
  factionId: string
  factionName?: string
  resourceType: ResourceType
  resourceName: string
  oldQuantity: number
  newQuantity: number
  delta: number
  deltaFormatted: string
  reason: string
  phase: string
  isPositive: boolean
}

export interface ProcessedActionOutcome {
  actionId: string
  actionType: string
  actionTypeFormatted: string
  success: boolean
  factionId?: string
  factionName?: string
  resourceCosts: ProcessedResourceChange[]
  resourceGains: ProcessedResourceChange[]
  effects: string[]
  errors: string[]
  warnings: string[]
  metadata?: Record<string, any>
}

export interface GlobalEffectsSummary {
  foodShortagePenalty: number
  stabilityBonus: number
  insightBonus: number
  infrastructureBonus: number
  activeEffects: string[]
  effectDescriptions: Record<string, string>
}

export interface FactionInteraction {
  type: 'trade' | 'support' | 'cooperation'
  fromFaction: string
  toFaction: string
  resource?: ResourceType
  amount?: number
  description: string
}

export interface TurnSummary {
  totalActions: number
  successfulActions: number
  failedActions: number
  resourcesGenerated: number
  resourcesConsumed: number
  factionsActive: number
  resolutionTime: number
  resolutionTimeFormatted: string
}

/**
 * Process raw turn results data into a structured format for UI display
 */
export function processTurnResults(
  turnResult: TurnResult,
  factions?: Record<string, { name: string; id: string }>
): ProcessedTurnResults {
  const resultsData = turnResult.results_data || {}
  const processedActions = resultsData.processedActions || []
  const resourceChanges = resultsData.resourceChanges || []
  const globalEffects = resultsData.globalEffects || {}
  const summary = resultsData.summary || {}

  return {
    id: turnResult.id,
    sessionId: turnResult.session_id,
    turnNumber: turnResult.turn_number,
    resolvedAt: turnResult.resolved_at,
    resourceChanges: processResourceChanges(resourceChanges, factions),
    actionOutcomes: processActionOutcomes(processedActions, factions),
    globalEffects: processGlobalEffects(globalEffects),
    factionInteractions: extractFactionInteractions(processedActions, resourceChanges),
    summary: processTurnSummary(summary, processedActions, resourceChanges)
  }
}

/**
 * Process resource changes with formatting and faction names
 */
function processResourceChanges(
  changes: ResourceChange[],
  factions?: Record<string, { name: string; id: string }>
): ProcessedResourceChange[] {
  return changes.map(change => ({
    factionId: change.factionId,
    factionName: factions?.[change.factionId]?.name || 'Unknown Faction',
    resourceType: change.resourceType,
    resourceName: formatResourceName(change.resourceType),
    oldQuantity: change.oldQuantity,
    newQuantity: change.newQuantity,
    delta: change.delta,
    deltaFormatted: change.delta >= 0 ? `+${change.delta}` : `${change.delta}`,
    reason: change.reason,
    phase: change.phase,
    isPositive: change.delta > 0
  }))
}

/**
 * Process action outcomes with enhanced formatting
 */
function processActionOutcomes(
  outcomes: ActionProcessingResult[],
  factions?: Record<string, { name: string; id: string }>
): ProcessedActionOutcome[] {
  return outcomes.map(outcome => {
    const resourceCosts = outcome.resourceChanges
      .filter(rc => rc.delta < 0)
      .map(rc => processResourceChange(rc, factions))
    
    const resourceGains = outcome.resourceChanges
      .filter(rc => rc.delta > 0)
      .map(rc => processResourceChange(rc, factions))

    return {
      actionId: outcome.actionId,
      actionType: outcome.phase,
      actionTypeFormatted: formatActionType(outcome.phase),
      success: outcome.success,
      factionId: outcome.resourceChanges[0]?.factionId,
      factionName: outcome.resourceChanges[0]?.factionId 
        ? factions?.[outcome.resourceChanges[0].factionId]?.name || 'Unknown'
        : undefined,
      resourceCosts,
      resourceGains,
      effects: extractEffects(outcome),
      errors: outcome.errors,
      warnings: outcome.warnings,
      metadata: outcome.metadata
    }
  })
}

/**
 * Process a single resource change
 */
function processResourceChange(
  change: ResourceChange,
  factions?: Record<string, { name: string; id: string }>
): ProcessedResourceChange {
  return {
    factionId: change.factionId,
    factionName: factions?.[change.factionId]?.name || 'Unknown Faction',
    resourceType: change.resourceType,
    resourceName: formatResourceName(change.resourceType),
    oldQuantity: change.oldQuantity,
    newQuantity: change.newQuantity,
    delta: change.delta,
    deltaFormatted: change.delta >= 0 ? `+${change.delta}` : `${change.delta}`,
    reason: change.reason,
    phase: change.phase,
    isPositive: change.delta > 0
  }
}

/**
 * Process global effects into a summary format
 */
function processGlobalEffects(effects: any): GlobalEffectsSummary {
  const activeEffects: string[] = []
  const effectDescriptions: Record<string, string> = {}

  if (effects.foodShortagePenalty > 0) {
    activeEffects.push('Food Shortage Penalty')
    effectDescriptions['Food Shortage Penalty'] = `All factions suffer -${effects.foodShortagePenalty} to resource efficiency`
  }

  if (effects.stabilityBonus > 0) {
    activeEffects.push('Stability Bonus')
    effectDescriptions['Stability Bonus'] = `All factions gain +${effects.stabilityBonus} to protection actions`
  }

  if (effects.insightBonus > 0) {
    activeEffects.push('Insight Bonus')
    effectDescriptions['Insight Bonus'] = `Research actions are ${effects.insightBonus}% more effective`
  }

  if (effects.infrastructureBonus > 0) {
    activeEffects.push('Infrastructure Bonus')
    effectDescriptions['Infrastructure Bonus'] = `Building actions cost ${effects.infrastructureBonus}% fewer resources`
  }

  return {
    foodShortagePenalty: effects.foodShortagePenalty || 0,
    stabilityBonus: effects.stabilityBonus || 0,
    insightBonus: effects.insightBonus || 0,
    infrastructureBonus: effects.infrastructureBonus || 0,
    activeEffects,
    effectDescriptions
  }
}

/**
 * Extract faction interactions from processed actions and resource changes
 */
function extractFactionInteractions(
  outcomes: ActionProcessingResult[],
  changes: ResourceChange[]
): FactionInteraction[] {
  const interactions: FactionInteraction[] = []

  // Look for trade interactions (resource transfers between factions)
  const tradeActions = outcomes.filter(o => o.phase === 'exchange')
  
  tradeActions.forEach(action => {
    // This is a simplified extraction - in a real implementation,
    // you'd parse the action metadata to determine trade partners
    if (action.metadata?.targetFactionId) {
      interactions.push({
        type: 'trade',
        fromFaction: action.resourceChanges[0]?.factionId || '',
        toFaction: action.metadata.targetFactionId,
        resource: action.resourceChanges[0]?.resourceType,
        amount: Math.abs(action.resourceChanges[0]?.delta || 0),
        description: `Resource exchange between factions`
      })
    }
  })

  return interactions
}

/**
 * Process turn summary statistics
 */
function processTurnSummary(
  summary: any,
  outcomes: ActionProcessingResult[],
  changes: ResourceChange[]
): TurnSummary {
  const resourcesGenerated = changes
    .filter(c => c.delta > 0)
    .reduce((sum, c) => sum + c.delta, 0)
  
  const resourcesConsumed = changes
    .filter(c => c.delta < 0)
    .reduce((sum, c) => sum + Math.abs(c.delta), 0)

  const uniqueFactions = new Set(changes.map(c => c.factionId)).size

  return {
    totalActions: summary.totalActions || 0,
    successfulActions: (summary.totalActions || 0) - (summary.failedActions || 0),
    failedActions: summary.failedActions || 0,
    resourcesGenerated,
    resourcesConsumed,
    factionsActive: uniqueFactions,
    resolutionTime: summary.resolutionTime || 0,
    resolutionTimeFormatted: formatDuration(summary.resolutionTime || 0)
  }
}

/**
 * Format resource type names for display
 */
function formatResourceName(resourceType: ResourceType): string {
  return resourceType.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format action type names for display
 */
function formatActionType(actionType: string): string {
  return actionType.charAt(0).toUpperCase() + actionType.slice(1)
}

/**
 * Extract effects from action outcome metadata
 */
function extractEffects(outcome: ActionProcessingResult): string[] {
  const effects: string[] = []
  
  if (outcome.metadata?.effects) {
    effects.push(...outcome.metadata.effects)
  }
  
  if (outcome.resourceChanges.length > 0) {
    const gainedResources = outcome.resourceChanges
      .filter(rc => rc.delta > 0)
      .map(rc => `+${rc.delta} ${formatResourceName(rc.resourceType)}`)
    effects.push(...gainedResources)
  }
  
  return effects
}

/**
 * Format duration in milliseconds to human-readable format
 */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`
  } else {
    return `${(ms / 60000).toFixed(1)}m`
  }
}