/**
 * River Otters Dashboard Component
 * 
 * Faction-specific dashboard for the Explorers.
 * Shows construction projects, infrastructure network,
 * and project progress contributions.
 */

import React from 'react'
import { ResourcePanel } from '../ResourcePanel'
import { ActionSelectionArea } from '../ActionSelectionArea'
import { FactionStatusCard } from '../FactionStatusCard'
import { FactionDashboardProps } from '../FactionDashboard'

export function OttersDashboard({
  faction,
  gameContext,
  resources,
  availableActions,
  statusMetrics,
  onActionSelect,
  onActionSubmit,
  onResourceTransfer
}: FactionDashboardProps) {
  
  // Filter resources relevant to Otters (infrastructure_tokens, project_progress, timber, fiber, magic_crystals)
  const ottersResources = resources.filter(r => 
    ['infrastructure_tokens', 'project_progress', 'timber', 'fiber', 'magic_crystals'].includes(r.type)
  )

  // Construction queue component
  const ConstructionQueue = () => {
    const projects = [
      { 
        name: 'Crystal Bridge Extension', 
        progress: 75, 
        timeRemaining: 2, 
        materials: 'Timber, Magic Crystals',
        icon: '🌉'
      },
      { 
        name: 'Transport Network Hub', 
        progress: 40, 
        timeRemaining: 4, 
        materials: 'Infrastructure Tokens',
        icon: '🚉'
      },
      { 
        name: 'Resource Pipeline', 
        progress: 10, 
        timeRemaining: 8, 
        materials: 'Fiber, Timber',
        icon: '🚰'
      }
    ]

    return (
      <div className="construction-queue">
        <h4 className="font-bold mb-3">🏗️ Active Projects</h4>
        <div className="projects-list">
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <span className="project-icon">{project.icon}</span>
              <div className="project-info">
                <span className="project-name">{project.name}</span>
                <div className="project-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill construction"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{project.progress}%</span>
                </div>
                <div className="project-details">
                  <span className="time-remaining">⏱️ {project.timeRemaining} turns</span>
                  <span className="materials">📦 {project.materials}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Infrastructure network component
  const InfrastructureNetwork = () => {
    const connections = [
      { from: 'Meadow Moles', to: 'Oakshield Badgers', status: 'Connected', efficiency: '95%' },
      { from: 'Starling Scholars', to: 'River Otters', status: 'Connected', efficiency: '88%' },
      { from: 'All Factions', to: 'Shared Project', status: 'In Progress', efficiency: '72%' }
    ]

    return (
      <div className="infrastructure-network">
        <h4 className="font-bold mb-3">🗺️ Infrastructure Network</h4>
        <div className="network-status">
          <div className="network-overview">
            <div className="network-metric">
              <span className="metric-icon">🔗</span>
              <div className="metric-info">
                <span className="metric-name">Active Connections</span>
                <span className="metric-value">8/12</span>
              </div>
            </div>
            <div className="network-metric">
              <span className="metric-icon">⚡</span>
              <div className="metric-info">
                <span className="metric-name">Network Efficiency</span>
                <span className="metric-value">85%</span>
              </div>
            </div>
          </div>
          <div className="connections-list">
            {connections.map((conn, index) => (
              <div key={index} className="connection-item">
                <span className="connection-route">{conn.from} ↔ {conn.to}</span>
                <span className={`connection-status ${conn.status.toLowerCase().replace(' ', '-')}`}>
                  {conn.status}
                </span>
                <span className="connection-efficiency">{conn.efficiency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Project contribution tracking
  const ProjectContribution = () => {
    const sharedProjects = [
      { name: 'Sky Lantern of Eternal Dawn', progress: 45, contributed: 12, icon: '🏮' },
      { name: 'Crystal Bridge Across the Chasm', progress: 78, contributed: 25, icon: '🌉' },
      { name: 'Heartwood Tree Restoration', progress: 23, contributed: 8, icon: '🌳' }
    ]

    const totalContribution = resources.find(r => r.type === 'project_progress')?.quantity || 0

    return (
      <div className="project-contribution">
        <h4 className="font-bold mb-3">🏛️ Shared Project Progress</h4>
        <div className="contribution-overview">
          <div className="total-contribution">
            <span className="contribution-icon">🏛️</span>
            <div className="contribution-info">
              <span className="contribution-name">Total Contribution</span>
              <span className="contribution-value">{totalContribution} Progress Points</span>
            </div>
          </div>
        </div>
        <div className="projects-progress">
          {sharedProjects.map((project, index) => (
            <div key={index} className="shared-project-item">
              <span className="shared-project-icon">{project.icon}</span>
              <div className="shared-project-info">
                <span className="shared-project-name">{project.name}</span>
                <div className="shared-project-progress">
                  <div className="progress-bar shared">
                    <div 
                      className="progress-fill shared-project"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{project.progress}%</span>
                </div>
                <span className="personal-contribution">Your contribution: {project.contributed} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Quick build actions
  const QuickBuild = () => {
    return (
      <div className="quick-build">
        <h4 className="font-bold mb-3">⚡ Quick Build</h4>
        <div className="build-options">
          <button className="build-btn infrastructure">
            🏗️ Infrastructure Hub (3 Timber)
          </button>
          <button className="build-btn transport">
            🚉 Transport Link (2 Fiber, 1 Crystal)
          </button>
          <button className="build-btn project">
            🏛️ Project Boost (2 Infrastructure)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="otters-dashboard">
      <div className="dashboard-grid">
        {/* Construction and projects */}
        <section className="dashboard-section primary">
          <ConstructionQueue />
          <ProjectContribution />
        </section>

        {/* Resources and status */}
        <section className="dashboard-section secondary">
          <ResourcePanel 
            resources={ottersResources} 
            title="🔧 Engineering Resources"
            className="otters-resources"
          />
          <FactionStatusCard
            factionName={faction.name}
            factionType={faction.systemType}
            metrics={[
              ...statusMetrics,
              { name: 'Build Efficiency', value: '92%', icon: '🔧', status: 'good' },
              { name: 'Project Impact', value: 'High', icon: '🎯', status: 'good' },
              { name: 'Network Coverage', value: '8/12', icon: '🗺️', status: 'warning' }
            ]}
            specialAbilities={[
              'Master Builders: +50% construction speed',
              'Network Effects: Boost all faction efficiency',
              'Project Focus: Double contribution to shared projects'
            ]}
          />
        </section>

        {/* Infrastructure and quick actions */}
        <section className="dashboard-section tertiary">
          <InfrastructureNetwork />
          <QuickBuild />
        </section>

        {/* Action selection - full width */}
        <section className="dashboard-section actions full-width">
          <ActionSelectionArea
            availableActions={availableActions.filter(a => 
              ['build', 'gather', 'special'].includes(a.type)
            )}
            onActionSelect={onActionSelect || (() => {})}
            onActionSubmit={onActionSubmit}
          />
        </section>
      </div>
    </div>
  )
}