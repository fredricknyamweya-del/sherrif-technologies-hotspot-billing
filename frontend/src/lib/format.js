export function formatCurrency(amount, currency = 'KSh', locale = 'en-KE') {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency === 'KSh' ? 'KES' : currency,
    currencyDisplay: 'code',
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace(/^KES/u, 'KSh')
}

export function formatPhoneNumber(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '')
  let local = digits
  if (local.startsWith('254')) local = local.slice(3)
  else if (local.startsWith('0')) local = local.slice(1)
  if (!local) return ''

  const normalized = local.slice(0, 9)
  const first = normalized.slice(0, 3)
  const second = normalized.slice(3, 6)
  const third = normalized.slice(6, 9)
  return `+254 ${[first, second, third].filter(Boolean).join(' ')}`
}

export function isValidKenyanPhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '')
  return /^(?:254|0)?(?:7|1)\d{8}$/.test(digits)
}

export function formatDate(value, options = {}) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date)
}

export function formatDateTime(value, options = {}) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(date)
}

export function formatDuration(minutes) {
  const value = Number(minutes)
  if (!Number.isFinite(value) || value < 0) return '—'
  if (value < 60) return `${value} min`
  const hours = Math.floor(value / 60)
  const days = Math.floor(hours / 24)
  if (days) {
    const remainingHours = hours % 24
    return remainingHours ? `${days}d ${remainingHours}h` : `${days}d`
  }
  const remainingMinutes = value % 60
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export function formatBytes(bytes, fractionDigits = 1) {
  const value = Number(bytes)
  if (!Number.isFinite(value) || value < 0) return '—'
  if (value < 1000) return `${value} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let scaled = value / 1000
  let unitIndex = 0
  while (scaled >= 1000 && unitIndex < units.length - 1) {
    scaled /= 1000
    unitIndex += 1
  }
  return `${scaled.toFixed(fractionDigits)} ${units[unitIndex]}`
}