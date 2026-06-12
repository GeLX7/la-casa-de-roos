# Runbook — Supabase Setup for Admin Mode

Goal: take Admin Mode from "setup-needed" to fully working. Nothing here is
automatic: creating the project, applying migrations and seeding all require
explicit owner/operator action and approval.

## 0. Prerequisites

- Access to https://supabase.com (free tier is enough to start).
- Access to the Vercel project (`la-casa-de-roos`) to set env vars.
- This repo checked out.

## 1. Create the Supabase project (manual, needs approval)

1. Supabase Dashboard → New project. Suggested name: `la-casa-de-roos`.
   Region: closest to guests/owner (e.g. `sa-east-1` São Paulo).
2. Save the database password in a password manager (not in the repo).
3. From **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**secret, server-only —
     never expose with a `NEXT_PUBLIC_` prefix and never commit it**)

## 2. Apply the migrations (in order)

Option A — SQL editor (simplest): paste and run, in this order:

1. `supabase/migrations/20260611143000_booking_calendar_foundation.sql`
2. `supabase/migrations/20260611170000_admin_catalog_foundation.sql`

Option B — Supabase CLI:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

## 3. Seed the catalog with the current site content

The seed file mirrors `src/data/listings.ts` exactly (4 suites, features,
notes, rules, gallery metadata, Airbnb ratings, calendar source refs):

1. If `listings.ts` changed since the file was generated, regenerate first:
   `node scripts/seed-rooms.ts`
2. Run `supabase/seed/admin_catalog_seed.sql` in the SQL editor (or
   `psql -f`).

⚠ Run the seed **once**, at initial setup. Re-running later overwrites any
edits the owner made to those four suites in the admin.

## 4. Configure the admin credentials (no Supabase Auth)

Admin login is username + password verified against env vars — Supabase Auth
is not involved, so no auth user is created. **The plaintext password must
never be committed, logged, or pasted into chats/issues.**

1. On your local machine, generate the salted PBKDF2 hash (the script prompts
   twice with hidden input and prints only the hash):

```bash
node scripts/hash-admin-password.mjs
# or pipe it straight into Vercel so the hash never shows on screen:
node scripts/hash-admin-password.mjs | vercel env add ADMIN_PASSWORD_HASH production
```

2. Generate the session-signing secret:

```bash
openssl rand -base64 48
```

3. You now have the four admin env vars for step 5: `ENABLE_ADMIN_ROUTES=true`,
   `ADMIN_USERNAME` (e.g. `luislazaro`), `ADMIN_PASSWORD_HASH`,
   `ADMIN_SESSION_SECRET`.

Rotating the password later = re-run the hash script and replace the env var.
Rotating `ADMIN_SESSION_SECRET` instantly invalidates every active session.

## 5. Set the environment variables

Vercel → Project → Settings → Environment Variables (Production +, if desired,
Preview) — and locally in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-only secret
ENABLE_ADMIN_ROUTES=true                       # kill switch — admin is dark without it
ADMIN_USERNAME=<username>
ADMIN_PASSWORD_HASH=<output of scripts/hash-admin-password.mjs>
ADMIN_SESSION_SECRET=<output of openssl rand -base64 48>
```

Redeploy. `/admin/login` now shows the username/password form. The dashboard
switches from placeholder stats to live counts, and the catalog becomes
editable. (The admin login itself works even before steps 1–3 of the Supabase
setup — only catalog editing needs the database.)

## 6. (Later, separate decision) point the public site at Supabase

Editing in the admin does **not** change the public site yet — it still serves
the static catalog. When the owner has verified the DB content:

```
CATALOG_DATA_SOURCE=supabase
```

and redeploy. Static listings remain the automatic fallback on any error. See
`docs/runbooks/catalog-management.md`.

## What stays disabled after this runbook

- **Airbnb iCal sync** — needs the four private `AIRBNB_ICAL_*` URLs plus the
  import job (later phase). Status is visible per room in the admin.
- **Website `.ics` export** — needs `BOOKING_ICAL_SECRET`.
- **Email notifications** — needs `BOOKING_ADMIN_EMAIL` + sending integration.
- **Culqi payments** — needs keys + explicit approval (later phase;
  `docs/architecture/culqi-payments.md`).
- **Image upload** — admin edits image metadata only; uploads arrive with
  Supabase Storage in a later phase (bucket + storage policies + upload UI).
