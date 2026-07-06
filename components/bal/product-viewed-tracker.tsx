"use client";

import { useEffect } from "react";
import {
  AnalyticsEvent,
  configureAnalytics,
  getAnalytics,
  type ShopAnalytics,
} from "lib/commerce/analytics";

export type ViewedProduct = {
  id: string;
  title: string;
  price: string;
  vendor: string;
  variantId: string;
  variantTitle: string;
};

/**
 * Publishes PRODUCT_VIEWED once the product route data is resolved. Takes the
 * server-resolved shop so it configures analytics itself — no dependency on the
 * layout tracker's effect order.
 */
export function ProductViewedTracker({
  shop,
  product,
}: {
  shop: ShopAnalytics;
  product: ViewedProduct;
}) {
  useEffect(() => {
    configureAnalytics(shop);
    const analytics = getAnalytics();
    if (!analytics) return;

    analytics.publish(AnalyticsEvent.PRODUCT_VIEWED, {
      url: window.location.href,
      shop,
      products: [
        {
          id: product.id,
          title: product.title,
          price: product.price,
          vendor: product.vendor,
          variantId: product.variantId,
          variantTitle: product.variantTitle,
          quantity: 1,
        },
      ],
    });
  }, [shop, product.id, product.variantId]);

  return null;
}
