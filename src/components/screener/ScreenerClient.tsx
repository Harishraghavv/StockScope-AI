"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ScreenerFilters, ScreenerStock } from "@/lib/market-types";
import FilterSidebar from "./FilterSidebar";
import ResultsTable from "./ResultsTable";
import SavedScreenersPanel, { type SavedScreenerRecord } from "./SavedScreenersPanel";
import { exportScreenerResultsToCsv } from "@/lib/csv-export";
import { useToastStore } from "@/lib/stores/toast-store";

function filtersToQueryString(filters: ScreenerFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    params.set(key, String(value));
  });
  return params.toString();
}

export default function ScreenerClient() {
  const push = useToastStore((s) => s.push);

  const [filters, setFilters] = useState<ScreenerFilters>({
    sortBy: "marketCap",
    sortDir: "desc",
  });
  const [results, setResults] = useState<ScreenerStock[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [saved, setSaved] = useState<SavedScreenerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(async (nextFilters: ScreenerFilters) => {
    setLoading(true);
    try {
      const qs = filtersToQueryString(nextFilters);
      const res = await fetch(`/api/screener?${qs}`);
      const json = await res.json();
      if (res.ok) {
        setResults(json.data.results);
        setSectors(json.data.sectors);
      }
    } catch {
      push("Could not load screener results.", "error");
    } finally {
      setLoading(false);
    }
  }, [push]);

  // Debounced re-fetch whenever filters change.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults(filters);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Load saved screeners once on mount.
  useEffect(() => {
    fetch("/api/screener/saved")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSaved(json.data.saved);
      })
      .catch(() => {
        // Non-fatal — saved screeners are a convenience feature.
      });
  }, []);

  function handleFilterChange(patch: Partial<ScreenerFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleReset() {
    setFilters({ sortBy: "marketCap", sortDir: "desc" });
  }

  function handleSort(key: keyof ScreenerStock) {
    setFilters((prev) => ({
      ...prev,
      sortBy: key,
      sortDir: prev.sortBy === key && prev.sortDir === "desc" ? "asc" : "desc",
    }));
  }

  function handleExport() {
    if (results.length === 0) {
      push("No results to export.", "error");
      return;
    }
    exportScreenerResultsToCsv(results);
    push(`Exported ${results.length} companies to CSV.`, "success");
  }

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <div className="flex flex-col gap-5">
        <FilterSidebar
          filters={filters}
          sectors={sectors}
          onChange={handleFilterChange}
          onReset={handleReset}
        />
        <SavedScreenersPanel
          saved={saved}
          currentFilters={filters}
          onLoad={(loadedFilters) => setFilters(loadedFilters)}
          onSaved={(record) => setSaved((prev) => [record, ...prev])}
          onDeleted={(id) => setSaved((prev) => prev.filter((s) => s.id !== id))}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-ink/55 dark:text-paper/55">
            {loading ? "Searching…" : `${results.length} companies match`}
          </p>
          <button
            onClick={handleExport}
            className="rounded-md border border-ink/15 px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-ink/5 dark:border-paper/15 dark:text-paper dark:hover:bg-paper/10"
          >
            Export CSV
          </button>
        </div>

        <ResultsTable
          results={results}
          sortBy={filters.sortBy}
          sortDir={filters.sortDir}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}
