/**
 * Victory/Defeat Conditions System Demo
 * 
 * This page demonstrates the victory and defeat condition system,
 * allowing users to test different scenarios and see the UI components in action.
 */

'use client'

import React, { useState } from 'react'
import VictoryScreen from '@/components/VictoryScreen'
import DefeatScreen from '@/components/DefeatScreen'
import MiniGoalsTracker from '@/components/MiniGoalsTracker'

interface TestScenario {
  id: string
  name: string
  description: string
  type: 'victory' | 'defeat'
  victoryType?: 'project_completion' | 'mini_goals'
  defeatReason?: 'famine' | 'instability' | 'destruction' | 'timeout'
  mockData: any
}

const TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'project_victory',
    name: 'Project Completion Victory',
    description: 'All factions worked together to complete the shared project successfully.',
    type: 'victory',
    victoryType: 'project_completion',
    mockData: {
      sessionId: 'demo-session-001',
      finalTurn: 6,
      projectProgress: {
        current_stage: 3,
        is_completed: true,
        stage_contributions: {
          timber: 30,
          fiber: 25,
          magic_crystals: 20
        }
      }
    }
  },
  {
    id: 'mini_goals_victory',
    name: 'Mini-Goals Victory',
    description: 'All factions achieved their individual objectives while maintaining survival.',
    type: 'victory',
    victoryType: 'mini_goals',
    mockData: {
      sessionId: 'demo-session-002',
      finalTurn: 8,
      factionGoals: {
        'player-1': { factionType: 'Meadow Moles', completed: 3, total: 3 },
        'player-2': { factionType: 'Oakshield Badgers', completed: 3, total: 3 },
        'player-3': { factionType: 'Starling Scholars', completed: 3, total: 3 },
        'player-4': { factionType: 'River Otters', completed: 3, total: 3 }
      }
    }
  },
  {
    id: 'famine_defeat',
    name: 'Famine Defeat',
    description: 'Food supplies were exhausted, leading to kingdom collapse.',
    type: 'defeat',
    defeatReason: 'famine',
    mockData: {
      sessionId: 'demo-session-003',
      finalTurn: 4,
      survivalMetrics: {
        food: -2,
        stability: 5,
        protection: 3,
        totalResources: 15
      },
      projectProgress: {
        current_stage: 2,
        is_completed: false
      }
    }
  },
  {
    id: 'instability_defeat',
    name: 'Instability Defeat',
    description: 'Political chaos and rebellion overwhelmed the kingdoms.',
    type: 'defeat',
    defeatReason: 'instability',
    mockData: {
      sessionId: 'demo-session-004',
      finalTurn: 5,
      survivalMetrics: {
        food: 8,
        stability: -1,
        protection: 4,
        totalResources: 20
      }
    }
  },
  {
    id: 'destruction_defeat',
    name: 'Destruction Defeat',
    description: 'Inadequate defenses led to destruction by external threats.',
    type: 'defeat',
    defeatReason: 'destruction',
    mockData: {
      sessionId: 'demo-session-005',
      finalTurn: 6,
      survivalMetrics: {
        food: 6,
        stability: 3,
        protection: 0,
        totalResources: 18
      }
    }
  },
  {
    id: 'timeout_defeat',
    name: 'Timeout Defeat',
    description: 'Time ran out before the shared project could be completed.',
    type: 'defeat',
    defeatReason: 'timeout',
    mockData: {
      sessionId: 'demo-session-006',
      finalTurn: 8,
      survivalMetrics: {
        food: 10,
        stability: 8,
        protection: 6,
        totalResources: 35
      },
      projectProgress: {
        current_stage: 2,
        is_completed: false
      }
    }
  }
]

