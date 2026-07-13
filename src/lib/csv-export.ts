import type { ScreenerStock } from "@/lib/market-types";

const EXPORT_COLUMNS: { key: keyof ScreenerStock; label: string }[] = [
  { key: "symbol", label: "Symbol" },
  { key: "name", label: "Name" },
  { key: "sector", label: "Sector" },
  { key: "price", label: "Price" },
  { key: "changePercent", label: "Change %" },
  { key: "marketCap", label: "Market Cap (Cr)" },
  { key: "peRatio", label: "P/E" },
  { key: "roe", label: "ROE %" },
  { key: "roce", label: "ROCE %" },
  { key: "eps", label: "EPS" },
  { key: "debtToEquity", label: "Debt/Equity" },
  { key: "revenueGrowth", label: "Revenue Growth %" },
  { key: "profitGrowth", label: "Profit Growth %" },
  { key: "dividendYield", label: "Dividend Yield %" },
  { key: "rsi", label: "RSI" },
  { key: "macd", label: "MACD" },
];

function escapeCsvCell(value: unknown): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportScreenerResultsToCsv(results: ScreenerStock[]): void {
  const header = EXPORT_COLUMNS.map((c) => c.label).join(",");
  const rows = results.map((stock) =>
    EXPORT_COLUMNS.map((c) => escapeCsvCell(stock[c.key])).join(",")
  );
  const csv = [header, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `stockscope-screener-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
