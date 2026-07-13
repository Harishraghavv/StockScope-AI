"use client";

import type { ScreenerFilters } from "@/lib/market-types";
import RangeFilter from "./RangeFilter";

export default function FilterSidebar({
  filters,
  sectors,
  onChange,
  onReset,
}: {
  filters: ScreenerFilters;
  sectors: string[];
  onChange: (patch: Partial<ScreenerFilters>) => void;
  onReset: () => void;
}) {
  // Helper to bind a numeric filter field to a text input, treating an
  // empty string as "unset" (undefined) rather than 0.
  function numField(key: keyof ScreenerFilters) {
    const raw = filters[key];
    return typeof raw === "number" ? String(raw) : "";
  }
  function setNum(key: keyof ScreenerFilters) {
    return (value: string) =>
      onChange({ [key]: value === "" ? undefined : Number(value) } as Partial<ScreenerFilters>);
  }

  return (
    <aside className="flex w-full flex-col gap-5 lg:w-72 lg:shrink-0">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[15px] font-medium text-ink dark:text-paper">
          Filters
        </h2>
        <button
          onClick={onReset}
          className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Reset all
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink/70 dark:text-paper/70">
          Search
        </label>
        <input
          type="text"
          placeholder="Symbol or company name"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ search: e.target.value || undefined })}
          className="w-full rounded-md border border-ink/12 bg-white px-3 py-2 text-[13.5px] text-ink placeholder:text-ink/35 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-paper/15 dark:bg-surface-dark dark:text-paper"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink/70 dark:text-paper/70">
          Sector
        </label>
        <select
          value={filters.sector ?? ""}
          onChange={(e) => onChange({ sector: e.target.value || undefined })}
          className="w-full rounded-md border border-ink/12 bg-white px-3 py-2 text-[13.5px] text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-paper/15 dark:bg-surface-dark dark:text-paper"
        >
          <option value="">All sectors</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      <RangeFilter
        label="Market cap"
        suffix="₹ Cr"
        minValue={numField("marketCapMin")}
        maxValue={numField("marketCapMax")}
        onMinChange={setNum("marketCapMin")}
        onMaxChange={setNum("marketCapMax")}
        step={1000}
      />

      <RangeFilter
        label="P/E ratio"
        minValue={numField("peMin")}
        maxValue={numField("peMax")}
        onMinChange={setNum("peMin")}
        onMaxChange={setNum("peMax")}
        step={0.5}
      />

      <RangeFilter
        label="ROE"
        suffix="%"
        minValue={numField("roeMin")}
        onMinChange={setNum("roeMin")}
        step={0.5}
      />

      <RangeFilter
        label="ROCE"
        suffix="%"
        minValue={numField("roceMin")}
        onMinChange={setNum("roceMin")}
        step={0.5}
      />

      <RangeFilter
        label="EPS"
        suffix="₹"
        minValue={numField("epsMin")}
        onMinChange={setNum("epsMin")}
        step={1}
      />

      <RangeFilter
        label="Revenue growth"
        suffix="% YoY"
        minValue={numField("revenueGrowthMin")}
        onMinChange={setNum("revenueGrowthMin")}
        step={1}
      />

      <RangeFilter
        label="Profit growth"
        suffix="% YoY"
        minValue={numField("profitGrowthMin")}
        onMinChange={setNum("profitGrowthMin")}
        step={1}
      />

      <RangeFilter
        label="Max debt/equity"
        minValue={numField("debtToEquityMax")}
        onMinChange={setNum("debtToEquityMax")}
        step={0.1}
      />

      <RangeFilter
        label="Dividend yield"
        suffix="%"
        minValue={numField("dividendYieldMin")}
        onMinChange={setNum("dividendYieldMin")}
        step={0.1}
      />

      <RangeFilter
        label="RSI"
        minValue={numField("rsiMin")}
        maxValue={numField("rsiMax")}
        onMinChange={setNum("rsiMin")}
        onMaxChange={setNum("rsiMax")}
        step={1}
      />

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[13px] text-ink/75 dark:text-paper/75">
          <input
            type="checkbox"
            checked={!!filters.near52WeekHigh}
            onChange={(e) => onChange({ near52WeekHigh: e.target.checked || undefined })}
            className="h-4 w-4 rounded border-ink/25 text-brand-600 focus:ring-brand-500/30"
          />
          Near 52-week high
        </label>
        <label className="flex items-center gap-2 text-[13px] text-ink/75 dark:text-paper/75">
          <input
            type="checkbox"
            checked={!!filters.near52WeekLow}
            onChange={(e) => onChange({ near52WeekLow: e.target.checked || undefined })}
            className="h-4 w-4 rounded border-ink/25 text-brand-600 focus:ring-brand-500/30"
          />
          Near 52-week low
        </label>
      </div>
    </aside>
  );
}
