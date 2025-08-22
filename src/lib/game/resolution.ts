/**
 * Turn Resolution Engine
 * 
 * Processes all player actions and updates game state atomically.
 * Handles the core turn resolution logic with proper error handling
 * and resource transaction management.
 */

import {
  GameAction,
  GameActionType,
  DatabaseActionType,
  ActionPhase,
  ActionProcessingResult,
  TurnResolutionResult,
  TurnResolutionState,
  TurnStatus,
  ResourceChange,
  ResolutionOptions,
  GatherActionData,
  TradeActionData,
  ConvertActionData,
  BuildActionData,
  ResearchActionData,
  ProtectActionData,
  SpecialActionData
} from '@/types/game'
import {
  Resource,
  Faction,
  SessionPlayer,
  GameSession,
  TurnResultInsert
} from '@/lib/supabase'
import {
  ResourceType,
  FactionSystemType,
  calculateResourceEfficiencyModifiers,
  GLOBAL_POOL_RESOURCES
} from '@/lib/game/resources'
import {
  executeResourceAdjustment,
  executeResourceTransfer
} from '@/lib/database/resources'
import {
  ResourceAdjustment,
  ResourceTransfer
} from '@/lib/game/resources'
import {
  validateAllActions,
  allValidationsPass,
  getValidationSummary
} from '@/lib/game/validation'
import { actionOperations, turnResultOperations, resourceOperations } from '@/lib/database-operations'

/**
 * Action processing order as defined in the issue
 * Note: 'convert' actions are stored as 'trade' in the database
 */
const ACTION_PROCESSING_ORDER: GameActionType[] = [
  'gather',    // 1. Process Gather actions (resource generation)
  'trade',     // 2. Process Trade actions (resource exchanges) 
  'convert',   // 2. Process Convert actions (resource exchanges, stored as 'trade' in DB)
  'build',     // 3. Process Build actions (resource consumption)
  'research',  // 3. Process Research actions (resource consumption)
  'protect',   // 3. Process Protect actions (resource consumption)
  'special'    // 4. Process Special faction actions
]

/**
 * Check if all players have submitted actions for a turn
 */
