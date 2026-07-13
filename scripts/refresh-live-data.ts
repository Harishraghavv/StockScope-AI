// Manually triggers a live quote refresh — useful for local development
// where there's no Vercel Cron running yet. In production, this same
// logic runs automatically via the scheduled job configured in
// vercel.json hitting /api/live-data/refresh.
//
// Usage: npm run live-data:refresh

import { refreshLiveQuotes } from "../src/lib/live-data/refresh-service";

async function main() {
  console.log("Refreshing live quotes from Twelve Data...");
  const result = await refreshLiveQuotes();

  if (result.skipped) {
    console.log(`Skipped: ${result.reason}`);
    return;
  }

  console.log(`Updated ${result.updated} quotes, ${result.failed} failed.`);
  if (result.reason) console.log(`Note: ${result.reason}`);
}

main()
  .catch((err) => {
    console.error("Refresh script failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
