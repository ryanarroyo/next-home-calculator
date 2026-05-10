import {
  getStateByAbbr,
  getStateByName,
  type StateRates,
} from "./propertyTaxRates";

export type LookupSource = "claude" | "zip-state-fallback" | "city-state" | "state";
export type Confidence = "high" | "medium" | "low";

export interface OperatingEstimates {
  electricity?: number;
  gas?: number;
  hoa?: number;
  landscaping?: number;
  cleaning?: number;
}

export interface LocationLookupResult extends OperatingEstimates {
  resolved: string;
  taxRatePct: number;
  insuranceRatePct: number;
  source: LookupSource;
  confidence: Confidence;
  fallbackReason?: string;
}

interface ClaudeLookupResponse {
  location: string;
  tax_rate: number;
  insurance_rate: number;
  confidence: Confidence;
  electricity: number;
  gas: number;
  hoa: number;
  landscaping: number;
  cleaning: number;
}

interface ZippopotamPlace {
  "place name": string;
  state: string;
  "state abbreviation": string;
}

interface ZippopotamResponse {
  "post code": string;
  places: ZippopotamPlace[];
}

const ZIP_RE = /^\d{5}$/;
const CITY_STATE_RE = /^(.+?),\s*([A-Za-z]{2}|[A-Za-z][A-Za-z ]+)$/;

export async function lookupLocation(
  query: string,
  homePrice?: number
): Promise<LocationLookupResult> {
  const q = query.trim();
  if (!q) throw new Error('Enter a zip code, city, or "city, state".');

  try {
    const data = await callClaudeLookup(q, homePrice);
    return {
      resolved: data.location,
      taxRatePct: clampRate(data.tax_rate, 0, 10),
      insuranceRatePct: clampRate(data.insurance_rate, 0, 5),
      source: "claude",
      confidence: data.confidence,
      electricity: clampRate(data.electricity, 0, 10000),
      gas: clampRate(data.gas, 0, 10000),
      hoa: clampRate(data.hoa, 0, 10000),
      landscaping: clampRate(data.landscaping, 0, 10000),
      cleaning: clampRate(data.cleaning, 0, 10000),
    };
  } catch (claudeErr) {
    const fallback = await staticFallback(q);
    return {
      ...fallback,
      fallbackReason:
        claudeErr instanceof Error ? claudeErr.message : "AI lookup unavailable",
    };
  }
}

async function callClaudeLookup(
  query: string,
  homePrice?: number
): Promise<ClaudeLookupResponse> {
  const res = await fetch("/api/lookup-rates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, homePrice }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) detail = body.error;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  return (await res.json()) as ClaudeLookupResponse;
}

async function staticFallback(q: string): Promise<LocationLookupResult> {
  if (ZIP_RE.test(q)) {
    return await fallbackByZip(q);
  }

  const m = q.match(CITY_STATE_RE);
  if (m) {
    const city = m[1].trim();
    const stateRaw = m[2].trim();
    const state =
      stateRaw.length === 2
        ? getStateByAbbr(stateRaw)
        : getStateByName(stateRaw);
    if (state) return resultFromState(state, `${city}, ${state.abbreviation}`, "city-state");
    throw new Error(`Unknown state: "${stateRaw}".`);
  }

  const direct = getStateByName(q) ?? getStateByAbbr(q);
  if (direct) return resultFromState(direct, direct.name, "state");

  throw new Error('Try a 5-digit zip or "City, ST".');
}

async function fallbackByZip(zip: string): Promise<LocationLookupResult> {
  const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Zip code ${zip} not found.`);
    throw new Error(`Lookup failed (${res.status}).`);
  }
  const data = (await res.json()) as ZippopotamResponse;
  const place = data.places?.[0];
  if (!place) throw new Error(`No location for ${zip}.`);
  const state = getStateByAbbr(place["state abbreviation"]);
  if (!state) throw new Error(`No tax data for ${place.state}.`);
  return resultFromState(
    state,
    `${place["place name"]}, ${state.abbreviation}`,
    "zip-state-fallback"
  );
}

function resultFromState(
  state: StateRates,
  resolved: string,
  source: LookupSource
): LocationLookupResult {
  return {
    resolved,
    taxRatePct: state.taxRatePct,
    insuranceRatePct: state.insuranceRatePct,
    source,
    confidence: source === "zip-state-fallback" ? "medium" : "low",
  };
}

function clampRate(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}
