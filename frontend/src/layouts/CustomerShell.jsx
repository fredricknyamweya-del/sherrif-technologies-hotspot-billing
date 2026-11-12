import { Link, NavLink, Outlet } from 'react-router'
import { Headphones, TicketCheck, Wifi, WifiOff } from 'lucide-react'
import Logo from '@/components/brand/Logo'
import ThemeToggle from '@/components/brand/ThemeToggle'

const navigation = [
  { to: '/', label: 'Home', icon: Wifi, end: true },
  { to: '/packages', label: 'Packages', icon: TicketCheck },
  { to: '/reconnect', label: 'Reconnect', icon: WifiOff },
  { to: '/customer-care', label: 'Help', icon: Headphones },
]

export default function CustomerShell() {
  return (
    <div className="customer-app">
      <header className="customer-header">
        <Link className="customer-brand-link" to="/" aria-label="Sherrif Technologies home">
          <Logo size="sm" />
        </Link>
        <nav className="customer-nav" aria-label="Main navigation">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `customer-nav-link${isActive ? ' is-active' : ''}`
              }
            >
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <ThemeToggle className="customer-theme-toggle" />
      </header>

      <div className="customer-main">
        <Outlet />
      </div>

      <footer className="customer-footer">
        <span>© {new Date().getFullYear()} Sherrif Technologies</span>
        <span>Reliable Wi-Fi, made simple.</span>
        <a href="tel:0719221177">Customer care: 0719221177</a>
      </footer>

      <nav className="customer-mobile-nav" aria-label="Quick navigation">
        {navigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `customer-mobile-link${isActive ? ' is-active' : ''}`
            }
          >
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}