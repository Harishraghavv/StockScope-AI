import type { MarketIndex } from "@/lib/market-types";
import { formatPercent } from "@/lib/format";

export default function IndexCard({ index }: { index: MarketIndex }) {
  const isUp = index.change >= 0;
  return (
    <div className="rounded-xl border border-ink/8 bg-white p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/45 dark:text-paper/45">
        {index.name}
      </p>
      <p className="mt-1.5 font-display text-xl font-medium text-ink dark:text-paper">
        {index.value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
      </p>
      <p className={`mt-1 font-mono text-sm ${isUp ? "text-rise" : "text-fall"}`}>
        {isUp ? "▲" : "▼"} {formatPercent(index.changePercent)}
      </p>
    </div>
  );
}
