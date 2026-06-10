import type { MetadataRoute } from "next";
import { listings } from "@/data/listings";
import { SITE_URL } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
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
