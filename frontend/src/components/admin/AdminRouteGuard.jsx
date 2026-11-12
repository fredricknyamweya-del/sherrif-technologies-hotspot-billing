import { Navigate, Outlet, useLocation } from 'react-router'
import ThemeToggle from '@/components/brand/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'

export default function AdminRouteGuard() {
  const { isAuthenticated, loading, error, refresh } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="admin-auth-gate">
        <ThemeToggle className="admin-login-theme-toggle" />
        <LoadingState label="Checking your administrator session" />
      </div>
    )
  }
  if (error) {
    return (
      <div className="admin-auth-gate">
        <ThemeToggle className="admin-login-theme-toggle" />
        <ErrorState
          title="Could not verify your session"
          message={error.message}
          onRetry={refresh}
          className="admin-auth-error"
        />
      </div>
    )
  }
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
