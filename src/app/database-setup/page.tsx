'use client'

import { useState } from 'react'

interface DatabaseSetupResult {
  success: boolean
  message: string
  results?: any
  error?: string
}

export default function DatabaseSetupPage() {
  const [setupResult, setSetupResult] = useState<DatabaseSetupResult | null>(null)
  const [statusResult, setStatusResult] = useState<DatabaseSetupResult | null>(null)
  const [loading, setLoading] = useState(false)

  const checkDatabaseStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/setup-database', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      setStatusResult(result)
      console.log('Database status check result:', result)
      
    } catch (error) {
      const result: DatabaseSetupResult = {
        success: false,
        message: 'Database status check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      
      setStatusResult(result)
      console.error('Database status check error:', error)
    }
    setLoading(false)
  }

  const setupDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      setSetupResult(result)
      console.log('Database setup result:', result)
      
      // Also refresh status after setup
      if (result.success) {
        setTimeout(() => checkDatabaseStatus(), 1000)
      }
      
    } catch (error) {
      const result: DatabaseSetupResult = {
        success: false,
        message: 'Database setup failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      
      setSetupResult(result)
      console.error('Database setup error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Setup</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Database Schema Status</h2>
          <p className="text-gray-600 mb-4">
            Check if the database tables and initial data have been created.
          </p>
          
          <button
            onClick={checkDatabaseStatus}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed mr-4"
          >
            {loading ? 'Checking...' : 'Check Database Status'}
          </button>
          
          {statusResult && (
            <div className={`mt-4 p-4 rounded ${statusResult.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
              <h3 className={`font-bold ${statusResult.success ? 'text-green-800' : 'text-red-800'}`}>
                Status Check Result
              </h3>
              <p className={statusResult.success ? 'text-green-700' : 'text-red-700'}>
                {statusResult.message}
              </p>
              
              {statusResult.results?.tables_exist && (
                <div className="mt-3">
                  <h4 className="font-semibold text-gray-800 mb-2">Table Status:</h4>
                  <ul className="text-sm text-gray-700">
                    <li>Players: {statusResult.results.tables_exist.players ? '✅' : '❌'}</li>
                    <li>Factions: {statusResult.results.tables_exist.factions ? '✅' : '❌'}</li>
                    <li>Game Sessions: {statusResult.results.tables_exist.game_sessions ? '✅' : '❌'}</li>
                    <li>Session Players: {statusResult.results.tables_exist.session_players ? '✅' : '❌'}</li>
                    <li>Factions Seeded: {statusResult.results.tables_exist.factions_seeded ? '✅' : '❌'}</li>
                  </ul>
                </div>
              )}
              
              {statusResult.error && (
                <p className="mt-2 text-sm text-red-600">
                  Error: {statusResult.error}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Initialize Database</h2>
          <p className="text-gray-600 mb-4">
            Set up the database tables and seed initial data. This will create the core schema for players, factions, and game sessions.
          </p>
          
          <div className="bg-yellow-100 border border-yellow-400 rounded p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> You need to manually create the database tables using the SQL migration files in the <code>supabase/migrations/</code> directory first. 
              This setup only seeds the factions data.
            </p>
          </div>
          
          <button
            onClick={setupDatabase}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up...' : 'Seed Factions Data'}
          </button>
          
          {setupResult && (
            <div className={`mt-4 p-4 rounded ${setupResult.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
              <h3 className={`font-bold ${setupResult.success ? 'text-green-800' : 'text-red-800'}`}>
                Setup Result
              </h3>
              <p className={setupResult.success ? 'text-green-700' : 'text-red-700'}>
                {setupResult.message}
              </p>
              
              {setupResult.results?.factions && (
                <div className="mt-3">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Seeded {setupResult.results.factions.count} factions:
                  </h4>
                  <ul className="text-sm text-gray-700">
                    {setupResult.results.factions.data.map((faction: any) => (
                      <li key={faction.id}>
                        {faction.name} ({faction.system_type})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {setupResult.error && (
                <p className="mt-2 text-sm text-red-600">
                  Error: {setupResult.error}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Manual Setup Instructions</h2>
          <div className="text-gray-700 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Create Database Tables</h3>
              <p className="text-sm mb-2">
                Run the SQL migration files in your Supabase dashboard in this order:
              </p>
              <ul className="text-sm list-disc list-inside ml-4 space-y-1">
                <li><code>supabase/migrations/001_create_players_table.sql</code></li>
                <li><code>supabase/migrations/002_create_factions_table.sql</code></li>
                <li><code>supabase/migrations/003_create_game_sessions_table.sql</code></li>
                <li><code>supabase/migrations/004_create_session_players_table.sql</code></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">2. Seed Initial Data</h3>
              <p className="text-sm mb-2">
                Either run the seed file manually or use the &quot;Seed Factions Data&quot; button above:
              </p>
              <ul className="text-sm list-disc list-inside ml-4">
                <li><code>supabase/seed-data/001_seed_factions.sql</code></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Verify Setup</h3>
              <p className="text-sm">
                Use the &quot;Check Database Status&quot; button above to verify all tables were created successfully.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}