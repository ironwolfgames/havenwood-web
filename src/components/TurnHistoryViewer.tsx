/**
 * Turn History Viewer Component
 * 
 * Provides a comprehensive view of all turns in a game session,
 * with navigation, filtering, and summary statistics.
 */

import React, { useState, useEffect } from 'react'
import { TurnResultsModal } from './TurnResultsModal'

export interface TurnHistoryViewerProps {
  sessionId: string
  currentTurn?: number
  className?: string
  onTurnSelect?: (turnNumber: number) => void
}

interface TurnHistorySummary {
  id: string
  turnNumber: number
  resolvedAt: string
  summary: {
    totalActions?: number
    processedActions?: number
    failedActions?: number
    resolutionTime?: number
  }
  hasData: boolean
}

interface HistoryResponse {
  success: boolean
  history: {
    sessionId: string
    results: TurnHistorySummary[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
    summary: {
      totalTurns: number
      completedTurns: number
      averageResolutionTime: number
      totalActions: number
      failedActions: number
    }
  }
}

export function TurnHistoryViewer({
  sessionId,
  currentTurn,
  className = '',
  onTurnSelect
}: TurnHistoryViewerProps) {
  const [history, setHistory] = useState<HistoryResponse['history'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTurnId, setSelectedTurnId] = useState<string | null>(null)
  const [selectedTurnNumber, setSelectedTurnNumber] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchHistory(1)
  }, [sessionId])

  const fetchHistory = async (page: number = 1) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/results/history/${sessionId}?page=${page}&limit=12`)
      const data: HistoryResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.history?.toString() || 'Failed to fetch history')
      }

      setHistory(data.history)
      setCurrentPage(page)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Failed to fetch turn history:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTurnClick = (turn: TurnHistorySummary) => {
    setSelectedTurnId(turn.id)
    setSelectedTurnNumber(turn.turnNumber)
    setShowModal(true)
    
    if (onTurnSelect) {
      onTurnSelect(turn.turnNumber)
    }
  }

  const navigateInModal = (turnNumber: number) => {
    setSelectedTurnNumber(turnNumber)
    // Don't change turnId, let the modal fetch the correct data
    setSelectedTurnId(null)
    
    if (onTurnSelect) {
      onTurnSelect(turnNumber)
    }
  }

  if (loading && !history) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="text-2xl mb-2">📚</div>
            <div className="text-gray-600">Loading turn history...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !history) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">⚠️ Error</div>
          <div className="text-red-800 mb-4">{error}</div>
          <button
            onClick={() => fetchHistory(1)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Turn History</h3>
          {history && (
            <div className="text-sm text-gray-600">
              {history.summary.completedTurns} completed turns • 
              Average resolution: {Math.round(history.summary.averageResolutionTime)}ms
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* History Summary Stats */}
      {history && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600">
              {history.summary.totalActions}
            </div>
            <div className="text-xs text-blue-800">Total Actions</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-600">
              {history.summary.totalActions - history.summary.failedActions}
            </div>
            <div className="text-xs text-green-800">Successful</div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-600">
              {history.summary.failedActions}
            </div>
            <div className="text-xs text-red-800">Failed</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-600">
              {history.summary.completedTurns}
            </div>
            <div className="text-xs text-purple-800">Completed Turns</div>
          </div>
        </div>
      )}

      {/* Turn History Grid/List */}
      {history && history.results.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <TurnHistoryGrid 
              turns={history.results}
              currentTurn={currentTurn}
              onTurnClick={handleTurnClick}
            />
          ) : (
            <TurnHistoryList 
              turns={history.results}
              currentTurn={currentTurn}
              onTurnClick={handleTurnClick}
            />
          )}

          {/* Pagination */}
          {history.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <button
                onClick={() => fetchHistory(currentPage - 1)}
                disabled={!history.pagination.hasPrev || loading}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: history.pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => fetchHistory(pageNum)}
                    className={`px-3 py-2 text-sm rounded-md ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => fetchHistory(currentPage + 1)}
                disabled={!history.pagination.hasNext || loading}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📚</div>
          <div>No turn history available</div>
        </div>
      )}

      {/* Turn Results Modal */}
      <TurnResultsModal
        sessionId={sessionId}
        turnId={selectedTurnId || undefined}
        turnNumber={selectedTurnNumber || undefined}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onNavigate={navigateInModal}
      />
    </div>
  )
}

/**
 * Turn History Grid View
 */
interface TurnHistoryGridProps {
  turns: TurnHistorySummary[]
  currentTurn?: number
  onTurnClick: (turn: TurnHistorySummary) => void
}

function TurnHistoryGrid({ turns, currentTurn, onTurnClick }: TurnHistoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {turns.map(turn => (
        <button
          key={turn.id}
          onClick={() => onTurnClick(turn)}
          className={`p-4 border rounded-lg text-left hover:shadow-md transition-shadow ${
            turn.turnNumber === currentTurn 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Turn {turn.turnNumber}</div>
            <div className={`w-2 h-2 rounded-full ${
              turn.hasData ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              {turn.summary.totalActions || 0} actions
            </div>
            <div>
              {turn.summary.failedActions || 0} failed
            </div>
            <div className="text-xs">
              {new Date(turn.resolvedAt).toLocaleDateString()}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

/**
 * Turn History List View  
 */
interface TurnHistoryListProps {
  turns: TurnHistorySummary[]
  currentTurn?: number
  onTurnClick: (turn: TurnHistorySummary) => void
}

function TurnHistoryList({ turns, currentTurn, onTurnClick }: TurnHistoryListProps) {
  return (
    <div className="space-y-2">
      {turns.map(turn => (
        <button
          key={turn.id}
          onClick={() => onTurnClick(turn)}
          className={`w-full p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
            turn.turnNumber === currentTurn 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="font-medium">Turn {turn.turnNumber}</div>
              <div className={`w-2 h-2 rounded-full ${
                turn.hasData ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <div className="text-sm text-gray-600">
                {turn.summary.totalActions || 0} actions • 
                {turn.summary.failedActions || 0} failed • 
                {turn.summary.resolutionTime ? `${Math.round(turn.summary.resolutionTime)}ms` : 'N/A'}
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              {new Date(turn.resolvedAt).toLocaleString()}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}