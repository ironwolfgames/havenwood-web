/**
 * Faction Dashboard Component
 * 
 * Main dashboard container that orchestrates the display of
 * faction-specific resources, actions, and status information.
 */

import React from 'react'
import { FactionSystemType } from '@/lib/game/resources'
import { ResourcePanel, ResourceInfo } from './ResourcePanel'
import { ActionSelectionArea, ActionOption } from './ActionSelectionArea'
import { FactionStatusCard, StatusMetric } from './FactionStatusCard'

// Import faction-specific dashboards
import { MolesDashboard } from './factions/MolesDashboard'
import { BadgersDashboard } from './factions/BadgersDashboard'
import { ScholarsDashboard } from './factions/ScholarsDashboard'
import { OttersDashboard } from './factions/OttersDashboard'

export interface FactionData {
  id: string
  name: string
  systemType: FactionSystemType
  description: string
}

export interface GameContext {
  sessionId: string
  turnNumber: number
  playerId: string
  timeRemaining?: number
}

export interface FactionDashboardProps {
  faction: FactionData
  gameContext: GameContext
  resources: ResourceInfo[]
  availableActions: ActionOption[]
  statusMetrics: StatusMetric[]
  onActionSelect?: (action: ActionOption) => void
  onActionSubmit?: (action: ActionOption, parameters: Record<string, any>) => void
  onResourceTransfer?: (to: string, resourceType: string, amount: number) => void
  className?: string
}

export function FactionDashboard({
  faction,
  gameContext,
  resources,
  availableActions,
  statusMetrics,
  onActionSelect,
  onActionSubmit,
  onResourceTransfer,
  className = ""
}: FactionDashboardProps) {
  
  // Render faction-specific dashboard based on system type
  const renderFactionSpecificDashboard = () => {
    const commonProps = {
      faction,
      gameContext,
      resources,
      availableActions,
      statusMetrics,
      onActionSelect,
      onActionSubmit,
      onResourceTransfer
    }

    switch (faction.systemType) {
      case 'provisioner':
        return <MolesDashboard {...commonProps} />
      case 'guardian':
        return <BadgersDashboard {...commonProps} />
      case 'mystic':
        return <ScholarsDashboard {...commonProps} />
      case 'explorer':
        return <OttersDashboard {...commonProps} />
      default:
        return null
    }
  }

  // Get faction theme class
  const getFactionTheme = (): string => {
    const themes: Record<FactionSystemType, string> = {
      provisioner: 'theme-moles',
      guardian: 'theme-badgers',
      mystic: 'theme-scholars',
      explorer: 'theme-otters'
    }
    return themes[faction.systemType] || ''
  }

  return (
    <div className={`faction-dashboard ${getFactionTheme()} ${className}`}>
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="faction-title">
          <h1 className="text-3xl font-bold">{faction.name}</h1>
          <p className="text-lg opacity-80">{faction.description}</p>
        </div>
        
        <div className="game-info">
          <div className="turn-info">
            <span className="text-sm">Turn {gameContext.turnNumber}</span>
            {gameContext.timeRemaining && (
              <span className="text-sm ml-4">⏰ {Math.ceil(gameContext.timeRemaining / 60)}m left</span>
            )}
          </div>
        </div>
      </header>

      {/* Render faction-specific dashboard */}
      <div className="dashboard-content">
        {renderFactionSpecificDashboard()}
      </div>

      {/* Fallback generic dashboard if faction-specific one isn't available */}
      {!renderFactionSpecificDashboard() && (
        <div className="generic-dashboard">
          <div className="dashboard-grid">
            {/* Resources Panel */}
            <section className="dashboard-section">
              <ResourcePanel resources={resources} title={`${faction.name} Resources`} />
            </section>

            {/* Status Card */}
            <section className="dashboard-section">
              <FactionStatusCard
                factionName={faction.name}
                factionType={faction.systemType}
                metrics={statusMetrics}
              />
            </section>

            {/* Action selection - full width */}
            <section className="dashboard-section actions-section">
              <ActionSelectionArea
                availableActions={availableActions}
                onActionSelect={onActionSelect || (() => {})}
                onActionSubmit={onActionSubmit}
              />
            </section>
          </div>
        </div>
      )}
    </div>
  )
}