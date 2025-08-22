'use client'

import { useState, useEffect } from 'react'
import { SharedProject } from '@/lib/supabase'

interface SessionCreationFormProps {}

export default function SessionCreationForm({}: SessionCreationFormProps) {
  const [sessionName, setSessionName] = useState('')
  const [playerLimit, setPlayerLimit] = useState(4)
  const [sharedProjectId, setSharedProjectId] = useState('')
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'friends'>('public')
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal')
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load available shared projects
  useEffect(() => {
    const loadSharedProjects = async () => {
      try {
        const response = await fetch('/api/lobby/shared-projects')
        if (!response.ok) {
          throw new Error('Failed to load shared projects')
        }
        const projects = await response.json()
        setSharedProjects(projects)
        if (projects.length > 0) {
          setSharedProjectId(projects[0].id)
        }
      } catch (err) {
        console.error('Error loading shared projects:', err)
        setError('Failed to load shared projects')
      }
    }

    loadSharedProjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sessionName.trim()) {
      setError('Session name is required')
      return
    }

    if (!sharedProjectId) {
      setError('Please select a shared project')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/lobby/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sessionName.trim(),
          playerLimit,
          sharedProjectId,
          privacy,
          difficulty
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create session')
      }

      const session = await response.json()
      // Redirect to session page
      window.location.href = `/session/${session.id}`
    } catch (err) {
      console.error('Error creating session:', err)
      setError(err instanceof Error ? err.message : 'Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {/* Session Name */}
      <div>
        <label htmlFor="sessionName" className="block text-sm font-medium text-gray-700 mb-2">
          Session Name
        </label>
        <input
          type="text"
          id="sessionName"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Enter session name..."
          required
        />
      </div>

      {/* Player Limit */}
      <div>
        <label htmlFor="playerLimit" className="block text-sm font-medium text-gray-700 mb-2">
          Max Players
        </label>
        <select
          id="playerLimit"
          value={playerLimit}
          onChange={(e) => setPlayerLimit(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value={2}>2 Players</option>
          <option value={3}>3 Players</option>
          <option value={4}>4 Players</option>
        </select>
      </div>

      {/* Shared Project */}
      <div>
        <label htmlFor="sharedProject" className="block text-sm font-medium text-gray-700 mb-2">
          Shared Project
        </label>
        <select
          id="sharedProject"
          value={sharedProjectId}
          onChange={(e) => setSharedProjectId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          required
        >
          <option value="">Select a project...</option>
          {sharedProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {sharedProjects.length > 0 && sharedProjectId && (
          <p className="mt-2 text-sm text-gray-600">
            {sharedProjects.find(p => p.id === sharedProjectId)?.description}
          </p>
        )}
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty Level
        </label>
        <div className="space-y-2">
          {[
            { value: 'easy', label: 'Easy', description: 'Relaxed resource generation and forgiving events' },
            { value: 'normal', label: 'Normal', description: 'Balanced gameplay with standard challenge' },
            { value: 'hard', label: 'Hard', description: 'Resource scarcity and challenging events' }
          ].map((option) => (
            <label key={option.value} className="flex items-start space-x-3">
              <input
                type="radio"
                name="difficulty"
                value={option.value}
                checked={difficulty === option.value}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Privacy Settings
        </label>
        <div className="space-y-2">
          {[
            { value: 'public', label: 'Public', description: 'Anyone can find and join this session' },
            { value: 'private', label: 'Private', description: 'Only you can invite players to join' },
            { value: 'friends', label: 'Friends Only', description: 'Only your friends can join' }
          ].map((option) => (
            <label key={option.value} className="flex items-start space-x-3">
              <input
                type="radio"
                name="privacy"
                value={option.value}
                checked={privacy === option.value}
                onChange={(e) => setPrivacy(e.target.value as any)}
                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !sessionName.trim() || !sharedProjectId}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Session...' : 'Create Session'}
      </button>
    </form>
  )
}