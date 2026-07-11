import "server-only";
import {
  createShopifyRequestContext,
  createStorefrontClient,
  gql,
} from "@shopify/hydrogen";

/**
 * Internal Hydrogen Storefront client, behind the commerce boundary (the ONLY
 * place allowed to import `@shopify/hydrogen` — HYDROGEN_MIGRATION.md).
 *
 * As of the 8a708a8 toolkit, clients are request-scoped: `createStorefrontClient`
 * takes a `requestContext` (which now carries `i18n`), so the public config no
 * longer holds `i18n`. For request-independent reads (product list, PDPs, shop
 * analytics) we build a synthetic request context; the request proxy builds a
 * real one per request (see routes.ts).
 *
 * Env reads fall back to the legacy SHOPIFY_* names so existing Vercel config
 * keeps working.
 */
const storeDomain =
  process.env.PUBLIC_STORE_DOMAIN ?? process.env.SHOPIFY_STORE_DOMAIN;
const publicStorefrontToken =
  process.env.PUBLIC_STOREFRONT_API_TOKEN ??
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const i18n = { country: "US", language: "EN" } as const;

function assertConfigured() {
  if (!storeDomain || !publicStorefrontToken) {
    throw new Error(
      "Storefront API is not configured. Set PUBLIC_STORE_DOMAIN and " +
        "PUBLIC_STOREFRONT_API_TOKEN (or the legacy SHOPIFY_STORE_DOMAIN / " +
        "SHOPIFY_STOREFRONT_ACCESS_TOKEN).",
    );
  }
}

export function createRequestContext(request: Request) {
  return createShopifyRequestContext({ request, i18n });
}

export function createPublicStorefront(
  requestContext: ReturnType<typeof createShopifyRequestContext>,
) {
  assertConfigured();
  return createStorefrontClient({
    type: "public",
    requestContext,
    config: { storeDomain: storeDomain!, publicStorefrontToken },
  });
}

// Request-independent client for reads (SSG/build-time). Module-scoped over a
// synthetic request context — reads don't depend on buyer/request state.
let readClient: ReturnType<typeof createPublicStorefront> | undefined;

export function getStorefront() {
  readClient ??= createPublicStorefront(
    createRequestContext(new Request("https://commerce.local/")),
  );
  return readClient;
}

export { gql };
