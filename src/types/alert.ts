export type AlertSeverity = 'warning' | 'critical'

export interface OperatorAlert {
  id: string
  siteId: string
  siteName: string
  pileId: string
  pileName: string
  severity: AlertSeverity
  title: string
  sensorIds: string[]
  readingSummary: string
  nextSteps: string[]
}
