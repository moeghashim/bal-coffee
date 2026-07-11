import "server-only";
import { handleShopifyRoutes } from "@shopify/hydrogen";
import { cartHandlers } from "./cart-handlers";
import { createSessionManager } from "./session";
import { createPublicStorefront, createRequestContext } from "./storefront";

/**
 * The Hydrogen routing gate, kept behind the commerce boundary so `proxy.ts`
 * never imports `@shopify/hydrogen` directly (HYDROGEN_MIGRATION.md +
 * scripts/check-import-boundary.mjs).
 *
 * As of 8a708a8, `handleShopifyRoutes` is fully request-scoped: it takes a
 * per-request `requestContext`, a request-scoped storefront client, and an
 * app-owned `sessionManager` (see session.ts). It owns `/api/cart`, SFAPI proxy
 * URLs, cart permalinks, and `/checkout`; everything else falls through to Next.
 */
export type CommerceRouteResult = {
  shopifyResponse?: Response;
  forwardedRequestHeaders: Headers;
  applyResponseHeaders: (headers: Headers) => void;
};

export async function handleCommerceRoutes(
  request: Request,
): Promise<CommerceRouteResult> {
  const requestContext = createRequestContext(request);
  const storefrontClient = createPublicStorefront(requestContext);
  const sessionManager = createSessionManager(request);

  const shopifyResponse = await handleShopifyRoutes({
    request,
    requestContext,
    sessionManager,
    storefrontClient,
    handlers: [cartHandlers],
  });

  return {
    shopifyResponse: shopifyResponse ?? undefined,
    forwardedRequestHeaders: requestContext.getForwardedRequestHeaders(),
    applyResponseHeaders: (headers) =>
      requestContext.applyResponseHeaders(headers),
  };
}
