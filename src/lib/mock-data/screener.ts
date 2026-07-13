import { MOCK_STOCKS } from "@/lib/mock-data/stocks";
import type { ScreenerStock } from "@/lib/market-types";

// Deterministic pseudo-random generator seeded per-symbol, so fundamentals
// stay stable across requests/reloads instead of jittering — important for
// a screener where filter results should be reproducible in a demo.
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
}

function range(rand: () => number, min: number, max: number): number {
  return Number((min + rand() * (max - min)).toFixed(2));
}

// Sector-level baseline ratios, so e.g. IT stocks trend to higher ROE/PE
// than capital-intensive sectors — makes filter results feel plausible.
const SECTOR_PROFILE: Record<string, { pe: [number, number]; roe: [number, number]; debt: [number, number] }> = {
  IT: { pe: [18, 32], roe: [22, 34], debt: [0, 0.3] },
  Banking: { pe: [10, 18], roe: [12, 18], debt: [0, 0.2] },
  FMCG: { pe: [35, 60], roe: [25, 45], debt: [0.1, 0.5] },
  Energy: { pe: [8, 16], roe: [10, 16], debt: [0.4, 1.1] },
  Pharma: { pe: [22, 38], roe: [14, 22], debt: [0.1, 0.6] },
  Automobile: { pe: [20, 35], roe: [14, 20], debt: [0.2, 0.7] },
  Metals: { pe: [6, 14], roe: [8, 16], debt: [0.5, 1.4] },
  Telecom: { pe: [25, 45], roe: [4, 10], debt: [1.2, 2.4] },
  Infrastructure: { pe: [15, 28], roe: [10, 16], debt: [0.6, 1.3] },
  "Consumer Goods": { pe: [40, 70], roe: [20, 32], debt: [0.05, 0.3] },
  Power: { pe: [10, 18], roe: [10, 15], debt: [0.8, 1.6] },
};

const DEFAULT_PROFILE = { pe: [15, 30] as [number, number], roe: [10, 20] as [number, number], debt: [0.2, 0.9] as [number, number] };

export function buildScreenerUniverse(): ScreenerStock[] {
  return MOCK_STOCKS.map((stock) => {
    const rand = seededRandom(stock.symbol);
    const profile = SECTOR_PROFILE[stock.sector] ?? DEFAULT_PROFILE;

    const peRatio = range(rand, ...profile.pe);
    const roe = range(rand, ...profile.roe);
    const roce = Number((roe * range(rand, 0.75, 1.05)).toFixed(2));
    const debtToEquity = range(rand, ...profile.debt);
    const eps = Number((stock.price / peRatio).toFixed(2));
    const revenueGrowth = range(rand, -5, 22);
    const profitGrowth = range(rand, -12, 28);
    const dividendYield = range(rand, 0, 3.5);
    const week52High = Number((stock.price * range(rand, 1.08, 1.42)).toFixed(2));
    const week52Low = Number((stock.price * range(rand, 0.62, 0.92)).toFixed(2));
    const rsi = range(rand, 25, 78);
    const macd = range(rand, -12, 12);
    const movingAverage50 = Number((stock.price * range(rand, 0.94, 1.05)).toFixed(2));

    return {
      ...stock,
      peRatio,
      roe,
      roce,
      eps,
      debtToEquity,
      revenueGrowth,
      profitGrowth,
      dividendYield,
      week52High,
      week52Low,
      rsi,
      macd,
      movingAverage50,
    };
  });
}
