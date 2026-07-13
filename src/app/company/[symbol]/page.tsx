import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/current-user";
import AppHeader from "@/components/dashboard/AppHeader";
import CompanyClient from "@/components/company/CompanyClient";
import { getCompanyFullData } from "@/lib/providers/company-data";
import { formatPercent, formatINR, formatMarketCapCrores, formatCompactNumber } from "@/lib/format";

interface Props { params: { symbol: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `${params.symbol.toUpperCase()} — StockScope AI` };
}

export default async function CompanyPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const data = await getCompanyFullData(params.symbol);
  if (!data) notFound();

  // Fetch competitor data for peer comparison
  const competitorData = await Promise.all(
    data.competitors.map((sym) => getCompanyFullData(sym))
  ).then((results) => results.filter(Boolean) as Awaited<ReturnType<typeof getCompanyFullData>>[]);

  const isUp = data.changePercent >= 0;

  const quickStats = [
    { label: "Market Cap", value: formatMarketCapCrores(data.marketCap) },
    { label: "Volume", value: formatCompactNumber(data.volume) },
    { label: "P/E Ratio", value: data.peRatio.toFixed(1) },
    { label: "EPS", value: `₹${data.eps.toFixed(1)}` },
    { label: "ROE", value: `${data.roe.toFixed(1)}%` },
    { label: "ROCE", value: `${data.roce.toFixed(1)}%` },
    { label: "D/E Ratio", value: data.debtToEquity.toFixed(2) },
    { label: "Dividend", value: `${data.dividendYield.toFixed(1)}%` },
    { label: "52W High", value: `₹${data.week52High.toLocaleString("en-IN")}` },
    { label: "52W Low", value: `₹${data.week52Low.toLocaleString("en-IN")}` },
  ];

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Back link */}
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-ink/40 hover:text-brand-600 dark:text-paper/40 dark:hover:text-brand-400">
          ← Back to Dashboard
        </Link>

        {/* Hero */}
        <div className="mb-6 animate-slide-up">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-medium text-ink dark:text-paper">{data.symbol}</h1>
                <span className="rounded-full bg-ink/8 px-2.5 py-0.5 text-xs font-medium text-ink/60 dark:bg-paper/10 dark:text-paper/60">
                  {data.sector}
                </span>
              </div>
              <p className="mt-0.5 text-ink/50 dark:text-paper/50">{data.name}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-medium text-ink dark:text-paper">
                ₹{data.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </p>
              <p className={`mt-0.5 font-mono text-lg ${isUp ? "text-rise" : "text-fall"}`}>
                {isUp ? "▲" : "▼"} {Math.abs(data.change).toFixed(2)} ({formatPercent(data.changePercent)})
              </p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5 animate-slide-up stagger-2">
          {quickStats.map((s) => (
            <div key={s.label} className="rounded-xl border border-ink/8 bg-white px-3 py-2.5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
              <p className="text-[10px] uppercase tracking-wider text-ink/40 dark:text-paper/40">{s.label}</p>
              <p className="mt-0.5 font-mono text-sm font-medium text-ink dark:text-paper">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabbed content */}
        <CompanyClient data={data} competitorData={competitorData} />

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-ink/25 dark:text-paper/25">
          Data shown is for educational purposes only. StockScope AI does not provide investment advice.
          Always consult a qualified financial advisor before making investment decisions.
        </p>
      </main>
    </div>
  );
}
