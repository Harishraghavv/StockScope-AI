import type { NewsItem } from "@/lib/market-types";
import { formatRelativeTime } from "@/lib/format";

export default function NewsFeed({ items }: { items: NewsItem[] }) {
  return (
    <ul className="divide-y divide-ink/8 dark:divide-paper/10">
      {items.map((item) => (
        <li key={item.id} className="px-1.5 py-3 first:pt-1 last:pb-1">
          <div className="flex items-center gap-2 text-xs text-ink/45 dark:text-paper/45">
            {item.relatedSymbol && (
              <span className="rounded bg-brand-50 px-1.5 py-0.5 font-mono text-[11px] font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                {item.relatedSymbol}
              </span>
            )}
            <span>{item.source}</span>
            <span aria-hidden="true">·</span>
            <span>{formatRelativeTime(item.publishedAt)}</span>
          </div>
          <p className="mt-1.5 text-[14px] font-medium leading-snug text-ink dark:text-paper">
            {item.headline}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink/55 dark:text-paper/55">
            {item.summary}
          </p>
        </li>
      ))}
    </ul>
  );
}
