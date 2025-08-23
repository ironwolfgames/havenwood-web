/**
 * Turn Management Types
 * 
 * Types for turn phases, timer states, and player readiness
 * used by the Turn Management UI Components.
 */

/**
 * Game turn phases as defined in the Game Design Document
 */
export type TurnPhase = 
  | 'plan'        // Simultaneous action selection (2-5 minutes)
  | 'resolution'  // Actions being processed 
  | 'event'       // Global events occurring
  | 'progress'    // Victory/failure condition check

/**
 * Timer state for countdown management
 */
export type TimerState = 
  | 'stopped'     // Timer not running
  | 'running'     // Timer counting down
  | 'paused'      // Timer paused
  | 'expired'     // Timer reached zero
  | 'warning'     // Timer in warning state (< 30 seconds)
  | 'critical'    // Timer in critical state (< 10 seconds)

/**
 * Player readiness status
 */
export type PlayerReadiness = 
  | 'not_ready'      // Player hasn't submitted actions
  | 'ready'          // Player has submitted actions
  | 'waiting'        // Player ready but waiting for others
  | 'disconnected'   // Player connection lost

/**
 * Turn timer configuration
 */
export interface TurnTimerConfig {
  durationMinutes: number          // Timer duration in minutes
  warningThresholdSeconds: number  // When to show warning (default: 30)
  criticalThresholdSeconds: number // When to show critical alert (default: 10)
  autoResolve: boolean            // Auto-resolve when timer expires
  soundEnabled: boolean           // Enable audio alerts
  allowPause: boolean             // Allow session creator to pause
  allowExtend: boolean            // Allow group vote to extend
}

/**
 * Player submission status
 */
export interface PlayerStatus {
  playerId: string
  username: string
  factionId: string
  factionName: string
  readiness: PlayerReadiness
  actionsSubmitted: number
  totalActionsRequired: number
  lastActivityAt: string
  isSessionCreator: boolean
}

/**
 * Turn status information
 */
export interface TurnStatusInfo {
  sessionId: string
  turnNumber: number
  totalTurns: number
  currentPhase: TurnPhase
  phaseStartedAt: string
  sessionStartedAt: string
  estimatedRemainingTime?: number // in minutes
  playerStatuses: PlayerStatus[]
  allPlayersReady: boolean
  canResolve: boolean
}

/**
 * Timer display data
 */
export interface TimerDisplayData {
  state: TimerState
  totalSeconds: number
  remainingSeconds: number
  elapsedSeconds: number
  progressPercent: number
  formattedTime: string
  isWarning: boolean
  isCritical: boolean
}

/**
 * Phase transition data
 */
export interface PhaseTransition {
  fromPhase: TurnPhase
  toPhase: TurnPhase
  message: string
  autoAdvance: boolean
  delaySeconds: number
}

/**
 * Turn resolution progress
 */
export interface ResolutionProgress {
  phase: string
  stepName: string
  currentStep: number
  totalSteps: number
  progressPercent: number
  estimatedRemainingMs: number
  message: string
  isComplete: boolean
  hasError: boolean
  errorMessage?: string
}

/**
 * Turn management events for real-time updates
 */
export type TurnManagementEvent = 
  | 'player_action_submitted'
  | 'player_readiness_changed'
  | 'timer_started'
  | 'timer_paused'
  | 'timer_resumed'
  | 'timer_expired'
  | 'phase_changed'
  | 'turn_resolved'
  | 'player_connected'
  | 'player_disconnected'
  | 'force_resolution'
  | 'timer_extended'

/**
 * Event payload for real-time updates
 */
export interface TurnManagementEventPayload {
  event: TurnManagementEvent
  sessionId: string
  playerId?: string
  turnNumber?: number
  data?: any
  timestamp: string
}

/**
 * Audio alert types
 */
export type AudioAlert = 
  | 'timer_warning'     // 30 seconds remaining
  | 'timer_critical'    // 10 seconds remaining
  | 'timer_expired'     // Time's up
  | 'phase_transition'  // Phase changed
  | 'all_ready'         // All players ready
  | 'turn_resolved'     // Turn completed

/**
 * UI notification types
 */
export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'

/**
 * UI notification data
 */
export interface NotificationData {
  type: NotificationType
  title: string
  message: string
  duration?: number // Auto-dismiss after ms (0 = no auto-dismiss)
  actions?: {
    label: string
    action: () => void
    primary?: boolean
  }[]
}