import type { PileMock, SiteMock } from "../../types";
import SitesSensorGrid from "./SitesSensorGrid";

type SitesPileDetailPanelProps = {
  pile: PileMock;
  site: SiteMock;
};

export default function SitesPileDetailPanel({ pile, site }: SitesPileDetailPanelProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-foreground text-xl font-medium tracking-tight">{pile.name}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Cell footprint {site.cellFootprintLabel} — sensors are distributed across three depth layers.
        </p>
      </div>
      <SitesSensorGrid pile={pile} />
    </div>
  );
}
