import { useMemo } from "react";
import AlertsPanel from "../components/alerts/AlertsPanel";
import { getActiveAlerts } from "../data/mockData";

export default function AlertsPage() {
  const alerts = useMemo(() => getActiveAlerts(), []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-relaxed">
            Open issues across piles. Sort columns from the table headers, filter by severity, location,
            or sensors, then expand next steps when you are ready to act.
          </p>
        </div>
      </div>

      <AlertsPanel alerts={alerts} />
    </div>
  );
}
