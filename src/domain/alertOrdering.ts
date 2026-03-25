import type { AlertSeverity, OperatorAlert } from "../types";

function severityRank(s: AlertSeverity): number {
  return s === "critical" ? 0 : 1;
}

/** Critical first, then warning; same severity sorted by site then pile name. */
export function sortAlertsBySeverityThenPile(alerts: OperatorAlert[]): OperatorAlert[] {
  return [...alerts].sort((a, b) => {
    const bySev = severityRank(a.severity) - severityRank(b.severity);
    if (bySev !== 0) return bySev;
    const bySite = a.siteName.localeCompare(b.siteName, undefined, { sensitivity: "base" });
    if (bySite !== 0) return bySite;
    return a.pileName.localeCompare(b.pileName, undefined, { sensitivity: "base" });
  });
}

/** Table column sort keys (Alerts page). */
export type AlertSortColumn = "severity" | "location" | "alert" | "sensors";

function compareAlertsForColumn(
  a: OperatorAlert,
  b: OperatorAlert,
  column: AlertSortColumn
): number {
  switch (column) {
    case "severity":
      return severityRank(a.severity) - severityRank(b.severity);
    case "location": {
      const bySite = a.siteName.localeCompare(b.siteName, undefined, { sensitivity: "base" });
      if (bySite !== 0) return bySite;
      return a.pileName.localeCompare(b.pileName, undefined, { sensitivity: "base" });
    }
    case "alert":
      return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    case "sensors":
      return a.sensorIds.join(",").localeCompare(b.sensorIds.join(","), undefined, {
        sensitivity: "base",
        numeric: true
      });
    default:
      return 0;
  }
}

/** Sort by one column; ties broken by alert id for stable order. */
export function sortAlertsByColumn(
  alerts: OperatorAlert[],
  column: AlertSortColumn,
  direction: "asc" | "desc"
): OperatorAlert[] {
  const mul = direction === "asc" ? 1 : -1;
  return [...alerts].sort((a, b) => {
    const cmp = compareAlertsForColumn(a, b, column);
    if (cmp !== 0) return cmp * mul;
    return a.id.localeCompare(b.id);
  });
}

export type AlertsTableFilterState = {
  /** Empty set matches no rows; full set from defaults means all severities included. */
  severities: Set<AlertSeverity>;
  /** Empty set matches no rows; full set means all piles included. */
  pileIds: Set<string>;
  /** Empty set matches no rows; full set means all sensors included. Alert must include at least one selected sensor when non-empty. */
  sensorIds: Set<string>;
};

/**
 * Filter alerts by severity, pile, and sensor involvement.
 * Any empty set yields no matches (operators must keep each dimension non-empty for rows to show).
 */
export function filterAlertsTable(
  alerts: OperatorAlert[],
  f: AlertsTableFilterState
): OperatorAlert[] {
  return alerts.filter((a) => {
    if (f.severities.size === 0) return false;
    if (!f.severities.has(a.severity)) return false;
    if (f.pileIds.size === 0) return false;
    if (!f.pileIds.has(a.pileId)) return false;
    if (f.sensorIds.size === 0) return false;
    if (!a.sensorIds.some((id) => f.sensorIds.has(id))) return false;
    return true;
  });
}

function setsEqual<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) {
    if (!b.has(v)) return false;
  }
  return true;
}

export function areAlertsFiltersEqual(a: AlertsTableFilterState, b: AlertsTableFilterState): boolean {
  return (
    setsEqual(a.severities, b.severities) &&
    setsEqual(a.pileIds, b.pileIds) &&
    setsEqual(a.sensorIds, b.sensorIds)
  );
}

/** Default filter state for the current alert list (all severities, piles, and sensors included). */
export function buildDefaultAlertsFilters(alerts: OperatorAlert[]): AlertsTableFilterState {
  const pileIds = [...new Set(alerts.map((x) => x.pileId))];
  const sensorIds = [...new Set(alerts.flatMap((x) => x.sensorIds))].sort((x, y) =>
    x.localeCompare(y, undefined, { numeric: true })
  );
  return {
    severities: new Set<AlertSeverity>(["critical", "warning"]),
    pileIds: new Set(pileIds),
    sensorIds: new Set(sensorIds)
  };
}
