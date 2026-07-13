import { NextRequest, NextResponse } from "next/server";
import { getAllStocks, isLiveDataActive } from "@/lib/providers/market-data";
import { getStockBySymbol } from "@/lib/providers/market-data";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");

  if (symbol) {
    const stock = await getStockBySymbol(symbol);
    if (!stock) {
      return NextResponse.json({ error: "Symbol not found" }, { status: 404 });
    }
    const isLive = await isLiveDataActive();
    return NextResponse.json({ stock, isLive });
  }

  const [stocks, isLive] = await Promise.all([
    getAllStocks(),
    isLiveDataActive(),
  ]);

  return NextResponse.json({ stocks, isLive, count: stocks.length });
}
