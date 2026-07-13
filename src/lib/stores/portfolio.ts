"use client";

import { create } from "zustand";

export interface Holding {
  symbol: string;
  quantity: number;
  avgCost: number;
  addedAt: string;
}

interface PortfolioStore {
  holdings: Holding[];
  addHolding: (h: Omit<Holding, "addedAt">) => void;
  removeHolding: (symbol: string) => void;
  updateHolding: (symbol: string, updates: Partial<Holding>) => void;
}

function loadFromStorage(): Holding[] {
  if (typeof window === "undefined") return getDefaults();
  try {
    const raw = localStorage.getItem("stockscope_portfolio");
    if (raw) return JSON.parse(raw);
  } catch {}
  return getDefaults();
}

function getDefaults(): Holding[] {
  return [
    { symbol: "RELIANCE", quantity: 10, avgCost: 2800, addedAt: new Date(Date.now() - 86400000 * 30).toISOString() },
    { symbol: "TCS", quantity: 5, avgCost: 3700, addedAt: new Date(Date.now() - 86400000 * 20).toISOString() },
    { symbol: "SBIN", quantity: 50, avgCost: 780, addedAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  ];
}

function saveToStorage(holdings: Holding[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("stockscope_portfolio", JSON.stringify(holdings));
  } catch {}
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  holdings: loadFromStorage(),

  addHolding: (h) => {
    const existing = get().holdings.find((x) => x.symbol === h.symbol);
    let updated: Holding[];
    if (existing) {
      // Average up/down
      const totalQty = existing.quantity + h.quantity;
      const totalCost = existing.quantity * existing.avgCost + h.quantity * h.avgCost;
      updated = get().holdings.map((x) =>
        x.symbol === h.symbol
          ? { ...x, quantity: totalQty, avgCost: Number((totalCost / totalQty).toFixed(2)) }
          : x
      );
    } else {
      updated = [...get().holdings, { ...h, addedAt: new Date().toISOString() }];
    }
    saveToStorage(updated);
    set({ holdings: updated });
  },

  removeHolding: (symbol) => {
    const updated = get().holdings.filter((h) => h.symbol !== symbol);
    saveToStorage(updated);
    set({ holdings: updated });
  },

  updateHolding: (symbol, updates) => {
    const updated = get().holdings.map((h) =>
      h.symbol === symbol ? { ...h, ...updates } : h
    );
    saveToStorage(updated);
    set({ holdings: updated });
  },
}));
