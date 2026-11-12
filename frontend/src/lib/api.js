import mockClients from '@/data/mock/clients'
import mockLogs from '@/data/mock/logs'
import mockPackages from '@/data/mock/packages'
import mockTickets from '@/data/mock/tickets'
import mockTransactions from '@/data/mock/transactions'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
let mockAuthenticated = false
let mockUser = null
const mockStores = {
  clients: [...mockClients],
  logs: [...mockLogs],
  packages: [...mockPackages],
  tickets: [...mockTickets],
  transactions: [...mockTransactions],
}
const mockPayments = new Map()

function getCsrfToken() {
  const metaToken = document.querySelector('meta[name="csrf-token"]')?.content
  if (metaToken) return metaToken

  const cookie = document.cookie
    .split('; ')
    .find((part) => part.startsWith('XSRF-TOKEN='))
  if (!cookie) return ''

  try {
    return decodeURIComponent(cookie.slice('XSRF-TOKEN='.length))
  } catch {
    return cookie.slice('XSRF-TOKEN='.length)
  }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

function getMockCollection(path) {
  const normalizedPath = path.split('?')[0].replace(/\/+$/, '').toLowerCase()
  const collections = [
    { key: 'clients', endings: ['/clients', '/customers', '/admin/clients', '/admin/customers'] },
    { key: 'logs', endings: ['/logs', '/admin/logs', '/admin/system-logs'] },
    { key: 'packages', endings: ['/packages', '/admin/packages'] },
    { key: 'tickets', endings: ['/tickets', '/admin/tickets', '/admin/support/tickets'] },
    { key: 'transactions', endings: ['/transactions', '/admin/transactions'] },
  ]
  return collections.find(({ endings }) =>
    endings.some(
      (ending) =>
        normalizedPath.endsWith(ending) || normalizedPath.includes(`${ending}/`),
    ),
  )?.key
}

function isMockCollectionPath(path, collection) {
  const normalizedPath = path.replace(/\/+$/, '').toLowerCase()
  const endings = {
    clients: ['/clients', '/customers', '/admin/clients', '/admin/customers'],
    logs: ['/logs', '/admin/logs', '/admin/system-logs'],
    packages: ['/packages', '/admin/packages'],
    tickets: ['/tickets', '/admin/tickets', '/admin/support/tickets'],
    transactions: ['/transactions', '/admin/transactions'],
  }[collection]
  return endings.some((ending) => normalizedPath.endsWith(ending))
}

function filterMockRecords(records, searchParams) {
  let filtered = records
  const search = searchParams.get('search')?.toLowerCase()
  if (search) {
    filtered = filtered.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(search),
      ),
    )
  }
  const status = searchParams.get('status')
  if (status) {
    filtered = filtered.filter(
      (record) => String(record.status).toLowerCase() === status.toLowerCase(),
    )
  }
  return filtered
}

