/**
 * Faction-Specific Action Form Component
 * 
 * Provides specialized action forms for each faction's unique abilities.
 * Renders different UI elements based on faction type and selected action.
 */

import React, { useState } from 'react'
import { GameActionType } from '@/types/game'

export interface FactionActionFormProps {
  factionType: 'provisioner' | 'guardian' | 'mystic' | 'explorer'
  actionType: GameActionType
  parameters: Record<string, any>
  onParameterChange: (key: string, value: any) => void
  className?: string
}

export function FactionActionForm({
  factionType,
  actionType,
  parameters,
  onParameterChange,
  className = ""
}: FactionActionFormProps) {
  
  const renderProvisionerForm = () => {
    if (actionType === 'gather') {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Crop Type</label>
            <select 
              value={parameters.cropType || 'wheat'}
              onChange={(e) => onParameterChange('cropType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="wheat">Wheat (+2 Food)</option>
              <option value="vegetables">Vegetables (+1 Food, +1 Health)</option>
              <option value="herbs">Herbs (+1 Food, +1 Magic)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Plot Size</label>
            <input
              type="range"
              min="1"
              max="5"
              value={parameters.plotSize || 2}
              onChange={(e) => onParameterChange('plotSize', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Small (1)</span>
              <span className="font-medium">Size: {parameters.plotSize || 2}</span>
              <span>Large (5)</span>
            </div>
          </div>
        </div>
      )
    }
    
    if (actionType === 'special') {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Provisioner Ability</label>
            <select 
              value={parameters.ability || 'fertility_ritual'}
              onChange={(e) => onParameterChange('ability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="fertility_ritual">Fertility Ritual (Boost next harvest)</option>
              <option value="craft_tools">Craft Tools (Improve efficiency)</option>
              <option value="harvest_bonus">Early Harvest (Extra food this turn)</option>
            </select>
          </div>
        </div>
      )
    }
    
    return null
  }

  const renderGuardianForm = () => {
    if (actionType === 'protect') {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Defense Type</label>
            <select 
              value={parameters.defenseType || 'patrol'}
              onChange={(e) => onParameterChange('defenseType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="patrol">Patrol (+2 Protection)</option>
              <option value="fortify">Fortify (+3 Protection, -1 Food)</option>
              <option value="watch">Watch Tower (+1 Protection, +1 Insight)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coverage Area</label>
            <div className="flex space-x-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="coverage"
                  value="local"
                  checked={parameters.coverage === 'local'}
                  onChange={(e) => onParameterChange('coverage', 'local')}
                  className="mr-1"
                />
                Local
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="coverage"
                  value="regional"
                  checked={parameters.coverage === 'regional'}
                  onChange={(e) => onParameterChange('coverage', 'regional')}
                  className="mr-1"
                />
                Regional
              </label>
            </div>
          </div>
        </div>
      )
    }
    
    if (actionType === 'special') {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Guardian Ability</label>
            <select 
              value={parameters.ability || 'emergency_response'}
              onChange={(e) => onParameterChange('ability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="emergency_response">Emergency Response (Instant protection)</option>
              <option value="rally_call">Rally Call (Boost all factions)</option>
              <option value="shield_wall">Shield Wall (Maximum protection)</option>
            </select>
          </div>
        </div>
      )
    }
    
    return null
  }

  const renderMysticForm = () => {
    if (actionType === 'research') {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Magic School</label>
            <select 
              value={parameters.magicSchool || 'divination'}
              onChange={(e) => onParameterChange('magicSchool', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="divination">Divination (Foresee future events)</option>
              <option value="enchantment">Enchantment (Enhance abilities)</option>
              <option value="transmutation">Transmutation (Transform resources)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Research Intensity</label>
            <input
              type="range"
              min="1"
              max="3"
              value={parameters.intensity || 1}
              onChange={(e) => onParameterChange('intensity', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Basic</span>
              <span className="font-medium">Level {parameters.intensity || 1}</span>
              <span>Advanced</span>
            </div>
          </div>
        </div>
      )
    }
    
    if (actionType === 'special') {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Mystic Ability</label>
            <select 
              value={parameters.ability || 'forecast'}
              onChange={(e) => onParameterChange('ability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="forecast">Weather Forecast (Preview next turn)</option>
              <option value="enchant">Enchant Resources (Double output)</option>
              <option value="ritual">Magic Ritual (Boost all factions)</option>
            </select>
          </div>
        </div>
      )
    }
    
    return null
  }

  const renderExplorerForm = () => {
    if (actionType === 'build') {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Infrastructure Type</label>
            <select 
              value={parameters.infraType || 'road'}
              onChange={(e) => onParameterChange('infraType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="road">Road (Improve trade routes)</option>
              <option value="bridge">Bridge (Connect regions)</option>
              <option value="port">Port (Enable water transport)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Construction Scale</label>
            <div className="flex space-x-2">
              {['Small', 'Medium', 'Large'].map((scale, idx) => (
                <label key={scale} className="flex items-center">
                  <input
                    type="radio"
                    name="scale"
                    value={scale.toLowerCase()}
                    checked={parameters.scale === scale.toLowerCase()}
                    onChange={(e) => onParameterChange('scale', scale.toLowerCase())}
                    className="mr-1"
                  />
                  {scale}
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    }
    
    if (actionType === 'special') {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Explorer Ability</label>
            <select 
              value={parameters.ability || 'scouting'}
              onChange={(e) => onParameterChange('ability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="scouting">Scouting (Discover resources)</option>
              <option value="trade_route">Trade Route (Improve efficiency)</option>
              <option value="expedition">Expedition (Major exploration)</option>
            </select>
          </div>
        </div>
      )
    }
    
    return null
  }

  const renderForm = () => {
    switch (factionType) {
      case 'provisioner':
        return renderProvisionerForm()
      case 'guardian':
        return renderGuardianForm()
      case 'mystic':
        return renderMysticForm()
      case 'explorer':
        return renderExplorerForm()
      default:
        return <div className="text-gray-500">No faction-specific options available.</div>
    }
  }

  return (
    <div className={`faction-action-form ${className}`}>
      <h5 className="font-medium text-sm text-gray-700 mb-3">
        {factionType.charAt(0).toUpperCase() + factionType.slice(1)} Specialization
      </h5>
      {renderForm()}
    </div>
  )
}