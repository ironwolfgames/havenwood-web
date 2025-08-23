/**
 * Project progression logic and validation
 */

import { ResourceType } from '@/lib/game/resources'
import { ProjectProgress, SharedProject } from '@/lib/supabase'
import { 
  ProjectStage, 
  StageContributions, 
  StageAdvancementResult, 
  ProjectCompletionStatus,
  ResourceContribution
} from '@/types/projects'

/**
 * Validate if a resource contribution is allowed
 */
export function validateResourceContribution(
  contribution: ResourceContribution,
  currentProgress: ProjectProgress,
  project: SharedProject
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check if project is already completed
  if (currentProgress.is_completed) {
    errors.push('Project is already completed')
  }
  
  // Check if amount is positive
  if (contribution.amount <= 0) {
    errors.push('Contribution amount must be positive')
  }
  
  // Check if resource type is valid for current stage
  const stages = project.stages as ProjectStage[]
  const currentStage = stages.find(s => s.stage === currentProgress.current_stage)
  
  if (!currentStage) {
    errors.push('Invalid current stage')
  } else {
    const requiredResources = Object.keys(currentStage.requirements)
    if (!requiredResources.includes(contribution.resourceType)) {
      errors.push(`Resource type ${contribution.resourceType} not required for current stage`)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Calculate stage advancement possibilities
 */
export function calculateStageAdvancement(
  currentProgress: ProjectProgress,
  project: SharedProject
): StageAdvancementResult {
  const stages = project.stages as ProjectStage[]
  const currentStage = stages.find(s => s.stage === currentProgress.current_stage)
  
  if (!currentStage) {
    return {
      canAdvance: false,
      currentStage: currentProgress.current_stage,
      missingRequirements: {},
      completionPercentage: 0
    }
  }
  
  const contributions = currentProgress.stage_contributions as StageContributions || {}
  const requirements = currentStage.requirements
  const missingRequirements: Record<string, number> = {}
  let totalRequired = 0
  let totalContributed = 0
  
  // Calculate missing requirements and completion percentage
  for (const [resourceType, required] of Object.entries(requirements)) {
    const contributed = contributions[resourceType] || 0
    const missing = Math.max(0, required - contributed)
    
    if (missing > 0) {
      missingRequirements[resourceType] = missing
    }
    
    totalRequired += required
    totalContributed += Math.min(contributed, required)
  }
  
  const completionPercentage = totalRequired > 0 ? (totalContributed / totalRequired) * 100 : 100
  const canAdvance = Object.keys(missingRequirements).length === 0
  
  return {
    canAdvance,
    currentStage: currentProgress.current_stage,
    nextStage: canAdvance ? currentProgress.current_stage + 1 : undefined,
    missingRequirements,
    completionPercentage
  }
}

/**
 * Calculate overall project completion status
 */
export function calculateProjectCompletion(
  currentProgress: ProjectProgress,
  project: SharedProject
): ProjectCompletionStatus {
  const stages = project.stages as ProjectStage[]
  const totalStages = stages.length
  const completedStages = (currentProgress.completed_stages as any[])?.length || 0
  
  if (currentProgress.is_completed) {
    return {
      isCompleted: true,
      totalStages,
      completedStages: totalStages,
      currentStageProgress: 100
    }
  }
  
  const advancement = calculateStageAdvancement(currentProgress, project)
  
  return {
    isCompleted: false,
    totalStages,
    completedStages,
    currentStageProgress: advancement.completionPercentage
  }
}

/**
 * Check if project is ready for stage advancement
 */
export function canAdvanceToNextStage(
  currentProgress: ProjectProgress,
  project: SharedProject
): boolean {
  const advancement = calculateStageAdvancement(currentProgress, project)
  return advancement.canAdvance
}

/**
 * Check if project can be completed
 */
export function canCompleteProject(
  currentProgress: ProjectProgress,
  project: SharedProject
): boolean {
  const stages = project.stages as ProjectStage[]
  const isOnFinalStage = currentProgress.current_stage === stages.length
  const canAdvanceCurrentStage = canAdvanceToNextStage(currentProgress, project)
  
  return isOnFinalStage && canAdvanceCurrentStage
}

/**
 * Get the next required resources for current stage
 */
export function getNextRequiredResources(
  currentProgress: ProjectProgress,
  project: SharedProject,
  limit: number = 3
): Array<{ resourceType: string; required: number; contributed: number; remaining: number }> {
  const advancement = calculateStageAdvancement(currentProgress, project)
  const contributions = currentProgress.stage_contributions as StageContributions || {}
  
  const stages = project.stages as ProjectStage[]
  const currentStage = stages.find(s => s.stage === currentProgress.current_stage)
  
  if (!currentStage) return []
  
  const nextResources = Object.entries(advancement.missingRequirements)
    .map(([resourceType, remaining]) => ({
      resourceType,
      required: currentStage.requirements[resourceType as ResourceType] || 0,
      contributed: contributions[resourceType] || 0,
      remaining
    }))
    .sort((a, b) => b.remaining - a.remaining)
    .slice(0, limit)
  
  return nextResources
}

/**
 * Estimate turns remaining based on current progress and typical resource generation
 */
export function estimateRemainingTurns(
  currentProgress: ProjectProgress,
  project: SharedProject,
  averageResourcesPerTurn?: Partial<Record<ResourceType, number>>
): number | null {
  const stages = project.stages as ProjectStage[]
  const remainingStages = stages.slice(currentProgress.current_stage - 1)
  
  if (remainingStages.length === 0) return 0
  
  let totalResourcesNeeded = 0
  let totalResourcesPerTurn = 0
  
  // Calculate total resources needed for remaining stages
  for (const stage of remainingStages) {
    for (const [resourceType, amount] of Object.entries(stage.requirements)) {
      if (resourceType !== 'project_progress') {
        totalResourcesNeeded += amount
        totalResourcesPerTurn += averageResourcesPerTurn?.[resourceType as ResourceType] || 0
      }
    }
  }
  
  // Factor in current stage contributions
  const currentContributions = currentProgress.stage_contributions as StageContributions || {}
  const currentStage = remainingStages[0]
  if (currentStage) {
    for (const [resourceType, contributed] of Object.entries(currentContributions)) {
      const required = currentStage.requirements[resourceType as ResourceType] || 0
      totalResourcesNeeded -= Math.min(contributed, required)
    }
  }
  
  if (totalResourcesPerTurn <= 0) return null
  
  return Math.ceil(totalResourcesNeeded / totalResourcesPerTurn)
}

/**
 * Generate project difficulty assessment
 */
export function assessProjectDifficulty(project: SharedProject): {
  difficulty: 'easy' | 'medium' | 'hard'
  reasons: string[]
  estimatedTurns: number
} {
  const stages = project.stages as ProjectStage[]
  let totalResources = 0
  let uniqueResourceTypes = new Set<string>()
  let maxSingleRequirement = 0
  
  for (const stage of stages) {
    for (const [resourceType, amount] of Object.entries(stage.requirements)) {
      if (resourceType !== 'project_progress') {
        totalResources += amount
        uniqueResourceTypes.add(resourceType)
        maxSingleRequirement = Math.max(maxSingleRequirement, amount)
      }
    }
  }
  
  const reasons: string[] = []
  let difficulty: 'easy' | 'medium' | 'hard'
  
  // Determine difficulty based on multiple factors
  if (totalResources < 150 && uniqueResourceTypes.size <= 4 && maxSingleRequirement < 25) {
    difficulty = 'easy'
    reasons.push('Low total resource requirements')
    reasons.push('Limited resource variety needed')
  } else if (totalResources > 300 || uniqueResourceTypes.size > 6 || maxSingleRequirement > 40) {
    difficulty = 'hard'
    if (totalResources > 300) reasons.push('High total resource requirements')
    if (uniqueResourceTypes.size > 6) reasons.push('Many different resource types needed')
    if (maxSingleRequirement > 40) reasons.push('Some stages require very large contributions')
  } else {
    difficulty = 'medium'
    reasons.push('Moderate resource requirements and variety')
  }
  
  // Estimate turns based on difficulty
  const estimatedTurns = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 9
  
  return {
    difficulty,
    reasons,
    estimatedTurns
  }
}