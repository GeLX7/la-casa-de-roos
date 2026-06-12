#!/usr/bin/env node
/**
 * Generates the salted PBKDF2 hash for the admin password — run this LOCALLY.
 *
 *   node scripts/hash-admin-password.mjs
 *
 * Interactive: prompts for the password twice with hidden input.
 * Piped:       reads one line from stdin (e.g. from a password manager:
 *              `pass show lcr-admin | node scripts/hash-admin-password.mjs`).
 *              Avoid `echo "pw" | …` — it leaves the password in shell history.
 *
 * Only the hash is printed, on stdout (everything else goes to stderr), so it
 * can be piped straight into Vercel without ever appearing on screen:
 *
 *   node scripts/hash-admin-password.mjs | vercel env add ADMIN_PASSWORD_HASH production
 *
 * The plaintext password must never be committed, logged, or pasted into
 * chats/issues. Store only the hash (env var) — it is salted and one-way.
 * Requires Node >= 22.6 (runs the repo's TypeScript helper directly).
 */

import { createPasswordHash } from "../src/lib/admin/credentials.ts";

const MIN_LENGTH = 12;

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

/** Reads a line from a TTY with input hidden (no echo). */
function promptHidden(question) {
  return new Promise((resolve) => {
    process.stderr.write(question);
    const { stdin } = process;
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");

    let value = "";
    const onData = (char) => {
      if (char === "\u0003") {
        // Ctrl+C
        stdin.setRawMode(false);
        process.stderr.write("\n");
        process.exit(130);
      } else if (char === "\r" || char === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stderr.write("\n");
        resolve(value);
      } else if (char === "\u007f" || char === "\b") {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };
    stdin.on("data", onData);
  });
}

function readStdinLine() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      resolve(data.split("\n")[0]?.replace(/\r$/, "") ?? "");
    });
  });
}

let password;
if (process.stdin.isTTY) {
  password = await promptHidden("Contraseña de admin (no se mostrará): ");
  const confirmation = await promptHidden("Repítela para confirmar: ");
  if (password !== confirmation) fail("Las contraseñas no coinciden.");
} else {
  password = await readStdinLine();
}

if (!password || password.length < MIN_LENGTH) {
  fail(`La contraseña debe tener al menos ${MIN_LENGTH} caracteres.`);
}

const hash = createPasswordHash(password);

console.error("\nHash generado (formato pbkdf2$iteraciones$digest$salt$hash).");
console.error("Guárdalo SOLO como variable de entorno ADMIN_PASSWORD_HASH en Vercel");
console.error("(Settings → Environment Variables) o pípalo directo:");
console.error("  node scripts/hash-admin-password.mjs | vercel env add ADMIN_PASSWORD_HASH production");
console.error("Genera además ADMIN_SESSION_SECRET con: openssl rand -base64 48\n");

process.stdout.write(`${hash}\n`);
