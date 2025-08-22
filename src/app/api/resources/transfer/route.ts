import { NextRequest, NextResponse } from 'next/server'
import { executeResourceTransfer } from '@/lib/database/resources'
import { ResourceTransfer } from '@/lib/game/resources'

/**
 * POST /api/resources/transfer
 * 
 * Transfer resources between factions or to global resource pools.
 * 
 * Request Body:
 * {
 *   sessionId: string
 *   fromFactionId: string
 *   toFactionId: string | 'global_pool'
 *   resourceType: ResourceType
 *   amount: number
 *   turnNumber: number
 *   reason?: string
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   resources: Resource[]
 *   auditLogs: ResourceAuditLog[]
 *   errors: string[]
 *   warnings: string[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['sessionId', 'fromFactionId', 'toFactionId', 'resourceType', 'amount', 'turnNumber']
    const missingFields = requiredFields.filter(field => body[field] === undefined || body[field] === null)
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
        missingFields,
        errors: [`Missing required fields: ${missingFields.join(', ')}`],
        warnings: []
      }, { status: 400 })
    }

    // Validate data types
    if (typeof body.sessionId !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid sessionId: must be string',
        errors: ['sessionId must be a string'],
        warnings: []
      }, { status: 400 })
    }

    if (typeof body.fromFactionId !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid fromFactionId: must be string',
        errors: ['fromFactionId must be a string'],
        warnings: []
      }, { status: 400 })
    }

    if (typeof body.toFactionId !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid toFactionId: must be string',
        errors: ['toFactionId must be a string'],
        warnings: []
      }, { status: 400 })
    }

    if (typeof body.resourceType !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid resourceType: must be string',
        errors: ['resourceType must be a string'],
        warnings: []
      }, { status: 400 })
    }

    if (typeof body.amount !== 'number' || body.amount <= 0 || !Number.isInteger(body.amount)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid amount: must be positive integer',
        errors: ['amount must be a positive integer'],
        warnings: []
      }, { status: 400 })
    }

    if (typeof body.turnNumber !== 'number' || body.turnNumber < 1 || !Number.isInteger(body.turnNumber)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid turnNumber: must be positive integer',
        errors: ['turnNumber must be a positive integer'],
        warnings: []
      }, { status: 400 })
    }

    // Validate optional fields
    if (body.reason !== undefined && typeof body.reason !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid reason: must be string',
        errors: ['reason must be a string'],
        warnings: []
      }, { status: 400 })
    }

    // Validate resource type
    const validResourceTypes = [
      'food', 'timber', 'fiber', 'protection_tokens', 'stability_tokens',
      'magic_crystals', 'insight_tokens', 'infrastructure_tokens', 'project_progress'
    ]
    
    if (!validResourceTypes.includes(body.resourceType)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid resourceType',
        errors: [`resourceType must be one of: ${validResourceTypes.join(', ')}`],
        warnings: []
      }, { status: 400 })
    }

    // Validate self-transfer
    if (body.fromFactionId === body.toFactionId && body.toFactionId !== 'global_pool') {
      return NextResponse.json({
        success: false,
        message: 'Cannot transfer to same faction',
        errors: ['fromFactionId and toFactionId cannot be the same'],
        warnings: []
      }, { status: 400 })
    }

    // Create transfer object
    const transfer: ResourceTransfer = {
      sessionId: body.sessionId,
      fromFactionId: body.fromFactionId,
      toFactionId: body.toFactionId,
      resourceType: body.resourceType,
      amount: body.amount,
      turnNumber: body.turnNumber,
      reason: body.reason
    }

    // Execute the transfer
    const result = await executeResourceTransfer(transfer)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: 'Resource transfer failed',
        resources: result.resources,
        auditLogs: result.auditLogs,
        errors: result.errors,
        warnings: result.warnings
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Resource transfer completed successfully',
      resources: result.resources,
      auditLogs: result.auditLogs,
      errors: result.errors,
      warnings: result.warnings
    })

  } catch (error) {
    console.error('Resource transfer API error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      resources: [],
      auditLogs: [],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      warnings: []
    }, { status: 500 })
  }
}

/**
 * GET /api/resources/transfer
 * 
 * Returns API documentation and usage examples.
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/resources/transfer',
    method: 'POST',
    description: 'Transfer resources between factions or to global resource pools',
    requestBody: {
      sessionId: 'string (required) - Game session ID',
      fromFactionId: 'string (required) - Source faction ID',
      toFactionId: 'string (required) - Target faction ID or "global_pool"',
      resourceType: 'string (required) - Resource type (food, timber, fiber, etc.)',
      amount: 'number (required) - Amount to transfer (positive integer)',
      turnNumber: 'number (required) - Turn number (positive integer)',
      reason: 'string (optional) - Reason for the transfer'
    },
    response: {
      success: 'boolean - Operation success status',
      resources: 'Resource[] - Updated resource records',
      auditLogs: 'ResourceAuditLog[] - Audit log entries',
      errors: 'string[] - Error messages',
      warnings: 'string[] - Warning messages'
    },
    validResourceTypes: [
      'food', 'timber', 'fiber', 'protection_tokens', 'stability_tokens',
      'magic_crystals', 'insight_tokens', 'infrastructure_tokens', 'project_progress'
    ],
    globalPoolResources: [
      'protection_tokens', 'stability_tokens', 'insight_tokens',
      'infrastructure_tokens', 'project_progress'
    ],
    examples: {
      factionToFaction: {
        sessionId: 'session-123',
        fromFactionId: 'faction-moles',
        toFactionId: 'faction-badgers',
        resourceType: 'timber',
        amount: 2,
        turnNumber: 1,
        reason: 'Trade agreement'
      },
      factionToGlobalPool: {
        sessionId: 'session-123',
        fromFactionId: 'faction-badgers',
        toFactionId: 'global_pool',
        resourceType: 'protection_tokens',
        amount: 3,
        turnNumber: 1,
        reason: 'Contribute to global defense'
      }
    }
  })
}