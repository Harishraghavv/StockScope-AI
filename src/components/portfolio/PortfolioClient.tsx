"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { StockQuote } from "@/lib/market-types";
import { usePortfolioStore, type Holding } from "@/lib/stores/portfolio";
import { formatPercent } from "@/lib/format";

export default function PortfolioClient({ stocks }: { stocks: StockQuote[] }) {
  const { holdings, addHolding, removeHolding } = usePortfolioStore();
  const [showModal, setShowModal] = useState(false);
  const [formSymbol, setFormSymbol] = useState("");
  const [formQty, setFormQty] = useState("");
  const [formCost, setFormCost] = useState("");

  const stockMap = useMemo(() => new Map(stocks.map((s) => [s.symbol, s])), [stocks]);

  const portfolioData = useMemo(() => {
    return holdings.map((h) => {
      const stock = stockMap.get(h.symbol);
      const currentPrice = stock?.price ?? h.avgCost;
      const currentValue = currentPrice * h.quantity;
      const investedValue = h.avgCost * h.quantity;
      const pnl = currentValue - investedValue;
      const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;
      return { ...h, stock, currentPrice, currentValue, investedValue, pnl, pnlPercent };
    });
  }, [holdings, stockMap]);

  const totals = useMemo(() => {
    const totalValue = portfolioData.reduce((s, p) => s + p.currentValue, 0);
    const totalInvested = portfolioData.reduce((s, p) => s + p.investedValue, 0);
    const totalPnl = totalValue - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
    const dayPnl = portfolioData.reduce((s, p) => {
      const dayChange = p.stock ? p.stock.change * p.quantity : 0;
      return s + dayChange;
    }, 0);
    return { totalValue, totalInvested, totalPnl, totalPnlPercent, dayPnl };
  }, [portfolioData]);

  // Sector allocation for donut chart
  const sectorAlloc = useMemo(() => {
    const map = new Map<string, number>();
    portfolioData.forEach((p) => {
      const sector = p.stock?.sector ?? "Other";
      map.set(sector, (map.get(sector) ?? 0) + p.currentValue);
    });
    const total = totals.totalValue || 1;
    return Array.from(map.entries())
      .map(([sector, value]) => ({ sector, value, percent: (value / total) * 100 }))
      .sort((a, b) => b.percent - a.percent);
  }, [portfolioData, totals.totalValue]);

  const SECTOR_COLORS: Record<string, string> = {
    Energy: "#F59E0B", IT: "#3B82F6", Banking: "#10B981", FMCG: "#8B5CF6",
    Pharma: "#EC4899", Automobile: "#F97316", Metals: "#6B7280", Telecom: "#06B6D4",
    Infrastructure: "#EF4444", "Consumer Goods": "#84CC16", Power: "#A855F7", Other: "#9CA3AF",
  };

  const handleAdd = () => {
    if (!formSymbol || !formQty || !formCost) return;
    addHolding({ symbol: formSymbol, quantity: Number(formQty), avgCost: Number(formCost) });
    setFormSymbol(""); setFormQty(""); setFormCost("");
    setShowModal(false);
  };

  // Build conic-gradient for donut
  let gradientParts: string[] = [];
  let cumPercent = 0;
  sectorAlloc.forEach((s) => {
    const color = SECTOR_COLORS[s.sector] ?? "#9CA3AF";
    gradientParts.push(`${color} ${cumPercent}% ${cumPercent + s.percent}%`);
    cumPercent += s.percent;
  });
  const donutGradient = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div>
      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Value", value: `₹${totals.totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` },
          { label: "Day's P&L", value: `₹${Math.abs(totals.dayPnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, isUp: totals.dayPnl >= 0 },
          { label: "Total P&L", value: `₹${Math.abs(totals.totalPnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, isUp: totals.totalPnl >= 0 },
          { label: "Total Return", value: formatPercent(totals.totalPnlPercent), isUp: totals.totalPnlPercent >= 0 },
        ].map((card) => (
          <div key={card.label} className="animate-slide-up rounded-xl border border-ink/8 bg-white p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark">
            <p className="text-xs text-ink/45 dark:text-paper/45">{card.label}</p>
            <p className={`mt-1 font-display text-xl font-medium ${
              card.isUp !== undefined ? (card.isUp ? "text-rise" : "text-fall") : "text-ink dark:text-paper"
            }`}>
              {card.isUp !== undefined && (card.isUp ? "+" : "-")}{card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Holdings table */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-ink/8 bg-white shadow-card dark:border-paper/10 dark:bg-surface-dark">
            <div className="flex items-center justify-between border-b border-ink/8 px-4 py-3 dark:border-paper/10">
              <h2 className="font-display text-[15px] font-medium text-ink dark:text-paper">Holdings</h2>
              <button
                onClick={() => setShowModal(true)}
                className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-brand-400"
              >
                + Add holding
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/8 text-xs text-ink/45 dark:border-paper/10 dark:text-paper/45">
                    <th className="px-4 py-2.5 text-left font-medium">Stock</th>
                    <th className="px-3 py-2.5 text-right font-medium">Qty</th>
                    <th className="px-3 py-2.5 text-right font-medium">Avg Cost</th>
                    <th className="px-3 py-2.5 text-right font-medium">Current</th>
                    <th className="px-3 py-2.5 text-right font-medium">P&L</th>
                    <th className="px-3 py-2.5 text-right font-medium">Return</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-12 text-center text-ink/40 dark:text-paper/40">No holdings yet. Add your first stock.</td></tr>
                  ) : (
                    portfolioData.map((p, i) => (
                      <tr key={p.symbol} className={`animate-slide-up stagger-${Math.min(i + 1, 8)} border-b border-ink/5 transition-colors hover:bg-ink/[0.02] dark:border-paper/5 dark:hover:bg-paper/[0.03]`}>
                        <td className="px-4 py-3">
                          <Link href={`/company/${p.symbol}`} className="hover:text-brand-600 dark:hover:text-brand-400">
                            <p className="font-medium text-ink dark:text-paper">{p.symbol}</p>
                            <p className="text-xs text-ink/40 dark:text-paper/40">{p.stock?.name ?? p.symbol}</p>
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-ink dark:text-paper">{p.quantity}</td>
                        <td className="px-3 py-3 text-right font-mono text-ink/70 dark:text-paper/70">₹{p.avgCost.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-3 text-right font-mono text-ink dark:text-paper">₹{p.currentPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                        <td className={`px-3 py-3 text-right font-mono ${p.pnl >= 0 ? "text-rise" : "text-fall"}`}>
                          {p.pnl >= 0 ? "+" : ""}₹{Math.abs(p.pnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </td>
                        <td className={`px-3 py-3 text-right font-mono ${p.pnlPercent >= 0 ? "text-rise" : "text-fall"}`}>
                          {formatPercent(p.pnlPercent)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button onClick={() => removeHolding(p.symbol)} className="text-ink/20 transition-colors hover:text-fall dark:text-paper/20" title="Remove">✕</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Allocation chart */}
        <div>
          <div className="rounded-xl border border-ink/8 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
            <h3 className="font-display text-[15px] font-medium text-ink dark:text-paper">Sector Allocation</h3>
            {sectorAlloc.length > 0 ? (
              <>
                <div className="mt-4 flex justify-center">
                  <div
                    className="relative h-44 w-44 rounded-full"
                    style={{ background: donutGradient }}
                  >
                    <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark">
                      <span className="text-center text-xs text-ink/50 dark:text-paper/50">{sectorAlloc.length} sectors</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {sectorAlloc.map((s) => (
                    <div key={s.sector} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: SECTOR_COLORS[s.sector] ?? "#9CA3AF" }} />
                        <span className="text-ink/70 dark:text-paper/70">{s.sector}</span>
                      </div>
                      <span className="font-mono text-ink dark:text-paper">{s.percent.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-4 text-center text-sm text-ink/40 dark:text-paper/40">Add holdings to see allocation.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add holding modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-6 shadow-xl dark:border-paper/10 dark:bg-surface-dark animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-medium text-ink dark:text-paper">Add Holding</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Stock</label>
                <select value={formSymbol} onChange={(e) => setFormSymbol(e.target.value)} className="w-full rounded-lg border border-ink/10 bg-transparent px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none dark:border-paper/10 dark:text-paper">
                  <option value="">Select stock...</option>
                  {stocks.map((s) => <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Quantity</label>
                <input type="number" value={formQty} onChange={(e) => setFormQty(e.target.value)} placeholder="e.g. 10" className="w-full rounded-lg border border-ink/10 bg-transparent px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none dark:border-paper/10 dark:text-paper" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Average Cost (₹)</label>
                <input type="number" value={formCost} onChange={(e) => setFormCost(e.target.value)} placeholder="e.g. 2500" className="w-full rounded-lg border border-ink/10 bg-transparent px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none dark:border-paper/10 dark:text-paper" />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-sm text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper">Cancel</button>
              <button onClick={handleAdd} disabled={!formSymbol || !formQty || !formCost} className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed">Add to portfolio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
