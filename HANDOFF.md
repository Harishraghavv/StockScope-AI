# StockScope AI — Project Handoff Document

**Purpose of this document:** a complete, honest snapshot of what's built, what's not, what's broken, and exactly how to pick this project up in a new tool (Google Antigravity, Cursor, Claude Code, or a human developer). Give this whole file to whatever tool you switch to.

Last updated: mid-build, after the Live Data module. Read this before touching any code.

---

## 1. What this project is

A Next.js 14 + TypeScript + Prisma + PostgreSQL stock research web app called **StockScope AI**. Educational only — every page explicitly states it does not give investment advice.

**Tech stack actually in use** (not the original proposal's stack — this was simplified early on, see §6):
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- PostgreSQL (hosted on Neon, free tier) + Prisma ORM
- JWT auth via `jose`, bcrypt password hashing
- Zustand for client state
- Zod for validation

---

## 2. What's fully built and confirmed working

Confirmed means: the project owner ran it locally and visually verified it worked.

| Module | Status | Notes |
|---|---|---|
| **Auth** (register/login/logout/forgot password) | Confirmed working | JWT in httpOnly cookie, bcrypt hashing, rate-limited login, audit log |
| **Dashboard** (indices, gainers/losers, sector heatmap, watchlist summary, news preview, AI insights preview, recent searches) | Confirmed working | All on mock data originally |
| **Stock Screener** (filters, sorting, CSV export, save/load screeners) | Confirmed working | Saved screeners persist to Postgres |
| **AI Financial Health Score + explanation** (on company pages) | Built, not yet run by owner | Transparent rule-based score + LLM explanation with template fallback |
| **Live NSE price integration** (Twelve Data) | Built, but blocked — see §4 | Code is done; a local environment issue is preventing the DB migration from running |

## 3. What is NOT built yet

From the original spec, still outstanding:
- Company Explorer's remaining pieces: full quarterly/annual financial statements, technical charts (price history, moving averages as charts not just numbers), shareholding pattern, competitor comparison table
- Portfolio tracker
- Earnings calendar
- Full News Center (currently only a 5-item preview embedded in the dashboard)
- Sector Analysis as its own dedicated page (currently only the dashboard heatmap)
- Admin dashboard (role-gating exists in middleware, but no admin UI/pages built)
- Google OAuth login (spec marked this optional)
- Deployment (no GitHub repo pushed yet, no Vercel project created yet)

Roughly **6 of the original ~20 pages** are functionally complete.

---

## 4. Active blocker — read this first

**Symptom:** `npm run prisma:migrate` fails with:
```
Error: P1001: Can't reach database server at `<neon-hostname>:5432`
```

**What's been ruled out** (all confirmed working):
- Database password is correct and current
- Connection string format is correct (no `-pooler`, correct `sslmode=require`)
- Neon has no IP allowlist restricting access
- Raw TCP connectivity works (`Test-NetConnection` succeeds)
- Node.js's own `net` module can connect successfully
- Windows Firewall is not blocking it (tested with firewall temporarily off)
- Forcing IPv4 resolution (`--dns-result-order=ipv4first`) did not fix it

**Leading theory, not yet confirmed:** the owner's machine is running **Node.js v26.3.0**, a very new/unstable version far ahead of Prisma 5.22's tested range (Prisma typically supports Node 18/20/22 LTS lines). Prisma's compiled query-engine binary may not be compatible with this Node version, even though plain Node networking works fine.

**Next step to try:** install `nvm-windows` (https://github.com/coreybutler/nvm-windows/releases), then:
```powershell
nvm install 20
nvm use 20
node --version   # should show v20.x.x
npm install       # reinstall deps against Node 20
npm run prisma:migrate
```
This was in progress (nvm-windows installer was downloaded, not yet run) when the tooling switch happened. Do this first before anything else — it's a machine-level issue that will follow the project into any new tool/IDE.

If Node 20 doesn't fix it, other untried options: try Prisma 6.x (`npm i --save-dev prisma@latest @prisma/client@latest` — note this is a major version bump, check Prisma's migration guide), or try connecting via a completely different network (e.g. phone hotspot) to rule out an ISP-level block on port 5432 that only affects long-lived/TLS connections in a way simple TCP tests don't reveal.

---

## 5. Environment variables — what's needed, what's real

The `.env` file is never included in any zip/export (correctly gitignored). Whoever continues this needs to recreate it using `.env.example` as the template, with fresh, rotated credentials — see §7 for why.

Required for the app to run at all:
```
DATABASE_URL=          # Neon Postgres connection string (direct, not pooled)
JWT_SECRET=             # openssl rand -base64 48
JWT_EXPIRES_IN="7d"
COOKIE_NAME="stockscope_token"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

Optional, feature-gated (app works fine with these blank — falls back to mock/template):
```
TWELVE_DATA_API_KEY=    # enables live NSE prices (get free key: twelvedata.com)
CRON_SECRET=            # any random string, protects the live-data refresh endpoint
ANTHROPIC_API_KEY=      # enables real AI-generated explanations (get key: console.anthropic.com)
```

Not yet used by any code (reserved for future modules, safe to leave blank):
```
ALPHA_VANTAGE_API_KEY=
NEWS_API_KEY=
OPENAI_API_KEY=
SMTP_HOST= / SMTP_PORT= / SMTP_USER= / SMTP_PASSWORD= / EMAIL_FROM=
```

---

## 6. Key architectural decisions (so a new tool doesn't undo them by accident)

1. **Next.js full-stack, not separate Express backend.** The original proposal specified Node/Express + separate React frontend. This was deliberately simplified to Next.js App Router (API routes live in `src/app/api/*`) early on, by the owner's own choice. Don't "fix" this back to Express unless asked.

2. **The "provider" pattern for data sources.** Every piece of market/screener data flows through exactly one file:
   - `src/lib/providers/market-data.ts` — dashboard data (indices, gainers/losers, sectors, news, watchlist)
   - `src/lib/providers/screener-data.ts` — screener universe + filtering

   These files currently blend mock data (`src/lib/mock-data/`) with live cached data (`src/lib/live-data/`) when available. Any new data source should be added inside these provider files, not by having components fetch directly — this is the single most important pattern to preserve, since it's what let live data get added without touching any UI component.

3. **Live data is cached, not fetched per-request.** `src/lib/live-data/refresh-service.ts` populates a `LiveQuote` Postgres table on a schedule (Vercel Cron in production, `npm run live-data:refresh` manually in dev). Pages read from that cached table, never call Twelve Data directly. This exists because the free API tier only allows 8 requests/minute — don't remove this caching layer without replacing it with something equivalent, or the app will hit rate limits constantly.

4. **The Financial Health Score is intentionally transparent, not a black box.** `src/lib/scoring/financial-health.ts` has named weight constants and returns a full factor-by-factor breakdown. This was a deliberate choice (the "special feature" for a mentor demo) — don't replace it with an opaque ML model.

5. **AI explanation has a working fallback.** `src/lib/ai/explain-stock.ts` calls Anthropic's API if `ANTHROPIC_API_KEY` is set, otherwise generates a deterministic template from the same score data. Both paths are tested; keep both working if this file is touched.

6. **Database schema was deliberately kept minimal.** `prisma/schema.prisma` only has tables for things actually persisted: `User`, `Session`, `AuditLog`, `SavedScreener`, `LiveQuote`. Company/stock/news data is intentionally not in Postgres — it's mock data or live-cached, not database-modeled. If continuing to build the Company Explorer or Portfolio modules, decide deliberately whether those need new Prisma models (Portfolio definitely will; Company Explorer's financials probably can stay mock/illustrative like everything else).

---

## 7. Security note for whoever continues this

Over the course of building this, several real credentials were accidentally pasted into the AI chat conversation that produced this codebase (a Neon database password, a Twelve Data API key, a JWT secret). All of these were rotated by the project owner before this handoff. If you're a new developer/tool picking this up:

- Do not reuse any credential visible in old chat logs or screenshots related to this project
- Generate entirely fresh values for `JWT_SECRET`, database password, and any API keys before deploying anywhere public
- Treat `.env` as sensitive from day one — never paste its contents into any chat, ticket, or commit

---

## 8. How to actually run this project

```bash
npm install
cp .env.example .env
# edit .env with real values — see §5

npm run prisma:generate
npm run prisma:migrate     # name it "init" if this is a fresh database
npm run db:seed            # creates demo@stockscope.ai / Demo1234

npm run dev
```

Visit `http://localhost:3000`.

To enable live NSE prices (optional): add `TWELVE_DATA_API_KEY` + `CRON_SECRET` to `.env`, run `npm run live-data:refresh` once manually, reload the dashboard.

To enable real AI explanations (optional): add `ANTHROPIC_API_KEY` to `.env`, restart the dev server, visit any company page.

---

## 9. Suggested next steps, in priority order

1. Fix the Node/Prisma migration blocker (§4) — nothing else matters until this works
2. Run the live-data migration (`add_live_quotes`) once unblocked, confirm live prices show on the dashboard
3. Decide on deployment target (Vercel + Neon was the plan) and actually deploy — get a live URL before building more features
4. Then continue with remaining modules (§3) in whatever order matters most for the mentor deadline

---

## 10. Full file map (as of this handoff)

```
src/
  app/
    (auth)/login, register, forgot-password/     - auth pages
    api/
      auth/                                       - register, login, logout, forgot-password, me
      dashboard/                                  - dashboard JSON API
      screener/                                   - screener results API + saved screeners CRUD
      company/[symbol]/ai-summary/                - AI score + explanation API
      live-data/refresh/                          - triggers live quote cache refresh
    dashboard/                                     - main dashboard page
    screener/                                       - stock screener page
    watchlist/, news/                              - placeholder pages (not yet built)
    company/[symbol]/                              - company detail page (partial - has AI summary, missing financials/charts)
  components/
    auth/                                          - login/register/forgot-password forms, shared AuthShell, ticker strip
    dashboard/                                      - AppHeader, panels, widgets
    screener/                                       - FilterSidebar, ResultsTable, SavedScreenersPanel, ScreenerClient
    company/                                        - ScoreBreakdownCard, AiSummaryPanel
    ui/                                              - Button, FormField, Toaster (shared primitives)
  lib/
    auth/                                            - jwt.ts, password.ts, cookies.ts, current-user.ts
    providers/                                       - market-data.ts, screener-data.ts (THE data-source seam - see #6)
    mock-data/                                       - stocks.ts, screener.ts (illustrative data)
    live-data/                                       - twelve-data-client.ts, refresh-service.ts
    scoring/                                         - financial-health.ts (transparent scoring engine)
    ai/                                              - explain-stock.ts (LLM + template fallback)
    stores/                                          - Zustand: auth, toast, recent-searches
    validation/                                      - Zod schemas: auth.ts, screener.ts
    market-types.ts                                  - shared TypeScript types for all market/screener data
    format.ts, csv-export.ts, api-response.ts, prisma.ts
  middleware.ts                                       - route protection (auth-gated pages)
prisma/
  schema.prisma                                       - User, Session, AuditLog, SavedScreener, LiveQuote
  seed.ts                                              - demo + admin user seed data
scripts/
  refresh-live-data.ts                                 - manual trigger for live quote refresh
vercel.json                                            - Cron config for production live-data refresh (free tier only allows daily, see README)
README.md                                              - full setup + module documentation (more detail than this file on day-to-day usage)
```
