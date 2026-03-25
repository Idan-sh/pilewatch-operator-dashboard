/**
 * Task 2 mock data - values from the agriQ take-home PDF (Emek North/South/East/West).
 */

import type { OperatorAlert, PileMock, SensorLayer, SensorReading, SiteMock } from "../types";

function layerForIndex(i: number): SensorLayer {
  if (i <= 10) return "bottom";
  if (i <= 20) return "middle";
  return "top";
}

type Override = { temperatureC: number; moisturePct: number } | "faulty";

function buildSensors(
  baseTemp: number,
  baseMoisture: number,
  overrides: Partial<Record<number, Override>>
): SensorReading[] {
  const out: SensorReading[] = [];
  for (let i = 1; i <= 30; i++) {
    const id = `S${String(i).padStart(2, "0")}`;
    const layer = layerForIndex(i);
    const o = overrides[i];
    if (o === "faulty") {
      out.push({
        id,
        layer,
        temperatureC: null,
        moisturePct: null,
        health: "faulty"
      });
      continue;
    }
    if (o) {
      out.push({
        id,
        layer,
        temperatureC: o.temperatureC,
        moisturePct: o.moisturePct,
        health: "elevated"
      });
      continue;
    }
    out.push({
      id,
      layer,
      temperatureC: baseTemp,
      moisturePct: baseMoisture,
      health: "normal"
    });
  }
  return out;
}

const EMEK_HEFER_HARISH_7_ID = "emek-hefer-harish-7";

/** PDF: Emek North OK - most sensors 21°C / 12.5%; no problem sensors */
const emekNorth: PileMock = {
  id: "emek-north",
  siteId: EMEK_HEFER_HARISH_7_ID,
  name: "Emek North",
  status: "OK",
  aggregateTempC: 21,
  aggregateMoisturePct: 12.5,
  sensors: buildSensors(21, 12.5, {})
};

/** PDF: Warning - most 28°C / 13.2%; S01-S04 bottom 44°C / 16.1% */
const emekSouth: PileMock = {
  id: "emek-south",
  siteId: EMEK_HEFER_HARISH_7_ID,
  name: "Emek South",
  status: "Warning",
  aggregateTempC: 28,
  aggregateMoisturePct: 13.2,
  sensors: buildSensors(28, 13.2, {
    1: { temperatureC: 44, moisturePct: 16.1 },
    2: { temperatureC: 44, moisturePct: 16.1 },
    3: { temperatureC: 44, moisturePct: 16.1 },
    4: { temperatureC: 44, moisturePct: 16.1 }
  })
};

/** PDF: Critical - most 26°C / 13.0%; S11-S15 middle 51°C / 18.4%; S28 top erratic */
const emekEast: PileMock = {
  id: "emek-east",
  siteId: EMEK_HEFER_HARISH_7_ID,
  name: "Emek East",
  status: "Critical",
  aggregateTempC: 26,
  aggregateMoisturePct: 13.0,
  sensors: buildSensors(26, 13.0, {
    11: { temperatureC: 51, moisturePct: 18.4 },
    12: { temperatureC: 51, moisturePct: 18.4 },
    13: { temperatureC: 51, moisturePct: 18.4 },
    14: { temperatureC: 51, moisturePct: 18.4 },
    15: { temperatureC: 51, moisturePct: 18.4 },
    28: "faulty"
  })
};

/** PDF: Warning - most 35°C / 14.8%; S06-S08 bottom 39°C / 16.2% */
const emekWest: PileMock = {
  id: "emek-west",
  siteId: EMEK_HEFER_HARISH_7_ID,
  name: "Emek West",
  status: "Warning",
  aggregateTempC: 35,
  aggregateMoisturePct: 14.8,
  sensors: buildSensors(35, 14.8, {
    6: { temperatureC: 39, moisturePct: 16.2 },
    7: { temperatureC: 39, moisturePct: 16.2 },
    8: { temperatureC: 39, moisturePct: 16.2 }
  })
};

const emekHeferHarish7: SiteMock = {
  id: EMEK_HEFER_HARISH_7_ID,
  name: "Emek Hefer - Harish 7",
  locationLine: "Emek Hefer Industrial Park, Israel",
  cellFootprintLabel: "50m × 25m × 10m high",
  piles: [emekNorth, emekSouth, emekEast, emekWest]
};

export const MOCK_SITES: SiteMock[] = [emekHeferHarish7];

export function getSites(): SiteMock[] {
  return MOCK_SITES;
}

export function getSiteById(id: string): SiteMock | undefined {
  return MOCK_SITES.find((s) => s.id === id);
}

export function getPilesForSite(siteId: string): PileMock[] {
  return getSiteById(siteId)?.piles ?? [];
}

/** All piles across sites (pile ids remain globally unique). */
export function getPiles(): PileMock[] {
  return MOCK_SITES.flatMap((s) => s.piles);
}

export function getPileById(id: string): PileMock | undefined {
  for (const site of MOCK_SITES) {
    const p = site.piles.find((x) => x.id === id);
    if (p) return p;
  }
  return undefined;
}

/** Active alerts derived from the mock scenario (PDF narrative). */
export function getActiveAlerts(): OperatorAlert[] {
  const siteName = emekHeferHarish7.name;
  return [
    {
      id: "alert-south-bottom",
      siteId: emekHeferHarish7.id,
      siteName,
      pileId: emekSouth.id,
      pileName: emekSouth.name,
      severity: "warning",
      title: "Hot spot in bottom layer",
      sensorIds: ["S01", "S02", "S03", "S04"],
      readingSummary: "44°C and 16.1% moisture on bottom sensors (above safe bands).",
      nextSteps: [
        "Increase monitoring on this pile today.",
        "Prepare aeration or turning if temperature keeps rising.",
        "Compare with gateway readings in the cell."
      ]
    },
    {
      id: "alert-east-middle",
      siteId: emekHeferHarish7.id,
      siteName,
      pileId: emekEast.id,
      pileName: emekEast.name,
      severity: "critical",
      title: "Critical heat in middle layer",
      sensorIds: ["S11", "S12", "S13", "S14", "S15"],
      readingSummary: "51°C and 18.4% moisture - spoilage and fire risk are high.",
      nextSteps: [
        "Treat as urgent: ventilate or cool the pile per your site procedure.",
        "Do not leave unattended until readings drop into the safe range.",
        "Log actions taken for the shift handover."
      ]
    },
    {
      id: "alert-east-s28",
      siteId: emekHeferHarish7.id,
      siteName,
      pileId: emekEast.id,
      pileName: emekEast.name,
      severity: "critical",
      title: "Sensor may be faulty",
      sensorIds: ["S28"],
      readingSummary: "Erratic readings from top sensor - data may be unreliable.",
      nextSteps: [
        "Schedule a physical check at the top of the pile.",
        "Flag sensor S28 for maintenance or replacement.",
        "Rely on neighboring sensors until S28 is verified."
      ]
    },
    {
      id: "alert-west-bottom",
      siteId: emekHeferHarish7.id,
      siteName,
      pileId: emekWest.id,
      pileName: emekWest.name,
      severity: "warning",
      title: "Elevated bottom readings",
      sensorIds: ["S06", "S07", "S08"],
      readingSummary: "39°C and 16.2% moisture on bottom sensors (warning range).",
      nextSteps: [
        "Watch this pile closely over the next 12 hours.",
        "If moisture or temperature climb further, start cooling steps."
      ]
    }
  ];
}
