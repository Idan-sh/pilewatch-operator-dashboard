import { ChevronDown, ListFilter } from "lucide-react";
import { useCallback, useId, useMemo, useState, type ChangeEvent } from "react";
import {
  areAlertsFiltersEqual,
  type AlertsTableFilterState
} from "../../domain/alertOrdering";
import type { AlertSeverity } from "../../types";
import { getStatusPillToneClasses } from "../../ui/statusPill";

type PileOption = { pileId: string; pileName: string };

const FILTER_SECTION_HEADER_CLASS_NAME =
  "flex min-h-9 items-center justify-between gap-3";

const FILTER_SECTION_TITLE_CLASS_NAME =
  "text-muted-foreground text-[0.65rem] font-semibold uppercase tracking-wider";

const FILTER_TILE_CLASS_NAME =
  "bg-card/60 hover:bg-card/85 flex cursor-pointer items-center gap-2 rounded-control px-3 py-2 text-sm transition-colors has-[:checked]:bg-accent-soft";

const FILTER_BULK_BTN_CLASS_NAME =
  "text-foreground bg-card/80 hover:bg-card rounded-control px-2.5 py-1.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Short horizontal rule inset from the panel content edges (not full-bleed). */
function FilterInsetRule({ className }: { className?: string }) {
  return (
    <div
      className={["col-span-full mx-5 h-px shrink-0 bg-border sm:mx-8", className].filter(Boolean).join(" ")}
      aria-hidden
    />
  );
}

type FilterBulkSelectProps = {
  ariaLabel: string;
  onSelectAll: () => void;
  onClearAll: () => void;
};

function FilterBulkSelect({ ariaLabel, onSelectAll, onClearAll }: FilterBulkSelectProps) {
  return (
    <div className="flex shrink-0 gap-1.5" role="group" aria-label={ariaLabel}>
      <button type="button" onClick={onSelectAll} className={FILTER_BULK_BTN_CLASS_NAME}>
        All
      </button>
      <button type="button" onClick={onClearAll} className={FILTER_BULK_BTN_CLASS_NAME}>
        None
      </button>
    </div>
  );
}

type AlertsFiltersProps = {
  pileOptions: PileOption[];
  sensorIdsSorted: string[];
  filters: AlertsTableFilterState;
  defaultFilters: AlertsTableFilterState;
  onChange: (next: AlertsTableFilterState) => void;
};

