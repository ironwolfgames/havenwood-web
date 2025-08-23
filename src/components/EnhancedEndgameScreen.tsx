/**
 * Enhanced Endgame Screen Component
 * 
 * Main component that orchestrates the comprehensive endgame experience,
 * combining victory/defeat display, detailed statistics, faction performance,
 * replay functionality, and social features.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { EnhancedEndgameScreenProps, VictoryCelebration, FailureAnalysis } from '@/types/endgame'
import { SessionStatisticsComponent } from './SessionStatistics'
import { FactionPerformanceCard } from './FactionPerformanceCard'
import { GameReplayViewer } from './GameReplayViewer'
import { SocialFeaturesPanel } from './SocialFeaturesPanel'

export function EnhancedEndgameScreen({
  outcome,
  victoryType,
  defeatReason,
  sessionId,
  sessionStatistics,
  factionPerformances,
  projectAnalysis,
  failureAnalysis,
  victoryCelebration,
  replayData,
  socialFeatures,
  navigationOptions,
  showAnimations = true,
  compactMode = false,
  accessibilityMode = false
}: EnhancedEndgameScreenProps) {
  const [currentView, setCurrentView] = useState<'summary' | 'statistics' | 'factions' | 'replay' | 'social'>('summary')
  const [showCelebration, setShowCelebration] = useState(showAnimations && outcome === 'victory')
  const [expandedSections, setExpandedSections] = useState<string[]>(['outcome'])

  // Celebration animation effect
  useEffect(() => {
    if (showCelebration && outcome === 'victory') {
      const timer = setTimeout(() => {
        setShowCelebration(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration, outcome])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId)

  const getOutcomeIcon = (): string => {
    if (outcome === 'victory') {
      if (victoryType === 'project_completion') return '🏛️'
      if (victoryType === 'mini_goals') return '🎯'
      return '🎉'
    } else {
      if (defeatReason === 'famine') return '🌾'
      if (defeatReason === 'instability') return '⚖️'
      if (defeatReason === 'destruction') return '🛡️'
      if (defeatReason === 'timeout') return '⏰'
      return '💀'
    }
  }

  const getOutcomeTitle = (): string => {
    if (outcome === 'victory') {
      if (victoryType === 'project_completion') return 'Project Completed!'
      if (victoryType === 'mini_goals') return 'All Goals Achieved!'
      if (victoryType === 'survival_victory') return 'Survival Victory!'
      return 'Victory!'
    } else {
      if (defeatReason === 'famine') return 'Famine Strikes'
      if (defeatReason === 'instability') return 'Political Collapse'
      if (defeatReason === 'destruction') return 'Overwhelming Threats'
      if (defeatReason === 'timeout') return 'Time Runs Out'
      return 'Defeat'
    }
  }

  const getOutcomeMessage = (): string => {
    if (outcome === 'victory') {
      if (victoryCelebration) return victoryCelebration.celebrationMessage
      return 'Through cooperation and determination, the kingdoms of Havenwood have succeeded!'
    } else {
      if (failureAnalysis) {
        const factor = failureAnalysis.contributingFactors[0]
        return factor ? factor.description : 'The kingdoms faced insurmountable challenges.'
      }
      return 'The kingdoms of Havenwood have fallen, but lessons can be learned from this experience.'
    }
  }

  const renderCelebrationOverlay = () => {
    if (!showCelebration) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
        <div className="text-center text-white animate-pulse">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-6xl font-bold mb-4">VICTORY!</h1>
          <p className="text-2xl">The kingdoms are saved!</p>
        </div>
        
        {/* Confetti effect */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-bounce text-4xl`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎊', '🎉', '⭐', '🌟', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderOutcomeHeader = () => (
    <div className={`text-center mb-8 p-8 rounded-lg ${
      outcome === 'victory' 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
        : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
    }`}>
      <div className="text-8xl mb-4 animate-pulse">
        {getOutcomeIcon()}
      </div>
      <h1 className={`text-4xl font-bold mb-4 ${
        outcome === 'victory' ? 'text-green-700' : 'text-red-700'
      }`}>
        {getOutcomeTitle()}
      </h1>
      <p className={`text-xl max-w-3xl mx-auto ${
        outcome === 'victory' ? 'text-green-600' : 'text-red-600'
      }`}>
        {getOutcomeMessage()}
      </p>

      {/* Session Info */}
      <div className="mt-6 flex justify-center space-x-8 text-sm">
        <div className="text-center">
          <div className="font-semibold">{sessionStatistics.turnInfo.totalTurns}</div>
          <div className="text-gray-600">Turns</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">{sessionStatistics.duration.formattedDuration}</div>
          <div className="text-gray-600">Duration</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">{factionPerformances.length}</div>
          <div className="text-gray-600">Factions</div>
        </div>
      </div>
    </div>
  )

  const renderViewNavigation = () => (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8">
        {[
          { id: 'summary', label: '📋 Summary', icon: '📋' },
          { id: 'statistics', label: '📊 Statistics', icon: '📊' },
          { id: 'factions', label: '🏰 Factions', icon: '🏰' },
          ...(replayData ? [{ id: 'replay', label: '🎬 Replay', icon: '🎬' }] : []),
          ...(socialFeatures ? [{ id: 'social', label: '🤝 Social', icon: '🤝' }] : [])
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id as any)}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentView === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )

  const renderSummaryView = () => (
    <div className="space-y-8">
      {/* Project Analysis */}
      {projectAnalysis && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('project')}
            className="w-full p-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-800">
                🏛️ {projectAnalysis.projectName}
              </h3>
              <span className="text-blue-600">
                {isExpanded('project') ? '▲' : '▼'}
              </span>
            </div>
          </button>
          
          {isExpanded('project') && (
            <div className="p-6 border-t">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Completion Progress</span>
                  <span className="text-lg font-bold">
                    {Math.round(projectAnalysis.completionPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      projectAnalysis.completed ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${projectAnalysis.completionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Stage Progress</h4>
                  <div className="space-y-2">
                    {projectAnalysis.stageDetails.map(stage => (
                      <div key={stage.stage} className="flex items-center space-x-3">
                        <span className={`text-lg ${stage.completed ? '✅' : '⏳'}`}>
                          {stage.completed ? '✅' : '⏳'}
                        </span>
                        <div>
                          <div className="font-medium">{stage.name}</div>
                          {stage.completedAt && (
                            <div className="text-sm text-gray-600">
                              Completed {stage.completedAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Top Contributors</h4>
                  <div className="space-y-2">
                    {projectAnalysis.mostValuableContributions.slice(0, 3).map((contribution, index) => (
                      <div key={`${contribution.factionId}-${contribution.resourceType}`} className="flex items-center space-x-3">
                        <span className="text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium">Faction {contribution.factionId}</div>
                          <div className="text-sm text-gray-600">
                            {contribution.amount} {contribution.resourceType.replace('_', ' ')}
                          </div>
                        </div>
                        <div className="text-sm text-blue-600 font-medium">
                          Impact: {contribution.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Failure Analysis (for defeats) */}
      {failureAnalysis && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('failure')}
            className="w-full p-4 text-left bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-red-800">
                🔍 Failure Analysis
              </h3>
              <span className="text-red-600">
                {isExpanded('failure') ? '▲' : '▼'}
              </span>
            </div>
          </button>
          
          {isExpanded('failure') && (
            <div className="p-6 border-t">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Primary Cause</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getOutcomeIcon()}</span>
                    <div>
                      <div className="font-medium text-red-800 capitalize">
                        {failureAnalysis.primaryCause.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-red-600">
                        Detected on Turn {failureAnalysis.failureDetectedAt.turn}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Contributing Factors</h4>
                  <div className="space-y-2">
                    {failureAnalysis.contributingFactors.map((factor, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded border ${
                          factor.severity === 'critical' ? 'bg-red-50 border-red-200' :
                          factor.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                          factor.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">{factor.factor}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            factor.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            factor.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            factor.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {factor.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{factor.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          First detected: Turn {factor.firstDetected}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Improvement Suggestions</h4>
                  <div className="space-y-2">
                    {failureAnalysis.improvements.slice(0, 5).map((improvement, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-blue-800">{improvement.suggestion}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            improvement.priority === 'high' ? 'bg-red-100 text-red-800' :
                            improvement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {improvement.priority}
                          </span>
                        </div>
                        <div className="text-xs text-blue-600">
                          Difficulty: {improvement.difficulty}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Victory Celebration (for victories) */}
      {victoryCelebration && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('celebration')}
            className="w-full p-4 text-left bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-800">
                🎉 Victory Celebration
              </h3>
              <span className="text-green-600">
                {isExpanded('celebration') ? '▲' : '▼'}
              </span>
            </div>
          </button>
          
          {isExpanded('celebration') && (
            <div className="p-6 border-t">
              <div className="mb-6">
                {victoryCelebration.projectArtwork && (
                  <div className="mb-4">
                    <img 
                      src={victoryCelebration.projectArtwork}
                      alt="Completed Project"
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <p className="text-lg text-green-700 mb-4">
                    {victoryCelebration.storyConclusion}
                  </p>
                </div>
              </div>

              {victoryCelebration.mvpFaction && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">🏆 Most Valuable Player</h4>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👑</span>
                    <div>
                      <div className="font-medium">Faction {victoryCelebration.mvpFaction.factionId}</div>
                      <div className="text-sm text-yellow-700">{victoryCelebration.mvpFaction.reason}</div>
                      <div className="text-sm text-yellow-600">{victoryCelebration.mvpFaction.contribution}</div>
                    </div>
                  </div>
                </div>
              )}

              {victoryCelebration.teamworkHighlights.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">🤝 Teamwork Highlights</h4>
                  <div className="space-y-3">
                    {victoryCelebration.teamworkHighlights.map((highlight, index) => (
                      <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-purple-800">{highlight.moment}</span>
                          <span className="text-sm text-purple-600">Turn {highlight.turn}</span>
                        </div>
                        <p className="text-sm text-purple-700 mb-2">{highlight.description}</p>
                        <div className="text-xs text-purple-600">
                          Participants: {highlight.participatingFactions.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderStatisticsView = () => (
    <SessionStatisticsComponent 
      statistics={sessionStatistics}
      compactMode={compactMode}
    />
  )

  const renderFactionsView = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">🏰 Faction Performance</h3>
        <p className="text-gray-600">
          Detailed analysis of each faction&apos;s contributions and achievements
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {factionPerformances
          .sort((a, b) => a.projectContributionRank - b.projectContributionRank)
          .map((performance, index) => (
            <FactionPerformanceCard
              key={performance.factionId}
              performance={performance}
              rank={index + 1}
              expandable={true}
              showComparison={true}
              averagePerformance={{
                resourceEfficiency: factionPerformances.reduce((sum, p) => sum + p.resourceEfficiency, 0) / factionPerformances.length,
                actionsSubmitted: Math.round(factionPerformances.reduce((sum, p) => sum + p.actionsSubmitted, 0) / factionPerformances.length)
              }}
            />
          ))}
      </div>
    </div>
  )

  const renderReplayView = () => (
    replayData ? (
      <GameReplayViewer 
        replayData={replayData}
        autoPlay={false}
        playbackSpeed={1000}
      />
    ) : (
      <div className="text-center py-8">
        <span className="text-4xl mb-4 block">🎬</span>
        <p className="text-gray-500">Replay data not available for this session</p>
      </div>
    )
  )

  const renderSocialView = () => (
    socialFeatures ? (
      <SocialFeaturesPanel 
        socialData={socialFeatures}
        onShare={(highlightId) => console.log('Share highlight:', highlightId)}
        onRate={(rating) => console.log('Submit rating:', rating)}
        onExport={(format) => console.log('Export format:', format)}
        onRematch={(options) => console.log('Rematch options:', options)}
      />
    ) : (
      <div className="text-center py-8">
        <span className="text-4xl mb-4 block">🤝</span>
        <p className="text-gray-500">Social features not available for this session</p>
      </div>
    )
  )

  const renderCurrentView = () => {
    switch (currentView) {
      case 'statistics':
        return renderStatisticsView()
      case 'factions':
        return renderFactionsView()
      case 'replay':
        return renderReplayView()
      case 'social':
        return renderSocialView()
      default:
        return renderSummaryView()
    }
  }

  const renderNavigationActions = () => (
    <div className="mt-8 pt-6 border-t bg-gray-50 rounded-lg p-6">
      <div className="flex flex-wrap gap-3 justify-center">
        {navigationOptions.continueButton?.available && (
          <button
            onClick={navigationOptions.continueButton.action}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {navigationOptions.continueButton.label}
          </button>
        )}
        
        <button
          onClick={navigationOptions.newGameButton.action}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {navigationOptions.newGameButton.label}
        </button>

        {navigationOptions.viewStatsButton && (
          <button
            onClick={navigationOptions.viewStatsButton.action}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {navigationOptions.viewStatsButton.label}
          </button>
        )}

        {navigationOptions.replayButton?.available && (
          <button
            onClick={navigationOptions.replayButton.action}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {navigationOptions.replayButton.label}
          </button>
        )}

        <button
          onClick={navigationOptions.lobbyButton.action}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {navigationOptions.lobbyButton.label}
        </button>

        {navigationOptions.shareButton?.available && (
          <button
            onClick={navigationOptions.shareButton.action}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {navigationOptions.shareButton.label}
          </button>
        )}

        {navigationOptions.exportButton?.available && (
          <button
            onClick={navigationOptions.exportButton.action}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {navigationOptions.exportButton.label}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className={`enhanced-endgame-screen min-h-screen bg-gray-50 ${compactMode ? 'p-4' : 'p-8'}`}>
      {/* Celebration Overlay */}
      {renderCelebrationOverlay()}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Outcome Header */}
        {renderOutcomeHeader()}

        {/* View Navigation */}
        {!compactMode && renderViewNavigation()}

        {/* Main View Content */}
        <div className="main-view-content">
          {renderCurrentView()}
        </div>

        {/* Navigation Actions */}
        {renderNavigationActions()}
      </div>
    </div>
  )
}