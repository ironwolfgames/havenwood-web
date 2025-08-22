import { NextRequest, NextResponse } from 'next/server'
import { queryResources, getGlobalResourceTotals } from '@/lib/database/resources'
import { ResourceQuery } from '@/lib/game/resources'

/**
 * GET /api/resources/query
 * 
 * Query resources with optional filtering and historical data.
 * 
 * Query Parameters:
 * - sessionId: string (required) - Game session ID
 * - factionId?: string (optional) - Filter by faction ID
 * - resourceType?: string (optional) - Filter by resource type
 * - turnNumber?: number (optional) - Filter by turn number
 * - includeHistory?: boolean (optional) - Include historical data
 * - globalTotals?: boolean (optional) - Return global resource totals instead
 * 
 * Response:
 * {
 *   success: boolean
 *   resources: Resource[] | Record<ResourceType, number>
 *   totalCount: number
 *   query: ResourceQuery
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validate required sessionId
    const sessionId = searchParams.get('sessionId')
    if (!sessionId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required parameter: sessionId',
        errors: ['sessionId is required'],
        resources: []
      }, { status: 400 })
    }

    // Parse optional parameters
    const factionId = searchParams.get('factionId') || undefined
    const resourceType = searchParams.get('resourceType') || undefined
    const turnNumberParam = searchParams.get('turnNumber')
    const turnNumber = turnNumberParam ? parseInt(turnNumberParam, 10) : undefined
    const includeHistory = searchParams.get('includeHistory') === 'true'
    const globalTotals = searchParams.get('globalTotals') === 'true'

    // Validate turn number if provided
    if (turnNumberParam && (isNaN(turnNumber!) || turnNumber! < 1)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid turnNumber: must be positive integer',
        errors: ['turnNumber must be a positive integer'],
        resources: []
      }, { status: 400 })
    }

    // Validate resource type if provided
    if (resourceType) {
      const validResourceTypes = [
        'food', 'timber', 'fiber', 'protection_tokens', 'stability_tokens',
        'magic_crystals', 'insight_tokens', 'infrastructure_tokens', 'project_progress'
      ]
      
      if (!validResourceTypes.includes(resourceType)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid resourceType',
          errors: [`resourceType must be one of: ${validResourceTypes.join(', ')}`],
          resources: []
        }, { status: 400 })
      }
    }

    // Handle global totals request
    if (globalTotals) {
      if (!turnNumber) {
        return NextResponse.json({
          success: false,
          message: 'turnNumber is required when requesting global totals',
          errors: ['turnNumber must be provided for global totals'],
          resources: []
        }, { status: 400 })
      }

      const totals = await getGlobalResourceTotals(sessionId, turnNumber)
      
      return NextResponse.json({
        success: true,
        message: 'Global resource totals retrieved successfully',
        resources: totals,
        totalCount: Object.keys(totals).length,
        query: {
          sessionId,
          turnNumber,
          globalTotals: true
        }
      })
    }

    // Create query object
    const query: ResourceQuery = {
      sessionId,
      factionId,
      resourceType: resourceType as any,
      turnNumber,
      includeHistory
    }

    // Execute the query
    const resources = await queryResources(query)

    return NextResponse.json({
      success: true,
      message: 'Resources retrieved successfully',
      resources,
      totalCount: resources.length,
      query
    })

  } catch (error) {
    console.error('Resource query API error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      resources: [],
      totalCount: 0
    }, { status: 500 })
  }
}

/**
 * POST /api/resources/query
 * 
 * Alternative query method using request body for complex queries.
 * 
 * Request Body:
 * {
 *   sessionId: string
 *   factionId?: string
 *   resourceType?: ResourceType
 *   turnNumber?: number
 *   includeHistory?: boolean
 *   globalTotals?: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required sessionId
    if (!body.sessionId || typeof body.sessionId !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Missing or invalid sessionId',
        errors: ['sessionId is required and must be a string'],
        resources: []
      }, { status: 400 })
    }

    // Validate optional parameters
    if (body.factionId !== undefined && typeof body.factionId !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid factionId: must be string',
        errors: ['factionId must be a string'],
        resources: []
      }, { status: 400 })
    }

    if (body.resourceType !== undefined && typeof body.resourceType !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid resourceType: must be string',
        errors: ['resourceType must be a string'],
        resources: []
      }, { status: 400 })
    }

    if (body.turnNumber !== undefined && (typeof body.turnNumber !== 'number' || body.turnNumber < 1 || !Number.isInteger(body.turnNumber))) {
      return NextResponse.json({
        success: false,
        message: 'Invalid turnNumber: must be positive integer',
        errors: ['turnNumber must be a positive integer'],
        resources: []
      }, { status: 400 })
    }

    if (body.includeHistory !== undefined && typeof body.includeHistory !== 'boolean') {
      return NextResponse.json({
        success: false,
        message: 'Invalid includeHistory: must be boolean',
        errors: ['includeHistory must be a boolean'],
        resources: []
      }, { status: 400 })
    }

    if (body.globalTotals !== undefined && typeof body.globalTotals !== 'boolean') {
      return NextResponse.json({
        success: false,
        message: 'Invalid globalTotals: must be boolean',
        errors: ['globalTotals must be a boolean'],
        resources: []
      }, { status: 400 })
    }

    // Validate resource type if provided
    if (body.resourceType) {
      const validResourceTypes = [
        'food', 'timber', 'fiber', 'protection_tokens', 'stability_tokens',
        'magic_crystals', 'insight_tokens', 'infrastructure_tokens', 'project_progress'
      ]
      
      if (!validResourceTypes.includes(body.resourceType)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid resourceType',
          errors: [`resourceType must be one of: ${validResourceTypes.join(', ')}`],
          resources: []
        }, { status: 400 })
      }
    }

    // Handle global totals request
    if (body.globalTotals) {
      if (!body.turnNumber) {
        return NextResponse.json({
          success: false,
          message: 'turnNumber is required when requesting global totals',
          errors: ['turnNumber must be provided for global totals'],
          resources: []
        }, { status: 400 })
      }

      const totals = await getGlobalResourceTotals(body.sessionId, body.turnNumber)
      
      return NextResponse.json({
        success: true,
        message: 'Global resource totals retrieved successfully',
        resources: totals,
        totalCount: Object.keys(totals).length,
        query: {
          sessionId: body.sessionId,
          turnNumber: body.turnNumber,
          globalTotals: true
        }
      })
    }

    // Create query object
    const query: ResourceQuery = {
      sessionId: body.sessionId,
      factionId: body.factionId,
      resourceType: body.resourceType,
      turnNumber: body.turnNumber,
      includeHistory: body.includeHistory || false
    }

    // Execute the query
    const resources = await queryResources(query)

    return NextResponse.json({
      success: true,
      message: 'Resources retrieved successfully',
      resources,
      totalCount: resources.length,
      query
    })

  } catch (error) {
    console.error('Resource query API error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      resources: [],
      totalCount: 0
    }, { status: 500 })
  }
}

/**
 * OPTIONS /api/resources/query
 * 
 * Returns API documentation and usage examples.
 */
