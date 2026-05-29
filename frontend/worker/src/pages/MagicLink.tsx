import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, CheckCircle, AlertCircle, Loader2, Briefcase } from 'lucide-react'

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
    validateToken(token)
  }, [token])

  const validateToken = async (token: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
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
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="v-card p-10 max-w-sm w-full text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ backgroundColor: 'var(--v-bg-subtle)' }}
          >
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--v-accent)' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>Verifying Access</h2>
          <p style={{ color: 'var(--v-text-tertiary)' }}>Please wait while we validate your link...</p>
        </div>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="v-card p-10 max-w-sm w-full text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ backgroundColor: 'var(--v-danger-bg)' }}
          >
            <AlertCircle className="w-8 h-8" style={{ color: 'var(--v-danger)' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>Invalid Link</h2>
          <p className="mb-6" style={{ color: 'var(--v-text-tertiary)' }}>This link is invalid or has already been used.</p>
          <button onClick={() => window.location.reload()} className="v-btn v-btn-primary w-full">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="w-full max-w-sm">
        <div className="v-card p-8 text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ backgroundColor: 'var(--v-success-bg)' }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: 'var(--v-success)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>Access Verified</h2>
          <p className="mb-6" style={{ color: 'var(--v-text-tertiary)' }}>You have been granted access to complete this task.</p>

          {/* Task Card */}
          <div
            className="p-5 rounded-xl text-left mb-6"
            style={{ backgroundColor: 'var(--v-bg-subtle)', border: '1px solid var(--v-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4" style={{ color: 'var(--v-accent)' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Task</span>
            </div>
            <p className="font-bold text-lg" style={{ color: 'var(--v-text)' }}>{jobTitle}</p>
          </div>

          <button onClick={handleStart} className="v-btn v-btn-primary w-full">
            Start Task
          </button>
        </div>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Shield className="w-4 h-4" style={{ color: 'var(--v-accent)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--v-text-muted)' }}>Secure connection verified</span>
        </div>
      </div>
    </div>
  )
}
