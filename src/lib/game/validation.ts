/**
 * Action Validation Functions
 * 
 * Validates player actions before processing during turn resolution.
 * Ensures actions are valid according to game rules and resource availability.
 */

import { 
  GameAction, 
  GameActionType, 
  ActionData,
  ActionValidationResult,
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
  SessionPlayer 
} from '@/lib/supabase'
import { 
  ResourceType,
  FactionSystemType,
  RESOURCE_PRODUCTION_RULES,
  RESOURCE_CONSUMPTION_RULES,
  GLOBAL_POOL_RESOURCES,
  validateResourceTransfer
} from '@/lib/game/resources'

/**
 * Faction ability definitions
 */
const FACTION_ABILITIES: Record<FactionSystemType, string[]> = {
  provisioner: ['craft_tools', 'fertility_ritual', 'harvest_bonus'],
  guardian: ['fortify', 'patrol', 'emergency_defense'],
  mystic: ['enchant', 'divination', 'magical_research'],
  explorer: ['scout', 'trade_route', 'engineering_feat']
}

/**
 * Building types and their requirements
 */
const BUILDING_TYPES: Record<string, { 
  costs: Partial<Record<ResourceType, number>>, 
  factions: FactionSystemType[] 
}> = {
  farm: { 
    costs: { food: 1, timber: 2 }, 
    factions: ['provisioner'] 
  },
  workshop: { 
    costs: { timber: 2, fiber: 1 }, 
    factions: ['provisioner'] 
  },
  watchtower: { 
    costs: { timber: 3, protection_tokens: 1 }, 
    factions: ['guardian'] 
  },
  barracks: { 
    costs: { food: 2, timber: 2, protection_tokens: 2 }, 
    factions: ['guardian'] 
  },
  library: { 
    costs: { fiber: 2, magic_crystals: 1 }, 
    factions: ['mystic'] 
  },
  observatory: { 
    costs: { timber: 1, fiber: 1, magic_crystals: 2 }, 
    factions: ['mystic'] 
  },
  bridge: { 
    costs: { timber: 3, infrastructure_tokens: 1 }, 
    factions: ['explorer'] 
  },
  dock: { 
    costs: { timber: 2, fiber: 1, infrastructure_tokens: 1 }, 
    factions: ['explorer'] 
  }
}

/**
 * Research types and their requirements
 */
const RESEARCH_TYPES: Record<string, { 
  costs: Partial<Record<ResourceType, number>>, 
  factions: FactionSystemType[] 
}> = {
  agriculture: { 
    costs: { food: 1, insight_tokens: 1 }, 
    factions: ['provisioner'] 
  },
  fortification: { 
    costs: { protection_tokens: 2, insight_tokens: 1 }, 
    factions: ['guardian'] 
  },
  enchantment: { 
    costs: { magic_crystals: 2, insight_tokens: 1 }, 
    factions: ['mystic'] 
  },
  engineering: { 
    costs: { infrastructure_tokens: 2, insight_tokens: 1 }, 
    factions: ['explorer'] 
  }
}

/**
 * Validate a single action
 */
export function validateAction(
  action: GameAction,
  currentResources: Resource[],
  factionData: Faction,
  sessionPlayers: SessionPlayer[]
): ActionValidationResult {
  const result: ActionValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    actionId: action.id,
    actionType: action.action_type as GameActionType
  }

  // Basic validation
  if (!action.action_data) {
    result.valid = false
    result.errors.push('Action data is missing')
    return result
  }

  // Validate based on action type
  switch (action.action_type) {
    case 'gather':
      return validateGatherAction(action, currentResources, factionData, result)
    case 'trade':
      return validateTradeAction(action, currentResources, factionData, sessionPlayers, result)
    case 'convert':
      return validateConvertAction(action, currentResources, factionData, result)
    case 'build':
      return validateBuildAction(action, currentResources, factionData, result)
    case 'research':
      return validateResearchAction(action, currentResources, factionData, result)
    case 'protect':
      return validateProtectAction(action, currentResources, factionData, result)
    case 'special':
      return validateSpecialAction(action, currentResources, factionData, result)
    default:
      result.valid = false
      result.errors.push(`Unknown action type: ${action.action_type}`)
      return result
  }
}

/**
 * Validate gather action
 */
function validateGatherAction(
  action: GameAction,
  currentResources: Resource[],
  factionData: Faction,
  result: ActionValidationResult
): ActionValidationResult {
  const data = action.action_data as GatherActionData
  const factionSystemType = factionData.system_type as FactionSystemType

  // Check if faction can produce this resource
  if (!RESOURCE_PRODUCTION_RULES[factionSystemType].includes(data.resourceType)) {
    result.valid = false
    result.errors.push(
      `${factionSystemType} faction cannot produce ${data.resourceType}`
    )
  }

  // Validate amount
  if (data.baseAmount <= 0) {
    result.valid = false
    result.errors.push('Gather amount must be positive')
  }

  return result
}

