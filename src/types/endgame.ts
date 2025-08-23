/**
 * Enhanced Endgame Screen Types and Interfaces
 * 
 * Comprehensive data structures for detailed victory/defeat analysis,
 * session statistics, faction performance tracking, and social features.
 */

import { ResourceType } from '@/lib/game/resources'

/**
 * Enhanced session statistics for endgame display
 */
export interface SessionStatistics {
  // Basic session info
  sessionId: string
  duration: {
    startTime: Date
    endTime: Date
    totalMinutes: number
    formattedDuration: string
  }
  turnInfo: {
    totalTurns: number
    finalTurn: number
    averageTurnDuration: number
  }

  // Resource metrics
  resources: {
    totalGenerated: Record<ResourceType, number>
    totalConsumed: Record<ResourceType, number>
    efficiency: Record<ResourceType, number>
    wastePercentage: number
  }

  // Action metrics
  actions: {
    totalActions: number
    successfulActions: number
    failedActions: number
    averageActionsPerTurn: number
    actionTypeBreakdown: Record<string, number>
  }

  // Collaboration metrics
  collaboration: {
    resourceTradeCount: number
    crossFactionSupport: number
    coordinationEffectiveness: number // 0-100 score
    mostCollaborativeFactions: string[]
  }
}

/**
 * Individual faction performance metrics
 */
export interface FactionPerformance {
  factionId: string
  factionType: 'provisioner' | 'guardian' | 'mystic' | 'explorer'
  factionName: string
  playerId: string

  // Resource management
  resourcesGenerated: Record<ResourceType, number>
  resourcesConsumed: Record<ResourceType, number>
  resourceEfficiency: number // 0-100 score
  
  // Action performance
  actionsSubmitted: number
  actionsSuccessful: number
  actionSuccessRate: number
  uniqueActionTypes: string[]

  // Mini-goals and achievements
  miniGoals: {
    completed: number
    total: number
    achievements: string[]
    completionRate: number
  }

  // Project contributions
  projectContributions: Record<ResourceType, number>
  projectContributionRank: number
  
  // Special achievements
  achievements: FactionAchievement[]
  specialActions: number
  innovativeStrategies: string[]
}

/**
 * Faction-specific achievements and recognitions
 */
export interface FactionAchievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt: Date
}

/**
 * Detailed project completion analysis
 */
export interface ProjectCompletionAnalysis {
  projectId: string
  projectName: string
  projectDescription: string
  
  // Completion status
  completed: boolean
  finalStage: number
  totalStages: number
  completionPercentage: number
  
  // Stage breakdown
  stageDetails: {
    stage: number
    name: string
    completed: boolean
    resourcesRequired: Record<ResourceType, number>
    resourcesContributed: Record<ResourceType, number>
    contributingFactions: string[]
    completedAt?: Date
  }[]

  // Contribution analysis
  totalContributions: Record<ResourceType, number>
  factionContributions: Record<string, Record<ResourceType, number>>
  mostValuableContributions: {
    factionId: string
    resourceType: ResourceType
    amount: number
    impact: number
  }[]
  
  // Timeline
  projectStartedAt: Date
  projectCompletedAt?: Date
  criticalMoments: {
    turn: number
    event: string
    description: string
    impact: 'positive' | 'negative' | 'neutral'
  }[]
}

/**
 * Failure analysis data for defeat scenarios
 */
export interface FailureAnalysis {
  primaryCause: 'famine' | 'instability' | 'destruction' | 'timeout' | 'resource_depletion'
  failureDetectedAt: {
    turn: number
    timestamp: Date
  }
  
  // Contributing factors
  contributingFactors: {
    factor: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    firstDetected: number // turn number
  }[]

  // Resource state at failure
  finalResourceState: Record<string, Record<ResourceType, number>>
  resourceTrends: {
    resourceType: ResourceType
    trend: 'increasing' | 'decreasing' | 'stable' | 'critical'
    lastThreeTurns: number[]
  }[]

  // Missed opportunities
  missedOpportunities: {
    opportunity: string
    turn: number
    potentialImpact: string
    suggestedAction: string
  }[]

  // Improvement suggestions
  improvements: {
    category: 'resource_management' | 'collaboration' | 'timing' | 'strategy'
    suggestion: string
    priority: 'low' | 'medium' | 'high'
    difficulty: 'easy' | 'moderate' | 'hard'
  }[]
}

