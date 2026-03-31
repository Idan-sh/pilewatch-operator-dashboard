import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { AlertTriangle, OctagonAlert } from "lucide-react";
import type { StatusPillTone } from "../ui/statusPill";
import { statusStripePillClassName } from "../ui/statusPill";

export type StatusStripePillProps = {
  tone: StatusPillTone;
  variant?: "badge" | "filter" | "chip";
  showIcon?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

/**
 * Shared status pill used across filters, badges, and sensor chips.
 */
export default function StatusStripePill({
  tone,
  variant = "badge",
  showIcon,
  className,
  children,
  ...rest
}: StatusStripePillProps) {
  const effectiveShowIcon =
    showIcon ?? (variant !== "filter" && (tone === "critical" || tone === "warn"));

  const icon =
    tone === "critical" ? (
      <OctagonAlert className="size-3.5 shrink-0" aria-hidden />
    ) : tone === "warn" ? (
      <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
    ) : null;

  return (
    <span
      className={[statusStripePillClassName(tone, variant), className].filter(Boolean).join(" ")}
      {...rest}
    >
      {effectiveShowIcon ? icon : null}
      {children}
    </span>
  );
}
