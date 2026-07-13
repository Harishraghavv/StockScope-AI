import Link from "next/link";
import type { WatchlistItem } from "@/lib/market-types";
import { formatPercent } from "@/lib/format";

export default function WatchlistSummary({ items }: { items: WatchlistItem[] }) {
  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-ink/50 dark:text-paper/50">
          Your watchlist is empty.
        </p>
        <Link
          href="/screener"
          className="mt-2 inline-block text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Find companies to add
        </Link>
      </div>
    );
  }

  return (
    <ul>
      {items.map((item) => {
        const isUp = item.changePercent >= 0;
        return (
          <li key={item.symbol}>
            <Link
              href={`/company/${item.symbol}`}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors hover:bg-ink/[0.03] dark:hover:bg-paper/[0.05]"
            >
              <div>
                <p className="text-[13.5px] font-medium text-ink dark:text-paper">
                  {item.symbol}
                </p>
                <p className="text-xs text-ink/45 dark:text-paper/45">{item.name}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[13.5px] text-ink dark:text-paper">
                  ₹{item.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
                <p className={`font-mono text-xs ${isUp ? "text-rise" : "text-fall"}`}>
                  {formatPercent(item.changePercent)}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
