/**
 * Turn Management Panel Component
 * 
 * Main container that integrates all turn management components:
 * - Turn Status Display
 * - Turn Timer
 * - Player Readiness Tracker
 * - Turn Resolution Progress
 * - Phase Transition Manager
 */

import React, { useState, useEffect } from 'react'
import { 
  TurnPhase, 
  TurnStatusInfo, 
  TurnTimerConfig, 
  PhaseTransition, 
  ResolutionProgress,
  PlayerStatus,
  PlayerReadiness
} from '@/types/turn-management'
import { TurnStatusDisplay } from './TurnStatusDisplay'
import { TurnTimer } from './TurnTimer'
import { PlayerReadinessTracker } from './PlayerReadinessTracker'
import { TurnResolutionProgress } from './TurnResolutionProgress'
import { PhaseTransitionManager } from './PhaseTransitionManager'
import { DEFAULT_TIMER_CONFIG } from '@/lib/turn-timer'

export interface TurnManagementPanelProps {
  sessionId: string
  currentPlayerId?: string
  isSessionCreator?: boolean
  timerConfig?: TurnTimerConfig
  className?: string
}

/**
 * Sample data for demonstration - in production this would come from API/real-time subscriptions
 */
function createSampleTurnStatus(sessionId: string, phase: TurnPhase = 'plan'): TurnStatusInfo {
  const now = new Date()
  const sessionStart = new Date(now.getTime() - (15 * 60 * 1000)) // 15 minutes ago

  const samplePlayers: PlayerStatus[] = [
    {
      playerId: 'player-1',
      username: 'Alice',
      factionId: 'meadow-moles',
      factionName: 'Meadow Moles',
      readiness: 'ready' as PlayerReadiness,
      actionsSubmitted: 3,
      totalActionsRequired: 3,
      lastActivityAt: new Date(now.getTime() - (30 * 1000)).toISOString(),
      isSessionCreator: true,
    },
    {
      playerId: 'player-2', 
      username: 'Bob',
      factionId: 'oakshield-badgers',
      factionName: 'Oakshield Badgers',
      readiness: 'not_ready' as PlayerReadiness,
      actionsSubmitted: 2,
      totalActionsRequired: 3,
      lastActivityAt: new Date(now.getTime() - (15 * 1000)).toISOString(),
      isSessionCreator: false,
    },
    {
      playerId: 'player-3',
      username: 'Charlie',
      factionId: 'starling-scholars',
      factionName: 'Starling Scholars',
      readiness: 'ready' as PlayerReadiness,
      actionsSubmitted: 3,
      totalActionsRequired: 3,
      lastActivityAt: new Date(now.getTime() - (10 * 1000)).toISOString(),
      isSessionCreator: false,
    },
    {
      playerId: 'player-4',
      username: 'Diana',
      factionId: 'river-otters',
      factionName: 'River Otters',
      readiness: 'waiting' as PlayerReadiness,
      actionsSubmitted: 3,
      totalActionsRequired: 3,
      lastActivityAt: new Date(now.getTime() - (5 * 1000)).toISOString(),
      isSessionCreator: false,
    },
  ]

  const readyPlayers = samplePlayers.filter(p => p.readiness === 'ready' || p.readiness === 'waiting')
  const allPlayersReady = readyPlayers.length === samplePlayers.length

  return {
    sessionId,
    turnNumber: 3,
    totalTurns: 6,
    currentPhase: phase,
    phaseStartedAt: new Date(now.getTime() - (2 * 60 * 1000)).toISOString(),
    sessionStartedAt: sessionStart.toISOString(),
    estimatedRemainingTime: 25, // minutes
    playerStatuses: samplePlayers,
    allPlayersReady,
    canResolve: allPlayersReady && phase === 'plan',
  }
}

/**
 * Sample resolution progress
 */
function createSampleResolutionProgress(): ResolutionProgress {
  return {
    phase: 'gather',
    stepName: 'Processing resource gathering actions',
    currentStep: 2,
    totalSteps: 6,
    progressPercent: 33,
    estimatedRemainingMs: 12000,
    message: 'Calculating resource generation for all factions...',
    isComplete: false,
    hasError: false,
  }
}

/**
 * Sample phase transition
 */
function createSamplePhaseTransition(fromPhase: TurnPhase, toPhase: TurnPhase): PhaseTransition {
  return {
    fromPhase,
    toPhase,
    message: `All players are ready. Transitioning to ${toPhase}...`,
    autoAdvance: true,
    delaySeconds: 3,
  }
}

/**
 * Turn Management Panel Component
 */
