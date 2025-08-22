/**
 * Real-time subscriptions utilities and configuration for Supabase
 * 
 * This module provides the core infrastructure for managing real-time
 * subscriptions to database changes, with proper error handling,
 * reconnection logic, and performance optimizations.
 */

import { supabase } from '@/lib/supabase'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

/**
 * Connection status for real-time subscriptions
 */
export type RealtimeConnectionStatus = 
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'reconnecting'

/**
 * Subscription configuration
 */
export interface SubscriptionConfig {
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  schema?: string
}

/**
 * Subscription callback function type
 */
export type SubscriptionCallback<T extends Record<string, any> = Record<string, any>> = (
  payload: RealtimePostgresChangesPayload<T>
) => void

/**
 * Connection status callback
 */
export type ConnectionStatusCallback = (status: RealtimeConnectionStatus) => void

/**
 * Error callback
 */
export type ErrorCallback = (error: Error) => void

/**
 * Real-time subscription manager
 */
export class RealtimeSubscriptionManager {
  private channels: Map<string, RealtimeChannel> = new Map()
  private connectionStatus: RealtimeConnectionStatus = 'disconnected'
  private connectionStatusCallbacks: Set<ConnectionStatusCallback> = new Set()
  private errorCallbacks: Set<ErrorCallback> = new Set()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000 // Start with 1 second
  private maxReconnectDelay = 30000 // Max 30 seconds

  /**
   * Subscribe to database changes
   */
  subscribe<T extends Record<string, any> = Record<string, any>>(
    channelId: string,
    config: SubscriptionConfig,
    callback: SubscriptionCallback<T>
  ): () => void {
    try {
      // Remove existing subscription if it exists
      this.unsubscribe(channelId)

      // Create channel name (include session filter if present)
      const channelName = this.generateChannelName(channelId, config)
      
      // Create new channel
      const channel = supabase.channel(channelName)

      // Configure postgres changes subscription
      channel.on(
        'postgres_changes' as any,
        {
          event: config.event || '*',
          schema: config.schema || 'public',
          table: config.table,
          filter: config.filter
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          try {
            callback(payload)
          } catch (error) {
            console.error(`Error in subscription callback for ${channelId}:`, error)
            this.handleError(new Error(`Callback error: ${error instanceof Error ? error.message : 'Unknown'}`))
          }
        }
      )

      // Handle connection status changes
      channel.on('system' as any, {}, (payload: any) => {
        switch (payload.type) {
          case 'connect':
            this.setConnectionStatus('connected')
            this.reconnectAttempts = 0
            this.reconnectDelay = 1000
            break
          case 'disconnect':
            this.setConnectionStatus('disconnected')
            this.scheduleReconnect()
            break
          case 'error':
            this.setConnectionStatus('error')
            this.handleError(new Error(`Channel error: ${payload.message || 'Unknown error'}`))
            break
        }
      })

      // Subscribe to the channel
      this.setConnectionStatus('connecting')
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to ${channelId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Failed to subscribe to ${channelId}`)
          this.handleError(new Error(`Subscription failed for ${channelId}`))
        }
      })

      // Store the channel
      this.channels.set(channelId, channel)

      // Return unsubscribe function
      return () => this.unsubscribe(channelId)

    } catch (error) {
      console.error(`Error setting up subscription ${channelId}:`, error)
      this.handleError(new Error(`Setup error: ${error instanceof Error ? error.message : 'Unknown'}`))
      return () => {} // Return no-op function
    }
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channelId: string): void {
    const channel = this.channels.get(channelId)
    if (channel) {
      try {
        supabase.removeChannel(channel)
        this.channels.delete(channelId)
        console.log(`Unsubscribed from ${channelId}`)
      } catch (error) {
        console.error(`Error unsubscribing from ${channelId}:`, error)
      }
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    for (const channelId of this.channels.keys()) {
      this.unsubscribe(channelId)
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): RealtimeConnectionStatus {
    return this.connectionStatus
  }

  /**
   * Add connection status callback
   */
  onConnectionStatusChange(callback: ConnectionStatusCallback): () => void {
    this.connectionStatusCallbacks.add(callback)
    // Immediately call with current status
    callback(this.connectionStatus)
    
    // Return cleanup function
    return () => {
      this.connectionStatusCallbacks.delete(callback)
    }
  }

  /**
   * Add error callback
   */
  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.add(callback)
    
    // Return cleanup function
    return () => {
      this.errorCallbacks.delete(callback)
    }
  }

  /**
   * Get active subscription count
   */
  getActiveSubscriptionCount(): number {
    return this.channels.size
  }

  /**
   * Check if a subscription exists
   */
  hasSubscription(channelId: string): boolean {
    return this.channels.has(channelId)
  }

  private generateChannelName(channelId: string, config: SubscriptionConfig): string {
    // Include table and filter in channel name for uniqueness
    const parts = [channelId, config.table]
    if (config.filter) {
      // Create a short hash of the filter for channel name
      const filterHash = btoa(config.filter).slice(0, 8)
      parts.push(filterHash)
    }
    return parts.join('_')
  }

  private setConnectionStatus(status: RealtimeConnectionStatus): void {
    if (this.connectionStatus !== status) {
      this.connectionStatus = status
      console.log(`Real-time connection status changed to: ${status}`)
      
      // Notify all callbacks
      for (const callback of this.connectionStatusCallbacks) {
        try {
          callback(status)
        } catch (error) {
          console.error('Error in connection status callback:', error)
        }
      }
    }
  }

  private handleError(error: Error): void {
    console.error('Real-time subscription error:', error)
    
    // Notify all error callbacks
    for (const callback of this.errorCallbacks) {
      try {
        callback(error)
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError)
      }
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('Max reconnection attempts reached')
      this.setConnectionStatus('error')
      return
    }

    this.reconnectAttempts++
    this.setConnectionStatus('reconnecting')
    
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${this.reconnectDelay}ms`)
    
    setTimeout(() => {
      this.attemptReconnection()
    }, this.reconnectDelay)

    // Exponential backoff with max delay
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay)
  }

