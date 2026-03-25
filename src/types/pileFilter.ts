import type { PileStatus } from "./pile";

/** `all` or a single pile status to show in the list. */
export type PileStatusFilter = "all" | PileStatus;

export const PILE_STATUS_FILTER_OPTIONS: { id: PileStatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Critical", label: "Critical" },
  { id: "Warning", label: "Warning" },
  { id: "OK", label: "OK" }
];
