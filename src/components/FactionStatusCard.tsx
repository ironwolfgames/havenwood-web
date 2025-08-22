/**
 * Faction Status Card Component
 * 
 * Displays faction-specific status indicators, metrics,
 * and special abilities/bonuses.
 */

import React from 'react'
import { FactionSystemType } from '@/lib/game/resources'

export interface StatusMetric {
  name: string
  value: string | number
  icon?: string
  status?: 'good' | 'warning' | 'critical'
  description?: string
}

export interface FactionStatusProps {
  factionName: string
  factionType: FactionSystemType
  metrics: StatusMetric[]
  specialAbilities?: string[]
  className?: string
}

export function FactionStatusCard({ 
  factionName, 
  factionType, 
  metrics, 
  specialAbilities = [],
  className = "" 
}: FactionStatusProps) {
  const getFactionIcon = (type: FactionSystemType): string => {
    const icons: Record<FactionSystemType, string> = {
      provisioner: '🌱', // Meadow Moles
      guardian: '🛡️',    // Oakshield Badgers
      mystic: '🔮',       // Starling Scholars
      explorer: '🗺️'      // River Otters
    }
    return icons[type] || '❓'
  }

  const getFactionTheme = (type: FactionSystemType): string => {
    const themes: Record<FactionSystemType, string> = {
      provisioner: 'faction-moles',
      guardian: 'faction-badgers',
      mystic: 'faction-scholars',
      explorer: 'faction-otters'
    }
    return themes[type]
  }

  const getStatusColor = (status?: 'good' | 'warning' | 'critical'): string => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`faction-status-card ${getFactionTheme(factionType)} ${className}`}>
      <div className="faction-header">
        <span className="faction-icon">{getFactionIcon(factionType)}</span>
        <div className="faction-info">
          <h3 className="faction-name">{factionName}</h3>
          <p className="faction-type">{factionType.charAt(0).toUpperCase() + factionType.slice(1)}</p>
        </div>
      </div>

      <div className="faction-metrics">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-item">
            <div className="metric-header">
              {metric.icon && <span className="metric-icon">{metric.icon}</span>}
              <span className="metric-name">{metric.name}</span>
            </div>
            <div className={`metric-value ${getStatusColor(metric.status)}`}>
              {metric.value}
            </div>
            {metric.description && (
              <div className="metric-description">
                <small>{metric.description}</small>
              </div>
            )}
          </div>
        ))}
      </div>

      {specialAbilities.length > 0 && (
        <div className="special-abilities">
          <h4 className="abilities-title">Special Abilities</h4>
          <ul className="abilities-list">
            {specialAbilities.map((ability, index) => (
              <li key={index} className="ability-item">
                ✨ {ability}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}