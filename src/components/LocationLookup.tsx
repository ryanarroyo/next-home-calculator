import { useState, type KeyboardEvent } from "react";
import { lookupLocation, type LookupSource } from "../lib/zipLookup";

type Status = "idle" | "loading" | "ok" | "err";

interface LookupResult {
  resolved: string;
  taxRatePct: number;
  insuranceRatePct: number;
  confidence: string;
  source: LookupSource;
  electricity?: number;
  gas?: number;
  hoa?: number;
  landscaping?: number;
  cleaning?: number;
}

interface LocationLookupProps {
  query: string;
  onQueryChange: (q: string) => void;
  resolved: string;
  homePrice: number;
  onResult: (r: LookupResult) => void;
}

const SOURCE_LABEL: Record<LookupSource, string> = {
  claude: "via Claude",
  "zip-state-fallback": "state avg (fallback)",
  "city-state": "state avg",
  state: "state avg",
};

export function LocationLookup({
  query,
  onQueryChange,
  resolved,
  homePrice,
  onResult,
}: LocationLookupProps) {
  const [state, setState] = useState<{ status: Status; msg: string }>({
    status: "idle",
    msg: "",
  });

  async function handleLookup() {
    if (!query.trim()) {
      setState({
        status: "err",
        msg: 'Enter a zip code, city, or "city, state"',
      });
      return;
    }
    setState({ status: "loading", msg: "Resolving location…" });
    try {
      const data = await lookupLocation(query.trim(), homePrice);
      onResult({
        resolved: data.resolved,
        taxRatePct: data.taxRatePct,
        insuranceRatePct: data.insuranceRatePct,
        confidence: data.confidence,
        source: data.source,
        electricity: data.electricity,
        gas: data.gas,
        hoa: data.hoa,
        landscaping: data.landscaping,
        cleaning: data.cleaning,
      });
      const label = SOURCE_LABEL[data.source];
      const tail = data.fallbackReason ? ` · ${data.fallbackReason}` : "";
      setState({
        status: "ok",
        msg: `${data.resolved} · tax ${data.taxRatePct}% · ins ${data.insuranceRatePct}% · ${label}${tail}`,
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Lookup failed — set rates manually";
      setState({ status: "err", msg });
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLookup();
    }
  }

  const idleMsg = resolved
    ? `Last lookup · ${resolved}`
    : "AI-assisted lookup of property tax, insurance, and utility/service estimates for the area.";

  return (
    <>
      <div className="lookup-row">
        <div className="input-wrap" style={{ flex: 1 }}>
          <input
            type="text"
            className="text"
            placeholder="78704 or Austin, TX"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          type="button"
          className="lookup-btn"
          onClick={handleLookup}
          disabled={state.status === "loading"}
        >
          {state.status === "loading" ? (
            <span className="spinner" aria-hidden="true"></span>
          ) : (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M8 1.5C5 1.5 3 3.7 3 6.5c0 3.5 5 8 5 8s5-4.5 5-8c0-2.8-2-5-5-5z" />
              <circle cx="8" cy="6.5" r="1.8" />
            </svg>
          )}
          {state.status === "loading" ? "Resolving" : "Look up"}
        </button>
      </div>
      <div
        className={`lookup-status ${
          state.status === "ok" ? "ok" : state.status === "err" ? "err" : ""
        }`}
      >
        {(state.status === "ok" || state.status === "err") && (
          <span className="led" />
        )}
        {state.msg || idleMsg}
      </div>
    </>
  );
}
