import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SupabaseError } from '@/lib/supabase'

// Helper function to create clients safely in API routes
function createSupabaseClients() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required Supabase environment variables')
  }

  const client = createClient(supabaseUrl, supabaseAnonKey)
  
  const adminClient = supabaseServiceRoleKey 
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

  return { client, adminClient }
}

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    
    const { client, adminClient } = createSupabaseClients()
    
    // Test basic client connection
    const clientTest = await client.from('_supabase_migrations').select('*').limit(1)
    
    let results = {
      timestamp: new Date().toISOString(),
      clientConnection: {
        status: 'unknown',
        error: null as string | null,
      },
      adminConnection: {
        status: 'unknown', 
        error: null as string | null,
        available: !!adminClient,
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'configured' : 'missing',
      }
    }
    
    // Test client connection
    if (clientTest.error) {
      results.clientConnection.status = 'error'
      results.clientConnection.error = clientTest.error.message
    } else {
      results.clientConnection.status = 'connected'
    }
    
    // Test admin connection only if service role key is available
    if (adminClient) {
      try {
        const adminTest = await adminClient.from('_supabase_migrations').select('*').limit(1)
        
        if (adminTest.error) {
          results.adminConnection.status = 'error'
          results.adminConnection.error = adminTest.error.message
        } else {
          results.adminConnection.status = 'connected'
        }
      } catch (error) {
        results.adminConnection.status = 'error'
        results.adminConnection.error = error instanceof Error ? error.message : 'Unknown admin client error'
      }
    }
    
    console.log('Supabase connection test results:', results)
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection test completed',
      results
    })
    
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    
    const errorMessage = error instanceof SupabaseError 
      ? error.message 
      : error instanceof Error 
        ? error.message 
        : 'Unknown error occurred'
    
    return NextResponse.json({
      success: false,
      message: 'Supabase connection test failed',
      error: errorMessage,
      timestamp: new Date().toISOString(),
    }, { 
      status: 500 
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testType } = body
    
    if (testType === 'auth') {
      // Test authentication functionality
      const { client } = createSupabaseClients()
      const { data, error } = await client.auth.getSession()
      
      return NextResponse.json({
        success: true,
        message: 'Auth test completed',
        hasSession: !!data.session,
        error: error?.message || null
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Unknown test type'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Supabase POST test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Supabase POST test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    })
  }
}