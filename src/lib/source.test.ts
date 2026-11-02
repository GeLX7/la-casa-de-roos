/* Marker tests. Run with: npm test */
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { appendMarkers, sourceFromSearch, withSourceTag, storeSource } from "@/lib/source";
import { defaultWhatsappMessage, roomWhatsappMessage, whatsappUrl } from "@/lib/whatsapp";

function fakeSessionStorage() {
  const data = new Map<string, string>();
  (globalThis as { window?: unknown }).window = {
    sessionStorage: {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
    },
  };
}
function textOf(url: string): string {
  return new URL(url).searchParams.get("text") ?? "";
}

describe("(ref: web) marker", () => {
  beforeEach(fakeSessionStorage);

  it("direct traffic (no UTM): message ends with (ref: web) only", () => {
    const out = withSourceTag("Hola Roos");
    assert.equal(out, "Hola Roos\n(ref: web)");
    assert.ok(!out.includes("fuente"));
  });

  it("UTM traffic: keeps (ref: web) and the source separately", () => {
    storeSource(sourceFromSearch("?utm_source=Instagram&utm_campaign=bio")!);
    assert.equal(withSourceTag("Hola Roos"), "Hola Roos\n(ref: web)\n(fuente: instagram/bio)");
  });

  it("UTM without campaign", () => {
    storeSource(sourceFromSearch("?utm_source=tiktok")!);
    assert.equal(withSourceTag("Hola"), "Hola\n(ref: web)\n(fuente: tiktok)");
  });

  it("is idempotent: never duplicates markers", () => {
    storeSource("google/perfil");
    const once = withSourceTag("Hola");
    assert.equal(withSourceTag(once), once);
    assert.equal(withSourceTag(withSourceTag(once)), once);
    assert.equal(once.match(/\(ref: web\)/g)?.length, 1);
    assert.equal(once.match(/\(fuente:/g)?.length, 1);
  });

  it("adds the source later if only (ref: web) is present (static link clicked after UTM)", () => {
    const staticLink = textOf(whatsappUrl(defaultWhatsappMessage));
    assert.ok(staticLink.endsWith("\n(ref: web)"));
    storeSource("instagram/bio");
    assert.equal(withSourceTag(staticLink), `${defaultWhatsappMessage}\n(ref: web)\n(fuente: instagram/bio)`);
  });

  it("keeps form data (dates, suite, guests) untouched", () => {
    const form = [
      "Hola Roos, quisiera solicitar una reserva desde la web:",
      "• Suite: Corazón (Suite)",
      "• Llegada: 2026-11-10",
      "• Salida: 2026-11-12",
      "• Huéspedes: 2",
    ].join("\n");
    storeSource("facebook/pagina");
    const out = withSourceTag(form);
    assert.ok(out.startsWith(form));
    assert.ok(out.endsWith("\n(ref: web)\n(fuente: facebook/pagina)"));
  });

  it("ignores a tampered stored source", () => {
    (globalThis as { window: { sessionStorage: { setItem(k: string, v: string): void } } }).window.sessionStorage.setItem(
      "roos_src",
      "<script>alert(1)</script>",
    );
    assert.equal(withSourceTag("Hola"), "Hola\n(ref: web)");
  });

  it("works when storage is unavailable", () => {
    (globalThis as { window?: unknown }).window = {
      sessionStorage: { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } },
    };
    assert.equal(withSourceTag("Hola"), "Hola\n(ref: web)");
  });

  it("every general link (home, rooms, contact, FAB, footer) carries (ref: web)", () => {
    for (const msg of [defaultWhatsappMessage, roomWhatsappMessage("Corazón")]) {
      const t = textOf(whatsappUrl(msg));
      assert.ok(t.startsWith(msg));
      assert.equal(t.match(/\(ref: web\)/g)?.length, 1);
    }
  });

  it("pure appendMarkers never touches an existing user-typed marker twice", () => {
    assert.equal(appendMarkers("Hola (ref: web)", null), "Hola (ref: web)");
  });
});
