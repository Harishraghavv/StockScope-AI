import { create } from "zustand";

interface RecentSearchesState {
  recent: string[];
  addSearch: (symbol: string) => void;
}

const MAX_RECENT = 6;

export const useRecentSearchesStore = create<RecentSearchesState>((set) => ({
  // Seeded with a couple of illustrative entries so the dashboard panel
  // isn't empty on first load; real usage will populate this as the user
  // searches once the Screener/Search module ships.
  recent: ["RELIANCE", "INFY"],
  addSearch: (symbol) =>
    set((state) => ({
      recent: [symbol, ...state.recent.filter((s) => s !== symbol)].slice(0, MAX_RECENT),
    })),
}));
