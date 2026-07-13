import type { ScreenerStock } from "@/lib/market-types";

// ============================================================
// Financial Health Score — transparent, rule-based, explainable.
//
// Design principle: every number that goes into the final score is
// visible to the user (see ScoreBreakdown below). This is deliberately
// NOT a black-box ML model — the goal is that a student (or a mentor
// evaluating this project) can look at any score and verify by hand
// exactly why a company got that number. Weights are named constants
// so they're easy to justify and easy to change.
//
// This is illustrative educational scoring on mock fundamentals — not
// a real investment methodology, and never framed as one in the UI.
// ============================================================

export interface ScoreFactor {
  label: string;
  value: number; // the raw metric value, for display
  points: number; // points awarded out of `maxPoints`
  maxPoints: number;
  note: string; // one-line plain-English reasoning for this factor
}

export interface ScoreBreakdown {
  totalScore: number; // 0-100
  band: "Strong" | "Moderate" | "Weak";
  factors: ScoreFactor[];
}

// Each factor's weight, out of 100 total. Chosen to be roughly balanced
// across profitability, leverage, growth, and valuation — the same four
// buckets a screener-style fundamental analysis usually covers.
const WEIGHTS = {
  roe: 20,
  roce: 15,
  debtToEquity: 20,
  revenueGrowth: 15,
  profitGrowth: 15,
  peRatio: 15,
} as const;

/** Linear interpolation of a value between [lo, hi] onto [0, maxPoints], clamped. */
function scoreRange(value: number, lo: number, hi: number, maxPoints: number): number {
  const clamped = Math.max(lo, Math.min(hi, value));
  const fraction = (clamped - lo) / (hi - lo);
  return Number((fraction * maxPoints).toFixed(1));
}

export function computeFinancialHealthScore(stock: ScreenerStock): ScoreBreakdown {
  const factors: ScoreFactor[] = [];

  // ROE — higher is better, 8%-30% mapped to 0-full points.
  const roePoints = scoreRange(stock.roe, 8, 30, WEIGHTS.roe);
  factors.push({
    label: "Return on Equity (ROE)",
    value: stock.roe,
    points: roePoints,
    maxPoints: WEIGHTS.roe,
    note:
      stock.roe >= 20
        ? "Strong efficiency at turning shareholder capital into profit."
        : stock.roe >= 12
        ? "Moderate capital efficiency, in line with many established companies."
        : "Below-average capital efficiency versus typical large-cap benchmarks.",
  });

  // ROCE — similar shape, 8%-28%.
  const rocePoints = scoreRange(stock.roce, 8, 28, WEIGHTS.roce);
  factors.push({
    label: "Return on Capital Employed (ROCE)",
    value: stock.roce,
    points: rocePoints,
    maxPoints: WEIGHTS.roce,
    note:
      stock.roce >= 18
        ? "Capital (equity + debt) is being deployed productively."
        : stock.roce >= 10
        ? "Reasonable but unremarkable returns on total capital employed."
        : "Capital employed is generating comparatively low returns.",
  });

  // Debt-to-equity — LOWER is better, 0 to 2.0 mapped inverted.
  const debtPoints = WEIGHTS.debtToEquity - scoreRange(stock.debtToEquity, 0, 2, WEIGHTS.debtToEquity);
  factors.push({
    label: "Debt-to-Equity",
    value: stock.debtToEquity,
    points: Number(debtPoints.toFixed(1)),
    maxPoints: WEIGHTS.debtToEquity,
    note:
      stock.debtToEquity <= 0.4
        ? "Conservative balance sheet with low reliance on borrowed capital."
        : stock.debtToEquity <= 1.0
        ? "Moderate leverage — worth watching alongside interest coverage."
        : "Relatively high leverage; sensitive to interest rate changes.",
  });

  // Revenue growth — -5% to +20% mapped.
  const revGrowthPoints = scoreRange(stock.revenueGrowth, -5, 20, WEIGHTS.revenueGrowth);
  factors.push({
    label: "Revenue Growth (YoY)",
    value: stock.revenueGrowth,
    points: revGrowthPoints,
    maxPoints: WEIGHTS.revenueGrowth,
    note:
      stock.revenueGrowth >= 12
        ? "Healthy top-line growth versus the prior year."
        : stock.revenueGrowth >= 0
        ? "Modest but positive revenue growth."
        : "Revenue contracted year-over-year — worth investigating why.",
  });

  // Profit growth — -12% to +25% mapped.
  const profitGrowthPoints = scoreRange(stock.profitGrowth, -12, 25, WEIGHTS.profitGrowth);
  factors.push({
    label: "Profit Growth (YoY)",
    value: stock.profitGrowth,
    points: profitGrowthPoints,
    maxPoints: WEIGHTS.profitGrowth,
    note:
      stock.profitGrowth >= 15
        ? "Profit is growing faster than a typical large-cap benchmark."
        : stock.profitGrowth >= 0
        ? "Profit growth is positive but unremarkable."
        : "Profit declined year-over-year — margin pressure or one-off costs are common causes.",
  });

  // P/E — this one is U-shaped in reality (too low can mean distress, too
  // high can mean overvaluation), but for a simple transparent score we
  // reward a "reasonable" band and taper off at both extremes.
  const peDistanceFromIdeal = Math.abs(stock.peRatio - 22); // 22 treated as a neutral midpoint
  const pePoints = WEIGHTS.peRatio - scoreRange(peDistanceFromIdeal, 0, 25, WEIGHTS.peRatio);
  factors.push({
    label: "P/E Ratio (valuation)",
    value: stock.peRatio,
    points: Number(pePoints.toFixed(1)),
    maxPoints: WEIGHTS.peRatio,
    note:
      stock.peRatio < 12
        ? "Trading cheaply relative to earnings — could reflect an overlooked company or a real risk; needs further reading."
        : stock.peRatio <= 30
        ? "Valuation is within a range common for established companies."
        : "Priced at a premium relative to current earnings.",
  });

  const totalScore = Math.round(factors.reduce((sum, f) => sum + f.points, 0));
  const band: ScoreBreakdown["band"] =
    totalScore >= 70 ? "Strong" : totalScore >= 45 ? "Moderate" : "Weak";

  return { totalScore, band, factors };
}
