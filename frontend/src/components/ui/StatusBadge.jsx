const statusLabels = {
  active: 'Active',
  completed: 'Completed',
  success: 'Success',
  online: 'Online',
  paid: 'Paid',
  resolved: 'Resolved',
  pending: 'Pending',
  processing: 'Processing',
  in_progress: 'In progress',
  warning: 'Warning',
  expired: 'Expired',
  failed: 'Failed',
  error: 'Error',
  blocked: 'Blocked',
  offline: 'Offline',
  open: 'Open',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

function getTone(status) {
  const value = String(status || '').toLowerCase()
  if (['active', 'completed', 'success', 'online', 'paid', 'resolved'].includes(value)) return 'success'
  if (['pending', 'processing', 'in_progress', 'warning'].includes(value)) return 'warning'
  if (['failed', 'error', 'blocked', 'offline', 'cancelled'].includes(value)) return 'danger'
  return 'neutral'
}

export default function StatusBadge({ status, label, className = '' }) {
  const normalized = String(status || 'unknown').toLowerCase()
  const text =
    label ||
    statusLabels[normalized] ||
    normalized.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())

  return (
    <span
      className={`ui-status-badge tone-${getTone(normalized)} ${className}`.trim()}
      aria-label={`Status: ${text}`}
    >
      <span className="ui-status-dot" aria-hidden="true" />
      {text}
    </span>
  )
}