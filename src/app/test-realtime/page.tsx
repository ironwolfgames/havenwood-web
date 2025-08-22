/**
 * Real-time subscriptions test page
 * 
 * This page demonstrates the real-time subscription functionality
 * by allowing users to create test data and see updates in real-time
 * across multiple browser tabs.
 */

'use client'

import React, { useState, useEffect } from 'react'
import RealtimeProvider, { 
  useRealtimeContext, 
  ConnectionStatus, 
  ConnectionErrorBanner 
} from '@/contexts/RealtimeContext'
import { 
  useGameSessionSubscription,
  useResourcesSubscription,
  useActionsSubscription,
  useTurnResultsSubscription,
  useGameStateSubscription
} from '@/hooks/useRealtimeSubscription'
import { GameSession, Resource, Action, TurnResult } from '@/lib/supabase'

/**
 * Test subscription component
 */
function RealtimeTestContent() {
  const [sessionId, setSessionId] = useState('')
  const [receivedUpdates, setReceivedUpdates] = useState<Array<{
    type: string
    data: any
    timestamp: string
  }>>([])
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Real-time context
  const { isConnected, connectionStatus, activeSubscriptions } = useRealtimeContext()

  // Add update to the list
  const addUpdate = (type: string, data: any) => {
    setReceivedUpdates(prev => [
      {
        type,
        data,
        timestamp: new Date().toISOString()
      },
      ...prev.slice(0, 49) // Keep last 50 updates
    ])
  }

  // Subscribe to all game state changes
  const subscriptions = useGameStateSubscription(
    sessionId,
    {
      onSessionUpdate: (session) => addUpdate('SESSION_UPDATE', session),
      onResourceChange: (resource) => addUpdate('RESOURCE_CHANGE', resource),
      onActionSubmitted: (action) => addUpdate('ACTION_SUBMITTED', action),
      onTurnResolved: (result) => addUpdate('TURN_RESOLVED', result)
    },
    {
      enabled: isSubscribed && sessionId.length > 0,
      onError: (error) => console.error('Subscription error:', error)
    }
  )

  const handleStartSubscription = () => {
    if (!sessionId.trim()) {
      alert('Please enter a session ID')
      return
    }
    setIsSubscribed(true)
  }

  const handleStopSubscription = () => {
    setIsSubscribed(false)
    setReceivedUpdates([])
  }

  const handleClearUpdates = () => {
    setReceivedUpdates([])
  }

  // Create test session
  const handleCreateTestSession = async () => {
    if (!sessionId.trim()) {
      alert('Please enter a session ID first')
      return
    }

    try {
      const response = await fetch('/api/test-realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_session',
          sessionId: sessionId,
          sessionName: `Test Session ${sessionId}`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create test session')
      }

      const result = await response.json()
      addUpdate('TEST_SESSION_CREATED', result)
    } catch (error) {
      console.error('Error creating test session:', error)
      alert('Error creating test session: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  // Create test resource update
  const handleUpdateResource = async () => {
    if (!sessionId.trim()) {
      alert('Please enter a session ID first')
      return
    }

    try {
      const response = await fetch('/api/test-realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_resource',
          sessionId: sessionId,
          resourceType: 'food',
          quantity: Math.floor(Math.random() * 100)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update resource')
      }

      const result = await response.json()
      addUpdate('TEST_RESOURCE_UPDATED', result)
    } catch (error) {
      console.error('Error updating resource:', error)
      alert('Error updating resource: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  // Create test action
  const handleSubmitAction = async () => {
    if (!sessionId.trim()) {
      alert('Please enter a session ID first')
      return
    }

    try {
      const response = await fetch('/api/test-realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_action',
          sessionId: sessionId,
          actionType: 'gather',
          actionData: { resourceType: 'food', amount: 10 }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit action')
      }

      const result = await response.json()
      addUpdate('TEST_ACTION_SUBMITTED', result)
    } catch (error) {
      console.error('Error submitting action:', error)
      alert('Error submitting action: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Real-time Subscriptions Test
        </h1>
        <p className="text-gray-600">
          Test the real-time subscription system by creating updates and watching them appear in real-time.
          Open multiple browser tabs to see cross-tab synchronization.
        </p>
      </div>

      {/* Connection Error Banner */}
      <ConnectionErrorBanner />

      {/* Connection Status and Controls */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Connection Status</h3>
        
        <div className="flex items-center justify-between mb-4">
          <ConnectionStatus showText showSubscriptionCount />
          <div className="text-sm text-gray-500">
            Status: {connectionStatus} | Active Subscriptions: {activeSubscriptions}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Session ID (e.g., test-session-1)"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          
          {!isSubscribed ? (
            <button
              onClick={handleStartSubscription}
              disabled={!isConnected || !sessionId.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
            >
              Start Subscription
            </button>
          ) : (
            <button
              onClick={handleStopSubscription}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Stop Subscription
            </button>
          )}
        </div>
      </div>

      {/* Test Actions */}
      {isSubscribed && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Test Actions</h3>
          <div className="flex space-x-4">
            <button
              onClick={handleCreateTestSession}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Test Session
            </button>
            <button
              onClick={handleUpdateResource}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Update Resource
            </button>
            <button
              onClick={handleSubmitAction}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Submit Action
            </button>
          </div>
        </div>
      )}

      {/* Subscription Status */}
      {isSubscribed && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Subscription Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <span className={subscriptions.session.isSubscribed ? 'text-green-500' : 'text-red-500'}>
                {subscriptions.session.isSubscribed ? '●' : '○'}
              </span>
              <span className="ml-2">Game Session</span>
            </div>
            <div className="flex items-center">
              <span className={subscriptions.resources.isSubscribed ? 'text-green-500' : 'text-red-500'}>
                {subscriptions.resources.isSubscribed ? '●' : '○'}
              </span>
              <span className="ml-2">Resources</span>
            </div>
            <div className="flex items-center">
              <span className={subscriptions.actions.isSubscribed ? 'text-green-500' : 'text-red-500'}>
                {subscriptions.actions.isSubscribed ? '●' : '○'}
              </span>
              <span className="ml-2">Actions</span>
            </div>
            <div className="flex items-center">
              <span className={subscriptions.turnResults.isSubscribed ? 'text-green-500' : 'text-red-500'}>
                {subscriptions.turnResults.isSubscribed ? '●' : '○'}
              </span>
              <span className="ml-2">Turn Results</span>
            </div>
          </div>
          
          {subscriptions.hasErrors && (
            <div className="mt-2 text-red-600 text-sm">
              ⚠ Some subscriptions have errors. Check console for details.
            </div>
          )}
        </div>
      )}

      {/* Real-time Updates */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Real-time Updates ({receivedUpdates.length})</h3>
          <button
            onClick={handleClearUpdates}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
          >
            Clear Updates
          </button>
        </div>
        
        {receivedUpdates.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No real-time updates received yet. 
            {isSubscribed ? ' Create some test data using the buttons above.' : ' Start a subscription first.'}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {receivedUpdates.map((update, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded p-3 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm text-blue-600">
                    {update.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(update.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How to Test:</h4>
        <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
          <li>Enter a session ID and click &quot;Start Subscription&quot;</li>
          <li>Open this page in multiple browser tabs with the same session ID</li>
          <li>Click the test action buttons in one tab</li>
          <li>Watch real-time updates appear in all tabs within 1 second</li>
          <li>Test network interruptions by disconnecting/reconnecting internet</li>
        </ol>
      </div>
    </div>
  )
}

/**
 * Main test page with RealtimeProvider wrapper
 */
export default function TestRealtimePage() {
  return (
    <RealtimeProvider>
      <RealtimeTestContent />
    </RealtimeProvider>
  )
}