/**
 * Validate trade action
 */
function validateTradeAction(
  action: GameAction,
  currentResources: Resource[],
  factionData: Faction,
  sessionPlayers: SessionPlayer[],
  result: ActionValidationResult
): ActionValidationResult {
  const data = action.action_data as TradeActionData
  const factionSystemType = factionData.system_type as FactionSystemType

  // Check resource availability
  const currentResource = currentResources.find(
    r => r.faction_id === factionData.id && 
         r.resource_type === data.fromResourceType &&
         r.turn_number === action.turn_number
  )
  
  const availableQuantity = currentResource?.quantity || 0
  if (availableQuantity < data.amount) {
    result.valid = false
    result.errors.push(
      `Insufficient ${data.fromResourceType}: has ${availableQuantity}, needs ${data.amount}`
    )
  }

  // Validate exchange rate
  if (data.exchangeRate <= 0) {
    result.valid = false
    result.errors.push('Exchange rate must be positive')
  }

  // If trading with another faction, validate target exists
  if (data.targetFactionId) {
    const targetPlayer = sessionPlayers.find(sp => sp.faction_id === data.targetFactionId)
    if (!targetPlayer) {
      result.valid = false
      result.errors.push('Target faction not found in session')
    }
  }

  return result
}

/**
 * Validate convert action
 */
function validateConvertAction(
  action: GameAction,
  currentResources: Resource[],
  factionData: Faction,
  result: ActionValidationResult
): ActionValidationResult {
  const data = action.action_data as ConvertActionData
  const factionSystemType = factionData.system_type as FactionSystemType

  // Check resource availability
  const currentResource = currentResources.find(
    r => r.faction_id === factionData.id && 
         r.resource_type === data.fromResourceType &&
         r.turn_number === action.turn_number
  )
  
  const availableQuantity = currentResource?.quantity || 0
  if (availableQuantity < data.amount) {
    result.valid = false
    result.errors.push(
      `Insufficient ${data.fromResourceType}: has ${availableQuantity}, needs ${data.amount}`
    )
  }

  // Validate conversion rate
  if (data.conversionRate <= 0) {
    result.valid = false
    result.errors.push('Conversion rate must be positive')
  }

  // Check if faction can typically produce the target resource
  if (!RESOURCE_PRODUCTION_RULES[factionSystemType].includes(data.toResourceType)) {
    result.warnings.push(
      `${factionSystemType} faction typically doesn't produce ${data.toResourceType}`
    )
  }

  return result
}

/**
 * Validate build action
 */
function validateBuildAction(
  action: GameAction,
  currentResources: Resource[],
  factionData: Faction,
  result: ActionValidationResult
): ActionValidationResult {
  const data = action.action_data as BuildActionData
  const factionSystemType = factionData.system_type as FactionSystemType

  // Validate building type
  const buildingDef = BUILDING_TYPES[data.buildingType]
  if (!buildingDef) {
    result.valid = false
    result.errors.push(`Unknown building type: ${data.buildingType}`)
    return result
  }

  // Check if faction can build this type
  if (!buildingDef.factions.includes(factionSystemType)) {
    result.valid = false
    result.errors.push(
      `${factionSystemType} faction cannot build ${data.buildingType}`
    )
  }

  // Check resource costs
  for (const [resourceType, cost] of Object.entries(data.resourceCosts)) {
    const currentResource = currentResources.find(
      r => r.faction_id === factionData.id && 
           r.resource_type === resourceType &&
           r.turn_number === action.turn_number
    )
    
    const availableQuantity = currentResource?.quantity || 0
    if (availableQuantity < cost) {
      result.valid = false
      result.errors.push(
        `Insufficient ${resourceType}: has ${availableQuantity}, needs ${cost}`
      )
    }
  }

  return result
}

/**
 * Validate research action
 */
function validateResearchAction(
  action: GameAction,
  currentResources: Resource[],
  factionData: Faction,
  result: ActionValidationResult
): ActionValidationResult {
  const data = action.action_data as ResearchActionData
  const factionSystemType = factionData.system_type as FactionSystemType

  // Validate research type
  const researchDef = RESEARCH_TYPES[data.researchType]
  if (!researchDef) {
    result.valid = false
    result.errors.push(`Unknown research type: ${data.researchType}`)
    return result
  }

  // Check if faction can research this type
  if (!researchDef.factions.includes(factionSystemType)) {
    result.valid = false
    result.errors.push(
      `${factionSystemType} faction cannot research ${data.researchType}`
    )
  }

  // Check resource costs
  for (const [resourceType, cost] of Object.entries(data.resourceCosts)) {
    const currentResource = currentResources.find(
      r => r.faction_id === factionData.id && 
           r.resource_type === resourceType &&
           r.turn_number === action.turn_number
    )
    
    const availableQuantity = currentResource?.quantity || 0
    if (availableQuantity < cost) {
      result.valid = false
      result.errors.push(
        `Insufficient ${resourceType}: has ${availableQuantity}, needs ${cost}`
      )
    }
  }

  return result
}