function mockRequest(path, method, body) {
  const url = new URL(path, 'http://mock.local')
  const normalizedPath = url.pathname.replace(/\/+$/, '').toLowerCase()

  if (
    method === 'GET' &&
    (normalizedPath.endsWith('/portal/announcements') ||
      normalizedPath.endsWith('/announcements'))
  ) {
    return [
      {
        id: 'ANN-001',
        title: 'Welcome to Sherrif Technologies Wi-Fi',
        message: 'Fast, reliable internet is just a few taps away.',
        createdAt: '2026-11-12T08:00:00Z',
      },
    ]
  }
  if (
    method === 'POST' &&
    (normalizedPath.endsWith('/portal/payments') ||
      normalizedPath.endsWith('/payments/initiate'))
  ) {
    const id = `PAY-${Date.now()}`
    const requestedStatus = ['failed', 'timeout'].includes(body?.mockStatus)
      ? body.mockStatus
      : 'pending'
    mockPayments.set(id, {
      id,
      status: requestedStatus === 'pending' ? 'success' : requestedStatus,
      phone: body?.phone || '',
      packageId: body?.packageId || '',
      amount: Number(body?.amount) || 0,
      reference: `MP${String(Date.now()).slice(-8)}`,
      createdAt: new Date().toISOString(),
    })
    return {
      paymentId: id,
      status: requestedStatus,
      message: 'Payment request sent. Check your phone to complete payment.',
    }
  }
  if (
    method === 'GET' &&
    (normalizedPath.includes('/portal/payments/') ||
      normalizedPath.includes('/payments/'))
  ) {
    const paymentId = url.pathname.split('/').filter(Boolean).at(-1)
    const payment = mockPayments.get(paymentId)
    if (!payment) throw new ApiError('Payment could not be found.', 404)
    return clone(payment)
  }
  if (
    method === 'POST' &&
    (normalizedPath.endsWith('/portal/reconnect') ||
      normalizedPath.endsWith('/reconnect'))
  ) {
    if (!body?.code || !body?.phone) {
      throw new ApiError('Enter your payment code and phone number.', 422)
    }
    return {
      success: true,
      message: 'Your connection is active again.',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }
  }
  if (
    method === 'POST' &&
    (normalizedPath.endsWith('/portal/vouchers/redeem') ||
      normalizedPath.endsWith('/vouchers/redeem'))
  ) {
    if (!/^VCH-[A-Z0-9]{8}$/.test(String(body?.code || '').toUpperCase())) {
      throw new ApiError('Enter a voucher in the format VCH-XXXXXXXX.', 422)
    }
    return {
      success: true,
      message: 'Voucher accepted. You are connected.',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  }
  if (
    method === 'POST' &&
    (normalizedPath.endsWith('/portal/support') ||
      normalizedPath.endsWith('/support/tickets'))
  ) {
    return {
      id: `TKT-${Date.now()}`,
      status: 'open',
      message: 'Your support request has been received.',
    }
  }

  if (normalizedPath.endsWith('/admin/auth/me')) {
    if (!mockAuthenticated) throw new ApiError('Authentication required.', 401)
    return clone({ user: mockUser })
  }
  if (normalizedPath.endsWith('/admin/auth/login') && method === 'POST') {
    if (!body?.username || !body?.password) {
      throw new ApiError('Enter your username and password.', 422)
    }
    mockAuthenticated = true
    mockUser = { id: 'admin-mock', name: body.username, role: 'admin' }
    return clone({ user: mockUser })
  }
  if (normalizedPath.endsWith('/admin/auth/logout') && method === 'POST') {
    mockAuthenticated = false
    mockUser = null
    return { success: true }
  }
  if (normalizedPath.endsWith('/admin/settings/appearance') && method === 'PATCH') {
    return clone(body)
  }

  const collection = getMockCollection(url.pathname)
  if (!collection) {
    throw new ApiError(`No mock response is configured for ${method} ${url.pathname}.`, 404)
  }

  const records = mockStores[collection]
  const segments = normalizedPath.split('/').filter(Boolean)
  const lastSegment = segments.at(-1)
  const isCollectionPath = isMockCollectionPath(url.pathname, collection)

  if (method === 'GET') {
    const filtered = filterMockRecords(records, url.searchParams)
    if (isCollectionPath) return clone(filtered)
    const record = records.find((item) => String(item.id) === lastSegment)
    if (!record) throw new ApiError('Record not found.', 404)
    return clone(record)
  }

  if (method === 'POST' && isCollectionPath) {
    const record = { ...body, id: body?.id || `${collection.slice(0, -1)}-${Date.now()}` }
    records.unshift(record)
    return clone(record)
  }

  const recordId = isCollectionPath ? null : lastSegment
  const recordIndex = records.findIndex((item) => String(item.id) === recordId)
  if (recordIndex < 0) throw new ApiError('Record not found.', 404)

  if (method === 'PATCH') {
    records[recordIndex] = { ...records[recordIndex], ...body }
    return clone(records[recordIndex])
  }
  if (method === 'DELETE') {
    const [removed] = records.splice(recordIndex, 1)
    return clone(removed)
  }

  throw new ApiError(`Mock method ${method} is not supported for ${url.pathname}.`, 405)
}

export async function apiRequest(
  path,
  { method = 'GET', body, headers = {}, signal } = {},
) {
  const normalizedMethod = method.toUpperCase()
  if (USE_MOCK) return mockRequest(path, normalizedMethod, body)

  const requestHeaders = new Headers(headers)
  if (body !== undefined) requestHeaders.set('Content-Type', 'application/json')
  if (['POST', 'PATCH', 'DELETE'].includes(normalizedMethod)) {
    requestHeaders.set('X-CSRF-TOKEN', getCsrfToken())
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: normalizedMethod,
      credentials: 'include',
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'Unable to reach the server.',
      0,
    )
  }

  const contentType = response.headers.get('content-type') || ''
  const responseText = await response.text()
  let data = responseText
  if (contentType.includes('application/json') && responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      throw new ApiError('The server returned an invalid JSON response.', response.status)
    }
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? data.message
        : `Request failed with status ${response.status}.`
    throw new ApiError(message, response.status, data)
  }

  return data
}

export async function updateAppearance(settings) {
  return apiRequest('/admin/settings/appearance', {
    method: 'PATCH',
    body: settings,
  })
}