import type { VercelRequest, VercelResponse } from "@vercel/node";
import { lookupRates, LookupError } from "./_lib/lookupRates";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res
      .status(503)
      .json({ error: "ANTHROPIC_API_KEY not configured on server." });
  }

  const body = typeof req.body === "string" ? safeParseJson(req.body) : req.body;
  const obj = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const query = obj.query;
  const homePrice = typeof obj.homePrice === "number" ? obj.homePrice : undefined;

  if (typeof query !== "string") {
    return res.status(400).json({ error: "Body must be { query: string, homePrice?: number }" });
  }

  try {
    const result = await lookupRates(query, apiKey, homePrice);
    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof LookupError) {
      return res.status(e.status).json({ error: e.message });
    }
    return res.status(500).json({ error: "Lookup failed." });
  }
}

function safeParseJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
