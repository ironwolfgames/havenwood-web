/**
 * Real-time Context for managing Supabase subscriptions across the application
 * 
 * This context provides a centralized way to manage real-time connections,
 * handle connection status, and provide error feedback to users.
 */

'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  RealtimeConnectionStatus, 
  realtimeManager,
  ConnectionStatusCallback,
  ErrorCallback
} from '@/lib/realtime'

/**
 * Real-time context value interface
 */
interface RealtimeContextValue {
  // Connection status
  connectionStatus: RealtimeConnectionStatus
  isConnected: boolean
  isConnecting: boolean
  hasError: boolean
  
  // Connection management
  activeSubscriptions: number
  lastError: Error | null
  
  // Methods
  clearError: () => void
  forceReconnect: () => void
}

/**
 * Real-time context
 */
const RealtimeContext = createContext<RealtimeContextValue | null>(null)

/**
 * Props for the RealtimeProvider
 */
interface RealtimeProviderProps {
  children: ReactNode
  
  // Optional configuration
  enableConnectionStatus?: boolean
  enableErrorHandling?: boolean
  
  // Callbacks
  onConnectionChange?: (status: RealtimeConnectionStatus) => void
  onError?: (error: Error) => void
}

/**
 * Real-time provider component
 */
export function RealtimeProvider({ 
  children, 
  enableConnectionStatus = true,
  enableErrorHandling = true,
  onConnectionChange,
  onError
}: RealtimeProviderProps) {
  const [connectionStatus, setConnectionStatus] = useState<RealtimeConnectionStatus>('disconnected')
  const [lastError, setLastError] = useState<Error | null>(null)
  const [activeSubscriptions, setActiveSubscriptions] = useState(0)

  useEffect(() => {
    let connectionStatusCleanup: (() => void) | null = null
    let errorCleanup: (() => void) | null = null

    if (enableConnectionStatus) {
      // Subscribe to connection status changes
      connectionStatusCleanup = realtimeManager.onConnectionStatusChange((status) => {
        setConnectionStatus(status)
        onConnectionChange?.(status)
      })
    }

    if (enableErrorHandling) {
      // Subscribe to errors
      errorCleanup = realtimeManager.onError((error) => {
        console.error('Real-time error:', error)
        setLastError(error)
        onError?.(error)
      })
    }

    // Set up a periodic check for active subscriptions count
    const subscriptionCountInterval = setInterval(() => {
      setActiveSubscriptions(realtimeManager.getActiveSubscriptionCount())
    }, 1000)

    return () => {
      connectionStatusCleanup?.()
      errorCleanup?.()
      clearInterval(subscriptionCountInterval)
    }
  }, [enableConnectionStatus, enableErrorHandling, onConnectionChange, onError])

  // Clean up all subscriptions when provider unmounts
  useEffect(() => {
    return () => {
      console.log('RealtimeProvider unmounting, cleaning up all subscriptions')
      realtimeManager.unsubscribeAll()
    }
  }, [])

  const clearError = () => {
    setLastError(null)
  }

  const forceReconnect = () => {
    // Force reconnection by unsubscribing all and letting components reinitialize
    realtimeManager.unsubscribeAll()
    setLastError(null)
  }

  // Derived connection status booleans
  const isConnected = connectionStatus === 'connected'
  const isConnecting = connectionStatus === 'connecting' || connectionStatus === 'reconnecting'
  const hasError = connectionStatus === 'error' || lastError !== null

  const contextValue: RealtimeContextValue = {
    connectionStatus,
    isConnected,
    isConnecting,
    hasError,
    activeSubscriptions,
    lastError,
    clearError,
    forceReconnect
  }

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  )
}

/**
 * Hook to use the real-time context
 */
export function useRealtimeContext(): RealtimeContextValue {
  const context = useContext(RealtimeContext)
  
  if (!context) {
    throw new Error('useRealtimeContext must be used within a RealtimeProvider')
  }
  
  return context
}

/**
 * Connection status indicator component
 */
interface ConnectionStatusProps {
  showText?: boolean
  showSubscriptionCount?: boolean
  className?: string
}

export function ConnectionStatus({ 
  showText = true, 
  showSubscriptionCount = false,
  className = ''
}: ConnectionStatusProps) {
  const { 
    connectionStatus, 
    isConnected, 
    isConnecting, 
    hasError, 
    activeSubscriptions,
    lastError,
    clearError,
    forceReconnect 
  } = useRealtimeContext()

  const getStatusColor = () => {
    if (hasError) return 'text-red-500'
    if (isConnected) return 'text-green-500'
    if (isConnecting) return 'text-yellow-500'
    return 'text-gray-500'
  }

  const getStatusIcon = () => {
    if (hasError) return '✗'
    if (isConnected) return '●'
    if (isConnecting) return '◐'
    return '○'
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected'
      case 'connecting':
        return 'Connecting...'
      case 'reconnecting':
        return 'Reconnecting...'
      case 'disconnected':
        return 'Disconnected'
      case 'error':
        return 'Connection Error'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className={`${getStatusColor()} font-mono`}>
        {getStatusIcon()}
      </span>
      
      {showText && (
        <span className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      )}
      
      {showSubscriptionCount && activeSubscriptions > 0 && (
        <span className="text-xs text-gray-500">
          ({activeSubscriptions} subscriptions)
        </span>
      )}

      {hasError && lastError && (
        <div className="flex items-center space-x-1">
          <button
            onClick={clearError}
            className="text-xs text-red-500 hover:text-red-700 underline"
            title={lastError.message}
          >
            Clear Error
          </button>
          <button
            onClick={forceReconnect}
            className="text-xs text-blue-500 hover:text-blue-700 underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Connection error banner component
 */
export function ConnectionErrorBanner() {
  const { hasError, lastError, clearError, forceReconnect } = useRealtimeContext()

  if (!hasError || !lastError) {
    return null
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-red-500 mr-2">⚠</span>
          <div>
            <h4 className="text-red-800 font-medium">Real-time Connection Error</h4>
            <p className="text-red-700 text-sm">{lastError.message}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={forceReconnect}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Retry Connection
          </button>
          <button
            onClick={clearError}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

export default RealtimeProvider