import { MOCK_STOCKS, MOCK_INDICES, MOCK_NEWS, MOCK_WATCHLIST_SYMBOLS } from "@/lib/mock-data/stocks";
import type { StockQuote, MarketIndex, SectorPerformance, NewsItem, WatchlistItem } from "@/lib/market-types";
import { fetchLiveQuotes } from "@/lib/live-data/yahoo-finance";
import { quoteCache } from "@/lib/live-data/memory-cache";

// -----------------------------------------------------------------------
// Market data provider — the single source of truth for all stock data.
//
// Data priority:
//   1. Yahoo Finance (free, no API key needed) → in-memory cache
//   2. Prisma LiveQuote table (Twelve Data) → DB cache
//   3. Mock data (always available as final fallback)
//
// This merge happens once per request in `getMergedStocks()`; every
// other function below builds on top of that single merged list, so
// there's one place that decides "live vs mock" per symbol.
// -----------------------------------------------------------------------

const LIVE_DATA_MAX_AGE_MS = 15 * 60 * 1000;

// Lazy Prisma loader — doesn't crash if Prisma client isn't generated
async function getPrismaClient() {
  try {
    const mod = await import("@/lib/prisma");
    return mod.prisma;
  } catch {
    return null;
  }
}

// Track whether we have live data for the UI badge
let _liveDataActive = false;

async function getMergedStocks(): Promise<StockQuote[]> {
  // Strategy 1: Try Yahoo Finance (free, no key needed)
  try {
    const symbols = MOCK_STOCKS.map((s) => s.symbol);
    const liveQuotes = await fetchLiveQuotes(symbols);

    if (liveQuotes.size > 0) {
      _liveDataActive = true;
      return MOCK_STOCKS.map((mock) => {
        const live = liveQuotes.get(mock.symbol);
        if (!live) return mock;
        return {
          ...mock,
          price: live.price,
          change: live.change,
          changePercent: live.changePercent,
          volume: live.volume,
        };
      });
    }
  } catch (err) {
    console.warn("[Market Data] Yahoo Finance unavailable:", err);
  }

  // Strategy 2: Try Prisma LiveQuote table (Twelve Data cached)
  if (process.env.TWELVE_DATA_API_KEY) {
    try {
      const prisma = await getPrismaClient();
      if (prisma) {
        const liveRows = await prisma.liveQuote.findMany();
        const liveBySymbol = new Map(liveRows.map((row: any) => [row.symbol, row]));

        const hasFresh = liveRows.some(
          (row: any) => !row.stale && Date.now() - new Date(row.fetchedAt).getTime() < LIVE_DATA_MAX_AGE_MS
        );

        if (hasFresh) {
          _liveDataActive = true;
          return MOCK_STOCKS.map((mock) => {
            const live = liveBySymbol.get(mock.symbol);
            const isFresh =
              live && !live.stale && Date.now() - new Date(live.fetchedAt).getTime() < LIVE_DATA_MAX_AGE_MS;
            if (!isFresh || !live) return mock;
            return {
              ...mock,
              price: live.price,
              change: live.change,
              changePercent: live.changePercent,
              volume: Number(live.volume),
            };
          });
        }
      }
    } catch (err) {
      console.warn("[Market Data] Prisma LiveQuote unavailable:", err);
    }
  }

  // Strategy 3: Pure mock data (always works)
  _liveDataActive = false;
  return MOCK_STOCKS;
}

function sortByChangeDesc(stocks: StockQuote[]) {
  return [...stocks].sort((a, b) => b.changePercent - a.changePercent);
}

export async function getAllStocks(): Promise<StockQuote[]> {
  return getMergedStocks();
}

export async function getTopGainers(limit = 5): Promise<StockQuote[]> {
  const stocks = await getMergedStocks();
  return sortByChangeDesc(stocks)
    .filter((s) => s.changePercent > 0)
    .slice(0, limit);
}

export async function getTopLosers(limit = 5): Promise<StockQuote[]> {
  const stocks = await getMergedStocks();
  return sortByChangeDesc(stocks)
    .filter((s) => s.changePercent < 0)
    .reverse()
    .slice(0, limit);
}

export async function getTrendingStocks(limit = 6): Promise<StockQuote[]> {
  const stocks = await getMergedStocks();
  return [...stocks].sort((a, b) => b.volume - a.volume).slice(0, limit);
}

export async function getIndices(): Promise<MarketIndex[]> {
  try {
    const liveIndices = await fetchLiveQuotes(["^NSEI", "^BSESN", "^NSEBANK", "^CNXIT"]);
    if (liveIndices.size > 0) {
      return MOCK_INDICES.map((mock) => {
        let symbol = "";
        if (mock.name === "NIFTY 50") symbol = "^NSEI";
        else if (mock.name === "SENSEX") symbol = "^BSESN";
        else if (mock.name === "NIFTY BANK") symbol = "^NSEBANK";
        else if (mock.name === "NIFTY IT") symbol = "^CNXIT";

        const live = liveIndices.get(symbol);
        if (!live) return mock;

        return {
          ...mock,
          value: live.price,
          change: live.change,
          changePercent: live.changePercent,
        };
      });
    }
  } catch (err) {
    console.warn("[Market Data] Yahoo Finance indices unavailable:", err);
  }

  // Fallback to mock
  return MOCK_INDICES;
}

export async function getSectorPerformance(): Promise<SectorPerformance[]> {
  const stocks = await getMergedStocks();
  const bySector = new Map<string, { total: number; count: number; marketCap: number }>();

  for (const stock of stocks) {
    const entry = bySector.get(stock.sector) ?? { total: 0, count: 0, marketCap: 0 };
    entry.total += stock.changePercent;
    entry.count += 1;
    entry.marketCap += stock.marketCap;
    bySector.set(stock.sector, entry);
  }

  return Array.from(bySector.entries())
    .map(([sector, { total, count, marketCap }]) => ({
      sector,
      changePercent: Number((total / count).toFixed(2)),
      marketCap,
    }))
    .sort((a, b) => b.changePercent - a.changePercent);
}

export async function getNews(limit = 5): Promise<NewsItem[]> {
  return MOCK_NEWS.slice(0, limit);
}

export async function getAllNews(): Promise<NewsItem[]> {
  return MOCK_NEWS;
}

export async function getWatchlistSummary(symbols: string[] = MOCK_WATCHLIST_SYMBOLS): Promise<WatchlistItem[]> {
  const stocks = await getMergedStocks();
  return stocks
    .filter((s) => symbols.includes(s.symbol))
    .map((s) => ({
      symbol: s.symbol,
      name: s.name,
      price: s.price,
      changePercent: s.changePercent,
    }));
}

export async function getStockBySymbol(symbol: string): Promise<StockQuote | undefined> {
  const stocks = await getMergedStocks();
  return stocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
}

export async function isLiveDataActive(): Promise<boolean> {
  // Trigger a data fetch if we haven't yet
  if (!_liveDataActive) {
    await getMergedStocks();
  }
  return _liveDataActive;
}
