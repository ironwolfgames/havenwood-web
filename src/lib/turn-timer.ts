/**
 * Turn Timer Utilities
 * 
 * Utilities for managing turn timers, formatting time,
 * and handling timer state changes.
 */

import { TimerState, TimerDisplayData, TurnTimerConfig, AudioAlert } from '@/types/turn-management'

/**
 * Default timer configuration
 */
export const DEFAULT_TIMER_CONFIG: TurnTimerConfig = {
  durationMinutes: 3,
  warningThresholdSeconds: 30,
  criticalThresholdSeconds: 10,
  autoResolve: true,
  soundEnabled: true,
  allowPause: true,
  allowExtend: true,
}

/**
 * Format seconds into MM:SS format
 */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Format duration in a human-readable way
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * Calculate timer display data from current state
 */
export function calculateTimerDisplay(
  startTime: Date,
  config: TurnTimerConfig,
  currentTime: Date = new Date()
): TimerDisplayData {
  const totalSeconds = config.durationMinutes * 60
  const elapsedMs = currentTime.getTime() - startTime.getTime()
  const elapsedSeconds = Math.floor(elapsedMs / 1000)
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)
  
  const progressPercent = Math.min(100, (elapsedSeconds / totalSeconds) * 100)
  
  // Determine timer state
  let state: TimerState
  if (remainingSeconds === 0) {
    state = 'expired'
  } else if (remainingSeconds <= config.criticalThresholdSeconds) {
    state = 'critical'
  } else if (remainingSeconds <= config.warningThresholdSeconds) {
    state = 'warning'
  } else {
    state = 'running'
  }
  
  return {
    state,
    totalSeconds,
    remainingSeconds,
    elapsedSeconds,
    progressPercent,
    formattedTime: formatTime(remainingSeconds),
    isWarning: state === 'warning' || state === 'critical',
    isCritical: state === 'critical',
  }
}

/**
 * Get CSS classes for timer display based on state
 */
export function getTimerClasses(state: TimerState): {
  container: string
  text: string
  progress: string
} {
  switch (state) {
    case 'critical':
      return {
        container: 'bg-red-50 border-red-200',
        text: 'text-red-700 font-bold animate-pulse',
        progress: 'bg-red-500',
      }
    case 'warning':
      return {
        container: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-700 font-semibold',
        progress: 'bg-yellow-500',
      }
    case 'expired':
      return {
        container: 'bg-gray-50 border-gray-200',
        text: 'text-gray-500',
        progress: 'bg-gray-400',
      }
    case 'paused':
      return {
        container: 'bg-blue-50 border-blue-200',
        text: 'text-blue-700',
        progress: 'bg-blue-500',
      }
    default:
      return {
        container: 'bg-green-50 border-green-200',
        text: 'text-green-700',
        progress: 'bg-green-500',
      }
  }
}

/**
 * Timer event manager for handling audio alerts
 */
export class TimerAudioManager {
  private audioContext: AudioContext | null = null
  private soundEnabled: boolean = true
  private lastAlert: AudioAlert | null = null

  constructor(enabled: boolean = true) {
    this.soundEnabled = enabled
    this.initAudioContext()
  }

  private initAudioContext() {
    if (typeof window !== 'undefined' && this.soundEnabled) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.warn('Audio not supported:', error)
        this.soundEnabled = false
      }
    }
  }

  /**
   * Play audio alert for timer events
   */
  async playAlert(alert: AudioAlert): Promise<void> {
    if (!this.soundEnabled || !this.audioContext || this.lastAlert === alert) {
      return
    }

    this.lastAlert = alert

    try {
      const frequency = this.getAlertFrequency(alert)
      const duration = this.getAlertDuration(alert)
      
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
      
      // Reset last alert after a short delay to allow repeated alerts
      setTimeout(() => {
        if (this.lastAlert === alert) {
          this.lastAlert = null
        }
      }, 1000)
    } catch (error) {
      console.warn('Failed to play audio alert:', error)
    }
  }

  private getAlertFrequency(alert: AudioAlert): number {
    switch (alert) {
      case 'timer_critical': return 880  // High pitch for urgency
      case 'timer_warning': return 440   // Medium pitch
      case 'timer_expired': return 220   // Lower pitch
      case 'phase_transition': return 523 // Pleasant tone
      case 'all_ready': return 659      // Success tone
      case 'turn_resolved': return 523  // Completion tone
      default: return 440
    }
  }

  private getAlertDuration(alert: AudioAlert): number {
    switch (alert) {
      case 'timer_critical': return 0.2
      case 'timer_warning': return 0.3
      case 'timer_expired': return 0.5
      case 'phase_transition': return 0.4
      case 'all_ready': return 0.6
      case 'turn_resolved': return 0.8
      default: return 0.3
    }
  }

  /**
   * Enable or disable sound
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled
    if (enabled && !this.audioContext) {
      this.initAudioContext()
    }
  }

  /**
   * Check if sound is enabled and supported
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled && this.audioContext !== null
  }
}

/**
 * Timer synchronization utilities
 */
export class TimerSync {
  /**
   * Calculate server time offset for synchronization
   */
  static async calculateServerOffset(): Promise<number> {
    try {
      const start = Date.now()
      const response = await fetch('/api/time')
      const end = Date.now()
      
      if (response.ok) {
        const { serverTime } = await response.json()
        const networkDelay = (end - start) / 2
        const serverTimeAdjusted = new Date(serverTime).getTime() + networkDelay
        return serverTimeAdjusted - end
      }
    } catch (error) {
      console.warn('Failed to sync with server time:', error)
    }
    return 0
  }

  /**
   * Get synchronized time accounting for server offset
   */
  static getSyncedTime(serverOffset: number = 0): Date {
    return new Date(Date.now() + serverOffset)
  }
}

/**
 * Timer persistence utilities
 */
export class TimerPersistence {
  private static STORAGE_KEY = 'havenwood_timer_state'

  /**
   * Save timer state to localStorage
   */
  static saveTimerState(sessionId: string, startTime: Date, config: TurnTimerConfig): void {
    if (typeof window === 'undefined') return

    try {
      const state = {
        sessionId,
        startTime: startTime.toISOString(),
        config,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(`${this.STORAGE_KEY}_${sessionId}`, JSON.stringify(state))
    } catch (error) {
      console.warn('Failed to save timer state:', error)
    }
  }

  /**
   * Load timer state from localStorage
   */
  static loadTimerState(sessionId: string): { startTime: Date; config: TurnTimerConfig } | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${sessionId}`)
      if (!stored) return null

      const state = JSON.parse(stored)
      return {
        startTime: new Date(state.startTime),
        config: state.config,
      }
    } catch (error) {
      console.warn('Failed to load timer state:', error)
      return null
    }
  }

  /**
   * Clear timer state from localStorage
   */
  static clearTimerState(sessionId: string): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(`${this.STORAGE_KEY}_${sessionId}`)
    } catch (error) {
      console.warn('Failed to clear timer state:', error)
    }
  }
}