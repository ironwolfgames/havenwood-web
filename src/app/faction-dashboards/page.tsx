/**
 * Faction Dashboards Test Page
 * 
 * Demonstrates all four faction dashboards with mock data
 * for testing and development purposes.
 */

'use client'

import React, { useState } from 'react'
import { FactionDashboard } from '@/components/FactionDashboard'
import { useFactionData } from '@/hooks/useFactionData'
import { useToast } from '@/components/ui/ToastNotification'
import { FactionSystemType } from '@/lib/game/resources'
import '@/styles/factions.module.css'

type FactionOption = {
  id: FactionSystemType
  name: string
  description: string
}

const FACTION_OPTIONS: FactionOption[] = [
  {
    id: 'provisioner',
    name: 'Meadow Moles',
    description: 'Agriculture and crafting specialists'
  },
  {
    id: 'guardian', 
    name: 'Oakshield Badgers',
    description: 'Defense and stability specialists'
  },
  {
    id: 'mystic',
    name: 'Starling Scholars', 
    description: 'Knowledge and magic specialists'
  },
  {
    id: 'explorer',
    name: 'River Otters',
    description: 'Expansion and engineering specialists'
  }
]

export default function FactionDashboardsPage() {
  const [selectedFaction, setSelectedFaction] = useState<FactionSystemType>('provisioner')
  const { show: showToast, ToastContainer } = useToast()
  
  // Mock game context
  const gameContext = {
    sessionId: 'test-session-123',
    turnNumber: 5,
    playerId: 'player-456',
    timeRemaining: 300000 // 5 minutes in milliseconds
  }

  const { data, submitAction, transferResource } = useFactionData(selectedFaction, gameContext)

  const handleActionSelect = (action: any) => {
    console.log('Action selected:', action)
    showToast(`Selected action: ${action.name}`, 'info', 2000)
  }

  const handleActionSubmit = async (action: any, parameters: any) => {
    console.log('Submitting action:', action, parameters)
    showToast(`Submitting ${action.name}...`, 'info', 2000)
    
    const success = await submitAction(action.id, parameters)
    if (success) {
      console.log('Action submitted successfully')
      showToast(`${action.name} completed successfully!`, 'success')
    } else {
      console.error('Failed to submit action')
      showToast(`Failed to complete ${action.name}`, 'error')
    }
  }

  const handleResourceTransfer = async (to: string, resourceType: string, amount: number) => {
    console.log('Transferring resource:', { to, resourceType, amount })
    showToast(`Transferring ${amount} ${resourceType} to ${to}...`, 'info', 2000)
    
    const success = await transferResource(to, resourceType as any, amount)
    if (success) {
      console.log('Resource transferred successfully')
      showToast(`Successfully transferred ${amount} ${resourceType} to ${to}!`, 'success')
    } else {
      console.error('Failed to transfer resource')
      showToast(`Failed to transfer ${resourceType} to ${to}`, 'error')
    }
  }

  if (data.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading faction dashboard...</p>
        </div>
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
          <p>{data.error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Faction Selector */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Faction Dashboard Demo</h1>
          <div className="flex gap-4 flex-wrap">
            {FACTION_OPTIONS.map((faction) => (
              <button
                key={faction.id}
                onClick={() => setSelectedFaction(faction.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFaction === faction.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {faction.name}
              </button>
            ))}
          </div>
          <p className="text-gray-600 mt-2">
            Current: <span className="font-semibold">{FACTION_OPTIONS.find(f => f.id === selectedFaction)?.description}</span>
          </p>
        </div>
      </div>

      {/* Dashboard */}
      <FactionDashboard
        faction={data.faction}
        gameContext={gameContext}
        resources={data.resources}
        availableActions={data.availableActions}
        statusMetrics={data.statusMetrics}
        onActionSelect={handleActionSelect}
        onActionSubmit={handleActionSubmit}
        onResourceTransfer={handleResourceTransfer}
      />

      {/* Toast Notifications */}
      <ToastContainer />
      
      {/* Debug Info */}
      <div className="bg-gray-100 border-t p-4">
        <div className="max-w-7xl mx-auto">
          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Debug Information (Click to expand)
            </summary>
            <div className="bg-white p-4 rounded border space-y-2">
              <div><strong>Faction:</strong> {data.faction.name} ({data.faction.systemType})</div>
              <div><strong>Resources:</strong> {data.resources.length} types loaded</div>
              <div><strong>Actions:</strong> {data.availableActions.length} available</div>
              <div><strong>Metrics:</strong> {data.statusMetrics.length} status indicators</div>
              <div><strong>Game Context:</strong> Session {gameContext.sessionId}, Turn {gameContext.turnNumber}</div>
              <div><strong>Time Remaining:</strong> {Math.ceil((gameContext.timeRemaining || 0) / 60000)} minutes</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}