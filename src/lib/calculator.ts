export const CLOSING_COST_RATE = 0.025;

export interface OperatingCosts {
  electricity: number;
  gas: number;
  hoa: number;
  landscaping: number;
  cleaning: number;
}

export interface CalculatorInputs extends OperatingCosts {
  homePrice: number;
  currentEquity: number;
  cashDownpayment: number;
  mortgageRatePct: number;
  loanTermYears: number;
  propertyTaxRatePct: number;
  insuranceRatePct: number;
}

export interface CalculatorResults {
  totalDownpayment: number;
  loanAmount: number;
  downpaymentPct: number;
  ltvPct: number;
  monthlyMortgage: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyOperating: number;
  monthlyTotal: number;
  yearlyTotal: number;
  pctMortgage: number;
  pctTax: number;
  pctInsurance: number;
  pctOperating: number;
  closingCosts: number;
  cashToClose: number;
}

export function monthlyMortgage(
  principal: number,
  annualRatePct: number,
  termYears: number
): number {
  if (principal <= 0 || termYears <= 0) return 0;
  const months = termYears * 12;
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

export function sumOperating(o: OperatingCosts): number {
  return o.electricity + o.gas + o.hoa + o.landscaping + o.cleaning;
}

export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const totalDownpayment = Math.max(
    0,
    inputs.currentEquity + inputs.cashDownpayment
  );
  const loanAmount = Math.max(0, inputs.homePrice - totalDownpayment);
  const downpaymentPct =
    inputs.homePrice > 0 ? (totalDownpayment / inputs.homePrice) * 100 : 0;
  const ltvPct =
    inputs.homePrice > 0 ? (loanAmount / inputs.homePrice) * 100 : 0;

  const mortgage = monthlyMortgage(
    loanAmount,
    inputs.mortgageRatePct,
    inputs.loanTermYears
  );
  const tax = (inputs.homePrice * (inputs.propertyTaxRatePct / 100)) / 12;
  const insurance = (inputs.homePrice * (inputs.insuranceRatePct / 100)) / 12;
  const operating = sumOperating(inputs);
  const monthlyTotal = mortgage + tax + insurance + operating;

  const denom = monthlyTotal;
  const pct = (n: number) => (denom > 0 ? (n / denom) * 100 : 0);

  const closingCosts = inputs.homePrice * CLOSING_COST_RATE;
  const cashToClose = inputs.cashDownpayment + closingCosts;

  return {
    totalDownpayment,
    loanAmount,
    downpaymentPct,
    ltvPct,
    monthlyMortgage: mortgage,
    monthlyPropertyTax: tax,
    monthlyInsurance: insurance,
    monthlyOperating: operating,
    monthlyTotal,
    yearlyTotal: monthlyTotal * 12,
    pctMortgage: pct(mortgage),
    pctTax: pct(tax),
    pctInsurance: pct(insurance),
    pctOperating: pct(operating),
    closingCosts,
    cashToClose,
  };
}

export function formatUSD(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return Math.round(value).toLocaleString("en-US");
}

export function formatPct(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(fractionDigits)}%`;
}
