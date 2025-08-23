'use client'

import React, { useState, useEffect } from 'react'
import { ProjectStatusSummary, ProjectStage } from '@/types/projects'
import { SharedProject, ProjectProgress } from '@/lib/supabase'
import { calculateStageAdvancement, calculateProjectCompletion } from '@/lib/game/projects'
import ProjectOverviewPanel from './ProjectOverviewPanel'
import StageProgressVisualization from './StageProgressVisualization'
import ResourceContributionTracker from './ResourceContributionTracker'
import CollaborativePlanningTools from './CollaborativePlanningTools'
import VictoryConditionTracker from './VictoryConditionTracker'
import GlobalContextDisplay from './GlobalContextDisplay'

interface SharedProjectViewProps {
  sessionId: string
  project: SharedProject
  projectProgress: ProjectProgress
  globalContext?: {
    stabilityTokens: number
    protectionTokens: number
    infrastructureTokens: number
    turnsRemaining?: number
    maxTurns?: number
  }
  onContributeResource?: (resourceType: string, amount: number) => Promise<void>
  className?: string
}

export default function SharedProjectView({
  sessionId,
  project,
  projectProgress,
  globalContext,
  onContributeResource,
  className = ''
}: SharedProjectViewProps) {
  const [projectStatus, setProjectStatus] = useState<ProjectStatusSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Calculate project status summary
  useEffect(() => {
    if (!project || !projectProgress) return

    const stages = project.stages as ProjectStage[]
    const advancement = calculateStageAdvancement(projectProgress, project)
    const completion = calculateProjectCompletion(projectProgress, project)

    const status: ProjectStatusSummary = {
      sessionId: projectProgress.session_id,
      projectId: projectProgress.project_id,
      projectName: project.name,
      projectDescription: project.description,
      currentStage: projectProgress.current_stage,
      totalStages: stages.length,
      stageContributions: projectProgress.stage_contributions as any,
      completedStages: projectProgress.completed_stages as any,
      advancement,
      completion,
      lastUpdated: projectProgress.updated_at || new Date().toISOString()
    }

    setProjectStatus(status)
    setIsLoading(false)
  }, [project, projectProgress])

  if (isLoading || !projectStatus) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  const stages = project.stages as ProjectStage[]

  return (
    <div className={`shared-project-view space-y-6 ${className}`}>
      {/* Header with Project Name and Fantasy Theme */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ✨ Collaborative Project ✨
          </h1>
          <div className="text-lg font-semibold text-blue-800">
            {projectStatus.projectName}
          </div>
          <p className="text-gray-600 text-sm mt-2 max-w-2xl mx-auto">
            {projectStatus.projectDescription}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Project Overview and Stage Progress */}
        <div className="xl:col-span-2 space-y-6">
          <ProjectOverviewPanel 
            status={projectStatus}
            stages={stages}
            onContribute={onContributeResource}
          />
          
          <StageProgressVisualization
            status={projectStatus}
            stages={stages}
            project={project}
          />
        </div>

        {/* Right Column: Collaboration Tools and Context */}
        <div className="space-y-6">
          <ResourceContributionTracker
            status={projectStatus}
            stages={stages}
            sessionId={sessionId}
          />
          
          <CollaborativePlanningTools
            status={projectStatus}
            stages={stages}
            onContribute={onContributeResource}
          />
          
          {globalContext && (
            <>
              <VictoryConditionTracker
                status={projectStatus}
                globalContext={globalContext}
              />
              
              <GlobalContextDisplay
                globalContext={globalContext}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}