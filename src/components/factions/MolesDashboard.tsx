/**
 * Meadow Moles Dashboard Component
 * 
 * Faction-specific dashboard for the Provisioners.
 * Shows agricultural production, resource distribution,
 * and trading capabilities.
 */

import React from 'react'
import { ResourcePanel } from '../ResourcePanel'
import { ActionSelectionArea } from '../ActionSelectionArea'
import { FactionStatusCard } from '../FactionStatusCard'
import { FactionDashboardProps } from '../FactionDashboard'

export function MolesDashboard({
  faction,
  gameContext,
  resources,
  availableActions,
  statusMetrics,
  onActionSelect,
  onActionSubmit,
  onResourceTransfer
}: FactionDashboardProps) {
  
  // Filter resources relevant to Moles (food, timber, fiber)
  const molesResources = resources.filter(r => 
    ['food', 'timber', 'fiber'].includes(r.type)
  )

  // Production rates component
  const ProductionRates = () => {
    const productionMetrics = statusMetrics.filter(m => 
      m.name.toLowerCase().includes('production') || 
      m.name.toLowerCase().includes('efficiency')
    )

    return (
      <div className="production-rates">
        <h4 className="font-bold mb-3">🌾 Production Rates</h4>
        <div className="production-grid">
          <div className="production-item">
            <span className="production-icon">🌾</span>
            <div className="production-info">
              <span className="production-resource">Food</span>
              <span className="production-rate">+3 per turn</span>
            </div>
          </div>
          <div className="production-item">
            <span className="production-icon">🪵</span>
            <div className="production-info">
              <span className="production-resource">Timber</span>
              <span className="production-rate">+2 per turn</span>
            </div>
          </div>
          <div className="production-item">
            <span className="production-icon">🧵</span>
            <div className="production-info">
              <span className="production-resource">Fiber</span>
              <span className="production-rate">+2 per turn</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Resource distribution component
  const ResourceDistribution = () => {
    return (
      <div className="resource-distribution">
        <h4 className="font-bold mb-3">📤 Resource Distribution</h4>
        <div className="distribution-flows">
          <div className="flow-item">
            <span className="flow-resource">🌾 Food → All Factions</span>
            <span className="flow-amount">Sustains everyone</span>
          </div>
          <div className="flow-item">
            <span className="flow-resource">🪵 Timber → Badgers, Otters</span>
            <span className="flow-amount">For defenses & building</span>
          </div>
          <div className="flow-item">
            <span className="flow-resource">🧵 Fiber → Scholars, Otters</span>
            <span className="flow-amount">For scrolls & equipment</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="moles-dashboard">
      <div className="dashboard-grid">
        {/* Main resource panel */}
        <section className="dashboard-section primary">
          <ResourcePanel 
            resources={molesResources} 
            title="🌱 Agricultural Resources"
            className="moles-resources"
          />
          <ProductionRates />
        </section>

        {/* Status and metrics */}
        <section className="dashboard-section secondary">
          <FactionStatusCard
            factionName={faction.name}
            factionType={faction.systemType}
            metrics={[
              ...statusMetrics,
              { name: 'Farm Productivity', value: '85%', icon: '🚜', status: 'good' },
              { name: 'Storage Capacity', value: '12/20', icon: '🏪', status: 'warning' },
              { name: 'Trade Routes', value: '3 Active', icon: '🛤️', status: 'good' }
            ]}
            specialAbilities={[
              'Surplus Trading: Convert excess resources to any type',
              'Efficient Harvesting: +25% resource generation',
              'Emergency Reserves: Maintain food supply during shortages'
            ]}
          />
        </section>

        {/* Resource flows and distribution */}
        <section className="dashboard-section tertiary">
          <ResourceDistribution />
          <div className="transfer-interface">
            <h4 className="font-bold mb-3">🤝 Quick Transfer</h4>
            <div className="transfer-buttons">
              <button 
                className="transfer-btn badgers"
                onClick={() => onResourceTransfer?.('badgers', 'timber', 2)}
              >
                🪵→🛡️ Send Timber to Badgers
              </button>
              <button 
                className="transfer-btn scholars"
                onClick={() => onResourceTransfer?.('scholars', 'fiber', 1)}
              >
                🧵→🔮 Send Fiber to Scholars
              </button>
              <button 
                className="transfer-btn otters"
                onClick={() => onResourceTransfer?.('otters', 'timber', 1)}
              >
                🪵→🗺️ Send Timber to Otters
              </button>
            </div>
          </div>
        </section>

        {/* Action selection - full width */}
        <section className="dashboard-section actions full-width">
          <ActionSelectionArea
            availableActions={availableActions.filter(a => 
              ['gather', 'trade', 'convert'].includes(a.type)
            )}
            onActionSelect={onActionSelect || (() => {})}
            onActionSubmit={onActionSubmit}
          />
        </section>
      </div>
    </div>
  )
}