import "server-only";
import {
  createStorefrontRequestContext,
  handleShopifyRoutes,
  type StorefrontRequestContext,
} from "@shopify/hydrogen";
import { cartHandlers } from "./cart-handlers";
import { getStorefront } from "./storefront";

/**
 * The Hydrogen routing gate, kept behind the commerce boundary so `proxy.ts`
 * never imports `@shopify/hydrogen` directly (see HYDROGEN_MIGRATION.md +
 * scripts/check-import-boundary.mjs).
 *
 * `handleShopifyRoutes` owns routes the Next router should never see — the
 * `/api/cart` cart handlers, SFAPI proxy URLs, cart permalinks, `/checkout`.
 * Everything else falls through to Next, and we return the request/response
 * header helpers so the proxy can propagate SFAPI cookies + Server-Timing.
 */
export type CommerceRouteResult = {
  shopifyResponse?: Response;
  forwardedRequestHeaders: Headers;
  applyResponseHeaders: (headers: Headers) => void;
};

// The route handlers are typed for a request-scoped private client. We run on
// the public client (fully cart-capable; private token + buyer IP is a later
// upgrade), so the boundary layer absorbs the type gap here — the one place
// allowed to know Hydrogen's concrete types.
type RouteStorefront = Parameters<
  typeof handleShopifyRoutes
>[0]["storefrontClient"];

export async function handleCommerceRoutes(
  request: Request,
): Promise<CommerceRouteResult> {
  const requestContext: StorefrontRequestContext =
    createStorefrontRequestContext(request);

  const shopifyResponse = await handleShopifyRoutes({
    request,
    storefrontClient: getStorefront() as unknown as RouteStorefront,
    handlers: [cartHandlers],
  });

  return {
    shopifyResponse: shopifyResponse ?? undefined,
    forwardedRequestHeaders: requestContext.getForwardedRequestHeaders(),
    applyResponseHeaders: (headers) =>
      requestContext.applyResponseHeaders(headers),
  };
}
