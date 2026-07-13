"use client";

import Link from "next/link";
import type { ScreenerStock } from "@/lib/market-types";
import { formatPercent, formatMarketCapCrores } from "@/lib/format";

const COLUMNS: { key: keyof ScreenerStock; label: string; format?: (v: number) => string }[] = [
  { key: "price", label: "Price", format: (v) => `₹${v.toLocaleString("en-IN")}` },
  { key: "changePercent", label: "Chg %", format: formatPercent },
  { key: "marketCap", label: "Mkt cap", format: formatMarketCapCrores },
  { key: "peRatio", label: "P/E" },
  { key: "roe", label: "ROE %" },
  { key: "roce", label: "ROCE %" },
  { key: "eps", label: "EPS" },
  { key: "debtToEquity", label: "D/E" },
  { key: "revenueGrowth", label: "Rev grw %" },
  { key: "dividendYield", label: "Div yield %" },
  { key: "rsi", label: "RSI" },
];

export default function ResultsTable({
  results,
  sortBy,
  sortDir,
  onSort,
}: {
  results: ScreenerStock[];
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSort: (key: keyof ScreenerStock) => void;
}) {
  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-ink/8 bg-white p-10 text-center shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <p className="text-[15px] font-medium text-ink dark:text-paper">
          No companies match these filters.
        </p>
        <p className="mt-1 text-sm text-ink/50 dark:text-paper/50">
          Try widening a range or clearing a filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-ink/8 bg-white shadow-card dark:border-paper/10 dark:bg-surface-dark">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink/8 dark:border-paper/10">
            <th className="sticky left-0 bg-white px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-ink/45 dark:bg-surface-dark dark:text-paper/45">
              Company
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => onSort(col.key)}
                className="cursor-pointer select-none whitespace-nowrap px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-ink/45 hover:text-ink dark:text-paper/45 dark:hover:text-paper"
              >
                {col.label}
                {sortBy === col.key && (sortDir === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((stock) => (
            <tr
              key={stock.symbol}
              className="border-b border-ink/6 last:border-0 hover:bg-ink/[0.02] dark:border-paper/8 dark:hover:bg-paper/[0.03]"
            >
              <td className="sticky left-0 bg-white px-4 py-2.5 dark:bg-surface-dark">
                <Link href={`/company/${stock.symbol}`} className="block">
                  <p className="text-[13.5px] font-medium text-ink hover:text-brand-600 dark:text-paper dark:hover:text-brand-400">
                    {stock.symbol}
                  </p>
                  <p className="truncate text-xs text-ink/45 dark:text-paper/45">
                    {stock.name}
                  </p>
                </Link>
              </td>
              {COLUMNS.map((col) => {
                const raw = stock[col.key];
                const value = typeof raw === "number" ? raw : 0;
                const display = col.format ? col.format(value) : value.toString();
                const isChangeCol = col.key === "changePercent";
                return (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-3 py-2.5 text-right font-mono text-[13px] ${
                      isChangeCol
                        ? value >= 0
                          ? "text-rise"
                          : "text-fall"
                        : "text-ink/80 dark:text-paper/80"
                    }`}
                  >
                    {display}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
