import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import AppHeader from "@/components/dashboard/AppHeader";
import SectorClient from "@/components/sectors/SectorClient";
import { getSectorPerformance, getAllStocks } from "@/lib/providers/market-data";

export const metadata = { title: "Sector Analysis — StockScope AI" };

export default async function SectorsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [sectors, stocks] = await Promise.all([getSectorPerformance(), getAllStocks()]);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Sector Analysis
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium text-ink dark:text-paper">
            Sector performance
          </h1>
          <p className="mt-1 text-sm text-ink/40 dark:text-paper/40">
            Sector-level analysis with constituent stocks. Illustrative data for educational purposes.
          </p>
        </div>
        <SectorClient sectors={sectors} stocks={stocks} />
      </main>
    </div>
  );
}
