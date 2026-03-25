import type { PileMock } from './pile'

export interface SiteMock {
  id: string
  name: string
  /** Compact site label for alerts and dense UI (e.g. region name). */
  shortName: string
  /** Optional address or region line for operators (e.g. industrial park). */
  locationLine?: string
  /** Short label for cell dimensions shown on pile detail (e.g. "50m × 25m × 10m high"). */
  cellFootprintLabel: string
  piles: PileMock[]
}
