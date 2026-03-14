import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../api/api'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi(email, password)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="auth-container card fade-in-up">
        <div className="auth-header">
          <div className="auth-icon">🛡️</div>
          <h1 className="auth-title">Welcome back</h1>
          <p>Sign in to manage your insurance policies</p>
        </div>

        <form id="login-form" className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="alert-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? <><span className="btn-spinner"></span> Signing in…</> : 'Sign In →'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link id="signup-link" to="/signup">Create account</Link>
        </p>

        <div className="auth-hint">
          <strong>Demo credentials:</strong><br />
          alice@example.com / password123
        </div>
      </div>
    </div>
  )
}

export default LoginPage
