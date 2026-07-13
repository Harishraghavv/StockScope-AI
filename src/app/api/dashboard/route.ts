import { getCurrentUser } from "@/lib/auth/current-user";
import { apiSuccess, apiError } from "@/lib/api-response";
import {
  getIndices,
  getTopGainers,
  getTopLosers,
  getTrendingStocks,
  getSectorPerformance,
  getNews,
  getWatchlistSummary,
} from "@/lib/providers/market-data";

// JSON API for dashboard data, useful for client-side refresh or future
// mobile/API consumers. The dashboard page itself calls the provider
// functions directly (server-side) rather than fetching this route, to
// avoid an unnecessary network round trip on first render.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return apiError("Not authenticated.", 401);

  const [indices, gainers, losers, trending, sectors, news, watchlist] =
    await Promise.all([
      getIndices(),
      getTopGainers(5),
      getTopLosers(5),
      getTrendingStocks(6),
      getSectorPerformance(),
      getNews(5),
      getWatchlistSummary(),
    ]);

  return apiSuccess({
    indices,
    gainers,
    losers,
    trending,
    sectors,
    news,
    watchlist,
    asOf: new Date().toISOString(),
  });
}
