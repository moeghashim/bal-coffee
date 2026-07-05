import "server-only";
import { createCartServerHandlers } from "@shopify/hydrogen";

/**
 * Hydrogen's default cart server handlers (get/add/update/remove), registered
 * at `/api/cart` by the request proxy via `handleShopifyRoutes`. The client
 * cart store (see cart-client.tsx) talks to this route.
 *
 * REQUIRED SCOPE: the default cart fragment selects `quantityAvailable`, which
 * needs the `unauthenticated_read_product_inventory` Storefront API scope. A
 * custom fragment can't drop it — Hydrogen bundles the default fragment
 * additively — so that scope must stay enabled on the Storefront token (Shopify
 * admin → Headless channel → Storefront API permissions) or every cart mutation
 * 500s. It is enabled on the current token.
 */
export const cartHandlers = createCartServerHandlers();