/**
 * Validate protect action
 */
function validateProtectAction(
  action: GameAction,
  currentResources: Resource[],
  factionData: Faction,
  result: ActionValidationResult
): ActionValidationResult {
  const data = action.action_data as ProtectActionData
  const factionSystemType = factionData.system_type as FactionSystemType

  // Only Guardian faction can typically perform protect actions effectively
  if (factionSystemType !== 'guardian') {
    result.warnings.push(
      `${factionSystemType} faction is less effective at protection actions`
    )
  }

  // Check resource costs
  for (const [resourceType, cost] of Object.entries(data.resourceCosts || {})) {
    const currentResource = currentResources.find(
      r => r.faction_id === factionData.id && 
           r.resource_type === resourceType &&
           r.turn_number === action.turn_number
    )
    
    const availableQuantity = currentResource?.quantity || 0
    if (availableQuantity < cost) {
      result.valid = false
      result.errors.push(
        `Insufficient ${resourceType}: has ${availableQuantity}, needs ${cost}`
      )
    }
  }

  // Validate protection generation
  if (data.protectionGenerated <= 0) {
    result.valid = false
    result.errors.push('Protection generation must be positive')
  }

  return result
}

/**
 * Validate special action
 */
function validateSpecialAction(
  action: GameAction,
  currentResources: Resource[],
  factionData: Faction,
  result: ActionValidationResult
): ActionValidationResult {
  const data = action.action_data as SpecialActionData
  const factionSystemType = factionData.system_type as FactionSystemType

  // Check if faction has this ability
  if (!FACTION_ABILITIES[factionSystemType].includes(data.abilityType)) {
    result.valid = false
    result.errors.push(
      `${factionSystemType} faction does not have ability: ${data.abilityType}`
    )
  }

  // Check resource costs if any
  if (data.resourceCosts) {
    for (const [resourceType, cost] of Object.entries(data.resourceCosts)) {
      const currentResource = currentResources.find(
        r => r.faction_id === factionData.id && 
             r.resource_type === resourceType &&
             r.turn_number === action.turn_number
      )
      
      const availableQuantity = currentResource?.quantity || 0
      if (availableQuantity < cost) {
        result.valid = false
        result.errors.push(
          `Insufficient ${resourceType}: has ${availableQuantity}, needs ${cost}`
        )
      }
    }
  }

  return result
}

/**
 * Validate all actions for a turn
 */
export function validateAllActions(
  actions: GameAction[],
  currentResources: Resource[],
  factions: Faction[],
  sessionPlayers: SessionPlayer[]
): ActionValidationResult[] {
  const results: ActionValidationResult[] = []
  
  for (const action of actions) {
    // Find the faction for this action's player
    const sessionPlayer = sessionPlayers.find(sp => sp.player_id === action.player_id)
    if (!sessionPlayer) {
      results.push({
        valid: false,
        errors: ['Player not found in session'],
        warnings: [],
        actionId: action.id,
        actionType: action.action_type as GameActionType
      })
      continue
    }

    const faction = factions.find(f => f.id === sessionPlayer.faction_id)
    if (!faction) {
      results.push({
        valid: false,
        errors: ['Faction not found'],
        warnings: [],
        actionId: action.id,
        actionType: action.action_type as GameActionType
      })
      continue
    }

    const result = validateAction(action, currentResources, faction, sessionPlayers)
    results.push(result)
  }

  return results
}

/**
 * Check if all validation results are valid
 */
export function allValidationsPass(validationResults: ActionValidationResult[]): boolean {
  return validationResults.every(result => result.valid)
}

/**
 * Get summary of validation failures
 */
export function getValidationSummary(validationResults: ActionValidationResult[]): {
  totalActions: number
  validActions: number
  invalidActions: number
  totalErrors: number
  totalWarnings: number
  errors: string[]
  warnings: string[]
} {
  const validActions = validationResults.filter(r => r.valid).length
  const invalidActions = validationResults.filter(r => !r.valid).length
  const allErrors = validationResults.flatMap(r => r.errors)
  const allWarnings = validationResults.flatMap(r => r.warnings)

  return {
    totalActions: validationResults.length,
    validActions,
    invalidActions,
    totalErrors: allErrors.length,
    totalWarnings: allWarnings.length,
    errors: allErrors,
    warnings: allWarnings
  }
}