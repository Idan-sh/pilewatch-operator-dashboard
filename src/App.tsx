import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import AppFooter from "./components/AppFooter";
import MainNav from "./components/MainNav";
import MobileNavMenu from "./components/MobileNavMenu";
import ThemeSelect from "./components/ThemeSelect";
import UserAvatarPlaceholder from "./components/UserAvatarPlaceholder";
import { getActiveAlerts } from "./data/mockData";

export default function App() {
  const { pathname } = useLocation();
  const alertCount = useMemo(() => getActiveAlerts().length, []);

  const alertsNavAriaLabel = useMemo(
    () => (alertCount > 0 ? `Alerts, ${alertCount} active` : "Alerts"),
    [alertCount]
  );

  const reducedMotion = useReducedMotion();
  const [isHidden, setIsHidden] = useState(false);
  const effectiveHidden = reducedMotion ? false : isHidden;

  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(72);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      setHeaderHeight(h);
      document.documentElement.style.setProperty("--app-header-height", `${h}px`);
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reset scroll instantly when navigating between pages.
  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  const { scrollY } = useScroll({ container: scrollContainerRef, axis: "y" });
  useMotionValueEvent(scrollY, "change", (current) => {
    if (reducedMotion) return;

    const previous = scrollY.getPrevious() ?? 0;

    // Hide when scrolling down past a threshold; show when scrolling up.
    if (current > previous && current > 150) setIsHidden(true);
    else if (current < previous) setIsHidden(false);
  });

  return (
    <div className="text-foreground flex min-h-0 flex-1 flex-col">
      <a
        href="#main-content"
        className="focus-visible:ring-accent bg-background text-foreground border-border fixed left-4 top-4 z-[60] -translate-y-20 rounded-control border px-3 py-2 text-sm font-medium opacity-0 transition-transform focus:translate-y-0 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Skip to main content
      </a>
      <motion.header
        ref={headerRef}
        aria-hidden={effectiveHidden}
        className="fixed left-0 right-0 top-0 z-[55] border-border bg-background border-b"
        initial={false}
        animate={{
          y: effectiveHidden ? "-100%" : "0%",
          opacity: effectiveHidden ? 0 : 1
        }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
        style={{ pointerEvents: effectiveHidden ? "none" : "auto" }}
      >
        {/* Desktop: keep original single-row header layout */}
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3 hidden md:flex">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5">
            <div className="flex min-w-0 shrink-0 flex-col gap-0.5">
              <p className="font-display text-foreground m-0 text-xl font-bold tracking-tight sm:text-[1.375rem]">
                Pilewatch Operator
              </p>
            </div>
            <MainNav alertCount={alertCount} alertsNavAriaLabel={alertsNavAriaLabel} />
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <UserAvatarPlaceholder />
            <ThemeSelect />
          </div>
        </div>

        {/* Mobile: title on top, hamburger + controls on second row */}
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-3 sm:gap-2.5 md:hidden">
          <div className="min-w-0">
            <p className="font-display text-foreground m-0 text-xl font-bold tracking-tight sm:text-[1.375rem]">
              Pilewatch Operator
            </p>
          </div>
          <div className="flex min-h-9 min-w-0 flex-nowrap items-center justify-between gap-x-3">
            <MobileNavMenu
              key={pathname}
              alertCount={alertCount}
              alertsNavAriaLabel={alertsNavAriaLabel}
            />
            <div className="flex shrink-0 items-center gap-2">
              <UserAvatarPlaceholder />
              <ThemeSelect />
            </div>
          </div>
        </div>
      </motion.header>

      <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="flex min-h-full flex-col" style={{ paddingTop: headerHeight }}>
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
