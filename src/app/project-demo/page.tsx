'use client'

import React, { useState, useEffect } from 'react'
import ProjectProgressCard from '@/components/ProjectProgressCard'
import ContributionInterface from '@/components/ContributionInterface'
import ProjectSelectionModal from '@/components/ProjectSelectionModal'
import { SharedProject, Resource } from '@/lib/supabase'
import { ProjectStatusSummary, ProjectStage } from '@/types/projects'
import { ResourceType } from '@/lib/game/resources'

// Mock data for demonstration
const mockProjects: SharedProject[] = [
  {
    id: '1',
    name: 'Sky Lantern of Eternal Dawn',
    description: 'Illuminate the land to hold back encroaching darkness with a magnificent floating lantern.',
    stages: [
      {
        stage: 1,
        name: 'Forge the Beacon Frame',
        description: 'Create the magical framework that will hold the eternal flame.',
        requirements: {
          timber: 15,
          magic_crystals: 10,
          protection_tokens: 5
        }
      },
      {
        stage: 2,
        name: 'Channel the Eternal Flame',
        description: 'Gather mystical energy and kindle the everlasting light.',
        requirements: {
          magic_crystals: 20,
          food: 12,
          stability_tokens: 8
        }
      },
      {
        stage: 3,
        name: 'Raise the Lantern',
        description: 'Install the completed lantern and activate its eternal flame.',
        requirements: {
          infrastructure_tokens: 15,
          protection_tokens: 10,
          project_progress: 25
        }
      }
    ] as ProjectStage[],
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Heartwood Tree Restoration',
    description: 'Revive the central life-giving tree that once nourished all the kingdoms.',
    stages: [
      {
        stage: 1,
        name: 'Clear the Corrupted Roots',
        description: 'Remove dark corruption from the ancient root system.',
        requirements: {
          protection_tokens: 12,
          stability_tokens: 10,
          magic_crystals: 8
        }
      },
      {
        stage: 2,
        name: 'Replant Sacred Seeds',
        description: 'Plant blessed seeds and nurture new growth with care.',
        requirements: {
          food: 25,
          fiber: 15,
          insight_tokens: 10
        }
      },
      {
        stage: 3,
        name: 'Perform the Great Awakening',
        description: 'Channel collective energy to awaken the Heartwood Tree.',
        requirements: {
          magic_crystals: 18,
          infrastructure_tokens: 12,
          project_progress: 30
        }
      }
    ] as ProjectStage[],
    created_at: '2024-01-01T00:00:00Z'
  }
]

