'use client'

import React, { useState, useEffect } from 'react'
import { ProjectStatusSummary, ProjectStage } from '@/types/projects'

interface ResourceContributionTrackerProps {
  status: ProjectStatusSummary
  stages: ProjectStage[]
  sessionId: string
  className?: string
}

interface FactionContribution {
  factionName: string
  factionIcon: string
  contributions: Record<string, number>
  totalContribution: number
  color: string
}

// Mock faction data for demo - in real implementation this would come from API
const mockFactions: FactionContribution[] = [
  {
    factionName: 'Meadow Moles',
    factionIcon: '🐭',
    contributions: {},
    totalContribution: 0,
    color: 'from-green-400 to-emerald-500'
  },
  {
    factionName: 'Oakshield Badgers', 
    factionIcon: '🦡',
    contributions: {},
    totalContribution: 0,
    color: 'from-amber-400 to-orange-500'
  },
  {
    factionName: 'Starling Scholars',
    factionIcon: '🐦', 
    contributions: {},
    totalContribution: 0,
    color: 'from-purple-400 to-violet-500'
  },
  {
    factionName: 'River Otters',
    factionIcon: '🦦',
    contributions: {},
    totalContribution: 0,
    color: 'from-blue-400 to-cyan-500'
  }
]

export default function ResourceContributionTracker({
  status,
  stages,
  sessionId,
  className = ''
}: ResourceContributionTrackerProps) {
  const [factionContributions, setFactionContributions] = useState<FactionContribution[]>([])
  const [totalContributions, setTotalContributions] = useState<Record<string, number>>({})

  // Calculate mock contributions based on current progress
  useEffect(() => {
    const currentStageData = stages.find(s => s.stage === status.currentStage)
    if (!currentStageData) return

    const mockContributions = mockFactions.map((faction, index) => {
      const contributions: Record<string, number> = {}
      let total = 0

      // Simulate different contribution patterns for each faction
      Object.entries(status.stageContributions).forEach(([resourceType, amount]) => {
        // Distribute contributions based on faction specialties
        let factionAmount = 0
        if (index === 0 && resourceType.includes('food')) factionAmount = Math.floor(amount * 0.4)
        else if (index === 1 && resourceType.includes('protection')) factionAmount = Math.floor(amount * 0.4)
        else if (index === 2 && resourceType.includes('magic')) factionAmount = Math.floor(amount * 0.4)
        else if (index === 3 && resourceType.includes('infrastructure')) factionAmount = Math.floor(amount * 0.4)
        else factionAmount = Math.floor(amount * 0.15)

        contributions[resourceType] = factionAmount
        total += factionAmount
      })

      return {
        ...faction,
        contributions,
        totalContribution: total
      }
    })

    setFactionContributions(mockContributions)

    // Calculate totals
    const totals: Record<string, number> = {}
    Object.keys(status.stageContributions).forEach(resourceType => {
      totals[resourceType] = mockContributions.reduce(
        (sum, faction) => sum + (faction.contributions[resourceType] || 0), 
        0
      )
    })
    setTotalContributions(totals)
  }, [status.stageContributions, stages, status.currentStage])

  const currentStageData = stages.find(s => s.stage === status.currentStage)
  if (!currentStageData) return null

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🤝 Faction Contributions
        </h3>
        <p className="text-sm text-gray-600">
          Real-time tracking of each faction&apos;s contributions to the current stage
        </p>
      </div>

      {/* Current Stage Resources */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Current Stage: {currentStageData.name}</h4>
        <div className="space-y-3">
          {Object.entries(currentStageData.requirements).map(([resourceType, required]) => {
            const contributed = status.stageContributions[resourceType] || 0
            const progress = Math.min((contributed / required) * 100, 100)
            const remaining = Math.max(0, required - contributed)

            return (
              <div key={resourceType} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="capitalize font-medium text-gray-800">
                      {resourceType.replace('_', ' ')}
                    </span>
                    {remaining === 0 && (
                      <span className="text-green-600">✓</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {contributed}/{required}
                    {remaining > 0 && (
                      <span className="text-red-600 ml-2">(-{remaining})</span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      remaining === 0 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Faction Contribution Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {factionContributions.map((faction) => {
                    const factionAmount = faction.contributions[resourceType] || 0
                    const factionPercent = contributed > 0 ? (factionAmount / contributed) * 100 : 0

                    return (
                      <div 
                        key={faction.factionName}
                        className="text-xs bg-white rounded border p-2 text-center"
                      >
                        <div className="flex items-center justify-center mb-1">
                          <span className="mr-1">{faction.factionIcon}</span>
                          <span className="font-medium truncate">
                            {faction.factionName.split(' ')[0]}
                          </span>
                        </div>
                        <div className="font-mono text-xs">
                          {factionAmount}
                        </div>
                        {factionPercent > 0 && (
                          <div className="text-xs text-gray-500">
                            ({Math.round(factionPercent)}%)
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Faction Leaderboard */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">🏆 Contribution Leaderboard</h4>
        <div className="space-y-2">
          {factionContributions
            .sort((a, b) => b.totalContribution - a.totalContribution)
            .map((faction, index) => (
              <div 
                key={faction.factionName}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${faction.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span>{faction.factionIcon}</span>
                      <span className="font-medium text-gray-800">{faction.factionName}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {faction.totalContribution} total resources
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">
                    {faction.totalContribution}
                  </div>
                  <div className="text-xs text-gray-500">
                    contributions
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>

      {/* Contribution Patterns */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">📊 Resource Distribution</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {Object.entries(totalContributions).map(([resourceType, total]) => (
              <div key={resourceType} className="text-center">
                <div className="font-bold text-gray-800">{total}</div>
                <div className="text-xs text-gray-600 capitalize">
                  {resourceType.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}