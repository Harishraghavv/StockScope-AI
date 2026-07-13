import Link from "next/link";

export default function ComingSoonPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-3 rounded-xl border border-ink/8 bg-white p-8 shadow-card dark:border-paper/10 dark:bg-surface-dark">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
        Coming in a later module
      </p>
      <h1 className="font-display text-2xl font-medium text-ink dark:text-paper">
        {title}
      </h1>
      <p className="text-[15px] leading-relaxed text-ink/60 dark:text-paper/60">
        {description}
      </p>
      <Link
        href="/dashboard"
        className="mt-2 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}
