'use client'

import React, { useState, useEffect } from 'react'
import { ResourceType } from '@/lib/game/resources'
import { Resource } from '@/lib/supabase'

interface ContributionInterfaceProps {
  sessionId: string
  playerId: string
  factionId: string
  turnNumber: number
  availableResources: Resource[]
  requiredResources: Record<string, number>
  onContribute: (resourceType: ResourceType, amount: number) => Promise<void>
  onClose?: () => void
  className?: string
}

export default function ContributionInterface({
  sessionId,
  playerId,
  factionId,
  turnNumber,
  availableResources,
  requiredResources,
  onContribute,
  onClose,
  className = ''
}: ContributionInterfaceProps) {
  const [selectedResource, setSelectedResource] = useState<ResourceType | ''>('')
  const [contributeAmount, setContributeAmount] = useState(1)
  const [isContributing, setIsContributing] = useState(false)
  const [contributionError, setContributionError] = useState<string>('')
  
  // Reset form when required resources change
  useEffect(() => {
    setSelectedResource('')
    setContributeAmount(1)
    setContributionError('')
  }, [requiredResources])
  
  const getAvailableAmount = (resourceType: string): number => {
    const resource = availableResources.find(r => r.resource_type === resourceType)
    return resource?.quantity || 0
  }
  
  const getRequiredAmount = (resourceType: string): number => {
    return requiredResources[resourceType] || 0
  }
  
  const handleResourceSelect = (resourceType: ResourceType) => {
    setSelectedResource(resourceType)
    setContributeAmount(1)
    setContributionError('')
  }
  
  const handleAmountChange = (amount: number) => {
    setContributeAmount(Math.max(1, amount))
    setContributionError('')
  }
  
  const handleContribute = async () => {
    if (!selectedResource) return
    
    const available = getAvailableAmount(selectedResource)
    if (contributeAmount > available) {
      setContributionError(`Insufficient ${selectedResource}. You have ${available}, trying to contribute ${contributeAmount}.`)
      return
    }
    
    if (contributeAmount <= 0) {
      setContributionError('Contribution amount must be positive.')
      return
    }
    
    setIsContributing(true)
    setContributionError('')
    
    try {
      await onContribute(selectedResource, contributeAmount)
      // Reset form on successful contribution
      setSelectedResource('')
      setContributeAmount(1)
    } catch (error) {
      setContributionError(error instanceof Error ? error.message : 'Contribution failed')
    } finally {
      setIsContributing(false)
    }
  }
  
  const availableContributableResources = Object.keys(requiredResources).filter(resourceType => {
    const required = getRequiredAmount(resourceType)
    return required > 0 && getAvailableAmount(resourceType) > 0
  })
  
  const maxContribution = selectedResource ? Math.min(
    getAvailableAmount(selectedResource), 
    getRequiredAmount(selectedResource)
  ) : 0
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Contribute Resources</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Available Resources Overview */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Your Available Resources:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {availableResources.map(resource => {
            const required = getRequiredAmount(resource.resource_type)
            const isNeeded = required > 0
            
            return (
              <div
                key={resource.id}
                className={`p-2 rounded text-xs text-center ${
                  isNeeded 
                    ? 'bg-blue-50 border border-blue-200 text-blue-800' 
                    : 'bg-gray-50 border border-gray-200 text-gray-600'
                }`}
              >
                <div className="font-medium capitalize">
                  {resource.resource_type.replace('_', ' ')}
                </div>
                <div className="font-mono text-lg">{resource.quantity}</div>
                {isNeeded && <div className="text-blue-600">✓ Needed</div>}
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Resource Selection */}
      {availableContributableResources.length > 0 ? (
        <>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Select Resource to Contribute:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableContributableResources.map(resourceType => {
                const available = getAvailableAmount(resourceType)
                const required = getRequiredAmount(resourceType)
                const isSelected = selectedResource === resourceType
                
                return (
                  <button
                    key={resourceType}
                    onClick={() => handleResourceSelect(resourceType as ResourceType)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-900' 
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium capitalize mb-1">
                      {resourceType.replace('_', ' ')}
                    </div>
                    <div className="text-xs">
                      <span className="text-green-600">Available: {available}</span>
                      <span className="mx-2">•</span>
                      <span className="text-blue-600">Needed: {required}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Amount Input */}
          {selectedResource && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Amount to Contribute:
              </h4>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max={maxContribution}
                  value={contributeAmount}
                  onChange={(e) => handleAmountChange(parseInt(e.target.value) || 1)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                />
                <div className="text-sm text-gray-500">
                  Max: {maxContribution}
                </div>
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="flex space-x-2 mt-2">
                {[1, 5, 10, maxContribution].filter((val, idx, arr) => 
                  val <= maxContribution && arr.indexOf(val) === idx
                ).map(amount => (
                  <button
                    key={amount}
                    onClick={() => setContributeAmount(amount)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      contributeAmount === amount
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {amount === maxContribution ? 'Max' : amount.toString()}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {contributionError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {contributionError}
            </div>
          )}
          
          {/* Contribution Button */}
          <button
            onClick={handleContribute}
            disabled={!selectedResource || isContributing || contributeAmount <= 0}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              selectedResource && !isContributing && contributeAmount > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isContributing ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm6 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
                <span>Contributing...</span>
              </div>
            ) : selectedResource ? (
              `Contribute ${contributeAmount} ${selectedResource.replace('_', ' ')}`
            ) : (
              'Select a resource first'
            )}
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            No Resources Available
          </h4>
          <p className="text-gray-500 text-sm">
            You don&apos;t have any resources that are currently needed for this project stage.
          </p>
        </div>
      )}
    </div>
  )
}