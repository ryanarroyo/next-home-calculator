import { formatPct, formatUSD, type CalculatorResults } from "../lib/calculator";

interface ResultsPanelProps {
  results: CalculatorResults;
  homePrice: number;
  cashDownpayment: number;
  currentEquity: number;
  loanTermYears: number;
  mortgageRatePct: number;
  taxRatePct: number;
  insuranceRatePct: number;
  resolvedLocation: string;
  electricity: number;
  gas: number;
  hoa: number;
  landscaping: number;
  cleaning: number;
}

export function ResultsPanel({
  results,
  homePrice,
  cashDownpayment,
  currentEquity,
  loanTermYears,
  mortgageRatePct,
  taxRatePct,
  insuranceRatePct,
  resolvedLocation,
  electricity,
  gas,
  hoa,
  landscaping,
  cleaning,
}: ResultsPanelProps) {
  const operatingSummary = summarizeOperating({
    electricity,
    gas,
    hoa,
    landscaping,
    cleaning,
  });

  return (
    <section className="card results-card">
      <div className="card-head">
        <h2>Carry &amp; cash</h2>
        <span className="step">02 · OUTPUT</span>
      </div>

      <div className="hero-numbers">
        <div className="hero-row">
          <div className="hero-stat">
            <div className="label">
              Per month <span className="badge">all-in</span>
            </div>
            <div className="value">
              <span className="cur">$</span>
              {formatUSD(results.monthlyTotal)}
            </div>
            <div className="sub">PITI · operating · all-in</div>
          </div>
          <div className="hero-stat">
            <div className="label">Per year</div>
            <div className="value">
              <span className="cur">$</span>
              {formatUSD(results.yearlyTotal)}
            </div>
            <div className="sub">total housing cost</div>
          </div>
        </div>
      </div>

      <div className="breakdown">
        <div className="section-h">
          <span>Monthly breakdown</span>
          <span className="meta">
            {loanTermYears}Y · {mortgageRatePct}% ·{" "}
            {formatPct(results.ltvPct, 1)} LTV
          </span>
        </div>
        <div className="stack-bar">
          <div
            className="seg-mortgage"
            style={{ width: `${results.pctMortgage}%` }}
          />
          <div className="seg-tax" style={{ width: `${results.pctTax}%` }} />
          <div
            className="seg-ins"
            style={{ width: `${results.pctInsurance}%` }}
          />
          <div
            className="seg-operating"
            style={{ width: `${results.pctOperating}%` }}
          />
        </div>
        <table className="legend-table">
          <tbody>
            <tr>
              <td className="swatch-cell">
                <span className="swatch" style={{ background: "var(--ink)" }} />
              </td>
              <td>
                <div className="name">Mortgage P&amp;I</div>
                <div className="desc">
                  ${formatUSD(results.loanAmount)} @ {mortgageRatePct}% ·{" "}
                  {loanTermYears}Y
                </div>
              </td>
              <td className="pct-cell">{results.pctMortgage.toFixed(0)}%</td>
              <td className="amt-cell">
                ${formatUSD(results.monthlyMortgage)}
              </td>
            </tr>
            <tr>
              <td className="swatch-cell">
                <span
                  className="swatch"
                  style={{ background: "var(--accent)" }}
                />
              </td>
              <td>
                <div className="name">Property tax</div>
                <div className="desc">
                  {taxRatePct}% × ${formatUSD(homePrice)}
                  {resolvedLocation ? ` · ${resolvedLocation}` : ""}
                </div>
              </td>
              <td className="pct-cell">{results.pctTax.toFixed(0)}%</td>
              <td className="amt-cell">
                ${formatUSD(results.monthlyPropertyTax)}
              </td>
            </tr>
            <tr>
              <td className="swatch-cell">
                <span className="swatch" style={{ background: "var(--pos)" }} />
              </td>
              <td>
                <div className="name">Home insurance</div>
                <div className="desc">{insuranceRatePct}% of value annually</div>
              </td>
              <td className="pct-cell">{results.pctInsurance.toFixed(0)}%</td>
              <td className="amt-cell">
                ${formatUSD(results.monthlyInsurance)}
              </td>
            </tr>
            <tr>
              <td className="swatch-cell">
                <span
                  className="swatch"
                  style={{ background: "var(--ink-3)" }}
                />
              </td>
              <td>
                <div className="name">Operating costs</div>
                <div className="desc">{operatingSummary || "—"}</div>
              </td>
              <td className="pct-cell">{results.pctOperating.toFixed(0)}%</td>
              <td className="amt-cell">
                ${formatUSD(results.monthlyOperating)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="summary">
        <div className="section-h">
          <span>Cash at closing</span>
          <span className="meta">est.</span>
        </div>
        <div className="sum-row">
          <span className="l">Cash down payment</span>
          <span className="r">${formatUSD(cashDownpayment)}</span>
        </div>
        <div className="sum-row">
          <span className="l">Equity from current home</span>
          <span className="r">${formatUSD(currentEquity)}</span>
        </div>
        <div className="sum-row">
          <span className="l">Closing costs (~2.5%)</span>
          <span className="r">${formatUSD(results.closingCosts)}</span>
        </div>
        <div className="sum-row total">
          <span className="l">Total cash needed</span>
          <span className="r">${formatUSD(results.cashToClose)}</span>
        </div>
      </div>
    </section>
  );
}

function summarizeOperating(o: {
  electricity: number;
  gas: number;
  hoa: number;
  landscaping: number;
  cleaning: number;
}): string {
  const parts: string[] = [];
  if (o.electricity) parts.push(`elec $${formatUSD(o.electricity)}`);
  if (o.gas) parts.push(`gas $${formatUSD(o.gas)}`);
  if (o.hoa) parts.push(`HOA $${formatUSD(o.hoa)}`);
  if (o.landscaping) parts.push(`yard $${formatUSD(o.landscaping)}`);
  if (o.cleaning) parts.push(`clean $${formatUSD(o.cleaning)}`);
  return parts.join(" · ");
}
