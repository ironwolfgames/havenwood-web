import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import Navbar from '@/components/Navbar'

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
        <AuthProvider>
          <div className="min-h-screen">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}