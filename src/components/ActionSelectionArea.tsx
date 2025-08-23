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
    <div className={`action-selection bg-white border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-bold mb-4">Available Actions</h3>
      
      <div className="action-grid grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {availableActions.map((action) => (
          <div
            key={action.id}
            className={`action-item border rounded-lg p-3 cursor-pointer transition-all ${
              action.enabled 
                ? 'border-gray-300 hover:border-blue-400 hover:shadow-md' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
            } ${
              selectedAction?.id === action.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
            onClick={() => action.enabled && onActionSelect(action)}
          >
            <div className="action-header flex items-center mb-2">
              <span className="action-icon text-xl mr-2">{getActionIcon(action.type)}</span>
              <span className="action-name font-medium">{action.name}</span>
            </div>
            <p className="action-description text-sm text-gray-600 mb-2">{action.description}</p>
            <div className="action-costs">
              <small className="text-xs text-gray-500">Cost: {formatResourceCosts(action.costs)}</small>
            </div>
            {!action.enabled && action.reason && (
              <div className="action-disabled-reason mt-2">
                <small className="text-xs text-red-600">⚠️ {action.reason}</small>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedAction && (
        <div className="action-details bg-gray-50 border rounded-lg p-4">
          <h4 className="font-bold text-lg mb-2">Action Details: {selectedAction.name}</h4>
          <p className="text-gray-600 mb-4">{selectedAction.description}</p>
          
          {/* Action-specific parameter inputs */}
          <div className="action-parameters mb-4">
            {selectedAction.type === 'gather' && (
              <div className="parameter-group">
                <label className="block text-sm font-medium mb-1">Resource Type</label>
                <select 
                  value={parameters.resourceType || 'food'}
                  onChange={(e) => setParameters({...parameters, resourceType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                >
                  <option value="food">Food</option>
                  <option value="timber">Timber</option>
                  <option value="fiber">Fiber</option>
                </select>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={parameters.amount || 1}
                  onChange={(e) => setParameters({...parameters, amount: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            
            {selectedAction.type === 'trade' && (
              <div className="parameter-group space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">From Resource</label>
                  <select 
                    value={parameters.fromResource || 'food'}
                    onChange={(e) => setParameters({...parameters, fromResource: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="food">Food</option>
                    <option value="timber">Timber</option>
                    <option value="fiber">Fiber</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To Resource</label>
                  <select 
                    value={parameters.toResource || 'timber'}
                    onChange={(e) => setParameters({...parameters, toResource: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="food">Food</option>
                    <option value="timber">Timber</option>
                    <option value="fiber">Fiber</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={parameters.amount || 1}
                    onChange={(e) => setParameters({...parameters, amount: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            )}

            {selectedAction.type === 'build' && (
              <div className="parameter-group space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Building Type</label>
                  <select 
                    value={parameters.buildingType || 'house'}
                    onChange={(e) => setParameters({...parameters, buildingType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="house">House</option>
                    <option value="workshop">Workshop</option>
                    <option value="storage">Storage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={parameters.quantity || 1}
                    onChange={(e) => setParameters({...parameters, quantity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            )}

            {selectedAction.type === 'research' && (
              <div className="parameter-group">
                <label className="block text-sm font-medium mb-1">Research Area</label>
                <select 
                  value={parameters.researchArea || 'agriculture'}
                  onChange={(e) => setParameters({...parameters, researchArea: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="agriculture">Agriculture</option>
                  <option value="construction">Construction</option>
                  <option value="magic">Magic</option>
                  <option value="navigation">Navigation</option>
                </select>
              </div>
            )}

            {selectedAction.type === 'protect' && (
              <div className="parameter-group">
                <label className="block text-sm font-medium mb-1">Protection Level</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={parameters.protectionLevel || 1}
                  onChange={(e) => setParameters({...parameters, protectionLevel: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">Level {parameters.protectionLevel || 1}</div>
              </div>
            )}

            {selectedAction.type === 'special' && (
              <div className="parameter-group">
                <label className="block text-sm font-medium mb-1">Special Ability</label>
                <select 
                  value={parameters.ability || 'faction_power'}
                  onChange={(e) => setParameters({...parameters, ability: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="faction_power">Faction Power</option>
                  <option value="emergency_response">Emergency Response</option>
                  <option value="resource_boost">Resource Boost</option>
                </select>
              </div>
            )}
          </div>

          {onActionSubmit && (
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={!selectedAction.enabled}
              >
                Submit Action
              </button>
              <button
                onClick={() => setParameters({})}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}