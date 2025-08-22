'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

interface ResetPasswordFormProps {
  onBack?: () => void
}

export default function ResetPasswordForm({ onBack }: ResetPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email) {
      setError('Please enter your email address')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    const { error } = await resetPassword(email)
    
    if (error) {
      setError(error.message || 'Failed to send reset email')
    } else {
      setSuccess('Password reset email sent! Check your inbox for instructions.')
      setEmail('')
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-2">Reset Password</h2>
        <p className="text-gray-600">Enter your email to receive reset instructions</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="reset-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="your@email.com"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending...' : 'Send Reset Email'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          ← Back to login
        </button>
      </div>
    </div>
  )
}