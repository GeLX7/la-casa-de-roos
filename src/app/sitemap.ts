import type { MetadataRoute } from "next";
import { getRooms } from "@/lib/catalog/data";
import { SITE_URL } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getRooms();
  const now = new Date();
  const staticRoutes = ["", "/habitaciones", "/arequipa", "/reservar", "/contacto"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );
  const roomRoutes = listings.map((l) => ({
    url: `${SITE_URL}/habitaciones/${l.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
  return [...staticRoutes, ...roomRoutes];
}
