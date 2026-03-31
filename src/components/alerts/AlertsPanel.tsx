import { ChevronDown, ChevronUp } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent
} from "react";
import {
  type AlertSortColumn,
  type AlertsTableFilterState,
  buildDefaultAlertsFilters,
  filterAlertsTable,
  sortAlertsByColumn
} from "../../domain/alertOrdering";
import type { OperatorAlert } from "../../types";
import StatusStripePill from "../StatusStripePill";
import { alertSeverityToTone } from "../../ui/statusPill";
import AlertsFilters from "./AlertsFilters";

function severityLabel(severity: OperatorAlert["severity"]): string {
  return severity === "critical" ? "Critical" : "Warning";
}

function SensorIdPill({ tone, sensorId }: { tone: "critical" | "warn"; sensorId: string }) {
  return (
    <StatusStripePill
      tone={tone}
      variant="chip"
      showIcon={false}
      className="font-mono text-[0.7rem] font-semibold"
    >
      {sensorId}
    </StatusStripePill>
  );
}

function AlertsSummaryBar({
  totalAlerts,
  displayedAlerts
}: {
  totalAlerts: OperatorAlert[];
  displayedAlerts: OperatorAlert[];
}) {
  const totalCount = totalAlerts.length;
  const displayedCount = displayedAlerts.length;
  const isShowingSubset = displayedCount < totalCount;

  const { critical, warning } = useMemo(() => {
    let c = 0;
    let w = 0;
    for (const a of displayedAlerts) {
      if (a.severity === "critical") c += 1;
      else w += 1;
    }
    return { critical: c, warning: w };
  }, [displayedAlerts]);

  return (
    <div className="border-border bg-card mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-surface border px-4 py-3">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-foreground m-0 text-sm tabular-nums">
          <span className="font-semibold">{totalCount}</span>{" "}
          <span className="text-muted-foreground font-normal">active alerts</span>
        </p>
        {isShowingSubset ? (
          <p className="text-muted-foreground m-0 text-xs tabular-nums">
            Showing {displayedCount} of {totalCount}
          </p>
        ) : null}
      </div>
      <div className="bg-border hidden h-4 w-px sm:block" aria-hidden />
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <StatusStripePill tone="critical">{critical} critical</StatusStripePill>
        <StatusStripePill tone="warn">{warning} warning</StatusStripePill>
      </div>
    </div>
  );
}

function SortableTh({
  label,
  column,
  sortColumn,
  sortDir,
  onSortClick
}: {
  label: string;
  column: AlertSortColumn;
  sortColumn: AlertSortColumn;
  sortDir: "asc" | "desc";
  onSortClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const active = sortColumn === column;
  const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";

  return (
    <th
      scope="col"
      className="text-muted-foreground px-4 py-2.5 pr-3 font-medium"
      aria-sort={ariaSort}
    >
      <button
        type="button"
        data-sort-col={column}
        onClick={onSortClick}
        className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1 rounded-control px-1 py-0.5 text-left text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ChevronDown className="size-3.5 shrink-0 opacity-80" aria-hidden />
          ) : (
            <ChevronUp className="size-3.5 shrink-0 opacity-80" aria-hidden />
          )
        ) : (
          <span className="text-muted-foreground/50 inline-block w-3.5" aria-hidden />
        )}
      </button>
    </th>
  );
}

function AlertRow({ alert }: { alert: OperatorAlert }) {
  const leftBorder =
    alert.severity === "critical" ? "border-l-status-critical" : "border-l-status-warn";
  const tone = alertSeverityToTone(alert.severity);

  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentInnerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const el = contentInnerRef.current;
    if (!el) return;
    setContentHeight(el.scrollHeight);
  }, [isOpen]);

  return (
    <tr className="border-border border-b transition-colors last:border-b-0 hover:bg-card/60">
      <td className={["align-top border-l-4 py-3 pl-4 pr-3", leftBorder].join(" ")}>
        <StatusStripePill tone={tone} className="whitespace-nowrap">
          {severityLabel(alert.severity)}
        </StatusStripePill>
      </td>
      <td className="align-top py-3 pr-4">
        <div className="text-foreground text-sm font-medium leading-snug">{alert.siteName}</div>
        <div className="text-muted-foreground mt-0.5 text-sm leading-snug">{alert.pileName}</div>
      </td>
      <td className="align-top py-3 pr-4">
        <div className="text-foreground text-sm font-medium leading-snug">{alert.title}</div>
        <p className="text-muted-foreground mt-1 max-w-xl text-xs leading-relaxed">
          {alert.readingSummary}
        </p>
        <div className="border-border text-foreground mt-3 rounded-control border bg-background/80">
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="w-full cursor-pointer list-none px-3 py-2 text-left text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-expanded={isOpen}
          >
            Next steps ({alert.nextSteps.length})
          </button>

          <div
            className={[
              "overflow-hidden transition-[height,opacity] duration-200 ease-out",
              "will-change-[height,opacity]"
            ].join(" ")}
            style={{
              height: isOpen ? contentHeight : 0,
              opacity: isOpen ? 1 : 0
            }}
          >
            <div ref={contentInnerRef}>
              <ol className="text-muted-foreground border-border list-decimal space-y-1.5 border-t px-3 pb-3 pt-3 pl-8 text-xs leading-relaxed">
                {alert.nextSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </td>
      <td className="align-top py-3 pr-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {alert.sensorIds.map((sid) => (
            <SensorIdPill
              key={sid}
              tone={tone === "critical" ? "critical" : "warn"}
              sensorId={sid}
            />
          ))}
        </div>
      </td>
    </tr>
  );
}

