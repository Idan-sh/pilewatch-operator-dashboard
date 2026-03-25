import { useCallback, type MouseEvent } from "react";
import {
  type PileMock,
  type PileStatus,
  type PileStatusFilter,
  PILE_STATUS_FILTER_OPTIONS
} from "../../types";
import StatusStripePill from "../StatusStripePill";
import { pileStatusToTone } from "../../ui/statusPill";
import { MoistureMetricLine, TemperatureMetricLine } from "./SensorReadingLines";

type SitesPileListProps = {
  piles: PileMock[];
  selectedId: string;
  onPileSelect: (pileId: string) => void;
  statusFilter: PileStatusFilter;
  onStatusFilterChange: (next: PileStatusFilter) => void;
};

export default function SitesPileList({
  piles,
  selectedId,
  onPileSelect,
  statusFilter,
  onStatusFilterChange
}: SitesPileListProps) {
  const handleFilterButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const next = event.currentTarget.dataset.filter as PileStatusFilter | undefined;
      if (next) onStatusFilterChange(next);
    },
    [onStatusFilterChange]
  );

  const handlePileListClick = useCallback(
    (event: MouseEvent<HTMLUListElement>) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
        "button[data-pile-id]"
      );
      const pileId = button?.dataset.pileId;
      if (pileId) onPileSelect(pileId);
    },
    [onPileSelect]
  );

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-foreground mb-0 text-base font-medium">Storage piles</h2>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter piles by status"
      >
        {PILE_STATUS_FILTER_OPTIONS.map((opt) => {
          const active = statusFilter === opt.id;
          const isStatusChip = opt.id !== "all";
          return (
            <button
              key={opt.id}
              type="button"
              data-filter={opt.id}
              onClick={handleFilterButtonClick}
              aria-pressed={active}
              className={[
                "inline-flex text-xs font-medium transition-colors",
                "focus-visible:ring-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isStatusChip
                  ? [
                      "rounded-surface border-0 bg-transparent p-0",
                      active
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                        : "hover:opacity-90"
                    ].join(" ")
                  : [
                      active
                        ? "border-border rounded-surface border bg-card px-2.5 py-1.5 text-foreground ring-1 ring-border min-h-[2rem]"
                        : "border-border rounded-surface border bg-background px-2.5 py-1.5 text-muted-foreground hover:bg-card hover:text-foreground min-h-[2rem]"
                    ].join(" ")
              ].join(" ")}
            >
              {isStatusChip ? (
                <StatusStripePill tone={pileStatusToTone(opt.id as PileStatus)} variant="filter">
                  {opt.label}
                </StatusStripePill>
              ) : (
                opt.label
              )}
            </button>
          );
        })}
      </div>
      {piles.length === 0 ? (
        <p className="text-muted-foreground m-0 text-sm">No piles match this filter.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0" onClick={handlePileListClick}>
          {piles.map((p) => {
            const selected = p.id === selectedId;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  data-pile-id={p.id}
                  aria-pressed={selected}
                  className={[
                    "border-border w-full rounded-surface border px-4 py-3 text-left",
                    "focus-visible:ring-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    selected
                      ? "border-border bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                      : "border-border bg-background hover:bg-card hover:transition-colors"
                  ].join(" ")}
                >
                  <div className="text-foreground flex items-center justify-between gap-2 font-medium">
                    {p.name}
                    <StatusStripePill tone={pileStatusToTone(p.status)}>{p.status}</StatusStripePill>
                  </div>
                  <div className="mt-1 text-sm">
                    <div className="text-muted-foreground mb-0.5 text-xs">Most sensors</div>
                    <div className="space-y-0.5">
                      <TemperatureMetricLine celsius={p.aggregateTempC} />
                      <MoistureMetricLine moisturePct={p.aggregateMoisturePct} />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
