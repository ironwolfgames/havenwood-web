/**
 * Turn Timer Component
 * 
 * Displays a countdown timer with visual and audio alerts.
 * Includes controls for session creators to pause/resume/extend timer.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { TurnTimerConfig, TimerState, TimerDisplayData } from '@/types/turn-management'
import { 
  calculateTimerDisplay, 
  getTimerClasses, 
  TimerAudioManager, 
  TimerPersistence,
  DEFAULT_TIMER_CONFIG 
} from '@/lib/turn-timer'

export interface TurnTimerProps {
  sessionId: string
  config?: TurnTimerConfig
  isSessionCreator?: boolean
  onTimerExpired?: () => void
  onTimerWarning?: (secondsRemaining: number) => void
  onTimerStateChange?: (state: TimerState) => void
  className?: string
}

/**
 * Turn Timer Component
 */
export function TurnTimer({
  sessionId,
  config = DEFAULT_TIMER_CONFIG,
  isSessionCreator = false,
  onTimerExpired,
  onTimerWarning,
  onTimerStateChange,
  className = '',
}: TurnTimerProps) {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [timerDisplay, setTimerDisplay] = useState<TimerDisplayData | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [pausedAt, setPausedAt] = useState<Date | null>(null)
  const [totalPausedTime, setTotalPausedTime] = useState(0)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioManagerRef = useRef<TimerAudioManager | null>(null)
  const lastWarningRef = useRef<number>(0)

  // Initialize audio manager
  useEffect(() => {
    audioManagerRef.current = new TimerAudioManager(config.soundEnabled)
    return () => {
      audioManagerRef.current = null
    }
  }, [config.soundEnabled])

  // Start timer
  const startTimer = useCallback(() => {
    const now = new Date()
    setStartTime(now)
    setIsPaused(false)
    setPausedAt(null)
    setTotalPausedTime(0)
    TimerPersistence.saveTimerState(sessionId, now, config)
  }, [sessionId, config])

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (!isPaused && startTime) {
      setIsPaused(true)
      setPausedAt(new Date())
    }
  }, [isPaused, startTime])

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (isPaused && pausedAt) {
      const pauseDuration = new Date().getTime() - pausedAt.getTime()
      setTotalPausedTime(prev => prev + pauseDuration)
      setIsPaused(false)
      setPausedAt(null)
    }
  }, [isPaused, pausedAt])

  // Stop timer
  const stopTimer = useCallback(() => {
    setStartTime(null)
    setIsPaused(false)
    setPausedAt(null)
    setTotalPausedTime(0)
    setTimerDisplay(null)
    TimerPersistence.clearTimerState(sessionId)
  }, [sessionId])

  // Extend timer by specified minutes
  const extendTimer = useCallback((additionalMinutes: number) => {
    if (startTime) {
      const newStartTime = new Date(startTime.getTime() - (additionalMinutes * 60 * 1000))
      setStartTime(newStartTime)
      TimerPersistence.saveTimerState(sessionId, newStartTime, config)
    }
  }, [startTime, sessionId, config])

  // Update timer display
  const updateTimer = useCallback(() => {
    if (!startTime || isPaused) return

    const adjustedStartTime = new Date(startTime.getTime() + totalPausedTime)
    const display = calculateTimerDisplay(adjustedStartTime, config)
    setTimerDisplay(display)

    // Handle state change callback
    if (onTimerStateChange) {
      onTimerStateChange(display.state)
    }

    // Handle warnings
    if (display.isWarning && display.remainingSeconds !== lastWarningRef.current) {
      lastWarningRef.current = display.remainingSeconds
      
      if (onTimerWarning) {
        onTimerWarning(display.remainingSeconds)
      }

      // Play audio alerts
      if (audioManagerRef.current) {
        if (display.remainingSeconds === config.criticalThresholdSeconds) {
          audioManagerRef.current.playAlert('timer_critical')
        } else if (display.remainingSeconds === config.warningThresholdSeconds) {
          audioManagerRef.current.playAlert('timer_warning')
        }
      }
    }

    // Handle timer expiration
    if (display.state === 'expired') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      if (audioManagerRef.current) {
        audioManagerRef.current.playAlert('timer_expired')
      }

      if (onTimerExpired) {
        onTimerExpired()
      }
    }
  }, [
    startTime,
    isPaused,
    totalPausedTime,
    config,
    onTimerStateChange,
    onTimerWarning,
    onTimerExpired,
  ])

  // Timer update interval
  useEffect(() => {
    if (startTime && !isPaused) {
      intervalRef.current = setInterval(updateTimer, 1000)
      updateTimer() // Initial update
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [startTime, isPaused, updateTimer])

  // Load persisted timer state on mount
  useEffect(() => {
    const persistedState = TimerPersistence.loadTimerState(sessionId)
    if (persistedState && !startTime) {
      setStartTime(persistedState.startTime)
    }
  }, [sessionId, startTime])

  if (!timerDisplay && !startTime) {
    // Timer not started
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center ${className}`}>
        <div className="space-y-4">
          <div className="text-4xl">⏱️</div>
          <h3 className="text-lg font-medium text-gray-900">Timer Ready</h3>
          <p className="text-sm text-gray-600">
            {config.durationMinutes} minute{config.durationMinutes !== 1 ? 's' : ''} for this turn
          </p>
          {isSessionCreator && (
            <button
              onClick={startTimer}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Start Turn Timer
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!timerDisplay) return null

  const timerClasses = getTimerClasses(isPaused ? 'paused' : timerDisplay.state)

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        {/* Timer Display */}
        <div className={`rounded-lg border p-6 text-center transition-all duration-300 ${timerClasses.container}`}>
          <div className="space-y-3">
            {/* Time Display */}
            <div className={`text-4xl font-mono font-bold ${timerClasses.text}`}>
              {timerDisplay.formattedTime}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${timerClasses.progress}`}
                style={{ width: `${timerDisplay.progressPercent}%` }}
              />
            </div>
            
            {/* Status Text */}
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isPaused ? '⏸️ Timer Paused' : 
                 timerDisplay.state === 'expired' ? '⏰ Time Expired!' :
                 timerDisplay.isCritical ? '🚨 Time Almost Up!' :
                 timerDisplay.isWarning ? '⚠️ Time Running Low' :
                 '🕐 Turn Planning Time'}
              </p>
              
              {!isPaused && timerDisplay.state !== 'expired' && (
                <p className="text-xs text-gray-600">
                  {timerDisplay.remainingSeconds > 60 
                    ? `${Math.floor(timerDisplay.remainingSeconds / 60)} minute${Math.floor(timerDisplay.remainingSeconds / 60) !== 1 ? 's' : ''} remaining`
                    : `${timerDisplay.remainingSeconds} second${timerDisplay.remainingSeconds !== 1 ? 's' : ''} remaining`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Timer Controls (for session creator) */}
        {isSessionCreator && timerDisplay.state !== 'expired' && (
          <div className="flex flex-wrap justify-center gap-2">
            {config.allowPause && (
              <button
                onClick={isPaused ? resumeTimer : pauseTimer}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  isPaused
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
            )}
            
            {config.allowExtend && (
              <>
                <button
                  onClick={() => extendTimer(1)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm font-medium"
                >
                  +1 Min
                </button>
                <button
                  onClick={() => extendTimer(2)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm font-medium"
                >
                  +2 Min
                </button>
              </>
            )}
            
            <button
              onClick={stopTimer}
              className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium"
            >
              🛑 Stop
            </button>
          </div>
        )}

        {/* Auto-resolve warning */}
        {config.autoResolve && timerDisplay.state === 'expired' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center">
              <span className="text-orange-500 mr-2">⚠️</span>
              <p className="text-sm text-orange-700">
                <strong>Auto-resolving:</strong> Turn will be processed automatically with current actions.
              </p>
            </div>
          </div>
        )}

        {/* Quick Settings */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <div className="flex items-center space-x-2">
            <span>🔊</span>
            <span>{config.soundEnabled ? 'Sound On' : 'Sound Off'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>⚙️</span>
            <span>{config.durationMinutes}min timer</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TurnTimer