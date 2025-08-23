'use client'

import React from 'react'
import { ProjectStatusSummary, ProjectStage } from '@/types/projects'

interface ProjectOverviewPanelProps {
  status: ProjectStatusSummary
  stages: ProjectStage[]
  onContribute?: (resourceType: string, amount: number) => Promise<void>
  className?: string
}

export default function ProjectOverviewPanel({
  status,
  stages,
  onContribute,
  className = ''
}: ProjectOverviewPanelProps) {
  const { 
    projectName, 
    projectDescription, 
    currentStage, 
    totalStages, 
    stageContributions,
    advancement,
    completion 
  } = status

  // Get artistic representation for each project type
  const getProjectArt = (projectName: string): { emoji: string; theme: string; color: string } => {
    const name = projectName.toLowerCase()
    if (name.includes('sky lantern') || name.includes('eternal dawn')) {
      return { emoji: '🏮', theme: 'Eternal Light', color: 'from-yellow-400 to-orange-500' }
    } else if (name.includes('heartwood') || name.includes('tree')) {
      return { emoji: '🌳', theme: 'Life Restoration', color: 'from-green-400 to-emerald-600' }
    } else if (name.includes('crystal bridge') || name.includes('bridge')) {
      return { emoji: '🌉', theme: 'Unity Connection', color: 'from-blue-400 to-indigo-600' }
    } else if (name.includes('moon temple') || name.includes('temple')) {
      return { emoji: '🏛️', theme: 'Sacred Protection', color: 'from-purple-400 to-violet-600' }
    } else if (name.includes('skyship') || name.includes('ark')) {
      return { emoji: '⛵', theme: 'Sky Voyage', color: 'from-cyan-400 to-teal-600' }
    }
    return { emoji: '✨', theme: 'Magical Quest', color: 'from-pink-400 to-rose-600' }
  }

  const projectArt = getProjectArt(projectName)
  const currentStageData = stages.find(s => s.stage === currentStage)

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {/* Artistic Header */}
      <div className={`bg-gradient-to-r ${projectArt.color} p-6 text-white`}>
        <div className="text-center">
          <div className="text-6xl mb-2">{projectArt.emoji}</div>
          <h2 className="text-xl font-bold mb-1">{projectName}</h2>
          <p className="text-sm opacity-90 mb-3">{projectArt.theme}</p>
          <div className="bg-white/20 rounded-full px-4 py-1 text-sm inline-block">
            Stage {currentStage} of {totalStages}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Project Description */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            {projectDescription}
          </p>
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-800">Overall Progress</span>
            <span className="text-sm text-gray-600">
              {completion.completedStages}/{totalStages} stages completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className={`bg-gradient-to-r ${projectArt.color} h-3 rounded-full transition-all duration-500 ease-out`}
              style={{ 
                width: `${(completion.completedStages / totalStages) * 100}%` 
              }}
            />
          </div>
          <div className="text-xs text-gray-500 text-center">
            {Math.round((completion.completedStages / totalStages) * 100)}% Complete
          </div>
        </div>

        {/* Current Stage Focus */}
        {currentStageData && !completion.isCompleted && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <span className="mr-2">🎯</span>
                Current Focus: {currentStageData.name}
              </h3>
              <div className="text-sm text-gray-600">
                {Math.round(advancement.completionPercentage)}%
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${advancement.completionPercentage}%` }}
              />
            </div>
            
            <p className="text-xs text-gray-600 mb-3">
              {currentStageData.description}
            </p>

            {/* Stage Requirements Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(currentStageData.requirements).slice(0, 6).map(([resourceType, required]) => {
                const contributed = stageContributions[resourceType] || 0
                const isComplete = contributed >= required
                
                return (
                  <div 
                    key={resourceType}
                    className={`text-xs px-2 py-1 rounded ${
                      isComplete 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <div className="font-medium capitalize">
                      {resourceType.replace('_', ' ')}
                    </div>
                    <div className="font-mono text-xs">
                      {contributed}/{required}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Success State */}
        {completion.isCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 mb-3">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-lg font-bold text-green-800 mb-2">
                Quest Complete!
              </h3>
              <p className="text-green-700 text-sm">
                The {projectName} has been successfully completed! The kingdoms are saved through collaborative effort.
              </p>
            </div>
          </div>
        )}

        {/* Stage Ready to Advance */}
        {advancement.canAdvance && !completion.isCompleted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-blue-600 mb-2">
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-blue-800 text-sm font-semibold">
              Stage {currentStage} Complete - Ready to Advance!
            </p>
            <p className="text-blue-600 text-xs mt-1">
              All requirements met. The next stage will begin automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}