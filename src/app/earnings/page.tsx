import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import AppHeader from "@/components/dashboard/AppHeader";
import EarningsClient from "@/components/earnings/EarningsClient";
import { getEarningsCalendar } from "@/lib/mock-data/earnings";

export const metadata = { title: "Earnings Calendar — StockScope AI" };

export default async function EarningsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const events = getEarningsCalendar();

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Earnings Calendar
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium text-ink dark:text-paper">
            Quarterly results tracker
          </h1>
          <p className="mt-1 text-sm text-ink/40 dark:text-paper/40">
            Illustrative earnings calendar with EPS estimates vs actuals. Not investment advice.
          </p>
        </div>
        <EarningsClient events={events} />
      </main>
    </div>
  );
}
