"use client";

import { useState } from "react";
import Link from "next/link";
import type { StockQuote } from "@/lib/market-types";
import { useWatchlistStore } from "@/lib/stores/watchlist";
import { formatPercent } from "@/lib/format";

export default function WatchlistClient({ stocks }: { stocks: StockQuote[] }) {
  const { lists, activeListId, setActiveList, addList, removeList, addSymbol, removeSymbol } = useWatchlistStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [searchSymbol, setSearchSymbol] = useState("");

  const activeList = lists.find((l) => l.id === activeListId) ?? lists[0];
  const stockMap = new Map(stocks.map((s) => [s.symbol, s]));
  const watchedStocks = activeList?.symbols.map((sym) => stockMap.get(sym)).filter(Boolean) as StockQuote[];

  const availableToAdd = stocks.filter((s) => !activeList?.symbols.includes(s.symbol))
    .filter((s) => !searchSymbol || s.symbol.toLowerCase().includes(searchSymbol.toLowerCase()) || s.name.toLowerCase().includes(searchSymbol.toLowerCase()));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Sidebar — Watchlist groups */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-ink/8 bg-white shadow-card dark:border-paper/10 dark:bg-surface-dark">
          <div className="border-b border-ink/8 px-4 py-3 dark:border-paper/10">
            <h2 className="font-display text-[15px] font-medium text-ink dark:text-paper">Your Lists</h2>
          </div>
          <div className="p-2">
            {lists.map((list) => (
              <button
                key={list.id}
                onClick={() => setActiveList(list.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  activeListId === list.id
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                    : "text-ink/60 hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-paper/5"
                }`}
              >
                <span className="font-medium">{list.name}</span>
                <span className="rounded-full bg-ink/8 px-2 py-0.5 text-xs dark:bg-paper/10">
                  {list.symbols.length}
                </span>
              </button>
            ))}
            <div className="mt-2 border-t border-ink/8 pt-2 dark:border-paper/10">
              {newListName !== "" ? (
                <div className="flex gap-2 px-1">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="List name..."
                    className="flex-1 rounded-lg border border-ink/10 bg-transparent px-2 py-1.5 text-sm text-ink focus:border-brand-500 focus:outline-none dark:border-paper/10 dark:text-paper"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newListName.trim()) {
                        addList(newListName.trim());
                        setNewListName("");
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => { if (newListName.trim()) { addList(newListName.trim()); setNewListName(""); } }}
                    className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-ink hover:bg-brand-400"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setNewListName(" ")}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
                >
                  + Create new list
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-ink/8 bg-white shadow-card dark:border-paper/10 dark:bg-surface-dark">
          <div className="flex items-center justify-between border-b border-ink/8 px-4 py-3 dark:border-paper/10">
            <div>
              <h2 className="font-display text-[15px] font-medium text-ink dark:text-paper">
                {activeList?.name ?? "Watchlist"}
              </h2>
              <p className="text-xs text-ink/40 dark:text-paper/40">
                {watchedStocks.length} stock{watchedStocks.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-brand-400"
              >
                {showAdd ? "Done" : "+ Add stock"}
              </button>
              {activeList?.id !== "default" && (
                <button
                  onClick={() => removeList(activeList.id)}
                  className="rounded-lg border border-fall/30 px-3 py-1.5 text-xs font-medium text-fall transition-colors hover:bg-fall/10"
                >
                  Delete list
                </button>
              )}
            </div>
          </div>

          {/* Add stock search */}
          {showAdd && (
            <div className="border-b border-ink/8 p-4 dark:border-paper/10 animate-slide-down">
              <input
                type="text"
                placeholder="Search stocks to add..."
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
                className="mb-3 w-full rounded-lg border border-ink/10 bg-transparent px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none dark:border-paper/10 dark:text-paper"
              />
              <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto">
                {availableToAdd.slice(0, 12).map((s) => (
                  <button
                    key={s.symbol}
                    onClick={() => addSymbol(activeList.id, s.symbol)}
                    className="rounded-full border border-ink/10 px-3 py-1 text-xs font-medium text-ink/70 transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 dark:border-paper/10 dark:text-paper/70 dark:hover:border-brand-500 dark:hover:bg-brand-500/15"
                  >
                    + {s.symbol}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock rows */}
          <div className="p-2">
            {watchedStocks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-ink/40 dark:text-paper/40">No stocks in this watchlist yet.</p>
                <button
                  onClick={() => setShowAdd(true)}
                  className="mt-2 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                >
                  Add your first stock →
                </button>
              </div>
            ) : (
              watchedStocks.map((stock, i) => {
                const isUp = stock.changePercent >= 0;
                return (
                  <div
                    key={stock.symbol}
                    className={`animate-slide-up stagger-${Math.min(i + 1, 8)} flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-ink/[0.03] dark:hover:bg-paper/[0.05]`}
                  >
                    <Link href={`/company/${stock.symbol}`} className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-ink dark:text-paper">{stock.symbol}</p>
                      <p className="text-xs text-ink/45 dark:text-paper/45">{stock.name}</p>
                    </Link>
                    <div className="mx-4 text-right">
                      <p className="font-mono text-[14px] text-ink dark:text-paper">
                        ₹{stock.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </p>
                      <p className={`font-mono text-xs ${isUp ? "text-rise" : "text-fall"}`}>
                        {formatPercent(stock.changePercent)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSymbol(activeList.id, stock.symbol)}
                      className="ml-2 rounded-full p-1.5 text-ink/25 transition-colors hover:bg-fall/10 hover:text-fall dark:text-paper/25"
                      title="Remove from watchlist"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
