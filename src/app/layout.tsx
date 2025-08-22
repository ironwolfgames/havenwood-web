import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Havenwood Kingdoms',
  description: 'Asymmetric co-op turn-based web game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen">
          <header className="bg-green-800 text-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <h1 className="text-2xl font-bold">Havenwood Kingdoms</h1>
                <nav className="flex space-x-4">
                  <a
                    href="/lobby"
                    className="text-green-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Game Lobby
                  </a>
                  <a
                    href="/test-supabase"
                    className="text-green-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Test Supabase
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}