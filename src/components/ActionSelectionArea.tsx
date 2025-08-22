/**
 * Action Selection Area Component
 * 
 * Provides interface for selecting and configuring actions
 * with validation, preview, and cost display.
 */

import React, { useState } from 'react'
import { GameActionType } from '@/types/game'
import { ResourceType } from '@/lib/game/resources'

export interface ActionOption {
  id: string
  type: GameActionType
  name: string
  description: string
  costs?: Partial<Record<ResourceType, number>>
  enabled: boolean
  reason?: string // Reason why disabled if enabled is false
}

export interface ActionSelectionProps {
  availableActions: ActionOption[]
  selectedAction?: ActionOption
  onActionSelect: (action: ActionOption) => void
  onActionSubmit?: (action: ActionOption, parameters: Record<string, any>) => void
  className?: string
}

export function ActionSelectionArea({ 
  availableActions, 
  selectedAction, 
  onActionSelect, 
  onActionSubmit,
  className = "" 
}: ActionSelectionProps) {
  const [parameters, setParameters] = useState<Record<string, any>>({})

  const getActionIcon = (type: GameActionType): string => {
    const icons: Record<GameActionType, string> = {
      gather: '🏗️',
      trade: '🤝',
      convert: '🔄',
      build: '🏘️',
      research: '🔬',
      protect: '🛡️',
      special: '✨'
    }
    return icons[type] || '❓'
  }

  const formatResourceCosts = (costs?: Partial<Record<ResourceType, number>>): string => {
    if (!costs) return 'No cost'
    return Object.entries(costs)
      .filter(([_, amount]) => amount > 0)
      .map(([resource, amount]) => `${amount} ${resource.replace('_', ' ')}`)
      .join(', ')
  }

  const handleSubmit = () => {
    if (selectedAction && onActionSubmit) {
      onActionSubmit(selectedAction, parameters)
    }
  }

  return (
    <div className={`action-selection ${className}`}>
      <h3 className="text-lg font-bold mb-4">Available Actions</h3>
      
      <div className="action-grid">
        {availableActions.map((action) => (
          <div
            key={action.id}
            className={`action-item ${action.enabled ? 'enabled' : 'disabled'} ${
              selectedAction?.id === action.id ? 'selected' : ''
            }`}
            onClick={() => action.enabled && onActionSelect(action)}
          >
            <div className="action-header">
              <span className="action-icon">{getActionIcon(action.type)}</span>
              <span className="action-name">{action.name}</span>
            </div>
            <p className="action-description">{action.description}</p>
            <div className="action-costs">
              <small>Cost: {formatResourceCosts(action.costs)}</small>
            </div>
            {!action.enabled && action.reason && (
              <div className="action-disabled-reason">
                <small className="text-red-600">⚠️ {action.reason}</small>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedAction && (
        <div className="action-details">
          <h4 className="font-bold mt-6 mb-3">Action Details: {selectedAction.name}</h4>
          <p className="mb-4">{selectedAction.description}</p>
          
          {/* Action-specific parameter inputs would go here */}
          <div className="action-parameters">
            {selectedAction.type === 'gather' && (
              <div className="parameter-group">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  min="1"
                  value={parameters.amount || 1}
                  onChange={(e) => setParameters({...parameters, amount: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            
            {selectedAction.type === 'trade' && (
              <div className="parameter-group">
                <label className="block text-sm font-medium mb-1">Trade Amount</label>
                <input
                  type="number"
                  min="1"
                  value={parameters.amount || 1}
                  onChange={(e) => setParameters({...parameters, amount: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>

          {onActionSubmit && (
            <button
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!selectedAction.enabled}
            >
              Submit Action
            </button>
          )}
        </div>
      )}
    </div>
  )
}