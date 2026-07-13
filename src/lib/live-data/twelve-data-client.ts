// ============================================================
// Twelve Data client — isolated so it's the ONLY file in the app that
// talks to the external live-data provider directly. Everything else
// (dashboard, screener, company pages) reads from the LiveQuote table
// in Postgres, which this module populates on a schedule.
//
// Free tier limits: 8 requests/minute, 800/day. We batch symbols into
// a single request using Twelve Data's comma-separated `symbol` param
// to make this go much further — one call can return many quotes.
// ============================================================

const TWELVE_DATA_BASE_URL = "https://api.twelvedata.com";

export interface RawQuote {
  symbol: string;
  name: string;
  close: string;
  previous_close: string;
  volume: string;
  percent_change: string;
}

export interface FetchedQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export class TwelveDataError extends Error {}

/**
 * Fetches quotes for multiple NSE symbols in a single API call.
 * Twelve Data expects symbols like "RELIANCE.NSE" for Indian equities.
 */
export async function fetchLiveQuotes(symbols: string[]): Promise<FetchedQuote[]> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    throw new TwelveDataError("TWELVE_DATA_API_KEY is not set in .env");
  }

  const nseSymbols = symbols.map((s) => `${s}.NSE`).join(",");
  const url = `${TWELVE_DATA_BASE_URL}/quote?symbol=${encodeURIComponent(nseSymbols)}&apikey=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new TwelveDataError(`Twelve Data request failed: ${response.status}`);
  }

  const data = await response.json();

  // Twelve Data returns a single object (not wrapped in an array) when
  // only one symbol was requested, and a map of symbol -> quote when
  // multiple were requested. Normalize both shapes to an array.
  const entries: RawQuote[] = symbols.length === 1 ? [data] : Object.values(data);

  const quotes: FetchedQuote[] = [];
  for (const entry of entries) {
    if (!entry || entry.symbol === undefined) continue; // skip error entries
    const price = Number(entry.close);
    const previousClose = Number(entry.previous_close);
    if (Number.isNaN(price) || Number.isNaN(previousClose)) continue;

    quotes.push({
      symbol: entry.symbol,
      name: entry.name ?? entry.symbol,
      price,
      change: Number((price - previousClose).toFixed(2)),
      changePercent: Number(entry.percent_change ?? 0),
      volume: Number(entry.volume ?? 0),
    });
  }

  return quotes;
}
