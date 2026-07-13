// Yahoo Finance API client for NSE stocks.
// Uses server-side fetch (no CORS issues in Next.js API routes/server components).
// All symbols are suffixed with .NS for NSE or .BO for BSE.
// Falls back gracefully — returns null on any error so callers can use mock data.

import { quoteCache, detailsCache, historyCache } from "./memory-cache";

const YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart";
const YAHOO_QUOTE_URL = "https://query2.finance.yahoo.com/v10/finance/quoteSummary";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json",
};

const QUOTE_TTL = 5 * 60 * 1000;   // 5 minutes
const DETAIL_TTL = 15 * 60 * 1000; // 15 minutes
const HISTORY_TTL = 30 * 60 * 1000; // 30 minutes

export interface YahooQuote {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  marketCap?: number;
}

export interface YahooCompanyDetail {
  symbol: string;
  longName?: string;
  sector?: string;
  industry?: string;
  website?: string;
  summary?: string;
  marketCap?: number;
  peRatio?: number;
  forwardPE?: number;
  eps?: number;
  dividendYield?: number;
  debtToEquity?: number;
  roe?: number;
  revenueGrowth?: number;
  profitMargin?: number;
  week52High?: number;
  week52Low?: number;
  avgVolume?: number;
  beta?: number;
}

export interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** Fetch a single stock's live quote from Yahoo Finance */
export async function fetchLiveQuote(symbol: string): Promise<YahooQuote | null> {
  const cacheKey = `quote:${symbol}`;
  const cached = quoteCache.get<YahooQuote>(cacheKey);
  if (cached) return cached;

  try {
    const url = `${YAHOO_CHART_URL}/${symbol}.NS?interval=1d&range=1d`;
    const res = await fetch(url, { headers: HEADERS, next: { revalidate: 300 } });

    if (!res.ok) return null;

    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const price = meta.regularMarketPrice ?? 0;
    const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = Number((price - previousClose).toFixed(2));
    const changePercent = previousClose > 0
      ? Number(((change / previousClose) * 100).toFixed(2))
      : 0;

    const quote: YahooQuote = {
      symbol,
      price,
      previousClose,
      change,
      changePercent,
      volume: meta.regularMarketVolume ?? 0,
      dayHigh: meta.regularMarketDayHigh ?? price,
      dayLow: meta.regularMarketDayLow ?? price,
    };

    quoteCache.set(cacheKey, quote, QUOTE_TTL);
    return quote;
  } catch (err) {
    console.warn(`[Yahoo Finance] Failed to fetch quote for ${symbol}:`, err);
    return null;
  }
}

/** Batch fetch quotes for multiple symbols. Uses Promise.allSettled so one failure doesn't break the rest. */
export async function fetchLiveQuotes(symbols: string[]): Promise<Map<string, YahooQuote>> {
  const results = new Map<string, YahooQuote>();
  const settled = await Promise.allSettled(
    symbols.map(async (sym) => {
      const quote = await fetchLiveQuote(sym);
      if (quote) results.set(sym, quote);
    })
  );
  // Log any unexpected rejections for debugging
  settled.forEach((r, i) => {
    if (r.status === "rejected") {
      console.warn(`[Yahoo Finance] Unhandled rejection for ${symbols[i]}:`, r.reason);
    }
  });
  return results;
}

/** Fetch detailed company information from Yahoo Finance */
export async function fetchCompanyDetails(symbol: string): Promise<YahooCompanyDetail | null> {
  const cacheKey = `detail:${symbol}`;
  const cached = detailsCache.get<YahooCompanyDetail>(cacheKey);
  if (cached) return cached;

  try {
    const modules = "price,summaryDetail,financialData,defaultKeyStatistics,assetProfile";
    const url = `${YAHOO_QUOTE_URL}/${symbol}.NS?modules=${modules}`;
    const res = await fetch(url, { headers: HEADERS, next: { revalidate: 900 } });

    if (!res.ok) return null;

    const json = await res.json();
    const result = json?.quoteSummary?.result?.[0];
    if (!result) return null;

    const price = result.price ?? {};
    const summary = result.summaryDetail ?? {};
    const financial = result.financialData ?? {};
    const keyStats = result.defaultKeyStatistics ?? {};
    const asset = result.assetProfile ?? {};

    const detail: YahooCompanyDetail = {
      symbol,
      longName: price.longName,
      sector: asset.sector,
      industry: asset.industry,
      website: asset.website,
      summary: asset.longBusinessSummary,
      marketCap: price.marketCap?.raw,
      peRatio: summary.trailingPE?.raw ?? keyStats.trailingPE?.raw,
      forwardPE: summary.forwardPE?.raw ?? keyStats.forwardPE?.raw,
      eps: keyStats.trailingEps?.raw ?? financial.earningsGrowth?.raw,
      dividendYield: summary.dividendYield?.raw ? summary.dividendYield.raw * 100 : undefined,
      debtToEquity: financial.debtToEquity?.raw ? financial.debtToEquity.raw / 100 : undefined,
      roe: financial.returnOnEquity?.raw ? financial.returnOnEquity.raw * 100 : undefined,
      revenueGrowth: financial.revenueGrowth?.raw ? financial.revenueGrowth.raw * 100 : undefined,
      profitMargin: financial.profitMargins?.raw ? financial.profitMargins.raw * 100 : undefined,
      week52High: summary.fiftyTwoWeekHigh?.raw,
      week52Low: summary.fiftyTwoWeekLow?.raw,
      avgVolume: summary.averageVolume?.raw,
      beta: summary.beta?.raw,
    };

    detailsCache.set(cacheKey, detail, DETAIL_TTL);
    return detail;
  } catch (err) {
    console.warn(`[Yahoo Finance] Failed to fetch details for ${symbol}:`, err);
    return null;
  }
}

/** Fetch price history for charting */
export async function fetchPriceHistory(
  symbol: string,
  range: string = "1mo"
): Promise<PricePoint[] | null> {
  const cacheKey = `history:${symbol}:${range}`;
  const cached = historyCache.get<PricePoint[]>(cacheKey);
  if (cached) return cached;

  try {
    const interval = range === "1d" ? "5m" : range === "5d" ? "15m" : "1d";
    const url = `${YAHOO_CHART_URL}/${symbol}.NS?interval=${interval}&range=${range}`;
    const res = await fetch(url, { headers: HEADERS, next: { revalidate: 1800 } });

    if (!res.ok) return null;

    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result?.timestamp || !result?.indicators?.quote?.[0]) return null;

    const timestamps: number[] = result.timestamp;
    const quote = result.indicators.quote[0];
    const points: PricePoint[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      if (quote.close[i] == null) continue;
      points.push({
        date: new Date(timestamps[i] * 1000).toISOString(),
        open: quote.open[i] ?? quote.close[i],
        high: quote.high[i] ?? quote.close[i],
        low: quote.low[i] ?? quote.close[i],
        close: quote.close[i],
        volume: quote.volume[i] ?? 0,
      });
    }

    historyCache.set(cacheKey, points, HISTORY_TTL);
    return points;
  } catch (err) {
    console.warn(`[Yahoo Finance] Failed to fetch history for ${symbol}:`, err);
    return null;
  }
}

/** Check if Yahoo Finance is reachable by attempting to fetch one quote */
export async function isYahooFinanceAvailable(): Promise<boolean> {
  try {
    const quote = await fetchLiveQuote("RELIANCE");
    return quote !== null;
  } catch {
    return false;
  }
}
