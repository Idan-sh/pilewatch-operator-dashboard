import { useCallback, useMemo, useState, type MouseEvent } from "react";
import {
  getMoistureSeverity,
  getTemperatureSeverity,
  readingSeverityBandLabel,
  readingSeverityTextClass
} from "../domain/sensorThresholds";
import { getPileById, getPiles } from "../data/mockData";
import type { PileMock, PileStatus, SensorLayer, SensorReading } from "../types";

function TemperatureMetricLine({ celsius }: { celsius: number }) {
  const severity = getTemperatureSeverity(celsius);
  return (
    <div
      className={`tabular-nums ${readingSeverityTextClass(severity)}`}
      title={`${celsius}°C - ${readingSeverityBandLabel(severity)} (temperature)`}
    >
      {celsius}°C
    </div>
  );
}

function MoistureMetricLine({ moisturePct }: { moisturePct: number }) {
  const severity = getMoistureSeverity(moisturePct);
  return (
    <div
      className={`tabular-nums ${readingSeverityTextClass(severity)}`}
      title={`${moisturePct}% moisture - ${readingSeverityBandLabel(severity)} (moisture)`}
    >
      {moisturePct}% moisture
    </div>
  );
}

function statusBadgeClass(status: PileStatus): string {
  switch (status) {
    case "OK":
      return "bg-status-ok/15 text-status-ok border-status-ok/40";
    case "Warning":
      return "bg-status-warn/15 text-status-warn border-status-warn/40";
    case "Critical":
      return "bg-status-critical/15 text-status-critical border-status-critical/40";
    default:
      return "border-border text-muted-foreground";
  }
}

/** Two stacked lines avoid bad wraps (e.g. “moisture” alone) in narrow sensor tiles. */
function SensorReadingLines({ reading: s }: { reading: SensorReading }) {
  if (s.health === "faulty") {
    return (
      <span className="text-status-critical font-medium">
        Erratic readings - sensor may be faulty
      </span>
    );
  }
  if (s.temperatureC == null || s.moisturePct == null) {
    return <span className="text-muted-foreground">No reading</span>;
  }
  return (
    <div className="space-y-0.5">
      <TemperatureMetricLine celsius={s.temperatureC} />
      <MoistureMetricLine moisturePct={s.moisturePct} />
    </div>
  );
}

function sensorCardClass(s: SensorReading): string {
  const base = "border-border rounded-lg border p-3 text-left text-sm transition-colors";
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

type PileListProps = {
  piles: PileMock[];
  selectedId: string;
  onPileSelect: (pileId: string) => void;
};

function PileList({ piles, selectedId, onPileSelect }: PileListProps) {
  const handlePileListClick = useCallback(
    (event: MouseEvent<HTMLUListElement>) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
        "button[data-pile-id]"
      );
      const pileId = button?.dataset.pileId;
      if (pileId) onPileSelect(pileId);
    },
    [onPileSelect]
  );

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-foreground mb-1 text-base font-medium">Storage piles</h2>
      <ul className="m-0 flex list-none flex-col gap-2 p-0" onClick={handlePileListClick}>
        {piles.map((p) => {
          const selected = p.id === selectedId;
          return (
            <li key={p.id}>
              <button
                type="button"
                data-pile-id={p.id}
                aria-pressed={selected}
                className={[
                  "border-border w-full rounded-lg border px-4 py-3 text-left transition-colors",
                  "focus-visible:ring-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected
                    ? "border-accent bg-accent-soft ring-accent/30 ring-1"
                    : "bg-background hover:bg-card"
                ].join(" ")}
              >
                <div className="text-foreground flex items-center justify-between gap-2 font-medium">
                  {p.name}
                  <span
                    className={[
                      "rounded-full border px-2 py-0.5 text-xs font-medium",
                      statusBadgeClass(p.status)
                    ].join(" ")}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="mt-1 text-sm">
                  <div className="text-muted-foreground mb-0.5 text-xs">Most sensors</div>
                  <div className="space-y-0.5">
                    <TemperatureMetricLine celsius={p.aggregateTempC} />
                    <MoistureMetricLine moisturePct={p.aggregateMoisturePct} />
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SensorGrid({ pile }: { pile: PileMock }) {
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
              <div key={s.id} className={sensorCardClass(s)}>
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

export default function SitesPage() {
  const piles = useMemo(() => getPiles(), []);
  const [selectedId, setSelectedId] = useState(piles[0]?.id ?? "");

  const handlePileSelect = useCallback((pileId: string) => {
    setSelectedId(pileId);
  }, []);

  const selected = useMemo(() => (selectedId ? getPileById(selectedId) : undefined), [selectedId]);

  return (
    <div>
      <h1 className="text-foreground mb-2">Sites</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl text-base">
        Each cell holds four wheat piles. Select a pile to see all thirty sensor balls (bottom,
        middle, top). Highlighted tiles flag sensors that need attention.
      </p>
      <p className="text-muted-foreground mb-8 max-w-2xl border-border border-l-2 pl-3 text-xs leading-relaxed">
        <span className="text-foreground font-medium">Reading colors</span> - Each value uses the
        rule for that metric. Temperature:{" "}
        <span className="text-status-ok font-medium">OK below 30°C</span>,{" "}
        <span className="text-status-warn font-medium">warning 30-45°C</span>,{" "}
        <span className="text-status-critical font-medium">critical above 45°C</span>. Moisture:{" "}
        <span className="text-status-ok font-medium">OK below 14%</span>,{" "}
        <span className="text-status-warn font-medium">warning 14-17%</span>,{" "}
        <span className="text-status-critical font-medium">critical above 17%</span>. Hover a value
        for the band name.
      </p>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <PileList piles={piles} selectedId={selectedId} onPileSelect={handlePileSelect} />
        </div>
        <div className="lg:col-span-7">
          {selected ? (
            <div>
              <div className="mb-6">
                <h2 className="text-foreground text-xl font-medium tracking-tight">
                  {selected.name}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Cell footprint 50m × 25m × 10m high - sensors are distributed across three depth
                  layers.
                </p>
              </div>
              <SensorGrid pile={selected} />
            </div>
          ) : (
            <p className="text-muted-foreground">Select a pile to view sensors.</p>
          )}
        </div>
      </div>
    </div>
  );
}
