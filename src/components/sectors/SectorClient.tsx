"use client";

import { useState } from "react";
import Link from "next/link";
import type { StockQuote, SectorPerformance } from "@/lib/market-types";
import { formatPercent, formatMarketCapCrores } from "@/lib/format";

export default function SectorClient({
  sectors,
  stocks,
}: {
  sectors: SectorPerformance[];
  stocks: StockQuote[];
}) {
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  const stocksBySector = new Map<string, StockQuote[]>();
  stocks.forEach((s) => {
    const arr = stocksBySector.get(s.sector) ?? [];
    arr.push(s);
    stocksBySector.set(s.sector, arr);
  });

  return (
    <div>
      {/* Sector cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((sector, i) => {
          const isExpanded = expandedSector === sector.sector;
          const sectorStocks = stocksBySector.get(sector.sector) ?? [];
          const isUp = sector.changePercent >= 0;

          return (
            <div
              key={sector.sector}
              className={`animate-slide-up stagger-${Math.min(i + 1, 8)} rounded-xl border bg-white shadow-card transition-all dark:bg-surface-dark ${
                isExpanded
                  ? "border-brand-500/40 ring-1 ring-brand-500/20"
                  : "border-ink/8 hover:border-ink/15 dark:border-paper/10 dark:hover:border-paper/20"
              }`}
            >
              <button
                onClick={() => setExpandedSector(isExpanded ? null : sector.sector)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div>
                  <h3 className="font-display text-[15px] font-medium text-ink dark:text-paper">
                    {sector.sector}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink/40 dark:text-paper/40">
                    {sectorStocks.length} stock{sectorStocks.length !== 1 ? "s" : ""} · {formatMarketCapCrores(sector.marketCap)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-mono text-lg font-medium ${isUp ? "text-rise" : "text-fall"}`}>
                    {formatPercent(sector.changePercent)}
                  </p>
                  <span className="text-xs text-ink/30 dark:text-paper/30">
                    {isExpanded ? "▲ collapse" : "▼ expand"}
                  </span>
                </div>
              </button>

              {isExpanded && sectorStocks.length > 0 && (
                <div className="border-t border-ink/8 p-2 dark:border-paper/10 animate-slide-down">
                  {sectorStocks.map((stock) => {
                    const stockIsUp = stock.changePercent >= 0;
                    return (
                      <Link
                        key={stock.symbol}
                        href={`/company/${stock.symbol}`}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-ink/[0.03] dark:hover:bg-paper/[0.05]"
                      >
                        <div>
                          <p className="text-sm font-medium text-ink dark:text-paper">{stock.symbol}</p>
                          <p className="text-xs text-ink/40 dark:text-paper/40">{stock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm text-ink dark:text-paper">
                            ₹{stock.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                          </p>
                          <p className={`font-mono text-xs ${stockIsUp ? "text-rise" : "text-fall"}`}>
                            {formatPercent(stock.changePercent)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sector comparison table */}
      <div className="mt-8 rounded-xl border border-ink/8 bg-white shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <div className="border-b border-ink/8 px-4 py-3 dark:border-paper/10">
          <h2 className="font-display text-[15px] font-medium text-ink dark:text-paper">Sector Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/8 text-xs text-ink/45 dark:border-paper/10 dark:text-paper/45">
                <th className="px-4 py-2.5 text-left font-medium">Sector</th>
                <th className="px-3 py-2.5 text-right font-medium">Stocks</th>
                <th className="px-3 py-2.5 text-right font-medium">Avg Change</th>
                <th className="px-3 py-2.5 text-right font-medium">Market Cap</th>
                <th className="px-3 py-2.5 text-right font-medium">Signal</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((s) => {
                const count = stocksBySector.get(s.sector)?.length ?? 0;
                const isUp = s.changePercent >= 0;
                return (
                  <tr key={s.sector} className="border-b border-ink/5 dark:border-paper/5">
                    <td className="px-4 py-3 font-medium text-ink dark:text-paper">{s.sector}</td>
                    <td className="px-3 py-3 text-right font-mono text-ink/70 dark:text-paper/70">{count}</td>
                    <td className={`px-3 py-3 text-right font-mono ${isUp ? "text-rise" : "text-fall"}`}>
                      {formatPercent(s.changePercent)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-ink/70 dark:text-paper/70">
                      {formatMarketCapCrores(s.marketCap)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        s.changePercent >= 1 ? "bg-rise/10 text-rise" :
                        s.changePercent <= -1 ? "bg-fall/10 text-fall" :
                        "bg-ink/8 text-ink/50 dark:bg-paper/10 dark:text-paper/50"
                      }`}>
                        {s.changePercent >= 1 ? "Bullish" : s.changePercent <= -1 ? "Bearish" : "Neutral"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
