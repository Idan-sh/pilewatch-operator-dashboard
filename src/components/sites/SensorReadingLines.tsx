import {
  getMoistureSeverity,
  getTemperatureSeverity,
  readingSeverityLevelLabel,
  readingSeverityMutedTextClass
} from "../../domain/sensorThresholds";
import type { SensorReading } from "../../types";
import Tooltip from "../Tooltip";

export function TemperatureMetricLine({ celsius }: { celsius: number }) {
  const severity = getTemperatureSeverity(celsius);
  const tip = `${celsius}°C — ${readingSeverityLevelLabel(severity)} (temperature)`;
  return (
    <div className={`min-h-5 leading-5 tabular-nums ${readingSeverityMutedTextClass(severity)}`}>
      <Tooltip content={tip}>
        {celsius}°C
      </Tooltip>
    </div>
  );
}

export function MoistureMetricLine({ moisturePct }: { moisturePct: number }) {
  const severity = getMoistureSeverity(moisturePct);
  const tip = `${moisturePct}% moisture — ${readingSeverityLevelLabel(severity)} (moisture)`;
  return (
    <div className={`min-h-5 leading-5 tabular-nums ${readingSeverityMutedTextClass(severity)}`}>
      <Tooltip content={tip}>
        {moisturePct}% moisture
      </Tooltip>
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
    <div className="flex min-w-0 flex-col gap-0.5 break-words">
      <TemperatureMetricLine celsius={s.temperatureC} />
      <MoistureMetricLine moisturePct={s.moisturePct} />
    </div>
  );
}
