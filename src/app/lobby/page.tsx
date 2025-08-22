import { Suspense } from 'react'
import SessionCreationForm from '@/components/lobby/SessionCreationForm'
import SessionBrowser from '@/components/lobby/SessionBrowser'

export default function LobbyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Game Lobby
          </h1>
          <p className="text-xl text-gray-600">
            Create or join a Havenwood Kingdoms session
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Creation */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Create New Session
            </h2>
            <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
              <SessionCreationForm />
            </Suspense>
          </div>

          {/* Session Browser */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Join Existing Session
            </h2>
            <Suspense fallback={<div className="text-gray-500">Loading sessions...</div>}>
              <SessionBrowser />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}