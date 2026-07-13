"use client";

import { useState } from "react";
import type { CompanyFullData } from "@/lib/providers/company-data";
import AiSummaryPanel from "@/components/company/AiSummaryPanel";
import { formatPercent, formatINR, formatMarketCapCrores } from "@/lib/format";

const TABS = ["Overview", "Financials", "Technical", "Peers"] as const;

export default function CompanyClient({
  data,
  competitorData,
}: {
  data: CompanyFullData;
  competitorData: CompanyFullData[];
}) {
  const [tab, setTab] = useState<typeof TABS[number]>("Overview");

  return (
    <div>
      {/* Tab navigation */}
      <div className="mb-6 flex gap-1 rounded-xl border border-ink/8 bg-white p-1 shadow-card dark:border-paper/10 dark:bg-surface-dark">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-brand-500 text-ink"
                : "text-ink/50 hover:text-ink dark:text-paper/50 dark:hover:text-paper"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {tab === "Overview" && <OverviewTab data={data} />}
        {tab === "Financials" && <FinancialsTab data={data} />}
        {tab === "Technical" && <TechnicalTab data={data} />}
        {tab === "Peers" && <PeersTab data={data} competitors={competitorData} />}
      </div>
    </div>
  );
}

function OverviewTab({ data }: { data: CompanyFullData }) {
  return (
    <div className="space-y-6">
      {/* About */}
      <div className="rounded-xl border border-ink/8 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">About</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-paper/70">{data.about}</p>
      </div>

      {/* AI Summary */}
      <AiSummaryPanel symbol={data.symbol} />
    </div>
  );
}

