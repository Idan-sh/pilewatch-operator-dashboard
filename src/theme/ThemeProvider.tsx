import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ThemePreference } from '../types/theme'
import { ThemeContext } from './context'
import {
  THEME_STORAGE_KEY,
  applyResolvedToDom,
  readStoredPreference,
  resolveTheme,
} from './themeShared'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    typeof document !== 'undefined' ? readStoredPreference() : 'system',
  )

  const resolved = useMemo(() => resolveTheme(preference), [preference])

  useEffect(() => {
    applyResolvedToDom(resolved)
  }, [resolved])

  useEffect(() => {
    if (preference !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyResolvedToDom(resolveTheme('system'))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [preference])

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, p)
    } catch {
      /* ignore */
    }
    applyResolvedToDom(resolveTheme(p))
  }, [])

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
