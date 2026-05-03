import type { MetadataRoute } from "next";
import { baseUrl } from "lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/products", "/journal", "/privacy", "/terms"];
  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : path === "/products" ? 0.8 : 0.6,
  }));
}
