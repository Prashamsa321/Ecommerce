import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import AuthLayout from '../components/layout/AuthLayout'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, user, loading: authLoading } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from

  useEffect(() => {
    if (authLoading || !isAuthenticated) return

    if (user?.role === 'admin') {
      const target = redirectTo?.startsWith('/admin') ? redirectTo : '/admin'
      navigate(target, { replace: true })
      return
    }

    if (redirectTo && !redirectTo.startsWith('/admin')) {
      navigate(redirectTo, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [authLoading, isAuthenticated, user, redirectTo, navigate])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-auth">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
      </div>
    )
  }

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to={redirectTo?.startsWith('/admin') ? redirectTo : '/admin'} replace />
    }
    return <Navigate to={redirectTo && !redirectTo.startsWith('/admin') ? redirectTo : '/'} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await login(email, password)
      if (result.success) {
        if (result.user?.role === 'admin') {
          success('Welcome back, Admin!')
          const target = redirectTo?.startsWith('/admin') ? redirectTo : '/admin'
          navigate(target, { replace: true })
        } else {
          success('Welcome back!')
          const target = redirectTo && !redirectTo.startsWith('/admin') ? redirectTo : '/'
          navigate(target, { replace: true })
        }
      } else {
        toastError(result.error || 'Login failed')
      }
    } catch {
      toastError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with your customer or admin account"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="name@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-text-secondary">Password</label>
            <Link to="/forgot-password" className="text-sm text-brand-orange hover:text-brand-orange-dark transition-colors">
              Forgot?
            </Link>
          </div>
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
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-divider" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-surface-primary text-text-muted">or continue with</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {['Google', 'Apple'].map((p) => (
            <button
              key={p}
              type="button"
              className="py-3 rounded-2xl border border-divider text-text-secondary hover:bg-brand-light hover:text-brand-orange transition-all text-sm font-medium"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-text-muted text-sm mt-8">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-brand-orange hover:text-brand-orange-dark font-medium transition-colors">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
