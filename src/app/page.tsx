import Link from "next/link";

const FEATURES = [
  { icon: "📊", title: "Live Dashboard", desc: "Real-time indices, gainers, losers, sector heatmaps, and trending stocks at a glance." },
  { icon: "🔍", title: "Smart Screener", desc: "Filter 20+ stocks by fundamentals, technicals, and valuations. Save and reload presets." },
  { icon: "🤖", title: "AI Health Score", desc: "Transparent, rule-based financial health scoring with AI-generated plain-English explanations." },
  { icon: "💼", title: "Portfolio Tracker", desc: "Track holdings, calculate P&L, and visualize sector allocation in real time." },
  { icon: "⭐", title: "Watchlists", desc: "Organize stocks into custom watchlists and monitor prices across your picks." },
  { icon: "📰", title: "News Center", desc: "Sector-filtered market news with AI summaries, all in one place." },
];

const STEPS = [
  { num: "01", title: "Sign up in seconds", desc: "Create a free account — no credit card, no commitment." },
  { num: "02", title: "Explore the markets", desc: "Browse the dashboard, screen stocks, and read AI-powered analysis." },
  { num: "03", title: "Build your portfolio", desc: "Add holdings, create watchlists, and track everything from one place." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink text-paper overflow-hidden">
      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 font-display text-sm font-bold text-ink">
            S
          </span>
          <span className="font-display text-lg font-medium">StockScope AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-paper/70 transition-colors hover:text-paper"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 text-center">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/10 blur-[120px]" />
          <div className="absolute -right-32 top-24 h-80 w-80 rounded-full bg-brand-400/8 blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/5 blur-[80px]" />
        </div>

        <div className="relative z-10">
          <p className="animate-fade-in font-mono text-xs uppercase tracking-[0.3em] text-brand-400">
            Educational Stock Research Platform
          </p>
          <h1 className="animate-slide-up mt-6 font-display text-5xl font-medium leading-[1.15] tracking-tight sm:text-6xl lg:text-7xl">
            Read the numbers
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-brand-500 bg-clip-text text-transparent animate-gradient">
              before anyone tells you
            </span>
            <br />
            what they mean.
          </h1>
          <p className="animate-slide-up stagger-2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-paper/50">
            AI-powered stock analysis, transparent scoring, and smart screeners — built for learning,
            not for trading advice.
          </p>
          <div className="animate-slide-up stagger-3 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="group rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-semibold text-ink transition-all hover:bg-brand-400 hover:shadow-xl hover:shadow-brand-500/30"
            >
              Start exploring free →
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-paper/15 px-6 py-3.5 text-[15px] font-medium text-paper/70 transition-all hover:border-paper/30 hover:text-paper"
            >
              Sign in
            </Link>
          </div>

          {/* Trust badges */}
          <div className="animate-slide-up stagger-4 mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-paper/30">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              20 NSE stocks tracked
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Live Yahoo Finance data
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              100% educational
            </span>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative border-t border-paper/8 bg-ink py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-400">Features</p>
          <h2 className="mt-3 font-display text-3xl font-medium text-paper sm:text-4xl">
            Everything you need to study the market.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`animate-slide-up stagger-${i + 1} group rounded-2xl border border-paper/8 bg-paper/[0.03] p-6 transition-all hover:border-brand-500/30 hover:bg-paper/[0.06]`}
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 font-display text-lg font-medium text-paper">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/45">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-paper/8 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-400">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-medium text-paper">
            Get started in three steps.
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.num} className="text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-500/30 font-mono text-sm font-medium text-brand-400">
                  {s.num}
                </span>
                <h3 className="mt-4 font-display text-lg font-medium text-paper">{s.title}</h3>
                <p className="mt-2 text-sm text-paper/45">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-paper/8 py-20 text-center">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="font-display text-3xl font-medium text-paper">Ready to explore?</h2>
          <p className="mt-3 text-paper/45">Free. Educational. No buy/sell advice. Ever.</p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-brand-500 px-8 py-4 text-[15px] font-semibold text-ink transition-all hover:bg-brand-400 hover:shadow-xl hover:shadow-brand-500/30"
          >
            Create your free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-paper/8 py-8 text-center text-xs text-paper/25">
        <p>StockScope AI — Educational stock research. Not investment advice. Never act on this data alone.</p>
        <p className="mt-1">Built with Next.js, TypeScript, and Tailwind CSS.</p>
      </footer>
    </main>
  );
}
