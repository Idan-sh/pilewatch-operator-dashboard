import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode
} from "react";

/** Fade + slight scale (common popover/tooltip pattern); Material “standard” easing, ~150ms. */
const transition = { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const };

export type TooltipProps = {
  content: string;
  children: ReactNode;
};

/** Portal tooltip; position via refs so scroll/resize does not replace the `motion` node. */
export default function Tooltip({ content, children }: TooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    const layer = layerRef.current;
    const inner = innerRef.current;
    if (!el || !layer || !inner) return;
    const r = el.getBoundingClientRect();
    const gap = 8;
    const margin = 8;
    const estHeight = 56;
    let top = r.bottom + gap;
    let left = r.left + r.width / 2;
    let transform = "translateX(-50%)";

    if (top + estHeight > window.innerHeight - margin && r.top > estHeight + gap) {
      top = r.top - gap;
      transform = "translate(-50%, -100%)";
    }

    left = Math.max(margin, Math.min(left, window.innerWidth - margin));

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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleMouseEnter = useCallback(() => setOpen(true), []);
  const handleMouseLeave = useCallback(() => setOpen(false), []);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-describedby={open ? tooltipId : undefined}
        className="text-foreground cursor-help underline decoration-dotted decoration-border underline-offset-2"
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
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
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
