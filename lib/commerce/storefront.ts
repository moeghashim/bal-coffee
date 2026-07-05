import "server-only";
import { createStorefrontClient, gql } from "@shopify/hydrogen";

/**
 * Internal Hydrogen Storefront client.
 *
 * This module — and everything else under lib/commerce/ — is the ONLY place
 * allowed to import from `@shopify/hydrogen` (enforced by
 * scripts/check-import-boundary.mjs). App and UI code import the stable surface
 * from `lib/commerce` instead, so when the preview API changes, breakage is
 * contained here. See HYDROGEN_MIGRATION.md.
 *
 * Uses the `public` client with Bal's existing public Storefront token (the
 * same token the hand-rolled layer sent as X-Shopify-Storefront-Access-Token).
 * Env is read with a fallback to the legacy SHOPIFY_* names so existing
 * .env.local / Vercel config keeps working during the migration.
 */
const storeDomain =
  process.env.PUBLIC_STORE_DOMAIN ?? process.env.SHOPIFY_STORE_DOMAIN;
const publicStorefrontToken =
  process.env.PUBLIC_STOREFRONT_API_TOKEN ??
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

let client: ReturnType<typeof createStorefrontClient> | undefined;

export function getStorefront() {
  if (!storeDomain || !publicStorefrontToken) {
    throw new Error(
      "Storefront API is not configured. Set PUBLIC_STORE_DOMAIN and " +
        "PUBLIC_STOREFRONT_API_TOKEN (or the legacy SHOPIFY_STORE_DOMAIN / " +
        "SHOPIFY_STOREFRONT_ACCESS_TOKEN).",
    );
  }

  // The public client's config is request-independent, so it can be module-scoped.
  client ??= createStorefrontClient({
    type: "public",
    config: {
      storeDomain,
      publicStorefrontToken,
      i18n: { country: "US", language: "EN" },
    },
  });

  return client;
}

export { gql };
