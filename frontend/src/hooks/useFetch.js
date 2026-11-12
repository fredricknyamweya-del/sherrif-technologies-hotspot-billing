import { useCallback, useEffect, useRef, useState } from 'react'
import { apiRequest } from '@/lib/api'

export function useFetch(path, options = {}, enabled = true) {
  const { method = 'GET', body, headers } = options
  const bodyRef = useRef(body)
  const headersRef = useRef(headers)
  bodyRef.current = body
  headersRef.current = headers
  const bodyKey = JSON.stringify(body ?? null)
  const headersKey = JSON.stringify(headers ?? null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(enabled))
  const [error, setError] = useState(null)
  const [requestNumber, setRequestNumber] = useState(0)

  const refetch = useCallback(() => {
    setRequestNumber((number) => number + 1)
  }, [])

  useEffect(() => {
    if (!enabled || !path) {
      setLoading(false)
      return undefined
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)
    apiRequest(path, {
      method,
      body: bodyRef.current,
      headers: headersRef.current,
      signal: controller.signal,
    })
      .then((result) => {
        if (!controller.signal.aborted) setData(result)
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [path, method, bodyKey, headersKey, enabled, requestNumber])

  return { data, loading, error, refetch }
}