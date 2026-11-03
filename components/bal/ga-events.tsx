"use client";

import { useEffect, useRef } from "react";
import { useCart, type CartLine } from "lib/commerce/cart-client";
import {
  cartLinesToGaItems,
  gaMeasurementId,
  toGaItem,
  trackEcommerce,
} from "lib/ga";

export function GaViewItem({
  itemId,
  itemName,
  price,
}: {
  itemId?: string;
  itemName: string;
  price?: number;
}) {
  useEffect(() => {
    if (!gaMeasurementId()) return;
    const item = toGaItem({
      itemId,
      itemName,
      price,
      quantity: 1,
    });
    if (!item) return;
    trackEcommerce("view_item", [item]);
  }, [itemId, itemName, price]);

  return null;
}

/** view_cart once the cart page has the server-confirmed cart, not while loading. */
export function GaViewCart() {
  const loading = useCart((state) => state.loading);
  const lines = useCart((state) => state.data.lines.nodes) as CartLine[];
  const fired = useRef(false);

  useEffect(() => {
    if (!gaMeasurementId() || loading || fired.current) return;
    fired.current = true;
    trackEcommerce("view_cart", cartLinesToGaItems(lines));
  }, [loading, lines]);

  return null;
}
