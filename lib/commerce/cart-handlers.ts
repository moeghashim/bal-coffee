import "server-only";
import { createCartServerHandlers, gql } from "@shopify/hydrogen";

/**
 * Hydrogen's default cart server handlers (get/add/update/remove), registered
 * at `/api/cart` by the request proxy via `handleShopifyRoutes`. The client
 * cart store (see cart-client.tsx) talks to this route.
 *
 * The custom fragment is *additive* (Hydrogen bundles the default fragment
 * alongside it): it adds `updatedAt`, which the analytics bus uses to detect
 * confirmed cart changes for `updateCart()` cart-delta events.
 *
 * REQUIRED SCOPE: the default cart fragment selects `quantityAvailable`, which
 * needs the `unauthenticated_read_product_inventory` Storefront API scope. That
 * can't be removed via a custom fragment (the default is bundled additively), so
 * the scope must stay enabled on the Storefront token (Shopify admin → Headless
 * channel → Storefront API permissions) or every cart mutation 500s. It is
 * enabled on the current token.
 */
const cartFragment = gql(`
  fragment CartFragment on Cart {
    updatedAt
  }
`);

export const cartHandlers = createCartServerHandlers({
  fragment: cartFragment,
});
