/**
 * Enhanced Endgame Components Demo
 * 
 * Demonstrates the comprehensive endgame screen system with
 * detailed statistics, faction performance, replay functionality,
 * and social features.
 */

'use client'

import React, { useState } from 'react'
import { EnhancedEndgameScreen } from '@/components/EnhancedEndgameScreen'
import { 
  EnhancedEndgameScreenProps, 
  SessionStatistics, 
  FactionPerformance, 
  ProjectCompletionAnalysis,
  FailureAnalysis,
  VictoryCelebration,
  SessionReplayData,
  SocialFeaturesData
} from '@/types/endgame'

// Mock data generators for demo
const createMockSessionStatistics = (): SessionStatistics => ({
  sessionId: 'demo-session-enhanced-001',
  duration: {
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(),
    totalMinutes: 120,
    formattedDuration: '2h 0m'
  },
  turnInfo: {
    totalTurns: 8,
    finalTurn: 8,
    averageTurnDuration: 900 // 15 minutes per turn
  },
  resources: {
    totalGenerated: {
      food: 45,
      timber: 32,
      fiber: 28,
      protection_tokens: 18,
      stability_tokens: 22,
      magic_crystals: 15,
      insight_tokens: 20,
      infrastructure_tokens: 14,
      project_progress: 25
    },
    totalConsumed: {
      food: 38,
      timber: 25,
      fiber: 22,
      protection_tokens: 12,
      stability_tokens: 18,
      magic_crystals: 12,
      insight_tokens: 16,
      infrastructure_tokens: 10,
      project_progress: 20
    },
    efficiency: {
      food: 84,
      timber: 78,
      fiber: 79,
      protection_tokens: 67,
      stability_tokens: 82,
      magic_crystals: 80,
      insight_tokens: 88,
      infrastructure_tokens: 71,
      project_progress: 80
    },
    wastePercentage: 12
  },
  actions: {
    totalActions: 64,
    successfulActions: 58,
    failedActions: 6,
    averageActionsPerTurn: 8,
    actionTypeBreakdown: {
      gather: 24,
      build: 16,
      trade: 12,
      research: 8,
      special: 4
    }
  },
  collaboration: {
    resourceTradeCount: 18,
    crossFactionSupport: 22,
    coordinationEffectiveness: 78,
    mostCollaborativeFactions: ['Meadow Moles', 'River Otters', 'Starling Scholars']
  }
})

const createMockFactionPerformances = (): FactionPerformance[] => [
  {
    factionId: 'faction-001',
    factionType: 'provisioner',
    factionName: 'Meadow Moles',
    playerId: 'player-001',
    resourcesGenerated: {
      food: 18,
      timber: 12,
      fiber: 10,
      protection_tokens: 2,
      stability_tokens: 3,
      magic_crystals: 0,
      insight_tokens: 2,
      infrastructure_tokens: 1,
      project_progress: 3
    },
    resourcesConsumed: {
      food: 12,
      timber: 8,
      fiber: 6,
      protection_tokens: 2,
      stability_tokens: 2,
      magic_crystals: 3,
      insight_tokens: 4,
      infrastructure_tokens: 2,
      project_progress: 0
    },
    resourceEfficiency: 85,
    actionsSubmitted: 16,
    actionsSuccessful: 15,
    actionSuccessRate: 93.75,
    uniqueActionTypes: ['gather', 'trade', 'build'],
    miniGoals: {
      completed: 3,
      total: 3,
      achievements: ['Food Security', 'Trade Network', 'Resource Abundance'],
      completionRate: 100
    },
    projectContributions: {
      food: 8,
      timber: 5,
      fiber: 4,
      protection_tokens: 0,
      stability_tokens: 0,
      magic_crystals: 0,
      insight_tokens: 0,
      infrastructure_tokens: 0,
      project_progress: 0
    },
    projectContributionRank: 1,
    achievements: [
      {
        id: 'ach-001',
        name: 'Master Provisioner',
        description: 'Generated the most food resources in a single session',
        icon: '🌾',
        rarity: 'rare',
        unlockedAt: new Date()
      },
      {
        id: 'ach-002',
        name: 'Trade Master',
        description: 'Completed the most successful trade actions',
        icon: '💰',
        rarity: 'epic',
        unlockedAt: new Date()
      }
    ],
    specialActions: 3,
    innovativeStrategies: [
      'Optimized food production early to enable team trades',
      'Created resource surplus to support faction emergencies'
    ]
  },
  {
    factionId: 'faction-002',
    factionType: 'guardian',
    factionName: 'Oakshield Badgers',
    playerId: 'player-002',
    resourcesGenerated: {
      food: 8,
      timber: 6,
      fiber: 4,
      protection_tokens: 12,
      stability_tokens: 14,
      magic_crystals: 0,
      insight_tokens: 3,
      infrastructure_tokens: 2,
      project_progress: 1
    },
    resourcesConsumed: {
      food: 8,
      timber: 4,
      fiber: 3,
      protection_tokens: 8,
      stability_tokens: 10,
      magic_crystals: 2,
      insight_tokens: 2,
      infrastructure_tokens: 1,
      project_progress: 0
    },
    resourceEfficiency: 82,
    actionsSubmitted: 15,
    actionsSuccessful: 14,
    actionSuccessRate: 93.33,
    uniqueActionTypes: ['gather', 'build', 'protect'],
    miniGoals: {
      completed: 3,
      total: 3,
      achievements: ['Fortress Builder', 'Shield Wall', 'Guardian Spirit'],
      completionRate: 100
    },
    projectContributions: {
      food: 0,
      timber: 3,
      fiber: 0,
      protection_tokens: 6,
      stability_tokens: 8,
      magic_crystals: 0,
      insight_tokens: 0,
      infrastructure_tokens: 0,
      project_progress: 0
    },
    projectContributionRank: 2,
    achievements: [
      {
        id: 'ach-003',
        name: 'Stalwart Defender',
        description: 'Protected the kingdoms from multiple threats',
        icon: '🛡️',
        rarity: 'epic',
        unlockedAt: new Date()
      }
    ],
    specialActions: 2,
    innovativeStrategies: [
      'Built early defenses to prevent catastrophic failures',
      'Coordinated with mystics to maximize stability bonuses'
    ]
  }
]

