const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

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

export async function apiRequest(path, { method = 'GET', body, headers = {} } = {}) {
  const normalizedMethod = method.toUpperCase()
  const requestHeaders = new Headers(headers)
  if (body !== undefined) requestHeaders.set('Content-Type', 'application/json')
  if (['POST', 'PATCH', 'DELETE'].includes(normalizedMethod)) {
    const csrfToken = getCsrfToken()
    if (csrfToken) requestHeaders.set('X-CSRF-TOKEN', csrfToken)
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: normalizedMethod,
      credentials: 'include',
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'Unable to reach the server.',
      0,
    )
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

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
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return { ...settings }
  }
  return apiRequest('/admin/settings/appearance', {
    method: 'PATCH',
    body: settings,
  })
}