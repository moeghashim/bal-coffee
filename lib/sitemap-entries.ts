// Content lastModified values are the last commit dates of those page files.
// Product URLs use Shopify `updatedAt` when the Storefront API returns it.
// Café drinks, /journal, and the in-person /event pages stay out of the sitemap.
export const SITEMAP_LAST_MODIFIED = "2026-10-31";

export const CONTENT_PATHS = [
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
] as const;

const CONTENT_LAST_MODIFIED: Record<(typeof CONTENT_PATHS)[number], string> = {
  "": "2026-11-24",
  "/products": "2026-11-24",
  "/date-seed-coffee": "2026-11-24",
  "/date-seed-coffee-vs-coffee": "2026-11-24",
  "/how-to-make-date-seed-coffee": "2026-11-24",
  "/caffeine-free-latte": "2026-11-24",
  "/about": "2026-11-24",
  "/faq": "2026-11-24",
  "/shipping": "2026-11-24",
  "/returns": "2026-11-16",
  "/contact": "2026-11-24",
  "/privacy": "2026-11-14",
  "/terms": "2026-11-14",
};

/** Pages that send noindex. None of these belong in the sitemap. */
export const NOINDEX_PATHS = ["/journal", "/cart", "/event", "/api"] as const;

export function contentLastModified(path: string) {
  return (
    CONTENT_LAST_MODIFIED[path as (typeof CONTENT_PATHS)[number]] ??
    SITEMAP_LAST_MODIFIED
  );
}

export function sitemapEntries(
  baseUrl: string,
  products: { slug: string; updatedAt?: string }[],
) {
  const content = CONTENT_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: contentLastModified(path),
  }));
  const productEntries = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt || SITEMAP_LAST_MODIFIED,
  }));
  return [...content, ...productEntries];
}
