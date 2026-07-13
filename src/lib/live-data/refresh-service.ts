import { prisma } from "@/lib/prisma";
import { fetchLiveQuotes, TwelveDataError } from "./twelve-data-client";
import { MOCK_STOCKS } from "@/lib/mock-data/stocks";

// The set of symbols we keep live-cached — currently the same 20-stock
// universe used by the mock data, so dashboard/screener/company pages
// don't need to change their symbol lists, only their data source.
const TRACKED_SYMBOLS = MOCK_STOCKS.map((s) => s.symbol);

export interface RefreshResult {
  updated: number;
  failed: number;
  skipped: boolean;
  reason?: string;
}

/**
 * Refreshes the LiveQuote cache table from Twelve Data. Safe to call
 * repeatedly — if no API key is configured, it's a no-op (mock data
 * keeps serving via the provider fallback). If the API call fails
 * (rate limit, network, etc.), existing cached rows are marked `stale`
 * rather than deleted, so the app degrades gracefully instead of
 * breaking.
 */
export async function refreshLiveQuotes(): Promise<RefreshResult> {
  if (!process.env.TWELVE_DATA_API_KEY) {
    return { updated: 0, failed: 0, skipped: true, reason: "No TWELVE_DATA_API_KEY configured." };
  }

  try {
    const quotes = await fetchLiveQuotes(TRACKED_SYMBOLS);

    if (quotes.length === 0) {
      await markAllStale();
      return { updated: 0, failed: TRACKED_SYMBOLS.length, skipped: false, reason: "Empty response from provider." };
    }

    await Promise.all(
      quotes.map((q) =>
        prisma.liveQuote.upsert({
          where: { symbol: q.symbol },
          create: {
            symbol: q.symbol,
            name: q.name,
            price: q.price,
            change: q.change,
            changePercent: q.changePercent,
            volume: BigInt(Math.floor(q.volume)),
            stale: false,
          },
          update: {
            price: q.price,
            change: q.change,
            changePercent: q.changePercent,
            volume: BigInt(Math.floor(q.volume)),
            fetchedAt: new Date(),
            stale: false,
          },
        })
      )
    );

    const failedCount = TRACKED_SYMBOLS.length - quotes.length;
    return { updated: quotes.length, failed: failedCount, skipped: false };
  } catch (err) {
    console.error("Live quote refresh failed:", err);
    await markAllStale();
    const reason = err instanceof TwelveDataError ? err.message : "Unknown error during refresh.";
    return { updated: 0, failed: TRACKED_SYMBOLS.length, skipped: false, reason };
  }
}

async function markAllStale(): Promise<void> {
  await prisma.liveQuote.updateMany({
    where: { symbol: { in: TRACKED_SYMBOLS } },
    data: { stale: true },
  });
}
