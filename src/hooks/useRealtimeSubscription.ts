/**
 * Real-time subscription hooks for Supabase subscriptions
 * 
 * This module provides React hooks for managing real-time subscriptions
 * to database changes with proper lifecycle management, error handling,
 * and performance optimizations.
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { 
  realtimeManager, 
  SubscriptionConfig, 
  SubscriptionCallback,
  debounce,
  createSessionFilter,
  createPlayerFilter,
  createFactionFilter,
  createTurnFilter
} from '@/lib/realtime'
import { useRealtimeContext } from '@/contexts/RealtimeContext'
import { 
  GameSession, 
  Resource, 
  Action, 
  TurnResult,
  SessionPlayer 
} from '@/lib/supabase'

/**
 * Base subscription hook configuration
 */
interface UseSubscriptionOptions {
  enabled?: boolean
  debounceMs?: number
  onError?: (error: Error) => void
}

/**
 * Generic real-time subscription hook
 */
export function useRealtimeSubscription<T extends Record<string, any> = Record<string, any>>(
  channelId: string,
  config: SubscriptionConfig,
  callback: SubscriptionCallback<T>,
  options: UseSubscriptionOptions = {}
): {
  isSubscribed: boolean
  error: Error | null
  subscribe: () => void
  unsubscribe: () => void
} {
  const { enabled = true, debounceMs = 0, onError } = options
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const { isConnected } = useRealtimeContext()

  // Create debounced callback if debounce is requested
  const debouncedCallback = useRef(callback)
  
  useEffect(() => {
    if (debounceMs > 0) {
      debouncedCallback.current = debounce(callback, debounceMs)
    } else {
      debouncedCallback.current = callback
    }
  }, [callback, debounceMs])

  const subscribe = useCallback(() => {
    if (!enabled || !isConnected) return

    try {
      // Clean up existing subscription
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }

      // Create new subscription
      const unsubscribe = realtimeManager.subscribe(
        channelId,
        config,
        (payload) => {
          try {
            debouncedCallback.current(payload as RealtimePostgresChangesPayload<T>)
            setError(null)
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Callback error')
            setError(error)
            onError?.(error)
          }
        }
      )

      unsubscribeRef.current = unsubscribe
      setIsSubscribed(true)
      setError(null)

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Subscription error')
      setError(error)
      onError?.(error)
    }
  }, [channelId, config, enabled, isConnected, onError])

  const unsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }
    setIsSubscribed(false)
  }, [])

  // Subscribe when component mounts and dependencies change
  useEffect(() => {
    if (enabled && isConnected) {
      subscribe()
    } else {
      unsubscribe()
    }

    return () => {
      unsubscribe()
    }
  }, [enabled, isConnected, subscribe, unsubscribe])

  return {
    isSubscribed,
    error,
    subscribe,
    unsubscribe
  }
}

/**
 * Subscribe to game session changes
 */
export function useGameSessionSubscription(
  sessionId: string,
  onUpdate: (session: GameSession) => void,
  options: UseSubscriptionOptions = {}
) {
  return useRealtimeSubscription<GameSession>(
    `game_session_${sessionId}`,
    {
      table: 'game_sessions',
      event: 'UPDATE',
      filter: `id=eq.${sessionId}`
    },
    (payload) => {
      if (payload.new && payload.eventType === 'UPDATE') {
        onUpdate(payload.new as GameSession)
      }
    },
    options
  )
}

/**
 * Subscribe to session players changes (joins/leaves)
 */
export function useSessionPlayersSubscription(
  sessionId: string,
  onPlayerJoin: (player: SessionPlayer) => void,
  onPlayerLeave: (player: SessionPlayer) => void,
  options: UseSubscriptionOptions = {}
) {
  return useRealtimeSubscription<SessionPlayer>(
    `session_players_${sessionId}`,
    {
      table: 'session_players',
      event: '*',
      filter: createSessionFilter(sessionId)
    },
    (payload) => {
      if (payload.eventType === 'INSERT' && payload.new) {
        onPlayerJoin(payload.new as SessionPlayer)
      } else if (payload.eventType === 'DELETE' && payload.old) {
        onPlayerLeave(payload.old as SessionPlayer)
      }
    },
    options
  )
}

/**
 * Subscribe to resource changes for a session
 */
