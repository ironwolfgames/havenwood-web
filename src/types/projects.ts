/**
 * Project progression and tracking type definitions
 */

import { ResourceType } from '@/lib/game/resources'

/**
 * Project stage definition structure  
 */
export interface ProjectStage {
  stage: number
  name: string
  description: string
  requirements: Record<ResourceType | 'project_progress', number>
}

/**
 * Structured stage contributions tracking
 */
export interface StageContributions {
  [resourceType: string]: number
}

/**
 * Completed stage history entry
 */
export interface CompletedStage {
  stage: number
  completedAt: string
  contributions: StageContributions
}

/**
 * Project selection criteria
 */
export interface ProjectSelectionCriteria {
  sessionId: string
  projectId: string
  selectedBy: string // player ID
  selectedAt: string
}

/**
 * Resource contribution request
 */
export interface ResourceContribution {
  sessionId: string
  playerId: string
  factionId: string
  resourceType: ResourceType
  amount: number
  turnNumber: number
}

/**
 * Stage advancement check result
 */
export interface StageAdvancementResult {
  canAdvance: boolean
  currentStage: number
  nextStage?: number
  missingRequirements: Record<string, number>
  completionPercentage: number
}

/**
 * Project completion status
 */
export interface ProjectCompletionStatus {
  isCompleted: boolean
  totalStages: number
  completedStages: number
  currentStageProgress: number
  estimatedTurnsRemaining?: number
}

/**
 * Project status summary for UI
 */
export interface ProjectStatusSummary {
  sessionId: string
  projectId: string
  projectName: string
  projectDescription: string
  currentStage: number
  totalStages: number
  stageContributions: StageContributions
  completedStages: CompletedStage[]
  advancement: StageAdvancementResult
  completion: ProjectCompletionStatus
  lastUpdated: string
}

/**
 * Project selection options for session setup
 */
export interface ProjectSelectionOption {
  projectId: string
  name: string
  description: string
  stages: ProjectStage[]
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTurns: number
  recommendedForFactions: string[]
}