const createMockProjectAnalysis = (): ProjectCompletionAnalysis => ({
  projectId: 'project-001',
  projectName: 'The Great Bridge of Unity',
  projectDescription: 'A magnificent bridge connecting all kingdoms, symbolizing cooperation and shared prosperity.',
  completed: true,
  finalStage: 3,
  totalStages: 3,
  completionPercentage: 100,
  stageDetails: [
    {
      stage: 1,
      name: 'Foundation Planning',
      completed: true,
      resourcesRequired: { timber: 8, fiber: 6, magic_crystals: 4, food: 0, protection_tokens: 0, stability_tokens: 0, insight_tokens: 0, infrastructure_tokens: 0, project_progress: 0 },
      resourcesContributed: { timber: 8, fiber: 6, magic_crystals: 4, food: 0, protection_tokens: 0, stability_tokens: 0, insight_tokens: 0, infrastructure_tokens: 0, project_progress: 0 },
      contributingFactions: ['faction-001', 'faction-002'],
      completedAt: new Date(Date.now() - 90 * 60 * 1000)
    },
    {
      stage: 2,
      name: 'Bridge Construction',
      completed: true,
      resourcesRequired: { timber: 12, infrastructure_tokens: 8, stability_tokens: 6, food: 0, protection_tokens: 0, magic_crystals: 0, insight_tokens: 0, fiber: 0, project_progress: 0 },
      resourcesContributed: { timber: 12, infrastructure_tokens: 8, stability_tokens: 6, food: 0, protection_tokens: 0, magic_crystals: 0, insight_tokens: 0, fiber: 0, project_progress: 0 },
      contributingFactions: ['faction-002', 'faction-003'],
      completedAt: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      stage: 3,
      name: 'Magical Enhancement',
      completed: true,
      resourcesRequired: { magic_crystals: 10, insight_tokens: 8, project_progress: 15, food: 0, protection_tokens: 0, stability_tokens: 0, infrastructure_tokens: 0, fiber: 0, timber: 0 },
      resourcesContributed: { magic_crystals: 10, insight_tokens: 8, project_progress: 15, food: 0, protection_tokens: 0, stability_tokens: 0, infrastructure_tokens: 0, fiber: 0, timber: 0 },
      contributingFactions: ['faction-003', 'faction-004'],
      completedAt: new Date()
    }
  ],
  totalContributions: {
    timber: 20,
    fiber: 6,
    magic_crystals: 14,
    infrastructure_tokens: 8,
    stability_tokens: 6,
    insight_tokens: 8,
    project_progress: 15,
    food: 0,
    protection_tokens: 0
  },
  factionContributions: {
    'faction-001': { timber: 8, fiber: 6, magic_crystals: 0, infrastructure_tokens: 0, stability_tokens: 0, insight_tokens: 0, project_progress: 0, food: 0, protection_tokens: 0 },
    'faction-002': { timber: 12, fiber: 0, magic_crystals: 0, infrastructure_tokens: 0, stability_tokens: 6, insight_tokens: 0, project_progress: 0, food: 0, protection_tokens: 0 }
  },
  mostValuableContributions: [
    {
      factionId: 'faction-001',
      resourceType: 'timber',
      amount: 20,
      impact: 95
    },
    {
      factionId: 'faction-003',
      resourceType: 'magic_crystals',
      amount: 14,
      impact: 88
    }
  ],
  projectStartedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  projectCompletedAt: new Date(),
  criticalMoments: [
    {
      turn: 3,
      event: 'Resource Shortage Crisis',
      description: 'Timber supplies ran dangerously low, requiring emergency trade negotiations',
      impact: 'negative'
    },
    {
      turn: 6,
      event: 'Magical Breakthrough',
      description: 'Scholars discovered a new enchantment technique that accelerated construction',
      impact: 'positive'
    }
  ]
})

