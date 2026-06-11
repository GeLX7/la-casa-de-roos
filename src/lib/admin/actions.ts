"use server";

/**
 * Server actions behind Admin Mode. Every data action calls requireAdmin()
 * first; writes go through the service-role REST helper (server-side only).
 *
 * UX contract: actions redirect back to the form with ?saved=1 on success or
 * ?error=<short message> on failure — the admin pages render those banners.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, signInWithPassword, signOut } from "@/lib/admin/auth";
import { adminRest } from "@/lib/admin/supabase-admin";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const ITEM_TABLES = {
  feature: "room_features",
  note: "room_not_included",
  rule: "room_rules",
} as const;

type ItemKind = keyof typeof ITEM_TABLES;

const IMAGE_CATEGORIES = [
  "Sala",
  "Habitación",
  "Cocina",
  "Baño",
  "Áreas comunes",
  "Entorno",
  "Detalles",
];

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function checkbox(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function integer(formData: FormData, key: string, fallback: number): number {
  const value = Number.parseInt(text(formData, key), 10);
  return Number.isFinite(value) ? value : fallback;
}

function score(formData: FormData, key: string): number {
  const value = Number.parseFloat(text(formData, key));
  if (!Number.isFinite(value)) return 0;
  return Math.min(5, Math.max(0, Math.round(value * 100) / 100));
}

/** Splits a textarea into paragraphs on blank lines. */
function paragraphs(formData: FormData, key: string): string[] {
  return text(formData, key)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function refreshCatalogPaths(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/catalogo");
  revalidatePath("/habitaciones");
  if (slug) {
    revalidatePath(`/admin/catalogo/${slug}`);
    revalidatePath(`/habitaciones/${slug}`);
  }
}

function backToRoom(slug: string, outcome: { saved: true } | { error: string }): never {
  const param =
    "saved" in outcome ? "saved=1" : `error=${encodeURIComponent(outcome.error)}`;
  redirect(`/admin/catalogo/${slug}?${param}`);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function loginAction(formData: FormData): Promise<void> {
  const email = text(formData, "email");
  const password = formData.get("password");

  if (!email || typeof password !== "string" || !password) {
    redirect("/admin/login?error=missing");
  }

  const result = await signInWithPassword(email, password);
  if (!result.ok) {
    redirect(`/admin/login?error=${result.error}`);
  }
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Rooms
// ---------------------------------------------------------------------------

export async function createRoomAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const slug = text(formData, "slug");
  const name = text(formData, "name");
  const subtitle = text(formData, "subtitle");
  const airbnbUrl = text(formData, "airbnb_url");

  if (!name) redirect("/admin/catalogo/nuevo?error=" + encodeURIComponent("El título es obligatorio."));
  if (!SLUG_PATTERN.test(slug)) {
    redirect(
      "/admin/catalogo/nuevo?error=" +
        encodeURIComponent("Slug inválido: solo minúsculas, números y guiones (ej. suite-nueva)."),
    );
  }

  try {
    await adminRest("rooms", {
      method: "POST",
      body: JSON.stringify({
        slug,
        name,
        subtitle,
        airbnb_url: airbnbUrl || "https://www.airbnb.com.pe/",
        active: false, // new rooms start hidden until content is ready
        capacity: integer(formData, "capacity", 2),
        beds: text(formData, "beds"),
        bath: text(formData, "bath") || "Baño privado",
        sort_order: integer(formData, "sort_order", 99),
      }),
    });
  } catch (error) {
    console.error("createRoomAction", error);
    const message =
      error instanceof Error && error.message.includes("409")
        ? "Ya existe una habitación con ese slug."
        : "No se pudo crear la habitación.";
    redirect("/admin/catalogo/nuevo?error=" + encodeURIComponent(message));
  }

  refreshCatalogPaths(slug);
  redirect(`/admin/catalogo/${slug}?saved=1`);
}

export async function updateRoomBasicAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");
  const roomId = text(formData, "room_id");
  const name = text(formData, "name");
  if (!name) backToRoom(slug, { error: "El título no puede quedar vacío." });

  try {
    await adminRest(`rooms?id=eq.${encodeURIComponent(roomId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        name,
        subtitle: text(formData, "subtitle"),
        airbnb_url: text(formData, "airbnb_url"),
        airbnb_listing_id: text(formData, "airbnb_listing_id") || null,
        price_label: text(formData, "price_label") || "Consultar precio",
        guest_favorite: checkbox(formData, "guest_favorite"),
        active: checkbox(formData, "active"),
      }),
    });
  } catch (error) {
    console.error("updateRoomBasicAction", error);
    backToRoom(slug, { error: "No se pudo guardar la información básica." });
  }

  refreshCatalogPaths(slug);
  backToRoom(slug, { saved: true });
}

export async function updateRoomFactsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");
  const roomId = text(formData, "room_id");
  const capacity = integer(formData, "capacity", 2);
  if (capacity < 1 || capacity > 10) {
    backToRoom(slug, { error: "La capacidad debe estar entre 1 y 10 huéspedes." });
  }

  try {
    await adminRest(`rooms?id=eq.${encodeURIComponent(roomId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        capacity,
        beds: text(formData, "beds"),
        bath: text(formData, "bath"),
        checkin: text(formData, "checkin") || "14:00",
        checkout: text(formData, "checkout") || "11:00",
        quiet_hours: text(formData, "quiet_hours"),
      }),
    });
  } catch (error) {
    console.error("updateRoomFactsAction", error);
    backToRoom(slug, { error: "No se pudieron guardar los datos principales." });
  }

  refreshCatalogPaths(slug);
  backToRoom(slug, { saved: true });
}

