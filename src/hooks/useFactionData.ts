/**
 * Faction Data Management Hook
 * 
 * Provides real-time faction data, resource updates,
 * and action management for dashboard components.
 */

import { useState, useEffect, useCallback } from 'react'
import { FactionSystemType, ResourceType } from '@/lib/game/resources'
import { GameActionType } from '@/types/game'
import { ResourceInfo } from '@/components/ResourcePanel'
import { ActionOption } from '@/components/ActionSelectionArea'
import { StatusMetric } from '@/components/FactionStatusCard'
import { FactionData, GameContext } from '@/components/FactionDashboard'

// Mock data for development - in real app this would come from Supabase
const MOCK_FACTIONS: Record<string, FactionData> = {
  moles: {
    id: 'faction-moles',
    name: 'Meadow Moles',
    systemType: 'provisioner',
    description: 'Agriculture and crafting specialists providing essential resources'
  },
  badgers: {
    id: 'faction-badgers',
    name: 'Oakshield Badgers',
    systemType: 'guardian',
    description: 'Defense and stability specialists protecting the realm'
  },
  scholars: {
    id: 'faction-scholars',
    name: 'Starling Scholars',
    systemType: 'mystic',
    description: 'Knowledge and magic specialists unlocking ancient powers'
  },
  otters: {
    id: 'faction-otters',
    name: 'River Otters',
    systemType: 'explorer',
    description: 'Expansion and engineering specialists building the future'
  }
}

const MOCK_RESOURCES: Record<FactionSystemType, ResourceInfo[]> = {
  provisioner: [
    { type: 'food', quantity: 15, delta: 3, trend: 'up' },
    { type: 'timber', quantity: 8, delta: 2, trend: 'stable' },
    { type: 'fiber', quantity: 6, delta: 1, trend: 'up' }
  ],
  guardian: [
    { type: 'protection_tokens', quantity: 12, delta: 2, trend: 'up' },
    { type: 'stability_tokens', quantity: 8, delta: 1, trend: 'stable' },
    { type: 'food', quantity: 5, delta: -1, trend: 'down', warning: true },
    { type: 'timber', quantity: 3, delta: -2, trend: 'down' }
  ],
  mystic: [
    { type: 'magic_crystals', quantity: 9, delta: 1, trend: 'up' },
    { type: 'insight_tokens', quantity: 14, delta: 3, trend: 'up' },
    { type: 'fiber', quantity: 2, delta: -1, trend: 'down', warning: true },
    { type: 'stability_tokens', quantity: 5, delta: 0, trend: 'stable' }
  ],
  explorer: [
    { type: 'infrastructure_tokens', quantity: 11, delta: 2, trend: 'up' },
    { type: 'project_progress', quantity: 7, delta: 1, trend: 'stable' },
    { type: 'timber', quantity: 4, delta: -1, trend: 'down' },
    { type: 'fiber', quantity: 3, delta: 0, trend: 'stable' },
    { type: 'magic_crystals', quantity: 2, delta: 0, trend: 'stable' }
  ]
}

const MOCK_ACTIONS: Record<FactionSystemType, ActionOption[]> = {
  provisioner: [
    { id: 'gather-food', type: 'gather', name: 'Harvest Crops', description: 'Gather food from farms', enabled: true },
    { id: 'gather-timber', type: 'gather', name: 'Lumber Mill', description: 'Process timber from forests', enabled: true },
    { id: 'trade-surplus', type: 'trade', name: 'Trade Surplus', description: 'Exchange excess resources', enabled: true },
    { id: 'plant-crops', type: 'special', name: 'Plant Crops', description: 'Increase future food production', enabled: true, costs: { timber: 1, fiber: 1 } }
  ],
  guardian: [
    { id: 'patrol', type: 'protect', name: 'Deploy Patrol', description: 'Generate protection tokens', enabled: true, costs: { food: 1 } },
    { id: 'fortify', type: 'build', name: 'Fortify Defenses', description: 'Build protective structures', enabled: true, costs: { timber: 2, food: 1 } },
    { id: 'emergency', type: 'special', name: 'Emergency Response', description: 'React to immediate threats', enabled: false, reason: 'No active threats' }
  ],
  mystic: [
    { id: 'research', type: 'research', name: 'Arcane Research', description: 'Advance magical knowledge', enabled: true, costs: { fiber: 1, stability_tokens: 1 } },
    { id: 'enchant', type: 'special', name: 'Cast Enchantment', description: 'Boost other factions with magic', enabled: true, costs: { magic_crystals: 2 } },
    { id: 'divination', type: 'special', name: 'Divine Future', description: 'Predict upcoming events', enabled: true, costs: { insight_tokens: 2 } }
  ],
  explorer: [
    { id: 'build-infra', type: 'build', name: 'Build Infrastructure', description: 'Expand connection network', enabled: true, costs: { timber: 2, fiber: 1 } },
    { id: 'project-contrib', type: 'special', name: 'Project Contribution', description: 'Advance shared project', enabled: true, costs: { infrastructure_tokens: 2 } },
    { id: 'repair', type: 'build', name: 'Repair Network', description: 'Fix damaged infrastructure', enabled: false, reason: 'No damage detected' }
  ]
}

