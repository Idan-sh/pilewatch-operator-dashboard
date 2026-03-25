import { useCallback, useId, type ChangeEvent } from 'react'
import type { ThemePreference } from '../types'
import { useTheme } from '../theme/useTheme'

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

export default function ThemeSelect() {
  const id = useId()
  const { preference, setPreference } = useTheme()

  const handleThemeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setPreference(event.target.value as ThemePreference)
    },
    [setPreference],
  )

  return (
    <div className="flex min-w-0 shrink-0 items-center gap-2">
      <label
        htmlFor={id}
        className="text-muted-foreground whitespace-nowrap text-sm"
      >
        Theme
      </label>
      <select
        id={id}
        value={preference}
        onChange={handleThemeChange}
        className="border-border bg-background text-foreground focus-visible:ring-accent max-w-full rounded-md border px-2 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="Color theme"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
