import type { ScreenerStock } from "@/lib/market-types";
import type { ScoreBreakdown } from "@/lib/scoring/financial-health";

export interface AiExplanation {
  summary: string; // 2-4 sentence plain-English explanation
  source: "ai" | "template"; // which path generated this, shown transparently in the UI
}

const SYSTEM_PROMPT = `You are an educational financial writing assistant for StockScope AI, a stock research tool for students.
Given a company's fundamental metrics and a computed financial health score breakdown, write a SHORT (3-4 sentence) plain-English explanation of what the numbers suggest and why the score came out the way it did.

Rules you must follow:
- Never recommend buying, selling, or holding the stock.
- Never use words like "should invest", "target price", "buy", "sell".
- Ground every sentence in the specific numbers provided — do not invent facts not in the data.
- Write for someone learning to read financial statements, not a professional analyst.
- End with one sentence suggesting what a student could research next to verify the picture (e.g. "check whether this holds across the last few quarters").`;

function buildUserPrompt(stock: ScreenerStock, score: ScoreBreakdown): string {
  const factorLines = score.factors
    .map((f) => `- ${f.label}: ${f.value} (${f.points}/${f.maxPoints} pts) — ${f.note}`)
    .join("\n");

  return `Company: ${stock.name} (${stock.symbol}), sector: ${stock.sector}
Financial Health Score: ${score.totalScore}/100 (${score.band})

Factor breakdown:
${factorLines}

Write the explanation now.`;
}

/**
 * Calls Anthropic's API if ANTHROPIC_API_KEY is set in the environment.
 * Falls back to a deterministic, template-based explanation (clearly
 * labeled as such in the UI) if no key is present or the call fails —
 * so the feature always works, with or without a live key.
 */
export async function generateAiExplanation(
  stock: ScreenerStock,
  score: ScoreBreakdown
): Promise<AiExplanation> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return { summary: buildTemplateExplanation(stock, score), source: "template" };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(stock, score) }],
      }),
    });

    if (!response.ok) {
      console.error("AI explanation request failed:", response.status, await response.text());
      return { summary: buildTemplateExplanation(stock, score), source: "template" };
    }

    const data = await response.json();
    const text = data.content
      ?.map((block: { type: string; text?: string }) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    if (!text) {
      return { summary: buildTemplateExplanation(stock, score), source: "template" };
    }

    return { summary: text, source: "ai" };
  } catch (err) {
    console.error("AI explanation error:", err);
    return { summary: buildTemplateExplanation(stock, score), source: "template" };
  }
}

/**
 * Deterministic fallback — built from the same factor breakdown the AI
 * path would use, so it stays grounded in real numbers, not generic
 * filler, even without a live model call.
 */
function buildTemplateExplanation(stock: ScreenerStock, score: ScoreBreakdown): string {
  const strongest = [...score.factors].sort((a, b) => b.points / b.maxPoints - a.points / a.maxPoints)[0];
  const weakest = [...score.factors].sort((a, b) => a.points / a.maxPoints - b.points / b.maxPoints)[0];

  return `${stock.name} scores ${score.totalScore}/100 (${score.band.toLowerCase()}) on this illustrative Financial Health Score. Its strongest factor is ${strongest.label.toLowerCase()} at ${strongest.value}, ${strongest.note.toLowerCase()} Its weakest factor is ${weakest.label.toLowerCase()} at ${weakest.value}, ${weakest.note.toLowerCase()} Worth checking whether this pattern holds across the last few quarterly reports rather than a single snapshot.`;
}
