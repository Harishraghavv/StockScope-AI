import { getStockBySymbol } from "./market-data";
import { buildScreenerUniverse } from "@/lib/mock-data/screener";
import { getCompanyDetails } from "@/lib/mock-data/company-details";
import type { ScreenerStock } from "@/lib/market-types";

export interface CompanyFullData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  // Fundamentals
  peRatio: number;
  roe: number;
  roce: number;
  eps: number;
  debtToEquity: number;
  revenueGrowth: number;
  profitGrowth: number;
  dividendYield: number;
  week52High: number;
  week52Low: number;
  rsi: number;
  macd: number;
  movingAverage50: number;
  // Detailed info
  about: string;
  quarterlyResults: { quarter: string; revenue: number; profit: number; eps: number }[];
  shareholding: { promoter: number; fii: number; dii: number; public: number };
  competitors: string[];
}

export async function getCompanyFullData(symbol: string): Promise<CompanyFullData | null> {
  const stock = await getStockBySymbol(symbol);
  if (!stock) return null;

  const universe = buildScreenerUniverse();
  const screenerData = universe.find(
    (s) => s.symbol.toUpperCase() === symbol.toUpperCase()
  ) as ScreenerStock | undefined;

  const details = getCompanyDetails(symbol);

  return {
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: stock.volume,
    marketCap: stock.marketCap,
    // Fundamentals from screener mock data
    peRatio: screenerData?.peRatio ?? 0,
    roe: screenerData?.roe ?? 0,
    roce: screenerData?.roce ?? 0,
    eps: screenerData?.eps ?? 0,
    debtToEquity: screenerData?.debtToEquity ?? 0,
    revenueGrowth: screenerData?.revenueGrowth ?? 0,
    profitGrowth: screenerData?.profitGrowth ?? 0,
    dividendYield: screenerData?.dividendYield ?? 0,
    week52High: screenerData?.week52High ?? stock.price * 1.2,
    week52Low: screenerData?.week52Low ?? stock.price * 0.7,
    rsi: screenerData?.rsi ?? 50,
    macd: screenerData?.macd ?? 0,
    movingAverage50: screenerData?.movingAverage50 ?? stock.price,
    // Detailed company info
    about: details?.about ?? `${stock.name} is a leading company in the ${stock.sector} sector listed on the NSE.`,
    quarterlyResults: details?.quarterlyResults ?? [],
    shareholding: details?.shareholding ?? { promoter: 45, fii: 20, dii: 20, public: 15 },
    competitors: details?.competitors ?? [],
  };
}