export async function OPTIONS() {
  return NextResponse.json({
    endpoint: '/api/resources/query',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Query resources with optional filtering and historical data',
    getParameters: {
      sessionId: 'string (required) - Game session ID',
      factionId: 'string (optional) - Filter by faction ID',
      resourceType: 'string (optional) - Filter by resource type',
      turnNumber: 'number (optional) - Filter by turn number',
      includeHistory: 'boolean (optional) - Include historical data',
      globalTotals: 'boolean (optional) - Return global resource totals'
    },
    postRequestBody: {
      sessionId: 'string (required) - Game session ID',
      factionId: 'string (optional) - Filter by faction ID',
      resourceType: 'string (optional) - Filter by resource type',
      turnNumber: 'number (optional) - Filter by turn number',
      includeHistory: 'boolean (optional) - Include historical data',
      globalTotals: 'boolean (optional) - Return global resource totals'
    },
    response: {
      success: 'boolean - Operation success status',
      resources: 'Resource[] | Record<ResourceType, number> - Resource data',
      totalCount: 'number - Number of resources returned',
      query: 'ResourceQuery - Query parameters used'
    },
    validResourceTypes: [
      'food', 'timber', 'fiber', 'protection_tokens', 'stability_tokens',
      'magic_crystals', 'insight_tokens', 'infrastructure_tokens', 'project_progress'
    ],
    examples: {
      getAllResources: '?sessionId=session-123&turnNumber=1',
      getFactionResources: '?sessionId=session-123&factionId=faction-moles&turnNumber=1',
      getResourceHistory: '?sessionId=session-123&resourceType=food&includeHistory=true',
      getGlobalTotals: '?sessionId=session-123&turnNumber=1&globalTotals=true'
    }
  })
}