export function useResourcesSubscription(
  sessionId: string,
  onResourceChange: (resource: Resource) => void,
  options: UseSubscriptionOptions = {}
) {
  return useRealtimeSubscription<Resource>(
    `resources_${sessionId}`,
    {
      table: 'resources',
      event: '*',
      filter: createSessionFilter(sessionId)
    },
    (payload) => {
      if ((payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') && payload.new) {
        onResourceChange(payload.new as Resource)
      }
    },
    { debounceMs: 100, ...options } // Debounce rapid resource updates
  )
}

/**
 * Subscribe to resource changes for a specific faction
 */
export function useFactionResourcesSubscription(
  sessionId: string,
  factionId: string,
  onResourceChange: (resource: Resource) => void,
  options: UseSubscriptionOptions = {}
) {
  return useRealtimeSubscription<Resource>(
    `faction_resources_${sessionId}_${factionId}`,
    {
      table: 'resources',
      event: '*',
      filter: `session_id=eq.${sessionId},faction_id=eq.${factionId}`
    },
    (payload) => {
      if ((payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') && payload.new) {
        onResourceChange(payload.new as Resource)
      }
    },
    { debounceMs: 100, ...options }
  )
}

/**
 * Subscribe to action submissions for a session
 */
export function useActionsSubscription(
  sessionId: string,
  onActionSubmitted: (action: Action) => void,
  options: UseSubscriptionOptions = {}
) {
  return useRealtimeSubscription<Action>(
    `actions_${sessionId}`,
    {
      table: 'actions',
      event: '*',
      filter: createSessionFilter(sessionId)
    },
    (payload) => {
      if (payload.eventType === 'INSERT' && payload.new) {
        onActionSubmitted(payload.new as Action)
      } else if (payload.eventType === 'UPDATE' && payload.new) {
        onActionSubmitted(payload.new as Action)
      }
    },
    options
  )
}

/**
 * Subscribe to turn result announcements
 */
export function useTurnResultsSubscription(
  sessionId: string,
  onTurnResolved: (result: TurnResult) => void,
  options: UseSubscriptionOptions = {}
) {
  return useRealtimeSubscription<TurnResult>(
    `turn_results_${sessionId}`,
    {
      table: 'turn_results',
      event: 'INSERT',
      filter: createSessionFilter(sessionId)
    },
    (payload) => {
      if (payload.eventType === 'INSERT' && payload.new) {
        onTurnResolved(payload.new as TurnResult)
      }
    },
    options
  )
}

/**
 * Combined subscription for complete game state updates
 */
export function useGameStateSubscription(
  sessionId: string,
  callbacks: {
    onSessionUpdate?: (session: GameSession) => void
    onPlayerJoin?: (player: SessionPlayer) => void
    onPlayerLeave?: (player: SessionPlayer) => void
    onResourceChange?: (resource: Resource) => void
    onActionSubmitted?: (action: Action) => void
    onTurnResolved?: (result: TurnResult) => void
  },
  options: UseSubscriptionOptions = {}
) {
  const sessionSubscription = useGameSessionSubscription(
    sessionId,
    callbacks.onSessionUpdate || (() => {}),
    options
  )

  const playersSubscription = useSessionPlayersSubscription(
    sessionId,
    callbacks.onPlayerJoin || (() => {}),
    callbacks.onPlayerLeave || (() => {}),
    options
  )

  const resourcesSubscription = useResourcesSubscription(
    sessionId,
    callbacks.onResourceChange || (() => {}),
    options
  )

  const actionsSubscription = useActionsSubscription(
    sessionId,
    callbacks.onActionSubmitted || (() => {}),
    options
  )

  const turnResultsSubscription = useTurnResultsSubscription(
    sessionId,
    callbacks.onTurnResolved || (() => {}),
    options
  )

  return {
    session: sessionSubscription,
    players: playersSubscription,
    resources: resourcesSubscription,
    actions: actionsSubscription,
    turnResults: turnResultsSubscription,
    isFullySubscribed: 
      sessionSubscription.isSubscribed &&
      playersSubscription.isSubscribed &&
      resourcesSubscription.isSubscribed &&
      actionsSubscription.isSubscribed &&
      turnResultsSubscription.isSubscribed,
    hasErrors: 
      !!sessionSubscription.error ||
      !!playersSubscription.error ||
      !!resourcesSubscription.error ||
      !!actionsSubscription.error ||
      !!turnResultsSubscription.error
  }
}

/**
 * Hook for managing subscription to specific turn data
 */
export function useTurnSubscription(
  sessionId: string,
  turnNumber: number,
  onActionChange: (action: Action) => void,
  onTurnResolved: (result: TurnResult) => void,
  options: UseSubscriptionOptions = {}
) {
  const actionsSubscription = useRealtimeSubscription<Action>(
    `turn_actions_${sessionId}_${turnNumber}`,
    {
      table: 'actions',
      event: '*',
      filter: createTurnFilter(sessionId, turnNumber)
    },
    (payload) => {
      if ((payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') && payload.new) {
        onActionChange(payload.new as Action)
      }
    },
    options
  )

  const resultsSubscription = useRealtimeSubscription<TurnResult>(
    `turn_result_${sessionId}_${turnNumber}`,
    {
      table: 'turn_results',
      event: 'INSERT',
      filter: `session_id=eq.${sessionId},turn_number=eq.${turnNumber}`
    },
    (payload) => {
      if (payload.eventType === 'INSERT' && payload.new) {
        onTurnResolved(payload.new as TurnResult)
      }
    },
    options
  )

  return {
    actions: actionsSubscription,
    results: resultsSubscription,
    isSubscribed: actionsSubscription.isSubscribed && resultsSubscription.isSubscribed,
    hasErrors: !!actionsSubscription.error || !!resultsSubscription.error
  }
}