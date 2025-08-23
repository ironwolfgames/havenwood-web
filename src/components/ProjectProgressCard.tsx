'use client'

import React from 'react'
import { ProjectStatusSummary } from '@/types/projects'
import { ProjectStage } from '@/types/projects'

interface ProjectProgressCardProps {
  status: ProjectStatusSummary
  stages: ProjectStage[]
  onContribute?: (resourceType: string) => void
  className?: string
}

export default function ProjectProgressCard({
  status,
  stages,
  onContribute,
  className = ''
}: ProjectProgressCardProps) {
  const { 
    projectName, 
    projectDescription, 
    currentStage, 
    totalStages, 
    stageContributions,
    advancement,
    completion 
  } = status
  
  const currentStageData = stages.find(s => s.stage === currentStage)
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{projectName}</h3>
          <div className="text-sm text-gray-500">
            Stage {currentStage} of {totalStages}
          </div>
        </div>
        <p className="text-gray-600 text-sm">{projectDescription}</p>
      </div>
      
      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">
            {completion.completedStages}/{totalStages} stages
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(completion.completedStages / totalStages) * 100}%` 
            }}
          />
        </div>
      </div>
      
      {/* Current Stage */}
      {currentStageData && !completion.isCompleted && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentStageData.name}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(advancement.completionPercentage)}%
            </span>
          </div>
          
          {/* Current Stage Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${advancement.completionPercentage}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-600 mb-3">{currentStageData.description}</p>
          
          {/* Requirements */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Requirements:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(currentStageData.requirements).map(([resourceType, required]) => {
                const contributed = stageContributions[resourceType] || 0
                const remaining = Math.max(0, required - contributed)
                const isComplete = contributed >= required
                
                return (
                  <div 
                    key={resourceType}
                    className={`flex items-center justify-between p-2 rounded text-xs ${
                      isComplete 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="capitalize font-medium">
                        {resourceType.replace('_', ' ')}
                      </span>
                      {isComplete && (
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="font-mono">{contributed}/{required}</div>
                      {remaining > 0 && (
                        <div className="text-xs text-gray-500">(-{remaining})</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Contribution Actions */}
          {onContribute && advancement.missingRequirements && Object.keys(advancement.missingRequirements).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Contribute:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(advancement.missingRequirements).slice(0, 3).map(([resourceType, needed]) => (
                  <button
                    key={resourceType}
                    onClick={() => onContribute(resourceType)}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    +1 {resourceType.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Completion Status */}
      {completion.isCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-green-600 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-green-800 mb-1">
            Project Completed!
          </h4>
          <p className="text-green-700 text-sm">
            Congratulations! The {projectName} has been successfully completed.
          </p>
        </div>
      )}
      
      {/* Stage Advancement Ready */}
      {advancement.canAdvance && !completion.isCompleted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="text-yellow-600 mb-1">
            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-yellow-800 text-sm font-medium">
            Stage {currentStage} Complete - Ready to Advance!
          </p>
        </div>
      )}
    </div>
  )
}