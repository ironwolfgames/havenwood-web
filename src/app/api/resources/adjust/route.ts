import { NextRequest, NextResponse } from 'next/server'
import { executeResourceAdjustment } from '@/lib/database/resources'
import { ResourceAdjustment } from '@/lib/game/resources'

/**
 * POST /api/resources/adjust
 * 
 * Adjust resource quantities for a faction with validation and atomic operations.
 * 
 * Request Body:
 * {
 *   sessionId: string
 *   factionId: string
 *   resourceType: ResourceType
 *   turnNumber: number
 *   delta: number (positive to add, negative to subtract)
 *   reason?: string
 *   allowNegative?: boolean
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
    const requiredFields = ['sessionId', 'factionId', 'resourceType', 'turnNumber', 'delta']
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

    if (typeof body.factionId !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid factionId: must be string',
        errors: ['factionId must be a string'],
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

    if (typeof body.turnNumber !== 'number' || body.turnNumber < 1 || !Number.isInteger(body.turnNumber)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid turnNumber: must be positive integer',
        errors: ['turnNumber must be a positive integer'],
        warnings: []
      }, { status: 400 })
    }

    if (typeof body.delta !== 'number' || !Number.isInteger(body.delta)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid delta: must be integer',
        errors: ['delta must be an integer'],
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

    if (body.allowNegative !== undefined && typeof body.allowNegative !== 'boolean') {
      return NextResponse.json({
        success: false,
        message: 'Invalid allowNegative: must be boolean',
        errors: ['allowNegative must be a boolean'],
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

    // Create adjustment object
    const adjustment: ResourceAdjustment = {
      sessionId: body.sessionId,
      factionId: body.factionId,
      resourceType: body.resourceType,
      turnNumber: body.turnNumber,
      delta: body.delta,
      reason: body.reason,
      allowNegative: body.allowNegative || false
    }

    // Execute the adjustment
    const result = await executeResourceAdjustment(adjustment)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: 'Resource adjustment failed',
        resources: result.resources,
        auditLogs: result.auditLogs,
        errors: result.errors,
        warnings: result.warnings
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Resource adjustment completed successfully',
      resources: result.resources,
      auditLogs: result.auditLogs,
      errors: result.errors,
      warnings: result.warnings
    })

  } catch (error) {
    console.error('Resource adjustment API error:', error)
    
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
 * GET /api/resources/adjust
 * 
 * Returns API documentation and usage examples.
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/resources/adjust',
    method: 'POST',
    description: 'Adjust resource quantities for a faction with validation and atomic operations',
    requestBody: {
      sessionId: 'string (required) - Game session ID',
      factionId: 'string (required) - Faction ID',
      resourceType: 'string (required) - Resource type (food, timber, fiber, etc.)',
      turnNumber: 'number (required) - Turn number (positive integer)',
      delta: 'number (required) - Amount to adjust (positive to add, negative to subtract)',
      reason: 'string (optional) - Reason for the adjustment',
      allowNegative: 'boolean (optional) - Allow negative resource quantities (default: false)'
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
    examples: {
      addFood: {
        sessionId: 'session-123',
        factionId: 'faction-moles',
        resourceType: 'food',
        turnNumber: 1,
        delta: 5,
        reason: 'Harvested from farms'
      },
      spendTimber: {
        sessionId: 'session-123',
        factionId: 'faction-badgers',
        resourceType: 'timber',
        turnNumber: 2,
        delta: -3,
        reason: 'Built fortifications'
      }
    }
  })
}