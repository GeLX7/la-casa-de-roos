#!/usr/bin/env node
/**
 * Read-only export of the catalog tables to a timestamped JSON file.
 *
 *   SUPABASE_URL=https://<ref>.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   node scripts/backup-catalog.mjs
 *
 * (NEXT_PUBLIC_SUPABASE_URL is also accepted.) Only GET requests are made —
 * nothing is written to the database. The key is read from the environment and
 * is never printed or saved. Output: backups/local/ (gitignored). The file may
 * contain iCal links (calendar_sources): keep it private, copy it to a private
 * folder, never share or commit it.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const base = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !key) {
  console.error("Faltan SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) y/o SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  process.exit(1);
}

const tables = [
  "rooms",
  "room_features",
  "room_not_included",
  "room_rules",
  "room_images",
  "room_ratings",
  "calendar_sources",
];

const out = { exportedAt: new Date().toISOString(), tables: {} };
for (const t of tables) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${base}/rest/v1/${t}?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) {
      console.error(`Error leyendo ${t}: HTTP ${res.status}`);
      process.exit(1);
    }
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  out.tables[t] = rows;
  console.error(`${t}: ${rows.length} filas`);
}

mkdirSync("backups/local", { recursive: true });
const file = `backups/local/lacasaderoos-catalog-backup-${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z")}.json`;
writeFileSync(file, JSON.stringify(out, null, 2));
console.log(`Listo: ${file}`);
