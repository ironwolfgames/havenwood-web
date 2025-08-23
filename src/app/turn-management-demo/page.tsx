/**
 * Turn Management Demo Page
 * 
 * Demonstrates all turn management UI components with sample data.
 * Shows different game phases and component interactions.
 */

'use client'

import React, { useState } from 'react'
import TurnManagementPanel from '@/components/turn/TurnManagementPanel'
import { TurnTimerConfig } from '@/types/turn-management'
import { DEFAULT_TIMER_CONFIG } from '@/lib/turn-timer'

export default function TurnManagementDemoPage() {
  const [sessionId] = useState('demo-session-123')
  const [currentPlayerId, setCurrentPlayerId] = useState('player-2')
  const [isSessionCreator, setIsSessionCreator] = useState(false)
  const [timerConfig, setTimerConfig] = useState<TurnTimerConfig>(DEFAULT_TIMER_CONFIG)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Turn Management UI Demo
          </h1>
          <p className="text-lg text-gray-600">
            Interactive demonstration of all turn management components
          </p>
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-4xl mx-auto">
            <div className="text-sm text-yellow-800">
              <strong>Demo Features:</strong> Complete turn management system including timer, player readiness tracking, 
              phase transitions, and resolution progress. All components work with sample data and simulate real gameplay.
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            🎮 Demo Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Player Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Play as Player:
              </label>
              <select
                value={currentPlayerId}
                onChange={(e) => setCurrentPlayerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="player-1">Alice (Meadow Moles) - Host</option>
                <option value="player-2">Bob (Oakshield Badgers)</option>
                <option value="player-3">Charlie (Starling Scholars)</option>
                <option value="player-4">Diana (River Otters)</option>
              </select>
            </div>

            {/* Session Creator Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Role:
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSessionCreator}
                    onChange={(e) => setIsSessionCreator(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Session Creator (extra controls)
                  </span>
                </label>
              </div>
            </div>

            {/* Timer Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timer Duration:
              </label>
              <select
                value={timerConfig.durationMinutes}
                onChange={(e) => setTimerConfig(prev => ({
                  ...prev,
                  durationMinutes: Number(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>1 minute (demo)</option>
                <option value={2}>2 minutes</option>
                <option value={3}>3 minutes</option>
                <option value={5}>5 minutes</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={timerConfig.soundEnabled}
                onChange={(e) => setTimerConfig(prev => ({
                  ...prev,
                  soundEnabled: e.target.checked
                }))}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">
                🔊 Sound Alerts Enabled
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={timerConfig.autoResolve}
                onChange={(e) => setTimerConfig(prev => ({
                  ...prev,
                  autoResolve: e.target.checked
                }))}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">
                ⚡ Auto-resolve on Timer Expiry
              </span>
            </label>
          </div>
        </div>

        {/* Component Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            📋 Components Included
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h3 className="font-medium text-blue-800 mb-2">🎯 Turn Status Display</h3>
              <p className="text-blue-700">
                Shows current turn progress, phase information, and session timing
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h3 className="font-medium text-green-800 mb-2">⏱️ Turn Timer</h3>
              <p className="text-green-700">
                Configurable countdown with visual alerts and session creator controls
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h3 className="font-medium text-purple-800 mb-2">👥 Player Readiness</h3>
              <p className="text-purple-700">
                Real-time player status, action submission tracking, and readiness indicators
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h3 className="font-medium text-yellow-800 mb-2">⚙️ Resolution Progress</h3>
              <p className="text-yellow-700">
                Turn processing progress with detailed step information and error handling
              </p>
            </div>
            
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
              <h3 className="font-medium text-pink-800 mb-2">🔄 Phase Transitions</h3>
              <p className="text-pink-700">
                Smooth transitions between game phases with notifications and countdowns
              </p>
            </div>
            
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
              <h3 className="font-medium text-teal-800 mb-2">🎮 Management Panel</h3>
              <p className="text-teal-700">
                Main container that orchestrates all components for complete turn management
              </p>
            </div>
          </div>
        </div>

        {/* Main Demo Component */}
        <TurnManagementPanel
          sessionId={sessionId}
          currentPlayerId={currentPlayerId}
          isSessionCreator={isSessionCreator}
          timerConfig={timerConfig}
        />

        {/* Usage Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-blue-800 mb-4">
            📖 How to Use This Demo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-700">
            <div>
              <h3 className="font-medium mb-2">👤 Player Perspective:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Change player selection to see different views</li>
                <li>Toggle readiness status with the button</li>
                <li>Watch timer countdown and alerts</li>
                <li>Observe other players&apos; status in real-time</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">👑 Session Creator Controls:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Enable &quot;Session Creator&quot; to see host controls</li>
                <li>Start, pause, and extend timers</li>
                <li>Force turn resolution when needed</li>
                <li>Manage overall game flow</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Notes */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6 text-xs">
          <h3 className="font-medium text-gray-800 mb-2">🔧 Technical Implementation</h3>
          <div className="text-gray-600 space-y-1">
            <div><strong>Real-time Integration:</strong> Uses Supabase subscriptions for live updates</div>
            <div><strong>Timer Synchronization:</strong> Client-side timers with server sync for accuracy</div>
            <div><strong>Audio Alerts:</strong> Web Audio API for configurable sound notifications</div>
            <div><strong>Responsive Design:</strong> TailwindCSS with mobile-first approach</div>
            <div><strong>Accessibility:</strong> ARIA labels and keyboard navigation support</div>
            <div><strong>State Management:</strong> React hooks with TypeScript for type safety</div>
          </div>
        </div>
      </div>
    </div>
  )
}