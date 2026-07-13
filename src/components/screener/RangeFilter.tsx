"use client";

export default function RangeFilter({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  step = 1,
  suffix = "",
}: {
  label: string;
  minValue: string;
  maxValue?: string;
  onMinChange: (value: string) => void;
  onMaxChange?: (value: string) => void;
  step?: number;
  suffix?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink/70 dark:text-paper/70">
        {label} {suffix && <span className="text-ink/40 dark:text-paper/40">({suffix})</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step={step}
          placeholder="Min"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          className="w-full rounded-md border border-ink/12 bg-white px-2.5 py-1.5 text-[13px] text-ink placeholder:text-ink/35 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-paper/15 dark:bg-surface-dark dark:text-paper"
        />
        {onMaxChange && (
          <>
            <span className="text-ink/30 dark:text-paper/30">–</span>
            <input
              type="number"
              step={step}
              placeholder="Max"
              value={maxValue ?? ""}
              onChange={(e) => onMaxChange(e.target.value)}
              className="w-full rounded-md border border-ink/12 bg-white px-2.5 py-1.5 text-[13px] text-ink placeholder:text-ink/35 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-paper/15 dark:bg-surface-dark dark:text-paper"
            />
          </>
        )}
      </div>
    </div>
  );
}
