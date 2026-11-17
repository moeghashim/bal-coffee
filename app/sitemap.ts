import type { MetadataRoute } from "next";
import { getCoffeeProducts } from "lib/catalog";
import { sitemapEntries } from "lib/sitemap-entries";
import { baseUrl } from "lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { slug: string; updatedAt?: string }[] = [];
  try {
    products = await getCoffeeProducts();
  } catch {
    products = [];
  }

  return sitemapEntries(baseUrl, products);
}
