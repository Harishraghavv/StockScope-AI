import { buildScreenerUniverse } from "@/lib/mock-data/screener";
import type { ScreenerStock, ScreenerFilters } from "@/lib/market-types";
import { getAllStocks } from "@/lib/providers/market-data";

// Same seam pattern as lib/providers/market-data.ts: fundamentals (P/E,
// ROE, RSI, etc.) stay mock — no free-tier provider supplies these for
// NSE stocks — but price/change/volume are merged in from the live cache
// when available, via getAllStocks(), so the screener's numbers always
// match the dashboard's for the same symbol.
async function getLiveMergedUniverse(): Promise<ScreenerStock[]> {
  const [fundamentals, liveStocks] = await Promise.all([
    Promise.resolve(buildScreenerUniverse()),
    getAllStocks(),
  ]);

  const liveBySymbol = new Map(liveStocks.map((s) => [s.symbol, s]));

  return fundamentals.map((stock) => {
    const live = liveBySymbol.get(stock.symbol);
    if (!live) return stock;
    return {
      ...stock,
      price: live.price,
      change: live.change,
      changePercent: live.changePercent,
      volume: live.volume,
    };
  });
}

export async function getScreenerResults(filters: ScreenerFilters): Promise<ScreenerStock[]> {
  let results = await getLiveMergedUniverse();

  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    results = results.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }

  if (filters.sector) {
    results = results.filter((s) => s.sector === filters.sector);
  }

  if (filters.marketCapMin !== undefined) {
    results = results.filter((s) => s.marketCap >= filters.marketCapMin!);
  }
  if (filters.marketCapMax !== undefined) {
    results = results.filter((s) => s.marketCap <= filters.marketCapMax!);
  }

  if (filters.peMin !== undefined) {
    results = results.filter((s) => s.peRatio >= filters.peMin!);
  }
  if (filters.peMax !== undefined) {
    results = results.filter((s) => s.peRatio <= filters.peMax!);
  }

  if (filters.roeMin !== undefined) {
    results = results.filter((s) => s.roe >= filters.roeMin!);
  }
  if (filters.roceMin !== undefined) {
    results = results.filter((s) => s.roce >= filters.roceMin!);
  }
  if (filters.epsMin !== undefined) {
    results = results.filter((s) => s.eps >= filters.epsMin!);
  }
  if (filters.revenueGrowthMin !== undefined) {
    results = results.filter((s) => s.revenueGrowth >= filters.revenueGrowthMin!);
  }
  if (filters.profitGrowthMin !== undefined) {
    results = results.filter((s) => s.profitGrowth >= filters.profitGrowthMin!);
  }
  if (filters.debtToEquityMax !== undefined) {
    results = results.filter((s) => s.debtToEquity <= filters.debtToEquityMax!);
  }
  if (filters.dividendYieldMin !== undefined) {
    results = results.filter((s) => s.dividendYield >= filters.dividendYieldMin!);
  }
  if (filters.rsiMin !== undefined) {
    results = results.filter((s) => s.rsi >= filters.rsiMin!);
  }
  if (filters.rsiMax !== undefined) {
    results = results.filter((s) => s.rsi <= filters.rsiMax!);
  }
  if (filters.near52WeekHigh) {
    results = results.filter((s) => s.price >= s.week52High * 0.95);
  }
  if (filters.near52WeekLow) {
    results = results.filter((s) => s.price <= s.week52Low * 1.05);
  }

  const sortBy = filters.sortBy ?? "marketCap";
  const sortDir = filters.sortDir ?? "desc";
  results = [...results].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal !== "number" || typeof bVal !== "number") return 0;
    return sortDir === "asc" ? aVal - bVal : bVal - aVal;
  });

  return results;
}

export async function getAvailableSectors(): Promise<string[]> {
  const universe = buildScreenerUniverse();
  return Array.from(new Set(universe.map((s) => s.sector))).sort();
}