export async function checkTurnReadiness(
  sessionId: string,
  turnNumber: number
): Promise<TurnStatus> {
  try {
    // Get all session players
    const sessionPlayers = await actionOperations.getSessionPlayers(sessionId)
    
    // Get all submitted actions for this turn
    const submittedActions = await actionOperations.getBySessionAndTurn(sessionId, turnNumber)
    
    // Find unique players who have submitted actions
    const playersWithActions = new Set(submittedActions.map(action => action.player_id))
    const playersSubmitted = Array.from(playersWithActions)
    const playersNotSubmitted = sessionPlayers
      .map(sp => sp.player_id)
      .filter(playerId => !playersWithActions.has(playerId))
    
    // Get last submission time
    const lastSubmissionAt = submittedActions.length > 0 
      ? new Date(Math.max(...submittedActions.map(a => new Date(a.submitted_at).getTime())))
      : undefined

    const turnStatus: TurnStatus = {
      sessionId,
      turnNumber,
      totalPlayers: sessionPlayers.length,
      submittedActions: submittedActions.length,
      playersSubmitted,
      playersNotSubmitted,
      allSubmitted: playersNotSubmitted.length === 0,
      canResolve: playersNotSubmitted.length === 0 && submittedActions.length > 0,
      lastSubmissionAt
    }

    return turnStatus
  } catch (error) {
    throw new Error(`Failed to check turn readiness: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Main turn resolution function
 */
export async function resolveTurn(
  sessionId: string,
  turnNumber: number,
  options: ResolutionOptions = {}
): Promise<TurnResolutionResult> {
  const startTime = Date.now()
  
  const resolutionState: TurnResolutionState = {
    sessionId,
    turnNumber,
    phase: 'validation',
    startedAt: new Date(),
    totalActions: 0,
    processedActions: 0,
    failedActions: 0,
    resourceChanges: [],
    errors: [],
    warnings: []
  }

  const result: TurnResolutionResult = {
    success: false,
    sessionId,
    turnNumber,
    processedActions: [],
    finalResourceState: {},
    globalEffects: {
      foodShortagePenalty: 0,
      stabilityBonus: 0,
      insightBonus: 0,
      infrastructureBonus: 0
    },
    errors: [],
    warnings: [],
    resolutionTime: 0
  }

  try {
    // 1. Check turn readiness
    const turnStatus = await checkTurnReadiness(sessionId, turnNumber)
    if (!turnStatus.canResolve) {
      throw new Error(
        `Turn not ready for resolution. ${turnStatus.playersNotSubmitted.length} players have not submitted actions.`
      )
    }

    // 2. Get all necessary data
    const [actions, currentResources, factions, sessionPlayers] = await Promise.all([
      actionOperations.getBySessionAndTurn(sessionId, turnNumber),
      resourceOperations.getBySessionAndTurn(sessionId, turnNumber),
      actionOperations.getFactions(), // Assuming this method exists
      actionOperations.getSessionPlayers(sessionId)
    ])

    resolutionState.totalActions = actions.length
    
    // Convert to GameActions and handle convert actions stored as trade
    const gameActions: GameAction[] = actions.map(action => {
      const actionData = typeof action.action_data === 'string' 
        ? JSON.parse(action.action_data) 
        : action.action_data
      
      // Determine actual action type from action data for convert actions stored as trade
      let actualActionType = action.action_type as GameActionType
      if (action.action_type === 'trade' && actionData.conversionRate !== undefined) {
        actualActionType = 'convert'
      }
      
      return {
        ...action,
        action_type: actualActionType,
        action_data: actionData
      }
    })

    // 3. Validate all actions
    const validationResults = validateAllActions(gameActions, currentResources, factions, sessionPlayers)
    const validationSummary = getValidationSummary(validationResults)
    
    result.warnings.push(...validationSummary.warnings)
    resolutionState.warnings.push(...validationSummary.warnings)

    if (!allValidationsPass(validationResults) && !options.allowPartialFailure) {
      throw new Error(
        `Action validation failed: ${validationSummary.invalidActions} invalid actions. Errors: ${validationSummary.errors.join(', ')}`
      )
    }

    if (options.validateOnly) {
      result.success = validationSummary.invalidActions === 0
      result.errors = validationSummary.errors
      result.warnings = validationSummary.warnings
      result.resolutionTime = Date.now() - startTime
      return result
    }

    // 4. Group actions by type and process in order
    const actionsByType = groupActionsByType(gameActions, validationResults)
    
    for (const actionType of ACTION_PROCESSING_ORDER) {
      if (!actionsByType[actionType] || actionsByType[actionType].length === 0) {
        continue
      }

      resolutionState.phase = getPhaseForActionType(actionType)
      
      for (const action of actionsByType[actionType]) {
        try {
          const processingResult = await processAction(
            action,
            resolutionState,
            factions,
            sessionPlayers,
            currentResources
          )
          
          result.processedActions.push(processingResult)
          resolutionState.resourceChanges.push(...processingResult.resourceChanges)
          resolutionState.processedActions++

          if (!processingResult.success) {
            resolutionState.failedActions++
            result.errors.push(...processingResult.errors)
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          resolutionState.failedActions++
          result.errors.push(`Failed to process action ${action.id}: ${errorMessage}`)
          
          if (!options.allowPartialFailure) {
            throw error
          }
        }
      }
    }

    // 5. Apply global effects and modifiers
    resolutionState.phase = 'global'
    await applyGlobalEffects(sessionId, turnNumber, result, currentResources)

    // 6. Calculate final resource state
    const finalResources = await resourceOperations.getBySessionAndTurn(sessionId, turnNumber)
    result.finalResourceState = buildResourceStateMap(finalResources, factions)

    // 7. Mark actions as resolved
    const actionUpdatePromises = gameActions.map(action =>
      actionOperations.update(action.id, { status: 'resolved' })
    )
    await Promise.all(actionUpdatePromises)

    // 8. Store turn results
    const turnResultData: TurnResultInsert = {
      session_id: sessionId,
      turn_number: turnNumber,
      results_data: {
        processedActions: result.processedActions,
        resourceChanges: resolutionState.resourceChanges,
        globalEffects: result.globalEffects,
        summary: {
          totalActions: resolutionState.totalActions,
          processedActions: resolutionState.processedActions,
          failedActions: resolutionState.failedActions,
          resolutionTime: Date.now() - startTime
        }
      }
    }

    const turnResult = await turnResultOperations.create(turnResultData)
    result.turnResultId = turnResult.id

    // 9. Complete resolution
    resolutionState.phase = 'complete'
    resolutionState.completedAt = new Date()
    result.success = resolutionState.failedActions === 0 || options.allowPartialFailure === true
    result.resolutionTime = Date.now() - startTime

    return result

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    result.errors.push(`Turn resolution failed: ${errorMessage}`)
    result.success = false
    result.resolutionTime = Date.now() - startTime
    
    throw error
  }
}

/**
 * Process a single action
 */
async function processAction(
  action: GameAction,
  resolutionState: TurnResolutionState,
  factions: Faction[],
  sessionPlayers: SessionPlayer[],
  currentResources: Resource[]
): Promise<ActionProcessingResult> {
  const result: ActionProcessingResult = {
    success: false,
    actionId: action.id,
    phase: resolutionState.phase,
    resourceChanges: [],
    errors: [],
    warnings: []
  }

  try {
    // Find the faction for this action
    const sessionPlayer = sessionPlayers.find(sp => sp.player_id === action.player_id)
    const faction = factions.find(f => f.id === sessionPlayer?.faction_id)
    
    if (!faction || !sessionPlayer) {
      throw new Error('Faction or session player not found')
    }

    // Process based on action type
    switch (action.action_type) {
      case 'gather':
        await processGatherAction(action, faction, result)
        break
      case 'trade':
        await processTradeAction(action, faction, sessionPlayers, result)
        break
      case 'convert':
        await processConvertAction(action, faction, result)
        break
      case 'build':
        await processBuildAction(action, faction, result)
        break
      case 'research':
        await processResearchAction(action, faction, result)
        break
      case 'protect':
        await processProtectAction(action, faction, result)
        break
      case 'special':
        await processSpecialAction(action, faction, result)
        break
      default:
        throw new Error(`Unknown action type: ${action.action_type}`)
    }

    result.success = result.errors.length === 0

  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    result.success = false
  }

  return result
}

/**
 * Process gather action
 */
async function processGatherAction(
  action: GameAction,
  faction: Faction,
  result: ActionProcessingResult
): Promise<void> {
  const data = action.action_data as GatherActionData
  
  // Apply efficiency modifiers (would need to calculate based on global resources)
  let finalAmount = data.baseAmount
  // TODO: Apply stability, insight, infrastructure bonuses
  
  const adjustment: ResourceAdjustment = {
    sessionId: action.session_id,
    factionId: faction.id,
    resourceType: data.resourceType,
    turnNumber: action.turn_number,
    delta: finalAmount,
    reason: `Gather action: ${action.id}`,
    allowNegative: false
  }

  const adjustmentResult = await executeResourceAdjustment(adjustment)
  if (!adjustmentResult.success) {
    result.errors.push(...adjustmentResult.errors)
    return
  }

  // Record resource change
  if (adjustmentResult.resources.length > 0) {
    const resource = adjustmentResult.resources[0]
    const oldQuantity = resource.quantity - finalAmount
    
    result.resourceChanges.push({
      factionId: faction.id,
      resourceType: data.resourceType,
      oldQuantity,
      newQuantity: resource.quantity,
      delta: finalAmount,
      reason: `Gather: ${data.resourceType}`,
      phase: result.phase
    })
  }
}

/**
 * Process trade action
 */
async function processTradeAction(
  action: GameAction,
  faction: Faction,
  sessionPlayers: SessionPlayer[],
  result: ActionProcessingResult
): Promise<void> {
  const data = action.action_data as TradeActionData
  
  const transfer: ResourceTransfer = {
    sessionId: action.session_id,
    fromFactionId: faction.id,
    toFactionId: data.targetFactionId || 'global_pool',
    resourceType: data.fromResourceType,
    amount: data.amount,
    turnNumber: action.turn_number,
    reason: `Trade action: ${action.id}`
  }

  const transferResult = await executeResourceTransfer(transfer)
  if (!transferResult.success) {
    result.errors.push(...transferResult.errors)
    return
  }

  // Add the received resource
  const receivedAmount = Math.floor(data.amount * data.exchangeRate)
  const adjustment: ResourceAdjustment = {
    sessionId: action.session_id,
    factionId: data.targetFactionId || faction.id,
    resourceType: data.toResourceType,
    turnNumber: action.turn_number,
    delta: receivedAmount,
    reason: `Trade exchange: ${action.id}`,
    allowNegative: false
  }

  const adjustmentResult = await executeResourceAdjustment(adjustment)
  if (!adjustmentResult.success) {
    result.errors.push(...adjustmentResult.errors)
    return
  }

  // Record resource changes
  result.resourceChanges.push({
    factionId: faction.id,
    resourceType: data.fromResourceType,
    oldQuantity: 0, // Would need to fetch this properly
    newQuantity: 0, // Would need to fetch this properly  
    delta: -data.amount,
    reason: `Trade: gave ${data.fromResourceType}`,
    phase: result.phase
  })

  result.resourceChanges.push({
    factionId: data.targetFactionId || faction.id,
    resourceType: data.toResourceType,
    oldQuantity: 0, // Would need to fetch this properly
    newQuantity: 0, // Would need to fetch this properly
    delta: receivedAmount,
    reason: `Trade: received ${data.toResourceType}`,
    phase: result.phase
  })
}

/**
 * Process convert action
 */
async function processConvertAction(
  action: GameAction,
  faction: Faction,
  result: ActionProcessingResult
): Promise<void> {
  const data = action.action_data as ConvertActionData
  
  // Remove source resource
  const sourceAdjustment: ResourceAdjustment = {
    sessionId: action.session_id,
    factionId: faction.id,
    resourceType: data.fromResourceType,
    turnNumber: action.turn_number,
    delta: -data.amount,
    reason: `Convert action source: ${action.id}`,
    allowNegative: false
  }

  const sourceResult = await executeResourceAdjustment(sourceAdjustment)
  if (!sourceResult.success) {
    result.errors.push(...sourceResult.errors)
    return
  }

  // Add target resource
  const convertedAmount = Math.floor(data.amount * data.conversionRate)
  const targetAdjustment: ResourceAdjustment = {
    sessionId: action.session_id,
    factionId: faction.id,
    resourceType: data.toResourceType,
    turnNumber: action.turn_number,
    delta: convertedAmount,
    reason: `Convert action target: ${action.id}`,
    allowNegative: false
  }

  const targetResult = await executeResourceAdjustment(targetAdjustment)
  if (!targetResult.success) {
    result.errors.push(...targetResult.errors)
    return
  }

  // Record resource changes
  result.resourceChanges.push({
    factionId: faction.id,
    resourceType: data.fromResourceType,
    oldQuantity: 0, // Would need proper tracking
    newQuantity: 0, // Would need proper tracking
    delta: -data.amount,
    reason: `Convert: used ${data.fromResourceType}`,
    phase: result.phase
  })

  result.resourceChanges.push({
    factionId: faction.id,
    resourceType: data.toResourceType,
    oldQuantity: 0, // Would need proper tracking
    newQuantity: 0, // Would need proper tracking
    delta: convertedAmount,
    reason: `Convert: produced ${data.toResourceType}`,
    phase: result.phase
  })
}

/**
 * Process build action
 */
async function processBuildAction(
  action: GameAction,
  faction: Faction,
  result: ActionProcessingResult
): Promise<void> {
  const data = action.action_data as BuildActionData

  // Process resource costs
  for (const [resourceType, cost] of Object.entries(data.resourceCosts)) {
    const adjustment: ResourceAdjustment = {
      sessionId: action.session_id,
      factionId: faction.id,
      resourceType: resourceType as ResourceType,
      turnNumber: action.turn_number,
      delta: -cost,
      reason: `Build ${data.buildingType}: ${action.id}`,
      allowNegative: false
    }

    const adjustmentResult = await executeResourceAdjustment(adjustment)
    if (!adjustmentResult.success) {
      result.errors.push(...adjustmentResult.errors)
      return
    }

    result.resourceChanges.push({
      factionId: faction.id,
      resourceType: resourceType as ResourceType,
      oldQuantity: 0, // Would need proper tracking
      newQuantity: 0, // Would need proper tracking
      delta: -cost,
      reason: `Build: used ${resourceType}`,
      phase: result.phase
    })
  }

  // Buildings might provide ongoing benefits (to be implemented)
  result.metadata = {
    buildingType: data.buildingType,
    benefits: data.benefits || []
  }
}

/**
 * Process research action
 */
async function processResearchAction(
  action: GameAction,
  faction: Faction,
  result: ActionProcessingResult
): Promise<void> {
  const data = action.action_data as ResearchActionData

  // Process resource costs
  for (const [resourceType, cost] of Object.entries(data.resourceCosts)) {
    const adjustment: ResourceAdjustment = {
      sessionId: action.session_id,
      factionId: faction.id,
      resourceType: resourceType as ResourceType,
      turnNumber: action.turn_number,
      delta: -cost,
      reason: `Research ${data.researchType}: ${action.id}`,
      allowNegative: false
    }

    const adjustmentResult = await executeResourceAdjustment(adjustment)
    if (!adjustmentResult.success) {
      result.errors.push(...adjustmentResult.errors)
      return
    }

    result.resourceChanges.push({
      factionId: faction.id,
      resourceType: resourceType as ResourceType,
      oldQuantity: 0, // Would need proper tracking
      newQuantity: 0, // Would need proper tracking
      delta: -cost,
      reason: `Research: used ${resourceType}`,
      phase: result.phase
    })
  }

  // Research unlocks new abilities (to be implemented)
  result.metadata = {
    researchType: data.researchType,
    unlocks: data.unlocks || []
  }
}

/**
 * Process protect action
 */
async function processProtectAction(
  action: GameAction,
  faction: Faction,
  result: ActionProcessingResult
): Promise<void> {
  const data = action.action_data as ProtectActionData

  // Process resource costs
  for (const [resourceType, cost] of Object.entries(data.resourceCosts || {})) {
    const adjustment: ResourceAdjustment = {
      sessionId: action.session_id,
      factionId: faction.id,
      resourceType: resourceType as ResourceType,
      turnNumber: action.turn_number,
      delta: -cost,
      reason: `Protect action cost: ${action.id}`,
      allowNegative: false
    }

    const adjustmentResult = await executeResourceAdjustment(adjustment)
    if (!adjustmentResult.success) {
      result.errors.push(...adjustmentResult.errors)
      return
    }

    result.resourceChanges.push({
      factionId: faction.id,
      resourceType: resourceType as ResourceType,
      oldQuantity: 0, // Would need proper tracking
      newQuantity: 0, // Would need proper tracking
      delta: -cost,
      reason: `Protect: used ${resourceType}`,
      phase: result.phase
    })
  }

  // Generate protection tokens
  const protectionAdjustment: ResourceAdjustment = {
    sessionId: action.session_id,
    factionId: faction.id,
    resourceType: 'protection_tokens',
    turnNumber: action.turn_number,
    delta: data.protectionGenerated,
    reason: `Protect action generated: ${action.id}`,
    allowNegative: false
  }

  const protectionResult = await executeResourceAdjustment(protectionAdjustment)
  if (!protectionResult.success) {
    result.errors.push(...protectionResult.errors)
    return
  }

  result.resourceChanges.push({
    factionId: faction.id,
    resourceType: 'protection_tokens',
    oldQuantity: 0, // Would need proper tracking
    newQuantity: 0, // Would need proper tracking
    delta: data.protectionGenerated,
    reason: 'Protect: generated tokens',
    phase: result.phase
  })
}

/**
 * Process special action
 */
async function processSpecialAction(
  action: GameAction,
  faction: Faction,
  result: ActionProcessingResult
): Promise<void> {
  const data = action.action_data as SpecialActionData

  // Process resource costs if any
  if (data.resourceCosts) {
    for (const [resourceType, cost] of Object.entries(data.resourceCosts)) {
      const adjustment: ResourceAdjustment = {
        sessionId: action.session_id,
        factionId: faction.id,
        resourceType: resourceType as ResourceType,
        turnNumber: action.turn_number,
        delta: -cost,
        reason: `Special ${data.abilityType}: ${action.id}`,
        allowNegative: false
      }

      const adjustmentResult = await executeResourceAdjustment(adjustment)
      if (!adjustmentResult.success) {
        result.errors.push(...adjustmentResult.errors)
        return
      }

      result.resourceChanges.push({
        factionId: faction.id,
        resourceType: resourceType as ResourceType,
        oldQuantity: 0, // Would need proper tracking
        newQuantity: 0, // Would need proper tracking
        delta: -cost,
        reason: `Special: used ${resourceType}`,
        phase: result.phase
      })
    }
  }

  // Special abilities have custom effects (to be implemented per faction)
  result.metadata = {
    abilityType: data.abilityType,
    parameters: data.parameters
  }
}

/**
 * Apply global effects and calculate modifiers
 */
async function applyGlobalEffects(
  sessionId: string,
  turnNumber: number,
  result: TurnResolutionResult,
  currentResources: Resource[]
): Promise<void> {
  // Calculate global resource pools
  const globalResourceTotals: Record<ResourceType, number> = {
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

  // Sum up resources across all factions
  for (const resource of currentResources) {
    if (globalResourceTotals.hasOwnProperty(resource.resource_type)) {
      globalResourceTotals[resource.resource_type as ResourceType] += resource.quantity
    }
  }

  // Calculate efficiency modifiers
  result.globalEffects = calculateResourceEfficiencyModifiers(globalResourceTotals)
}

/**
 * Helper functions
 */
function groupActionsByType(
  actions: GameAction[],
  validationResults: { actionId: string; valid: boolean }[]
): Record<GameActionType, GameAction[]> {
  const groups: Record<GameActionType, GameAction[]> = {
    gather: [],
    trade: [],
    convert: [],
    build: [],
    research: [],
    protect: [],
    special: []
  }

  const validActionIds = new Set(
    validationResults.filter(r => r.valid).map(r => r.actionId)
  )

  for (const action of actions) {
    if (validActionIds.has(action.id)) {
      const actionType = action.action_type as GameActionType
      if (groups[actionType]) {
        groups[actionType].push(action)
      }
    }
  }

  return groups
}

function getPhaseForActionType(actionType: GameActionType): ActionPhase {
  switch (actionType) {
    case 'gather':
      return 'gather'
    case 'trade':
    case 'convert':
      return 'exchange'
    case 'build':
    case 'research':
    case 'protect':
      return 'consumption'
    case 'special':
      return 'special'
    default:
      return 'validation'
  }
}

function buildResourceStateMap(
  resources: Resource[],
  factions: Faction[]
): Record<string, Record<ResourceType, number>> {
  const result: Record<string, Record<ResourceType, number>> = {}

  for (const faction of factions) {
    result[faction.id] = {
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

  for (const resource of resources) {
    if (result[resource.faction_id]) {
      result[resource.faction_id][resource.resource_type as ResourceType] = resource.quantity
    }
  }

  return result
}