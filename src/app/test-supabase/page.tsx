'use client'

import { useState, useEffect } from 'react'
import { supabase, SupabaseError, getCurrentUser } from '@/lib/supabase'

interface TestResult {
  success: boolean
  message: string
  results?: any
  error?: string
  timestamp: string
}

export default function TestSupabasePage() {
  const [clientTest, setClientTest] = useState<TestResult | null>(null)
  const [serverTest, setServerTest] = useState<TestResult | null>(null)
  const [authTest, setAuthTest] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Test client-side connection on page load
    testClientConnection()
    checkCurrentUser()
  }, [])

  const checkCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error('Error checking current user:', error)
    }
  }

  const testClientConnection = async () => {
    try {
      console.log('Testing client-side Supabase connection...')
      
      // Test basic client connection by trying to access a system table
      const { data, error } = await supabase
        .from('_supabase_migrations')
        .select('*')
        .limit(1)

      const result: TestResult = {
        success: !error,
        message: error ? 'Client connection failed' : 'Client connection successful',
        timestamp: new Date().toISOString(),
        error: error?.message,
        results: {
          connectionStatus: error ? 'failed' : 'connected',
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing',
          errorDetails: error
        }
      }

      setClientTest(result)
      console.log('Client connection test result:', result)
      
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: 'Client connection test threw an exception',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      
      setClientTest(result)
      console.error('Client connection test error:', error)
    }
  }

  const testServerConnection = async () => {
    setLoading(true)
    try {
      console.log('Testing server-side Supabase connection...')
      
      const response = await fetch('/api/test-supabase', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      setServerTest(result)
      console.log('Server connection test result:', result)
      
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: 'Server connection test failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      
      setServerTest(result)
      console.error('Server connection test error:', error)
    }
    setLoading(false)
  }

  const testAuth = async () => {
    setLoading(true)
    try {
      console.log('Testing Supabase authentication...')
      
      const response = await fetch('/api/test-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testType: 'auth' }),
      })

      const result = await response.json()
      setAuthTest(result)
      console.log('Auth test result:', result)
      
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: 'Authentication test failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      
      setAuthTest(result)
      console.error('Auth test error:', error)
    }
    setLoading(false)
  }

  const renderTestResult = (title: string, result: TestResult | null, testFunction?: () => void) => (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {testFunction && (
          <button
            onClick={testFunction}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test'}
          </button>
        )}
      </div>
      
      {result ? (
        <div>
          <div className={`flex items-center mb-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            <span className="mr-2">{result.success ? '✓' : '✗'}</span>
            <span className="font-medium">{result.message}</span>
          </div>
          
          {result.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
              <p className="text-red-800 text-sm">
                <strong>Error:</strong> {result.error}
              </p>
            </div>
          )}
          
          {result.results && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Test Details:</p>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(result.results, null, 2)}
              </pre>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Tested at: {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="text-gray-500">
          {testFunction ? 'Click "Test" to run this test' : 'Test not run yet'}
        </div>
      )}
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Supabase Connection Test
        </h1>
        <p className="text-gray-600">
          This page tests both client-side and server-side connections to Supabase.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Environment Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Environment Configuration</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className={`mr-2 ${typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-500' : 'text-red-500'}`}>
                {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '✗'}
              </span>
              <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
            </div>
            <div className="flex items-center">
              <span className={`mr-2 ${typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-500' : 'text-red-500'}`}>
                {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓' : '✗'}
              </span>
              <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            </div>
          </div>
          {currentUser && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-700">Current User:</p>
              <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-1">
                {JSON.stringify({ id: currentUser.id, email: currentUser.email }, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Test Results */}
        {renderTestResult('Client-side Connection', clientTest, testClientConnection)}
        {renderTestResult('Server-side Connection', serverTest, testServerConnection)}
        {renderTestResult('Authentication System', authTest, testAuth)}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-blue-800 font-medium mb-2">Setup Instructions</h4>
        <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
          <li>Create a new Supabase project at <a href="https://supabase.com" className="underline">supabase.com</a></li>
          <li>Copy the Project URL and anon public key from your project settings</li>
          <li>Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file based on <code className="bg-blue-100 px-1 rounded">.env.example</code></li>
          <li>Add your Supabase credentials to the environment file</li>
          <li>Restart the development server</li>
          <li>Return to this page to test the connections</li>
        </ol>
      </div>
    </div>
  )
}