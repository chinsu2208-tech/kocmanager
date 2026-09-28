# KOC Manager — Base44 dev environment

## What this is
Next.js 14 (App Router, server actions) + Supabase (external hosted Postgres). All pages are
server components calling `getSupabase()` from `lib/supabase.ts`.

## Running
`docker compose -f docker-compose.base44.yml up -d`

- Service `web`: `node:20-bookworm-slim`, bind-mounts `./koc-manager` to `/app`, runs
  `npm install && npx next dev -H 0.0.0.0 -p 3000` — dev server with hot reload, no image rebuild needed.
- `node_modules` lives in a named volume so installs don't touch the bind mount.
- Healthcheck: node http.get to `/`, accepts any HTTP response (<600) — pages return 200/500
  depending on Supabase, so a status-code gate would flap.

## Credentials (external — Supabase)
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are the ONLY env vars needed.
- Placeholders in `.env.base44-defaults` (first env_file) let the dev server boot and pages render
  (empty state); with placeholders every Supabase query silently fails, so no data can be saved.
- Real values go into the platform-managed `/run/base44/app.env` (last env_file — always wins),
  delivered after the user provides them. Never put them under compose `environment:`.
- The user must ALSO run `supabase/schema.sql` in their Supabase project's SQL Editor once,
  or the tables won't exist even with real credentials.
- Precedence check: `docker compose exec -T web sh -c 'printenv NEXT_PUBLIC_SUPABASE_URL | head -c 30'`
  should NOT print the placeholder URL once real credentials land.

## Quirks
- The project lives in the `koc-manager/` subdirectory of the repo, not the repo root.
- `next.config.js` gained `allowedDevOrigins` (from `BASE44_PUBLIC_HOST_SUFFIX`) so the preview
  proxy can reach the dev server — do not remove.
- npm warns about Node 20 vs @supabase/supabase-js wanting Node 22; works fine on 20, no action needed.
- Watch polling (`WATCHPACK_POLLING`) is on for the bind mount.

## Verify
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → 200 with placeholders (empty state).
- Real end-to-end (add KOC / create campaign) only works once real credentials are set AND schema.sql is applied.
