import { getCurrentUser } from "@/lib/auth/current-user";
import { apiSuccess, apiError } from "@/lib/api-response";
import { buildScreenerUniverse } from "@/lib/mock-data/screener";
import { getAllStocks } from "@/lib/providers/market-data";
import { computeFinancialHealthScore } from "@/lib/scoring/financial-health";
import { generateAiExplanation } from "@/lib/ai/explain-stock";

// Simple in-memory cache, keyed by symbol, so repeated page views (or
// multiple students demoing the same company) don't each trigger a fresh
// LLM call. In a real deployment this would be Redis or a DB table with
// a TTL — in-memory is fine for a single dev/demo instance.
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, { data: unknown; expiresAt: number }>();

export async function GET(
  _req: Request,
  { params }: { params: { symbol: string } }
) {
  const user = await getCurrentUser();
  if (!user) return apiError("Not authenticated.", 401);

  const symbol = params.symbol.toUpperCase();
  const cached = cache.get(symbol);
  if (cached && cached.expiresAt > Date.now()) {
    return apiSuccess(cached.data);
  }

  // Fundamentals (P/E, ROE, etc.) stay mock; price/change is merged from
  // the live cache when available, so the AI explanation reflects
  // whatever price is currently showing elsewhere in the app.
  const [universe, liveStocks] = await Promise.all([
    Promise.resolve(buildScreenerUniverse()),
    getAllStocks(),
  ]);

  const baseStock = universe.find((s) => s.symbol === symbol);
  if (!baseStock) return apiError("Company not found.", 404);

  const live = liveStocks.find((s) => s.symbol === symbol);
  const stock = live
    ? { ...baseStock, price: live.price, change: live.change, changePercent: live.changePercent }
    : baseStock;

  const score = computeFinancialHealthScore(stock);
  const explanation = await generateAiExplanation(stock, score);

  const payload = { score, explanation };
  cache.set(symbol, { data: payload, expiresAt: Date.now() + CACHE_TTL_MS });

  return apiSuccess(payload);
}
