'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import UserProfile from '@/components/auth/UserProfile'

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <UserProfile />
        </div>
      </div>
    </ProtectedRoute>
  )
}