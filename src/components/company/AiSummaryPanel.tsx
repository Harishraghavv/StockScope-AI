"use client";

import { useEffect, useState } from "react";
import ScoreBreakdownCard from "./ScoreBreakdownCard";
import type { ScoreBreakdown } from "@/lib/scoring/financial-health";

interface AiSummaryResponse {
  score: ScoreBreakdown;
  explanation: { summary: string; source: "ai" | "template" };
}

export default function AiSummaryPanel({ symbol }: { symbol: string }) {
  const [data, setData] = useState<AiSummaryResponse | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`/api/company/${symbol}/ai-summary`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success) setData(json.data);
        else setError(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  if (loading) {
    return (
      <div className="rounded-xl border border-ink/8 bg-white p-6 shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <div className="h-4 w-40 animate-pulse rounded bg-ink/10 dark:bg-paper/10" />
        <div className="mt-3 h-3 w-full animate-pulse rounded bg-ink/8 dark:bg-paper/8" />
        <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-ink/8 dark:bg-paper/8" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-ink/8 bg-white p-6 text-sm text-ink/50 shadow-card dark:border-paper/10 dark:bg-surface-dark dark:text-paper/50">
        Could not load the AI summary for this company right now.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-brand-500/20 bg-brand-50/60 p-5 dark:border-brand-400/20 dark:bg-brand-900/20">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-brand-700 dark:text-brand-300">
            AI summary (educational)
          </p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
              data.explanation.source === "ai"
                ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                : "bg-ink/8 text-ink/50 dark:bg-paper/10 dark:text-paper/50"
            }`}
            title={
              data.explanation.source === "ai"
                ? "Generated live by an LLM from this company's data"
                : "Generated from a template, since no AI provider key is configured"
            }
          >
            {data.explanation.source === "ai" ? "Live AI" : "Template"}
          </span>
        </div>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink/75 dark:text-paper/75">
          {data.explanation.summary}
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-ink/40 dark:text-paper/40">
          Educational analysis grounded in the fundamentals shown below — not
          a recommendation to buy, sell, or hold this or any security.
        </p>
      </div>

      <ScoreBreakdownCard score={data.score} />
    </div>
  );
}
