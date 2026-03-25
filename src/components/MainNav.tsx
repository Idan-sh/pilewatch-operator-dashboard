import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const SEGMENT_TAP = { scale: 0.94 as const };
const SEGMENT_TAP_TRANSITION = { type: "spring" as const, stiffness: 520, damping: 32 };
const PILL_LAYOUT_TRANSITION = { type: "spring" as const, stiffness: 400, damping: 30 };

type MainNavProps = {
  alertCount: number;
  alertsNavAriaLabel: string;
};

export default function MainNav({ alertCount, alertsNavAriaLabel }: MainNavProps) {
  return (
    <nav
      className="border-border flex flex-wrap items-center gap-3 border-l pl-6 max-sm:w-full max-sm:border-l-0 max-sm:border-t max-sm:pt-2 max-sm:pl-0"
      aria-label="Main"
    >
      <div className="inline-flex flex-wrap items-center gap-3">
        <motion.div className="inline-block" whileTap={SEGMENT_TAP} transition={SEGMENT_TAP_TRANSITION}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [
                "group relative z-10 inline-flex min-h-[2.5rem] items-center rounded-control px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-[2.75rem]",
                isActive
                  ? "text-foreground"
                  : "text-foreground hover:bg-accent-soft"
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <motion.div
                    layoutId="main-nav-active"
                    className="border-border bg-background group-hover:bg-accent-soft absolute inset-0 rounded-control border transition-colors duration-150"
                    transition={PILL_LAYOUT_TRANSITION}
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-10">Sites</span>
              </>
            )}
          </NavLink>
        </motion.div>

        <motion.div className="inline-block" whileTap={SEGMENT_TAP} transition={SEGMENT_TAP_TRANSITION}>
          <NavLink
            to="/alerts"
            aria-label={alertsNavAriaLabel}
            className={({ isActive }) =>
              [
                "group relative z-10 inline-flex min-h-[2.5rem] items-center gap-2 rounded-control px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-[2.75rem]",
                isActive
                  ? "text-foreground"
                  : "text-foreground hover:bg-accent-soft"
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <motion.div
                    layoutId="main-nav-active"
                    className="border-border bg-background group-hover:bg-accent-soft absolute inset-0 rounded-control border transition-colors duration-150"
                    transition={PILL_LAYOUT_TRANSITION}
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-10 flex items-center gap-2">
                  <span>Alerts</span>
                  {alertCount > 0 ? (
                    <span
                      className="border-border bg-card text-muted-foreground inline-flex min-w-[1.25rem] items-center justify-center rounded-full border px-1.5 py-0.5 text-xs font-medium tabular-nums"
                      aria-hidden
                    >
                      {alertCount}
                    </span>
                  ) : null}
                </span>
              </>
            )}
          </NavLink>
        </motion.div>
      </div>
    </nav>
  );
}