export async function updateRoomDescriptionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");
  const roomId = text(formData, "room_id");

  try {
    await adminRest(`rooms?id=eq.${encodeURIComponent(roomId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        description_title: text(formData, "description_title") || "La suite",
        short_description: text(formData, "short_description"),
        long_description: paragraphs(formData, "long_description"),
        seo_title: text(formData, "seo_title") || null,
        seo_description: text(formData, "seo_description") || null,
      }),
    });
  } catch (error) {
    console.error("updateRoomDescriptionAction", error);
    backToRoom(slug, { error: "No se pudo guardar la descripción." });
  }

  refreshCatalogPaths(slug);
  backToRoom(slug, { saved: true });
}

export async function updateRoomRatingsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");
  const roomId = text(formData, "room_id");

  try {
    await adminRest("room_ratings", {
      method: "POST",
      headers: { prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        room_id: roomId,
        rating: score(formData, "rating"),
        review_count: Math.max(0, integer(formData, "review_count", 0)),
        cleanliness: score(formData, "cleanliness"),
        accuracy: score(formData, "accuracy"),
        checkin: score(formData, "checkin"),
        communication: score(formData, "communication"),
        location: score(formData, "location"),
        value: score(formData, "value"),
        checked_at: text(formData, "checked_at") || null,
      }),
    });
  } catch (error) {
    console.error("updateRoomRatingsAction", error);
    backToRoom(slug, { error: "No se pudieron guardar las calificaciones." });
  }

  refreshCatalogPaths(slug);
  backToRoom(slug, { saved: true });
}

export async function toggleRoomActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const roomId = text(formData, "room_id");
  const next = formData.get("next") === "true";

  try {
    await adminRest(`rooms?id=eq.${encodeURIComponent(roomId)}`, {
      method: "PATCH",
      body: JSON.stringify({ active: next }),
    });
  } catch (error) {
    console.error("toggleRoomActiveAction", error);
  }

  refreshCatalogPaths(text(formData, "slug"));
  redirect("/admin/catalogo");
}

/** Soft delete: hides the room everywhere but keeps reservations history. */
export async function softDeleteRoomAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const roomId = text(formData, "room_id");

  try {
    await adminRest(`rooms?id=eq.${encodeURIComponent(roomId)}`, {
      method: "PATCH",
      body: JSON.stringify({ active: false, deleted_at: new Date().toISOString() }),
    });
  } catch (error) {
    console.error("softDeleteRoomAction", error);
  }

  refreshCatalogPaths(text(formData, "slug"));
  redirect("/admin/catalogo");
}

/** Swaps sort_order with the previous/next visible room. */
export async function moveRoomAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const roomId = text(formData, "room_id");
  const direction = formData.get("direction") === "up" ? -1 : 1;

  try {
    const rooms = await adminRest<{ id: string; sort_order: number }[]>(
      "rooms?select=id,sort_order&deleted_at=is.null&order=sort_order.asc,created_at.asc",
    );
    const index = rooms.findIndex((r) => r.id === roomId);
    const neighbor = rooms[index + direction];
    if (index !== -1 && neighbor) {
      // Use list positions, not stored values: seeds may carry duplicates.
      await adminRest(`rooms?id=eq.${encodeURIComponent(roomId)}`, {
        method: "PATCH",
        body: JSON.stringify({ sort_order: index + direction }),
      });
      await adminRest(`rooms?id=eq.${encodeURIComponent(neighbor.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ sort_order: index }),
      });
    }
  } catch (error) {
    console.error("moveRoomAction", error);
  }

  refreshCatalogPaths();
  redirect("/admin/catalogo");
}

// ---------------------------------------------------------------------------
// Repeatable list items (features / not-included notes / house rules)
// ---------------------------------------------------------------------------