type AlertsPanelProps = {
  alerts: OperatorAlert[];
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  const [filters, setFilters] = useState<AlertsTableFilterState>(() =>
    buildDefaultAlertsFilters(alerts)
  );

  useEffect(() => {
    setFilters(buildDefaultAlertsFilters(alerts));
  }, [alerts]);

  const defaultFilters = useMemo(() => buildDefaultAlertsFilters(alerts), [alerts]);

  /** Same order as defaults (Set preserves insertion order from sorted ids). */
  const sensorIdsSorted = useMemo(() => [...defaultFilters.sensorIds], [defaultFilters]);

  /** Single object so toggling the same column always flips `dir` in one update (no nested setState). */
  const [sortState, setSortState] = useState<{
    column: AlertSortColumn;
    dir: "asc" | "desc";
  }>({ column: "severity", dir: "asc" });

  const pileOptions = useMemo(() => {
    const m = new Map<
      string,
      { pileId: string; pileName: string; siteName: string; label: string }
    >();
    for (const a of alerts) {
      if (!m.has(a.pileId)) {
        m.set(a.pileId, {
          pileId: a.pileId,
          pileName: a.pileName,
          siteName: a.siteName,
          label: a.pileName
        });
      }
    }
    return [...m.values()].sort((a, b) => {
      const bySite = a.siteName.localeCompare(b.siteName, undefined, { sensitivity: "base" });
      if (bySite !== 0) return bySite;
      return a.pileName.localeCompare(b.pileName, undefined, { sensitivity: "base" });
    });
  }, [alerts]);

  const filteredAlerts = useMemo(() => filterAlertsTable(alerts, filters), [alerts, filters]);

  const displayedAlerts = useMemo(
    () => sortAlertsByColumn(filteredAlerts, sortState.column, sortState.dir),
    [filteredAlerts, sortState]
  );

  const handleSortHeaderClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const col = event.currentTarget.dataset.sortCol as AlertSortColumn | undefined;
    if (!col) return;
    setSortState((prev) => {
      if (prev.column === col) {
        return { column: col, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { column: col, dir: "asc" };
    });
  }, []);

  const handleResetFiltersClick = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  if (alerts.length === 0) {
    return <p className="text-muted-foreground text-sm">No active alerts.</p>;
  }

  return (
    <div role="region" aria-live="polite" aria-label="Active alerts">
      <AlertsSummaryBar totalAlerts={alerts} displayedAlerts={displayedAlerts} />

      <AlertsFilters
        pileOptions={pileOptions}
        sensorIdsSorted={sensorIdsSorted}
        filters={filters}
        defaultFilters={defaultFilters}
        onChange={setFilters}
      />

      {displayedAlerts.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-muted-foreground m-0 text-sm">No alerts match your filters.</p>
          <button
            type="button"
            onClick={handleResetFiltersClick}
            className="text-foreground border-border bg-background hover:bg-card focus-visible:ring-accent rounded-control border px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div>
          <p className="text-muted-foreground mb-2 text-sm sm:hidden">
            Swipe sideways to see all columns.
          </p>
          <div className="border-border overflow-x-auto rounded-surface border bg-background">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <caption className="sr-only">
              Active alerts by severity, location, and affected sensors. Use column headers to sort.
            </caption>
            <thead>
              <tr className="border-border bg-card/80 border-b text-xs">
                <SortableTh
                  label="Severity"
                  column="severity"
                  sortColumn={sortState.column}
                  sortDir={sortState.dir}
                  onSortClick={handleSortHeaderClick}
                />
                <SortableTh
                  label="Location"
                  column="location"
                  sortColumn={sortState.column}
                  sortDir={sortState.dir}
                  onSortClick={handleSortHeaderClick}
                />
                <SortableTh
                  label="Alert"
                  column="alert"
                  sortColumn={sortState.column}
                  sortDir={sortState.dir}
                  onSortClick={handleSortHeaderClick}
                />
                <SortableTh
                  label="Sensors"
                  column="sensors"
                  sortColumn={sortState.column}
                  sortDir={sortState.dir}
                  onSortClick={handleSortHeaderClick}
                />
              </tr>
            </thead>
            <tbody>
              {displayedAlerts.map((alert) => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
