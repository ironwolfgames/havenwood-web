/**
 * Victory screen component for celebrating game success
 */

'use client'

import React from 'react'

export interface VictoryScreenProps {
  victoryType: 'project_completion' | 'mini_goals'
  sessionId: string
  finalTurn: number
  projectProgress?: any
  factionGoals?: any
  onContinue?: () => void
}

export default function VictoryScreen({
  victoryType,
  sessionId,
  finalTurn,
  projectProgress,
  factionGoals,
  onContinue
}: VictoryScreenProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Victory Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-green-600 mb-2">
              Victory!
            </h1>
            <p className="text-xl text-gray-600">
              The kingdoms of Havenwood have succeeded!
            </p>
          </div>

          {/* Victory Details */}
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            {victoryType === 'project_completion' && (
              <div>
                <h2 className="text-2xl font-semibold text-green-800 mb-3">
                  Shared Project Completed!
                </h2>
                <p className="text-green-700 mb-4">
                  Through cooperation and determination, all factions worked together 
                  to complete the shared project and secure the future of Havenwood.
                </p>
                {projectProgress && (
                  <div className="bg-white rounded p-4">
                    <h3 className="font-semibold mb-2">Project Status:</h3>
                    <p>Stage: {projectProgress.current_stage}</p>
                    <p>Completed: {projectProgress.is_completed ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            )}

            {victoryType === 'mini_goals' && (
              <div>
                <h2 className="text-2xl font-semibold text-green-800 mb-3">
                  All Faction Goals Achieved!
                </h2>
                <p className="text-green-700 mb-4">
                  Each faction successfully completed their unique objectives while 
                  maintaining the survival of all kingdoms.
                </p>
                {factionGoals && (
                  <div className="bg-white rounded p-4">
                    <h3 className="font-semibold mb-2">Faction Achievements:</h3>
                    {Object.entries(factionGoals).map(([playerId, data]: [string, any]) => (
                      <div key={playerId} className="mb-2">
                        <span className="font-medium">{data.factionType}:</span> 
                        <span className="ml-2">{data.completed}/{data.total} goals completed</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Game Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{finalTurn}</div>
              <div className="text-sm text-blue-800">Final Turn</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{sessionId.slice(0, 8)}...</div>
              <div className="text-sm text-purple-800">Session ID</div>
            </div>
          </div>

          {/* Celebration Message */}
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 mb-2">
              🌟 Congratulations to all players! 🌟
            </p>
            <p className="text-gray-600">
              Your cooperation and strategic thinking have saved the kingdoms of Havenwood.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {onContinue && (
              <button
                onClick={onContinue}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Continue
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}