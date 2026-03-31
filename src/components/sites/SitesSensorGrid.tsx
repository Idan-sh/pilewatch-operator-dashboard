import { AlertTriangle, OctagonAlert } from "lucide-react";
import { useMemo } from "react";
import { getSensorTileSeverity } from "../../domain/sensorThresholds";
import type { PileMock, SensorLayer, SensorReading } from "../../types";
import SensorReadingLines from "./SensorReadingLines";

/** Inset stripe from threshold bands (same logic as tooltips), not mock `health` alone. */
function getSensorTileClassName(s: SensorReading): string {
  const base = [
    "min-w-0 rounded-surface border bg-card p-3 text-left text-sm transition-colors",
    "border-border"
  ].join(" ");
  switch (getSensorTileSeverity(s)) {
    case "critical":
      return [
        base,
        "bg-status-critical/10",
        "border-status-critical/35",
        "ring-1 ring-status-critical/20",
        "shadow-[inset_4px_0_0_0_var(--color-status-critical)]"
      ].join(" ");
    case "warning":
      return [
        base,
        "bg-status-warn/10",
        "border-status-warn/35",
        "ring-1 ring-status-warn/20",
        "shadow-[inset_4px_0_0_0_var(--color-status-warn)]"
      ].join(" ");
    default:
      return `${base}`;
  }
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
            {byLayer[layer].map((s) => {
              const sev = getSensorTileSeverity(s);
              const icon =
                sev === "critical" ? (
                  <OctagonAlert className="text-status-critical size-4" aria-hidden />
                ) : sev === "warning" ? (
                  <AlertTriangle className="text-status-warn size-4" aria-hidden />
                ) : null;

              return (
                <div key={s.id} className={getSensorTileClassName(s)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-foreground font-mono text-xs font-semibold">{s.id}</div>
                    {icon ? (
                      <div
                        className="shrink-0"
                        aria-label={sev === "critical" ? "Critical sensor" : "Warning sensor"}
                        title={sev === "critical" ? "Critical" : "Warning"}
                      >
                        {icon}
                      </div>
                    ) : null}
                  </div>
                <div className="text-xs mt-1 min-w-0">
                  <SensorReadingLines reading={s} />
                </div>
              </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
