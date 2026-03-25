/**
 * Grain pile reading bands from the agriQ assignment (temperature °C, moisture %).
 * Used for operator-facing color coding on the dashboard.
 */

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

/** Short label for tooltips / aria (band name, not the raw number). */
export function readingSeverityBandLabel(severity: ReadingSeverity): string {
  switch (severity) {
    case "ok":
      return "OK band";
    case "warning":
      return "Warning band";
    case "critical":
      return "Critical band";
    default:
      return "";
  }
}
