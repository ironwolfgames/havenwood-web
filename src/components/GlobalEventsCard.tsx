/**
 * Global Events Card Component
 * 
 * Displays global effects, world events, and faction interactions
 * that occurred during turn resolution.
 */

import React, { useState } from 'react'
import { GlobalEffectsSummary, FactionInteraction } from '@/lib/game/results'

export interface GlobalEventsCardProps {
  globalEffects: GlobalEffectsSummary
  factionInteractions: FactionInteraction[]
  events?: WorldEvent[]
  className?: string
}

export interface WorldEvent {
  id: string
  name: string
  description: string
  type: 'positive' | 'negative' | 'neutral'
  effects: string[]
  severity: 'minor' | 'moderate' | 'major'
}

export function GlobalEventsCard({
  globalEffects,
  factionInteractions,
  events = [],
  className = ''
}: GlobalEventsCardProps) {
  const [activeTab, setActiveTab] = useState<'effects' | 'interactions' | 'events'>('effects')

  const hasContent = globalEffects.activeEffects.length > 0 || 
                    factionInteractions.length > 0 || 
                    events.length > 0

  if (!hasContent) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Events</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🌍</div>
          <div>No global events or effects this turn</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Global Events & Effects</h3>
        <div className="text-sm text-gray-600">
          {globalEffects.activeEffects.length} active effects • 
          {factionInteractions.length} interactions • 
          {events.length} world events
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b mb-4">
        <div className="flex space-x-6">
          {[
            { id: 'effects', label: 'Global Effects', count: globalEffects.activeEffects.length, icon: '⚡' },
            { id: 'interactions', label: 'Faction Interactions', count: factionInteractions.length, icon: '🤝' },
            { id: 'events', label: 'World Events', count: events.length, icon: '🌟' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              } ${tab.count === 0 ? 'opacity-50' : ''}`}
              disabled={tab.count === 0}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'effects' && (
          <GlobalEffectsView globalEffects={globalEffects} />
        )}
        
        {activeTab === 'interactions' && (
          <FactionInteractionsView interactions={factionInteractions} />
        )}
        
        {activeTab === 'events' && (
          <WorldEventsView events={events} />
        )}
      </div>
    </div>
  )
}

/**
 * Global Effects View Component
 */
function GlobalEffectsView({ globalEffects }: { globalEffects: GlobalEffectsSummary }) {
  if (globalEffects.activeEffects.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <div className="text-3xl mb-2">⚖️</div>
        <div>No global effects active this turn</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Active Effects */}
      <div className="space-y-3">
        {globalEffects.activeEffects.map((effect, index) => (
          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-blue-900 mb-1">
                  {getGlobalEffectIcon(effect)} {effect}
                </div>
                <div className="text-sm text-blue-800">
                  {globalEffects.effectDescriptions[effect] || 'Effect description not available'}
                </div>
              </div>
              
              {/* Effect Magnitude */}
              <div className="text-right ml-4">
                {effect.includes('Penalty') && (
                  <div className="text-red-600 font-medium">
                    -{globalEffects.foodShortagePenalty}
                  </div>
                )}
                {effect.includes('Stability') && (
                  <div className="text-green-600 font-medium">
                    +{globalEffects.stabilityBonus}
                  </div>
                )}
                {effect.includes('Insight') && (
                  <div className="text-purple-600 font-medium">
                    +{globalEffects.insightBonus}%
                  </div>
                )}
                {effect.includes('Infrastructure') && (
                  <div className="text-orange-600 font-medium">
                    -{globalEffects.infrastructureBonus}%
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Effect Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Effect Summary</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span>Food Shortage Penalty:</span>
            <span className={globalEffects.foodShortagePenalty > 0 ? 'text-red-600' : 'text-gray-500'}>
              -{globalEffects.foodShortagePenalty}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Stability Bonus:</span>
            <span className={globalEffects.stabilityBonus > 0 ? 'text-green-600' : 'text-gray-500'}>
              +{globalEffects.stabilityBonus}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Insight Bonus:</span>
            <span className={globalEffects.insightBonus > 0 ? 'text-purple-600' : 'text-gray-500'}>
              +{globalEffects.insightBonus}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Infrastructure Bonus:</span>
            <span className={globalEffects.infrastructureBonus > 0 ? 'text-orange-600' : 'text-gray-500'}>
              -{globalEffects.infrastructureBonus}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Faction Interactions View Component
 */
function FactionInteractionsView({ interactions }: { interactions: FactionInteraction[] }) {
  if (interactions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <div className="text-3xl mb-2">🤝</div>
        <div>No faction interactions this turn</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {interactions.map((interaction, index) => (
        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {getInteractionIcon(interaction.type)}
              </div>
              
              <div>
                <div className="font-medium text-green-900">
                  {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                </div>
                <div className="text-sm text-green-800">
                  {interaction.fromFaction} → {interaction.toFaction}
                </div>
              </div>
            </div>
            
            {/* Interaction Details */}
            <div className="text-right text-sm">
              {interaction.resource && interaction.amount && (
                <div className="text-green-700 font-medium">
                  {interaction.amount} {interaction.resource.split('_').join(' ')}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-2 text-sm text-green-800">
            {interaction.description}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * World Events View Component
 */
function WorldEventsView({ events }: { events: WorldEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <div className="text-3xl mb-2">🌟</div>
        <div>No world events occurred this turn</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id || index} className={`rounded-lg p-4 border ${getEventStyling(event.type)}`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-medium mb-1">
                {getEventIcon(event.type)} {event.name}
              </div>
              <div className="text-sm opacity-90">
                {event.description}
              </div>
            </div>
            
            <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadge(event.severity)}`}>
              {event.severity.toUpperCase()}
            </div>
          </div>
          
          {/* Event Effects */}
          {event.effects.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-medium mb-1">Effects:</div>
              <div className="space-y-1">
                {event.effects.map((effect, effectIndex) => (
                  <div key={effectIndex} className="text-sm opacity-90">
                    • {effect}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Helper functions for styling and icons
 */
function getGlobalEffectIcon(effect: string): string {
  if (effect.includes('Food') || effect.includes('Shortage')) return '🍎'
  if (effect.includes('Stability')) return '⚖️'
  if (effect.includes('Insight')) return '🧠'
  if (effect.includes('Infrastructure')) return '🏗️'
  return '⚡'
}

function getInteractionIcon(type: string): string {
  const icons: Record<string, string> = {
    trade: '🔄',
    support: '🤝',
    cooperation: '⭐'
  }
  return icons[type] || '🤝'
}

function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    positive: '✨',
    negative: '⚠️',
    neutral: '📝'
  }
  return icons[type] || '🌟'
}

function getEventStyling(type: string): string {
  const styles: Record<string, string> = {
    positive: 'bg-green-50 border-green-200 text-green-900',
    negative: 'bg-red-50 border-red-200 text-red-900',
    neutral: 'bg-gray-50 border-gray-200 text-gray-900'
  }
  return styles[type] || styles.neutral
}

function getSeverityBadge(severity: string): string {
  const badges: Record<string, string> = {
    minor: 'bg-blue-100 text-blue-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    major: 'bg-red-100 text-red-800'
  }
  return badges[severity] || badges.minor
}