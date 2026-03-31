import type { AlertSeverity, PileStatus } from '../types'

/** Tone for operator-facing status pills. */
export type StatusPillTone = 'ok' | 'warn' | 'critical'

/**
 * Shared class recipe for {@link StatusStripePill} and interactive parents (e.g. filter buttons).
 */
export function statusStripePillClassName(
  tone: StatusPillTone,
  variant: 'badge' | 'filter' | 'chip'
): string {
  const pad = (() => {
    switch (variant) {
      case 'filter':
        return 'min-h-[2rem] px-3 py-1.5'
      case 'chip':
        return 'px-2 py-0.5'
      case 'badge':
        return 'px-2.5 py-0.5'
    }
  })()
  const base = [
    'inline-flex shrink-0 items-center gap-1.5 rounded-full border text-xs font-semibold tabular-nums',
    pad
  ].join(' ')
  switch (tone) {
    case 'critical':
      return `${base} border-status-critical/40 bg-status-critical/15 text-status-critical`
    case 'warn':
      return `${base} border-status-warn/40 bg-status-warn/15 text-status-warn`
    case 'ok':
      return `${base} border-status-ok/30 bg-status-ok/10 text-status-ok`
  }
}

export function pileStatusToTone(status: PileStatus): StatusPillTone {
  switch (status) {
    case 'OK':
      return 'ok'
    case 'Warning':
      return 'warn'
    case 'Critical':
      return 'critical'
  }
}

export function alertSeverityToTone(severity: AlertSeverity): StatusPillTone {
  return severity === 'critical' ? 'critical' : 'warn'
}
