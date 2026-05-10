export interface StateRates {
  abbreviation: string;
  name: string;
  taxRatePct: number;
  insuranceRatePct: number;
}

export const STATE_RATES: Record<string, StateRates> = {
  AL: { abbreviation: "AL", name: "Alabama", taxRatePct: 0.39, insuranceRatePct: 0.65 },
  AK: { abbreviation: "AK", name: "Alaska", taxRatePct: 1.07, insuranceRatePct: 0.32 },
  AZ: { abbreviation: "AZ", name: "Arizona", taxRatePct: 0.62, insuranceRatePct: 0.28 },
  AR: { abbreviation: "AR", name: "Arkansas", taxRatePct: 0.61, insuranceRatePct: 0.55 },
  CA: { abbreviation: "CA", name: "California", taxRatePct: 0.71, insuranceRatePct: 0.3 },
  CO: { abbreviation: "CO", name: "Colorado", taxRatePct: 0.51, insuranceRatePct: 0.5 },
  CT: { abbreviation: "CT", name: "Connecticut", taxRatePct: 1.79, insuranceRatePct: 0.3 },
  DE: { abbreviation: "DE", name: "Delaware", taxRatePct: 0.58, insuranceRatePct: 0.3 },
  DC: { abbreviation: "DC", name: "District of Columbia", taxRatePct: 0.62, insuranceRatePct: 0.25 },
  FL: { abbreviation: "FL", name: "Florida", taxRatePct: 0.86, insuranceRatePct: 1.2 },
  GA: { abbreviation: "GA", name: "Georgia", taxRatePct: 0.81, insuranceRatePct: 0.55 },
  HI: { abbreviation: "HI", name: "Hawaii", taxRatePct: 0.29, insuranceRatePct: 0.2 },
  ID: { abbreviation: "ID", name: "Idaho", taxRatePct: 0.65, insuranceRatePct: 0.25 },
  IL: { abbreviation: "IL", name: "Illinois", taxRatePct: 2.05, insuranceRatePct: 0.4 },
  IN: { abbreviation: "IN", name: "Indiana", taxRatePct: 0.81, insuranceRatePct: 0.4 },
  IA: { abbreviation: "IA", name: "Iowa", taxRatePct: 1.5, insuranceRatePct: 0.45 },
  KS: { abbreviation: "KS", name: "Kansas", taxRatePct: 1.36, insuranceRatePct: 0.65 },
  KY: { abbreviation: "KY", name: "Kentucky", taxRatePct: 0.83, insuranceRatePct: 0.5 },
  LA: { abbreviation: "LA", name: "Louisiana", taxRatePct: 0.55, insuranceRatePct: 1.0 },
  ME: { abbreviation: "ME", name: "Maine", taxRatePct: 1.15, insuranceRatePct: 0.3 },
  MD: { abbreviation: "MD", name: "Maryland", taxRatePct: 1.04, insuranceRatePct: 0.3 },
  MA: { abbreviation: "MA", name: "Massachusetts", taxRatePct: 1.14, insuranceRatePct: 0.35 },
  MI: { abbreviation: "MI", name: "Michigan", taxRatePct: 1.34, insuranceRatePct: 0.35 },
  MN: { abbreviation: "MN", name: "Minnesota", taxRatePct: 1.05, insuranceRatePct: 0.55 },
  MS: { abbreviation: "MS", name: "Mississippi", taxRatePct: 0.75, insuranceRatePct: 0.85 },
  MO: { abbreviation: "MO", name: "Missouri", taxRatePct: 0.96, insuranceRatePct: 0.55 },
  MT: { abbreviation: "MT", name: "Montana", taxRatePct: 0.74, insuranceRatePct: 0.4 },
  NE: { abbreviation: "NE", name: "Nebraska", taxRatePct: 1.54, insuranceRatePct: 0.85 },
  NV: { abbreviation: "NV", name: "Nevada", taxRatePct: 0.55, insuranceRatePct: 0.25 },
  NH: { abbreviation: "NH", name: "New Hampshire", taxRatePct: 1.86, insuranceRatePct: 0.25 },
  NJ: { abbreviation: "NJ", name: "New Jersey", taxRatePct: 2.21, insuranceRatePct: 0.3 },
  NM: { abbreviation: "NM", name: "New Mexico", taxRatePct: 0.78, insuranceRatePct: 0.4 },
  NY: { abbreviation: "NY", name: "New York", taxRatePct: 1.4, insuranceRatePct: 0.3 },
  NC: { abbreviation: "NC", name: "North Carolina", taxRatePct: 0.78, insuranceRatePct: 0.45 },
  ND: { abbreviation: "ND", name: "North Dakota", taxRatePct: 0.97, insuranceRatePct: 0.55 },
  OH: { abbreviation: "OH", name: "Ohio", taxRatePct: 1.55, insuranceRatePct: 0.35 },
  OK: { abbreviation: "OK", name: "Oklahoma", taxRatePct: 0.85, insuranceRatePct: 1.0 },
  OR: { abbreviation: "OR", name: "Oregon", taxRatePct: 0.91, insuranceRatePct: 0.3 },
  PA: { abbreviation: "PA", name: "Pennsylvania", taxRatePct: 1.43, insuranceRatePct: 0.3 },
  RI: { abbreviation: "RI", name: "Rhode Island", taxRatePct: 1.3, insuranceRatePct: 0.4 },
  SC: { abbreviation: "SC", name: "South Carolina", taxRatePct: 0.55, insuranceRatePct: 0.55 },
  SD: { abbreviation: "SD", name: "South Dakota", taxRatePct: 1.13, insuranceRatePct: 0.55 },
  TN: { abbreviation: "TN", name: "Tennessee", taxRatePct: 0.65, insuranceRatePct: 0.5 },
  TX: { abbreviation: "TX", name: "Texas", taxRatePct: 1.68, insuranceRatePct: 0.75 },
  UT: { abbreviation: "UT", name: "Utah", taxRatePct: 0.55, insuranceRatePct: 0.25 },
  VT: { abbreviation: "VT", name: "Vermont", taxRatePct: 1.83, insuranceRatePct: 0.3 },
  VA: { abbreviation: "VA", name: "Virginia", taxRatePct: 0.8, insuranceRatePct: 0.35 },
  WA: { abbreviation: "WA", name: "Washington", taxRatePct: 0.92, insuranceRatePct: 0.3 },
  WV: { abbreviation: "WV", name: "West Virginia", taxRatePct: 0.55, insuranceRatePct: 0.4 },
  WI: { abbreviation: "WI", name: "Wisconsin", taxRatePct: 1.61, insuranceRatePct: 0.3 },
  WY: { abbreviation: "WY", name: "Wyoming", taxRatePct: 0.55, insuranceRatePct: 0.4 },
};

const NAME_TO_ABBR: Record<string, string> = Object.fromEntries(
  Object.values(STATE_RATES).map((s) => [s.name.toLowerCase(), s.abbreviation])
);

export function getStateByAbbr(abbr: string): StateRates | undefined {
  return STATE_RATES[abbr.toUpperCase()];
}

export function getStateByName(name: string): StateRates | undefined {
  const abbr = NAME_TO_ABBR[name.trim().toLowerCase()];
  return abbr ? STATE_RATES[abbr] : undefined;
}
