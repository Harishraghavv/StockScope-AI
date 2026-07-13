export default function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-ink/8 bg-white shadow-card dark:border-paper/10 dark:bg-surface-dark ${className}`}
    >
      <header className="flex items-center justify-between border-b border-ink/8 px-4 py-3 dark:border-paper/10">
        <h2 className="font-display text-[15px] font-medium text-ink dark:text-paper">
          {title}
        </h2>
        {action}
      </header>
      <div className="p-2.5">{children}</div>
    </section>
  );
}
