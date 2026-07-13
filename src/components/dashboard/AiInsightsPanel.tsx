import type { StockQuote } from "@/lib/market-types";

// Illustrative, template-generated blurbs for the dashboard preview.
// The real AI Insights module (a later module) will call an LLM provider
// via ANTHROPIC_API_KEY / OPENAI_API_KEY to generate these dynamically —
// always framed as educational analysis, never as a recommendation.
function generateEducationalNote(stock: StockQuote): string {
  const direction = stock.changePercent >= 0 ? "gained" : "declined";
  return `${stock.name} has ${direction} ${Math.abs(stock.changePercent).toFixed(2)}% today. Studying ${stock.sector.toLowerCase()} sector peers alongside its recent quarterly filings may help explain this move.`;
}

export default function AiInsightsPanel({ stocks }: { stocks: StockQuote[] }) {
  return (
    <div className="flex flex-col gap-3 p-1.5">
      {stocks.map((stock) => (
        <div
          key={stock.symbol}
          className="rounded-lg border border-brand-500/15 bg-brand-50/60 p-3 dark:border-brand-400/20 dark:bg-brand-900/20"
        >
          <p className="text-[13px] font-medium text-ink dark:text-paper">
            {stock.symbol}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink/65 dark:text-paper/65">
            {generateEducationalNote(stock)}
          </p>
        </div>
      ))}
      <p className="px-1 text-[11px] leading-relaxed text-ink/40 dark:text-paper/40">
        Educational insights only, generated from public data patterns — not
        a recommendation to buy, sell, or hold any security.
      </p>
    </div>
  );
}
