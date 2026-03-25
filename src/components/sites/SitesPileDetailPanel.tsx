import type { PileMock } from "../../types";
import SitesSensorGrid from "./SitesSensorGrid";

export default function SitesPileDetailPanel({ pile }: { pile: PileMock }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-foreground text-xl font-medium tracking-tight">{pile.name}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Cell footprint 50m × 25m × 10m high - sensors are distributed across three depth layers.
        </p>
      </div>
      <SitesSensorGrid pile={pile} />
    </div>
  );
}
