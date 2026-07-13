"use client";

import Link from "next/link";
import { useRecentSearchesStore } from "@/lib/stores/recent-searches-store";

export default function RecentSearches() {
  const recent = useRecentSearchesStore((s) => s.recent);

  if (recent.length === 0) {
    return (
      <p className="px-1.5 py-2 text-sm text-ink/45 dark:text-paper/45">
        No recent searches yet.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 p-1.5">
      {recent.map((symbol) => (
        <Link
          key={symbol}
          href={`/company/${symbol}`}
          className="rounded-full border border-ink/12 px-3 py-1.5 font-mono text-xs text-ink/70 transition-colors hover:border-brand-500/40 hover:text-brand-700 dark:border-paper/15 dark:text-paper/70 dark:hover:text-brand-400"
        >
          {symbol}
        </Link>
      ))}
    </div>
  );
}