function itemTable(formData: FormData): (typeof ITEM_TABLES)[ItemKind] {
  const kind = text(formData, "kind") as ItemKind;
  const table = ITEM_TABLES[kind];
  if (!table) throw new Error(`Unknown item kind: ${kind}`);
  return table;
}

export async function addListItemAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");
  const label = text(formData, "label");
  if (!label) backToRoom(slug, { error: "El texto del elemento no puede quedar vacío." });

  try {
    const table = itemTable(formData);
    await adminRest(table, {
      method: "POST",
      body: JSON.stringify({
        room_id: text(formData, "room_id"),
        label,
        enabled: true,
        sort_order: integer(formData, "sort_order", 99),
        ...(table === "room_features" ? { icon: text(formData, "icon") || "check" } : {}),
      }),
    });
  } catch (error) {
    console.error("addListItemAction", error);
    backToRoom(slug, { error: "No se pudo añadir el elemento." });
  }

  refreshCatalogPaths(slug);
  backToRoom(slug, { saved: true });
}

export async function updateListItemAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");
  const label = text(formData, "label");
  if (!label) backToRoom(slug, { error: "El texto del elemento no puede quedar vacío." });

  try {
    const table = itemTable(formData);
    await adminRest(`${table}?id=eq.${encodeURIComponent(text(formData, "item_id"))}`, {
      method: "PATCH",
      body: JSON.stringify({
        label,
        enabled: checkbox(formData, "enabled"),
        sort_order: integer(formData, "sort_order", 0),
        ...(table === "room_features" ? { icon: text(formData, "icon") || "check" } : {}),
      }),
    });
  } catch (error) {
    console.error("updateListItemAction", error);
    backToRoom(slug, { error: "No se pudo guardar el elemento." });
  }

  refreshCatalogPaths(slug);
  backToRoom(slug, { saved: true });
}

export async function deleteListItemAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");

  try {
    const table = itemTable(formData);
    await adminRest(`${table}?id=eq.${encodeURIComponent(text(formData, "item_id"))}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("deleteListItemAction", error);
    backToRoom(slug, { error: "No se pudo eliminar el elemento." });
  }

  refreshCatalogPaths(slug);
  backToRoom(slug, { saved: true });
}

// ---------------------------------------------------------------------------
// Gallery images (metadata only — upload is a documented later phase)
// ---------------------------------------------------------------------------

export async function addImageAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");
  const src = text(formData, "src");
  const category = text(formData, "category");

  if (!src.startsWith("/images/") && !src.startsWith("https://")) {
    backToRoom(slug, { error: "La ruta debe empezar con /images/ o https://." });
  }
  if (!IMAGE_CATEGORIES.includes(category)) {
    backToRoom(slug, { error: "Categoría de foto inválida." });
  }

  try {
    await adminRest("room_images", {
      method: "POST",
      body: JSON.stringify({
        room_id: text(formData, "room_id"),
        src,
        alt: text(formData, "alt"),
        category,
        active: true,
        sort_order: integer(formData, "sort_order", 99),
      }),
    });
  } catch (error) {
    console.error("addImageAction", error);
    backToRoom(slug, { error: "No se pudo añadir la foto." });
  }

  refreshCatalogPaths(slug);
  backToRoom(slug, { saved: true });
}

export async function updateImageAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");
  const roomId = text(formData, "room_id");
  const imageId = text(formData, "image_id");
  const category = text(formData, "category");
  const isCover = checkbox(formData, "is_cover");

  if (!IMAGE_CATEGORIES.includes(category)) {
    backToRoom(slug, { error: "Categoría de foto inválida." });
  }

  try {
    if (isCover) {
      // Only one cover per room.
      await adminRest(`room_images?room_id=eq.${encodeURIComponent(roomId)}&is_cover=eq.true`, {
        method: "PATCH",
        body: JSON.stringify({ is_cover: false }),
      });
    }
    await adminRest(`room_images?id=eq.${encodeURIComponent(imageId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        alt: text(formData, "alt"),
        category,
        is_cover: isCover,
        active: checkbox(formData, "active"),
        sort_order: integer(formData, "sort_order", 0),
      }),
    });
  } catch (error) {
    console.error("updateImageAction", error);
    backToRoom(slug, { error: "No se pudo guardar la foto." });
  }

  refreshCatalogPaths(slug);
  backToRoom(slug, { saved: true });
}

export async function deleteImageAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");

  try {
    await adminRest(`room_images?id=eq.${encodeURIComponent(text(formData, "image_id"))}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("deleteImageAction", error);
    backToRoom(slug, { error: "No se pudo eliminar la foto." });
  }

  refreshCatalogPaths(slug);
  backToRoom(slug, { saved: true });
}
