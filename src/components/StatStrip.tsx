import { formatPct, formatUSD, type CalculatorResults } from "../lib/calculator";

interface StatStripProps {
  results: CalculatorResults;
  loanTermYears: number;
  mortgageRatePct: number;
}

export function StatStrip({
  results,
  loanTermYears,
  mortgageRatePct,
}: StatStripProps) {
  return (
    <div className="stat-strip">
      <div className="stat primary">
        <div className="l">Monthly carry</div>
        <div className="v">
          <span className="cur">$</span>
          {formatUSD(results.monthlyTotal)}
        </div>
        <div className="s">PITI · all-in</div>
      </div>
      <div className="stat">
        <div className="l">Down payment</div>
        <div className="v">
          <span className="cur">$</span>
          {formatUSD(results.totalDownpayment)}
        </div>
        <div className="s">{formatPct(results.downpaymentPct, 1)} of price</div>
      </div>
      <div className="stat">
        <div className="l">Loan amount</div>
        <div className="v">
          <span className="cur">$</span>
          {formatUSD(results.loanAmount)}
        </div>
        <div className="s">
          {formatPct(results.ltvPct, 1)} LTV · {loanTermYears}Y ·{" "}
          {mortgageRatePct}%
        </div>
      </div>
      <div className="stat">
        <div className="l">Cash to close</div>
        <div className="v">
          <span className="cur">$</span>
          {formatUSD(results.cashToClose)}
        </div>
        <div className="s">cash + ~2.5% closing</div>
      </div>
    </div>
  );
}
