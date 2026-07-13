import Link from "next/link";
import UserMenu from "@/components/dashboard/UserMenu";
import type { CurrentUser } from "@/lib/auth/current-user";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/screener", label: "Screener" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/sectors", label: "Sectors" },
  { href: "/earnings", label: "Earnings" },
  { href: "/news", label: "News" },
];

export default function AppHeader({ user }: { user: CurrentUser }) {
  return (
    <header className="sticky top-0 z-10 border-b border-ink/8 bg-paper/90 backdrop-blur dark:border-paper/10 dark:bg-ink/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 font-display text-sm font-semibold text-ink">
              S
            </span>
            <span className="font-display text-[15px] font-medium text-ink dark:text-paper">
              StockScope AI
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
