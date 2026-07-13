const TICKER_ITEMS = [
  { symbol: "RELIANCE", change: 1.24 },
  { symbol: "TCS", change: -0.38 },
  { symbol: "HDFCBANK", change: 0.62 },
  { symbol: "INFY", change: -1.05 },
  { symbol: "ITC", change: 0.19 },
  { symbol: "SBIN", change: 2.11 },
  { symbol: "BHARTIARTL", change: 0.47 },
  { symbol: "LT", change: -0.22 },
];

function TickerRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={ariaHidden}>
      {TICKER_ITEMS.map((item) => (
        <span key={item.symbol} className="flex items-center gap-2 font-mono text-xs tracking-wide">
          <span className="text-paper/60">{item.symbol}</span>
          <span className={item.change >= 0 ? "text-brand-400" : "text-fall"}>
            {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * A slow, ambient scrolling ledger of illustrative tickers — the one
 * animated flourish on the auth screen, evoking a market data terminal
 * without depicting any real, current price data.
 */
export default function TickerStrip() {
  return (
    <div className="relative flex w-full overflow-hidden border-b border-paper/10 bg-ink py-2.5">
      <div className="flex w-max animate-[scroll_38s_linear_infinite] motion-reduce:animate-none">
        <TickerRow />
        <TickerRow ariaHidden />
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
