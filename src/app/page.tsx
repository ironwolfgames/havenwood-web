export default function HomePage() {
  return (
    <div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Havenwood Kingdoms
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          An asymmetric co-op turn-based web game
        </p>
        <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Project Status</h2>
          <div className="space-y-2 text-left">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Next.js project initialized with TypeScript</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Supabase client library installed</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Environment variables template created</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">→</span>
              <span>Ready for Supabase configuration</span>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/lobby"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Enter Game Lobby
            </a>
            <a
              href="/test-supabase"
              className="inline-flex items-center px-6 py-3 border border-green-300 text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
            >
              Test Supabase Connection
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}