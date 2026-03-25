import type { SensorReading } from './sensor'

export type PileStatus = 'OK' | 'Warning' | 'Critical'

export interface PileMock {
  id: string
  siteId: string
  name: string
  status: PileStatus
  aggregateTempC: number
  aggregateMoisturePct: number
  sensors: SensorReading[]
}
