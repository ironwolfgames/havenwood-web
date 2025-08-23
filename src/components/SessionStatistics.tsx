/**
 * Session Statistics Component
 * 
 * Displays comprehensive game session statistics including duration,
 * resource efficiency, action metrics, and collaboration analysis.
 */

'use client'

import React, { useState } from 'react'
import { SessionStatistics } from '@/types/endgame'
import { ResourceType } from '@/lib/game/resources'

export interface SessionStatisticsProps {
  statistics: SessionStatistics
  className?: string
  compactMode?: boolean
}

export function SessionStatisticsComponent({
  statistics,
  className = '',
  compactMode = false
}: SessionStatisticsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'actions' | 'collaboration'>('overview')

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

  const getEfficiencyColor = (efficiency: number): string => {
    if (efficiency >= 80) return 'text-green-600'
    if (efficiency >= 60) return 'text-yellow-600'
    if (efficiency >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getEfficiencyBgColor = (efficiency: number): string => {
    if (efficiency >= 80) return 'bg-green-50 border-green-200'
    if (efficiency >= 60) return 'bg-yellow-50 border-yellow-200'
    if (efficiency >= 40) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Session Duration */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-800">⏱️ Session Overview</h3>
          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {statistics.sessionId.slice(0, 8)}...
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {statistics.duration.formattedDuration}
            </div>
            <div className="text-sm text-blue-700">Total Duration</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {statistics.turnInfo.totalTurns}
            </div>
            <div className="text-sm text-blue-700">Turns Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(statistics.turnInfo.averageTurnDuration)}s
            </div>
            <div className="text-sm text-blue-700">Avg Turn Time</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(statistics.actions.averageActionsPerTurn)}
            </div>
            <div className="text-sm text-blue-700">Avg Actions/Turn</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {statistics.actions.successfulActions}
          </div>
          <div className="text-sm text-green-700 mb-1">Successful Actions</div>
          <div className="text-xs text-green-600">
            {Math.round((statistics.actions.successfulActions / statistics.actions.totalActions) * 100)}% success rate
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {statistics.collaboration.resourceTradeCount}
          </div>
          <div className="text-sm text-purple-700 mb-1">Resource Trades</div>
          <div className="text-xs text-purple-600">
            {statistics.collaboration.coordinationEffectiveness}/100 coordination
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(statistics.resources.wastePercentage)}%
          </div>
          <div className="text-sm text-orange-700 mb-1">Resource Waste</div>
          <div className="text-xs text-orange-600">
            Room for improvement
          </div>
        </div>
      </div>
    </div>
  )

  const renderResourcesTab = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4">
          <h3 className="text-lg font-semibold">🌿 Resource Management Analysis</h3>
          <p className="text-sm opacity-90">Overall efficiency and resource flow patterns</p>
        </div>
        
        <div className="p-6">
          <div className="grid gap-4">
            {Object.entries(statistics.resources.totalGenerated).map(([resourceType, generated]) => {
              const consumed = statistics.resources.totalConsumed[resourceType as ResourceType] || 0
              const efficiency = statistics.resources.efficiency[resourceType as ResourceType] || 0
              const netBalance = generated - consumed
              
              return (
                <div 
                  key={resourceType}
                  className={`border rounded-lg p-4 ${getEfficiencyBgColor(efficiency)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">
                        {getResourceIcon(resourceType as ResourceType)}
                      </span>
                      <span className="font-medium">
                        {formatResourceName(resourceType as ResourceType)}
                      </span>
                    </div>
                    <div className={`text-sm font-medium ${getEfficiencyColor(efficiency)}`}>
                      {efficiency}% efficiency
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Generated</div>
                      <div className="font-medium text-green-600">+{generated}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Consumed</div>
                      <div className="font-medium text-red-600">-{consumed}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Net Balance</div>
                      <div className={`font-medium ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {netBalance >= 0 ? '+' : ''}{netBalance}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Utilization</div>
                      <div className="font-medium">
                        {Math.round((consumed / (generated || 1)) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  const renderActionsTab = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4">
          <h3 className="text-lg font-semibold">⚡ Action Performance</h3>
          <p className="text-sm opacity-90">Analysis of all actions taken during the session</p>
        </div>
        
        <div className="p-6">
          {/* Action Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-xl font-bold text-gray-700">
                {statistics.actions.totalActions}
              </div>
              <div className="text-sm text-gray-600">Total Actions</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-xl font-bold text-green-600">
                {statistics.actions.successfulActions}
              </div>
              <div className="text-sm text-green-700">Successful</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded">
              <div className="text-xl font-bold text-red-600">
                {statistics.actions.failedActions}
              </div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-xl font-bold text-blue-600">
                {Math.round(statistics.actions.averageActionsPerTurn)}
              </div>
              <div className="text-sm text-blue-700">Per Turn</div>
            </div>
          </div>

          {/* Action Type Breakdown */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Action Type Distribution</h4>
            <div className="space-y-2">
              {Object.entries(statistics.actions.actionTypeBreakdown).map(([actionType, count]) => {
                const percentage = Math.round((count / statistics.actions.totalActions) * 100)
                return (
                  <div key={actionType} className="flex items-center space-x-3">
                    <div className="w-24 text-sm font-medium capitalize">
                      {actionType.replace('_', ' ')}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 w-16 text-right">
                      {count} ({percentage}%)
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCollaborationTab = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
          <h3 className="text-lg font-semibold">🤝 Collaboration Analysis</h3>
          <p className="text-sm opacity-90">How well the factions worked together</p>
        </div>
        
        <div className="p-6">
          {/* Collaboration Score */}
          <div className="text-center mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {statistics.collaboration.coordinationEffectiveness}/100
            </div>
            <div className="text-lg text-purple-700 mb-2">Coordination Effectiveness</div>
            <div className="text-sm text-purple-600">
              {statistics.collaboration.coordinationEffectiveness >= 80 ? 'Excellent teamwork!' :
               statistics.collaboration.coordinationEffectiveness >= 60 ? 'Good collaboration' :
               statistics.collaboration.coordinationEffectiveness >= 40 ? 'Moderate cooperation' :
               'Room for improvement'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trade Activity */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">💰 Trade Activity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Resource Trades</span>
                  <span className="font-medium">{statistics.collaboration.resourceTradeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cross-Faction Support</span>
                  <span className="font-medium">{statistics.collaboration.crossFactionSupport}</span>
                </div>
              </div>
            </div>

            {/* Most Collaborative */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">🌟 Most Collaborative</h4>
              <div className="space-y-1">
                {statistics.collaboration.mostCollaborativeFactions.map((faction, index) => (
                  <div key={faction} className="flex items-center space-x-2">
                    <span className="text-lg">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <span className="text-sm">{faction}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: '📊 Overview', content: renderOverviewTab },
    { id: 'resources', label: '🌿 Resources', content: renderResourcesTab },
    { id: 'actions', label: '⚡ Actions', content: renderActionsTab },
    { id: 'collaboration', label: '🤝 Teamwork', content: renderCollaborationTab }
  ]

  if (compactMode) {
    return (
      <div className={`session-statistics-compact ${className}`}>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Session Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium">{statistics.duration.formattedDuration}</span>
            </div>
            <div>
              <span className="text-gray-600">Turns:</span>
              <span className="ml-2 font-medium">{statistics.turnInfo.totalTurns}</span>
            </div>
            <div>
              <span className="text-gray-600">Success Rate:</span>
              <span className="ml-2 font-medium">
                {Math.round((statistics.actions.successfulActions / statistics.actions.totalActions) * 100)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Teamwork:</span>
              <span className="ml-2 font-medium">{statistics.collaboration.coordinationEffectiveness}/100</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`session-statistics ${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.content()}
      </div>
    </div>
  )
}