const createMockVictoryCelebration = (): VictoryCelebration => ({
  victoryType: 'project_completion',
  celebrationMessage: 'Through unwavering cooperation and brilliant strategic thinking, the kingdoms have achieved something truly remarkable!',
  storyConclusion: 'The Great Bridge of Unity now stands as a testament to what can be accomplished when different kingdoms work together. Trade flows freely, knowledge is shared, and the future looks brighter than ever before.',
  mvpFaction: {
    factionId: 'faction-001',
    reason: 'Outstanding resource management and team support',
    contribution: 'Provided crucial food security that enabled all other factions to focus on their specialties'
  },
  teamworkHighlights: [
    {
      moment: 'The Great Resource Sharing',
      turn: 4,
      description: 'All factions contributed to a massive resource pool that saved the project during a critical shortage',
      participatingFactions: ['faction-001', 'faction-002', 'faction-003', 'faction-004']
    },
    {
      moment: 'Magical-Technical Fusion',
      turn: 7,
      description: 'Scholars and Otters worked together to create an innovative magical-engineering solution',
      participatingFactions: ['faction-003', 'faction-004']
    }
  ],
  unlockedAchievements: [
    {
      id: 'session-victory',
      name: 'Kingdom Saviors',
      description: 'Successfully completed a major project through cooperation',
      icon: '👑',
      rarity: 'legendary',
      unlockedAt: new Date()
    }
  ],
  experienceGained: 150
})

const createMockSocialFeatures = (): SocialFeaturesData => ({
  sessionId: 'demo-session-enhanced-001',
  shareableHighlights: [
    {
      id: 'highlight-001',
      type: 'achievement',
      title: 'Master Provisioner Achievement',
      description: 'Generated the most food resources and enabled team success',
      shareText: 'Just earned the Master Provisioner achievement in Havenwood Kingdoms! 🌾 Fed the kingdoms and secured victory through teamwork! #HavenwoodKingdoms #Gaming',
    },
    {
      id: 'highlight-002',
      type: 'moment',
      title: 'The Great Resource Sharing',
      description: 'All factions united to overcome a critical resource shortage',
      shareText: 'Epic teamwork moment in Havenwood Kingdoms! All 4 factions pooled resources to save our project! 🤝 This is what cooperation looks like! #Teamwork #Gaming'
    }
  ],
  rematchOptions: {
    available: true,
    sameRoles: true,
    newProject: true,
    adjustedDifficulty: 'harder'
  },
  exportFormats: {
    summary: true,
    fullStats: true,
    replayData: true,
    screenshots: true
  }
})

