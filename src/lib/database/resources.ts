/**
 * Atomic Resource Database Operations
 * 
 * Provides atomic operations for resource adjustments, transfers, and audit logging.
 * Uses Supabase for database operations with proper error handling and transactions.
 */

import { 
  supabase, 
  supabaseAdmin, 
  handleSupabaseResponse,
  Resource,
  ResourceInsert,
  Faction
} from '@/lib/supabase'
import { 
  ResourceAdjustment,
  ResourceTransfer,
  ResourceQuery,
  ResourceType,
  FactionSystemType,
  validateResourceAdjustment,
  validateResourceTransfer
} from '@/lib/game/resources'

/**
 * Resource operation audit log entry
 */
export interface ResourceAuditLog {
  id?: string
  session_id: string
  operation_type: 'adjust' | 'transfer' | 'initialize'
  faction_id: string | null
  resource_type: ResourceType
  old_quantity: number
  new_quantity: number
  delta: number
  turn_number: number
  reason?: string
  metadata?: any
  created_at?: string
}

/**
 * Result of an atomic resource operation
 */
export interface ResourceOperationResult {
  success: boolean
  resources: Resource[]
  auditLogs: ResourceAuditLog[]
  errors: string[]
  warnings: string[]
}

/**
 * Execute atomic resource adjustment
 * Updates resource quantity and logs the change
 */
export async function executeResourceAdjustment(
  adjustment: ResourceAdjustment
): Promise<ResourceOperationResult> {
  const result: ResourceOperationResult = {
    success: false,
    resources: [],
    auditLogs: [],
    errors: [],
    warnings: []
  }

  try {
    // Get current resources for validation
    const currentResources = await supabase
      .from('resources')
      .select()
      .eq('session_id', adjustment.sessionId)
      .eq('turn_number', adjustment.turnNumber)

    if (currentResources.error) {
      result.errors.push(`Failed to fetch current resources: ${currentResources.error.message}`)
      return result
    }

    // Get faction info for validation
    const factionResponse = await supabase
      .from('factions')
      .select('system_type')
      .eq('id', adjustment.factionId)
      .single()

    if (factionResponse.error) {
      result.errors.push(`Failed to fetch faction: ${factionResponse.error.message}`)
      return result
    }

    const factionSystemType = factionResponse.data.system_type as FactionSystemType

    // Validate the adjustment
    const validation = validateResourceAdjustment(
      adjustment,
      currentResources.data || [],
      factionSystemType
    )

    result.warnings = validation.warnings
    if (!validation.valid) {
      result.errors = validation.errors
      return result
    }

    // Find existing resource record
    const existingResource = currentResources.data?.find(
      r => r.faction_id === adjustment.factionId && 
           r.resource_type === adjustment.resourceType
    )

    const oldQuantity = existingResource?.quantity || 0
    const newQuantity = oldQuantity + adjustment.delta

    // Create audit log entry
    const auditLog: ResourceAuditLog = {
      session_id: adjustment.sessionId,
      operation_type: 'adjust',
      faction_id: adjustment.factionId,
      resource_type: adjustment.resourceType,
      old_quantity: oldQuantity,
      new_quantity: newQuantity,
      delta: adjustment.delta,
      turn_number: adjustment.turnNumber,
      reason: adjustment.reason,
      metadata: { allowNegative: adjustment.allowNegative }
    }

    // Execute atomic operation using upsert
    const resourceResult = await supabase
      .from('resources')
      .upsert(
        {
          session_id: adjustment.sessionId,
          faction_id: adjustment.factionId,
          resource_type: adjustment.resourceType,
          turn_number: adjustment.turnNumber,
          quantity: newQuantity
        },
        {
          onConflict: 'session_id,faction_id,resource_type,turn_number'
        }
      )
      .select()
      .single()

    if (resourceResult.error) {
      result.errors.push(`Failed to update resource: ${resourceResult.error.message}`)
      return result
    }

    result.resources = [resourceResult.data]
    result.auditLogs = [auditLog]
    result.success = true

    return result

  } catch (error) {
    result.errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return result
  }
}

/**
 * Execute atomic resource transfer between factions
 * Decreases source faction and increases target faction or global pool
 */
