import { useMemo } from "react";
import type { PileMock, SensorLayer, SensorReading } from "../../types";
import SensorReadingLines from "./SensorReadingLines";

function getSensorTileClassName(s: SensorReading): string {
  const base = "border-border rounded-surface border p-3 text-left text-sm transition-colors";
  if (s.health === "faulty") {
    return `${base} border-status-critical/60 bg-status-critical/10`;
  }
  if (s.health === "elevated") {
    return `${base} border-status-warn/60 bg-status-warn/10`;
  }
  return `${base} bg-card`;
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
                <div className="mt-1 text-xs leading-snug">
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
