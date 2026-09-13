# Private household recipe planner

This update replaces the recipe interface with This week, All recipes, Basket and Add recipe. Weekly plans have meal categories only, no day-by-day calendar. The existing 172 seed recipes are preserved. Other site routes keep their existing behavior.

## Deployment setup

Production setup completed on 12 September 2026 for Vercel team `martib`, project `site`, using the locally authenticated Vercel CLI. The live app is https://www.martib.app/recipes/box. The Vercel connector can list the team but may still return no project; use the local CLI for project administration.

The Neon resource `martib-recipes` is connected only to Production. Household authentication, the OpenAI API key, and the recovery cron secret are configured in Production. Passwords and secrets are not stored in the repository. A separate `martib-recipes-preview` database is connected to Preview; preview household credentials and AI access have not been enabled.

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

Link imports now read browser-visible text, public recipe JSON-LD and page descriptions and pass that evidence to AI. The browser has a 20-second limit and the subsequent AI request a 25-second limit. Source material is untrusted; extraction must not substitute unrelated recipes or invent amounts. Screenshot controls and automatic image capture were removed. Existing diagnostic image endpoints remain authenticated until stored captures expire.

## Telegram companion

Production bot: `@lxdmeal_bot`. Set `TELEGRAM_BOT_TOKEN` in Vercel Production and deploy. In the signed-in recipe website, open Telegram companion and Connect a Telegram account. This validates the token with getMe, registers the HTTPS webhook with a secret derived from the household session secret, and creates a single-use connection link valid for 15 minutes. Each partner opens their own link and presses Start; only @mokin and @Aftertwoyears can connect. They can also simply press Start in the bot to enroll; Telegram supplies their verified username and the app pins their numeric account ID. Other usernames receive a private-bot error and cannot import. No household password is sent to Telegram. Website disconnect and `/disconnect` revoke access.

Send one link per message, optionally with recipe text or an English meal hashtag. The webhook atomically saves the recipe and import job into the existing household state before acknowledging delivery. Repeated delivery IDs and equivalent saved URLs do not create duplicates. The 30-job daily household allowance is shared with website imports; when exhausted or AI is unconfigured, the link is still saved with an explanation. New bot recipes are classified automatically unless a meal hashtag was supplied. Results require review and appear through normal website polling. The bot acknowledges saving and sends an import result. Failed result notifications can retry in the daily recovery cron; Telegram messages may rarely duplicate after an uncertain delivery response. Private group/channel messages, edited messages, and messages from unpaired accounts do not import recipes. Pairing hashes and Telegram routing metadata are excluded from browser snapshots.

The bot reads accessible recipe text; it cannot promise ingredients from private posts, paywalls, or video-only recipes. It reports failures and keeps the source link. Do not expose the bot token or webhook secret in logs or repository files. Rotating the household session secret requires reconnecting the webhook through the website. Preview does not share the production bot token.

Saving a new recipe with a source link or supplied caption and no manual ingredients automatically queues an import on the server in the same transaction as the recipe save. Replaying a save does not create a duplicate job. Imports do not depend on a second browser request. Existing recipe edits and recipes with manual ingredients do not automatically re-import; the explicit import button remains available. If the API key or daily allowance is unavailable, the recipe is still saved with an explanatory message.

Imports are stored as jobs before a background function starts. A job has a lease, attempt count and visible status. Manual retries and a daily recovery cron resume interrupted jobs; this is not a guarantee of immediate retry after a platform interruption. Automatic recovery handles one job per day on the Hobby-compatible schedule. The household limit is 30 requested jobs per day, at most three attempts per job; set a provider spending limit separately.

The agent uses OpenAI Responses API web search, with cited sources retained. Web search is used as a fallback if the direct browser read fails. Structured responses describe ingredients, quantities, serving counts, steps, and source-access status; refusal and incomplete-response errors are handled explicitly. Equivalent Instagram post URLs are matched by post ID rather than literal URL text. It reads accessible pages or supplied captions, not video pixels. Instagram/login-protected/video-only sources may need a pasted caption or manually entered ingredients. Exact-source evidence is required before accepting link-only extraction. Imported recipes require review, and missing quantities remain unknown. Manual name/tags are preserved. If the recipe changes during an import, the result is discarded rather than replacing the user's work.

Alphamega searches are domain-restricted, and only URLs present in returned search evidence are eligible. Matches are candidates, not live stock/price guarantees. Alternative products require acceptance. No supermarket login, cart writing, checkout, or purchase exists. Up to 15 unmatched ingredients are checked per job; manual search links are clearly labelled and are never presented as verified product links.

Live checks on 12 September 2026 verified caption extraction, missing-amount preservation, retention of manually entered names and tags, inaccessible-link handling, and an Alphamega search that returned no eligible product match. Temporary test recipes were removed, leaving the original 172 recipes. These checks do not establish successful matching of a real product, access to an Instagram reel, or live stock availability. Recommended further checks include a normal recipe page, a readable Instagram caption, two overlapping ingredient lists, and an alternative product.

Failed AI jobs distinguish billing/credit problems, rejected API keys, permissions, rate limits, invalid request settings, and timeouts. Provider error text and credentials are never exposed in these messages.

## PWA and privacy

Recipes has its own manifest and icons; the existing Budget manifest is preserved. The service worker handles only recipe navigation and its static assets. Visited pages and the last household snapshot stay on the signed-in device for offline viewing. Checkbox changes queue locally and sync in order with idempotency IDs; other edits require a connection. Opening an unvisited page offline shows a fallback. Sign-out clears the new local snapshot, pending queue and recipe caches. Offline data is accessible to someone with access to the unlocked device; the device's lock protects it. This is a shared household sign-in, not separate user accounts.

Install via the browser's normal Add to Home Screen / Install action. Share-target integration, push notifications and background video processing are not implemented.

## Validation

- `node --test tests/recipes*.test.mjs`
- `npm run build`
- Production checks passed for household sign-in, database reads and writes, stale-edit rejection, authenticated recipe pages, anonymous access rejection, cross-origin write rejection, and sign-out cookie clearing.
- Browser end-to-end checks should use a separate disposable database and exercise authentication, add/edit, filtering, planning, basket consolidation, offline replay, and logout.

Next.js was updated from the repository's vulnerable 15.5.8 to patched 15.5.25 during this change.
