'use client'

import React from 'react'
import { ProjectStatusSummary, ProjectStage } from '@/types/projects'
import { SharedProject } from '@/lib/supabase'

interface StageProgressVisualizationProps {
  status: ProjectStatusSummary
  stages: ProjectStage[]
  project: SharedProject
  className?: string
}

export default function StageProgressVisualization({
  status,
  stages,
  project,
  className = ''
}: StageProgressVisualizationProps) {
  const { currentStage, stageContributions, completedStages, completion } = status

  const getStageStatus = (stageNumber: number): 'completed' | 'current' | 'locked' | 'upcoming' => {
    if (completion.isCompleted || stageNumber < currentStage) {
      return 'completed'
    } else if (stageNumber === currentStage) {
      return 'current'
    } else if (stageNumber === currentStage + 1) {
      return 'upcoming'
    } else {
      return 'locked'
    }
  }

  const getStageProgress = (stage: ProjectStage): number => {
    if (getStageStatus(stage.stage) === 'completed') {
      return 100
    } else if (stage.stage === currentStage) {
      const totalRequired = Object.values(stage.requirements).reduce((sum, val) => sum + val, 0)
      const totalContributed = Object.entries(stage.requirements).reduce((sum, [resourceType, required]) => {
        const contributed = stageContributions[resourceType] || 0
        return sum + Math.min(contributed, required)
      }, 0)
      return totalRequired > 0 ? (totalContributed / totalRequired) * 100 : 0
    }
    return 0
  }

  const getStageIcon = (stage: ProjectStage, stageStatus: string): string => {
    if (stageStatus === 'completed') return '✅'
    if (stageStatus === 'current') return '⚡'
    if (stageStatus === 'upcoming') return '🔓'
    return '🔒'
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🛤️ Project Stages
        </h3>
        <p className="text-sm text-gray-600">
          Track progress through each stage of the collaborative project
        </p>
      </div>

      {/* Stage Timeline */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const stageStatus = getStageStatus(stage.stage)
          const progress = getStageProgress(stage)
          const isActive = stageStatus === 'current'
          const isCompleted = stageStatus === 'completed'
          const isLocked = stageStatus === 'locked'

          return (
            <div 
              key={stage.stage}
              className={`relative border rounded-lg p-4 transition-all duration-300 ${
                isActive 
                  ? 'border-blue-300 bg-blue-50 shadow-md' 
                  : isCompleted 
                    ? 'border-green-300 bg-green-50'
                    : isLocked
                      ? 'border-gray-200 bg-gray-50 opacity-60'
                      : 'border-yellow-300 bg-yellow-50'
              }`}
            >
              {/* Connection Line to Next Stage */}
              {index < stages.length - 1 && (
                <div className={`absolute left-8 top-full w-0.5 h-4 ${
                  isCompleted ? 'bg-green-400' : 'bg-gray-300'
                }`} />
              )}

              <div className="flex items-start space-x-4">
                {/* Stage Icon and Number */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 ${
                  isActive 
                    ? 'bg-blue-100 border-blue-400 text-blue-800' 
                    : isCompleted 
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : isLocked
                        ? 'bg-gray-100 border-gray-300 text-gray-500'
                        : 'bg-yellow-100 border-yellow-400 text-yellow-800'
                }`}>
                  <div className="text-center">
                    <div className="text-lg">{getStageIcon(stage, stageStatus)}</div>
                    <div className="text-xs">{stage.stage}</div>
                  </div>
                </div>

                {/* Stage Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {stage.name}
                    </h4>
                    {!isLocked && (
                      <span className={`text-sm px-2 py-1 rounded ${
                        isCompleted 
                          ? 'bg-green-200 text-green-800' 
                          : isActive 
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {Math.round(progress)}%
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {stage.description}
                  </p>

                  {/* Progress Bar */}
                  {!isLocked && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-green-500' 
                              : isActive 
                                ? 'bg-blue-500'
                                : 'bg-yellow-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Resource Requirements */}
                  {!isLocked && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {Object.entries(stage.requirements).map(([resourceType, required]) => {
                        const contributed = isActive ? (stageContributions[resourceType] || 0) : (isCompleted ? required : 0)
                        const isResourceComplete = contributed >= required
                        
                        return (
                          <div 
                            key={resourceType}
                            className={`text-xs border rounded px-2 py-1 ${
                              isResourceComplete
                                ? 'border-green-300 bg-green-100 text-green-800'
                                : isActive
                                  ? 'border-blue-300 bg-blue-100 text-blue-800'
                                  : 'border-gray-300 bg-gray-100 text-gray-600'
                            }`}
                          >
                            <div className="font-medium capitalize truncate">
                              {resourceType.replace('_', ' ')}
                            </div>
                            <div className="font-mono">
                              {contributed}/{required}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Locked Stage Message */}
                  {isLocked && (
                    <div className="text-sm text-gray-500 italic">
                      🔒 Unlocks when previous stage is completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-800">
              {completion.completedStages}
            </div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-800">
              {completion.isCompleted ? 0 : 1}
            </div>
            <div className="text-xs text-blue-600">In Progress</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-600">
              {stages.length - completion.completedStages - (completion.isCompleted ? 0 : 1)}
            </div>
            <div className="text-xs text-gray-600">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  )
}