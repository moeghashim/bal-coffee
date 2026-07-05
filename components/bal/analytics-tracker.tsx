"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  AnalyticsEvent,
  configureAnalytics,
  getAnalytics,
  type ShopAnalytics,
} from "lib/commerce/analytics";

/**
 * Publishes PAGE_VIEWED on initial load and every client navigation. Keyed by
 * pathname + search so route changes fire a fresh view. Uses useSearchParams,
 * so it must be rendered inside a <Suspense> boundary in the layout.
 */
export function AnalyticsTracker({ shop }: { shop: ShopAnalytics }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageKey = `${pathname}?${searchParams?.toString() ?? ""}`;

  useEffect(() => {
    configureAnalytics(shop);
    const analytics = getAnalytics();
    if (!analytics) return;

    analytics.publish(AnalyticsEvent.PAGE_VIEWED, {
      url: window.location.href,
      shop,
    });
  }, [pageKey, shop]);

  return null;
}
