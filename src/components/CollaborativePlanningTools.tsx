'use client'

import React, { useState } from 'react'
import { ProjectStatusSummary, ProjectStage } from '@/types/projects'

interface CollaborativePlanningToolsProps {
  status: ProjectStatusSummary
  stages: ProjectStage[]
  onContribute?: (resourceType: string, amount: number) => Promise<void>
  className?: string
}

export default function CollaborativePlanningTools({
  status,
  stages,
  onContribute,
  className = ''
}: CollaborativePlanningToolsProps) {
  const [selectedResource, setSelectedResource] = useState<string>('')
  const [isContributing, setIsContributing] = useState(false)

  const currentStageData = stages.find(s => s.stage === status.currentStage)
  if (!currentStageData) return null

  // Calculate urgent needs
  const getUrgentResources = () => {
    const urgent: Array<{resourceType: string; needed: number; priority: 'high' | 'medium' | 'low'}> = []
    
    Object.entries(currentStageData.requirements).forEach(([resourceType, required]) => {
      const contributed = status.stageContributions[resourceType] || 0
      const needed = Math.max(0, required - contributed)
      const percentComplete = required > 0 ? (contributed / required) * 100 : 100
      
      if (needed > 0) {
        let priority: 'high' | 'medium' | 'low' = 'medium'
        if (percentComplete < 25) priority = 'high'
        else if (percentComplete < 75) priority = 'medium'
        else priority = 'low'
        
        urgent.push({ resourceType, needed, priority })
      }
    })
    
    return urgent.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  // Calculate efficiency suggestions
  const getEfficiencyTips = () => {
    const tips: string[] = []
    const urgentResources = getUrgentResources()
    
    if (urgentResources.length > 0) {
      const highPriority = urgentResources.filter(r => r.priority === 'high')
      if (highPriority.length > 0) {
        tips.push(`🚨 Focus on ${highPriority[0].resourceType.replace('_', ' ')} - critically needed!`)
      }
      
      if (urgentResources.length > 3) {
        tips.push(`⚡ Consider coordinating with other factions for faster progress`)
      }
      
      tips.push(`📈 Current stage is ${Math.round(status.advancement.completionPercentage)}% complete`)
    }
    
    return tips
  }

  const handleQuickContribute = async (resourceType: string, amount: number = 1) => {
    if (!onContribute) return
    
    setIsContributing(true)
    try {
      await onContribute(resourceType, amount)
    } catch (error) {
      console.error('Contribution failed:', error)
    } finally {
      setIsContributing(false)
    }
  }

  const urgentResources = getUrgentResources()
  const efficiencyTips = getEfficiencyTips()

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🎯 Planning & Coordination
        </h3>
        <p className="text-sm text-gray-600">
          Optimize your faction&apos;s contributions for maximum efficiency
        </p>
      </div>

      {/* Urgent Needs Alert */}
      {urgentResources.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            🚨 Priority Resources
          </h4>
          <div className="space-y-2">
            {urgentResources.slice(0, 3).map(({ resourceType, needed, priority }) => (
              <div 
                key={resourceType}
                className={`p-3 rounded-lg border-l-4 ${
                  priority === 'high' 
                    ? 'bg-red-50 border-red-400' 
                    : priority === 'medium' 
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      priority === 'high' 
                        ? 'bg-red-200 text-red-800' 
                        : priority === 'medium' 
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-blue-200 text-blue-800'
                    }`}>
                      {priority.toUpperCase()}
                    </span>
                    <span className="font-medium text-gray-800 capitalize">
                      {resourceType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Need {needed} more
                  </div>
                </div>
                
                {onContribute && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleQuickContribute(resourceType, 1)}
                      disabled={isContributing}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        priority === 'high'
                          ? 'bg-red-200 hover:bg-red-300 text-red-800'
                          : priority === 'medium'
                            ? 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800'
                            : 'bg-blue-200 hover:bg-blue-300 text-blue-800'
                      } disabled:opacity-50`}
                    >
                      +1
                    </button>
                    {needed >= 5 && (
                      <button
                        onClick={() => handleQuickContribute(resourceType, 5)}
                        disabled={isContributing}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          priority === 'high'
                            ? 'bg-red-200 hover:bg-red-300 text-red-800'
                            : priority === 'medium'
                              ? 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800'
                              : 'bg-blue-200 hover:bg-blue-300 text-blue-800'
                        } disabled:opacity-50`}
                      >
                        +5
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Efficiency Tips */}
      {efficiencyTips.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            💡 Strategy Suggestions
          </h4>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="space-y-2">
              {efficiencyTips.map((tip, index) => (
                <div key={index} className="text-sm text-blue-800 flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resource Allocation Planner */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">📊 Turn Planning</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(currentStageData.requirements).map(([resourceType, required]) => {
            const contributed = status.stageContributions[resourceType] || 0
            const remaining = Math.max(0, required - contributed)
            const progress = required > 0 ? (contributed / required) * 100 : 100

            return (
              <div 
                key={resourceType}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800 capitalize">
                    {resourceType.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-600">
                    {contributed}/{required}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{Math.round(progress)}% complete</span>
                  {remaining > 0 && (
                    <span className="text-orange-600 font-medium">
                      {remaining} needed
                    </span>
                  )}
                </div>
                
                {remaining > 0 && onContribute && (
                  <div className="mt-2 flex space-x-1">
                    <button
                      onClick={() => handleQuickContribute(resourceType, 1)}
                      disabled={isContributing}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      +1
                    </button>
                    {remaining >= 3 && (
                      <button
                        onClick={() => handleQuickContribute(resourceType, 3)}
                        disabled={isContributing}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        +3
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Coordination Messages */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">🗣️ Quick Messages</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            "Need help with magic crystals! 🔮",
            "Can provide timber 🌲", 
            "Focus on food production 🍯",
            "Infrastructure ready 🏗️",
            "Protection tokens available 🛡️",
            "Research complete! 📚"
          ].map((message, index) => (
            <button
              key={index}
              className="px-2 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 transition-colors text-left"
            >
              {message}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}