export default function VictoryDefeatDemo() {
  const [selectedScenario, setSelectedScenario] = useState<TestScenario | null>(null)
  const [showMiniGoals, setShowMiniGoals] = useState(false)
  const [apiTestResults, setApiTestResults] = useState<any>(null)
  const [apiTesting, setApiTesting] = useState(false)

  const testConditionCheckingAPI = async () => {
    setApiTesting(true)
    setApiTestResults(null)
    
    try {
      const response = await fetch('/api/game/check-conditions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'test-session-123',
          currentTurn: 5
        })
      })
      
      const result = await response.json()
      setApiTestResults(result)
    } catch (error) {
      setApiTestResults({
        error: 'API test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setApiTesting(false)
    }
  }

  const testMiniGoalsAPI = async () => {
    try {
      const response = await fetch('/api/game/mini-goals/test-session-123')
      const result = await response.json()
      console.log('Mini-goals API test:', result)
    } catch (error) {
      console.error('Mini-goals API test failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Victory/Defeat Conditions Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test and preview the victory and defeat condition system for Havenwood Kingdoms. 
            Try different scenarios to see how the game ends and what feedback players receive.
          </p>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-green-600 mb-2">Victory Conditions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Project Completion:</strong> Shared project fully completed before final turn</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Mini-Goals:</strong> All factions achieve their objectives + survival maintained</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-600 mb-2">Defeat Conditions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Famine:</strong> Food supplies exhausted</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Instability:</strong> Political collapse (stability ≤ 0)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Destruction:</strong> Inadequate protection</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Timeout:</strong> Project incomplete at final turn</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Test Scenarios */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test Scenarios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEST_SCENARIOS.map(scenario => (
              <div 
                key={scenario.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  scenario.type === 'victory' 
                    ? 'hover:border-green-300 hover:bg-green-50' 
                    : 'hover:border-red-300 hover:bg-red-50'
                }`}
                onClick={() => setSelectedScenario(scenario)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-2xl ${scenario.type === 'victory' ? '🎉' : '💀'}`}>
                    {scenario.type === 'victory' ? '🎉' : '💀'}
                  </span>
                  <h3 className={`font-medium ${
                    scenario.type === 'victory' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {scenario.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">{scenario.description}</p>
                <button className={`mt-3 text-xs px-3 py-1 rounded ${
                  scenario.type === 'victory'
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}>
                  Preview
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Testing */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Testing</h2>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={testConditionCheckingAPI}
              disabled={apiTesting}
              className={`px-4 py-2 rounded font-medium ${
                apiTesting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {apiTesting ? 'Testing...' : 'Test Check Conditions API'}
            </button>
            <button
              onClick={testMiniGoalsAPI}
              className="px-4 py-2 rounded font-medium bg-purple-600 text-white hover:bg-purple-700"
            >
              Test Mini-Goals API
            </button>
            <button
              onClick={() => setShowMiniGoals(!showMiniGoals)}
              className="px-4 py-2 rounded font-medium bg-green-600 text-white hover:bg-green-700"
            >
              {showMiniGoals ? 'Hide' : 'Show'} Mini-Goals Tracker
            </button>
          </div>

          {apiTestResults && (
            <div className="bg-gray-50 rounded p-4">
              <h3 className="font-medium mb-2">API Test Results:</h3>
              <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
                {JSON.stringify(apiTestResults, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Mini-Goals Tracker Demo */}
        {showMiniGoals && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Mini-Goals Tracker Demo</h2>
            <MiniGoalsTracker 
              sessionId="demo-session" 
              showAllPlayers={true}
              compact={false}
            />
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">How to Use This Demo</h3>
          <ul className="space-y-2 text-blue-700 text-sm">
            <li>• Click on any test scenario above to preview the victory or defeat screen</li>
            <li>• Use the API testing buttons to verify the endpoints work correctly</li>
            <li>• The Mini-Goals Tracker shows how faction progress is displayed to players</li>
            <li>• Each screen includes appropriate messaging and visual feedback</li>
            <li>• Victory screens celebrate success, defeat screens provide learning opportunities</li>
          </ul>
        </div>
      </div>

      {/* Modal Overlays */}
      {selectedScenario && selectedScenario.type === 'victory' && (
        <VictoryScreen
          victoryType={selectedScenario.victoryType!}
          sessionId={selectedScenario.mockData.sessionId}
          finalTurn={selectedScenario.mockData.finalTurn}
          projectProgress={selectedScenario.mockData.projectProgress}
          factionGoals={selectedScenario.mockData.factionGoals}
          onContinue={() => setSelectedScenario(null)}
        />
      )}

      {selectedScenario && selectedScenario.type === 'defeat' && (
        <DefeatScreen
          defeatReason={selectedScenario.defeatReason!}
          sessionId={selectedScenario.mockData.sessionId}
          finalTurn={selectedScenario.mockData.finalTurn}
          survivalMetrics={selectedScenario.mockData.survivalMetrics}
          projectProgress={selectedScenario.mockData.projectProgress}
          onContinue={() => setSelectedScenario(null)}
        />
      )}
    </div>
  )
}