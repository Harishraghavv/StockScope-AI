import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import AppHeader from "@/components/dashboard/AppHeader";
import ScreenerClient from "@/components/screener/ScreenerClient";

export default async function ScreenerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Screener
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium text-ink dark:text-paper">
            Stock screener
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink/55 dark:text-paper/55">
            Filter companies by fundamentals and technicals. Fundamentals
            shown here are illustrative sample data, not live filings — for
            practicing screening technique, not for making decisions.
          </p>
        </div>

        <ScreenerClient />
      </main>
    </div>
  );
}
