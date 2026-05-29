import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, AlertCircle } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (email === 'admin@veriforge.com' && password === 'admin123') {
        localStorage.setItem('authToken', 'demo-token')
        localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }))
        navigate('/')
      } else {
        setError('Invalid credentials. Try admin@veriforge.com / admin123')
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
            style={{ backgroundColor: 'var(--v-primary)' }}
          >
            <Shield className="w-8 h-8" style={{ color: 'var(--v-accent)' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--v-text)' }}>Veriforge Admin</h1>
          <p style={{ color: 'var(--v-text-tertiary)' }} className="mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="v-card p-8">
          {error && (
            <div className="v-alert v-alert-danger mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--v-text)' }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="v-input"
                placeholder="admin@veriforge.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: 'var(--v-text)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="v-input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="v-btn v-btn-primary w-full justify-center"
              style={{ padding: '0.75rem 1.25rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo hint */}
        <div
          className="mt-6 p-4 rounded-lg text-center text-sm"
          style={{ backgroundColor: 'var(--v-bg-subtle)', color: 'var(--v-text-tertiary)' }}
        >
          <p className="font-semibold mb-1" style={{ color: 'var(--v-text-secondary)' }}>Demo Account</p>
          <p>admin@veriforge.com / admin123</p>
        </div>
      </div>
    </div>
  )
}
