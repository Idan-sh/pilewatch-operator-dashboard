import { useCallback, useId, useMemo, useState } from "react";
import DropdownSelect from "../components/DropdownSelect";
import SitesPileDetailPanel from "../components/sites/SitesPileDetailPanel";
import SitesPileList from "../components/sites/SitesPileList";
import { sortPilesByStatusThenName } from "../domain/pileOrdering";
import { getPileById, getPilesForSite, getSiteById, getSites } from "../data/mockData";
import type { PileStatusFilter } from "../types";

export default function SitesPage() {
  const sites = useMemo(() => getSites(), []);

  const [selectedSiteId, setSelectedSiteId] = useState<string>(() => getSites()[0]?.id ?? "");

  const sortedPiles = useMemo(() => {
    if (!selectedSiteId) return [];
    return sortPilesByStatusThenName(getPilesForSite(selectedSiteId));
  }, [selectedSiteId]);

  const [statusFilter, setStatusFilter] = useState<PileStatusFilter>("all");
  const visiblePiles = useMemo(() => {
    if (statusFilter === "all") return sortedPiles;
    return sortedPiles.filter((p) => p.status === statusFilter);
  }, [sortedPiles, statusFilter]);

  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const sid = getSites()[0]?.id;
    if (!sid) return null;
    const sorted = sortPilesByStatusThenName(getPilesForSite(sid));
    return sorted[0]?.id ?? null;
  });

  const selectedSite = useMemo(
    () => (selectedSiteId ? getSiteById(selectedSiteId) : undefined),
    [selectedSiteId]
  );

  const handleSiteSelect = useCallback(
    (siteId: string) => {
      setSelectedSiteId(siteId);
      const sorted = sortPilesByStatusThenName(getPilesForSite(siteId));
      const nextVisible =
        statusFilter === "all" ? sorted : sorted.filter((p) => p.status === statusFilter);
      setSelectedId((prev) => {
        if (prev != null && nextVisible.some((p) => p.id === prev)) return prev;
        return nextVisible[0]?.id ?? null;
      });
    },
    [statusFilter]
  );

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
  const siteSelectId = useId();

  const siteOptions = useMemo(
    () => sites.map((s) => ({ value: s.id, label: s.name })),
    [sites]
  );

  return (
    <div>
      <h1 className="text-foreground mb-2 text-2xl font-semibold tracking-tight">Sites</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl text-base">
        Each storage site has one cell with wheat piles. Select a pile to see all thirty sensors
        (bottom, middle, top). Warning (amber) and critical (red) tints mark sensors with elevated or
        faulty health.
      </p>
      <p className="text-muted-foreground mb-8 max-w-2xl border-border border-l-2 pl-3 text-xs leading-relaxed">
        <span className="text-foreground font-medium">Thresholds</span> — Temperature and moisture
        each use OK / warning / critical bands from the assignment rules. Stronger type weight on a
        value means a higher band; hover a number for the exact band name. Problem sensors are called
        out in the grid copy.
      </p>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="mb-3">
            <DropdownSelect
              id={siteSelectId}
              label="Storage site"
              value={selectedSiteId}
              options={siteOptions}
              onChange={handleSiteSelect}
            />
          </div>
          {selectedSite?.locationLine ? (
            <p className="text-muted-foreground mb-3 text-sm">{selectedSite.locationLine}</p>
          ) : null}
          <SitesPileList
            piles={visiblePiles}
            selectedId={listSelectedId}
            onPileSelect={handlePileSelect}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </div>
        <div className="lg:col-span-7">
          {selected && selectedSite ? (
            <SitesPileDetailPanel pile={selected} site={selectedSite} />
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
