/**
 * Starling Scholars Dashboard Component
 * 
 * Faction-specific dashboard for the Mystics.
 * Shows research progress, magical abilities,
 * and forecasting capabilities.
 */

import React from 'react'
import { ResourcePanel } from '../ResourcePanel'
import { ActionSelectionArea } from '../ActionSelectionArea'
import { FactionStatusCard } from '../FactionStatusCard'
import { FactionDashboardProps } from '../FactionDashboard'

export function ScholarsDashboard({
  faction,
  gameContext,
  resources,
  availableActions,
  statusMetrics,
  onActionSelect,
  onActionSubmit,
  onResourceTransfer
}: FactionDashboardProps) {
  
  // Filter resources relevant to Scholars (magic_crystals, insight_tokens, fiber)
  const scholarsResources = resources.filter(r => 
    ['magic_crystals', 'insight_tokens', 'fiber', 'stability_tokens'].includes(r.type)
  )

  // Research tree component
  const ResearchTree = () => {
    const researchAreas = [
      { name: 'Elemental Magic', progress: 3, total: 5, unlocked: true, icon: '🔥' },
      { name: 'Divination', progress: 4, total: 5, unlocked: true, icon: '🔮' },
      { name: 'Enchantment', progress: 1, total: 4, unlocked: true, icon: '✨' },
      { name: 'Ancient Lore', progress: 0, total: 6, unlocked: false, icon: '📜' }
    ]

    return (
      <div className="research-tree">
        <h4 className="font-bold mb-3">🔬 Research Progress</h4>
        <div className="research-branches">
          {researchAreas.map((area, index) => (
            <div 
              key={index} 
              className={`research-branch ${area.unlocked ? 'unlocked' : 'locked'}`}
            >
              <span className="research-icon">{area.icon}</span>
              <div className="research-info">
                <span className="research-name">{area.name}</span>
                <div className="research-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(area.progress / area.total) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">{area.progress}/{area.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Magical energy and forecasting
  const MagicalEnergy = () => {
    const magicCrystals = resources.find(r => r.type === 'magic_crystals')?.quantity || 0
    const insightTokens = resources.find(r => r.type === 'insight_tokens')?.quantity || 0
    
    return (
      <div className="magical-energy">
        <h4 className="font-bold mb-3">💫 Magical Energy</h4>
        <div className="energy-status">
          <div className="energy-item">
            <span className="energy-icon">💎</span>
            <div className="energy-info">
              <span className="energy-name">Magic Crystals</span>
              <span className="energy-amount">{magicCrystals}</span>
              <div className="energy-bar">
                <div 
                  className="energy-fill crystal"
                  style={{ width: `${Math.min((magicCrystals / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
          <div className="energy-item">
            <span className="energy-icon">🧠</span>
            <div className="energy-info">
              <span className="energy-name">Insight Tokens</span>
              <span className="energy-amount">{insightTokens}</span>
              <div className="energy-bar">
                <div 
                  className="energy-fill insight"
                  style={{ width: `${Math.min((insightTokens / 8) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Event forecasting component
  const EventForecasting = () => {
    const predictions = [
      { event: '🌧️ Resource Shortage', probability: 'Low', turns: '2-3', severity: 'Minor' },
      { event: '🐺 Wildlife Migration', probability: 'Medium', turns: '4-5', severity: 'Moderate' },
      { event: '🌟 Magical Surge', probability: 'High', turns: '1-2', severity: 'Beneficial' }
    ]

    return (
      <div className="event-forecasting">
        <h4 className="font-bold mb-3">🔮 Event Predictions</h4>
        <div className="predictions-list">
          {predictions.map((prediction, index) => (
            <div key={index} className="prediction-item">
              <span className="prediction-icon">{prediction.event.split(' ')[0]}</span>
              <div className="prediction-info">
                <span className="prediction-name">{prediction.event.slice(3)}</span>
                <div className="prediction-details">
                  <span className={`probability ${prediction.probability.toLowerCase()}`}>
                    {prediction.probability}
                  </span>
                  <span className="timing">Turn {prediction.turns}</span>
                  <span className="severity">{prediction.severity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Magical buffs component
  const MagicalBuffs = () => {
    return (
      <div className="magical-buffs">
        <h4 className="font-bold mb-3">✨ Active Enchantments</h4>
        <div className="buffs-grid">
          <div className="buff-item">
            <span className="buff-icon">🌾</span>
            <div className="buff-info">
              <span className="buff-name">Harvest Blessing</span>
              <span className="buff-effect">+20% Moles Production</span>
              <span className="buff-duration">3 turns left</span>
            </div>
          </div>
          <div className="buff-item">
            <span className="buff-icon">🔧</span>
            <div className="buff-info">
              <span className="buff-name">Engineering Focus</span>
              <span className="buff-effect">+25% Otter Build Speed</span>
              <span className="buff-duration">2 turns left</span>
            </div>
          </div>
        </div>
        <button className="cast-enchantment">
          ✨ Cast New Enchantment (2 Crystals)
        </button>
      </div>
    )
  }

  return (
    <div className="scholars-dashboard">
      <div className="dashboard-grid">
        {/* Research and magical energy */}
        <section className="dashboard-section primary">
          <ResearchTree />
          <MagicalEnergy />
        </section>

        {/* Resources and status */}
        <section className="dashboard-section secondary">
          <ResourcePanel 
            resources={scholarsResources} 
            title="🔮 Mystical Resources"
            className="scholars-resources"
          />
          <FactionStatusCard
            factionName={faction.name}
            factionType={faction.systemType}
            metrics={[
              ...statusMetrics,
              { name: 'Ritual Success Rate', value: '87%', icon: '🔮', status: 'good' },
              { name: 'Knowledge Level', value: 'Adept', icon: '📚', status: 'good' },
              { name: 'Magical Resonance', value: 'High', icon: '🌟', status: 'good' }
            ]}
            specialAbilities={[
              'Foresight: Predict upcoming events and threats',
              'Enchantment: Boost other factions with magical effects',
              'Arcane Knowledge: Unlock hidden game mechanics'
            ]}
          />
        </section>

        {/* Forecasting and buffs */}
        <section className="dashboard-section tertiary">
          <EventForecasting />
          <MagicalBuffs />
        </section>

        {/* Action selection - full width */}
        <section className="dashboard-section actions full-width">
          <ActionSelectionArea
            availableActions={availableActions.filter(a => 
              ['research', 'special', 'convert'].includes(a.type)
            )}
            onActionSelect={onActionSelect || (() => {})}
            onActionSubmit={onActionSubmit}
          />
        </section>
      </div>
    </div>
  )
}