import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  X,
} from 'lucide-react'
import Logo from '@/components/brand/Logo'
import ThemeToggle from '@/components/brand/ThemeToggle'
import StatusBadge from '@/components/ui/StatusBadge'
import { adminNavigation, adminSections } from '@/config/navigation'
import { useAuth } from '@/hooks/useAuth'
import mockLogs from '@/data/mock/logs'

export default function AdminShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [logoutError, setLogoutError] = useState('')
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const activeSection = location.pathname.split('/').filter(Boolean).at(-1)
  const activePage =
    adminSections.find(({ section }) => section === activeSection) ??
    adminSections[0]
  const filteredSections = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    if (!query) return []
    return adminSections.filter(({ label }) =>
      label.toLocaleLowerCase().includes(query),
    )
  }, [search])

  async function handleLogout() {
    setLogoutError('')
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : 'Unable to sign out.',
      )
    }
  }

  function navigateToFirstSearchResult(event) {
    if (event.key === 'Enter' && filteredSections[0]) {
      navigate(filteredSections[0].to)
      setSearch('')
    }
  }

  function closeTransientPanels() {
    setDrawerOpen(false)
    setNotificationsOpen(false)
    setSearch('')
  }

  return (
    <div className="admin-app">
      {drawerOpen && (
        <button
          type="button"
          className="admin-drawer-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside className={`admin-sidebar${drawerOpen ? ' is-open' : ''}`}>
        <div className="admin-sidebar-brand">
          <Link
            to="/admin/dashboard"
            aria-label="Sherrif Technologies admin dashboard"
            onClick={closeTransientPanels}
          >
            <Logo size="sm" />
          </Link>
          <button
            type="button"
            className="admin-icon-button admin-drawer-close"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="admin-sidebar-caption">ADMINISTRATION</div>
        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {adminNavigation.map(({ group, items }) => (
            <section className="admin-nav-group" key={group}>
              <h2>{group}</h2>
              {items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `admin-nav-link${isActive ? ' is-active' : ''}`
                  }
                  onClick={closeTransientPanels}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                  {label === 'Support Tickets' && (
                    <span className="admin-nav-count" aria-label="1 open ticket">
                      1
                    </span>
                  )}
                </NavLink>
              ))}
            </section>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-status-indicator" aria-hidden="true" />
          <span>Service is running</span>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-icon-button admin-menu-button"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={21} aria-hidden="true" />
          </button>

          <div className="admin-topbar-title">
            <span>Admin</span>
            <span aria-hidden="true">/</span>
            <strong>{activePage.label}</strong>
          </div>

          <div className="admin-topbar-actions">
            <div className="admin-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={navigateToFirstSearchResult}
                placeholder="Search pages..."
                aria-label="Search admin pages"
                aria-autocomplete="list"
                aria-expanded={Boolean(search.trim())}
              />
              {filteredSections.length > 0 && (
                <div className="admin-search-results" role="listbox">
                  {filteredSections.slice(0, 5).map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      role="option"
                      onClick={() => setSearch('')}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-notifications">
              <button
                type="button"
                className="admin-icon-button admin-notification-button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <Bell size={19} aria-hidden="true" />
                <span className="admin-notification-dot" aria-hidden="true" />
              </button>
              {notificationsOpen && (
                <section
                  className="admin-notification-panel"
                  aria-label="Recent notifications"
                >
                  <div className="admin-panel-heading">
                    <strong>Notifications</strong>
                    <span>Recent updates</span>
                  </div>
                  {mockLogs.slice(0, 3).map((log) => (
                    <div className="admin-notification-item" key={log.id}>
                      <StatusBadge status={log.level} />
                      <div>
                        <strong>{log.category}</strong>
                        <p>{log.message}</p>
                      </div>
                    </div>
                  ))}
                  <Link
                    className="admin-panel-link"
                    to="/admin/system-logs"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    View system logs
                  </Link>
                </section>
              )}
            </div>

            <ThemeToggle className="admin-theme-toggle" />

            <div className="admin-account">
              <span className="admin-avatar" aria-hidden="true">
                {(user?.name || 'Admin').slice(0, 1).toUpperCase()}
              </span>
              <div className="admin-account-copy">
                <strong>{user?.name || 'Administrator'}</strong>
                <span>Administrator</span>
              </div>
              <ChevronDown size={16} aria-hidden="true" />
            </div>

            <button
              type="button"
              className="admin-icon-button admin-logout-button"
              aria-label="Sign out"
              title="Sign out"
              onClick={handleLogout}
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        {logoutError && (
          <div className="admin-inline-error" role="alert">
            Sign out failed: {logoutError}
          </div>
        )}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}