export async function executeResourceTransfer(
  transfer: ResourceTransfer
): Promise<ResourceOperationResult> {
  const result: ResourceOperationResult = {
    success: false,
    resources: [],
    auditLogs: [],
    errors: [],
    warnings: []
  }

  try {
    // Get current resources for validation
    const currentResources = await supabase
      .from('resources')
      .select()
      .eq('session_id', transfer.sessionId)
      .eq('turn_number', transfer.turnNumber)

    if (currentResources.error) {
      result.errors.push(`Failed to fetch current resources: ${currentResources.error.message}`)
      return result
    }

    // Get faction system types for validation
    const fromFactionResponse = await supabase
      .from('factions')
      .select('system_type')
      .eq('id', transfer.fromFactionId)
      .single()

    if (fromFactionResponse.error) {
      result.errors.push(`Failed to fetch source faction: ${fromFactionResponse.error.message}`)
      return result
    }

    let toFactionSystemType: FactionSystemType | undefined
    if (transfer.toFactionId !== 'global_pool') {
      const toFactionResponse = await supabase
        .from('factions')
        .select('system_type')
        .eq('id', transfer.toFactionId)
        .single()

      if (toFactionResponse.error) {
        result.errors.push(`Failed to fetch target faction: ${toFactionResponse.error.message}`)
        return result
      }
      
      toFactionSystemType = toFactionResponse.data.system_type as FactionSystemType
    }

    // Validate the transfer
    const validation = validateResourceTransfer(
      transfer,
      fromFactionResponse.data.system_type as FactionSystemType,
      toFactionSystemType,
      currentResources.data || []
    )

    result.warnings = validation.warnings
    if (!validation.valid) {
      result.errors = validation.errors
      return result
    }

    // Find source resource
    const sourceResource = currentResources.data?.find(
      r => r.faction_id === transfer.fromFactionId && 
           r.resource_type === transfer.resourceType
    )

    const sourceOldQuantity = sourceResource?.quantity || 0
    const sourceNewQuantity = sourceOldQuantity - transfer.amount

    // Create audit log for source faction
    const sourceAuditLog: ResourceAuditLog = {
      session_id: transfer.sessionId,
      operation_type: 'transfer',
      faction_id: transfer.fromFactionId,
      resource_type: transfer.resourceType,
      old_quantity: sourceOldQuantity,
      new_quantity: sourceNewQuantity,
      delta: -transfer.amount,
      turn_number: transfer.turnNumber,
      reason: transfer.reason,
      metadata: { 
        transferTo: transfer.toFactionId,
        transferType: 'outgoing'
      }
    }

    // Update source faction resource
    const sourceResult = await supabase
      .from('resources')
      .upsert(
        {
          session_id: transfer.sessionId,
          faction_id: transfer.fromFactionId,
          resource_type: transfer.resourceType,
          turn_number: transfer.turnNumber,
          quantity: sourceNewQuantity
        },
        {
          onConflict: 'session_id,faction_id,resource_type,turn_number'
        }
      )
      .select()
      .single()

    if (sourceResult.error) {
      result.errors.push(`Failed to update source resource: ${sourceResult.error.message}`)
      return result
    }

    result.resources.push(sourceResult.data)
    result.auditLogs.push(sourceAuditLog)

    // Handle target faction resource (skip if global pool)
    if (transfer.toFactionId !== 'global_pool') {
      const targetResource = currentResources.data?.find(
        r => r.faction_id === transfer.toFactionId && 
             r.resource_type === transfer.resourceType
      )

      const targetOldQuantity = targetResource?.quantity || 0
      const targetNewQuantity = targetOldQuantity + transfer.amount

      // Create audit log for target faction
      const targetAuditLog: ResourceAuditLog = {
        session_id: transfer.sessionId,
        operation_type: 'transfer',
        faction_id: transfer.toFactionId,
        resource_type: transfer.resourceType,
        old_quantity: targetOldQuantity,
        new_quantity: targetNewQuantity,
        delta: transfer.amount,
        turn_number: transfer.turnNumber,
        reason: transfer.reason,
        metadata: { 
          transferFrom: transfer.fromFactionId,
          transferType: 'incoming'
        }
      }

      // Update target faction resource
      const targetResult = await supabase
        .from('resources')
        .upsert(
          {
            session_id: transfer.sessionId,
            faction_id: transfer.toFactionId,
            resource_type: transfer.resourceType,
            turn_number: transfer.turnNumber,
            quantity: targetNewQuantity
          },
          {
            onConflict: 'session_id,faction_id,resource_type,turn_number'
          }
        )
        .select()
        .single()

      if (targetResult.error) {
        result.errors.push(`Failed to update target resource: ${targetResult.error.message}`)
        return result
      }

      result.resources.push(targetResult.data)
      result.auditLogs.push(targetAuditLog)
    } else {
      // For global pool transfers, just log the contribution
      const globalAuditLog: ResourceAuditLog = {
        session_id: transfer.sessionId,
        operation_type: 'transfer',
        faction_id: null,
        resource_type: transfer.resourceType,
        old_quantity: 0,
        new_quantity: transfer.amount,
        delta: transfer.amount,
        turn_number: transfer.turnNumber,
        reason: transfer.reason,
        metadata: { 
          transferFrom: transfer.fromFactionId,
          transferType: 'global_pool'
        }
      }
      
      result.auditLogs.push(globalAuditLog)
    }

    result.success = true
    return result

  } catch (error) {
    result.errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return result
  }
}

