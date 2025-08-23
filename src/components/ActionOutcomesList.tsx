/**
 * Action Outcomes List Component
 * 
 * Displays the results of player actions during turn resolution,
 * including success/failure status, resource costs/gains, and effects.
 */

import React, { useState } from 'react'
import { ProcessedActionOutcome } from '@/lib/game/results'

export interface ActionOutcomesListProps {
  outcomes: ProcessedActionOutcome[]
  title?: string
  showViewMore?: boolean
  className?: string
  groupByFaction?: boolean
  showResourceDetails?: boolean
}

export function ActionOutcomesList({
  outcomes,
  title = 'Action Outcomes',
  showViewMore = false,
  className = '',
  groupByFaction = false,
  showResourceDetails = true
}: ActionOutcomesListProps) {
  const [expanded, setExpanded] = useState(false)
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all')

  if (outcomes.length === 0) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">⚡</div>
          <div>No actions processed this turn</div>
        </div>
      </div>
    )
  }

  // Filter outcomes based on selected filter
  const filteredOutcomes = outcomes.filter(outcome => {
    if (filter === 'success') return outcome.success
    if (filter === 'failed') return !outcome.success
    return true
  })

  // Display outcomes (limit if not expanded)
  const displayOutcomes = expanded || !showViewMore 
    ? filteredOutcomes 
    : filteredOutcomes.slice(0, 3)

  // Calculate summary stats
  const successCount = outcomes.filter(o => o.success).length
  const failedCount = outcomes.length - successCount

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="text-sm text-gray-600">
            {outcomes.length} actions • 
            <span className="text-green-600 ml-1">{successCount} successful</span> • 
            <span className="text-red-600 ml-1">{failedCount} failed</span>
          </div>
        </div>
        
        {showViewMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {expanded ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      {outcomes.length > 3 && (
        <div className="mb-4">
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All', count: outcomes.length },
              { id: 'success', label: 'Successful', count: successCount },
              { id: 'failed', label: 'Failed', count: failedCount }
            ].map(filterOption => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === filterOption.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Outcomes List */}
      <div className="space-y-4">
        {displayOutcomes.map((outcome, index) => (
          <ActionOutcomeItem
            key={`${outcome.actionId}-${index}`}
            outcome={outcome}
            showResourceDetails={showResourceDetails}
            showFactionName={groupByFaction}
          />
        ))}
      </div>

      {/* Show more button */}
      {showViewMore && !expanded && filteredOutcomes.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Show {filteredOutcomes.length - 3} more actions...
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Individual Action Outcome Item
 */
interface ActionOutcomeItemProps {
  outcome: ProcessedActionOutcome
  showResourceDetails?: boolean
  showFactionName?: boolean
}

function ActionOutcomeItem({ 
  outcome, 
  showResourceDetails = true, 
  showFactionName = false 
}: ActionOutcomeItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`border rounded-lg p-4 ${
      outcome.success 
        ? 'border-green-200 bg-green-50' 
        : 'border-red-200 bg-red-50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {/* Status Icon */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
            outcome.success 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {outcome.success ? '✓' : '✗'}
          </div>
          
          {/* Action Info */}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {getActionIcon(outcome.actionType)} {outcome.actionTypeFormatted}
              </span>
              {showFactionName && outcome.factionName && (
                <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                  {outcome.factionName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand Button */}
        {(outcome.resourceCosts.length > 0 || outcome.resourceGains.length > 0 || outcome.effects.length > 0) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            {expanded ? '▲' : '▼'}
          </button>
        )}
      </div>

      {/* Quick Resource Summary */}
      {!expanded && showResourceDetails && (
        <div className="flex items-center space-x-4 text-sm">
          {outcome.resourceCosts.length > 0 && (
            <div className="text-red-600">
              -{outcome.resourceCosts.reduce((sum, cost) => sum + Math.abs(cost.delta), 0)} resources spent
            </div>
          )}
          {outcome.resourceGains.length > 0 && (
            <div className="text-green-600">
              +{outcome.resourceGains.reduce((sum, gain) => sum + gain.delta, 0)} resources gained
            </div>
          )}
          {outcome.effects.length > 0 && (
            <div className="text-blue-600">
              {outcome.effects.length} effect{outcome.effects.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 space-y-3">
          {/* Resource Costs */}
          {outcome.resourceCosts.length > 0 && (
            <div>
              <div className="text-sm font-medium text-red-700 mb-1">Resources Spent:</div>
              <div className="space-y-1">
                {outcome.resourceCosts.map((cost, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                    <span>{cost.resourceName}</span>
                    <span className="text-red-600 font-medium">{cost.deltaFormatted}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resource Gains */}
          {outcome.resourceGains.length > 0 && (
            <div>
              <div className="text-sm font-medium text-green-700 mb-1">Resources Gained:</div>
              <div className="space-y-1">
                {outcome.resourceGains.map((gain, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                    <span>{gain.resourceName}</span>
                    <span className="text-green-600 font-medium">{gain.deltaFormatted}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Effects */}
          {outcome.effects.length > 0 && (
            <div>
              <div className="text-sm font-medium text-blue-700 mb-1">Effects:</div>
              <div className="space-y-1">
                {outcome.effects.map((effect, index) => (
                  <div key={index} className="text-sm bg-white p-2 rounded text-blue-800">
                    • {effect}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {outcome.errors.length > 0 && (
            <div>
              <div className="text-sm font-medium text-red-700 mb-1">Errors:</div>
              <div className="space-y-1">
                {outcome.errors.map((error, index) => (
                  <div key={index} className="text-sm bg-red-100 p-2 rounded text-red-800">
                    ⚠️ {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {outcome.warnings.length > 0 && (
            <div>
              <div className="text-sm font-medium text-yellow-700 mb-1">Warnings:</div>
              <div className="space-y-1">
                {outcome.warnings.map((warning, index) => (
                  <div key={index} className="text-sm bg-yellow-100 p-2 rounded text-yellow-800">
                    ⚠️ {warning}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Get icon for action type
 */
function getActionIcon(actionType: string): string {
  const icons: Record<string, string> = {
    gather: '🌾',
    gathering: '🌾',
    trade: '🔄',
    exchange: '🔄',
    convert: '🔄',
    build: '🏗️',
    construction: '🏗️',
    research: '🔬',
    protect: '🛡️',
    protection: '🛡️',
    special: '⭐',
    validation: '✅',
    consumption: '🔥',
    global: '🌍',
    complete: '🎯'
  }
  return icons[actionType.toLowerCase()] || '⚡'
}

/**
 * Action Outcomes Summary Component
 * Shows high-level statistics about action outcomes
 */
export function ActionOutcomesSummary({ outcomes }: { outcomes: ProcessedActionOutcome[] }) {
  const successCount = outcomes.filter(o => o.success).length
  const failedCount = outcomes.length - successCount
  const successRate = outcomes.length > 0 ? (successCount / outcomes.length) * 100 : 0

  // Count by action type
  const actionTypeCounts = outcomes.reduce((counts, outcome) => {
    const type = outcome.actionType
    counts[type] = (counts[type] || 0) + 1
    return counts
  }, {} as Record<string, number>)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3">Action Summary</h4>
      
      {/* Success Rate */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Success Rate</span>
          <span>{successRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${successRate}%` }}
          ></div>
        </div>
      </div>

      {/* Action Type Breakdown */}
      <div className="space-y-2">
        {Object.entries(actionTypeCounts).map(([type, count]) => (
          <div key={type} className="flex justify-between text-sm">
            <span className="capitalize">
              {getActionIcon(type)} {type}
            </span>
            <span className="font-medium">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}