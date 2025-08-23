/**
 * Toast Notification Component
 * 
 * Provides user feedback for actions and system events
 * with different types and auto-dismiss functionality.
 */

import React, { useEffect, useState } from 'react'

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
}

export function ToastNotification({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}: ToastProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show the toast after a brief delay for animation
    const showTimer = setTimeout(() => setShow(true), 100)
    
    // Auto dismiss after duration
    const dismissTimer = setTimeout(() => {
      setShow(false)
      setTimeout(() => onClose?.(), 300) // Allow time for exit animation
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(dismissTimer)
    }
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className={`notification ${type} ${show ? 'show' : ''}`}>
      <span className="notification-icon">{getIcon()}</span>
      <span className="notification-message">{message}</span>
      <button 
        className="notification-close"
        onClick={() => {
          setShow(false)
          setTimeout(() => onClose?.(), 300)
        }}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  )
}

export interface ToastManager {
  show: (message: string, type?: ToastProps['type'], duration?: number) => void
  ToastContainer: () => React.ReactElement
}

export function useToast(): ToastManager {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const show = (message: string, type: ToastProps['type'] = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast = {
      id,
      message,
      type,
      duration,
      onClose: () => {
        setToasts(current => current.filter(t => t.id !== id))
      }
    }
    setToasts(current => [...current, toast])
  }

  // Render toasts container
  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={toast.onClose}
        />
      ))}
    </div>
  )

  return { show, ToastContainer }
}