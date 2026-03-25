export type SensorLayer = 'bottom' | 'middle' | 'top'

export type SensorHealth = 'normal' | 'elevated' | 'faulty'

export interface SensorReading {
  id: string
  layer: SensorLayer
  temperatureC: number | null
  moisturePct: number | null
  health: SensorHealth
}
