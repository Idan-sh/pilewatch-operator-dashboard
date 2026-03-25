/**
 * Grain pile reading bands from the agriQ assignment (temperature °C, moisture %).
 * Used for operator-facing color coding on the dashboard.
 */

import type { SensorReading } from "../types";

export type ReadingSeverity = "ok" | "warning" | "critical";

/** Below 30°C OK, 30-45°C warning, above 45°C critical */
export function getTemperatureSeverity(celsius: number): ReadingSeverity {
  if (celsius < 30) return "ok";
  if (celsius <= 45) return "warning";
  return "critical";
}

/** Below 14% OK, 14-17% warning, above 17% critical */
export function getMoistureSeverity(moisturePct: number): ReadingSeverity {
  if (moisturePct < 14) return "ok";
  if (moisturePct <= 17) return "warning";
  return "critical";
}

function severityRank(s: ReadingSeverity): number {
  return s === "critical" ? 2 : s === "warning" ? 1 : 0;
}

/** Worst band when both metrics apply (matches assignment: combined risk). */
export function worstReadingSeverity(a: ReadingSeverity, b: ReadingSeverity): ReadingSeverity {
  return severityRank(a) >= severityRank(b) ? a : b;
}

/** Tile stripe / tint from actual readings (not mock `health` alone), so Critical tooltips match the tile. */
export function getSensorTileSeverity(s: SensorReading): ReadingSeverity {
  if (s.health === "faulty") return "critical";
  const t = s.temperatureC;
  const m = s.moisturePct;
  if (t == null && m == null) return "ok";
  if (t == null) return m != null ? getMoistureSeverity(m) : "ok";
  if (m == null) return getTemperatureSeverity(t);
  return worstReadingSeverity(getTemperatureSeverity(t), getMoistureSeverity(m));
}

export function readingSeverityTextClass(severity: ReadingSeverity): string {
  switch (severity) {
    case "ok":
      return "text-status-ok font-medium";
    case "warning":
      return "text-status-warn font-medium";
    case "critical":
      return "text-status-critical font-medium";
    default:
      return "text-muted-foreground";
  }
}

/** Muted typography for dense UIs (e.g. Sites); band still available via `title` on each value. */
export function readingSeverityMutedTextClass(severity: ReadingSeverity): string {
  switch (severity) {
    case "ok":
      return "text-muted-foreground";
    case "warning":
      return "text-foreground/90";
    case "critical":
      return "text-foreground";
    default:
      return "text-muted-foreground";
  }
}

/** OK / Warning / Critical for tooltips and short UI copy. */
export function readingSeverityLevelLabel(severity: ReadingSeverity): string {
  switch (severity) {
    case "ok":
      return "OK";
    case "warning":
      return "Warning";
    case "critical":
      return "Critical";
    default:
      return "";
  }
}