export default function AlertsFilters({
  pileOptions,
  sensorIdsSorted,
  filters,
  defaultFilters,
  onChange
}: AlertsFiltersProps) {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);

  const isDirty = useMemo(
    () => !areAlertsFiltersEqual(filters, defaultFilters),
    [filters, defaultFilters]
  );

  const handleToggle = useCallback(() => {
    setIsOpen((v) => !v);
  }, []);

  const handleSeverityChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const sev = event.currentTarget.dataset.severity as AlertSeverity | undefined;
      if (sev !== "critical" && sev !== "warning") return;
      const checked = event.currentTarget.checked;
      const next = new Set(filters.severities);
      if (checked) next.add(sev);
      else next.delete(sev);
      onChange({ ...filters, severities: next });
    },
    [filters, onChange]
  );

  const handlePileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const pileId = event.currentTarget.dataset.pileId;
      if (!pileId) return;
      const checked = event.currentTarget.checked;
      const next = new Set(filters.pileIds);
      if (checked) next.add(pileId);
      else next.delete(pileId);
      onChange({ ...filters, pileIds: next });
    },
    [filters, onChange]
  );

  const handleSensorChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const sid = event.currentTarget.dataset.sensorId;
      if (!sid) return;
      const checked = event.currentTarget.checked;
      const next = new Set(filters.sensorIds);
      if (checked) next.add(sid);
      else next.delete(sid);
      onChange({ ...filters, sensorIds: next });
    },
    [filters, onChange]
  );

  const handleResetFilters = useCallback(() => {
    onChange({
      severities: new Set<AlertSeverity>(["critical", "warning"]),
      pileIds: new Set(pileOptions.map((p) => p.pileId)),
      sensorIds: new Set(sensorIdsSorted)
    });
  }, [onChange, pileOptions, sensorIdsSorted]);

  const handleSeveritySelectAll = useCallback(() => {
    onChange({
      ...filters,
      severities: new Set<AlertSeverity>(["critical", "warning"])
    });
  }, [filters, onChange]);

  const handleSeverityClearAll = useCallback(() => {
    onChange({ ...filters, severities: new Set<AlertSeverity>() });
  }, [filters, onChange]);

  const handlePileSelectAll = useCallback(() => {
    onChange({
      ...filters,
      pileIds: new Set(pileOptions.map((p) => p.pileId))
    });
  }, [filters, onChange, pileOptions]);

  const handlePileClearAll = useCallback(() => {
    onChange({ ...filters, pileIds: new Set<string>() });
  }, [filters, onChange]);

  const handleSensorSelectAll = useCallback(() => {
    onChange({ ...filters, sensorIds: new Set(sensorIdsSorted) });
  }, [filters, onChange, sensorIdsSorted]);

  const handleSensorClearAll = useCallback(() => {
    onChange({ ...filters, sensorIds: new Set<string>() });
  }, [filters, onChange]);

  return (
    <div className="border-border bg-card mb-4 overflow-hidden rounded-surface border shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
        <button
          type="button"
          id={`${panelId}-toggle`}
          aria-expanded={isOpen}
          aria-controls={`${panelId}-panel`}
          onClick={handleToggle}
          className="text-foreground hover:bg-background/80 -mx-1 flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-control px-2 py-1.5 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-initial"
        >
          <ListFilter className="text-muted-foreground size-4 shrink-0" aria-hidden />
          <span>Filters</span>
          {isDirty ? (
            <span className="bg-accent-soft text-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              Active
            </span>
          ) : null}
          <ChevronDown
            className={[
              "text-muted-foreground ml-auto size-4 shrink-0 transition-transform duration-300 ease-out sm:ml-1",
              isOpen ? "rotate-180" : "rotate-0"
            ].join(" ")}
            aria-hidden
          />
        </button>
        {isDirty ? (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-muted-foreground hover:text-foreground rounded-control px-2 py-1.5 text-xs font-medium underline-offset-2 hover:underline"
          >
            Reset
          </button>
        ) : null}
      </div>

      <div
        className={[
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            id={`${panelId}-panel`}
            role="region"
            aria-labelledby={`${panelId}-toggle`}
            className="bg-background/40 px-4 pt-1 pb-4"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="sr-only">Severity</legend>
                <div className="flex min-w-0 flex-col gap-2">
                  <div className={FILTER_SECTION_HEADER_CLASS_NAME}>
                    <span className={FILTER_SECTION_TITLE_CLASS_NAME}>Severity</span>
                    <FilterBulkSelect
                      ariaLabel="Severity bulk selection"
                      onSelectAll={handleSeveritySelectAll}
                      onClearAll={handleSeverityClearAll}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                      <label className={FILTER_TILE_CLASS_NAME}>
                        <input
                          type="checkbox"
                          data-severity="critical"
                          checked={filters.severities.has("critical")}
                          onChange={handleSeverityChange}
                          className="border-border accent-accent size-3.5 rounded"
                        />
                        <span
                          className={[
                            "rounded-full border px-2 py-0.5 text-xs font-medium",
                            getStatusPillToneClasses("critical")
                          ].join(" ")}
                        >
                          Critical
                        </span>
                      </label>
                      <label className={FILTER_TILE_CLASS_NAME}>
                        <input
                          type="checkbox"
                          data-severity="warning"
                          checked={filters.severities.has("warning")}
                          onChange={handleSeverityChange}
                          className="border-border accent-accent size-3.5 rounded"
                        />
                        <span
                          className={[
                            "rounded-full border px-2 py-0.5 text-xs font-medium",
                            getStatusPillToneClasses("warn")
                          ].join(" ")}
                        >
                          Warning
                        </span>
                      </label>
                  </div>
                </div>
              </fieldset>

              <FilterInsetRule className="lg:hidden" />

              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="sr-only">Location</legend>
                <div
                  className={[
                    "relative flex min-w-0 flex-col gap-2",
                    "before:hidden lg:before:pointer-events-none lg:before:absolute lg:before:-left-3",
                    "lg:before:top-3 lg:before:bottom-3 lg:before:block lg:before:w-px lg:before:bg-border",
                    "lg:before:content-['']"
                  ].join(" ")}
                >
                  <div className={FILTER_SECTION_HEADER_CLASS_NAME}>
                    <span className={FILTER_SECTION_TITLE_CLASS_NAME}>Location</span>
                    <FilterBulkSelect
                      ariaLabel="Location bulk selection"
                      onSelectAll={handlePileSelectAll}
                      onClearAll={handlePileClearAll}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {pileOptions.map(({ pileId, pileName }) => (
                        <label key={pileId} className={FILTER_TILE_CLASS_NAME}>
                          <input
                            type="checkbox"
                            data-pile-id={pileId}
                            checked={filters.pileIds.has(pileId)}
                            onChange={handlePileChange}
                            className="border-border accent-accent size-3.5 shrink-0 rounded"
                          />
                          <span className="text-foreground truncate">{pileName}</span>
                        </label>
                      ))}
                  </div>
                </div>
              </fieldset>

              <FilterInsetRule />

              <fieldset className="m-0 min-w-0 border-0 p-0 lg:col-span-2">
                <legend className="sr-only">Sensors</legend>
                <div className="flex min-w-0 flex-col gap-2">
                  <div className={FILTER_SECTION_HEADER_CLASS_NAME}>
                    <span className={FILTER_SECTION_TITLE_CLASS_NAME}>Sensors</span>
                    <FilterBulkSelect
                      ariaLabel="Sensors bulk selection"
                      onSelectAll={handleSensorSelectAll}
                      onClearAll={handleSensorClearAll}
                    />
                  </div>
                  <p className="text-muted-foreground max-w-3xl text-xs leading-relaxed">
                    Show alerts that include at least one selected sensor. Uncheck sensors to narrow the
                    list.
                  </p>
                  <div className="bg-card/45 grid max-h-36 grid-cols-4 gap-x-2 gap-y-1.5 overflow-y-auto rounded-surface p-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                      {sensorIdsSorted.map((sid) => (
                        <label
                          key={sid}
                          className="text-foreground hover:bg-card/80 flex cursor-pointer items-center gap-1.5 rounded px-1 py-0.5 font-mono text-[0.7rem] leading-none"
                        >
                          <input
                            type="checkbox"
                            data-sensor-id={sid}
                            checked={filters.sensorIds.has(sid)}
                            onChange={handleSensorChange}
                            className="border-border accent-accent size-3 shrink-0 rounded"
                          />
                          {sid}
                        </label>
                      ))}
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
