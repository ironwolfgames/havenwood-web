/**
 * Oakshield Badgers Dashboard Component
 * 
 * Faction-specific dashboard for the Guardians.
 * Shows defensive metrics, fortification levels,
 * and protection capabilities.
 */

import React from 'react'
import { ResourcePanel } from '../ResourcePanel'
import { ActionSelectionArea } from '../ActionSelectionArea'
import { FactionStatusCard } from '../FactionStatusCard'
import { FactionDashboardProps } from '../FactionDashboard'

export function BadgersDashboard({
  faction,
  gameContext,
  resources,
  availableActions,
  statusMetrics,
  onActionSelect,
  onActionSubmit,
  onResourceTransfer
}: FactionDashboardProps) {
  
  // Filter resources relevant to Badgers (protection_tokens, stability_tokens)
  const badgersResources = resources.filter(r => 
    ['protection_tokens', 'stability_tokens', 'food', 'timber'].includes(r.type)
  )

  // Defense status component
  const DefenseStatus = () => {
    return (
      <div className="defense-status">
        <h4 className="font-bold mb-3">🛡️ Defense Status</h4>
        <div className="defense-grid">
          <div className="defense-item fortification">
            <span className="defense-icon">🏰</span>
            <div className="defense-info">
              <span className="defense-name">Fortification Level</span>
              <span className="defense-value level-3">Level 3/5</span>
            </div>
          </div>
          <div className="defense-item coverage">
            <span className="defense-icon">🗺️</span>
            <div className="defense-info">
              <span className="defense-name">Coverage Area</span>
              <span className="defense-value">75% Protected</span>
            </div>
          </div>
          <div className="defense-item threat">
            <span className="defense-icon">⚠️</span>
            <div className="defense-info">
              <span className="defense-name">Threat Level</span>
              <span className="defense-value low">Low</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Global protection pool component
  const ProtectionPool = () => {
    const protectionTokens = resources.find(r => r.type === 'protection_tokens')?.quantity || 0
    const stabilityTokens = resources.find(r => r.type === 'stability_tokens')?.quantity || 0

    return (
      <div className="protection-pool">
        <h4 className="font-bold mb-3">🌍 Global Protection Pool</h4>
        <div className="pool-status">
          <div className="pool-item">
            <span className="pool-icon">🛡️</span>
            <div className="pool-info">
              <span className="pool-name">Protection Tokens</span>
              <span className="pool-amount">{protectionTokens}</span>
              <span className="pool-contribution">+2 per turn</span>
            </div>
          </div>
          <div className="pool-item">
            <span className="pool-icon">⚖️</span>
            <div className="pool-info">
              <span className="pool-name">Stability Tokens</span>
              <span className="pool-amount">{stabilityTokens}</span>
              <span className="pool-contribution">+1 per turn</span>
            </div>
          </div>
        </div>
        <div className="pool-effects">
          <p className="text-sm text-gray-600">
            🛡️ Protection defends against world events<br/>
            ⚖️ Stability boosts Scholar rituals & Otter engineering
          </p>
        </div>
      </div>
    )
  }

  // Emergency response component
  const EmergencyResponse = () => {
    return (
      <div className="emergency-response">
        <h4 className="font-bold mb-3">🚨 Emergency Response</h4>
        <div className="response-options">
          <button className="response-btn patrol">
            🚶 Deploy Patrol (+1 Protection)
          </button>
          <button className="response-btn fortify">
            🏗️ Reinforce Defenses (2 Timber)
          </button>
          <button className="response-btn emergency">
            ⚡ Emergency Shield (3 Protection)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="badgers-dashboard">
      <div className="dashboard-grid">
        {/* Defense status and metrics */}
        <section className="dashboard-section primary">
          <DefenseStatus />
          <ProtectionPool />
        </section>

        {/* Resource and status panel */}
        <section className="dashboard-section secondary">
          <ResourcePanel 
            resources={badgersResources} 
            title="🛡️ Defense Resources"
            className="badgers-resources"
          />
          <FactionStatusCard
            factionName={faction.name}
            factionType={faction.systemType}
            metrics={[
              ...statusMetrics,
              { name: 'Defense Rating', value: 'A+', icon: '🛡️', status: 'good' },
              { name: 'Guard Efficiency', value: '92%', icon: '👮', status: 'good' },
              { name: 'Resource Upkeep', value: '2 Food/turn', icon: '🍽️', status: 'good' }
            ]}
            specialAbilities={[
              'Shield Wall: Double protection against large threats',
              'Guard Rotation: Maintain defense during other actions',
              'Rally Call: Boost all faction efficiency in crisis'
            ]}
          />
        </section>

        {/* Emergency response and quick actions */}
        <section className="dashboard-section tertiary">
          <EmergencyResponse />
          <div className="stability-boost">
            <h4 className="font-bold mb-3">⚖️ Stability Network</h4>
            <div className="boost-effects">
              <div className="boost-item">
                <span className="boost-target">🔮 Scholars</span>
                <span className="boost-value">+15% Ritual Success</span>
              </div>
              <div className="boost-item">
                <span className="boost-target">🗺️ Otters</span>
                <span className="boost-value">+20% Build Reliability</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action selection - full width */}
        <section className="dashboard-section actions full-width">
          <ActionSelectionArea
            availableActions={availableActions.filter(a => 
              ['protect', 'build', 'special'].includes(a.type)
            )}
            onActionSelect={onActionSelect || (() => {})}
            onActionSubmit={onActionSubmit}
          />
        </section>
      </div>
    </div>
  )
}