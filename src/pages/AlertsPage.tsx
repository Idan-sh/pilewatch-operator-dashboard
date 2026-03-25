import { useMemo } from 'react'
import { getActiveAlerts } from '../data/mockData'
import type { AlertSeverity } from '../types'

function severityStyles(severity: AlertSeverity): string {
  if (severity === 'critical') {
    return 'border-status-critical/50 bg-status-critical/10'
  }
  return 'border-status-warn/50 bg-status-warn/10'
}

function severityLabel(severity: AlertSeverity): string {
  return severity === 'critical' ? 'Critical' : 'Warning'
}

export default function AlertsPage() {
  const alerts = useMemo(() => getActiveAlerts(), [])

  return (
    <div>
      <h1 className="text-foreground mb-2">Alerts</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl text-base">
        Active issues across all piles. Read the next steps first, then act.
      </p>

      <div
        className="flex flex-col gap-4"
        role="region"
        aria-live="polite"
        aria-label="Active alerts list"
      >
        {alerts.length === 0 ? (
          <p className="text-muted-foreground">No active alerts.</p>
        ) : (
          alerts.map((alert) => (
            <article
              key={alert.id}
              className={[
                'border-border rounded-xl border p-5 shadow-sm',
                severityStyles(alert.severity),
              ].join(' ')}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-muted-foreground text-sm">
                    {alert.pileName}
                  </p>
                  <h2 className="text-foreground mt-1 text-lg font-medium">
                    {alert.title}
                  </h2>
                </div>
                <span
                  className={[
                    'rounded-full border px-2.5 py-1 text-xs font-semibold',
                    alert.severity === 'critical'
                      ? 'border-status-critical/50 text-status-critical'
                      : 'border-status-warn/50 text-status-warn',
                  ].join(' ')}
                >
                  {severityLabel(alert.severity)}
                </span>
              </div>

              <p className="text-foreground mt-3 text-sm">
                <span className="text-muted-foreground">Sensors: </span>
                <span className="font-mono">{alert.sensorIds.join(', ')}</span>
              </p>
              <p className="text-foreground mt-2 text-sm">
                {alert.readingSummary}
              </p>

              <div className="border-border mt-4 border-t pt-4">
                <p className="text-foreground text-sm font-medium">
                  What to do next
                </p>
                <ol className="text-muted-foreground mt-2 list-decimal space-y-2 pl-5 text-sm">
                  {alert.nextSteps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
