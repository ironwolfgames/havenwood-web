import { NextRequest, NextResponse } from 'next/server'
import { resolveTurn, checkTurnReadiness } from '@/lib/game/resolution'
import { ResolutionOptions } from '@/types/game'

/**
 * Turn Resolution API Endpoint
 * 
 * POST /api/game/resolve-turn
 * Processes all player actions for a turn and updates game state
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['sessionId', 'turnNumber']
    const missingFields = requiredFields.filter(field => body[field] === undefined || body[field] === null)
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
        missingFields,
        errors: [`Missing required fields: ${missingFields.join(', ')}`]
      }, { status: 400 })
    }

    // Validate data types
    if (typeof body.sessionId !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid sessionId: must be string',
        errors: ['sessionId must be a string']
      }, { status: 400 })
    }

    if (typeof body.turnNumber !== 'number' || body.turnNumber < 1 || !Number.isInteger(body.turnNumber)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid turnNumber: must be positive integer',
        errors: ['turnNumber must be a positive integer']
      }, { status: 400 })
    }

    // Parse resolution options
    const options: ResolutionOptions = {
      validateOnly: body.validateOnly === true,
      allowPartialFailure: body.allowPartialFailure === true,
      timeoutMs: body.timeoutMs || 30000, // 30 second default timeout
      auditTrail: body.auditTrail !== false // Default to true
    }

    // Validate optional fields
    if (body.validateOnly !== undefined && typeof body.validateOnly !== 'boolean') {
      return NextResponse.json({
        success: false,
        message: 'Invalid validateOnly: must be boolean',
        errors: ['validateOnly must be a boolean']
      }, { status: 400 })
    }

    if (body.allowPartialFailure !== undefined && typeof body.allowPartialFailure !== 'boolean') {
      return NextResponse.json({
        success: false,
        message: 'Invalid allowPartialFailure: must be boolean',
        errors: ['allowPartialFailure must be a boolean']
      }, { status: 400 })
    }

    if (body.timeoutMs !== undefined && (typeof body.timeoutMs !== 'number' || body.timeoutMs < 1000 || body.timeoutMs > 300000)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid timeoutMs: must be number between 1000 and 300000',
        errors: ['timeoutMs must be between 1 second and 5 minutes']
      }, { status: 400 })
    }

    // Check if turn is ready for resolution
    const turnStatus = await checkTurnReadiness(body.sessionId, body.turnNumber)
    
    if (!turnStatus.canResolve) {
      return NextResponse.json({
        success: false,
        message: 'Turn not ready for resolution',
        turnStatus,
        errors: [
          `Turn ${body.turnNumber} is not ready for resolution. ` +
          `${turnStatus.playersNotSubmitted.length} of ${turnStatus.totalPlayers} players have not submitted actions.`
        ]
      }, { status: 400 })
    }

    // Execute turn resolution with timeout
    const resolutionPromise = resolveTurn(body.sessionId, body.turnNumber, options)
    
    let result
    if (options.timeoutMs) {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Turn resolution timed out')), options.timeoutMs)
      })
      
      result = await Promise.race([resolutionPromise, timeoutPromise])
    } else {
      result = await resolutionPromise
    }

    // Return resolution results
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: options.validateOnly ? 'Validation completed' : 'Turn resolved successfully',
        result,
        turnStatus
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Turn resolution failed',
        result,
        errors: result.errors
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Turn resolution API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json({
      success: false,
      message: 'Turn resolution failed',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { 
      status: 500 
    })
  }
}

/**
 * Check Turn Status API Endpoint
 * 
 * GET /api/game/resolve-turn?sessionId=<id>&turnNumber=<number>
 * Checks if a turn is ready for resolution
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const turnNumberStr = searchParams.get('turnNumber')

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        message: 'Missing sessionId parameter',
        errors: ['sessionId parameter is required']
      }, { status: 400 })
    }

    if (!turnNumberStr) {
      return NextResponse.json({
        success: false,
        message: 'Missing turnNumber parameter',
        errors: ['turnNumber parameter is required']
      }, { status: 400 })
    }

    const turnNumber = parseInt(turnNumberStr, 10)
    if (isNaN(turnNumber) || turnNumber < 1) {
      return NextResponse.json({
        success: false,
        message: 'Invalid turnNumber: must be positive integer',
        errors: ['turnNumber must be a positive integer']
      }, { status: 400 })
    }

    // Get turn status
    const turnStatus = await checkTurnReadiness(sessionId, turnNumber)

    return NextResponse.json({
      success: true,
      message: 'Turn status retrieved successfully',
      turnStatus
    })

  } catch (error) {
    console.error('Turn status check API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json({
      success: false,
      message: 'Failed to check turn status',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { 
      status: 500 
    })
  }
}