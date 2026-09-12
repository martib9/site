# Private household recipe planner

This update replaces the recipe interface with This week, All recipes, Basket and Add recipe. Weekly plans have meal categories only, no day-by-day calendar. The existing 172 seed recipes are preserved. Other site routes keep their existing behavior.

## Deployment setup

The verified GitHub deployment status points to Vercel team `martib`, project `site`. The connected Vercel app currently returns no projects, so provisioning and live deployment have not been completed.

Configure these server-only environment variables in the Vercel project (use a separate database for preview deployments):

- `DATABASE_URL`: pooled Postgres connection URL, preferably Neon through Vercel Marketplace. Use the provider's SSL settings; never disable certificate verification.
- `RECIPES_PASSWORD`: a shared household passphrase of at least 16 characters. Set securely in Vercel; never commit it.
- `RECIPES_SESSION_SECRET`: at least 32 random characters. Rotating this invalidates sessions.
- `OPENAI_API_KEY`: enables the in-app recipe agent and Alphamega matching. Without it manual recipes and shopping still work and the UI explains that the agent is not connected.
- `RECIPES_AI_MODEL`: optional, defaults to `gpt-4.1`, using Responses API web search.
- `CRON_SECRET`: random secret for the daily recovery job.

Use a Node.js version supported by the installed Next.js and Vercel packages. Recipe job functions use a 60-second maximum, compatible with this project’s Hobby configuration. AI requests time out after 40 seconds, leaving time to save a result or failure for retry. Database tables are created lazily on the first authenticated sign-in attempt; the connection needs CREATE TABLE privileges. A single household document is updated under a Postgres row lock, so both partners' operations are serialized. Recipe editing additionally checks revisions to avoid overwriting concurrent edits.

The user requested a direct commit to main for automatic deployment. Until private access and the database are configured, the recipe area deliberately fails closed with a setup screen.

## Data migration

Seed data initializes only an empty household database. Existing browser-local records are never silently discarded. Each previously used browser offers an explicit import for custom recipes, edits, deleted seed IDs, cooked states and its weekly plan. Import each relevant browser once, reviewing conflicts between devices before importing. The import is idempotent by device ID. Original local-storage records are left intact as a backup. Because older browser data can conflict, importing another browser intentionally applies its explicit edits and deletions to the shared household.

Existing seed links are already present in the public repository's history. Household authentication protects new shared state, not the historical public repository. No new household data or secrets are committed.

## Agent behavior and limits

Imports are stored as jobs before a background function starts. A job has a lease, attempt count and visible status. Manual retries and a daily recovery cron resume interrupted jobs; this is not a guarantee of immediate retry after a platform interruption. Automatic recovery handles one job per day on the Hobby-compatible schedule. The household limit is 30 requested jobs per day, at most three attempts per job; set a provider spending limit separately.

The agent uses OpenAI Responses API web search, with cited sources retained. It reads accessible pages or supplied captions, not video pixels. Instagram/login-protected/video-only sources may need a pasted caption or manually entered ingredients. Exact-source evidence is required before accepting link-only extraction. Imported recipes require review, and missing quantities remain unknown. Manual name/tags are preserved. If the recipe changes during an import, the result is discarded rather than replacing the user's work.

Alphamega searches are domain-restricted, and only URLs present in returned search evidence are eligible. Matches are candidates, not live stock/price guarantees. Alternative products require acceptance. No supermarket login, cart writing, checkout, or purchase exists. Up to 15 unmatched ingredients are checked per job; manual search links are clearly labelled and are never presented as verified product links.

Live AI extraction and product matching must be tested with real credentials before production. Recommended release checks: a normal recipe page, a readable Instagram caption, an inaccessible reel, missing amounts, two overlapping ingredient lists, an alternative product, and no-result handling.

## PWA and privacy

Recipes has its own manifest and icons; the existing Budget manifest is preserved. The service worker handles only recipe navigation and its static assets. Visited pages and the last household snapshot stay on the signed-in device for offline viewing. Checkbox changes queue locally and sync in order with idempotency IDs; other edits require a connection. Opening an unvisited page offline shows a fallback. Sign-out clears the new local snapshot, pending queue and recipe caches. Offline data is accessible to someone with access to the unlocked device; the device's lock protects it. This is a shared household sign-in, not separate user accounts.

Install via the browser's normal Add to Home Screen / Install action. Share-target integration, push notifications and background video processing are not implemented.

## Validation

- `node --test tests/recipes.test.mjs`
- `npm run build`
- Browser end-to-end checks should use a separate disposable database and exercise authentication, add/edit, filtering, planning, basket consolidation, offline replay, and logout.

Next.js was updated from the repository's vulnerable 15.5.8 to patched 15.5.25 during this change.
