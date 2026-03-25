import { useMemo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ThemeSelect from "./components/ThemeSelect";
import { getActiveAlerts } from "./data/mockData";
import { getStatusPillToneClasses } from "./ui/statusPill";

/** Stable reference for `NavLink` `className` (not recreated each render). */
function getNavLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    "inline-flex cursor-pointer items-center gap-2 rounded-control px-3 py-1.5 text-sm no-underline transition-colors",
    "focus-visible:ring-accent focus-visible:ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    isActive
      ? "border-border bg-accent-soft text-foreground border"
      : "text-muted-foreground hover:bg-card hover:text-foreground"
  ].join(" ");
}

export default function App() {
  const alertCount = useMemo(() => getActiveAlerts().length, []);

  const alertsNavAriaLabel = useMemo(
    () => (alertCount > 0 ? `Alerts, ${alertCount} active` : "Alerts"),
    [alertCount]
  );

  return (
    <div className="text-foreground flex min-h-0 flex-1 flex-col">
      <a
        href="#main-content"
        className="focus-visible:ring-accent bg-background text-foreground border-border fixed left-4 top-4 z-50 -translate-y-20 rounded-control border px-3 py-2 text-sm font-medium opacity-0 transition-transform focus:translate-y-0 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Skip to main content
      </a>
      <header className="border-border flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b px-5 py-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2">
          <p className="font-display text-foreground m-0 shrink-0 text-2xl font-bold tracking-tight">
            agriQ Operator
          </p>
          <nav
            className="border-border flex gap-1 border-l pl-6 max-sm:w-full max-sm:border-l-0 max-sm:border-t max-sm:pt-2 max-sm:pl-0"
            aria-label="Main"
          >
            <NavLink to="/" end className={getNavLinkClassName}>
              Sites
            </NavLink>
            <NavLink to="/alerts" className={getNavLinkClassName} aria-label={alertsNavAriaLabel}>
              <span>Alerts</span>
              {alertCount > 0 ? (
                <span
                  className={[
                    "inline-flex min-w-[1.25rem] items-center justify-center rounded-full border px-1.5 py-0.5 text-xs font-medium tabular-nums",
                    getStatusPillToneClasses("critical")
                  ].join(" ")}
                  aria-hidden
                >
                  {alertCount}
                </span>
              ) : null}
            </NavLink>
          </nav>
        </div>
        <ThemeSelect />
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 scroll-mt-4 px-5 py-8 outline-none"
      >
        <Outlet />
      </main>
    </div>
  );
}
