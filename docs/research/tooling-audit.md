# Tooling Audit (local machine, 2026-06-10)

Nothing new installed for this research phase, per project constraints.

## CLIs present

| Tool | Version | Status |
|---|---|---|
| git | 2.50.1 | ✅ |
| gh (GitHub CLI) | 2.92.0 | ✅ authenticated as **GeLX7** (keyring, HTTPS) |
| vercel | 54.4.0 | ✅ installed, ⚠️ outdated (54.11.1 latest) — upgrade at implementation: `npm i -g vercel@latest` |
| node | v26.0.0 | ✅ (Node 24 LTS is Vercel default runtime — fine) |
| npm | 11.12.1 | ✅ |
| jq | 1.7.1 | ✅ |
| ffmpeg | installed | ✅ (not needed for this project) |
| pnpm / bun | — | ❌ not installed (npm is fine; pnpm optional later) |
| supabase CLI | — | ❌ install at implementation (migrations/local dev): `brew install supabase/tap/supabase` |
| playwright | — | ❌ no global install; `webapp-testing` skill provisions it on demand for UI testing |
| stripe CLI | — | ❌ irrelevant (Stripe unavailable in Peru) |

## MCP servers connected (relevant ones)

- **github** — full repo/PR/issue management (pairs with authed `gh`)
- **vercel (plugin)** — deployments, projects, logs, **domain availability** (used: lacasaderoos.com available $11.25/yr)
- **Supabase (claude.ai)** — project/DB management when we create the database (Phase 1 implementation)
- **context7 / ctx7 CLI** — current library docs during implementation
- **gsc (Google Search Console)** — SEO monitoring once domain is verified
- **Cloudinary** — image pipeline option if repo-hosted images outgrow us
- Figma / Canva / Adobe — available for design assets if needed
- expo — irrelevant (web-only project)

## Verified packages (npm registry, 2026-06-10)

- `ical-generator` 11.0.0 — generate our per-room feeds
- `node-ical` 0.26.1 — parse Airbnb exports

## Recommended additions (at implementation, not now)

1. `vercel@latest` upgrade · 2. `supabase` CLI · 3. project deps per `../architecture/recommended-stack.md` (next, tailwind, drizzle-orm, resend, react-email, node-ical, ical-generator, zod, date-fns, next-intl). No new MCPs required — current set covers GitHub, Vercel, DB, docs, SEO.
