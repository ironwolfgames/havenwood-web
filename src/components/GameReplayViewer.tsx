/**
 * Game Replay Viewer Component
 * 
 * Provides turn-by-turn replay functionality with resource flow visualization,
 * key moment highlighting, and action history for all players.
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { SessionReplayData, TurnReplayData, ReplayKeyMoment, GameStateSnapshot } from '@/types/endgame'
import { ResourceType } from '@/lib/game/resources'

export interface GameReplayViewerProps {
  replayData: SessionReplayData
  className?: string
  autoPlay?: boolean
  playbackSpeed?: number
  onClose?: () => void
}

export function GameReplayViewer({
  replayData,
  className = '',
  autoPlay = false,
  playbackSpeed = 1000, // ms between turns
  onClose
}: GameReplayViewerProps) {
  const [currentTurn, setCurrentTurn] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [playSpeed, setPlaySpeed] = useState(playbackSpeed)
  const [showKeyMomentsOnly, setShowKeyMomentsOnly] = useState(false)
  const [selectedView, setSelectedView] = useState<'overview' | 'resources' | 'actions'>('overview')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentTurn < replayData.turns.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentTurn(prev => Math.min(prev + 1, replayData.turns.length - 1))
      }, playSpeed)
    } else if (currentTurn >= replayData.turns.length - 1) {
      setIsPlaying(false)
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isPlaying, currentTurn, playSpeed, replayData.turns.length])

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const goToTurn = (turnIndex: number) => {
    setCurrentTurn(Math.max(0, Math.min(turnIndex, replayData.turns.length - 1)))
  }

  const goToPreviousTurn = () => {
    goToTurn(currentTurn - 1)
  }

  const goToNextTurn = () => {
    goToTurn(currentTurn + 1)
  }

  const goToKeyMoment = (moment: ReplayKeyMoment) => {
    goToTurn(moment.turn - 1) // Convert to 0-based index
  }

  const getCurrentTurnData = (): TurnReplayData => {
    return replayData.turns[currentTurn]
  }

  const formatResourceName = (type: ResourceType): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getResourceIcon = (type: ResourceType): string => {
    const icons: Record<ResourceType, string> = {
      food: '🌾',
      timber: '🪵',
      fiber: '🧵',
      protection_tokens: '🛡️',
      stability_tokens: '⚖️',
      magic_crystals: '💎',
      insight_tokens: '🧠',
      infrastructure_tokens: '🏗️',
      project_progress: '🏛️'
    }
    return icons[type] || '❓'
  }

  const getFactionIcon = (factionType: string): string => {
    const icons = {
      provisioner: '🐭',
      guardian: '🦡',
      mystic: '🐦',
      explorer: '🦦'
    }
    return icons[factionType as keyof typeof icons] || '❓'
  }

  const getResourceDelta = (before: GameStateSnapshot, after: GameStateSnapshot, factionId: string, resourceType: ResourceType): number => {
    const beforeAmount = before.resources[factionId]?.[resourceType] || 0
    const afterAmount = after.resources[factionId]?.[resourceType] || 0
    return afterAmount - beforeAmount
  }

  const renderPlaybackControls = () => (
    <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => goToTurn(0)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            title="Go to start"
          >
            ⏮️
          </button>
          
          <button
            onClick={goToPreviousTurn}
            disabled={currentTurn === 0}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Previous turn"
          >
            ⏪
          </button>
          
          <button
            onClick={togglePlayback}
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button
            onClick={goToNextTurn}
            disabled={currentTurn >= replayData.turns.length - 1}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Next turn"
          >
            ⏩
          </button>
          
          <button
            onClick={() => goToTurn(replayData.turns.length - 1)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            title="Go to end"
          >
            ⏭️
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm">Speed:</label>
            <select
              value={playSpeed}
              onChange={(e) => setPlaySpeed(Number(e.target.value))}
              className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
            >
              <option value={2000}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
              <option value={250}>4x</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowKeyMomentsOnly(!showKeyMomentsOnly)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              showKeyMomentsOnly 
                ? 'bg-yellow-600 hover:bg-yellow-500' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Key Moments
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-red-600 hover:bg-red-500 rounded transition-colors"
              title="Close replay"
            >
              ✖️
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Turn {currentTurn + 1} of {replayData.turns.length}</span>
          <span>{getCurrentTurnData().timestamp.toLocaleTimeString()}</span>
        </div>
        <div className="bg-gray-600 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-200"
            style={{ width: `${((currentTurn + 1) / replayData.turns.length) * 100}%` }}
          />
        </div>
        
        {/* Key Moments Markers */}
        <div className="relative mt-1">
          {replayData.keyMoments.map(moment => (
            <button
              key={`${moment.turn}-${moment.type}`}
              onClick={() => goToKeyMoment(moment)}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full transform -translate-x-1/2 hover:scale-125 transition-transform"
              style={{ left: `${(moment.turn / replayData.turns.length) * 100}%` }}
              title={`${moment.title} (Turn ${moment.turn})`}
            >
              <span className="sr-only">{moment.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderViewTabs = () => (
    <div className="border-b border-gray-200 mb-4">
      <nav className="flex space-x-8">
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'resources', label: '🌿 Resources', icon: '🌿' },
          { id: 'actions', label: '⚡ Actions', icon: '⚡' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id as any)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              selectedView === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )

  const renderOverviewView = () => {
    const turnData = getCurrentTurnData()
    const currentKeyMoment = replayData.keyMoments.find(moment => moment.turn === currentTurn + 1)

    return (
      <div className="space-y-4">
        {/* Current Key Moment */}
        {currentKeyMoment && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">⭐</span>
              <h3 className="font-semibold text-yellow-800">{currentKeyMoment.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                currentKeyMoment.impact === 'major' ? 'bg-red-100 text-red-800' :
                currentKeyMoment.impact === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {currentKeyMoment.impact} impact
              </span>
            </div>
            <p className="text-yellow-700">{currentKeyMoment.description}</p>
            {currentKeyMoment.participatingFactions.length > 0 && (
              <div className="mt-2">
                <span className="text-sm text-yellow-600">Participants: </span>
                <span className="text-sm">{currentKeyMoment.participatingFactions.join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {/* Turn Events */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Turn Events</h3>
          {turnData.events.length > 0 ? (
            <div className="space-y-2">
              {turnData.events.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-lg">
                    {event.type === 'resource_change' ? '💰' :
                     event.type === 'project_progress' ? '🏛️' :
                     event.type === 'special_action' ? '⭐' :
                     '🤝'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{event.description}</p>
                    {event.participants.length > 0 && (
                      <p className="text-xs text-gray-600">
                        Involving: {event.participants.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No significant events this turn</p>
          )}
        </div>

        {/* Project Progress Snapshot */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">🏛️ Project Progress</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Before Turn</div>
              <div className="font-medium">Stage {turnData.beforeState.projectProgress.stage}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">After Turn</div>
              <div className="font-medium">Stage {turnData.afterState.projectProgress.stage}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderResourcesView = () => {
    const turnData = getCurrentTurnData()
    const factionIds = Object.keys(turnData.beforeState.resources)

    return (
      <div className="space-y-4">
        {factionIds.map(factionId => (
          <div key={factionId} className="bg-white border rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <span>🏰</span>
              <span>Faction {factionId}</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.keys(turnData.beforeState.resources[factionId]).map(resourceType => {
                const delta = getResourceDelta(
                  turnData.beforeState,
                  turnData.afterState,
                  factionId,
                  resourceType as ResourceType
                )
                const beforeAmount = turnData.beforeState.resources[factionId][resourceType as ResourceType]
                const afterAmount = turnData.afterState.resources[factionId][resourceType as ResourceType]

                return (
                  <div key={resourceType} className="bg-gray-50 rounded p-3 text-center">
                    <div className="text-lg mb-1">
                      {getResourceIcon(resourceType as ResourceType)}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {formatResourceName(resourceType as ResourceType)}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-700">{beforeAmount}</span>
                      <span className="mx-1">→</span>
                      <span className="font-medium">{afterAmount}</span>
                    </div>
                    {delta !== 0 && (
                      <div className={`text-xs mt-1 ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {delta > 0 ? '+' : ''}{delta}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderActionsView = () => {
    const turnData = getCurrentTurnData()

    return (
      <div className="space-y-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Actions Taken This Turn</h3>
          {turnData.actionsSummary.length > 0 ? (
            <div className="space-y-3">
              {turnData.actionsSummary.map((action, index) => (
                <div key={index} className={`border rounded-lg p-3 ${
                  action.outcome === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Faction {action.factionId}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm capitalize">{action.actionType.replace('_', ' ')}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      action.outcome === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {action.outcome}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{action.impact}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No actions recorded for this turn</p>
          )}
        </div>
      </div>
    )
  }

  const renderCurrentView = () => {
    switch (selectedView) {
      case 'resources':
        return renderResourcesView()
      case 'actions':
        return renderActionsView()
      default:
        return renderOverviewView()
    }
  }

  if (!replayData || replayData.turns.length === 0) {
    return (
      <div className={`game-replay-viewer ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-500">No replay data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`game-replay-viewer ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎬 Session Replay</h2>
        <p className="text-gray-600">
          Relive your game session turn by turn. Watch how strategies unfolded and key decisions shaped the outcome.
        </p>
      </div>

      {/* Playback Controls */}
      {renderPlaybackControls()}

      {/* View Tabs */}
      {renderViewTabs()}

      {/* Main Content */}
      <div className="main-content">
        {renderCurrentView()}
      </div>

      {/* Key Moments Panel */}
      {showKeyMomentsOnly && replayData.keyMoments.length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-3">⭐ Key Moments</h3>
          <div className="space-y-2">
            {replayData.keyMoments.map(moment => (
              <button
                key={`${moment.turn}-${moment.type}`}
                onClick={() => goToKeyMoment(moment)}
                className="w-full text-left p-3 bg-white border border-yellow-200 rounded hover:bg-yellow-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-yellow-800">Turn {moment.turn}: {moment.title}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    moment.impact === 'major' ? 'bg-red-100 text-red-800' :
                    moment.impact === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {moment.impact}
                  </span>
                </div>
                <p className="text-sm text-yellow-700">{moment.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}