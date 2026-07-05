export default {
  turbopack: {
    root: process.cwd(),
  },
  // Note: Next 15's experimental `ppr` + `useCache` merged into `cacheComponents`
  // in Next 16. The app never used `use cache` directives or Suspense/PPR
  // boundaries, so Cache Components is intentionally left off — pages that read
  // cookies or do no-store Shopify fetches render dynamically, preserving the
  // pre-16 behavior. Revisit alongside Hydrogen's `use cache`/`cacheTag` guidance.
  experimental: {
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};
