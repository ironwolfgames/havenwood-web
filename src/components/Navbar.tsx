'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function Navbar() {
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-green-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="text-2xl font-bold hover:text-green-100">
            Havenwood Kingdoms
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              href="/test-supabase"
              className="text-green-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Test Supabase
            </Link>
            
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/profile"
                      className="text-green-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-green-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign Out
                    </button>
                    <div className="text-green-100 text-sm">
                      Welcome, {user.email?.split('@')[0]}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/auth"
                      className="text-green-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Join Game
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}