import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "http";

function apiPlugin(env: Record<string, string>): Plugin {
  return {
    name: "next-home-calculator/api-dev",
    configureServer(server) {
      server.middlewares.use(
        "/api/lookup-rates",
        async (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("Allow", "POST");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }

          const apiKey = env.ANTHROPIC_API_KEY;
          if (!apiKey) {
            res.statusCode = 503;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error:
                  "ANTHROPIC_API_KEY not set. Add it to .env.local then restart the dev server.",
              })
            );
            return;
          }

          let raw = "";
          try {
            for await (const chunk of req) raw += chunk;
          } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to read body." }));
            return;
          }

          let query: string | undefined;
          let homePrice: number | undefined;
          try {
            const body = raw ? JSON.parse(raw) : {};
            if (typeof body?.query === "string") query = body.query;
            if (typeof body?.homePrice === "number") homePrice = body.homePrice;
          } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid JSON body." }));
            return;
          }

          if (!query) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Body must be { query: string, homePrice?: number }" }));
            return;
          }

          const { lookupRates, LookupError } = await import(
            "./api/_lib/lookupRates"
          );

          try {
            const result = await lookupRates(query, apiKey, homePrice);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch (e) {
            const status = e instanceof LookupError ? e.status : 500;
            const message =
              e instanceof Error ? e.message : "Lookup failed.";
            res.statusCode = status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: message }));
          }
        }
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), apiPlugin(env)],
  };
});
