import { useMemo } from "react";
import { calculate, formatUSD } from "../lib/calculator";
import { usePersistedState } from "../lib/usePersistedState";
import { Field } from "./Field";
import { LocationLookup } from "./LocationLookup";
import { MoneyInput } from "./MoneyInput";
import { PercentInput } from "./PercentInput";
import { ResultsPanel } from "./ResultsPanel";
import { StatStrip } from "./StatStrip";

const TERMS = [15, 20, 30] as const;

export function Calculator() {
  const [homeEquity, setHomeEquity] = usePersistedState("cc.equity", 220_000);
  const [nextPrice, setNextPrice] = usePersistedState("cc.price", 850_000);
  const [cashDown, setCashDown] = usePersistedState("cc.cash", 50_000);
  const [mortgageRate, setMortgageRate] = usePersistedState("cc.rate", 6.75);
  const [loanTerm, setLoanTerm] = usePersistedState<number>("cc.term", 30);
  const [taxRate, setTaxRate] = usePersistedState("cc.taxrate", 1.2);
  const [insRate, setInsRate] = usePersistedState("cc.insrate", 0.35);
  const [location, setLocation] = usePersistedState("cc.loc", "");
  const [resolvedLoc, setResolvedLoc] = usePersistedState("cc.locres", "");
  const [electricity, setElectricity] = usePersistedState("cc.electricity", 150);
  const [gas, setGas] = usePersistedState("cc.gas", 60);
  const [hoa, setHoa] = usePersistedState("cc.hoa", 0);
  const [landscaping, setLandscaping] = usePersistedState("cc.landscaping", 0);
  const [cleaning, setCleaning] = usePersistedState("cc.cleaning", 0);

  const results = useMemo(
    () =>
      calculate({
        homePrice: nextPrice,
        currentEquity: homeEquity,
        cashDownpayment: cashDown,
        mortgageRatePct: mortgageRate,
        loanTermYears: loanTerm,
        propertyTaxRatePct: taxRate,
        insuranceRatePct: insRate,
        electricity,
        gas,
        hoa,
        landscaping,
        cleaning,
      }),
    [
      nextPrice,
      homeEquity,
      cashDown,
      mortgageRate,
      loanTerm,
      taxRate,
      insRate,
      electricity,
      gas,
      hoa,
      landscaping,
      cleaning,
    ]
  );

  return (
    <>
      <StatStrip
        results={results}
        loanTermYears={loanTerm}
        mortgageRatePct={mortgageRate}
      />

      <div className="grid">
        <section className="card">
          <div className="card-head">
            <h2>Assumptions</h2>
            <span className="step">01 · INPUTS</span>
          </div>
          <div className="card-body">
            <Field name="Current home equity" hint="from sale of current home">
              <MoneyInput
                value={homeEquity}
                onChange={setHomeEquity}
                max={10_000_000}
              />
            </Field>

            <Field name="Cash down payment" hint="additional cash">
              <MoneyInput
                value={cashDown}
                onChange={setCashDown}
                max={10_000_000}
              />
              <div className="input-aside">
                <span>Quick set:</span>
                <span
                  className="chip"
                  onClick={() =>
                    setCashDown(
                      Math.max(0, Math.round(nextPrice * 0.2 - homeEquity))
                    )
                  }
                >
                  20% total
                </span>
                <span className="chip" onClick={() => setCashDown(0)}>
                  $0
                </span>
                <span className="chip" onClick={() => setCashDown(50_000)}>
                  $50k
                </span>
                <span className="chip" onClick={() => setCashDown(100_000)}>
                  $100k
                </span>
              </div>
            </Field>

            <Field name="Next home price" hint="purchase price">
              <MoneyInput
                value={nextPrice}
                onChange={setNextPrice}
                max={100_000_000}
              />
            </Field>

            <Field name="Mortgage rate" hint="annual APR">
              <PercentInput
                value={mortgageRate}
                onChange={setMortgageRate}
                max={20}
              />
            </Field>

            <Field name="Loan term">
              <div className="seg">
                {TERMS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={loanTerm === t ? "active" : ""}
                    onClick={() => setLoanTerm(t)}
                  >
                    {t}-year
                  </button>
                ))}
              </div>
            </Field>

            <Field
              name="Location"
              hint={resolvedLoc || "zip · city · city, state"}
              desc="Auto-fills property tax, insurance, and operating-cost estimates for the area."
            >
              <LocationLookup
                query={location}
                onQueryChange={setLocation}
                resolved={resolvedLoc}
                homePrice={nextPrice}
                onResult={(r) => {
                  setTaxRate(Number(r.taxRatePct.toFixed(3)));
                  setInsRate(Number(r.insuranceRatePct.toFixed(3)));
                  setResolvedLoc(r.resolved);
                  if (typeof r.electricity === "number")
                    setElectricity(Math.round(r.electricity));
                  if (typeof r.gas === "number") setGas(Math.round(r.gas));
                  if (typeof r.hoa === "number") setHoa(Math.round(r.hoa));
                  if (typeof r.landscaping === "number")
                    setLandscaping(Math.round(r.landscaping));
                  if (typeof r.cleaning === "number")
                    setCleaning(Math.round(r.cleaning));
                }}
              />
            </Field>

            <Field name="Property tax rate" hint="annual, effective">
              <PercentInput
                value={taxRate}
                onChange={setTaxRate}
                max={10}
              />
            </Field>

            <Field
              name="Home insurance rate"
              hint={`≈ $${formatUSD(results.monthlyInsurance)}/mo`}
              desc="Typical US: 0.25–0.50% of home value annually. Higher in coastal or wildfire zones."
            >
              <PercentInput value={insRate} onChange={setInsRate} max={5} />
            </Field>
          </div>
        </section>

        <ResultsPanel
          results={results}
          homePrice={nextPrice}
          cashDownpayment={cashDown}
          currentEquity={homeEquity}
          loanTermYears={loanTerm}
          mortgageRatePct={mortgageRate}
          taxRatePct={taxRate}
          insuranceRatePct={insRate}
          resolvedLocation={resolvedLoc}
          electricity={electricity}
          gas={gas}
          hoa={hoa}
          landscaping={landscaping}
          cleaning={cleaning}
        />
      </div>

      <section className="card" style={{ marginTop: 20 }}>
        <div className="card-head">
          <h2>Operating costs</h2>
          <span className="step">03 · MONTHLY · ${formatUSD(results.monthlyOperating)}</span>
        </div>
        <div className="card-body operating-grid">
          <Field name="Electricity" hint="$/mo">
            <MoneyInput value={electricity} onChange={setElectricity} max={5000} />
          </Field>
          <Field name="Gas" hint="$/mo">
            <MoneyInput value={gas} onChange={setGas} max={5000} />
          </Field>
          <Field name="HOA" hint="$/mo">
            <MoneyInput value={hoa} onChange={setHoa} max={5000} />
          </Field>
          <Field name="Landscaping" hint="$/mo">
            <MoneyInput value={landscaping} onChange={setLandscaping} max={5000} />
          </Field>
          <Field name="Cleaning" hint="$/mo">
            <MoneyInput value={cleaning} onChange={setCleaning} max={5000} />
          </Field>
        </div>
      </section>
    </>
  );
}
