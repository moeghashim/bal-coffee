import "server-only";
import { createCartServerHandlers } from "@shopify/hydrogen";

/**
 * Hydrogen's default cart server handlers (get/add/update/remove), registered
 * at `/api/cart` by the request proxy via `handleShopifyRoutes`. The client
 * cart store (see cart-client.tsx) talks to this route.
 *
 * Uses Hydrogen's default cart fragment. If the cart UI needs extra fields,
 * pass `{ fragment }` here and the derived React bindings pick up the wider
 * type automatically.
 */
export const cartHandlers = createCartServerHandlers();
