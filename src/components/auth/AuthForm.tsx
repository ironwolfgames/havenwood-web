'use client'

import { useState } from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import ResetPasswordForm from './ResetPasswordForm'

type AuthMode = 'login' | 'signup' | 'reset'

interface AuthFormProps {
  initialMode?: AuthMode
  onSuccess?: () => void
}

export default function AuthForm({ initialMode = 'login', onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)

  const handleSuccess = () => {
    onSuccess?.()
  }

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <div>
            <LoginForm
              onToggleMode={() => setMode('signup')}
              onSuccess={handleSuccess}
            />
            <div className="text-center mt-4">
              <button
                onClick={() => setMode('reset')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        )
      
      case 'signup':
        return (
          <SignUpForm
            onToggleMode={() => setMode('login')}
            onSuccess={handleSuccess}
          />
        )
      
      case 'reset':
        return (
          <ResetPasswordForm
            onBack={() => setMode('login')}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {renderForm()}
      </div>
    </div>
  )
}