const MOCK_STATUS: Record<FactionSystemType, StatusMetric[]> = {
  provisioner: [
    { name: 'Production Rate', value: '85%', icon: '📈', status: 'good' },
    { name: 'Storage Usage', value: '12/20', icon: '📦', status: 'warning' }
  ],
  guardian: [
    { name: 'Defense Level', value: 'High', icon: '🛡️', status: 'good' },
    { name: 'Alert Status', value: 'Green', icon: '🚨', status: 'good' }
  ],
  mystic: [
    { name: 'Research Level', value: 'Adept', icon: '🎓', status: 'good' },
    { name: 'Magic Resonance', value: '92%', icon: '✨', status: 'good' }
  ],
  explorer: [
    { name: 'Build Efficiency', value: '88%', icon: '🔧', status: 'good' },
    { name: 'Network Coverage', value: '75%', icon: '🗺️', status: 'warning' }
  ]
}

export interface FactionDashboardData {
  faction: FactionData
  resources: ResourceInfo[]
  availableActions: ActionOption[]
  statusMetrics: StatusMetric[]
  loading: boolean
  error: string | null
}

export interface UseFactionDataResult {
  data: FactionDashboardData
  refreshData: () => Promise<void>
  submitAction: (actionId: string, parameters: Record<string, any>) => Promise<boolean>
  transferResource: (toFactionId: string, resourceType: ResourceType, amount: number) => Promise<boolean>
}

/**
 * Hook for managing faction dashboard data
 */
export function useFactionData(
  factionType: FactionSystemType,
  gameContext: GameContext
): UseFactionDataResult {
  const [data, setData] = useState<FactionDashboardData>({
    faction: MOCK_FACTIONS[factionType] || MOCK_FACTIONS.moles,
    resources: [],
    availableActions: [],
    statusMetrics: [],
    loading: true,
    error: null
  })

  // Load initial data
  const loadData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // In a real app, this would be API calls to Supabase
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
      
      const factionKey = Object.keys(MOCK_FACTIONS).find(key => 
        MOCK_FACTIONS[key].systemType === factionType
      ) || 'moles'

      setData({
        faction: MOCK_FACTIONS[factionKey],
        resources: MOCK_RESOURCES[factionType] || [],
        availableActions: MOCK_ACTIONS[factionType] || [],
        statusMetrics: MOCK_STATUS[factionType] || [],
        loading: false,
        error: null
      })
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
    }
  }, [factionType])

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadData()
  }, [loadData])

  // Submit action
  const submitAction = useCallback(async (
    actionId: string, 
    parameters: Record<string, any>
  ): Promise<boolean> => {
    try {
      // In a real app, this would call the action submission API
      console.log('Submitting action:', { actionId, parameters, gameContext })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Refresh data after successful submission
      await refreshData()
      
      return true
    } catch (error) {
      console.error('Failed to submit action:', error)
      return false
    }
  }, [gameContext, refreshData])

  // Transfer resource
  const transferResource = useCallback(async (
    toFactionId: string,
    resourceType: ResourceType,
    amount: number
  ): Promise<boolean> => {
    try {
      // In a real app, this would call the resource transfer API
      console.log('Transferring resource:', { toFactionId, resourceType, amount, gameContext })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Refresh data after successful transfer
      await refreshData()
      
      return true
    } catch (error) {
      console.error('Failed to transfer resource:', error)
      return false
    }
  }, [gameContext, refreshData])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    data,
    refreshData,
    submitAction,
    transferResource
  }
}