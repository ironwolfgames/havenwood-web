/**
 * Resource Changes Card Component
 * 
 * Displays resource changes with before/after values, color-coded deltas,
 * and faction grouping. Shows the impact of turn resolution on resources.
 */

import React, { useState } from 'react'
import { ProcessedResourceChange } from '@/lib/game/results'

export interface ResourceChangesCardProps {
  changes: ProcessedResourceChange[]
  title?: string
  showViewMore?: boolean
  className?: string
  groupByFaction?: boolean
  showReasons?: boolean
}

export function ResourceChangesCard({
  changes,
  title = 'Resource Changes',
  showViewMore = false,
  className = '',
  groupByFaction = true,
  showReasons = true
}: ResourceChangesCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedFaction, setSelectedFaction] = useState<string>('')

  if (changes.length === 0) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <div>No resource changes this turn</div>
        </div>
      </div>
    )
  }

  // Group changes by faction if enabled
  const groupedChanges = groupByFaction ? groupChangesByFaction(changes) : { 'All': changes }
  const factionIds = Object.keys(groupedChanges)
  const currentFaction = selectedFaction || factionIds[0]

  // Calculate totals
  const totalGained = changes.filter(c => c.isPositive).reduce((sum, c) => sum + c.delta, 0)
  const totalLost = changes.filter(c => !c.isPositive).reduce((sum, c) => sum + Math.abs(c.delta), 0)

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="text-sm text-gray-600">
            {changes.length} changes • 
            <span className="text-green-600 ml-1">+{totalGained}</span> gained • 
            <span className="text-red-600 ml-1">-{totalLost}</span> consumed
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

      {/* Faction Selector */}
      {groupByFaction && factionIds.length > 1 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {factionIds.map(factionId => {
              const factionChanges = groupedChanges[factionId]
              const factionName = factionChanges[0]?.factionName || factionId
              
              return (
                <button
                  key={factionId}
                  onClick={() => setSelectedFaction(factionId)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    currentFaction === factionId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {factionName} ({factionChanges.length})
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Resource Changes List */}
      <div className="space-y-3">
        {groupedChanges[currentFaction].map((change, index) => (
          <ResourceChangeItem
            key={`${change.factionId}-${change.resourceType}-${index}`}
            change={change}
            showReason={showReasons}
            showFactionName={!groupByFaction}
          />
        ))}
      </div>

      {/* Show more button */}
      {showViewMore && !expanded && changes.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Show {changes.length - 5} more changes...
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Individual Resource Change Item
 */
interface ResourceChangeItemProps {
  change: ProcessedResourceChange
  showReason?: boolean
  showFactionName?: boolean
}

function ResourceChangeItem({ change, showReason = true, showFactionName = false }: ResourceChangeItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3">
        {/* Resource Icon */}
        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full border">
          {getResourceIcon(change.resourceType)}
        </div>
        
        {/* Resource Info */}
        <div>
          <div className="font-medium text-gray-900">
            {change.resourceName}
            {showFactionName && (
              <span className="text-sm text-gray-500 ml-2">
                ({change.factionName})
              </span>
            )}
          </div>
          {showReason && (
            <div className="text-xs text-gray-600">
              {change.reason} • {change.phase}
            </div>
          )}
        </div>
      </div>
      
      {/* Change Amount */}
      <div className="text-right">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{change.oldQuantity}</span>
          <span className="text-gray-400">→</span>
          <span className="text-sm font-medium text-gray-900">{change.newQuantity}</span>
        </div>
        <div className={`text-sm font-semibold ${
          change.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {change.deltaFormatted}
        </div>
      </div>
    </div>
  )
}

/**
 * Group resource changes by faction
 */
function groupChangesByFaction(changes: ProcessedResourceChange[]): Record<string, ProcessedResourceChange[]> {
  return changes.reduce((groups, change) => {
    const factionId = change.factionId
    if (!groups[factionId]) {
      groups[factionId] = []
    }
    groups[factionId].push(change)
    return groups
  }, {} as Record<string, ProcessedResourceChange[]>)
}

/**
 * Get icon for resource type
 */
function getResourceIcon(resourceType: string): string {
  const icons: Record<string, string> = {
    food: '🍎',
    timber: '🪵',
    fiber: '🌾',
    protection_tokens: '🛡️',
    stability_tokens: '⚖️',
    magic_crystals: '💎',
    insight_tokens: '🧠',
    infrastructure_tokens: '🏗️',
    project_progress: '🚧'
  }
  return icons[resourceType] || '📦'
}

/**
 * Summary Resource Changes Component
 * Shows aggregated resource changes across all factions
 */
export function ResourceChangesSummary({ changes }: { changes: ProcessedResourceChange[] }) {
  // Aggregate changes by resource type
  const aggregatedChanges = changes.reduce((agg, change) => {
    const key = change.resourceType
    if (!agg[key]) {
      agg[key] = {
        resourceType: change.resourceType,
        resourceName: change.resourceName,
        totalDelta: 0,
        positiveChanges: 0,
        negativeChanges: 0
      }
    }
    
    agg[key].totalDelta += change.delta
    if (change.delta > 0) {
      agg[key].positiveChanges += change.delta
    } else {
      agg[key].negativeChanges += Math.abs(change.delta)
    }
    
    return agg
  }, {} as Record<string, any>)

  const summary = Object.values(aggregatedChanges)
    .filter(s => s.totalDelta !== 0)
    .sort((a, b) => Math.abs(b.totalDelta) - Math.abs(a.totalDelta))

  if (summary.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No net resource changes
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {summary.map(item => (
        <div key={item.resourceType} className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">{getResourceIcon(item.resourceType)}</div>
          <div className="text-xs text-gray-600 mb-1">{item.resourceName}</div>
          <div className={`font-semibold text-sm ${
            item.totalDelta >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {item.totalDelta >= 0 ? '+' : ''}{item.totalDelta}
          </div>
        </div>
      ))}
    </div>
  )
}