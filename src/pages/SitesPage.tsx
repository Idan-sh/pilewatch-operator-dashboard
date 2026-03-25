import { useCallback, useMemo, useState } from "react";
import SitesPileDetailPanel from "../components/sites/SitesPileDetailPanel";
import SitesPileList from "../components/sites/SitesPileList";
import { sortPilesByStatusThenName } from "../domain/pileOrdering";
import { getPileById, getPiles } from "../data/mockData";
import type { PileStatusFilter } from "../types";

export default function SitesPage() {
  const allPiles = useMemo(() => getPiles(), []);
  const sortedPiles = useMemo(() => sortPilesByStatusThenName(allPiles), [allPiles]);

  const [statusFilter, setStatusFilter] = useState<PileStatusFilter>("all");
  const visiblePiles = useMemo(() => {
    if (statusFilter === "all") return sortedPiles;
    return sortedPiles.filter((p) => p.status === statusFilter);
  }, [sortedPiles, statusFilter]);

  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const sorted = sortPilesByStatusThenName(getPiles());
    return sorted[0]?.id ?? null;
  });

  const handlePileSelect = useCallback((pileId: string) => {
    setSelectedId(pileId);
  }, []);

  /** One commit: new filter + selection that stays on the same pile when possible, else first visible. */
  const handleStatusFilterChange = useCallback(
    (next: PileStatusFilter) => {
      const nextVisible =
        next === "all" ? sortedPiles : sortedPiles.filter((p) => p.status === next);
      setStatusFilter(next);
      setSelectedId((prev) => {
        if (prev != null && nextVisible.some((p) => p.id === prev)) return prev;
        return nextVisible[0]?.id ?? null;
      });
    },
    [sortedPiles]
  );

  const selected = useMemo(
    () => (selectedId ? getPileById(selectedId) : undefined),
    [selectedId]
  );

  const listSelectedId = selectedId ?? "";

  return (
    <div>
      <h1 className="text-foreground mb-2 text-2xl font-semibold tracking-tight">Sites</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl text-base">
        Each cell holds four wheat piles. Select a pile to see all thirty sensor balls (bottom,
        middle, top). Highlighted tiles flag sensors that need attention.
      </p>
      <p className="text-muted-foreground mb-8 max-w-2xl border-border border-l-2 pl-3 text-xs leading-relaxed">
        <span className="text-foreground font-medium">Reading colors</span> - Each value uses the
        rule for that metric. Temperature:{" "}
        <span className="text-status-ok font-medium">OK below 30°C</span>,{" "}
        <span className="text-status-warn font-medium">warning 30-45°C</span>,{" "}
        <span className="text-status-critical font-medium">critical above 45°C</span>. Moisture:{" "}
        <span className="text-status-ok font-medium">OK below 14%</span>,{" "}
        <span className="text-status-warn font-medium">warning 14-17%</span>,{" "}
        <span className="text-status-critical font-medium">critical above 17%</span>. Hover a value
        for the band name.
      </p>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SitesPileList
            piles={visiblePiles}
            selectedId={listSelectedId}
            onPileSelect={handlePileSelect}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </div>
        <div className="lg:col-span-7">
          {selected ? (
            <SitesPileDetailPanel pile={selected} />
          ) : visiblePiles.length === 0 ? (
            <p className="text-muted-foreground">No piles match this filter.</p>
          ) : (
            <p className="text-muted-foreground">Select a pile to view sensors.</p>
          )}
        </div>
      </div>
    </div>
  );
}
