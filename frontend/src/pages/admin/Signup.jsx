import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { UserRoundPlus } from 'lucide-react'
import Logo from '@/components/brand/Logo'
import ThemeToggle from '@/components/brand/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'

export default function Signup() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitError, setSubmitError] = useState('')
  const { user, loading, signup } = useAuth()
  const navigate = useNavigate()

  if (!loading && user) return <Navigate to="/admin/dashboard" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    if (password !== confirmPassword) {
      setSubmitError('The passwords do not match.')
      return
    }

    try {
      await signup({ name: name.trim(), username: username.trim(), password })
      navigate('/admin/login', {
        replace: true,
        state: { notice: 'Administrator account created. Sign in to continue.' },
      })
    } catch (signupError) {
      setSubmitError(
        signupError instanceof Error
          ? signupError.message
          : 'Unable to create the administrator account.',
      )
    }
  }

  return (
    <main className="admin-login-page">
      <ThemeToggle className="admin-auth-theme-toggle" />
      <section className="admin-login-card" aria-labelledby="admin-signup-title">
        <Link
          className="admin-login-brand"
          to="/admin/login"
          aria-label="Administrator sign in"
        >
          <Logo size="md" />
        </Link>

        <div className="admin-login-icon">
          <UserRoundPlus size={22} aria-hidden="true" />
        </div>
        <p className="admin-eyebrow">ADMIN PORTAL</p>
        <h1 id="admin-signup-title">Create administrator account</h1>
        <p className="admin-login-description">
          Register the first administrator to start managing your Wi-Fi service.
          Only one account can be created through this page.
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-signup-name">Full name</label>
          <input
            id="admin-signup-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="admin-signup-username">Username</label>
          <input
            id="admin-signup-username"
            name="username"
            type="text"
            autoComplete="username"
            minLength={3}
            maxLength={64}
            pattern="[A-Za-z0-9._-]+"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Choose a username"
            required
          />

          <label htmlFor="admin-signup-password">Password</label>
          <input
            id="admin-signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Use at least 12 characters"
            required
          />

          <label htmlFor="admin-signup-confirm-password">Confirm password</label>
          <input
            id="admin-signup-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Enter the password again"
            required
          />

          {submitError && (
            <p className="admin-login-error" role="alert">
              {submitError}
            </p>
          )}

          <button className="admin-login-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create administrator account'}
          </button>
        </form>

        <div className="admin-login-footer">
          <span>First administrator setup</span>
          <Link to="/admin/login">Back to sign in</Link>
        </div>
      </section>
    </main>
  )
}
