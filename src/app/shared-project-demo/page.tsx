'use client'

import React, { useState } from 'react'
import SharedProjectView from '@/components/SharedProjectView'
import { ProjectStage } from '@/types/projects'

export default function SharedProjectViewDemo() {
  const [selectedProject, setSelectedProject] = useState(0)

  // Mock data for demonstration
  const mockProjects = [
    {
      id: 'sky-lantern',
      name: 'Sky Lantern of Eternal Dawn',
      description: 'Illuminate the land to hold back encroaching darkness. This massive lantern will provide eternal light to protect all kingdoms from the shadow plague.',
      stages: [
        {
          stage: 1,
          name: 'Craft the Lantern Frame',
          description: 'Build the basic structure using timber and magical components.',
          requirements: {
            timber: 15,
            magic_crystals: 8,
            infrastructure_tokens: 5
          }
        },
        {
          stage: 2,
          name: 'Enchant the Light Crystal',
          description: 'Imbue the central crystal with protective magic and insights.',
          requirements: {
            magic_crystals: 20,
            insight_tokens: 12,
            protection_tokens: 8
          }
        },
        {
          stage: 3,
          name: 'Raise the Eternal Flame',
          description: 'Complete the ritual to ignite the everlasting light.',
          requirements: {
            magic_crystals: 25,
            food: 10,
            protection_tokens: 15
          }
        }
      ] as ProjectStage[]
    },
    {
      id: 'heartwood-tree',
      name: 'Heartwood Tree Restoration',
      description: 'Revive the withered ancient tree at the center of the land to restore life and balance to all kingdoms.',
      stages: [
        {
          stage: 1,
          name: 'Heal the Corrupted Roots',
          description: 'Cleanse the underground root system of dark influence.',
          requirements: {
            magic_crystals: 10,
            food: 12,
            insight_tokens: 8
          }
        },
        {
          stage: 2,
          name: 'Nourish the Ancient Trunk',
          description: 'Provide life-giving energy to revitalize the main tree.',
          requirements: {
            food: 18,
            protection_tokens: 10,
            infrastructure_tokens: 12
          }
        },
        {
          stage: 3,
          name: 'Awaken the Crown of Life',
          description: 'Complete the restoration by bringing the canopy back to life.',
          requirements: {
            magic_crystals: 15,
            food: 20,
            insight_tokens: 15,
            protection_tokens: 10
          }
        }
      ] as ProjectStage[]
    }
  ]

  const mockProjectProgress = {
    id: 'demo-progress-id',
    session_id: 'demo-session',
    project_id: mockProjects[selectedProject].id,
    current_stage: 1,
    stage_contributions: {
      timber: 8,
      magic_crystals: 3,
      infrastructure_tokens: 2
    },
    completed_stages: [],
    is_completed: false,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const mockGlobalContext = {
    stabilityTokens: 6,
    protectionTokens: 7,
    infrastructureTokens: 5,
    turnsRemaining: 8,
    maxTurns: 12
  }

  const handleContribution = async (resourceType: string, amount: number) => {
    console.log(`Contributing ${amount} ${resourceType}`)
    // In real implementation, this would call the API
    return Promise.resolve()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Shared Project View Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Interactive demonstration of the collaborative project tracking system
          </p>
          
          {/* Project Selector */}
          <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1">
            {mockProjects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(index)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedProject === index
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>

        {/* Shared Project View */}
        <SharedProjectView
          sessionId="demo-session"
          project={mockProjects[selectedProject] as any}
          projectProgress={mockProjectProgress}
          globalContext={mockGlobalContext}
          onContributeResource={handleContribution}
        />

        {/* Demo Controls */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Demo Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stability Tokens
              </label>
              <div className="text-2xl font-bold text-blue-600">
                {mockGlobalContext.stabilityTokens}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protection Tokens
              </label>
              <div className="text-2xl font-bold text-green-600">
                {mockGlobalContext.protectionTokens}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Infrastructure Tokens
              </label>
              <div className="text-2xl font-bold text-orange-600">
                {mockGlobalContext.infrastructureTokens}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}