/**
 * Query resources with optional filtering
 */
export async function queryResources(query: ResourceQuery): Promise<Resource[]> {
  let dbQuery = supabase
    .from('resources')
    .select()
    .eq('session_id', query.sessionId)

  // Apply optional filters
  if (query.factionId) {
    dbQuery = dbQuery.eq('faction_id', query.factionId)
  }

  if (query.resourceType) {
    dbQuery = dbQuery.eq('resource_type', query.resourceType)
  }

  if (query.turnNumber !== undefined) {
    if (query.includeHistory) {
      dbQuery = dbQuery.lte('turn_number', query.turnNumber)
    } else {
      dbQuery = dbQuery.eq('turn_number', query.turnNumber)
    }
  }

  // Order by turn and faction for consistent results
  dbQuery = dbQuery.order('turn_number').order('faction_id').order('resource_type')

  const response = await dbQuery
  return handleSupabaseResponse(response)
}

/**
 * Get global resource totals for efficiency calculations
 */
export async function getGlobalResourceTotals(
  sessionId: string, 
  turnNumber: number
): Promise<Record<ResourceType, number>> {
  const resources = await queryResources({
    sessionId,
    turnNumber,
    includeHistory: false
  })

  const totals: Record<ResourceType, number> = {
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

  // Sum up all faction resources
  for (const resource of resources) {
    if (resource.resource_type in totals) {
      totals[resource.resource_type as ResourceType] += resource.quantity
    }
  }

  return totals
}

/**
 * Initialize default resources for a faction on a specific turn
 */
export async function initializeFactionResources(
  sessionId: string,
  factionId: string,
  turnNumber: number
): Promise<ResourceOperationResult> {
  const result: ResourceOperationResult = {
    success: false,
    resources: [],
    auditLogs: [],
    errors: [],
    warnings: []
  }

  try {
    // Check if resources already exist for this faction/turn
    const existingResources = await supabase
      .from('resources')
      .select()
      .eq('session_id', sessionId)
      .eq('faction_id', factionId)
      .eq('turn_number', turnNumber)

    if (existingResources.error) {
      result.errors.push(`Failed to check existing resources: ${existingResources.error.message}`)
      return result
    }

    if (existingResources.data && existingResources.data.length > 0) {
      result.warnings.push('Resources already initialized for this faction and turn')
      result.resources = existingResources.data
      result.success = true
      return result
    }

    // Initialize all resource types with 0 quantity
    const resourceTypes: ResourceType[] = [
      'food', 'timber', 'fiber', 'protection_tokens', 'stability_tokens',
      'magic_crystals', 'insight_tokens', 'infrastructure_tokens', 'project_progress'
    ]

    const resourceInserts: ResourceInsert[] = resourceTypes.map(resourceType => ({
      session_id: sessionId,
      faction_id: factionId,
      resource_type: resourceType,
      turn_number: turnNumber,
      quantity: 0
    }))

    const insertResult = await supabase
      .from('resources')
      .insert(resourceInserts)
      .select()

    if (insertResult.error) {
      result.errors.push(`Failed to initialize resources: ${insertResult.error.message}`)
      return result
    }

    // Create audit logs for initialization
    const auditLogs: ResourceAuditLog[] = resourceTypes.map(resourceType => ({
      session_id: sessionId,
      operation_type: 'initialize',
      faction_id: factionId,
      resource_type: resourceType,
      old_quantity: 0,
      new_quantity: 0,
      delta: 0,
      turn_number: turnNumber,
      reason: 'Initial resource setup'
    }))

    result.resources = insertResult.data
    result.auditLogs = auditLogs
    result.success = true

    return result

  } catch (error) {
    result.errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return result
  }
}