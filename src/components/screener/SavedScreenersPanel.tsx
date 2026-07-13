"use client";

import { useState } from "react";
import type { ScreenerFilters } from "@/lib/market-types";
import { useToastStore } from "@/lib/stores/toast-store";

export interface SavedScreenerRecord {
  id: string;
  name: string;
  filters: ScreenerFilters;
  createdAt: string;
}

export default function SavedScreenersPanel({
  saved,
  currentFilters,
  onLoad,
  onSaved,
  onDeleted,
}: {
  saved: SavedScreenerRecord[];
  currentFilters: ScreenerFilters;
  onLoad: (filters: ScreenerFilters) => void;
  onSaved: (record: SavedScreenerRecord) => void;
  onDeleted: (id: string) => void;
}) {
  const push = useToastStore((s) => s.push);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      push("Give this screener a name first.", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/screener/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), filters: currentFilters }),
      });
      const json = await res.json();
      if (!res.ok) {
        push(json.error?.message ?? "Could not save screener.", "error");
        return;
      }
      onSaved(json.data.saved);
      setName("");
      push("Screener saved.", "success");
    } catch {
      push("Network error. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/screener/saved/${id}`, { method: "DELETE" });
      if (!res.ok) {
        push("Could not delete this screener.", "error");
        return;
      }
      onDeleted(id);
      push("Screener deleted.", "success");
    } catch {
      push("Network error. Please try again.", "error");
    }
  }

  return (
    <div className="rounded-xl border border-ink/8 bg-white p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark">
      <h3 className="font-display text-[14px] font-medium text-ink dark:text-paper">
        Saved screeners
      </h3>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Name this filter set"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-ink/12 bg-white px-2.5 py-1.5 text-[13px] text-ink placeholder:text-ink/35 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-paper/15 dark:bg-surface-dark dark:text-paper"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 rounded-md bg-brand-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {saved.length === 0 ? (
        <p className="mt-3 text-xs text-ink/40 dark:text-paper/40">
          No saved screeners yet.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-1">
          {saved.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-md px-1.5 py-1 hover:bg-ink/[0.03] dark:hover:bg-paper/[0.05]"
            >
              <button
                onClick={() => onLoad(item.filters)}
                className="truncate text-left text-[13px] text-ink/80 hover:text-brand-600 dark:text-paper/80 dark:hover:text-brand-400"
              >
                {item.name}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                aria-label={`Delete ${item.name}`}
                className="ml-2 shrink-0 text-ink/30 hover:text-fall"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
