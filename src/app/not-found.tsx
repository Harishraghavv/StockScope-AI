import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center dark:bg-ink">
      <p className="font-mono text-sm text-brand-600 dark:text-brand-400">404</p>
      <h1 className="font-display text-3xl font-medium text-ink dark:text-paper">
        This ticker doesn&apos;t exist.
      </h1>
      <p className="max-w-sm text-ink/55 dark:text-paper/55">
        The page you&apos;re looking for isn&apos;t listed. Check the URL, or
        head back to the dashboard.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-brand-600 px-4 py-2.5 text-[15px] font-medium text-white hover:bg-brand-700"
      >
        Back home
      </Link>
    </main>
  );
}
