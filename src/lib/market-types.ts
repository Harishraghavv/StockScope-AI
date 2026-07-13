// Shared types for market data. These shapes are the "contract" the UI
// builds against — the mock provider and any future live-data provider
// (Alpha Vantage, Twelve Data, etc.) both implement this same shape, so
// swapping mock for real data later doesn't touch component code.

export interface StockQuote {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number; // absolute change
  changePercent: number;
  volume: number;
  marketCap: number; // in crores
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface SectorPerformance {
  sector: string;
  changePercent: number;
  marketCap: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  publishedAt: string; // ISO string
  relatedSymbol?: string;
  summary: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

// Extended shape used by the Stock Screener — adds fundamental ratios and
// technical indicators on top of the base quote. Kept separate from
// StockQuote so the Dashboard module's data/components are unaffected.
export interface ScreenerStock extends StockQuote {
  peRatio: number;
  roe: number; // %
  roce: number; // %
  eps: number; // ₹
  debtToEquity: number;
  revenueGrowth: number; // % YoY
  profitGrowth: number; // % YoY
  dividendYield: number; // %
  week52High: number;
  week52Low: number;
  rsi: number; // 0-100
  macd: number; // signal line delta
  movingAverage50: number;
}

export interface ScreenerFilters {
  search?: string;
  sector?: string;
  marketCapMin?: number;
  marketCapMax?: number;
  peMin?: number;
  peMax?: number;
  roeMin?: number;
  roceMin?: number;
  epsMin?: number;
  revenueGrowthMin?: number;
  profitGrowthMin?: number;
  debtToEquityMax?: number;
  dividendYieldMin?: number;
  rsiMin?: number;
  rsiMax?: number;
  near52WeekHigh?: boolean;
  near52WeekLow?: boolean;
  sortBy?: keyof ScreenerStock;
  sortDir?: "asc" | "desc";
}

export interface SavedScreener {
  id: string;
  name: string;
  filters: ScreenerFilters;
  createdAt: string;
}
