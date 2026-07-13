"use client";

import { useState } from "react";
import Link from "next/link";
import type { EarningsEvent } from "@/lib/mock-data/earnings";

export default function EarningsClient({ events }: { events: EarningsEvent[] }) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState<"all" | "upcoming" | "reported">("all");

  const filtered = events.filter((e) => filter === "all" || e.status === filter);
  const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcoming = events.filter((e) => e.status === "upcoming");
  const reported = events.filter((e) => e.status === "reported");

  // Calendar view helpers
  const today = new Date();
  const calMonth = today.getMonth();
  const calYear = today.getFullYear();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  const eventsByDate = new Map<string, EarningsEvent[]>();
  events.forEach((e) => {
    const d = e.date.split("T")[0];
    const arr = eventsByDate.get(d) ?? [];
    arr.push(e);
    eventsByDate.set(d, arr);
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-ink/10 dark:border-paper/10">
          {(["list", "calendar"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                view === v
                  ? "bg-brand-500 text-ink"
                  : "text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper"
              } ${v === "list" ? "rounded-l-lg" : "rounded-r-lg"}`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border border-ink/10 dark:border-paper/10">
          {(["all", "upcoming", "reported"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-ink/10 text-ink dark:bg-paper/10 dark:text-paper"
                  : "text-ink/40 hover:text-ink dark:text-paper/40 dark:hover:text-paper"
              }`}
            >
              {f} ({f === "all" ? events.length : f === "upcoming" ? upcoming.length : reported.length})
            </button>
          ))}
        </div>
      </div>

      {view === "list" ? (
        /* List view */
        <div className="rounded-xl border border-ink/8 bg-white shadow-card dark:border-paper/10 dark:bg-surface-dark">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/8 text-xs text-ink/45 dark:border-paper/10 dark:text-paper/45">
                  <th className="px-4 py-2.5 text-left font-medium">Date</th>
                  <th className="px-3 py-2.5 text-left font-medium">Company</th>
                  <th className="px-3 py-2.5 text-left font-medium">Quarter</th>
                  <th className="px-3 py-2.5 text-right font-medium">Est. EPS</th>
                  <th className="px-3 py-2.5 text-right font-medium">Actual EPS</th>
                  <th className="px-3 py-2.5 text-right font-medium">Surprise</th>
                  <th className="px-3 py-2.5 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((e, i) => (
                  <tr key={`${e.symbol}-${e.date}`} className={`animate-slide-up stagger-${Math.min(i + 1, 8)} border-b border-ink/5 transition-colors hover:bg-ink/[0.02] dark:border-paper/5 dark:hover:bg-paper/[0.03]`}>
                    <td className="px-4 py-3 font-mono text-xs text-ink/60 dark:text-paper/60">{formatDate(e.date)}</td>
                    <td className="px-3 py-3">
                      <Link href={`/company/${e.symbol}`} className="hover:text-brand-600 dark:hover:text-brand-400">
                        <p className="font-medium text-ink dark:text-paper">{e.symbol}</p>
                        <p className="text-xs text-ink/40 dark:text-paper/40">{e.name}</p>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-ink/70 dark:text-paper/70">{e.quarter}</td>
                    <td className="px-3 py-3 text-right font-mono text-ink/70 dark:text-paper/70">
                      {e.estimatedEPS != null ? `₹${e.estimatedEPS.toFixed(1)}` : "—"}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-ink dark:text-paper">
                      {e.actualEPS != null ? `₹${e.actualEPS.toFixed(1)}` : "—"}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {e.surprise != null ? (
                        <span className={`font-mono ${e.surprise >= 0 ? "text-rise" : "text-fall"}`}>
                          {e.surprise >= 0 ? "+" : ""}{e.surprise.toFixed(1)}%
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        e.status === "reported"
                          ? e.surprise && e.surprise >= 0
                            ? "bg-rise/10 text-rise"
                            : "bg-fall/10 text-fall"
                          : "bg-gold/10 text-gold"
                      }`}>
                        {e.status === "reported" ? (e.surprise && e.surprise >= 0 ? "Beat" : "Miss") : "Upcoming"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar view */
        <div className="rounded-xl border border-ink/8 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
          <h3 className="mb-4 text-center font-display text-lg font-medium text-ink dark:text-paper">
            {today.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </h3>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="p-2 text-center text-xs font-medium text-ink/40 dark:text-paper/40">{d}</div>
            ))}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayEvents = eventsByDate.get(dateStr) ?? [];
              const isToday = day === today.getDate();
              return (
                <div
                  key={day}
                  className={`relative min-h-[60px] rounded-lg border p-1.5 text-xs ${
                    isToday
                      ? "border-brand-500/40 bg-brand-50/50 dark:bg-brand-500/10"
                      : "border-ink/5 dark:border-paper/5"
                  } ${dayEvents.length > 0 ? "cursor-pointer hover:bg-ink/[0.03] dark:hover:bg-paper/[0.03]" : ""}`}
                >
                  <span className={`font-mono ${isToday ? "font-bold text-brand-600 dark:text-brand-400" : "text-ink/50 dark:text-paper/50"}`}>
                    {day}
                  </span>
                  {dayEvents.map((e) => (
                    <Link
                      key={e.symbol}
                      href={`/company/${e.symbol}`}
                      className={`mt-0.5 block truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                        e.status === "reported"
                          ? e.surprise && e.surprise >= 0
                            ? "bg-rise/15 text-rise"
                            : "bg-fall/15 text-fall"
                          : "bg-gold/15 text-gold"
                      }`}
                    >
                      {e.symbol}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
