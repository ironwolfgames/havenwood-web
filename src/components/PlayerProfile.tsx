'use client'

import React from 'react'
import { Player } from '@/lib/supabase'

interface PlayerProfileProps {
  player: Player
  showDetails?: boolean
  className?: string
}

export function PlayerProfile({ player, showDetails = false, className = '' }: PlayerProfileProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Avatar placeholder - can be enhanced later */}
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {player.username.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{player.username}</h3>
          <p className="text-sm text-gray-600">Player ID: {player.id.slice(0, 8)}...</p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Member since:</span>
            <span className="text-sm text-gray-900">{formatDate(player.created_at)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Last updated:</span>
            <span className="text-sm text-gray-900">{formatDate(player.updated_at)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Account ID:</span>
            <span className="text-sm text-gray-600 font-mono">{player.user_id.slice(0, 8)}...</span>
          </div>
        </div>
      )}
    </div>
  )
}

interface PlayerProfileCardProps {
  player: Player
  onEdit?: () => void
  className?: string
}

export function PlayerProfileCard({ player, onEdit, className = '' }: PlayerProfileCardProps) {
  return (
    <div className={`bg-white shadow rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
            {player.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{player.username}</p>
            <p className="text-xs text-gray-600">Player</p>
          </div>
        </div>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}