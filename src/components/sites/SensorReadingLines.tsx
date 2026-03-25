import {
  getMoistureSeverity,
  getTemperatureSeverity,
  readingSeverityBandLabel,
  readingSeverityTextClass
} from "../../domain/sensorThresholds";
import type { SensorReading } from "../../types";

export function TemperatureMetricLine({ celsius }: { celsius: number }) {
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

export function MoistureMetricLine({ moisturePct }: { moisturePct: number }) {
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

/** Two stacked lines avoid bad wraps (e.g. “moisture” alone) in narrow sensor tiles. */
export default function SensorReadingLines({ reading: s }: { reading: SensorReading }) {
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
