import {
  Activity,
  ArrowUpRight,
  CircleDollarSign,
  PackageCheck,
  Users,
} from 'lucide-react'
import { Link } from 'react-router'
import DataTable from '@/components/ui/DataTable'
import MiniChart from '@/components/ui/MiniChart'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'
import mockClients from '@/data/mock/clients'
import mockLogs from '@/data/mock/logs'
import mockPackages from '@/data/mock/packages'
import mockTickets from '@/data/mock/tickets'
import mockTransactions from '@/data/mock/transactions'
import { useAuth } from '@/hooks/useAuth'

const currency = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
})

const dateTime = new Intl.DateTimeFormat('en-KE', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const transactionColumns = [
  { key: 'id', label: 'Reference' },
  { key: 'customerName', label: 'Customer' },
  { key: 'packageName', label: 'Package' },
  {
    key: 'amount',
    label: 'Amount',
    render: (amount) => currency.format(amount),
  },
  {
    key: 'status',
    label: 'Status',
    render: (status) => <StatusBadge status={status} />,
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const activeClients = mockClients.filter((client) => client.status === 'active')
  const successfulPayments = mockTransactions.filter(
    (transaction) => transaction.status === 'completed',
  )
  const receivedAmount = successfulPayments.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  )
  const openTickets = mockTickets.filter(
    (ticket) => ticket.status === 'open' || ticket.status === 'in_progress',
  )
  const transactions = mockTransactions.slice(0, 4)
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Administrator'

  return (
    <div className="admin-dashboard">
      <section className="admin-welcome-panel">
        <div>
          <p className="admin-eyebrow">NETWORK OVERVIEW</p>
          <h1>Good to see you, {firstName}.</h1>
          <p>Here’s what’s happening across your Wi-Fi service today.</p>
        </div>
        <Link className="admin-text-link" to="/admin/reports">
          View reports
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>

      <div className="admin-demo-notice" role="status">
        Dashboard figures are sample data and will update when the backend is connected.
      </div>

      <section className="admin-stat-grid" aria-label="Service overview">
        <StatCard
          label="Successful payments"
          value={currency.format(receivedAmount)}
          changeLabel="across sample transactions"
          icon={CircleDollarSign}
          tone="primary"
        />
        <StatCard
          label="Active customers"
          value={activeClients.length.toLocaleString()}
          changeLabel="in customer records"
          icon={Users}
          tone="blue"
        />
        <StatCard
          label="Available packages"
          value={mockPackages.filter((item) => item.status === 'active').length}
          changeLabel="ready for customers"
          icon={PackageCheck}
          tone="violet"
        />
        <StatCard
          label="Open support requests"
          value={openTickets.length}
          changeLabel="awaiting follow-up"
          icon={Activity}
          tone="orange"
        />
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-revenue-panel">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">PAYMENTS</p>
              <h2>Recent transactions</h2>
            </div>
            <Link className="admin-text-link" to="/admin/transactions">
              All transactions
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <DataTable
            columns={transactionColumns}
            rows={transactions}
            caption="Latest sample transactions"
            className="admin-dashboard-table"
          />
        </section>

        <section className="admin-panel admin-activity-panel">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">SYSTEM</p>
              <h2>Recent activity</h2>
            </div>
            <MiniChart
              values={[mockLogs.length, mockLogs.length - 1, mockLogs.length]}
              label="Recent system activity"
              height={32}
            />
          </div>
          <div className="admin-activity-list">
            {mockLogs.slice(0, 4).map((log) => (
              <article className="admin-activity-item" key={log.id}>
                <span
                  className={`admin-activity-marker is-${log.level}`}
                  aria-hidden="true"
                />
                <div>
                  <div className="admin-activity-meta">
                    <StatusBadge status={log.level} />
                    <time dateTime={log.createdAt}>
                      {dateTime.format(new Date(log.createdAt))}
                    </time>
                  </div>
                  <p>{log.message}</p>
                </div>
              </article>
            ))}
          </div>
          <Link className="admin-panel-link" to="/admin/system-logs">
            Open system logs
          </Link>
        </section>
      </div>
    </div>
  )
}