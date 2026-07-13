import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import AppHeader from "@/components/dashboard/AppHeader";
import WatchlistClient from "@/components/watchlist/WatchlistClient";
import { getAllStocks } from "@/lib/providers/market-data";

export const metadata = { title: "Watchlist — StockScope AI" };

export default async function WatchlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stocks = await getAllStocks();

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Watchlist
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium text-ink dark:text-paper">
            Track your picks
          </h1>
          <p className="mt-1 text-sm text-ink/40 dark:text-paper/40">
            Organize stocks into lists and monitor prices. Educational purposes only.
          </p>
        </div>
        <WatchlistClient stocks={stocks} />
      </main>
    </div>
  );
}
