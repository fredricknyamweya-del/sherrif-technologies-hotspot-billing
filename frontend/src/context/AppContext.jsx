import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { updateAppearance } from '@/lib/api'
import {
  DEFAULT_PRIMARY_COLOR,
  THEME_STORAGE_KEYS,
  isValidHexColor,
} from '@/config/themes'

export const AppContext = createContext(null)

function getStoredValue(key, fallback) {
  try {
    return window.localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    getStoredValue(THEME_STORAGE_KEYS.mode, 'light') === 'dark' ? 'dark' : 'light',
  )
  const [primaryColor, setPrimaryColor] = useState(() => {
    const stored = getStoredValue(THEME_STORAGE_KEYS.primary, DEFAULT_PRIMARY_COLOR)
    return isValidHexColor(stored) ? stored : DEFAULT_PRIMARY_COLOR
  })
  const [appearanceError, setAppearanceError] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem(THEME_STORAGE_KEYS.mode, theme)
    } catch {
      // The selected theme remains active for this session if storage is unavailable.
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', primaryColor)
    document.documentElement.style.setProperty(
      '--color-primary-strong',
      primaryColor,
    )
    document.documentElement.style.setProperty(
      '--color-primary-soft',
      `color-mix(in srgb, ${primaryColor} 12%, var(--color-surface))`,
    )
    try {
      window.localStorage.setItem(THEME_STORAGE_KEYS.primary, primaryColor)
    } catch {
      // The selected colour remains active for this session if storage is unavailable.
    }
  }, [primaryColor])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const changePrimaryColor = useCallback(async (color) => {
    if (!isValidHexColor(color)) {
      throw new Error('Enter a valid six-digit hex colour.')
    }

    setPrimaryColor(color)
    setAppearanceError('')
    try {
      await updateAppearance({ primaryColor: color })
    } catch (error) {
      setAppearanceError(
        error instanceof Error
          ? error.message
          : 'Unable to save the primary colour to the server.',
      )
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      primaryColor,
      setPrimaryColor: changePrimaryColor,
      appearanceError,
    }),
    [theme, toggleTheme, primaryColor, changePrimaryColor, appearanceError],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}