import type { MetadataRoute } from "next";
import { getCoffeeProducts } from "lib/catalog";
import { baseUrl } from "lib/utils";

// Unchanged marketing routes keep STATIC_LASTMOD. Routes revised on
// 2026-11-16 use REVISED_LASTMOD. Product URLs use Shopify
// `updatedAt` when the Storefront API returns it. Café drinks, /journal, and
// the in-person /event pages stay out of the sitemap.
const STATIC_LASTMOD = "2026-10-31";

const staticRoutes = [
  "",
  "/products",
  "/date-seed-coffee",
  "/date-seed-coffee-vs-coffee",
  "/how-to-make-date-seed-coffee",
  "/caffeine-free-latte",
  "/about",
  "/faq",
  "/shipping",
  "/returns",
  "/contact",
  "/privacy",
  "/terms",
];

const REVISED_LASTMOD = "2026-11-16";
const revisedRoutes = new Set([
  "/date-seed-coffee",
  "/date-seed-coffee-vs-coffee",
  "/how-to-make-date-seed-coffee",
  "/caffeine-free-latte",
  "/faq",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { slug: string; updatedAt?: string }[] = [];
  try {
    products = await getCoffeeProducts();
  } catch {
    products = [];
  }

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: revisedRoutes.has(path) ? REVISED_LASTMOD : STATIC_LASTMOD,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    ...(product.updatedAt ? { lastModified: product.updatedAt } : {}),
  }));

  return [...staticEntries, ...productEntries];
}