  private async attemptReconnection(): Promise<void> {
    try {
      // Get all current channel configurations
      const channelsToReconnect = new Map<string, { channel: RealtimeChannel, config: any }>()
      
      for (const [channelId, channel] of this.channels) {
        // Store channel info for recreation
        channelsToReconnect.set(channelId, { channel, config: null })
      }

      // Remove all existing channels
      this.unsubscribeAll()

      // For now, we'll let the individual components handle reconnection
      // by detecting the connection status change
      console.log('Reconnection cleanup completed. Components should reinitialize subscriptions.')
      
    } catch (error) {
      console.error('Error during reconnection:', error)
      this.handleError(new Error(`Reconnection failed: ${error instanceof Error ? error.message : 'Unknown'}`))
    }
  }
}

/**
 * Global singleton instance of the subscription manager
 */
export const realtimeManager = new RealtimeSubscriptionManager()

/**
 * Utility function to create session-specific filters
 */
export function createSessionFilter(sessionId: string): string {
  return `session_id=eq.${sessionId}`
}

/**
 * Utility function to create player-specific filters
 */
export function createPlayerFilter(playerId: string): string {
  return `player_id=eq.${playerId}`
}

/**
 * Utility function to create faction-specific filters
 */
export function createFactionFilter(factionId: string): string {
  return `faction_id=eq.${factionId}`
}

/**
 * Utility function to create turn-specific filters
 */
export function createTurnFilter(sessionId: string, turnNumber: number): string {
  return `session_id=eq.${sessionId},turn_number=eq.${turnNumber}`
}

/**
 * Debounce utility for rapid updates
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null
  
  const debounced = ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T & { cancel: () => void }
  
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }
  
  return debounced
}