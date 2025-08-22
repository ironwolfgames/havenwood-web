/**
 * Resource Panel Component
 * 
 * Displays faction resources with real-time updates,
 * change indicators, and trend visualization.
 */

import React from 'react'
import { ResourceType } from '@/lib/game/resources'

export interface ResourceInfo {
  type: ResourceType
  quantity: number
  delta?: number
  trend?: 'up' | 'down' | 'stable'
  warning?: boolean
}

export interface ResourcePanelProps {
  resources: ResourceInfo[]
  title?: string
  className?: string
}

export function ResourcePanel({ resources, title = "Resources", className = "" }: ResourcePanelProps) {
  const formatResourceName = (type: ResourceType): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getResourceIcon = (type: ResourceType): string => {
    const icons: Record<ResourceType, string> = {
      food: '🌾',
      timber: '🪵',
      fiber: '🧵',
      protection_tokens: '🛡️',
      stability_tokens: '⚖️',
      magic_crystals: '💎',
      insight_tokens: '🧠',
      infrastructure_tokens: '🏗️',
      project_progress: '🏛️'
    }
    return icons[type] || '❓'
  }

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable'): string => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'stable': return '➡️'
      default: return ''
    }
  }

  return (
    <div className={`resource-panel ${className}`}>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="resource-grid">
        {resources.map((resource) => (
          <div
            key={resource.type}
            className={`resource-item ${resource.warning ? 'resource-warning' : ''}`}
          >
            <div className="resource-header">
              <span className="resource-icon">{getResourceIcon(resource.type)}</span>
              <span className="resource-name">{formatResourceName(resource.type)}</span>
              {resource.trend && (
                <span className="resource-trend">{getTrendIcon(resource.trend)}</span>
              )}
            </div>
            <div className="resource-quantity">
              <span className="resource-amount">{resource.quantity}</span>
              {resource.delta !== undefined && resource.delta !== 0 && (
                <span className={`resource-delta ${resource.delta > 0 ? 'positive' : 'negative'}`}>
                  {resource.delta > 0 ? '+' : ''}{resource.delta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}