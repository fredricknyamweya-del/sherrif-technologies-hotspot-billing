import { useEffect, useState } from 'react'
import { ArrowRight, Check, Clock3, Wifi } from 'lucide-react'
import { Link } from 'react-router'
import Button from '@/components/ui/Button'
import DataTable from '@/components/ui/DataTable'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatCurrency, formatDuration } from '@/lib/format'
import { apiRequest } from '@/lib/api'

const groups = [
  { id: 'quick', label: 'Quick connect', description: 'Short sessions when you need to get something done.' },
  { id: 'hourly', label: 'Hourly packages', description: 'Flexible access by the hour.' },
  { id: 'daily', label: 'Daily packages', description: 'Stay connected for the whole day.' },
  { id: 'long-term', label: 'Long-term packages', description: 'Better value for regular use.' },
]

function PackageCard({ item }) {
  return (
    <article className={`package-card${item.featured ? ' is-featured' : ''}`}>
      {item.featured && <span className="package-featured">Popular</span>}
      <div className="package-card-top">
        <span className="package-card-icon"><Wifi size={19} aria-hidden="true" /></span>
        <StatusBadge status={item.status} />
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="package-price">{formatCurrency(item.price)}<span> / package</span></div>
      <div className="package-facts">
        <span><Clock3 size={15} aria-hidden="true" /> {formatDuration(item.durationMinutes)}</span>
        <span><Check size={15} aria-hidden="true" /> {item.dataLimitGb ? `${item.dataLimitGb} GB` : 'Unlimited data'}</span>
      </div>
      <Button
        as={Link}
        to={`/payment?package=${encodeURIComponent(item.id)}`}
        className="package-buy"
      >
        Choose package <ArrowRight size={16} aria-hidden="true" />
      </Button>
    </article>
  )
}

export default function Packages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    apiRequest('/portal/packages')
      .then((result) => {
        if (active) setPackages(Array.isArray(result) ? result : result?.packages ?? [])
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
  }, [retry])

  return (
    <div className="portal-page">
      <header className="portal-page-heading">
        <span className="eyebrow">Find your connection</span>
        <h1>Wi-Fi packages</h1>
        <p>Choose the access that fits your day. All prices are in Kenyan shillings.</p>
      </header>

      {loading ? (
        <LoadingState label="Loading available packages" />
      ) : error ? (
        <ErrorState message={error.message} onRetry={() => setRetry((value) => value + 1)} />
      ) : packages.length === 0 ? (
        <EmptyState title="No packages available" description="Please check back soon or contact customer care." />
      ) : (
        <div className="package-groups">
          {groups.map((group) => {
            const items = packages.filter((item) => item.category === group.id)
            if (!items.length) return null
            return (
              <section key={group.id} aria-labelledby={`group-${group.id}`}>
                <div className="package-group-heading">
                  <div>
                    <h2 id={`group-${group.id}`}>{group.label}</h2>
                    <p>{group.description}</p>
                  </div>
                  <span>{items.length} {items.length === 1 ? 'option' : 'options'}</span>
                </div>
                <div className="package-grid">
                  {items.map((item) => <PackageCard item={item} key={item.id} />)}
                </div>
              </section>
            )
          })}
          {packages.some((item) => !groups.some((group) => group.id === item.category)) && (
            <DataTable
              caption="Other available packages"
              columns={[
                { key: 'name', label: 'Package' },
                { key: 'durationMinutes', label: 'Duration', render: (value) => formatDuration(value) },
                { key: 'price', label: 'Price', render: (value) => formatCurrency(value) },
                { key: 'action', label: 'Select', render: (_, row) => <Link className="text-link" to={`/payment?package=${encodeURIComponent(row.id)}`}>Choose <ArrowRight size={15} aria-hidden="true" /></Link> },
              ]}
              rows={packages.filter((item) => !groups.some((group) => group.id === item.category))}
            />
          )}
        </div>
      )}
    </div>
  )
}