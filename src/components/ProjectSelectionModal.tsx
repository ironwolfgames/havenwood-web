'use client'

import React, { useState } from 'react'
import { SharedProject } from '@/lib/supabase'
import { ProjectStage } from '@/types/projects'
import { assessProjectDifficulty } from '@/lib/game/projects'

interface ProjectSelectionModalProps {
  sessionId: string
  projects: SharedProject[]
  onSelectProject: (projectId: string) => Promise<void>
  onClose: () => void
  isOpen: boolean
}

export default function ProjectSelectionModal({
  sessionId,
  projects,
  onSelectProject,
  onClose,
  isOpen
}: ProjectSelectionModalProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionError, setSelectionError] = useState<string>('')
  
  const handleSelectProject = async () => {
    if (!selectedProject) return
    
    setIsSelecting(true)
    setSelectionError('')
    
    try {
      await onSelectProject(selectedProject)
      onClose()
    } catch (error) {
      setSelectionError(error instanceof Error ? error.message : 'Project selection failed')
    } finally {
      setIsSelecting(false)
    }
  }
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'  
      case 'hard': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Choose Your Shared Project
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Select a shared project that your team will work together to complete. 
            Each project has unique requirements and stages.
          </p>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <div className="grid gap-4">
            {projects.map((project) => {
              const stages = project.stages as ProjectStage[]
              const difficulty = assessProjectDifficulty(project)
              const isSelected = selectedProject === project.id
              
              return (
                <div
                  key={project.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className={`px-2 py-1 rounded text-xs border capitalize font-medium ${getDifficultyColor(difficulty.difficulty)}`}>
                        {difficulty.difficulty}
                      </div>
                      <div className="text-xs text-gray-500">
                        ~{difficulty.estimatedTurns} turns
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Stages Overview */}
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Project Stages ({stages.length} stages):
                    </h4>
                    <div className="space-y-2">
                      {stages.map((stage, index) => (
                        <div key={stage.stage} className="flex items-start space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            isSelected 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {stage.stage}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800">
                              {stage.name}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {stage.description}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Requires: {Object.entries(stage.requirements)
                                .map(([resource, amount]) => `${amount} ${resource.replace('_', ' ')}`)
                                .join(', ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Resource Summary */}
                  <div className="bg-gray-50 rounded p-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Total Requirements:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {(() => {
                        const totals: Record<string, number> = {}
                        stages.forEach(stage => {
                          Object.entries(stage.requirements).forEach(([resource, amount]) => {
                            if (resource !== 'project_progress') {
                              totals[resource] = (totals[resource] || 0) + amount
                            }
                          })
                        })
                        
                        return Object.entries(totals).map(([resource, total]) => (
                          <div key={resource} className="text-xs text-center">
                            <div className="font-medium capitalize text-gray-800">
                              {resource.replace('_', ' ')}
                            </div>
                            <div className="text-gray-600 font-mono">{total}</div>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="mt-3 flex items-center justify-center text-blue-600 text-sm font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Error Message */}
        {selectionError && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200">
            <div className="text-red-700 text-sm">
              {selectionError}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedProject ? (
                <>
                  <span className="font-medium">
                    {projects.find(p => p.id === selectedProject)?.name}
                  </span>
                  <span> selected</span>
                </>
              ) : (
                'Select a project to continue'
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSelectProject}
                disabled={!selectedProject || isSelecting}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedProject && !isSelecting
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSelecting ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm6 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    </svg>
                    <span>Selecting...</span>
                  </div>
                ) : (
                  'Confirm Selection'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}