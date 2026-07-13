import Link from "next/link";
import TickerStrip from "./TickerStrip";

const PROOF_POINTS = [
  { figure: "3,900+", label: "Companies covered" },
  { figure: "12", label: "Years of financials indexed" },
  { figure: "0", label: "Buy/sell calls ever made" },
];

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper dark:bg-ink">
      <TickerStrip />
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left: brand / editorial panel */}
        <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-ink px-12 py-12 text-paper lg:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(247,248,250,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(247,248,250,0.6) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />

          <Link href="/" className="relative z-10 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 font-display text-sm font-semibold text-ink">
              S
            </span>
            <span className="font-display text-lg font-medium">StockScope AI</span>
          </Link>

          <div className="relative z-10 max-w-md">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-400">
              {eyebrow}
            </p>
            <h1 className="mb-4 font-display text-4xl font-medium leading-tight">
              Read the numbers before anyone tells you what they mean.
            </h1>
            <p className="text-[15px] leading-relaxed text-paper/60">
              Fundamentals, ratios, and plain-English AI summaries — built for
              studying companies, not for chasing tips.
            </p>
          </div>

          <dl className="relative z-10 grid grid-cols-3 gap-6 border-t border-paper/10 pt-6">
            {PROOF_POINTS.map((p) => (
              <div key={p.label}>
                <dt className="font-display text-2xl font-medium text-paper">
                  {p.figure}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-paper/50">
                  {p.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: form panel */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 font-display text-sm font-semibold text-ink">
                  S
                </span>
                <span className="font-display text-lg font-medium text-ink dark:text-paper">
                  StockScope AI
                </span>
              </Link>
            </div>

            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
              {eyebrow}
            </p>
            <h2 className="mb-2 font-display text-3xl font-medium text-ink dark:text-paper">
              {title}
            </h2>
            <p className="mb-8 text-[15px] text-ink/55 dark:text-paper/55">
              {subtitle}
            </p>

            {children}

            <div className="mt-8 text-sm text-ink/55 dark:text-paper/55">
              {footer}
            </div>

            <p className="mt-10 border-t border-ink/10 pt-4 text-xs leading-relaxed text-ink/35 dark:border-paper/10 dark:text-paper/35">
              StockScope AI provides educational research tools only. Nothing
              here is investment advice or a recommendation to buy or sell any
              security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
