"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { NewsItem, StockQuote } from "@/lib/market-types";
import { formatRelativeTime } from "@/lib/format";

const SECTORS = ["All", "IT", "Banking", "Energy", "FMCG", "Pharma", "Automobile", "Metals", "Telecom", "Infrastructure", "Consumer Goods", "Power"];

export default function NewsClient({
  news,
  stocks,
}: {
  news: NewsItem[];
  stocks: StockQuote[];
}) {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");

  const stockBySym = useMemo(() => new Map(stocks.map((s) => [s.symbol, s])), [stocks]);

  const filtered = useMemo(() => {
    return news.filter((item) => {
      const matchesSearch = !search || item.headline.toLowerCase().includes(search.toLowerCase()) || item.summary.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (sector === "All") return true;
      const stock = item.relatedSymbol ? stockBySym.get(item.relatedSymbol) : null;
      return stock?.sector === sector;
    });
  }, [news, search, sector, stockBySym]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search headlines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-brand-500 focus:outline-none dark:border-paper/10 dark:bg-surface-dark dark:text-paper dark:placeholder:text-paper/35"
          />
        </div>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none dark:border-paper/10 dark:bg-surface-dark dark:text-paper"
        >
          {SECTORS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-ink/40 dark:text-paper/40">
        Showing {filtered.length} of {news.length} articles
      </p>

      {/* News grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-ink/8 bg-white p-12 text-center dark:border-paper/10 dark:bg-surface-dark">
          <p className="text-ink/40 dark:text-paper/40">No news articles match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => {
            const stock = item.relatedSymbol ? stockBySym.get(item.relatedSymbol) : null;
            return (
              <article
                key={item.id}
                className={`animate-slide-up stagger-${Math.min(i + 1, 8)} group rounded-xl border border-ink/8 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg dark:border-paper/10 dark:bg-surface-dark`}
              >
                <div className="flex items-center gap-2 text-xs text-ink/40 dark:text-paper/40">
                  <span className="font-medium text-ink/60 dark:text-paper/60">{item.source}</span>
                  <span>·</span>
                  <span>{formatRelativeTime(item.publishedAt)}</span>
                </div>
                <h3 className="mt-2 font-display text-[15px] font-medium leading-snug text-ink dark:text-paper">
                  {item.headline}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/50 dark:text-paper/50">
                  {item.summary}
                </p>
                {stock && (
                  <Link
                    href={`/company/${stock.symbol}`}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-300"
                  >
                    {stock.symbol}
                    <span className={stock.changePercent >= 0 ? "text-rise" : "text-fall"}>
                      {stock.changePercent >= 0 ? "▲" : "▼"} {Math.abs(stock.changePercent).toFixed(2)}%
                    </span>
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