export function TurnManagementPanel({
  sessionId,
  currentPlayerId = 'player-2', // Default for demo
  isSessionCreator = false,
  timerConfig = DEFAULT_TIMER_CONFIG,
  className = '',
}: TurnManagementPanelProps) {
  const [currentPhase, setCurrentPhase] = useState<TurnPhase>('plan')
  const [turnStatus, setTurnStatus] = useState<TurnStatusInfo>(() => 
    createSampleTurnStatus(sessionId, currentPhase)
  )
  const [activeTransition, setActiveTransition] = useState<PhaseTransition | null>(null)
  const [resolutionProgress, setResolutionProgress] = useState<ResolutionProgress | null>(null)
  
  // Handle phase changes
  useEffect(() => {
    setTurnStatus(createSampleTurnStatus(sessionId, currentPhase))
  }, [sessionId, currentPhase])

  // Handle timer expiration
  const handleTimerExpired = () => {
    console.log('Timer expired - auto-resolving turn')
    if (currentPhase === 'plan') {
      handleForceResolution()
    }
  }

  // Handle timer warnings
  const handleTimerWarning = (secondsRemaining: number) => {
    console.log(`Timer warning: ${secondsRemaining} seconds remaining`)
  }

  // Handle readiness toggle
  const handleToggleReadiness = (ready: boolean) => {
    if (!currentPlayerId) return
    
    console.log(`Player ${currentPlayerId} readiness: ${ready}`)
    
    // Update player status in turnStatus
    setTurnStatus(prev => ({
      ...prev,
      playerStatuses: prev.playerStatuses.map(player => 
        player.playerId === currentPlayerId
          ? { ...player, readiness: ready ? 'ready' : 'not_ready' }
          : player
      ),
    }))
  }

  // Handle force resolution
  const handleForceResolution = () => {
    console.log('Forcing turn resolution')
    
    // Start transition to resolution phase
    const transition = createSamplePhaseTransition(currentPhase, 'resolution')
    setActiveTransition(transition)
  }

  // Handle phase completion
  const handlePhaseComplete = (phase: TurnPhase) => {
    console.log(`Phase ${phase} complete`)
    
    if (phase === 'plan') {
      handleForceResolution()
    }
  }

  // Handle transition completion
  const handleTransitionComplete = () => {
    if (!activeTransition) return
    
    const newPhase = activeTransition.toPhase
    setCurrentPhase(newPhase)
    setActiveTransition(null)
    
    // If transitioning to resolution, show progress
    if (newPhase === 'resolution') {
      setResolutionProgress(createSampleResolutionProgress())
      
      // Simulate resolution progress
      let step = 2
      const progressInterval = setInterval(() => {
        step++
        if (step <= 6) {
          setResolutionProgress(prev => prev ? {
            ...prev,
            currentStep: step,
            progressPercent: Math.round((step / 6) * 100),
            estimatedRemainingMs: Math.max(0, prev.estimatedRemainingMs - 2000),
          } : null)
        } else {
          clearInterval(progressInterval)
          setResolutionProgress(prev => prev ? {
            ...prev,
            isComplete: true,
            progressPercent: 100,
            estimatedRemainingMs: 0,
          } : null)
          
          // Auto transition to next phase after resolution
          setTimeout(() => {
            const nextTransition = createSamplePhaseTransition('resolution', 'event')
            setActiveTransition(nextTransition)
            setResolutionProgress(null)
          }, 2000)
        }
      }, 2000)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Phase Transition Manager - Always visible for notifications and transitions */}
      <PhaseTransitionManager
        currentPhase={currentPhase}
        transition={activeTransition}
        onPhaseComplete={handlePhaseComplete}
        onTransitionComplete={handleTransitionComplete}
      />

      {/* Turn Status Display - Always visible */}
      <TurnStatusDisplay turnStatus={turnStatus} />

      {/* Phase-specific components */}
      {currentPhase === 'plan' && !activeTransition && (
        <div className="space-y-6">
          {/* Turn Timer - Only during planning phase */}
          <TurnTimer
            sessionId={sessionId}
            config={timerConfig}
            isSessionCreator={isSessionCreator}
            onTimerExpired={handleTimerExpired}
            onTimerWarning={handleTimerWarning}
          />

          {/* Player Readiness Tracker - Only during planning phase */}
          <PlayerReadinessTracker
            turnStatus={turnStatus}
            currentPlayerId={currentPlayerId}
            isSessionCreator={isSessionCreator}
            onToggleReadiness={handleToggleReadiness}
            onForceResolution={handleForceResolution}
          />
        </div>
      )}

      {/* Turn Resolution Progress - Only during resolution phase */}
      {currentPhase === 'resolution' && resolutionProgress && !activeTransition && (
        <TurnResolutionProgress
          progress={resolutionProgress}
          showDetailedSteps={true}
        />
      )}

      {/* Event and Progress phases - Simple status display */}
      {(currentPhase === 'event' || currentPhase === 'progress') && !activeTransition && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="space-y-3">
            <div className="text-4xl">
              {currentPhase === 'event' ? '⚡' : '📊'}
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {currentPhase === 'event' ? 'Processing Events' : 'Checking Progress'}
            </h3>
            <p className="text-sm text-gray-600">
              {currentPhase === 'event' 
                ? 'Global events are being applied to the game world...'
                : 'Checking victory and failure conditions...'
              }
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* Debug Info (remove in production) */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs">
        <h4 className="font-medium text-gray-700 mb-2">Debug Info:</h4>
        <div className="space-y-1 text-gray-600">
          <div>Current Phase: {currentPhase}</div>
          <div>Current Player: {currentPlayerId}</div>
          <div>Session Creator: {isSessionCreator ? 'Yes' : 'No'}</div>
          <div>Active Transition: {activeTransition ? `${activeTransition.fromPhase} → ${activeTransition.toPhase}` : 'None'}</div>
          <div>Resolution Progress: {resolutionProgress ? `${resolutionProgress.progressPercent}%` : 'None'}</div>
        </div>
      </div>
    </div>
  )
}

export default TurnManagementPanel