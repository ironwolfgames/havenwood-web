/**
 * Phase Transition Manager Component
 * 
 * Handles smooth transitions between game phases with notifications,
 * countdown timers, and automatic advancement.
 */

import React, { useState, useEffect } from 'react'
import { TurnPhase, PhaseTransition, NotificationData, NotificationType } from '@/types/turn-management'

export interface PhaseTransitionManagerProps {
  currentPhase: TurnPhase
  transition?: PhaseTransition | null
  onPhaseComplete?: (phase: TurnPhase) => void
  onTransitionComplete?: () => void
  className?: string
}

/**
 * Get phase display information
 */
function getPhaseDisplayInfo(phase: TurnPhase): {
  name: string
  icon: string
  color: string
  description: string
} {
  switch (phase) {
    case 'plan':
      return {
        name: 'Planning Phase',
        icon: '🎯',
        color: 'blue',
        description: 'Select your actions for this turn',
      }
    case 'resolution':
      return {
        name: 'Resolution Phase',
        icon: '⚙️',
        color: 'yellow',
        description: 'Actions are being processed',
      }
    case 'event':
      return {
        name: 'Event Phase',
        icon: '⚡',
        color: 'purple',
        description: 'Global events are occurring',
      }
    case 'progress':
      return {
        name: 'Progress Check',
        icon: '📊',
        color: 'green',
        description: 'Checking victory conditions',
      }
  }
}

/**
 * Get notification type based on phase
 */
function getNotificationType(phase: TurnPhase): NotificationType {
  switch (phase) {
    case 'plan':
      return 'info'
    case 'resolution':
      return 'warning'
    case 'event':
      return 'info'
    case 'progress':
      return 'success'
    default:
      return 'info'
  }
}

/**
 * Transition Notification Component
 */
function TransitionNotification({
  notification,
  onDismiss,
}: {
  notification: NotificationData
  onDismiss: () => void
}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300) // Allow fade out animation
      }, notification.duration)
      
      return () => clearTimeout(timer)
    }
  }, [notification.duration, onDismiss])

  const getNotificationClasses = (type: NotificationType): string => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getIconForType = (type: NotificationType): string => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className={`fixed top-4 right-4 max-w-md z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`rounded-lg border p-4 shadow-lg ${getNotificationClasses(notification.type)}`}>
        <div className="flex items-start">
          <span className="text-xl mr-3 flex-shrink-0">
            {getIconForType(notification.type)}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium">
              {notification.title}
            </h4>
            <p className="text-sm mt-1 opacity-90">
              {notification.message}
            </p>
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex space-x-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      action.primary
                        ? 'bg-white bg-opacity-20 hover:bg-opacity-30'
                        : 'bg-black bg-opacity-10 hover:bg-opacity-20'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 text-lg leading-none opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Phase Transition Countdown Component
 */
function TransitionCountdown({
  delaySeconds,
  onComplete,
  message,
}: {
  delaySeconds: number
  onComplete: () => void
  message: string
}) {
  const [remainingSeconds, setRemainingSeconds] = useState(delaySeconds)

  useEffect(() => {
    if (remainingSeconds > 0) {
      const timer = setTimeout(() => {
        setRemainingSeconds(remainingSeconds - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [remainingSeconds, onComplete])

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
      <div className="space-y-3">
        <div className="text-2xl font-mono font-bold text-blue-700">
          {remainingSeconds}
        </div>
        <p className="text-sm text-blue-800">
          {message}
        </p>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{
              width: `${((delaySeconds - remainingSeconds) / delaySeconds) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Phase Transition Manager Component
 */
export function PhaseTransitionManager({
  currentPhase,
  transition,
  onPhaseComplete,
  onTransitionComplete,
  className = '',
}: PhaseTransitionManagerProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [showTransition, setShowTransition] = useState(false)
  const [transitionStartTime, setTransitionStartTime] = useState<Date | null>(null)

  // Handle phase changes
  useEffect(() => {
    if (transition && !showTransition) {
      setShowTransition(true)
      setTransitionStartTime(new Date())
      
      // Create notification for phase change
      const fromPhaseInfo = getPhaseDisplayInfo(transition.fromPhase)
      const toPhaseInfo = getPhaseDisplayInfo(transition.toPhase)
      
      const notification: NotificationData = {
        type: getNotificationType(transition.toPhase),
        title: `${fromPhaseInfo.name} Complete`,
        message: `Transitioning to ${toPhaseInfo.name}...`,
        duration: 3000,
      }
      
      setNotifications(prev => [...prev, notification])
    }
  }, [transition, showTransition])

  // Handle transition completion
  const handleTransitionComplete = () => {
    setShowTransition(false)
    setTransitionStartTime(null)
    
    if (onTransitionComplete) {
      onTransitionComplete()
    }
    
    // Create notification for new phase
    if (transition) {
      const toPhaseInfo = getPhaseDisplayInfo(transition.toPhase)
      
      const notification: NotificationData = {
        type: getNotificationType(transition.toPhase),
        title: toPhaseInfo.name,
        message: toPhaseInfo.description,
        duration: 4000,
      }
      
      setNotifications(prev => [...prev, notification])
    }
  }

  // Remove notification
  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  const currentPhaseInfo = getPhaseDisplayInfo(currentPhase)

  return (
    <>
      {/* Phase Transition Overlay */}
      {showTransition && transition && (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-4">
                {getPhaseDisplayInfo(transition.fromPhase).icon} → {getPhaseDisplayInfo(transition.toPhase).icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Phase Transition
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {getPhaseDisplayInfo(transition.fromPhase).name} → {getPhaseDisplayInfo(transition.toPhase).name}
              </p>
            </div>

            {transition.autoAdvance ? (
              <TransitionCountdown
                delaySeconds={transition.delaySeconds}
                onComplete={handleTransitionComplete}
                message={transition.message || `Automatically advancing to ${getPhaseDisplayInfo(transition.toPhase).name}...`}
              />
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-700">
                  {transition.message}
                </p>
                <button
                  onClick={handleTransitionComplete}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Continue to {getPhaseDisplayInfo(transition.toPhase).name}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Phase Status (when not transitioning) */}
      {!showTransition && (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
          <div className="text-center space-y-3">
            <div className="text-3xl">
              {currentPhaseInfo.icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {currentPhaseInfo.name}
            </h3>
            <p className="text-sm text-gray-600">
              {currentPhaseInfo.description}
            </p>
            
            {onPhaseComplete && currentPhase === 'plan' && (
              <div className="pt-2">
                <button
                  onClick={() => onPhaseComplete(currentPhase)}
                  className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium"
                >
                  ✅ Ready for Resolution
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications */}
      {notifications.map((notification, index) => (
        <TransitionNotification
          key={index}
          notification={notification}
          onDismiss={() => removeNotification(index)}
        />
      ))}
    </>
  )
}

export default PhaseTransitionManager