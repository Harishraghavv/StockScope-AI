import Link from "next/link";
import type { StockQuote } from "@/lib/market-types";
import { formatPercent } from "@/lib/format";

export default function StockRow({ stock }: { stock: StockQuote }) {
  const isUp = stock.changePercent >= 0;
  return (
    <Link
      href={`/company/${stock.symbol}`}
      className="flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors hover:bg-ink/[0.03] dark:hover:bg-paper/[0.05]"
    >
      <div className="min-w-0">
        <p className="truncate text-[13.5px] font-medium text-ink dark:text-paper">
          {stock.symbol}
        </p>
        <p className="truncate text-xs text-ink/45 dark:text-paper/45">{stock.name}</p>
      </div>
      <div className="ml-3 shrink-0 text-right">
        <p className="font-mono text-[13.5px] text-ink dark:text-paper">
          ₹{stock.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </p>
        <p className={`font-mono text-xs ${isUp ? "text-rise" : "text-fall"}`}>
          {formatPercent(stock.changePercent)}
        </p>
      </div>
    </Link>
  );
}
