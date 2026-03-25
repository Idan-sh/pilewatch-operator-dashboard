/** App UI theme preference (persisted in localStorage). */
export type ThemePreference = 'light' | 'dark' | 'system'

/** Resolved light or dark after applying System → OS preference. */
export type ResolvedTheme = 'light' | 'dark'
