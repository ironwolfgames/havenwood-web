/**
 * Social Features Panel Component
 * 
 * Provides sharing capabilities, session rating, rematch options,
 * and export functionality for game session results.
 */

'use client'

import React, { useState } from 'react'
import { SocialFeaturesData } from '@/types/endgame'

export interface SocialFeaturesPanelProps {
  socialData: SocialFeaturesData
  className?: string
  onShare?: (highlightId: string) => void
  onRate?: (rating: any) => void
  onExport?: (format: string) => void
  onRematch?: (options: any) => void
}

export function SocialFeaturesPanel({
  socialData,
  className = '',
  onShare,
  onRate,
  onExport,
  onRematch
}: SocialFeaturesPanelProps) {
  const [activeTab, setActiveTab] = useState<'share' | 'rate' | 'export' | 'rematch'>('share')
  const [rating, setRating] = useState(socialData.sessionRating || {
    fun: 0,
    challenge: 0,
    cooperation: 0,
    balance: 0,
    overall: 0,
    comments: ''
  })
  const [exportOptions, setExportOptions] = useState({
    summary: true,
    fullStats: false,
    replayData: false,
    screenshots: false
  })

  const handleRatingChange = (category: string, value: number) => {
    setRating(prev => ({ ...prev, [category]: value }))
  }

  const handleSubmitRating = () => {
    if (onRate) {
      onRate(rating)
    }
  }

  const handleShare = (highlightId: string) => {
    if (onShare) {
      onShare(highlightId)
    }
  }

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format)
    }
  }

  const handleRematch = (options: any) => {
    if (onRematch) {
      onRematch(options)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) => (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium w-20 text-right">{label}:</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`text-xl transition-colors ${
              star <= value ? 'text-yellow-500 hover:text-yellow-400' : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            ⭐
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-600">({value}/5)</span>
    </div>
  )

  const renderShareTab = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📢 Share Your Adventure</h3>
        <p className="text-sm text-gray-600">
          Show off your greatest moments and achievements from this session
        </p>
      </div>

      {socialData.shareableHighlights.length > 0 ? (
        <div className="space-y-3">
          {socialData.shareableHighlights.map(highlight => (
            <div key={highlight.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">
                      {highlight.type === 'achievement' ? '🏆' :
                       highlight.type === 'moment' ? '⭐' :
                       '📊'}
                    </span>
                    <h4 className="font-medium text-gray-800">{highlight.title}</h4>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                      {highlight.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{highlight.description}</p>
                  
                  {highlight.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={highlight.imageUrl} 
                        alt={highlight.title}
                        className="w-full max-w-sm rounded border"
                      />
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded p-3 text-sm font-mono text-gray-700 mb-3">
                    {highlight.shareText}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleShare(highlight.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  📱 Share on Social
                </button>
                
                <button
                  onClick={() => copyToClipboard(highlight.shareText)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                >
                  📋 Copy Text
                </button>
                
                {highlight.imageUrl && (
                  <button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = highlight.imageUrl!
                      link.download = `${highlight.title.replace(/\s+/g, '_')}.png`
                      link.click()
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    💾 Save Image
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-gray-500">No shareable highlights available for this session</p>
        </div>
      )}
    </div>
  )

  const renderRateTab = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">⭐ Rate This Session</h3>
        <p className="text-sm text-gray-600">
          Help us improve the game by sharing your experience
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <StarRating
          label="Fun"
          value={rating.fun}
          onChange={(value) => handleRatingChange('fun', value)}
        />
        
        <StarRating
          label="Challenge"
          value={rating.challenge}
          onChange={(value) => handleRatingChange('challenge', value)}
        />
        
        <StarRating
          label="Cooperation"
          value={rating.cooperation}
          onChange={(value) => handleRatingChange('cooperation', value)}
        />
        
        <StarRating
          label="Balance"
          value={rating.balance}
          onChange={(value) => handleRatingChange('balance', value)}
        />
        
        <StarRating
          label="Overall"
          value={rating.overall}
          onChange={(value) => handleRatingChange('overall', value)}
        />

        <div className="pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments:
          </label>
          <textarea
            value={rating.comments}
            onChange={(e) => setRating(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="Tell us what you thought about this session..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <button
          onClick={handleSubmitRating}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Submit Rating
        </button>
      </div>
    </div>
  )

  const renderExportTab = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">💾 Export Session Data</h3>
        <p className="text-sm text-gray-600">
          Save your session data in various formats for future reference
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="space-y-4 mb-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={exportOptions.summary}
              onChange={(e) => setExportOptions(prev => ({ ...prev, summary: e.target.checked }))}
              className="rounded"
            />
            <div>
              <span className="font-medium">📄 Summary Report</span>
              <p className="text-sm text-gray-600">Key statistics and outcomes (PDF format)</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={exportOptions.fullStats}
              onChange={(e) => setExportOptions(prev => ({ ...prev, fullStats: e.target.checked }))}
              className="rounded"
            />
            <div>
              <span className="font-medium">📊 Full Statistics</span>
              <p className="text-sm text-gray-600">Complete performance data (JSON/CSV format)</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={exportOptions.replayData}
              onChange={(e) => setExportOptions(prev => ({ ...prev, replayData: e.target.checked }))}
              className="rounded"
            />
            <div>
              <span className="font-medium">🎬 Replay Data</span>
              <p className="text-sm text-gray-600">Turn-by-turn replay information (JSON format)</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={exportOptions.screenshots}
              onChange={(e) => setExportOptions(prev => ({ ...prev, screenshots: e.target.checked }))}
              className="rounded"
            />
            <div>
              <span className="font-medium">📸 Screenshots</span>
              <p className="text-sm text-gray-600">Key moments and final results (PNG format)</p>
            </div>
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={!exportOptions.summary}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            📄 Export PDF
          </button>
          
          <button
            onClick={() => handleExport('json')}
            disabled={!exportOptions.fullStats && !exportOptions.replayData}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            📊 Export JSON
          </button>
          
          <button
            onClick={() => handleExport('zip')}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            📦 Export All
          </button>
        </div>
      </div>
    </div>
  )

  const renderRematchTab = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">🔄 Play Again</h3>
        <p className="text-sm text-gray-600">
          Challenge the same players or try different strategies
        </p>
      </div>

      {socialData.rematchOptions.available ? (
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Rematch Options</h4>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleRematch({ type: 'same', sameRoles: true })}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔁</span>
                  <div>
                    <h5 className="font-medium text-gray-800">Same Setup</h5>
                    <p className="text-sm text-gray-600">Same players, same factions, same project</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRematch({ type: 'shuffle', sameRoles: false })}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔀</span>
                  <div>
                    <h5 className="font-medium text-gray-800">Shuffle Roles</h5>
                    <p className="text-sm text-gray-600">Same players, randomized factions</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRematch({ type: 'new', newProject: true })}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🆕</span>
                  <div>
                    <h5 className="font-medium text-gray-800">New Adventure</h5>
                    <p className="text-sm text-gray-600">Different project and challenges</p>
                  </div>
                </div>
              </button>

              {socialData.rematchOptions.adjustedDifficulty && (
                <button
                  onClick={() => handleRematch({ 
                    type: 'adjusted', 
                    difficulty: socialData.rematchOptions.adjustedDifficulty 
                  })}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {socialData.rematchOptions.adjustedDifficulty === 'easier' ? '⬇️' : '⬆️'}
                    </span>
                    <div>
                      <h5 className="font-medium text-gray-800">
                        {socialData.rematchOptions.adjustedDifficulty === 'easier' ? 'Easier' : 'Harder'} Challenge
                      </h5>
                      <p className="text-sm text-gray-600">
                        Adjusted difficulty based on this session&apos;s performance
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-xl">💡</span>
              <div>
                <h5 className="font-medium text-blue-800">Tip</h5>
                <p className="text-sm text-blue-700">
                  Invite the same players to continue your collaboration, or try solo challenges 
                  to improve your individual faction skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <span className="text-4xl mb-4 block">🚫</span>
          <p className="text-gray-500 mb-4">Rematch not available for this session</p>
          <button
            onClick={() => window.location.href = '/lobby'}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start New Game
          </button>
        </div>
      )}
    </div>
  )

  const tabs = [
    { id: 'share', label: '📢 Share', content: renderShareTab },
    { id: 'rate', label: '⭐ Rate', content: renderRateTab },
    { id: 'export', label: '💾 Export', content: renderExportTab },
    { id: 'rematch', label: '🔄 Rematch', content: renderRematchTab }
  ]

  return (
    <div className={`social-features-panel ${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.content()}
      </div>
    </div>
  )
}