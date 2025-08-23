'use client'

import React from 'react'

interface GlobalContext {
  stabilityTokens: number
  protectionTokens: number
  infrastructureTokens: number
  turnsRemaining?: number
  maxTurns?: number
}

interface GlobalContextDisplayProps {
  globalContext: GlobalContext
  className?: string
}

export default function GlobalContextDisplay({
  globalContext,
  className = ''
}: GlobalContextDisplayProps) {
  const { stabilityTokens, protectionTokens, infrastructureTokens, turnsRemaining, maxTurns } = globalContext

  // Calculate overall kingdom health
  const calculateKingdomHealth = () => {
    const total = stabilityTokens + protectionTokens + infrastructureTokens
    const maxPossible = 30 // Assuming 10 is max for each
    const healthPercent = (total / maxPossible) * 100

    if (healthPercent >= 80) return { level: 'excellent', color: 'text-green-600', bgColor: 'bg-green-50' }
    if (healthPercent >= 60) return { level: 'good', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    if (healthPercent >= 40) return { level: 'fair', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
    if (healthPercent >= 20) return { level: 'poor', color: 'text-orange-600', bgColor: 'bg-orange-50' }
    return { level: 'critical', color: 'text-red-600', bgColor: 'bg-red-50' }
  }

  // Mock world events - in real implementation would come from API
  const getActiveWorldEvents = () => [
    {
      id: 1,
      name: 'Shadow Plague Spreading',
      description: 'Darkness encroaches on the outer villages. Protection efforts are crucial.',
      type: 'threat',
      impact: 'Reduces stability by 1 per turn if protection < 5',
      active: protectionTokens < 6
    },
    {
      id: 2, 
      name: 'Trade Routes Flourishing',
      description: 'Merchant activity increases resource efficiency.',
      type: 'benefit',
      impact: '+1 bonus to infrastructure actions',
      active: infrastructureTokens >= 7
    },
    {
      id: 3,
      name: 'Ancient Magic Awakening', 
      description: 'Old enchantments stir, affecting magical research.',
      type: 'neutral',
      impact: 'Magic crystal actions have unpredictable results',
      active: stabilityTokens >= 8
    }
  ]

  // Calculate efficiency modifiers
  const getEfficiencyModifiers = () => {
    const modifiers = []
    
    if (stabilityTokens >= 8) {
      modifiers.push({ type: 'positive', text: '+20% resource generation (High Stability)', icon: '📈' })
    } else if (stabilityTokens <= 3) {
      modifiers.push({ type: 'negative', text: '-20% resource generation (Low Stability)', icon: '📉' })
    }
    
    if (protectionTokens >= 8) {
      modifiers.push({ type: 'positive', text: 'Immunity to random events (Strong Protection)', icon: '🛡️' })
    } else if (protectionTokens <= 3) {
      modifiers.push({ type: 'negative', text: 'Vulnerable to disaster events (Weak Protection)', icon: '⚠️' })
    }
    
    if (infrastructureTokens >= 8) {
      modifiers.push({ type: 'positive', text: '+1 action per turn (Excellent Infrastructure)', icon: '🏗️' })
    } else if (infrastructureTokens <= 3) {
      modifiers.push({ type: 'negative', text: '-1 action per turn (Poor Infrastructure)', icon: '🚧' })
    }
    
    return modifiers
  }

  const kingdomHealth = calculateKingdomHealth()
  const worldEvents = getActiveWorldEvents()
  const activeEvents = worldEvents.filter(event => event.active)
  const efficiencyModifiers = getEfficiencyModifiers()

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🌍 Kingdom Status
        </h3>
        <p className="text-sm text-gray-600">
          Global conditions affecting all factions and project progress
        </p>
      </div>

      {/* Kingdom Health Overview */}
      <div className={`mb-6 p-4 rounded-lg ${kingdomHealth.bgColor} border border-gray-200`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-800">Overall Kingdom Health</span>
          <span className={`px-2 py-1 text-xs font-bold rounded bg-white ${kingdomHealth.color}`}>
            {kingdomHealth.level.toUpperCase()}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${stabilityTokens >= 7 ? 'text-green-600' : stabilityTokens >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
              {stabilityTokens}
            </div>
            <div className="text-xs text-gray-600 mb-1">⚖️ Stability</div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  stabilityTokens >= 7 ? 'bg-green-500' : stabilityTokens >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(stabilityTokens * 10, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${protectionTokens >= 7 ? 'text-green-600' : protectionTokens >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
              {protectionTokens}
            </div>
            <div className="text-xs text-gray-600 mb-1">🛡️ Protection</div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  protectionTokens >= 7 ? 'bg-green-500' : protectionTokens >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(protectionTokens * 10, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${infrastructureTokens >= 7 ? 'text-green-600' : infrastructureTokens >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
              {infrastructureTokens}
            </div>
            <div className="text-xs text-gray-600 mb-1">🏗️ Infrastructure</div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  infrastructureTokens >= 7 ? 'bg-green-500' : infrastructureTokens >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(infrastructureTokens * 10, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active World Events */}
      {activeEvents.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">🌟 Active World Events</h4>
          <div className="space-y-3">
            {activeEvents.map(event => (
              <div 
                key={event.id}
                className={`p-3 rounded-lg border-l-4 ${
                  event.type === 'threat' 
                    ? 'bg-red-50 border-red-400' 
                    : event.type === 'benefit'
                      ? 'bg-green-50 border-green-400'
                      : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h5 className="font-medium text-gray-800">{event.name}</h5>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    event.type === 'threat' 
                      ? 'bg-red-200 text-red-800' 
                      : event.type === 'benefit'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-blue-200 text-blue-800'
                  }`}>
                    {event.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <p className="text-xs text-gray-500">
                  <strong>Impact:</strong> {event.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Efficiency Modifiers */}
      {efficiencyModifiers.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">⚡ Current Modifiers</h4>
          <div className="space-y-2">
            {efficiencyModifiers.map((modifier, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-2 p-2 rounded text-sm ${
                  modifier.type === 'positive' 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}
              >
                <span className="text-base">{modifier.icon}</span>
                <span>{modifier.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failure Condition Warnings */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">⚠️ Risk Assessment</h4>
        <div className="space-y-2 text-sm">
          {stabilityTokens <= 2 && (
            <div className="bg-red-50 text-red-800 p-2 rounded border border-red-200">
              🚨 <strong>Critical:</strong> Stability dangerously low - kingdoms may collapse!
            </div>
          )}
          {protectionTokens <= 2 && (
            <div className="bg-red-50 text-red-800 p-2 rounded border border-red-200">
              🚨 <strong>Critical:</strong> Insufficient protection - vulnerable to disasters!
            </div>
          )}
          {infrastructureTokens <= 2 && (
            <div className="bg-red-50 text-red-800 p-2 rounded border border-red-200">
              🚨 <strong>Critical:</strong> Infrastructure failing - reduced action capacity!
            </div>
          )}
          {stabilityTokens > 2 && protectionTokens > 2 && infrastructureTokens > 2 && (
            <div className="bg-green-50 text-green-800 p-2 rounded border border-green-200">
              ✅ All critical systems operational - kingdoms are stable
            </div>
          )}
        </div>
      </div>

      {/* Time Pressure */}
      {turnsRemaining && maxTurns && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">⏰ Session Progress</span>
            <span className="text-sm text-gray-600">
              Turn {maxTurns - turnsRemaining + 1} of {maxTurns}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                turnsRemaining <= 3 ? 'bg-red-500' : turnsRemaining <= 6 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${((maxTurns - turnsRemaining) / maxTurns) * 100}%` }}
            />
          </div>
          <div className="text-center text-xs text-gray-600 mt-1">
            {turnsRemaining} turns remaining
          </div>
        </div>
      )}
    </div>
  )
}