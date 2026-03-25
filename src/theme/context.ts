import { createContext } from 'react'
import type { ResolvedTheme, ThemePreference } from '../types/theme'

export type ThemeContextValue = {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (p: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
