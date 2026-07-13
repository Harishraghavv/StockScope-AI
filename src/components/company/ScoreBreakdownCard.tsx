import type { ScoreBreakdown } from "@/lib/scoring/financial-health";

const BAND_STYLES: Record<ScoreBreakdown["band"], string> = {
  Strong: "text-rise",
  Moderate: "text-gold",
  Weak: "text-fall",
};

export default function ScoreBreakdownCard({ score }: { score: ScoreBreakdown }) {
  return (
    <div className="rounded-xl border border-ink/8 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink/45 dark:text-paper/45">
            Financial Health Score
          </p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl font-medium text-ink dark:text-paper">
              {score.totalScore}
            </span>
            <span className="text-sm text-ink/40 dark:text-paper/40">/ 100</span>
            <span className={`text-sm font-medium ${BAND_STYLES[score.band]}`}>
              {score.band}
            </span>
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink/45 dark:text-paper/45">
        Every factor below is shown with its exact weight and reasoning — this
        is a transparent rule-based score on illustrative data, not a hidden
        model and not investment advice.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {score.factors.map((factor) => {
          const pct = (factor.points / factor.maxPoints) * 100;
          return (
            <div key={factor.label}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-medium text-ink dark:text-paper">
                  {factor.label}
                </span>
                <span className="font-mono text-ink/60 dark:text-paper/60">
                  {factor.points.toFixed(1)} / {factor.maxPoints} pts
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink/8 dark:bg-paper/10">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-xs leading-snug text-ink/50 dark:text-paper/50">
                Value: <span className="font-mono">{factor.value}</span> —{" "}
                {factor.note}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