const mockResources: Resource[] = [
  { id: '1', session_id: 'demo', faction_id: 'faction1', resource_type: 'food', quantity: 25, turn_number: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', session_id: 'demo', faction_id: 'faction1', resource_type: 'timber', quantity: 18, turn_number: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', session_id: 'demo', faction_id: 'faction1', resource_type: 'magic_crystals', quantity: 12, turn_number: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '4', session_id: 'demo', faction_id: 'faction1', resource_type: 'protection_tokens', quantity: 8, turn_number: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '5', session_id: 'demo', faction_id: 'faction1', resource_type: 'fiber', quantity: 6, turn_number: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
]

export default function ProjectDemoPage() {
  const [selectedProject, setSelectedProject] = useState<SharedProject | null>(null)
  const [projectStatus, setProjectStatus] = useState<ProjectStatusSummary | null>(null)
  const [availableResources, setAvailableResources] = useState<Resource[]>(mockResources)
  const [showSelectionModal, setShowSelectionModal] = useState(false)
  const [showContributionInterface, setShowContributionInterface] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  
  // Initialize with first project for demo
  useEffect(() => {
    if (!selectedProject && mockProjects.length > 0) {
      handleSelectProject(mockProjects[0].id)
    }
  }, [selectedProject])
  
  const handleSelectProject = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId)
    if (!project) return
    
    setSelectedProject(project)
    
    // Create mock project status
    const mockStatus: ProjectStatusSummary = {
      sessionId: 'demo-session',
      projectId: project.id,
      projectName: project.name,
      projectDescription: project.description,
      currentStage: 1,
      totalStages: (project.stages as ProjectStage[]).length,
      stageContributions: {
        timber: 8,
        magic_crystals: 4,
        protection_tokens: 2
      },
      completedStages: [],
      advancement: {
        canAdvance: false,
        currentStage: 1,
        missingRequirements: {
          timber: 7,
          magic_crystals: 6,
          protection_tokens: 3
        },
        completionPercentage: 47
      },
      completion: {
        isCompleted: false,
        totalStages: (project.stages as ProjectStage[]).length,
        completedStages: 0,
        currentStageProgress: 47
      },
      lastUpdated: '2024-01-01T00:00:00Z'
    }
    
    setProjectStatus(mockStatus)
    setStatusMessage(`Selected project: ${project.name}`)
  }
  
  const handleContribute = async (resourceType: ResourceType, amount: number) => {
    if (!selectedProject || !projectStatus) return
    
    setStatusMessage(`Contributing ${amount} ${resourceType.replace('_', ' ')}...`)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update available resources
    setAvailableResources(prev => 
      prev.map(resource => 
        resource.resource_type === resourceType
          ? { ...resource, quantity: Math.max(0, resource.quantity - amount) }
          : resource
      )
    )
    
    // Update project status
    const newContributions = {
      ...projectStatus.stageContributions,
      [resourceType]: (projectStatus.stageContributions[resourceType] || 0) + amount
    }
    
    const currentStageData = (selectedProject.stages as ProjectStage[])[0]
    const requirements = currentStageData.requirements
    
    // Calculate new completion percentage
    let totalRequired = 0
    let totalContributed = 0
    
    Object.entries(requirements).forEach(([resource, required]) => {
      const contributed = newContributions[resource] || 0
      totalRequired += required
      totalContributed += Math.min(contributed, required)
    })
    
    const completionPercentage = totalRequired > 0 ? (totalContributed / totalRequired) * 100 : 100
    const canAdvance = completionPercentage >= 100
    
    // Calculate missing requirements
    const missingRequirements: Record<string, number> = {}
    Object.entries(requirements).forEach(([resource, required]) => {
      const contributed = newContributions[resource] || 0
      const missing = Math.max(0, required - contributed)
      if (missing > 0) {
        missingRequirements[resource] = missing
      }
    })
    
    const updatedStatus: ProjectStatusSummary = {
      ...projectStatus,
      stageContributions: newContributions,
      advancement: {
        ...projectStatus.advancement,
        canAdvance,
        completionPercentage,
        missingRequirements
      },
      completion: {
        ...projectStatus.completion,
        currentStageProgress: completionPercentage
      }
    }
    
    setProjectStatus(updatedStatus)
    
    if (canAdvance) {
      setStatusMessage(`Stage ${projectStatus.currentStage} completed! Ready to advance to next stage.`)
    } else {
      setStatusMessage(`Contributed ${amount} ${resourceType.replace('_', ' ')} successfully!`)
    }
  }
  
  const handleContributeClick = (resourceType: string) => {
    setShowContributionInterface(true)
  }
  
  if (!selectedProject || !projectStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading project demo...</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Shared Project System Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the collaborative project progression system where players work together
            to complete shared objectives by contributing resources across multiple stages.
          </p>
          
          {statusMessage && (
            <div className="mt-4 inline-block px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
              {statusMessage}
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setShowSelectionModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Change Project
          </button>
          
          <button
            onClick={() => setShowContributionInterface(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Contribute Resources
          </button>
        </div>
        
        {/* Project Progress Card */}
        <div className="mb-8">
          <ProjectProgressCard
            status={projectStatus}
            stages={selectedProject.stages as ProjectStage[]}
            onContribute={handleContributeClick}
            className="max-w-4xl mx-auto"
          />
        </div>
        
        {/* Resource Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Resources (Demo Faction)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {availableResources.map(resource => (
              <div
                key={resource.id}
                className="bg-gray-50 rounded-lg p-3 text-center"
              >
                <div className="text-sm font-medium text-gray-700 mb-1 capitalize">
                  {resource.resource_type.replace('_', ' ')}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {resource.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Project Selection Modal */}
        <ProjectSelectionModal
          sessionId="demo-session"
          projects={mockProjects}
          onSelectProject={(projectId) => {
            handleSelectProject(projectId)
            setShowSelectionModal(false)
            return Promise.resolve()
          }}
          onClose={() => setShowSelectionModal(false)}
          isOpen={showSelectionModal}
        />
        
        {/* Contribution Interface */}
        {showContributionInterface && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-w-2xl w-full">
              <ContributionInterface
                sessionId="demo-session"
                playerId="demo-player"
                factionId="demo-faction"
                turnNumber={1}
                availableResources={availableResources}
                requiredResources={projectStatus.advancement.missingRequirements}
                onContribute={handleContribute}
                onClose={() => setShowContributionInterface(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}