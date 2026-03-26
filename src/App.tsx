import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import AppFooter from "./components/AppFooter";
import MainNav from "./components/MainNav";
import ThemeSelect from "./components/ThemeSelect";
import UserAvatarPlaceholder from "./components/UserAvatarPlaceholder";
import { getActiveAlerts } from "./data/mockData";

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
        className="focus-visible:ring-accent bg-background text-foreground border-border fixed left-4 top-4 z-[60] -translate-y-20 rounded-control border px-3 py-2 text-sm font-medium opacity-0 transition-transform focus:translate-y-0 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Skip to main content
      </a>
      <header className="border-border bg-background z-40 shrink-0 border-b">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5">
            <p className="font-display text-foreground m-0 shrink-0 text-xl font-bold tracking-tight sm:text-[1.375rem]">
              agriQ Operator
            </p>
            <MainNav alertCount={alertCount} alertsNavAriaLabel={alertsNavAriaLabel} />
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <UserAvatarPlaceholder />
            <ThemeSelect />
          </div>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="flex min-h-full flex-col">
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-6xl flex-1 scroll-mt-24 px-5 py-8 outline-none max-sm:scroll-mt-36"
          >
            <Outlet />
          </main>
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
