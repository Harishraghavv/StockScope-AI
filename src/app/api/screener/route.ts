import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getScreenerResults, getAvailableSectors } from "@/lib/providers/screener-data";
import type { ScreenerFilters } from "@/lib/market-types";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return apiError("Not authenticated.", 401);

  const params = req.nextUrl.searchParams;
  const filters: ScreenerFilters = {};

  const str = (key: string) => params.get(key) || undefined;
  const num = (key: string) => {
    const v = params.get(key);
    return v !== null && v !== "" ? Number(v) : undefined;
  };
  const bool = (key: string) => params.get(key) === "true" || undefined;

  filters.search = str("search");
  filters.sector = str("sector");
  filters.marketCapMin = num("marketCapMin");
  filters.marketCapMax = num("marketCapMax");
  filters.peMin = num("peMin");
  filters.peMax = num("peMax");
  filters.roeMin = num("roeMin");
  filters.roceMin = num("roceMin");
  filters.epsMin = num("epsMin");
  filters.revenueGrowthMin = num("revenueGrowthMin");
  filters.profitGrowthMin = num("profitGrowthMin");
  filters.debtToEquityMax = num("debtToEquityMax");
  filters.dividendYieldMin = num("dividendYieldMin");
  filters.rsiMin = num("rsiMin");
  filters.rsiMax = num("rsiMax");
  filters.near52WeekHigh = bool("near52WeekHigh");
  filters.near52WeekLow = bool("near52WeekLow");
  filters.sortBy = (str("sortBy") as ScreenerFilters["sortBy"]) || undefined;
  filters.sortDir = (str("sortDir") as ScreenerFilters["sortDir"]) || undefined;

  const [results, sectors] = await Promise.all([
    getScreenerResults(filters),
    getAvailableSectors(),
  ]);

  return apiSuccess({ results, sectors });
}
