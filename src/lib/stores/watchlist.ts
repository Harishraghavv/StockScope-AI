"use client";

import { create } from "zustand";

interface WatchlistGroup {
  id: string;
  name: string;
  symbols: string[];
}

interface WatchlistStore {
  lists: WatchlistGroup[];
  activeListId: string;
  addList: (name: string) => void;
  removeList: (id: string) => void;
  setActiveList: (id: string) => void;
  addSymbol: (listId: string, symbol: string) => void;
  removeSymbol: (listId: string, symbol: string) => void;
}

function loadFromStorage(): WatchlistGroup[] {
  if (typeof window === "undefined") return getDefaults();
  try {
    const raw = localStorage.getItem("stockscope_watchlists");
    if (raw) return JSON.parse(raw);
  } catch {}
  return getDefaults();
}

function getDefaults(): WatchlistGroup[] {
  return [
    { id: "default", name: "My Watchlist", symbols: ["RELIANCE", "TCS", "SBIN", "TITAN"] },
    { id: "tech", name: "Tech Picks", symbols: ["TCS", "INFY", "WIPRO"] },
  ];
}

function saveToStorage(lists: WatchlistGroup[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("stockscope_watchlists", JSON.stringify(lists));
  } catch {}
}

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  lists: loadFromStorage(),
  activeListId: "default",

  addList: (name) => {
    const id = `list_${Date.now()}`;
    const updated = [...get().lists, { id, name, symbols: [] }];
    saveToStorage(updated);
    set({ lists: updated, activeListId: id });
  },

  removeList: (id) => {
    if (id === "default") return;
    const updated = get().lists.filter((l) => l.id !== id);
    saveToStorage(updated);
    set({ lists: updated, activeListId: updated[0]?.id ?? "default" });
  },

  setActiveList: (id) => set({ activeListId: id }),

  addSymbol: (listId, symbol) => {
    const updated = get().lists.map((l) =>
      l.id === listId && !l.symbols.includes(symbol)
        ? { ...l, symbols: [...l.symbols, symbol] }
        : l
    );
    saveToStorage(updated);
    set({ lists: updated });
  },

  removeSymbol: (listId, symbol) => {
    const updated = get().lists.map((l) =>
      l.id === listId ? { ...l, symbols: l.symbols.filter((s) => s !== symbol) } : l
    );
    saveToStorage(updated);
    set({ lists: updated });
  },
}));
