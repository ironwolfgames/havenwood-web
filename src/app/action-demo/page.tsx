/**
 * Action Selection Demo Page
 * 
 * Demonstrates the action selection and storage system
 * with sample data and interactive components.
 */

'use client'

import React, { useState } from 'react'
import { ActionSelectionArea, ActionOption } from '@/components/ActionSelectionArea'
import { FactionActionForm } from '@/components/FactionActionForm'
import { ActionHistory } from '@/components/ActionHistory'
import { GameActionType } from '@/types/game'

export default function ActionSelectionDemo() {
  const [selectedFaction, setSelectedFaction] = useState<'provisioner' | 'guardian' | 'mystic' | 'explorer'>('provisioner')
  const [selectedAction, setSelectedAction] = useState<ActionOption | undefined>()
  const [actionParameters, setActionParameters] = useState<Record<string, any>>({})
  const [submittedActions, setSubmittedActions] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Sample available actions for each faction
  const availableActions: ActionOption[] = [
    {
      id: 'gather-1',
      type: 'gather' as GameActionType,
      name: 'Gather Resources',
      description: 'Collect basic resources from your faction\'s specialization',
      costs: { food: 1 },
      enabled: true
    },
    {
      id: 'trade-1',
      type: 'trade' as GameActionType,
      name: 'Trade Resources',
      description: 'Exchange resources with other factions or the global pool',
      costs: {},
      enabled: true
    },
    {
      id: 'build-1',
      type: 'build' as GameActionType,
      name: 'Construct Building',
      description: 'Build structures to improve your faction\'s capabilities',
      costs: { timber: 2, fiber: 1 },
      enabled: selectedFaction === 'explorer'
    },
    {
      id: 'research-1',
      type: 'research' as GameActionType,
      name: 'Research Technology',
      description: 'Advance knowledge to unlock new abilities and improvements',
      costs: { insight_tokens: 1 },
      enabled: selectedFaction === 'mystic'
    },
    {
      id: 'protect-1',
      type: 'protect' as GameActionType,
      name: 'Defend Territory',
      description: 'Generate protection tokens to safeguard against threats',
      costs: { protection_tokens: 1 },
      enabled: selectedFaction === 'guardian'
    },
    {
      id: 'special-1',
      type: 'special' as GameActionType,
      name: 'Faction Ability',
      description: 'Use your faction\'s unique special ability',
      costs: { magic_crystals: selectedFaction === 'mystic' ? 2 : 1 },
      enabled: true
    }
  ]

  const handleActionSelect = (action: ActionOption) => {
    setSelectedAction(action)
    setActionParameters({})
  }

  const handleActionSubmit = async (action: ActionOption, parameters: Record<string, any>) => {
    // Simulate API call
    console.log('Submitting action:', { action, parameters })
    
    const actionData = {
      id: `action-${Date.now()}`,
      type: action.type,
      name: action.name,
      parameters,
      faction: selectedFaction,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    }
    
    setSubmittedActions(prev => [actionData, ...prev])
    
    // Show success message
    alert(`Action "${action.name}" submitted successfully!`)
    
    // Reset selection
    setSelectedAction(undefined)
    setActionParameters({})
  }

  const handleParameterChange = (key: string, value: any) => {
    setActionParameters(prev => ({ ...prev, [key]: value }))
  }

  const lockActions = () => {
    if (submittedActions.length === 0) {
      alert('No actions to lock!')
      return
    }
    
    setSubmittedActions(prev => prev.map(action => ({
      ...action,
      status: 'locked',
      lockedAt: new Date().toISOString()
    })))
    
    alert('All actions locked for turn resolution!')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Player Action Selection System
          </h1>
          <p className="text-gray-600">
            Demo of the faction-based action selection and storage system
          </p>
        </div>

        {/* Faction Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Your Faction</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'provisioner', name: 'Meadow Moles', icon: '🌱', color: 'green' },
              { type: 'guardian', name: 'Oakshield Badgers', icon: '🛡️', color: 'blue' },
              { type: 'mystic', name: 'Starling Scholars', icon: '🔮', color: 'purple' },
              { type: 'explorer', name: 'River Otters', icon: '🚢', color: 'teal' }
            ].map((faction) => (
              <button
                key={faction.type}
                onClick={() => setSelectedFaction(faction.type as any)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  selectedFaction === faction.type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{faction.icon}</div>
                <div className="font-medium text-sm">{faction.name}</div>
                <div className="text-xs text-gray-500 capitalize">{faction.type}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Action Selection Panel */}
          <div>
            <ActionSelectionArea
              availableActions={availableActions}
              selectedAction={selectedAction}
              onActionSelect={handleActionSelect}
              onActionSubmit={handleActionSubmit}
              className="mb-6"
            />

            {/* Faction-Specific Form */}
            {selectedAction && (
              <div className="bg-white border rounded-lg p-4">
                <FactionActionForm
                  factionType={selectedFaction}
                  actionType={selectedAction.type}
                  parameters={actionParameters}
                  onParameterChange={handleParameterChange}
                />
              </div>
            )}
          </div>

          {/* Action Management Panel */}
          <div>
            <div className="bg-white border rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg mb-4">Turn Management</h3>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Current Turn: <span className="font-medium">Turn 1</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  Submitted Actions: <span className="font-medium">{submittedActions.length}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  Status: <span className="font-medium">
                    {submittedActions.some(a => a.status === 'locked') 
                      ? '🔒 Locked' 
                      : submittedActions.length > 0 
                        ? '📝 Actions Pending'
                        : '⏳ Waiting for Actions'
                    }
                  </span>
                </div>

                <div className="pt-3 border-t flex gap-2">
                  <button
                    onClick={lockActions}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                    disabled={submittedActions.length === 0 || submittedActions.some(a => a.status === 'locked')}
                  >
                    🔒 Lock Actions
                  </button>
                  
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    📋 {showHistory ? 'Hide' : 'Show'} History
                  </button>
                </div>
              </div>
            </div>

            {/* Submitted Actions Preview */}
            {submittedActions.length > 0 && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Your Actions This Turn</h3>
                <div className="space-y-2">
                  {submittedActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{action.name}</div>
                        <div className="text-xs text-gray-500">
                          {Object.entries(action.parameters).length > 0 
                            ? JSON.stringify(action.parameters)
                            : 'No parameters'
                          }
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        action.status === 'locked' 
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {action.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action History (when enabled) */}
        {showHistory && (
          <div className="mt-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="text-sm text-yellow-800">
                📋 <strong>Note:</strong> Action History component requires a real Supabase connection to function.
                This demo shows the UI structure only.
              </div>
            </div>
            <ActionHistory
              sessionId="demo-session"
              playerId="demo-player"
              turnNumber={1}
              maxItems={5}
              showAllPlayers={false}
            />
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4 text-blue-900">How to Use This Demo</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Select a faction to see faction-specific available actions</li>
            <li>Click on an available action to see its details and parameters</li>
            <li>Configure action parameters using the faction-specific form</li>
            <li>Click &quot;Submit Action&quot; to add it to your turn submissions</li>
            <li>Use &quot;Lock Actions&quot; to finalize your turn (prevents further changes)</li>
            <li>View submitted actions in the management panel</li>
            <li>Toggle action history to see the audit trail interface</li>
          </ol>
          
          <div className="mt-4 text-xs text-blue-700">
            <strong>API Endpoints Available:</strong><br />
            • POST /api/actions/submit - Submit new actions<br />
            • PUT /api/actions/modify - Modify existing actions<br />
            • POST /api/actions/lock - Lock actions for resolution<br />
            • GET /api/actions/query - Query action history
          </div>
        </div>
      </div>
    </div>
  )
}