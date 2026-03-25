import { useMemo } from "react";
import type { PileMock, SensorLayer, SensorReading } from "../../types";
import SensorReadingLines from "./SensorReadingLines";

/** Inset stripe (not border-l) keeps the same inner width as normal tiles so metric lines don’t wrap. */
function getSensorTileClassName(s: SensorReading): string {
  const base =
    "border-border min-w-0 rounded-surface border bg-card p-3 text-left text-sm transition-colors";
  if (s.health === "faulty") {
    return `${base} bg-status-critical/10 shadow-[inset_4px_0_0_0_var(--color-status-critical)]`;
  }
  if (s.health === "elevated") {
    return `${base} bg-status-warn/10 shadow-[inset_4px_0_0_0_var(--color-status-warn)]`;
  }
  return `${base}`;
}

const LAYER_ORDER: SensorLayer[] = ["bottom", "middle", "top"];
const LAYER_LABEL: Record<SensorLayer, string> = {
  bottom: "Bottom layer (S01-S10)",
  middle: "Middle layer (S11-S20)",
  top: "Top layer (S21-S30)"
};

export default function SitesSensorGrid({ pile }: { pile: PileMock }) {
  const byLayer = useMemo(() => {
    const map: Record<SensorLayer, SensorReading[]> = {
      bottom: [],
      middle: [],
      top: []
    };
    for (const s of pile.sensors) {
      map[s.layer].push(s);
    }
    return map;
  }, [pile.sensors]);

  return (
    <div className="flex flex-col gap-8">
      {LAYER_ORDER.map((layer) => (
        <section key={layer} aria-labelledby={`layer-${pile.id}-${layer}`}>
          <h3
            id={`layer-${pile.id}-${layer}`}
            className="text-foreground mb-3 text-base font-medium"
          >
            {LAYER_LABEL[layer]}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {byLayer[layer].map((s) => (
              <div key={s.id} className={getSensorTileClassName(s)}>
                <div className="text-foreground font-mono text-xs font-semibold">{s.id}</div>
                <div className="text-xs mt-1 min-w-0">
                  <SensorReadingLines reading={s} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
