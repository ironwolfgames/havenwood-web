/**
 * Defeat screen component for analyzing game failure
 */

'use client'

import React from 'react'

export interface DefeatScreenProps {
  defeatReason: 'famine' | 'instability' | 'destruction' | 'timeout'
  sessionId: string
  finalTurn: number
  survivalMetrics?: any
  projectProgress?: any
  onContinue?: () => void
}

const DEFEAT_MESSAGES = {
  famine: {
    title: 'Famine Strikes',
    description: 'Food supplies have been exhausted, leading to the collapse of the kingdoms.',
    icon: '🌾',
    color: 'red'
  },
  instability: {
    title: 'Political Collapse',
    description: 'Kingdom stability has fallen too low, causing widespread rebellion and chaos.',
    icon: '⚖️',
    color: 'orange'
  },
  destruction: {
    title: 'Overwhelmed Defenses',
    description: 'Without adequate protection, the kingdoms have been overrun by threats.',
    icon: '🛡️',
    color: 'red'
  },
  timeout: {
    title: 'Time Runs Out',
    description: 'The shared project was not completed in time, and the kingdoms could not be saved.',
    icon: '⏰',
    color: 'gray'
  }
}

export default function DefeatScreen({
  defeatReason,
  sessionId,
  finalTurn,
  survivalMetrics,
  projectProgress,
  onContinue
}: DefeatScreenProps) {
  const defeatInfo = DEFEAT_MESSAGES[defeatReason]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Defeat Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{defeatInfo.icon}</div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">
              Defeat
            </h1>
            <p className="text-xl text-gray-600">
              {defeatInfo.title}
            </p>
          </div>

          {/* Defeat Details */}
          <div className="bg-red-50 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-red-800 mb-3">
              What Went Wrong?
            </h2>
            <p className="text-red-700 mb-4">
              {defeatInfo.description}
            </p>
            
            {/* Specific Analysis */}
            {survivalMetrics && (
              <div className="bg-white rounded p-4 mb-4">
                <h3 className="font-semibold mb-3">Final Resource Status:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-2 rounded ${survivalMetrics.food <= 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    <div className="font-medium">Food</div>
                    <div className={survivalMetrics.food <= 0 ? 'text-red-600' : 'text-green-600'}>
                      {survivalMetrics.food}
                    </div>
                  </div>
                  <div className={`p-2 rounded ${survivalMetrics.stability <= 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    <div className="font-medium">Stability</div>
                    <div className={survivalMetrics.stability <= 0 ? 'text-red-600' : 'text-green-600'}>
                      {survivalMetrics.stability}
                    </div>
                  </div>
                  <div className={`p-2 rounded ${survivalMetrics.protection <= 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    <div className="font-medium">Protection</div>
                    <div className={survivalMetrics.protection <= 0 ? 'text-red-600' : 'text-green-600'}>
                      {survivalMetrics.protection}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-gray-100">
                    <div className="font-medium">Total Resources</div>
                    <div className="text-gray-600">{survivalMetrics.totalResources}</div>
                  </div>
                </div>
              </div>
            )}

            {projectProgress && (
              <div className="bg-white rounded p-4">
                <h3 className="font-semibold mb-2">Project Progress:</h3>
                <div className="mb-2">
                  <span className="font-medium">Stage:</span> {projectProgress.current_stage}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Completed:</span> {projectProgress.is_completed ? 'Yes' : 'No'}
                </div>
                {!projectProgress.is_completed && (
                  <p className="text-sm text-gray-600 mt-2">
                    The shared project needed to be completed to ensure victory.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Learning Points */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              💡 Lessons Learned
            </h3>
            <ul className="space-y-2 text-blue-700">
              {defeatReason === 'famine' && (
                <>
                  <li>• Focus more on food production early in the game</li>
                  <li>• Consider trading resources to maintain food supplies</li>
                  <li>• The Meadow Moles (Provisioners) are key for food security</li>
                </>
              )}
              {defeatReason === 'instability' && (
                <>
                  <li>• Stability tokens are crucial for maintaining order</li>
                  <li>• Balance resource production with stability maintenance</li>
                  <li>• The Oakshield Badgers (Guardians) help with stability</li>
                </>
              )}
              {defeatReason === 'destruction' && (
                <>
                  <li>• Protection tokens defend against external threats</li>
                  <li>• Don&apos;t neglect defensive preparations</li>
                  <li>• Build fortifications and protection early</li>
                </>
              )}
              {defeatReason === 'timeout' && (
                <>
                  <li>• Focus on shared project contributions</li>
                  <li>• Coordinate faction efforts more effectively</li>
                  <li>• Don&apos;t wait too long to start major contributions</li>
                </>
              )}
            </ul>
          </div>

          {/* Game Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{finalTurn}</div>
              <div className="text-sm text-red-800">Final Turn</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{sessionId.slice(0, 8)}...</div>
              <div className="text-sm text-purple-800">Session ID</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {onContinue && (
              <button
                onClick={onContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Continue
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}