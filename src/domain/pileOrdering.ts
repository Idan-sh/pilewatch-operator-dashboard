import type { PileMock, PileStatus } from "../types";

/** Lower rank sorts first: Critical, then Warning, then OK. */
export function pileStatusSortRank(status: PileStatus): number {
  switch (status) {
    case "Critical":
      return 0;
    case "Warning":
      return 1;
    case "OK":
      return 2;
  }
}

/** Critical first, then Warning, then OK; within the same status, alphabetical by name. */
export function comparePilesByStatusThenName(a: PileMock, b: PileMock): number {
  const byStatus = pileStatusSortRank(a.status) - pileStatusSortRank(b.status);
  if (byStatus !== 0) return byStatus;
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

export function sortPilesByStatusThenName(piles: PileMock[]): PileMock[] {
  return [...piles].sort(comparePilesByStatusThenName);
}
