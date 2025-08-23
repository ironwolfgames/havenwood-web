/**
 * Turn Results Modal Component
 * 
 * Main modal overlay for displaying turn resolution results.
 * Shows resource changes, action outcomes, and global effects.
 */

import React, { useState, useEffect } from 'react'
import { ProcessedTurnResults, processTurnResults } from '@/lib/game/results'
import { TurnResult } from '@/lib/supabase'
import { ResourceChangesCard } from './ResourceChangesCard'
import { ActionOutcomesList } from './ActionOutcomesList'
import { GlobalEventsCard } from './GlobalEventsCard'

export interface TurnResultsModalProps {
  sessionId: string
  turnId?: string
  turnNumber?: number
  isOpen: boolean
  onClose: () => void
  onNavigate?: (turnNumber: number) => void
}

export function TurnResultsModal({
  sessionId,
  turnId,
  turnNumber,
  isOpen,
  onClose,
  onNavigate
}: TurnResultsModalProps) {
  const [results, setResults] = useState<ProcessedTurnResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'resources' | 'actions' | 'events'>('summary')

  useEffect(() => {
    if (isOpen && (turnId || (sessionId && turnNumber))) {
      fetchResults()
    }
  }, [isOpen, turnId, sessionId, turnNumber])

  const fetchResults = async () => {
    setLoading(true)
    setError(null)

    try {
      let url: string
      if (turnId) {
        url = `/api/results/${turnId}`
      } else {
        // Get results by session and turn
        const response = await fetch(`/api/results/history/${sessionId}?startTurn=${turnNumber}&endTurn=${turnNumber}&limit=1`)
        const historyData = await response.json()
        
        if (!response.ok) {
          throw new Error(historyData.error || 'Failed to fetch results')
        }
        
        if (historyData.history.results.length === 0) {
          throw new Error('No results found for this turn')
        }
        
        const turnResultId = historyData.history.results[0].id
        url = `/api/results/${turnResultId}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch turn results')
      }

      // Process the raw results into display format
      const processedResults = processTurnResults(data.turnResult as TurnResult)
      setResults(processedResults)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Failed to fetch turn results:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const navigateToTurn = (direction: 'prev' | 'next') => {
    if (!results || !onNavigate) return
    
    const newTurnNumber = direction === 'prev' 
      ? results.turnNumber - 1 
      : results.turnNumber + 1
    
    if (newTurnNumber > 0) {
      onNavigate(newTurnNumber)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">
              Turn {results?.turnNumber || turnNumber || '...'} Results
            </h2>
            {results && (
              <div className="text-sm opacity-90">
                Resolved: {new Date(results.resolvedAt).toLocaleString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Navigation buttons */}
            {onNavigate && results && (
              <>
                <button
                  onClick={() => navigateToTurn('prev')}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded text-sm"
                  disabled={results.turnNumber <= 1}
                >
                  ← Previous
                </button>
                <button
                  onClick={() => navigateToTurn('next')}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded text-sm"
                >
                  Next →
                </button>
              </>
            )}
            
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Tab Navigation */}
          <div className="border-b bg-gray-50 px-4">
            <div className="flex space-x-6">
              {[
                { id: 'summary', label: 'Summary', icon: '📊' },
                { id: 'resources', label: 'Resources', icon: '💎' },
                { id: 'actions', label: 'Actions', icon: '⚡' },
                { id: 'events', label: 'Events', icon: '🌟' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-2 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="text-gray-600">Loading turn results...</div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-red-600 text-lg mb-2">⚠️ Error</div>
                <div className="text-red-800">{error}</div>
                <button
                  onClick={fetchResults}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {results && !loading && !error && (
              <>
                {activeTab === 'summary' && (
                  <TurnSummaryView results={results} />
                )}
                
                {activeTab === 'resources' && (
                  <ResourceChangesCard 
                    changes={results.resourceChanges}
                    className="max-w-none"
                  />
                )}
                
                {activeTab === 'actions' && (
                  <ActionOutcomesList 
                    outcomes={results.actionOutcomes}
                    className="max-w-none"
                  />
                )}
                
                {activeTab === 'events' && (
                  <GlobalEventsCard 
                    globalEffects={results.globalEffects}
                    factionInteractions={results.factionInteractions}
                    className="max-w-none"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Turn Summary View Component
 */
function TurnSummaryView({ results }: { results: ProcessedTurnResults }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {results.summary.totalActions}
          </div>
          <div className="text-sm text-blue-800">Total Actions</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {results.summary.successfulActions}
          </div>
          <div className="text-sm text-green-800">Successful</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {results.summary.failedActions}
          </div>
          <div className="text-sm text-red-800">Failed</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {results.summary.factionsActive}
          </div>
          <div className="text-sm text-purple-800">Factions Active</div>
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <ResourceChangesCard 
          changes={results.resourceChanges.slice(0, 5)} 
          title="Top Resource Changes"
          showViewMore={results.resourceChanges.length > 5}
          className=""
        />
        
        <ActionOutcomesList 
          outcomes={results.actionOutcomes.slice(0, 3)}
          title="Recent Actions"
          showViewMore={results.actionOutcomes.length > 3}
          className=""
        />
      </div>

      {/* Global Effects Summary */}
      {results.globalEffects.activeEffects.length > 0 && (
        <GlobalEventsCard 
          globalEffects={results.globalEffects}
          factionInteractions={results.factionInteractions}
          className=""
        />
      )}

      {/* Performance Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600">
          <strong>Resolution Time:</strong> {results.summary.resolutionTimeFormatted}
          {' • '}
          <strong>Resources Generated:</strong> {results.summary.resourcesGenerated}
          {' • '}
          <strong>Resources Consumed:</strong> {results.summary.resourcesConsumed}
        </div>
      </div>
    </div>
  )
}