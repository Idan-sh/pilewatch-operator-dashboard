const GAP = 8;
const MARGIN = 8;

export type TooltipViewportPosition = {
  top: number;
  left: number;
  transform: string;
};

/**
 * Positions a fixed tooltip layer whose inner node is centered with translateX(-50%)
 * (and optionally translateY(-100%) when flipped above the trigger).
 */
export function getTooltipViewportPosition(
  triggerRect: DOMRectReadOnly,
  tooltipWidth: number,
  tooltipHeight: number,
  viewportWidth: number,
  viewportHeight: number
): TooltipViewportPosition {
  const th = tooltipHeight || 56;
  const halfW = tooltipWidth > 0 ? tooltipWidth / 2 : 0;

  let top = triggerRect.bottom + GAP;
  let left = triggerRect.left + triggerRect.width / 2;
  let transform: TooltipViewportPosition["transform"] = "translateX(-50%)";

  if (top + th > viewportHeight - MARGIN && triggerRect.top > th + GAP) {
    top = triggerRect.top - GAP;
    transform = "translate(-50%, -100%)";
  }

  if (halfW > 0) {
    left = Math.max(
      MARGIN + halfW,
      Math.min(left, viewportWidth - MARGIN - halfW)
    );
  }

  if (transform === "translateX(-50%)") {
    if (top + th > viewportHeight - MARGIN) {
      top = Math.max(MARGIN, viewportHeight - MARGIN - th);
    }
  } else {
    const topEdge = top - th;
    if (topEdge < MARGIN) {
      top = MARGIN + th;
    }
  }

  return { top, left, transform };
}
