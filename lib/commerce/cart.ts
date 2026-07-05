import "server-only";
import { headers } from "next/headers";
import { cartHandlers } from "./cart-handlers";
import { getStorefront } from "./storefront";

/**
 * Server-side initial cart fetch for first paint. Reads the incoming cart
 * cookie from the request and asks Hydrogen's cart `get` handler for the
 * current cart, so `<CartProvider initialData>` renders the correct count and
 * lines without a post-hydration `/api/cart` round-trip.
 *
 * The public storefront client is request-independent and fully supports cart
 * reads; it stands in for the request-scoped private client the handler types
 * expect (private token + buyer IP is a later config upgrade, not required for
 * cart to work).
 */
type CartGetStorefront = Parameters<
  typeof cartHandlers.get
>[0]["storefrontClient"];

export async function getInitialCart() {
  const cookie = (await headers()).get("cookie") ?? "";
  const request = new Request("https://commerce.local/api/cart", {
    headers: { cookie },
  });

  try {
    const result = await cartHandlers.get({
      storefrontClient: getStorefront() as unknown as CartGetStorefront,
      request,
    });
    return result?.data?.cart ?? null;
  } catch {
    return null;
  }
}

export type InitialCart = Awaited<ReturnType<typeof getInitialCart>>;
