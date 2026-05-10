import { Calculator } from "./components/Calculator";

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          <div className="brand-name">Hearth</div>
          <div className="brand-sep" />
          <div className="brand-sub">Home cost calculator</div>
        </div>
        <div className="topbar-right">
          <div className="ticker">
            <span className="label">30Y FIXED</span>
            <span>6.75%</span>
          </div>
          <div className="ticker">
            <span className="label">15Y FIXED</span>
            <span>6.05%</span>
          </div>
          <div className="ticker">
            <span className="pulse" />
            <span>Live</span>
          </div>
        </div>
      </header>

      <div className="title-block">
        <h1>Model the all-in cost of your next home.</h1>
        <p>
          Combine equity, cash, and a real-time tax lookup to see your monthly
          carry, total cash to close, and how every dollar breaks down.
        </p>
      </div>

      <Calculator />

      <div className="footnote">
        <div className="col">
          <strong>Mortgage</strong>
          Standard amortization on (price − equity − cash) at the given APR.
          Assumes a fixed-rate loan with no points.
        </div>
        <div className="col">
          <strong>Tax &amp; insurance</strong>
          Property tax = annual effective rate × home price ÷ 12. Insurance
          defaults to 0.35% of home value per year — set higher in coastal or
          wildfire zones.
        </div>
        <div className="col">
          <strong>Excludes</strong>
          PMI, HOA dues, utilities, and maintenance. Closing costs estimated at
          2.5% — verify lender fees and county-specific taxes before closing.
        </div>
      </div>
    </div>
  );
}

export default App;
