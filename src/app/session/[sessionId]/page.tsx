import { Suspense } from 'react'
import { gameSessionOperations } from '@/lib/database-operations'
import FactionSelector from '@/components/lobby/FactionSelector'
import WaitingRoom from '@/components/lobby/WaitingRoom'
import { redirect } from 'next/navigation'

interface SessionPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params
  
  // Fetch session data
  let session
  try {
    session = await gameSessionOperations.getById(sessionId)
    if (!session) {
      redirect('/lobby?error=session-not-found')
    }
  } catch (error) {
    console.error('Error fetching session:', error)
    redirect('/lobby?error=failed-to-load-session')
  }

  // For now, we'll use a mock current player ID since auth isn't implemented
  // In a real implementation, this would come from the authenticated user session
  const currentPlayerId = 'mock-player-1' // TODO: Get from auth session
  const isCreator = true // TODO: Determine based on session creator

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Session: {session.name}
          </h1>
          <p className="text-lg text-gray-600">
            {session.status === 'waiting' ? 'Setting up your game' : 'Game in progress'}
          </p>
        </div>

        {session.status === 'waiting' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Faction Selection */}
            <div className="bg-white shadow rounded-lg p-6">
              <Suspense fallback={<div className="text-gray-500">Loading faction selection...</div>}>
                <FactionSelector 
                  sessionId={sessionId}
                  currentPlayerId={currentPlayerId}
                />
              </Suspense>
            </div>

            {/* Waiting Room */}
            <div className="bg-white shadow rounded-lg p-6">
              <Suspense fallback={<div className="text-gray-500">Loading waiting room...</div>}>
                <WaitingRoom
                  sessionId={sessionId}
                  session={session}
                  currentPlayerId={currentPlayerId}
                  isCreator={isCreator}
                />
              </Suspense>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Game Session Active
            </h2>
            <p className="text-gray-600 mb-8">
              The actual game interface will be implemented in future iterations.
            </p>
            <a
              href="/lobby"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Return to Lobby
            </a>
          </div>
        )}
      </div>
    </div>
  )
}