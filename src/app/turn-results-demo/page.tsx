/**
 * Turn Results Demo Page
 * 
 * Demonstrates the turn results display and history system
 * with sample data and interactive components.
 */

'use client'

import React, { useState } from 'react'
import { TurnResultsModal } from '@/components/TurnResultsModal'
import { TurnHistoryViewer } from '@/components/TurnHistoryViewer'
import { ResourceChangesCard } from '@/components/ResourceChangesCard'
import { ActionOutcomesList } from '@/components/ActionOutcomesList'
import { GlobalEventsCard } from '@/components/GlobalEventsCard'
import { ProcessedTurnResults, ProcessedResourceChange, ProcessedActionOutcome, GlobalEffectsSummary, FactionInteraction } from '@/lib/game/results'

export default function TurnResultsDemoPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedDemo, setSelectedDemo] = useState<'components' | 'modal' | 'history'>('components')

  // Sample data for demonstration
  const sampleResourceChanges: ProcessedResourceChange[] = [
    {
      factionId: 'meadow-moles',
      factionName: 'Meadow Moles',
      resourceType: 'food',
      resourceName: 'Food',
      oldQuantity: 12,
      newQuantity: 18,
      delta: 6,
      deltaFormatted: '+6',
      reason: 'Harvest action',
      phase: 'gather',
      isPositive: true
    },
    {
      factionId: 'oakshield-badgers',
      factionName: 'Oakshield Badgers',
      resourceType: 'timber',
      resourceName: 'Timber',
      oldQuantity: 8,
      newQuantity: 14,
      delta: 6,
      deltaFormatted: '+6',
      reason: 'Logging action',
      phase: 'gather',
      isPositive: true
    },
    {
      factionId: 'starling-scholars',
      factionName: 'Starling Scholars',
      resourceType: 'magic_crystals',
      resourceName: 'Magic Crystals',
      oldQuantity: 5,
      newQuantity: 2,
      delta: -3,
      deltaFormatted: '-3',
      reason: 'Research spell',
      phase: 'consumption',
      isPositive: false
    },
    {
      factionId: 'river-otters',
      factionName: 'River Otters',
      resourceType: 'fiber',
      resourceName: 'Fiber',
      oldQuantity: 10,
      newQuantity: 15,
      delta: 5,
      deltaFormatted: '+5',
      reason: 'Trade with Meadow Moles',
      phase: 'exchange',
      isPositive: true
    }
  ]

  const sampleActionOutcomes: ProcessedActionOutcome[] = [
    {
      actionId: 'action-1',
      actionType: 'gather',
      actionTypeFormatted: 'Gather',
      success: true,
      factionId: 'meadow-moles',
      factionName: 'Meadow Moles',
      resourceCosts: [],
      resourceGains: [sampleResourceChanges[0]],
      effects: ['Harvest yielded extra food due to favorable weather'],
      errors: [],
      warnings: []
    },
    {
      actionId: 'action-2',
      actionType: 'research',
      actionTypeFormatted: 'Research',
      success: true,
      factionId: 'starling-scholars',
      factionName: 'Starling Scholars',
      resourceCosts: [sampleResourceChanges[2]],
      resourceGains: [],
      effects: ['Unlocked Enhanced Divination ability', 'Gained insight into upcoming events'],
      errors: [],
      warnings: []
    },
    {
      actionId: 'action-3',
      actionType: 'trade',
      actionTypeFormatted: 'Trade',
      success: false,
      factionId: 'river-otters',
      factionName: 'River Otters',
      resourceCosts: [],
      resourceGains: [],
      effects: [],
      errors: ['Insufficient resources to complete trade'],
      warnings: ['Trade route may be disrupted next turn']
    }
  ]

  const sampleGlobalEffects: GlobalEffectsSummary = {
    foodShortagePenalty: 0,
    stabilityBonus: 2,
    insightBonus: 10,
    infrastructureBonus: 5,
    activeEffects: ['Stability Bonus', 'Insight Bonus', 'Infrastructure Bonus'],
    effectDescriptions: {
      'Stability Bonus': 'All factions gain +2 to protection actions due to peaceful cooperation',
      'Insight Bonus': 'Research actions are 10% more effective thanks to Scholar knowledge sharing',
      'Infrastructure Bonus': 'Building actions cost 5% fewer resources due to Badger engineering improvements'
    }
  }

  const sampleFactionInteractions: FactionInteraction[] = [
    {
      type: 'trade',
      fromFaction: 'Meadow Moles',
      toFaction: 'River Otters',
      resource: 'fiber',
      amount: 5,
      description: 'Successful resource exchange between allied factions'
    },
    {
      type: 'cooperation',
      fromFaction: 'Starling Scholars',
      toFaction: 'Oakshield Badgers',
      description: 'Scholars provided magical enhancement to Badger construction projects'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Turn Results System Demo</h1>
            <p className="mt-2 text-gray-600">
              Interactive demonstration of the turn results display and history system for Havenwood Kingdoms.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSelectedDemo('components')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedDemo === 'components'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Individual Components
            </button>
            <button
              onClick={() => setSelectedDemo('modal')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedDemo === 'modal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Full Results Modal
            </button>
            <button
              onClick={() => setSelectedDemo('history')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedDemo === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📚 History Viewer
            </button>
          </div>

          {/* Content */}
          {selectedDemo === 'components' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Resource Changes Card</h2>
                <ResourceChangesCard 
                  changes={sampleResourceChanges}
                  title="Turn 5 Resource Changes"
                  showViewMore={true}
                  groupByFaction={true}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Action Outcomes List</h2>
                <ActionOutcomesList 
                  outcomes={sampleActionOutcomes}
                  title="Turn 5 Action Outcomes"
                  showViewMore={true}
                  showResourceDetails={true}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Global Events Card</h2>
                <GlobalEventsCard 
                  globalEffects={sampleGlobalEffects}
                  factionInteractions={sampleFactionInteractions}
                />
              </div>
            </div>
          )}

          {selectedDemo === 'modal' && (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Turn Results Modal</h2>
              <p className="text-gray-600 mb-6">
                The Turn Results Modal combines all components into a comprehensive turn summary.
                This demo shows a static version - in the real game, it would fetch live data from the API.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                🎯 Open Turn Results Modal
              </button>
              
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a demo version. In the actual game, the modal would:
                  <ul className="list-disc list-inside mt-2 text-left max-w-md mx-auto">
                    <li>Fetch real turn results from the API</li>
                    <li>Allow navigation between different turns</li>
                    <li>Show data specific to the current game session</li>
                    <li>Display real faction names and resources</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {selectedDemo === 'history' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Turn History Viewer</h2>
              <p className="text-gray-600 mb-6">
                The History Viewer provides a comprehensive overview of all turns in a game session.
                This demo shows how the component would look - in the real game, it would connect to live data.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-yellow-800">
                  <strong>Demo Note:</strong> This component requires a valid session ID to fetch real data.
                  The component shown here demonstrates the UI structure and will show &quot;No turn history available&quot;
                  since there&apos;s no real session data in this demo environment.
                </div>
              </div>

              {/* Placeholder History Viewer - would need real sessionId in production */}
              <TurnHistoryViewer 
                sessionId="demo-session-id"
                currentTurn={5}
                className="bg-white"
                onTurnSelect={(turnNumber) => {
                  console.log(`Selected turn ${turnNumber}`)
                }}
              />
            </div>
          )}

          {/* API Endpoints Documentation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">🔗 API Endpoints</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Turn Results</h3>
                <code className="text-sm text-blue-600">/api/results/[turnId]</code>
                <p className="text-sm text-gray-600 mt-2">
                  Retrieves detailed results for a specific turn including resource changes, 
                  action outcomes, and global effects.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Turn History</h3>
                <code className="text-sm text-blue-600">/api/results/history/[sessionId]</code>
                <p className="text-sm text-gray-600 mt-2">
                  Retrieves paginated turn history for a game session with summary statistics 
                  and filtering options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal - Shows with sample data */}
      {showModal && (
        <DemoTurnResultsModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

/**
 * Demo version of Turn Results Modal with sample data
 */
function DemoTurnResultsModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'summary' | 'resources' | 'actions' | 'events'>('summary')

  // Sample processed results
  const sampleResults: ProcessedTurnResults = {
    id: 'demo-turn-result',
    sessionId: 'demo-session',
    turnNumber: 5,
    resolvedAt: new Date().toISOString(),
    resourceChanges: [
      {
        factionId: 'meadow-moles',
        factionName: 'Meadow Moles',
        resourceType: 'food',
        resourceName: 'Food',
        oldQuantity: 12,
        newQuantity: 18,
        delta: 6,
        deltaFormatted: '+6',
        reason: 'Harvest action',
        phase: 'gather',
        isPositive: true
      },
      {
        factionId: 'oakshield-badgers',
        factionName: 'Oakshield Badgers',
        resourceType: 'timber',
        resourceName: 'Timber',
        oldQuantity: 8,
        newQuantity: 14,
        delta: 6,
        deltaFormatted: '+6',
        reason: 'Logging action',
        phase: 'gather',
        isPositive: true
      }
    ],
    actionOutcomes: [
      {
        actionId: 'action-1',
        actionType: 'gather',
        actionTypeFormatted: 'Gather',
        success: true,
        factionId: 'meadow-moles',
        factionName: 'Meadow Moles',
        resourceCosts: [],
        resourceGains: [],
        effects: ['Harvest yielded extra food'],
        errors: [],
        warnings: []
      }
    ],
    globalEffects: {
      foodShortagePenalty: 0,
      stabilityBonus: 2,
      insightBonus: 10,
      infrastructureBonus: 5,
      activeEffects: ['Stability Bonus', 'Insight Bonus'],
      effectDescriptions: {
        'Stability Bonus': 'All factions gain +2 to protection actions',
        'Insight Bonus': 'Research actions are 10% more effective'
      }
    },
    factionInteractions: [],
    summary: {
      totalActions: 4,
      successfulActions: 3,
      failedActions: 1,
      resourcesGenerated: 12,
      resourcesConsumed: 3,
      factionsActive: 4,
      resolutionTime: 1250,
      resolutionTimeFormatted: '1.3s'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">Turn 5 Results (Demo)</h2>
            <div className="text-sm opacity-90">
              Resolved: {new Date().toLocaleString()}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b bg-gray-50 px-4">
          <div className="flex space-x-6">
            {[
              { id: 'summary', label: 'Summary', icon: '📊' },
              { id: 'resources', label: 'Resources', icon: '💎' },
              { id: 'actions', label: 'Actions', icon: '⚡' },
              { id: 'events', label: 'Events', icon: '🌟' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-2 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">4</div>
                  <div className="text-sm text-blue-800">Total Actions</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-green-800">Successful</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-sm text-red-800">Failed</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">4</div>
                  <div className="text-sm text-purple-800">Factions Active</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">
                  <strong>Resolution Time:</strong> 1.3s • 
                  <strong>Resources Generated:</strong> 12 • 
                  <strong>Resources Consumed:</strong> 3
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <ResourceChangesCard 
              changes={sampleResults.resourceChanges}
              className="border-0 p-0 shadow-none"
            />
          )}

          {activeTab === 'actions' && (
            <ActionOutcomesList 
              outcomes={sampleResults.actionOutcomes}
              className="border-0 p-0 shadow-none"
            />
          )}

          {activeTab === 'events' && (
            <GlobalEventsCard 
              globalEffects={sampleResults.globalEffects}
              factionInteractions={sampleResults.factionInteractions}
              className="border-0 p-0 shadow-none"
            />
          )}
        </div>
      </div>
    </div>
  )
}