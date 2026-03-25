import { motion } from 'framer-motion'
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { useCallback } from 'react'
import type { ThemePreference } from '../types'
import { useTheme } from '../theme/useTheme'

const OPTIONS: {
  value: ThemePreference
  label: string
  Icon: LucideIcon
}[] = [
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
  { value: 'system', label: 'Match system theme', Icon: Monitor },
]

export default function ThemeSelect() {
  const { preference, setPreference } = useTheme()

  const handleSelect = useCallback(
    (value: ThemePreference) => {
      setPreference(value)
    },
    [setPreference],
  )

  return (
    <fieldset className="m-0 min-w-0 shrink-0 border-0 p-0">
      <legend className="sr-only">Color theme</legend>
      <div className="border-border bg-card inline-flex rounded-panel border p-1 shadow-panel">
        {OPTIONS.map(({ value, label, Icon }) => {
          const selected = preference === value
          return (
            <motion.button
              key={value}
              type="button"
              onClick={() => handleSelect(value)}
              aria-pressed={selected}
              aria-label={label}
              title={label}
              className={`group relative z-10 flex min-w-[2.5rem] items-center justify-center rounded-control px-2.5 py-2 outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-[2.75rem] sm:px-3 ${
                selected ? '' : 'hover:bg-accent-soft'
              }`}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 520, damping: 32 }}
            >
              {selected ? (
                <motion.div
                  layoutId="theme-segment-active"
                  className="border-border bg-background group-hover:bg-accent-soft absolute inset-0 rounded-control border transition-colors duration-150"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  aria-hidden
                />
              ) : null}
              <motion.span
                className="relative z-10"
                initial={false}
                animate={{
                  opacity: selected ? 1 : 0.45,
                  scale: selected ? 1 : 0.92,
                }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              >
                <Icon
                  className={`size-[1.125rem] sm:size-5 ${
                    selected ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                  strokeWidth={selected ? 2.25 : 2}
                  aria-hidden
                />
              </motion.span>
            </motion.button>
          )
        })}
      </div>
    </fieldset>
  )
}
