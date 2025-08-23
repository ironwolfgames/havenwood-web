/**
 * Faction Performance Card Component
 * 
 * Displays detailed performance metrics for individual factions,
 * including resource management, achievements, and project contributions.
 */

'use client'

import React, { useState } from 'react'
import { FactionPerformance, FactionAchievement } from '@/types/endgame'
import { ResourceType } from '@/lib/game/resources'

export interface FactionPerformanceCardProps {
  performance: FactionPerformance
  rank?: number
  className?: string
  expandable?: boolean
  showComparison?: boolean
  averagePerformance?: Partial<FactionPerformance>
}

export function FactionPerformanceCard({
  performance,
  rank,
  className = '',
  expandable = true,
  showComparison = false,
  averagePerformance
}: FactionPerformanceCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getFactionColor = (factionType: string): { bg: string; text: string; border: string } => {
    const colors = {
      provisioner: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      guardian: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      mystic: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      explorer: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
    }
    return colors[factionType as keyof typeof colors] || colors.provisioner
  }

  const getFactionIcon = (factionType: string): string => {
    const icons = {
      provisioner: '🐭', // Meadow Moles
      guardian: '🦡',    // Oakshield Badgers
      mystic: '🐦',      // Starling Scholars
      explorer: '🦦'     // River Otters
    }
    return icons[factionType as keyof typeof icons] || '❓'
  }

  const getFactionDisplayName = (factionType: string): string => {
    const names = {
      provisioner: 'Meadow Moles',
      guardian: 'Oakshield Badgers', 
      mystic: 'Starling Scholars',
      explorer: 'River Otters'
    }
    return names[factionType as keyof typeof names] || factionType
  }

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

  const getPerformanceGrade = (efficiency: number): { grade: string; color: string } => {
    if (efficiency >= 90) return { grade: 'S', color: 'text-yellow-600' }
    if (efficiency >= 80) return { grade: 'A', color: 'text-green-600' }
    if (efficiency >= 70) return { grade: 'B', color: 'text-blue-600' }
    if (efficiency >= 60) return { grade: 'C', color: 'text-orange-600' }
    return { grade: 'D', color: 'text-red-600' }
  }

  const getRankIcon = (rank?: number): string => {
    if (!rank) return ''
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getAchievementRarityColor = (rarity: string): string => {
    const colors = {
      common: 'text-gray-600 bg-gray-100',
      rare: 'text-blue-600 bg-blue-100',
      epic: 'text-purple-600 bg-purple-100',
      legendary: 'text-yellow-600 bg-yellow-100'
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const colors = getFactionColor(performance.factionType)
  const performanceGrade = getPerformanceGrade(performance.resourceEfficiency)

  return (
    <div className={`faction-performance-card ${colors.bg} ${colors.border} border rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`${colors.bg} border-b ${colors.border} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {getFactionIcon(performance.factionType)}
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${colors.text}`}>
                {getFactionDisplayName(performance.factionType)}
              </h3>
              <p className="text-sm text-gray-600">
                Player: {performance.playerId.slice(-8)}...
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {rank && (
              <span className="text-lg">
                {getRankIcon(rank)}
              </span>
            )}
            <div className="text-center">
              <div className={`text-2xl font-bold ${performanceGrade.color}`}>
                {performanceGrade.grade}
              </div>
              <div className="text-xs text-gray-600">Grade</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-700">
              {Math.round(performance.resourceEfficiency)}%
            </div>
            <div className="text-xs text-gray-600">Resource Efficiency</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {Math.round(performance.actionSuccessRate)}%
            </div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {performance.miniGoals.completed}/{performance.miniGoals.total}
            </div>
            <div className="text-xs text-gray-600">Mini-Goals</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">
              #{performance.projectContributionRank}
            </div>
            <div className="text-xs text-gray-600">Contribution Rank</div>
          </div>
        </div>

        {/* Achievements Preview */}
        {performance.achievements.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              🏆 Recent Achievements ({performance.achievements.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {performance.achievements.slice(0, 3).map(achievement => (
                <span
                  key={achievement.id}
                  className={`text-xs px-2 py-1 rounded-full ${getAchievementRarityColor(achievement.rarity)}`}
                  title={achievement.description}
                >
                  {achievement.icon} {achievement.name}
                </span>
              ))}
              {performance.achievements.length > 3 && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  +{performance.achievements.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        {expandable && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`w-full text-sm font-medium ${colors.text} hover:bg-gray-50 py-2 rounded transition-colors`}
          >
            {expanded ? '▲ Show Less' : '▼ Show Details'}
          </button>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t bg-gray-50">
          <div className="p-4 space-y-6">
            {/* Resource Management */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🌿 Resource Management</h4>
              <div className="space-y-2">
                {Object.entries(performance.resourcesGenerated).map(([resourceType, generated]) => {
                  const consumed = performance.resourcesConsumed[resourceType as ResourceType] || 0
                  const net = generated - consumed
                  return (
                    <div key={resourceType} className="flex items-center justify-between py-2 bg-white rounded px-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {getResourceIcon(resourceType as ResourceType)}
                        </span>
                        <span className="text-sm font-medium">
                          {formatResourceName(resourceType as ResourceType)}
                        </span>
                      </div>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-600">+{generated}</span>
                        <span className="text-red-600">-{consumed}</span>
                        <span className={`font-medium ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {net >= 0 ? '+' : ''}{net}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Project Contributions */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🏛️ Project Contributions</h4>
              <div className="bg-white rounded-lg p-3">
                {Object.entries(performance.projectContributions).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(performance.projectContributions).map(([resourceType, amount]) => (
                      <div key={resourceType} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span>{getResourceIcon(resourceType as ResourceType)}</span>
                          <span className="text-sm">{formatResourceName(resourceType as ResourceType)}</span>
                        </div>
                        <span className="font-medium text-blue-600">{amount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No project contributions recorded
                  </p>
                )}
              </div>
            </div>

            {/* Action Performance */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">⚡ Action Performance</h4>
              <div className="bg-white rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Actions Submitted:</span>
                    <span className="ml-2 font-medium">{performance.actionsSubmitted}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="ml-2 font-medium text-green-600">{Math.round(performance.actionSuccessRate)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Special Actions:</span>
                    <span className="ml-2 font-medium">{performance.specialActions}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Action Types:</span>
                    <span className="ml-2 font-medium">{performance.uniqueActionTypes.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* All Achievements */}
            {performance.achievements.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🏆 All Achievements</h4>
                <div className="space-y-2">
                  {performance.achievements.map(achievement => (
                    <div key={achievement.id} className="bg-white rounded-lg p-3 flex items-start space-x-3">
                      <span className="text-lg">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800">{achievement.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getAchievementRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Innovative Strategies */}
            {performance.innovativeStrategies.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">💡 Innovative Strategies</h4>
                <div className="bg-white rounded-lg p-3">
                  <ul className="space-y-1">
                    {performance.innovativeStrategies.map((strategy, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        • {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Comparison with Average */}
            {showComparison && averagePerformance && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">📊 Performance Comparison</h4>
                <div className="bg-white rounded-lg p-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Resource Efficiency vs Average:</span>
                      <span className={`font-medium ${
                        performance.resourceEfficiency > (averagePerformance.resourceEfficiency || 0) 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {performance.resourceEfficiency > (averagePerformance.resourceEfficiency || 0) ? '+' : ''}
                        {Math.round(performance.resourceEfficiency - (averagePerformance.resourceEfficiency || 0))}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actions vs Average:</span>
                      <span className={`font-medium ${
                        performance.actionsSubmitted > (averagePerformance.actionsSubmitted || 0)
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {performance.actionsSubmitted > (averagePerformance.actionsSubmitted || 0) ? '+' : ''}
                        {performance.actionsSubmitted - (averagePerformance.actionsSubmitted || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}