export default function EnhancedEndgameDemoPage() {
  const [selectedScenario, setSelectedScenario] = useState<'victory' | 'defeat' | null>(null)
  const [showAnimation, setShowAnimation] = useState(true)
  const [compactMode, setCompactMode] = useState(false)

  const mockSessionStats = createMockSessionStatistics()
  const mockFactionPerformances = createMockFactionPerformances()
  const mockProjectAnalysis = createMockProjectAnalysis()
  const mockVictoryCelebration = createMockVictoryCelebration()
  const mockSocialFeatures = createMockSocialFeatures()

  const mockFailureAnalysis: FailureAnalysis = {
    primaryCause: 'famine',
    failureDetectedAt: {
      turn: 5,
      timestamp: new Date()
    },
    contributingFactors: [
      {
        factor: 'Inadequate Food Production',
        severity: 'critical',
        description: 'Food generation fell below consumption needs for multiple turns',
        firstDetected: 3
      },
      {
        factor: 'Limited Trade Cooperation',
        severity: 'high',
        description: 'Factions failed to establish effective resource sharing agreements',
        firstDetected: 2
      }
    ],
    finalResourceState: {
      'faction-001': { food: -2, timber: 5, fiber: 3, protection_tokens: 2, stability_tokens: 1, magic_crystals: 0, insight_tokens: 1, infrastructure_tokens: 0, project_progress: 2 }
    },
    resourceTrends: [
      {
        resourceType: 'food',
        trend: 'critical',
        lastThreeTurns: [3, 1, -2]
      }
    ],
    missedOpportunities: [
      {
        opportunity: 'Early Trade Agreement',
        turn: 2,
        potentialImpact: 'Could have prevented food shortage through resource sharing',
        suggestedAction: 'Establish trade partnerships in the first 3 turns'
      }
    ],
    improvements: [
      {
        category: 'resource_management',
        suggestion: 'Focus on food production early and maintain reserves',
        priority: 'high',
        difficulty: 'easy'
      },
      {
        category: 'collaboration',
        suggestion: 'Set up trade agreements before resource crises occur',
        priority: 'high',
        difficulty: 'moderate'
      }
    ]
  }

  const createVictoryProps = (): EnhancedEndgameScreenProps => ({
    outcome: 'victory',
    victoryType: 'project_completion',
    sessionId: 'demo-session-enhanced-001',
    sessionStatistics: mockSessionStats,
    factionPerformances: mockFactionPerformances,
    projectAnalysis: mockProjectAnalysis,
    victoryCelebration: mockVictoryCelebration,
    socialFeatures: mockSocialFeatures,
    navigationOptions: {
      newGameButton: { label: 'New Adventure', action: () => console.log('New game') },
      lobbyButton: { label: 'Return to Lobby', action: () => console.log('Back to lobby') },
      shareButton: { label: 'Share Victory', action: () => console.log('Share'), available: true },
      exportButton: { label: 'Export Results', action: () => console.log('Export'), available: true }
    },
    showAnimations: showAnimation,
    compactMode: compactMode
  })

  const createDefeatProps = (): EnhancedEndgameScreenProps => ({
    outcome: 'defeat',
    defeatReason: 'famine',
    sessionId: 'demo-session-enhanced-002',
    sessionStatistics: mockSessionStats,
    factionPerformances: mockFactionPerformances,
    failureAnalysis: mockFailureAnalysis,
    socialFeatures: mockSocialFeatures,
    navigationOptions: {
      newGameButton: { label: 'Try Again', action: () => console.log('New game') },
      lobbyButton: { label: 'Return to Lobby', action: () => console.log('Back to lobby') }
    },
    showAnimations: showAnimation,
    compactMode: compactMode
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {!selectedScenario && (
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Enhanced Endgame Components Demo
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Experience the comprehensive endgame screen system with detailed statistics, 
              faction performance analysis, replay functionality, and social features.
            </p>
          </div>

          {/* Configuration Options */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Demo Options</h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showAnimation}
                  onChange={(e) => setShowAnimation(e.target.checked)}
                  className="rounded"
                />
                <span>Show Animations</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="rounded"
                />
                <span>Compact Mode</span>
              </label>
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Victory Scenario */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    Victory Scenario
                  </h3>
                  <p className="text-green-600">
                    Project Completion Victory with comprehensive celebration and analysis
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Outcome:</span>
                    <span className="font-medium text-green-600">Project Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">2 hours, 8 turns</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Features:</span>
                    <span className="font-medium">All components included</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedScenario('victory')}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Experience Victory 🎉
                </button>
              </div>
            </div>

            {/* Defeat Scenario */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 border-b border-red-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌾</div>
                  <h3 className="text-2xl font-bold text-red-700 mb-2">
                    Defeat Scenario
                  </h3>
                  <p className="text-red-600">
                    Famine defeat with detailed failure analysis and learning opportunities
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Outcome:</span>
                    <span className="font-medium text-red-600">Famine Defeat</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Failure Turn:</span>
                    <span className="font-medium">Turn 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Analysis:</span>
                    <span className="font-medium">Detailed with suggestions</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedScenario('defeat')}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Analyze Defeat 📊
                </button>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">✨ Enhanced Features Included</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">📊</span>
                <span>Comprehensive session statistics with tabbed views</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🏰</span>
                <span>Detailed faction performance cards with achievements</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🎬</span>
                <span>Turn-by-turn replay with key moment highlighting</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🤝</span>
                <span>Social features with sharing and rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🔍</span>
                <span>Failure analysis with improvement suggestions</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🎉</span>
                <span>Victory celebration with teamwork highlights</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Endgame Screens */}
      {selectedScenario === 'victory' && (
        <EnhancedEndgameScreen 
          {...createVictoryProps()}
          navigationOptions={{
            ...createVictoryProps().navigationOptions,
            lobbyButton: { 
              label: 'Back to Demo', 
              action: () => setSelectedScenario(null) 
            }
          }}
        />
      )}

      {selectedScenario === 'defeat' && (
        <EnhancedEndgameScreen 
          {...createDefeatProps()}
          navigationOptions={{
            ...createDefeatProps().navigationOptions,
            lobbyButton: { 
              label: 'Back to Demo', 
              action: () => setSelectedScenario(null) 
            }
          }}
        />
      )}
    </div>
  )
}