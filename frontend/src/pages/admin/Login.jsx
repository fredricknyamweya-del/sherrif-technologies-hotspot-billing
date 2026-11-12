import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { Eye, EyeOff, LockKeyhole, Wifi } from 'lucide-react'
import Logo from '@/components/brand/Logo'
import ThemeToggle from '@/components/brand/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { user, loading, error, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const returnTo = location.state?.from || '/admin/dashboard'

  if (!loading && user) return <Navigate to={returnTo} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    try {
      await login({ username, password })
      navigate(returnTo, { replace: true })
    } catch (loginError) {
      setSubmitError(
        loginError instanceof Error
          ? loginError.message
          : 'Unable to sign in. Please try again.',
      )
    }
  }

  return (
    <main className="admin-login-page">
      <ThemeToggle className="admin-auth-theme-toggle" />
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <Link
          className="admin-login-brand"
          to="/"
          aria-label="Sherrif Technologies customer portal"
        >
          <Logo size="md" />
        </Link>

        <div className="admin-login-icon">
          <LockKeyhole size={22} aria-hidden="true" />
        </div>
        <p className="admin-eyebrow">ADMIN PORTAL</p>
        <h1 id="admin-login-title">Welcome back</h1>
        <p className="admin-login-description">
          Sign in to manage your Sherrif Technologies Wi-Fi network.
        </p>

        {location.state?.notice && (
          <p className="admin-login-notice" role="status">
            {location.state.notice}
          </p>
        )}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your username"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className="admin-password-field">
            <input
              id="admin-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>

          {(submitError || error) && (
            <p className="admin-login-error" role="alert">
              {submitError || error.message}
            </p>
          )}

          <button
            className="admin-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in to dashboard'}
          </button>
        </form>

        <p className="admin-signup-prompt">Need an administrator account?</p>
        <Link className="admin-signup-button" to="/admin/signup">
          Create admin account
        </Link>

        <div className="admin-login-footer">
          <span>
            <Wifi size={15} aria-hidden="true" />
            Secure administrator access
          </span>
          <Link to="/">Return to customer portal</Link>
        </div>
      </section>
    </main>
  )
}