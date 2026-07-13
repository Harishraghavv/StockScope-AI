import type { SectorPerformance } from "@/lib/market-types";
import { formatPercent, formatMarketCapCrores } from "@/lib/format";

// Maps a change percentage to a heat intensity, clamped to a reasonable
// visual range so a single outlier doesn't wash out the rest of the grid.
function heatStyle(changePercent: number): React.CSSProperties {
  const clamped = Math.max(-3, Math.min(3, changePercent));
  const intensity = Math.abs(clamped) / 3; // 0 to 1
  const isUp = changePercent >= 0;
  const alpha = 0.12 + intensity * 0.55;
  return {
    backgroundColor: isUp
      ? `rgba(31, 160, 106, ${alpha})`
      : `rgba(214, 69, 69, ${alpha})`,
  };
}

export default function SectorHeatmap({ sectors }: { sectors: SectorPerformance[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1 sm:grid-cols-3">
      {sectors.map((sector) => (
        <div
          key={sector.sector}
          style={heatStyle(sector.changePercent)}
          className="rounded-lg p-3"
        >
          <p className="truncate text-[13px] font-medium text-ink dark:text-paper">
            {sector.sector}
          </p>
          <p className="mt-1 font-mono text-sm font-medium text-ink dark:text-paper">
            {formatPercent(sector.changePercent)}
          </p>
          <p className="mt-0.5 text-[11px] text-ink/50 dark:text-paper/50">
            {formatMarketCapCrores(sector.marketCap)}
          </p>
        </div>
      ))}
    </div>
  );
}
