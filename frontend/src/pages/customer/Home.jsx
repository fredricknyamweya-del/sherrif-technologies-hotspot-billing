import { useEffect, useState } from 'react'
import { ArrowRight, BadgeCheck, Clock3, Headphones, Wifi } from 'lucide-react'
import { Link } from 'react-router'
import LogoMark from '@/components/brand/LogoMark'
import Button from '@/components/ui/Button'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'
import { apiRequest } from '@/lib/api'

export default function Home() {
  const [announcement, setAnnouncement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    apiRequest('/portal/announcements')
      .then((items) => {
        if (active) setAnnouncement(items?.[0] ?? null)
      })
      .catch((requestError) => {
        if (active) setError(requestError)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="portal-page">
      <section className="portal-announcement" aria-label="Announcement">
        <span className="announcement-symbol"><BadgeCheck size={18} aria-hidden="true" /></span>
        {loading ? (
          <LoadingState compact label="Checking for updates" />
        ) : error ? (
          <span role="status">Welcome. Service updates are temporarily unavailable.</span>
        ) : announcement ? (
          <span><strong>{announcement.title}:</strong> {announcement.message}</span>
        ) : (
          <span>Welcome to Sherrif Technologies Wi-Fi.</span>
        )}
      </section>

      <section className="portal-hero">
        <div className="portal-hero-content">
          <span className="eyebrow">Good Wi-Fi. Good to go.</span>
          <h1>Your next connection is just a tap away.</h1>
          <p>Pick a package that works for you and get online in moments.</p>
          <div className="portal-actions">
            <Button as={Link} to="/packages" className="portal-primary-link">
              Browse packages <ArrowRight size={17} aria-hidden="true" />
            </Button>
            <Link className="portal-secondary-link" to="/voucher">
              I have a voucher
            </Link>
          </div>
          <div className="portal-trust">
            <span><Wifi size={16} aria-hidden="true" /> Fast and reliable</span>
            <span><Clock3 size={16} aria-hidden="true" /> Connect in minutes</span>
          </div>
        </div>
        <div className="portal-orbit" aria-hidden="true">
          <div className="portal-orbit-ring ring-one" />
          <div className="portal-orbit-ring ring-two" />
          <div className="portal-orbit-core"><LogoMark size={76} /></div>
        </div>
      </section>

      {error && (
        <div className="portal-inline-error">
          <ErrorState
            title="Updates unavailable"
            message="You can still browse packages and connect."
          />
        </div>
      )}

      <section className="portal-help-card">
        <div className="portal-help-icon"><Headphones size={22} aria-hidden="true" /></div>
        <div>
          <h2>Need a hand?</h2>
          <p>Our customer care team is ready to help you get connected.</p>
        </div>
        <Link to="/customer-care" aria-label="Contact customer care">
          Get help <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}