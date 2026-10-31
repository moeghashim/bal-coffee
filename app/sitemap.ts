import type { MetadataRoute } from "next";
import { getCoffeeProducts } from "lib/catalog";
import { baseUrl } from "lib/utils";

// Copy on these routes was revised on this date. Product URLs use Shopify
// `updatedAt` when the Storefront API returns it. Café drinks and /journal
// stay out of the sitemap.
const STATIC_LASTMOD = "2026-10-31";

const staticRoutes = [
  "",
  "/products",
  "/about",
  "/faq",
  "/shipping",
  "/returns",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { slug: string; updatedAt?: string }[] = [];
  try {
    products = await getCoffeeProducts();
  } catch {
    products = [];
  }

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: STATIC_LASTMOD,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    ...(product.updatedAt ? { lastModified: product.updatedAt } : {}),
  }));

  return [...staticEntries, ...productEntries];
}
