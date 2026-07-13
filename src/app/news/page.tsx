import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import AppHeader from "@/components/dashboard/AppHeader";
import NewsClient from "@/components/news/NewsClient";
import { getAllNews, getAllStocks } from "@/lib/providers/market-data";

export const metadata = { title: "News Center — StockScope AI" };

export default async function NewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [news, stocks] = await Promise.all([getAllNews(), getAllStocks()]);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            News Center
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium text-ink dark:text-paper">
            Market news & updates
          </h1>
          <p className="mt-1 text-sm text-ink/40 dark:text-paper/40">
            Illustrative news summaries for educational purposes. Not investment advice.
          </p>
        </div>
        <NewsClient news={news} stocks={stocks} />
      </main>
    </div>
  );
}