/**
 * Victory celebration data
 */
export interface VictoryCelebration {
  victoryType: 'project_completion' | 'mini_goals' | 'survival_victory'
  
  // Celebration elements
  celebrationMessage: string
  storyConclusion: string
  projectArtwork?: string // URL to illustration
  
  // Recognition
  mvpFaction?: {
    factionId: string
    reason: string
    contribution: string
  }
  teamworkHighlights: {
    moment: string
    turn: number
    description: string
    participatingFactions: string[]
  }[]
  
  // Unlocks and rewards
  unlockedAchievements: FactionAchievement[]
  experienceGained: number
  newUnlocks?: string[] // Future game content
}

/**
 * Session replay data structure
 */
export interface SessionReplayData {
  sessionId: string
  turns: TurnReplayData[]
  keyMoments: ReplayKeyMoment[]
  fastForwardAvailable: boolean
}

export interface TurnReplayData {
  turnNumber: number
  timestamp: Date
  
  // Turn state before and after
  beforeState: GameStateSnapshot
  afterState: GameStateSnapshot
  
  // Actions taken
  actionsSummary: {
    factionId: string
    actionType: string
    actionData: any
    outcome: 'success' | 'failure'
    impact: string
  }[]
  
  // Key events
  events: {
    type: 'resource_change' | 'project_progress' | 'special_action' | 'collaboration'
    description: string
    participants: string[]
  }[]
}

export interface ReplayKeyMoment {
  turn: number
  timestamp: Date
  type: 'breakthrough' | 'crisis' | 'collaboration' | 'turning_point'
  title: string
  description: string
  impact: 'major' | 'moderate' | 'minor'
  participatingFactions: string[]
}

export interface GameStateSnapshot {
  resources: Record<string, Record<ResourceType, number>>
  projectProgress: {
    stage: number
    contributions: Record<ResourceType, number>
  }
  globalTokens: {
    stability: number
    protection: number
    infrastructure: number
  }
}

/**
 * Social features data
 */
export interface SocialFeaturesData {
  sessionId: string
  
  // Sharing
  shareableHighlights: {
    id: string
    type: 'achievement' | 'moment' | 'statistics'
    title: string
    description: string
    imageUrl?: string
    shareText: string
  }[]
  
  // Rating and feedback
  sessionRating?: {
    fun: number // 1-5
    challenge: number // 1-5
    cooperation: number // 1-5
    balance: number // 1-5
    overall: number // 1-5
    comments?: string
  }
  
  // Rematch options
  rematchOptions: {
    available: boolean
    sameRoles: boolean
    newProject: boolean
    adjustedDifficulty?: 'easier' | 'harder'
  }
  
  // Export options
  exportFormats: {
    summary: boolean
    fullStats: boolean
    replayData: boolean
    screenshots: boolean
  }
}

/**
 * Navigation options for endgame screens
 */
export interface EndgameNavigationOptions {
  continueButton?: {
    label: string
    action: () => void
    available: boolean
  }
  
  newGameButton: {
    label: string
    action: () => void
  }
  
  viewStatsButton?: {
    label: string
    action: () => void
  }
  
  replayButton?: {
    label: string
    action: () => void
    available: boolean
  }
  
  lobbyButton: {
    label: string
    action: () => void
  }
  
  shareButton?: {
    label: string
    action: () => void
    available: boolean
  }
  
  exportButton?: {
    label: string
    action: () => void
    available: boolean
  }
}

/**
 * Main enhanced endgame screen props
 */
export interface EnhancedEndgameScreenProps {
  // Game outcome
  outcome: 'victory' | 'defeat'
  victoryType?: 'project_completion' | 'mini_goals' | 'survival_victory'
  defeatReason?: 'famine' | 'instability' | 'destruction' | 'timeout' | 'resource_depletion'
  
  // Session data
  sessionId: string
  sessionStatistics: SessionStatistics
  factionPerformances: FactionPerformance[]
  
  // Outcome-specific data
  projectAnalysis?: ProjectCompletionAnalysis
  failureAnalysis?: FailureAnalysis
  victoryCelebration?: VictoryCelebration
  
  // Advanced features
  replayData?: SessionReplayData
  socialFeatures?: SocialFeaturesData
  
  // Navigation
  navigationOptions: EndgameNavigationOptions
  
  // UI configuration
  showAnimations?: boolean
  compactMode?: boolean
  accessibilityMode?: boolean
}