import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import AuthLayout from '../../components/layout/AuthLayout'

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { adminLogin, isAuthenticated, user } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await adminLogin(email, password)
      if (result.success) {
        success('Welcome, Admin!')
        navigate('/admin', { replace: true })
      } else {
        toastError(result.error || 'Admin login failed')
      }
    } catch {
      toastError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Admin Sign In"
      subtitle="Restricted access — admin accounts only"
    >
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-brand-orange/20 bg-brand-light/60 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-cta text-white">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">Secure admin portal</p>
          <p className="text-xs text-text-muted">Regular customer accounts cannot sign in here.</p>
        </div>
      </div>

      {isAuthenticated && user?.role !== 'admin' && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You are signed in as a customer. Use an admin account to access this panel.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Admin email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="admin@merogadget.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-cta w-full py-4 disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-text-muted">
        <Link to="/" className="font-medium text-brand-orange transition-colors hover:text-brand-orange-dark">
          ← Back to store
        </Link>
      </p>
    </AuthLayout>
  )
}

export default AdminLoginPage
