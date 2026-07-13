import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import AppHeader from "@/components/dashboard/AppHeader";
import Panel from "@/components/dashboard/Panel";
import IndexCard from "@/components/dashboard/IndexCard";
import StockRow from "@/components/dashboard/StockRow";
import SectorHeatmap from "@/components/dashboard/SectorHeatmap";
import NewsFeed from "@/components/dashboard/NewsFeed";
import WatchlistSummary from "@/components/dashboard/WatchlistSummary";
import AiInsightsPanel from "@/components/dashboard/AiInsightsPanel";
import RecentSearches from "@/components/dashboard/RecentSearches";
import {
  getIndices,
  getTopGainers,
  getTopLosers,
  getTrendingStocks,
  getSectorPerformance,
  getNews,
  getWatchlistSummary,
  isLiveDataActive,
} from "@/lib/providers/market-data";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Fetched in parallel — each call currently reads mock data instantly,
  // but this pattern is what lets real API calls (with real latency) stay
  // fast once a live provider is wired in.
  const [indices, gainers, losers, trending, sectors, news, watchlist, liveActive] =
    await Promise.all([
      getIndices(),
      getTopGainers(5),
      getTopLosers(5),
      getTrendingStocks(6),
      getSectorPerformance(),
      getNews(5),
      getWatchlistSummary(),
      isLiveDataActive(),
    ]);

  // The AI insights panel highlights a small illustrative slice — top
  // mover from gainers and losers — rather than the whole universe.
  const aiHighlightStocks = [gainers[0], losers[0]].filter(
    (stock): stock is (typeof gainers)[number] => stock !== undefined
  );

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <AppHeader user={user} />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
              Dashboard
            </p>
            <h1 className="mt-1 font-display text-2xl font-medium text-ink dark:text-paper">
              Good to see you, {user.name.split(" ")[0]}.
            </h1>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${
                liveActive
                  ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                  : "bg-ink/8 text-ink/50 dark:bg-paper/10 dark:text-paper/50"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${liveActive ? "bg-brand-500" : "bg-ink/30 dark:bg-paper/30"}`}
              />
              {liveActive ? "Live NSE prices" : "Illustrative sample data"}
            </span>
            <p className="max-w-sm text-right text-xs leading-relaxed text-ink/40 dark:text-paper/40">
              {liveActive
                ? "Prices refresh every few minutes from Twelve Data. Indices and fundamentals are still illustrative. Not investment advice."
                : "Educational market overview built on illustrative sample data — not live prices, not investment advice."}
            </p>
          </div>
        </div>

        {/* Market indices strip */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {indices.map((index) => (
            <IndexCard key={index.name} index={index} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left / main column */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Panel title="Top gainers">
                <div className="flex flex-col gap-0.5">
                  {gainers.map((stock) => (
                    <StockRow key={stock.symbol} stock={stock} />
                  ))}
                </div>
              </Panel>
              <Panel title="Top losers">
                <div className="flex flex-col gap-0.5">
                  {losers.map((stock) => (
                    <StockRow key={stock.symbol} stock={stock} />
                  ))}
                </div>
              </Panel>
            </div>

            <Panel title="Sector performance">
              <SectorHeatmap sectors={sectors} />
            </Panel>

            <Panel title="Trending stocks">
              <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                {trending.map((stock) => (
                  <StockRow key={stock.symbol} stock={stock} />
                ))}
              </div>
            </Panel>

            <Panel title="Market news">
              <NewsFeed items={news} />
            </Panel>
          </div>

          {/* Right / sidebar column */}
          <div className="flex flex-col gap-5">
            <Panel title="Your watchlist">
              <WatchlistSummary items={watchlist} />
            </Panel>

            <Panel title="AI insights (educational)">
              <AiInsightsPanel stocks={aiHighlightStocks} />
            </Panel>

            <Panel title="Recent searches">
              <RecentSearches />
            </Panel>
          </div>
        </div>
      </main>
    </div>
  );
}
