import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Props {
  token: string | null
}

export default function MagicLink({ token }: Props) {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'expired'>('loading')
  const [jobTitle, setJobTitle] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      return
    }

    // Validate magic link
    validateToken(token)
  }, [token])

  const validateToken = async (token: string) => {
    try {
      // Simulate API call - replace with actual validation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock validation
      setStatus('valid')
      setJobTitle('Site Inspection - Downtown Project')
    } catch (error) {
      setStatus('invalid')
    }
  }

  const handleStart = () => {
    navigate('/job/123')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Validating Magic Link</h2>
            <p className="text-gray-600 text-center">Please wait while we verify your access...</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <AlertCircle className="w-16 h-16 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Link</h2>
            <p className="text-gray-600 text-center mb-6">This magic link is invalid or has already been used.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Verified</h2>
          <p className="text-gray-600 text-center mb-6">You have been granted access to complete this task.</p>
          
          <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Task</p>
            <p className="font-semibold text-gray-900">{jobTitle}</p>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Lock className="w-4 h-4 mr-2" />
            <span>Secure connection verified</span>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
          >
            Start Task
          </button>
        </div>
      </div>
    </div>
  )
}
