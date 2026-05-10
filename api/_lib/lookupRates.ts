import Anthropic from "@anthropic-ai/sdk";

export interface LookupResult {
  location: string;
  tax_rate: number;
  insurance_rate: number;
  confidence: "high" | "medium" | "low";
  electricity: number;
  gas: number;
  hoa: number;
  landscaping: number;
  cleaning: number;
}

export class LookupError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const SYSTEM_PROMPT = `You are a US home cost data assistant.

Given a US location (zip code, city, or "city, state") and optionally a home price, return:

Property tax & insurance (rates as % of home value):
- tax_rate: effective annual property tax rate. Use county-level data when you can; state averages otherwise.
- insurance_rate: typical annual homeowners insurance premium. Set higher for hurricane (FL/LA Gulf), wildfire (high-risk CA), or hail-prone areas.

Operating costs (monthly $ amounts for a typical home of the given price):
- electricity: typical monthly electric bill. Higher in hot/cold-extreme states, larger homes.
- gas: typical monthly natural gas / heating bill. Higher in cold-winter states; near zero in mild climates.
- hoa: typical monthly HOA dues if the home is in an HOA. Set 0 if HOAs are uncommon for the area; set a typical figure if they are common.
- landscaping: typical monthly cost of professional lawn / yard service for a home of this size and climate. 0 in dense urban areas with no yard.
- cleaning: typical monthly cost of a residential cleaning service (e.g. biweekly visits) for this home size.

Scale operating estimates with home price (proxy for size): a $300K home might have ~$120 electricity, a $1M home ~$250.

confidence: "high" if you know specific county/zip, "medium" for metro/region, "low" for state-only or non-US.

If location is unclear or non-US, set tax_rate=0, all operating fields to 0, confidence="low", and explain in location.`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    location: { type: "string" },
    tax_rate: { type: "number" },
    insurance_rate: { type: "number" },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    electricity: { type: "number" },
    gas: { type: "number" },
    hoa: { type: "number" },
    landscaping: { type: "number" },
    cleaning: { type: "number" },
  },
  required: [
    "location",
    "tax_rate",
    "insurance_rate",
    "confidence",
    "electricity",
    "gas",
    "hoa",
    "landscaping",
    "cleaning",
  ],
  additionalProperties: false,
} as const;

export async function lookupRates(
  query: string,
  apiKey: string,
  homePrice?: number
): Promise<LookupResult> {
  const trimmed = query.trim();
  if (!trimmed) throw new LookupError("Query is required.", 400);
  if (trimmed.length > 200) throw new LookupError("Query too long.", 400);

  const userContent =
    homePrice && homePrice > 0
      ? `Location: ${trimmed}\nHome price: $${Math.round(homePrice).toLocaleString("en-US")}`
      : `Location: ${trimmed}`;

  const client = new Anthropic({ apiKey });

  let response;
  try {
    response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      output_config: {
        format: {
          type: "json_schema",
          schema: RESPONSE_SCHEMA,
        },
      },
      messages: [{ role: "user", content: userContent }],
    });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) {
      throw new LookupError("Invalid Anthropic API key.", 503);
    }
    if (e instanceof Anthropic.RateLimitError) {
      throw new LookupError("Rate limited — try again shortly.", 429);
    }
    if (e instanceof Anthropic.APIError) {
      console.error("[lookup-rates] Anthropic APIError:", {
        status: e.status,
        message: e.message,
      });
      throw new LookupError(`Upstream ${e.status ?? ""}: ${e.message}`, 502);
    }
    console.error("[lookup-rates] Unexpected error:", e);
    const detail = e instanceof Error ? e.message : String(e);
    throw new LookupError(`Lookup failed: ${detail}`, 500);
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new LookupError("Model returned non-JSON response.", 502);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new LookupError("Response missing required fields.", 502);
  }

  const p = parsed as Record<string, unknown>;
  const numericFields = [
    "tax_rate",
    "insurance_rate",
    "electricity",
    "gas",
    "hoa",
    "landscaping",
    "cleaning",
  ] as const;

  if (
    typeof p.location !== "string" ||
    !["high", "medium", "low"].includes(p.confidence as string) ||
    !numericFields.every((f) => typeof p[f] === "number")
  ) {
    throw new LookupError("Response missing required fields.", 502);
  }

  return parsed as LookupResult;
}
