import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name.toUpperCase(),
    short_name: site.name.toUpperCase(),
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#fdf2e0",
    theme_color: "#fdf2e0",
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
