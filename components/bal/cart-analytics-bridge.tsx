"use client";

import { useEffect } from "react";
import { getAnalytics, toAnalyticsCart } from "lib/commerce/analytics";
import { useCart } from "lib/commerce/cart-client";

/**
 * Feeds confirmed cart state to the analytics bus so it can emit cart-delta
 * events (product_added_to_cart / product_removed_from_cart / cart_updated).
 * Mounted once under <CartProvider> in the root layout, so add-to-cart on any
 * page — not just /cart — produces deltas. Keyed on updatedAt: fires when the
 * server confirms a change, never on optimistic churn.
 */
export function CartAnalyticsBridge() {
  const data = useCart((state) => state.data) as {
    updatedAt?: string | null;
  } & Record<string, unknown>;
  const updatedAt = data?.updatedAt ?? null;

  useEffect(() => {
    const analytics = getAnalytics();
    analytics?.updateCart(toAnalyticsCart(data));
    // Fire only when the server-confirmed cart changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedAt]);

  return null;
}