function FinancialsTab({ data }: { data: CompanyFullData }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Quarterly Results */}
      <div className="lg:col-span-2 rounded-xl border border-ink/8 bg-white shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <div className="border-b border-ink/8 px-4 py-3 dark:border-paper/10">
          <h3 className="font-display text-[15px] font-medium text-ink dark:text-paper">Quarterly Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/8 text-xs text-ink/45 dark:border-paper/10 dark:text-paper/45">
                <th className="px-4 py-2.5 text-left font-medium">Quarter</th>
                <th className="px-3 py-2.5 text-right font-medium">Revenue (₹Cr)</th>
                <th className="px-3 py-2.5 text-right font-medium">Profit (₹Cr)</th>
                <th className="px-3 py-2.5 text-right font-medium">EPS (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.quarterlyResults.map((q, i) => {
                const prev = data.quarterlyResults[i + 1];
                const revGrowth = prev ? ((q.revenue - prev.revenue) / prev.revenue) * 100 : null;
                const profGrowth = prev ? ((q.profit - prev.profit) / prev.profit) * 100 : null;
                return (
                  <tr key={q.quarter} className="border-b border-ink/5 dark:border-paper/5">
                    <td className="px-4 py-3 font-medium text-ink dark:text-paper">{q.quarter}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-mono text-ink dark:text-paper">{q.revenue.toLocaleString("en-IN")}</span>
                      {revGrowth != null && (
                        <span className={`ml-1.5 text-xs ${revGrowth >= 0 ? "text-rise" : "text-fall"}`}>
                          {revGrowth >= 0 ? "▲" : "▼"}{Math.abs(revGrowth).toFixed(1)}%
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-mono text-ink dark:text-paper">{q.profit.toLocaleString("en-IN")}</span>
                      {profGrowth != null && (
                        <span className={`ml-1.5 text-xs ${profGrowth >= 0 ? "text-rise" : "text-fall"}`}>
                          {profGrowth >= 0 ? "▲" : "▼"}{Math.abs(profGrowth).toFixed(1)}%
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-ink dark:text-paper">₹{q.eps.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shareholding */}
      <div className="rounded-xl border border-ink/8 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <h3 className="font-display text-[15px] font-medium text-ink dark:text-paper">Shareholding Pattern</h3>
        <div className="mt-4 flex justify-center">
          <div
            className="relative h-40 w-40 rounded-full"
            style={{
              background: `conic-gradient(
                #10B981 0% ${data.shareholding.promoter}%,
                #3B82F6 ${data.shareholding.promoter}% ${data.shareholding.promoter + data.shareholding.fii}%,
                #F59E0B ${data.shareholding.promoter + data.shareholding.fii}% ${data.shareholding.promoter + data.shareholding.fii + data.shareholding.dii}%,
                #8B5CF6 ${data.shareholding.promoter + data.shareholding.fii + data.shareholding.dii}% 100%
              )`,
            }}
          >
            <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark">
              <span className="text-xs text-ink/40 dark:text-paper/40">100%</span>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {[
            { label: "Promoter", value: data.shareholding.promoter, color: "#10B981" },
            { label: "FII", value: data.shareholding.fii, color: "#3B82F6" },
            { label: "DII", value: data.shareholding.dii, color: "#F59E0B" },
            { label: "Public", value: data.shareholding.public, color: "#8B5CF6" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-ink/70 dark:text-paper/70">{s.label}</span>
              </div>
              <span className="font-mono text-ink dark:text-paper">{s.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechnicalTab({ data }: { data: CompanyFullData }) {
  const rsiZone = data.rsi < 30 ? "oversold" : data.rsi > 70 ? "overbought" : "neutral";
  const rsiColor = rsiZone === "oversold" ? "text-rise" : rsiZone === "overbought" ? "text-fall" : "text-gold";
  const priceInRange = data.week52Low < data.week52High
    ? ((data.price - data.week52Low) / (data.week52High - data.week52Low)) * 100
    : 50;
  const aboveMA = data.price > data.movingAverage50;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* RSI Gauge */}
      <div className="rounded-xl border border-ink/8 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">RSI (14)</h3>
        <div className="mt-4 flex items-center justify-center">
          <div className="relative">
            {/* Semicircle gauge */}
            <svg width="160" height="90" viewBox="0 0 160 90">
              {/* Background arc */}
              <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke="currentColor" className="text-ink/10 dark:text-paper/10" strokeWidth="12" strokeLinecap="round" />
              {/* Value arc */}
              <path
                d="M 10 80 A 70 70 0 0 1 150 80"
                fill="none"
                stroke={rsiZone === "oversold" ? "#1FA06A" : rsiZone === "overbought" ? "#D64545" : "#C99A3E"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(data.rsi / 100) * 220} 220`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
              <span className={`font-display text-3xl font-medium ${rsiColor}`}>{data.rsi.toFixed(0)}</span>
              <span className="text-xs capitalize text-ink/40 dark:text-paper/40">{rsiZone}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-ink/30 dark:text-paper/30">
          <span>0 (Oversold)</span>
          <span>100 (Overbought)</span>
        </div>
      </div>

      {/* MACD */}
      <div className="rounded-xl border border-ink/8 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">MACD</h3>
        <div className="mt-6 flex flex-col items-center">
          <div className="relative h-24 w-full max-w-[200px]">
            {/* Zero line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-ink/15 dark:bg-paper/15" />
            {/* MACD bar */}
            <div className="absolute left-1/2 -translate-x-1/2" style={{
              width: "40px",
              height: `${Math.min(Math.abs(data.macd) * 3, 40)}px`,
              background: data.macd >= 0 ? "#1FA06A" : "#D64545",
              borderRadius: "4px",
              ...(data.macd >= 0
                ? { bottom: "50%" }
                : { top: "50%" }
              ),
            }} />
          </div>
          <p className={`mt-2 font-mono text-2xl font-medium ${data.macd >= 0 ? "text-rise" : "text-fall"}`}>
            {data.macd >= 0 ? "+" : ""}{data.macd.toFixed(2)}
          </p>
          <p className="text-xs text-ink/40 dark:text-paper/40">
            {data.macd >= 0 ? "Bullish momentum" : "Bearish momentum"}
          </p>
        </div>
      </div>

      {/* 50-Day MA */}
      <div className="rounded-xl border border-ink/8 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">50-Day Moving Average</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink/60 dark:text-paper/60">Current Price</span>
            <span className="font-mono text-ink dark:text-paper">₹{data.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink/60 dark:text-paper/60">50-Day MA</span>
            <span className="font-mono text-ink/70 dark:text-paper/70">₹{data.movingAverage50.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
          </div>
          <div className={`rounded-lg px-3 py-2 text-center text-sm font-medium ${aboveMA ? "bg-rise/10 text-rise" : "bg-fall/10 text-fall"}`}>
            Price is {aboveMA ? "above" : "below"} 50-Day MA ({aboveMA ? "bullish" : "bearish"} signal)
          </div>
        </div>
      </div>

      {/* 52-Week Range */}
      <div className="rounded-xl border border-ink/8 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">52-Week Range</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-ink/50 dark:text-paper/50">
            <span>₹{data.week52Low.toLocaleString("en-IN")}</span>
            <span>₹{data.week52High.toLocaleString("en-IN")}</span>
          </div>
          <div className="relative h-3 rounded-full bg-ink/10 dark:bg-paper/10">
            <div
              className="absolute left-0 top-0 h-3 rounded-full bg-gradient-to-r from-fall via-gold to-rise"
              style={{ width: "100%" }}
            />
            <div
              className="absolute top-1/2 h-5 w-1.5 -translate-y-1/2 rounded-full bg-ink shadow dark:bg-paper"
              style={{ left: `${Math.max(0, Math.min(100, priceInRange))}%` }}
            />
          </div>
          <p className="text-center text-xs text-ink/40 dark:text-paper/40">
            Current price at {priceInRange.toFixed(0)}% of 52-week range
          </p>
        </div>
      </div>
    </div>
  );
}

function PeersTab({ data, competitors }: { data: CompanyFullData; competitors: CompanyFullData[] }) {
  const all = [data, ...competitors];
  const metrics = [
    { label: "Price", key: "price" as const, format: (v: number) => `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 2 })}` },
    { label: "Market Cap", key: "marketCap" as const, format: (v: number) => formatMarketCapCrores(v) },
    { label: "P/E Ratio", key: "peRatio" as const, format: (v: number) => v.toFixed(1) },
    { label: "ROE", key: "roe" as const, format: (v: number) => `${v.toFixed(1)}%` },
    { label: "ROCE", key: "roce" as const, format: (v: number) => `${v.toFixed(1)}%` },
    { label: "Debt/Equity", key: "debtToEquity" as const, format: (v: number) => v.toFixed(2) },
    { label: "Revenue Growth", key: "revenueGrowth" as const, format: (v: number) => formatPercent(v) },
    { label: "EPS", key: "eps" as const, format: (v: number) => `₹${v.toFixed(1)}` },
  ];

  if (all.length <= 1) {
    return (
      <div className="rounded-xl border border-ink/8 bg-white p-12 text-center shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <p className="text-ink/40 dark:text-paper/40">No competitor data available for comparison.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink/8 bg-white shadow-card dark:border-paper/10 dark:bg-surface-dark">
      <div className="border-b border-ink/8 px-4 py-3 dark:border-paper/10">
        <h3 className="font-display text-[15px] font-medium text-ink dark:text-paper">Peer Comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/8 dark:border-paper/10">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-ink/45 dark:text-paper/45">Metric</th>
              {all.map((c) => (
                <th key={c.symbol} className={`px-3 py-2.5 text-right text-xs font-medium ${c.symbol === data.symbol ? "text-brand-600 dark:text-brand-400" : "text-ink/45 dark:text-paper/45"}`}>
                  {c.symbol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => {
              const values = all.map((c) => c[m.key] as number);
              const best = m.key === "debtToEquity" ? Math.min(...values) : Math.max(...values);
              return (
                <tr key={m.key} className="border-b border-ink/5 dark:border-paper/5">
                  <td className="px-4 py-3 font-medium text-ink/70 dark:text-paper/70">{m.label}</td>
                  {all.map((c) => {
                    const val = c[m.key] as number;
                    const isBest = val === best && all.length > 1;
                    return (
                      <td key={c.symbol} className={`px-3 py-3 text-right font-mono ${
                        isBest ? "font-medium text-brand-600 dark:text-brand-400" : "text-ink dark:text-paper"
                      } ${c.symbol === data.symbol ? "bg-brand-50/30 dark:bg-brand-500/5" : ""}`}>
                        {m.format(val)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
