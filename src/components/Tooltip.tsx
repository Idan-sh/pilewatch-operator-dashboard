import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import { getTooltipViewportPosition } from "../utils/tooltipPosition";
import {
  PANEL_MOTION_TRANSITION,
  REDUCED_MOTION_TRANSITION
} from "../ui/motionShared";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode
} from "react";

export type TooltipProps = {
  content: string;
  children: ReactNode;
  /** default: dotted underline (sensor values). chrome: no underline (avatar, icon controls). */
  variant?: "default" | "chrome";
};

/** Portal tooltip: hover on fine pointers; tap to toggle on touch; respects reduced motion. */
export default function Tooltip({ content, children, variant = "default" }: TooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const [canHover, setCanHover] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(hover: hover)").matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const sync = () => setCanHover(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const transition = reducedMotion ? REDUCED_MOTION_TRANSITION : PANEL_MOTION_TRANSITION;

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    const layer = layerRef.current;
    const inner = innerRef.current;
    if (!el || !layer || !inner) return;
    const { top, left, transform } = getTooltipViewportPosition(
      el.getBoundingClientRect(),
      inner.offsetWidth,
      inner.offsetHeight,
      window.innerWidth,
      window.innerHeight
    );
    layer.style.top = `${top}px`;
    layer.style.left = `${left}px`;
    inner.style.transform = transform;
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const sync = () => updatePosition();
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open || canHover) return;
    const handlePointerDown = (e: PointerEvent) => {
      const el = triggerRef.current;
      const layer = layerRef.current;
      if (!el || !layer) return;
      if (el.contains(e.target as Node) || layer.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, canHover]);

  const handleMouseEnter = useCallback(() => {
    if (canHover) setOpen(true);
  }, [canHover]);

  const handleMouseLeave = useCallback(() => {
    if (canHover) setOpen(false);
  }, [canHover]);

  const handleTriggerClick = useCallback(() => {
    if (!canHover) setOpen((o) => !o);
  }, [canHover]);

  const handleTriggerKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLSpanElement>) => {
      if (!canHover && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    },
    [canHover]
  );

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        tabIndex={canHover ? undefined : 0}
        role={canHover ? undefined : "button"}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={canHover ? undefined : open}
        aria-label={variant === "chrome" ? "User profile" : undefined}
        className={
          variant === "chrome"
            ? [
                "inline-flex shrink-0 rounded-full",
                canHover
                  ? "cursor-help"
                  : "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              ].join(" ")
            : [
                "text-foreground underline decoration-dotted decoration-border underline-offset-2",
                canHover
                  ? "cursor-help"
                  : "cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              ].join(" ")
        }
      >
        {children}
      </span>
      {createPortal(
        <AnimatePresence>
          {open ? (
            <motion.div
              key={tooltipId}
              ref={layerRef}
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none fixed z-[100]"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={transition}
            >
              <div
                ref={innerRef}
                className="border-border bg-card text-foreground max-w-[min(18rem,calc(100vw-1rem))] rounded-control border px-2.5 py-1.5 text-xs leading-snug shadow-panel"
              >
                {content}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
